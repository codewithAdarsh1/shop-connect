import { createClient } from '@supabase/supabase-js'
import { env } from '@/env.mjs'

// Create a Supabase admin client with the service role key to bypass RLS.
// This is strictly for backend operations and mapping public tokens.
export const createAdminClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to anon key for admin client, which may fail RLS policies.")
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
