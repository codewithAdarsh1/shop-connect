import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to dashboard (or wherever 'next' param points)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong — redirect to sign-in with error
  return NextResponse.redirect(`${origin}/sign-in?message=Could+not+authenticate+user.+Please+try+again.`)
}
