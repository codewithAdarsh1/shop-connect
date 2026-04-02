"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, MessageSquare, Settings,
  Store, TerminalSquare, Code2, ChevronRight, Sparkles, Book
} from "lucide-react"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
  { name: "Documentation", href: "/dashboard/docs", icon: Book },
  { name: "Connect Store", href: "/dashboard/connect-store", icon: Store },
  { name: "Test Agent", href: "/dashboard/test", icon: TerminalSquare },
  { name: "Embed Script", href: "/dashboard/widget", icon: Code2 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 border-r border-white/[0.06] bg-[#06060d] h-full flex flex-col sticky top-0 left-0 z-40 hidden md:flex shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[#6366f1] flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="font-bold text-white text-[10px] tracking-wider">SM</span>
          </div>
          <span className="text-sm font-semibold text-white/80 tracking-tight">ShopMind</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navigation.map(item => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link key={item.name} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                isActive
                  ? "bg-[#6366f1]/12 text-white border border-[#6366f1]/20"
                  : "text-white/35 hover:text-white/70 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#818cf8]" : ""}`} />
              <span className="font-medium">{item.name}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#818cf8]/50" />}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade card */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="relative rounded-2xl overflow-hidden p-4 border border-[#6366f1]/20"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 100%)" }}
        >
          <div className="absolute top-3 right-3">
            <Sparkles className="w-4 h-4 text-[#818cf8]/50" />
          </div>
          <p className="text-xs font-semibold text-white/70 mb-1">Scale your agent</p>
          <p className="text-[11px] text-white/35 mb-3 leading-relaxed">Unlock unlimited conversations & multi-store support.</p>
          <Link href="/sign-up"
            className="block w-full text-center py-2 text-xs font-bold text-white bg-[#6366f1] rounded-xl hover:bg-[#5557e0] transition-colors">
            Upgrade Plan
          </Link>
        </div>
      </div>
    </aside>
  )
}
