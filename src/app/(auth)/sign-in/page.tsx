import { login, signup, signInWithGoogle } from './actions'
import { Bot, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

// Google Icon SVG
function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

interface Props {
  searchParams: Promise<{ message?: string; tab?: string }>
}

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams
  const message = params?.message
  const isSignUp = params?.tab === 'signup'

  return (
    <div className="min-h-screen bg-[#04040a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6366f1]/15 blur-[120px] rounded-full animate-aurora-shift" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#c084fc]/15 blur-[80px] rounded-full animate-aurora-shift" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 relative z-10 group">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold tracking-tight group-hover:text-white/80 transition-colors">ShopMind</span>
      </Link>

      <div className="w-full max-w-sm relative z-10">
        {/* Card */}
        <div className="bg-white/[0.03] rounded-[2rem] p-8 border border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          
          {/* Tab switcher */}
          <div className="flex bg-white/[0.04] rounded-xl p-1 mb-8 border border-white/[0.06]">
            <Link 
              href="/sign-in" 
              className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all ${!isSignUp ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
            >
              Sign In
            </Link>
            <Link 
              href="/sign-in?tab=signup" 
              className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-all ${isSignUp ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
            >
              Create Account
            </Link>
          </div>

          {/* Google OAuth */}
          <form>
            <button
              formAction={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white text-[#1a1a1a] py-3.5 px-4 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-all shadow-sm mb-6"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-white/25 font-medium">OR</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Email / Password form */}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider pl-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#6366f1]/60 focus:bg-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-white/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">Password</label>
                {!isSignUp && (
                  <span className="text-[11px] text-[#6366f1] hover:text-[#818cf8] cursor-pointer transition-colors">Forgot password?</span>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#6366f1]/60 focus:bg-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-white/20"
              />
            </div>

            <div className="pt-1 flex flex-col gap-3">
              {isSignUp ? (
                <button
                  formAction={signup}
                  className="w-full rounded-xl bg-[#6366f1] hover:bg-[#5558e0] text-white py-3.5 px-4 font-semibold text-sm transition-all flex justify-center items-center gap-2 group shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                >
                  Create Account <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
                </button>
              ) : (
                <button
                  formAction={login}
                  className="w-full rounded-xl bg-white hover:bg-zinc-100 text-black py-3.5 px-4 font-semibold text-sm transition-all flex justify-center items-center gap-2 group"
                >
                  Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

            {message && (
              <div className={`mt-2 p-3.5 rounded-xl text-xs text-center font-medium ${
                message.includes('Check your email') || message.includes('confirm')
                  ? 'bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399]'
                  : 'bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#f87171]'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>

        <p className="mt-6 text-[11px] text-white/20 text-center leading-relaxed px-4">
          By continuing, you agree to ShopMind&apos;s{' '}
          <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
          {' '}&amp;{' '}
          <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
