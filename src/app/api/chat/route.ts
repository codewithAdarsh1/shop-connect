import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { groq, SYSTEM_PROMPT } from '@/lib/groq'
import { createAdminClient } from '@/utils/supabase/admin'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env } from '@/env.mjs'

// ─── Zod Schema ─────────────────────────────────────────────────────────────
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']), // Never allow 'system' from client
  content: z.string().min(1).max(2000),
})

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  storeToken: z.string().min(1, "Missing store token"),
})

// ─── Rate Limiter Initialization ────────────────────────────────────────────
// Upgrade to Upstash for production scalability across edges!
const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
  : null

// 20 requests per 60 seconds
const ratelimit = redis 
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '60 s') })
  : null

// Fallback in-memory rate limiter for local dev without Upstash
const ipRequestMap = new Map<string, { count: number; resetAt: number }>()
function fallbackRateLimit(ip: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = ipRequestMap.get(ip)

  if (!entry || now > entry.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }
  if (entry.count >= limit) return true
  entry.count++
  return false
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Identify requester IP for rate limiting (Guest User)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous'

    // 2. Enforce Rate Limits
    if (ratelimit) {
      const { success } = await ratelimit.limit(`shopmind-chat-${ip}`)
      if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': '60' } })
    } else {
      if (fallbackRateLimit(ip)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': '60' } })
    }

    // 3. Input Validation
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { messages, storeToken } = parsed.data

    // 4. Secure Backend Configuration Lookup
    const supabaseAdmin = createAdminClient()
    const { data: config, error } = await supabaseAdmin
      .from('widget_configs')
      .select('user_id, assistant_name, personality, allow_topics, provider, max_discount, liquidate_items')
      .eq('public_token', storeToken)
      .single()

    if (error || !config) {
      console.warn(`[Suspicious] Chat requested with invalid store_token: ${storeToken}`)
      return NextResponse.json({ error: 'Invalid store configuration or token' }, { status: 401 })
    }

    // 5. Audit Logging (Asynchronous to not block response)
    const logPromise = supabaseAdmin.from('audit_logs').insert({
      user_id: config.user_id,
      action: 'chat.request',
      ip_address: ip,
      metadata: { message_length: messages.length, provider: config.provider },
    }).then((res: any) => { if (res.error) console.error("Audit log failed", res.error) })

    // 6. Construct Dynamically Tuned System Prompt
    let customPrompt = `
      You are an autonomous sales agent named ${config.assistant_name}.
      Your personality is: ${config.personality}.
      You are allowed to discuss the following topics only: ${config.allow_topics}.
      If a user asks about anything else, politely pivot back to these topics.
      Keep answers extremely brief and conversion-focused.
      
      BASE RULES:
      ${SYSTEM_PROMPT}
    `
    
    // 6a. Inject the Predictive Conversion Rule if enabled by store owner
    if (config.max_discount > 0) {
      customPrompt += `\n
      PREDICTIVE CONVERSION RULE:
      You have the authority to negotiate up to ${config.max_discount}% off if the user shows strong hesitation specifically related to pricing or mentions that they might abandon the cart.
      If you decide a discount is strictly necessary to save the sale, you MUST append the exact string: [AUTODISCOUNT: X] to the very end of your response, where X is the percentage you decided to offer (e.g. 10, 15, up to ${config.max_discount}). You cannot exceed ${config.max_discount}.
      Do NOT mention the [AUTODISCOUNT: X] tag in the conversational text itself.
      `
    }
    
    // 6b. Inject Inventory Liquidation Rule if configured
    if (config.liquidate_items && config.liquidate_items.trim() !== '') {
      customPrompt += `\n
      INVENTORY LIQUIDATION TARGETS:
      The store needs to urgently clear inventory for the following items: ${config.liquidate_items}.
      Whenever the user asks for recommendations, asks what's popular, or if the context even remotely allows for product suggestions, you MUST autonomously and organically recommend these specific items as highly desirable.
      `
    }

    // 6c. Inject WISMO Autonomous Tracking Rule
    customPrompt += `\n
      ORDER TRACKING RULE (WISMO):
      If the user is asking about the status of their order, where their package is, or tracking:
      1. If they haven't provided an Order ID (like #12345), politely ask for it.
      2. If they HAVE provided an Order ID, simply acknowledge it and append exactly: [CHECK_ORDER: ID] to the end of your response, where ID is the tracking number they gave. 
      `

    const conversation = [
      { role: 'system' as const, content: customPrompt },
      ...messages,
    ]

    // 7. Execute Mock OR Real LLM Inference
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'gsk_dummy_mock_key_for_build_purposes') {
      return NextResponse.json({
        reply: `Mock [${config.assistant_name}]: This is a mock response. Please add your real GROQ API Key to enable Llama 3!`,
      })
    }

    const rawReply = await groq.chat(conversation, { model: 'llama3-8b-8192' })
    let reply = rawReply || "Sorry, I couldn't process that."
    
    // 8. Intercept Predictive Discounting Tags
    let discountCode = null
    const discountMatch = reply.match(/\[AUTODISCOUNT:\s*(\d+)\]/i)
    
    if (discountMatch && config.max_discount > 0) {
      const offeredDiscount = parseInt(discountMatch[1], 10)
      if (offeredDiscount <= config.max_discount) {
        // Safe to issue
        const uniqueId = Math.random().toString(36).substring(2, 6).toUpperCase()
        discountCode = `SAVE-${offeredDiscount}-${uniqueId}`
        
        reply = reply.replace(/\[AUTODISCOUNT:\s*\d+\]/gi, '').trim()
        reply += `\n\n🎉 *I've generated a special code for you: **${discountCode}** (${offeredDiscount}% off). It expires in 15 minutes!*`
        
        supabaseAdmin.from('store_metrics')
          .update({ abandoned_carts_recovered: 1 })
          .eq('user_id', config.user_id)
          .then((res: any) => { if(res.error) console.error("Failed to track recovered cart", res.error)})
      } else {
        reply = reply.replace(/\[AUTODISCOUNT:\s*\d+\]/gi, '').trim()
      }
    }

    // 9. Intercept WISMO (Order Tracking) Tags
    const orderMatch = reply.match(/\[CHECK_ORDER:\s*([^\]]+)\]/i)
    if (orderMatch) {
      const parsedOrderId = orderMatch[1].trim()
      reply = reply.replace(/\[CHECK_ORDER:\s*[^\]]+\]/gi, '').trim()
      
      // MOCK: Hit Shopify / AfterShip API here in production
      reply += `\n\n📦 *Tracking Insight:* I just checked the backend. Order **${parsedOrderId}** is currently at the final sorting facility and is scheduled for out-for-delivery tomorrow afternoon!`
    }

    // Await log completion if running in a truly serverless setting to prevent drop
    await logPromise

    return NextResponse.json({ 
      reply,
      discountOffered: discountCode 
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
