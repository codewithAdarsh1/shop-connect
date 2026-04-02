import { Bell, Search } from "lucide-react"
import { SignOutButton } from "./SignOutButton"

export function Navbar() {
  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#06060d]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-full max-w-sm hidden md:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
        <input
          type="text"
          placeholder="Search conversations, stores..."
          className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-sm text-white/60 placeholder:text-white/20 focus:outline-none focus:border-[#6366f1]/40 focus:bg-white/[0.06] transition-all"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Agent status pill */}
        <div className="hidden sm:flex items-center gap-2 glass border border-white/[0.06] px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-dot-pulse" />
          <span className="text-xs font-medium text-white/50">Agent live</span>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors">
          <Bell className="w-4 h-4 text-white/30" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#6366f1] rounded-full" />
        </button>

        <SignOutButton />

        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center cursor-pointer">
          <span className="text-white text-xs font-bold">M</span>
        </div>
      </div>
    </header>
  )
}
