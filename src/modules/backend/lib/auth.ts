// Supabase Auth helper — Clerk has been fully removed from this project.
// Authentication is handled by Supabase Auth (email/password + Google OAuth).
// See: src/modules/database/supabase/server.ts for server-side client
// See: src/app/(auth)/sign-in/actions.ts for auth server actions

export const AUTH_PROVIDER = 'supabase' as const
