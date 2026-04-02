import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { groq, SYSTEM_PROMPT } from '@/lib/groq'
import { createClient } from '@/utils/supabase/server'

// ─── Zod Schema ─────────────────────────────────────────────────────────────
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']), // Never allow 'system' from client
  content: z.string().min(1).max(2000),
})

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
})

// ─── Simple in-memory rate limiter (upgrade to Upstash for production) ──────
const ipRequestMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string, limit = 20, windowMs = 60_000): boolean {
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
    // 1. Auth gate — must be a signed-in user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Rate limiting per user ID
    if (isRateLimited(user.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before sending more messages.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    // 3. Input validation
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { messages } = parsed.data

    // 4. Build conversation, sanitizing any injected system roles
    const conversation = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages,
    ]

    // 5. Mock or real LLM call
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'gsk_dummy_mock_key_for_build_purposes') {
      return NextResponse.json({
        reply: 'This is a mock response — add a valid GROQ_API_KEY to enable real AI responses.',
      })
    }

    const reply = await groq.chat(conversation, { model: 'llama3-8b-8192' })
    return NextResponse.json({ reply: reply || "Sorry, I couldn't process that." })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}
