"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, RefreshCcw, TrendingUp, ShoppingBag, ArrowUpRight, Zap, CheckCircle2, Circle, TerminalSquare, Code2, Store } from "lucide-react"
import Link from "next/link"
import { getDashboardMetrics } from "./actions"

const chartHeightsMock = [28, 42, 35, 58, 52, 74, 68, 81, 75, 90, 85, 100]

const checklist = [
  { label: "Connect your Shopify store", done: false, href: "/dashboard/connect-store" },
  { label: "Test your AI agent", done: true, href: "/dashboard/test" },
  { label: "Get your embed script", done: true, href: "/dashboard/widget" },
  { label: "Go live on your store", done: false, href: "#" },
]

const quickActions = [
  { label: "Test Agent", desc: "Live conversation simulator", href: "/dashboard/test", icon: TerminalSquare, color: "#818cf8" },
  { label: "Get Embed Script", desc: "Go live in 60 seconds", href: "/dashboard/widget", icon: Code2, color: "#c084fc" },
  { label: "Connect Store", desc: "Shopify or WooCommerce", href: "/dashboard/connect-store", icon: Store, color: "#34d399" },
]

const cardBase = "rounded-2xl border border-white/[0.06] bg-[#08080f]"

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    revenue: 0,
    activeSessions: 0,
    abandonedCartsRecovered: 0,
    totalConversations: 0
  })

  useEffect(() => {
    getDashboardMetrics().then(res => {
      if (res) setData(res)
      setLoading(false)
    })
  }, [])

  const metrics = [
    { title: "Revenue Generated", value: `$${data.revenue.toLocaleString()}`, change: "+0.0%", icon: DollarSign, color: "#34d399", glow: "rgba(52,211,153,0.15)" },
    { title: "Recovered Carts", value: data.abandonedCartsRecovered.toString(), change: "+0.0%", icon: RefreshCcw, color: "#818cf8", glow: "rgba(129,140,248,0.15)" },
    { title: "Total Conversations", value: data.totalConversations.toLocaleString(), change: "+0.0%", icon: TrendingUp, color: "#c084fc", glow: "rgba(192,132,252,0.15)" },
    { title: "Active Sessions", value: data.activeSessions.toLocaleString(), change: "+0", icon: Zap, color: "#60a5fa", glow: "rgba(96,165,250,0.15)" },
  ]

  const done = checklist.filter(s => s.done).length
  const pct = (done / checklist.length) * 100

  // If there's 0 revenue, chart should be virtually empty. Let's create an empty array.
  const chartHeights = data.revenue > 0 ? chartHeightsMock : Array(12).fill(2)

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-white/35 mt-1">Real-time metrics from your AI agent.</p>
        </div>
        {data.totalConversations > 0 ? (
          <div className="flex items-center gap-2 border border-[#34d399]/20 bg-[#34d399]/[0.06] px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-dot-pulse" />
            <span className="text-xs font-semibold text-[#34d399]">Agent is live</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="text-xs font-semibold text-white/40">Waiting for data...</span>
          </div>
        )}
      </div>

      {/* Setup checklist */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className={`${cardBase} p-5`}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white/70">Setup checklist</p>
          <span className="text-xs font-mono text-white/30">{done}/{checklist.length} done</span>
        </div>
        <div className="w-full bg-white/[0.06] h-1 rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-[#6366f1] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {checklist.map((step, i) => (
            <Link key={i} href={step.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                step.done ? "border-[#6366f1]/25 bg-[#6366f1]/[0.07] text-[#818cf8]" : "border-white/[0.05] hover:border-white/10 text-white/35 hover:text-white/60"
              }`}
            >
              {step.done
                ? <CheckCircle2 className="w-4 h-4 shrink-0 text-[#818cf8]" />
                : <Circle className="w-4 h-4 shrink-0" />
              }
              <span className="text-xs font-medium">{step.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
            className={`${cardBase} p-5 relative overflow-hidden group transition-colors hover:border-white/10`}
          >
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: m.glow }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg" style={{ background: m.glow }}>
                  <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                </div>
                <span className="text-xs text-white/35">{m.title}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {loading ? "--" : m.value}
                </span>
                {data.revenue > 0 && (
                  <span className="text-xs font-semibold flex items-center gap-0.5 text-[#34d399] bg-[#34d399]/10 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-2.5 h-2.5" />{m.change}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Wins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          className={`${cardBase} p-6 col-span-2 h-[340px] flex flex-col`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white/80">Cumulative AI Revenue</h3>
              <p className="text-xs text-white/25 mt-0.5">Wait 24h for initial analytics processing</p>
            </div>
          </div>
          <div className="flex-1 relative">
            {/* Y labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-white/15 font-mono">
              {data.revenue > 0 ? ["$42K","$32K","$21K","$11K",""].map((l, i) => <span key={i}>{l}</span>) : ["$0","$0","$0","$0",""].map((l, i) => <span key={i}>{l}</span>)}
            </div>
            {/* Bars */}
            <div className="absolute left-8 right-0 top-0 bottom-6 flex items-end gap-1.5">
              {chartHeights.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group/bar relative">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#08080f] border border-white/10 rounded px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10">
                    ${data.revenue > 0 ? Math.round(h * 425) : 0}
                  </div>
                  <motion.div
                    className="w-full rounded-t-sm relative"
                    style={{
                      background: `linear-gradient(to top, rgba(99,102,241,0.1), rgba(129,140,248,${0.1 + h/200}))`,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.7, delay: 0.5 + i * 0.05, ease: "backOut" }}
                  >
                    <div className="absolute top-0 inset-x-0 h-px rounded-t"
                      style={{ background: "#818cf8" }} />
                  </motion.div>
                </div>
              ))}
            </div>
            {/* X labels */}
            <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[9px] text-white/15 font-mono">
              {["Mon","","","Wed","","","Fri","","","Sun","",""].map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </div>
        </motion.div>

        {/* AI Wins feed */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className={`${cardBase} p-6 flex flex-col`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white/80">Recent AI Wins</h3>
              <p className="text-xs text-white/25 mt-0.5">Live revenue feed</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
             <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center mb-3">
               <Zap className="w-5 h-5 text-white/20" />
             </div>
             <p className="text-sm font-semibold text-white/40">No activity yet</p>
             <p className="text-[11px] text-white/30 mt-1">Embed the widget to see live events</p>
          </div>
          <Link href="/dashboard/test"
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 border border-white/[0.06] rounded-xl text-xs font-medium text-white/40 hover:text-[#818cf8] hover:border-[#6366f1]/30 transition-all">
            <TerminalSquare className="w-3.5 h-3.5" /> Test agent live
          </Link>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold text-white/20 uppercase tracking-[0.12em] mb-3">Quick actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((a, i) => (
            <Link key={i} href={a.href}
              className={`${cardBase} flex items-center gap-3 p-4 hover:border-white/10 transition-all group`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{ background: a.color + "15" }}>
                <a.icon className="w-4 h-4" style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/75">{a.label}</p>
                <p className="text-xs text-white/25 truncate">{a.desc}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
