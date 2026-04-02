"use client"

import { Book, Code, Terminal, Play, Zap, Shield, Sparkles } from "lucide-react"

const docs = [
  {
    title: "Step 1: Get Your Widget Code",
    icon: Code,
    content: "Go to the 'Embed Script' tab to generate your unique JavaScript snippet. This snippet is securely attached to your account and store ID."
  },
  {
    title: "Step 2: Add to Shopify / WooCommerce",
    icon: Play,
    content: "Paste the snippet right before the closing `</body>` tag of your main theme file (usually `theme.liquid` in Shopify or `footer.php` in Wordpress/WooCommerce)."
  },
  {
    title: "Step 3: Customize The AI",
    icon: Sparkles,
    content: "Use the dashboard to define your AI's personality, greeting messages, and color scheme. Changes update in real-time on your store—no code changes required once the widget is installed."
  },
  {
    title: "Analytics & Tracking",
    icon: Zap,
    content: "Once installed, the AI agent automatically starts tracking resolved inquiries and recovered carts. Go to 'Overview' to view your metrics."
  }
]

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center mb-6">
          <Book className="w-6 h-6 text-[#818cf8]" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Documentation</h1>
        <p className="text-white/40 max-w-xl">
          Everything you need to integrate, customize, and maximize the potential of your ShopMind AI agent.
        </p>
      </div>

      <div className="grid gap-6">
        {docs.map((doc, i) => (
          <div key={i} className="group relative rounded-2xl border border-white/[0.06] bg-[#08080f] p-6 hover:border-white/10 transition-all">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex flex-shrink-0 items-center justify-center mt-1">
                <doc.icon className="w-4 h-4 text-white/60 group-hover:text-[#818cf8] transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">{doc.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{doc.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#34d399]/20 bg-[#34d399]/[0.02] p-8 mt-12 text-center">
        <Shield className="w-8 h-8 text-[#34d399] mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white/90 mb-2">Need direct help?</h3>
        <p className="text-sm text-white/40 max-w-md mx-auto mb-6">
          Our engineering team is ready to help you install the widget on your custom storefront.
        </p>
        <button className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-black font-semibold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Contact Engineering
        </button>
      </div>
    </div>
  )
}
