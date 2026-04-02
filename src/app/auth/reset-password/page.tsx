import { updatePassword } from './actions'
import { KeyRound, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ message?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams
  const message = params?.message

  return (
    <div className="min-h-screen bg-[#04040a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6366f1]/15 blur-[120px] rounded-full animate-aurora-shift" />
      </div>

      <Link href="/" className="flex items-center gap-2 mb-8 relative z-10">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center">
          <KeyRound className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold tracking-tight">ShopMind</span>
      </Link>

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-white/[0.03] rounded-[2rem] p-8 border border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Set new password</h1>
            <p className="text-sm text-white/40 mt-2">Choose a strong password for your account</p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider pl-1">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#6366f1]/60 focus:bg-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-white/20"
              />
            </div>

            <button
              formAction={updatePassword}
              className="w-full rounded-xl bg-white hover:bg-zinc-100 text-black py-3.5 px-4 font-semibold text-sm transition-all flex justify-center items-center gap-2 group mt-2"
            >
              Update Password <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {message && (
              <div className={`p-3.5 rounded-xl text-xs text-center font-medium ${
                message.includes('successfully')
                  ? 'bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399]'
                  : 'bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#f87171]'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
