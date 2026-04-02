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
    // Bypass RLS using Admin Client to look up the public_token mapping
    const supabaseAdmin = createAdminClient()
    const { data: config, error } = await supabaseAdmin
      .from('widget_configs')
      .select('user_id, assistant_name, personality, allow_topics, provider')
      .eq('public_token', storeToken)
      .single()

    if (error || !config) {
      console.warn(`[Suspicious] Chat requested with invalid store_token: ${storeToken}`)
      return NextResponse.json({ error: 'Invalid store configuration or token' }, { status: 401 })
    }

    // 5. Audit Logging (Asynchronous to not block response)
    const logPromise = supabaseAdmin.from('audit_logs').insert({
      user_id: config.user_id, // Tie the action back to the merchant's quota
      action: 'chat.request',
      ip_address: ip,
      metadata: { message_length: messages.length, provider: config.provider },
    }).then((res: any) => { if(res.error) console.error("Audit log failed", res.error) })

    // 6. Construct Dynamically Tuned System Prompt
    const customPrompt = `
      You are an autonomous sales agent named ${config.assistant_name}.
      Your personality is: ${config.personality}.
      You are allowed to discuss the following topics only: ${config.allow_topics}.
      If a user asks about anything else, politely pivot back to these topics.
      Keep answers extremely brief and conversion-focused.
      
      BASE RULES:
      ${SYSTEM_PROMPT}
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

    // (In the future, dispatch to config.provider based on multi-ai-sdk dynamically)
    const reply = await groq.chat(conversation, { model: 'llama3-8b-8192' })
    
    // Await log completion if running in a truly serverless setting to prevent drop
    await logPromise

    return NextResponse.json({ reply: reply || "Sorry, I couldn't process that." })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
