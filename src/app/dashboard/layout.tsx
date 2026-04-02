import { Navbar } from "@/components/Dashboard/Navbar"
import { Sidebar } from "@/components/Dashboard/Sidebar"
import { ReactNode } from "react"

// Force all dashboard pages to be server-rendered on demand (not statically prerendered)
// This is required so Supabase auth cookies can be read on each request
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#04040a] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#04040a]">
          {children}
        </main>
      </div>
    </div>
  )
}
