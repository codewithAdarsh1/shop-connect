"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, Zap, Code2, Eye, Settings2, ArrowRight, Bot, Sparkles, Send } from "lucide-react"
import Link from "next/link"
import type { WidgetConfig } from "@/types/widget"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <button onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/70 transition-all"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied
          ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 text-[#34d399]"><Check className="w-3.5 h-3.5" /> Copied!</motion.div>
          : <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5"><Copy className="w-3.5 h-3.5" /> Copy script</motion.div>
        }
      </AnimatePresence>
    </button>
  )
}

const personalities = [
  { value: "friendly and helpful", label: "Friendly", desc: "Warm, casual, approachable" },
  { value: "professional and concise", label: "Professional", desc: "Formal, polished, efficient" },
  { value: "urgent and persuasive", label: "Urgent", desc: "FOMO-driven closer" },
  { value: "luxurious and exclusive", label: "Luxury", desc: "Premium feel, exclusivity" },
]

const themes = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#10b981", label: "Emerald" },
  { value: "#f59e0b", label: "Gold" },
  { value: "#ef4444", label: "Red" },
  { value: "#ec4899", label: "Pink" },
  { value: "#06b6d4", label: "Cyan" },
]

interface Props {
  initialConfig: WidgetConfig
}

export function WidgetForm({ initialConfig }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [config, setConfig] = useState<WidgetConfig>(initialConfig)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { saveWidgetConfig } = await import('./actions')
      const res = await saveWidgetConfig(config)
      
      // Dynamic import of Sonner toast to avoid SSR issues
      const { toast } = await import('sonner')
      
      if (res?.error) toast.error(res.error)
      else toast.success('Configuration saved to database!')
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  const generateScript = () => {
    const topics = config.allowTopics.split(",").map(s => `"${s.trim()}"`).join(", ")
    return `<script type="module">
  import { embedChat } from "https://cdn.jsdelivr.net/npm/multi-ai-sdk@latest/dist/index.min.js";

  embedChat({
    storeToken: "${config.publicToken || 'SAVE_TO_GENERATE_TOKEN'}",
    endpoint: "https://your-domain.com/api/chat",

    assistantName: "${config.assistantName}",
    welcomeMessage: "${config.welcomeMessage}",

    behavior: {
      personality: "${config.personality}",
      allowTopics: [${topics}],
      rules: [
        "Suggest complementary products when relevant",
        "If the user shows hesitation on pricing, negotiate up to ${config.maxDiscount}% off"
      ],
      replyLength: "short"
    },

    theme: {
      primaryColor: "${config.primaryColor}",
      darkMode: true,
    },
    controls: {
      allowCopy: true,
    }
  });
</script>`.trim()
  }

  const script = generateScript()

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Widget Script Generator</h1>
          <p className="text-sm text-white/40 mt-1">Configure your AI agent, then paste the script into your store.</p>
        </div>
        <div className="flex items-center gap-2 border border-[#34d399]/20 bg-[#34d399]/[0.06] px-4 py-2 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#34d399] animate-dot-pulse" />
          <span className="text-xs font-semibold text-[#34d399] text-nowrap">60-second setup</span>
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Settings2, label: "1. Configure", desc: "Set your persona & styling", color: "#818cf8" },
          { icon: Code2, label: "2. Copy Script", desc: "One tag, ready to paste", color: "#c084fc" },
          { icon: Zap, label: "3. Go Live", desc: "Instantly actively selling", color: "#34d399" },
        ].map((step, i) => (
          <div key={i} className="glass rounded-[1rem] p-4 border border-white/[0.06] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: step.color + "15", border: "1px solid " + step.color + "30" }}>
              <step.icon className="w-4 h-4" style={{ color: step.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">{step.label}</p>
              <p className="text-xs text-white/40">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config panel */}
        <div className="glass shadow-2xl rounded-3xl border border-white/[0.08] p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2 pb-4 border-b border-white/[0.06]">
            <Settings2 className="w-4 h-4 text-[#818cf8]" />
            <h2 className="text-sm font-semibold text-white">Agent Configuration</h2>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/30 mb-2">Assistant Name</label>
              <input type="text" value={config.assistantName} onChange={e => setConfig((prev: WidgetConfig) => ({ ...prev, assistantName: e.target.value }))}
                className="w-full bg-[#08080f] rounded-xl px-3 py-2 text-sm text-white/90 border border-white/5 focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/50 outline-none transition-all placeholder:text-white/20"
                placeholder="e.g. Sales Agent"
              />
            </div>

            {/* Welcome message */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/30 mb-2">Welcome Message</label>
              <textarea
                value={config.welcomeMessage}
                onChange={e => setConfig(p => ({ ...p, welcomeMessage: e.target.value }))}
                rows={2}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/[0.06] transition-all shadow-inner resize-none placeholder:text-white/20"
              />
            </div>

            {/* Personality */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/30 mb-2">Personality</label>
              <div className="grid grid-cols-2 gap-2">
                {personalities.map(p => (
                  <button key={p.value} onClick={() => setConfig((prev: WidgetConfig) => ({ ...prev, personality: p.value }))}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      config.personality === p.value
                        ? "bg-[#6366f1]/15 border-[#6366f1]/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                        : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:border-white/15"
                    }`}
                  >
                    <div className={`font-semibold ${config.personality === p.value ? "text-[#818cf8]" : "text-white/80"}`}>{p.label}</div>
                    <div className="opacity-60 mt-1 line-clamp-1">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/30 mb-2">Primary Color</label>
              <div className="flex gap-2 flex-wrap bg-white/[0.02] border border-white/[0.06] p-3 rounded-xl">
                {themes.map(t => (
                  <button key={t.value} onClick={() => setConfig((prev: WidgetConfig) => ({ ...prev, primaryColor: t.value }))}
                    title={t.label}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      config.primaryColor === t.value ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]" : "border-transparent"
                    }`}
                    style={{ backgroundColor: t.value }}
                  />
                ))}
                <div className="w-px h-8 bg-white/10 mx-1" />
                <input type="color" value={config.primaryColor}
                  onChange={e => setConfig(p => ({ ...p, primaryColor: e.target.value }))}
                  className="w-8 h-8 rounded-full cursor-pointer border-2 border-white/20 bg-transparent flex-shrink-0"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Allowed topics */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/30 mb-2">Allowed Topics</label>
              <input
                value={config.allowTopics}
                onChange={e => setConfig(p => ({ ...p, allowTopics: e.target.value }))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]/60 focus:bg-white/[0.06] transition-all shadow-inner"
              />
            </div>

            {/* Provider */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/30 mb-2">AI Engine</label>
              <select value={config.provider} onChange={e => setConfig((prev: WidgetConfig) => ({ ...prev, provider: e.target.value as WidgetConfig['provider'] }))}
                className="w-full bg-[#08080f] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]/60 transition-all cursor-pointer">
                <option value="groq">Groq (llama-3 — Multi-Agent — Fastest)</option>
                <option value="openai">OpenAI (GPT-4o — Reasoning)</option>
                <option value="gemini">Google Gemini (2.5 Flash — Search)</option>
                <option value="anthropic">Anthropic (Claude 3.5 — Analytics)</option>
              </select>
            </div>

            {/* Predictive Discount Settings */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/30 mb-2">Predictive Conversion (Max Discount %)</label>
              <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3">
                <input 
                  type="range" 
                  min="0" max="100" step="5"
                  value={config.maxDiscount} 
                  onChange={e => setConfig((prev: WidgetConfig) => ({ ...prev, maxDiscount: parseInt(e.target.value) }))}
                  className="w-full accent-[#34d399] cursor-pointer"
                />
                <span className="text-sm font-semibold text-white min-w-[3rem] text-right">
                  {config.maxDiscount}%
                </span>
              </div>
              <p className="text-[10px] text-white/40 mt-2 leading-relaxed">
                If the AI detects high-intent hesitation, it will autonomously generate and offer a one-time expiring discount to close the sale. Set to 0 to disable.
              </p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full relative group overflow-hidden rounded-xl bg-white text-black py-3.5 px-4 font-semibold text-sm transition-all hover:bg-zinc-200 mt-6 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSaving ? "Saving..." : "Save Configuration to Database"}
              </span>
            </button>
          </div>
        </div>

        {/* Output panel */}
        <div className="space-y-6">
          {/* Live preview */}
          <div className="glass shadow-2xl rounded-3xl border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#c084fc]" />
                <h2 className="text-sm font-semibold text-white">Live Preview</h2>
              </div>
              <span className="text-xs text-[#34d399] font-medium bg-[#34d399]/10 px-2 py-0.5 rounded uppercase tracking-wider">Updates live</span>
            </div>
            
            <div className="bg-[#08080f]/50 rounded-2xl p-6 border border-white/[0.04] flex items-center justify-center min-h-[300px]">
              <div className="w-[300px] bg-[#0c0c16] border border-white/[0.08] rounded-[1.25rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative">
                {/* Desktop top bar mock */}
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between" style={{ backgroundColor: config.primaryColor + "15" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg relative" style={{ backgroundColor: config.primaryColor }}>
                      <Bot className="w-3.5 h-3.5" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#34d399] border border-[#0c0c16] rounded-full" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/90">{config.assistantName || "Agent"}</p>
                      <p className="text-[9px] text-white/40 leading-none mt-0.5">We reply instantly</p>
                    </div>
                  </div>
                </div>
                
                {/* Chat area mock */}
                <div className="p-4 space-y-3 bg-[#0c0c16]">
                  <div className="glass border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-2.5 text-xs text-white/80 leading-relaxed max-w-[85%]">
                    {config.welcomeMessage || "Hello! How can I help?"}
                  </div>
                  <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs text-white ml-auto max-w-[80%] shadow-md" style={{ backgroundColor: config.primaryColor }}>
                    Do you have this item in large?
                  </div>
                </div>
                
                {/* Input mock */}
                <div className="px-4 pb-4 pt-1 bg-[#0c0c16]">
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-2 text-[11px] text-white/30 flex justify-between items-center">
                    <span>Message...</span>
                    <Send className="w-3.5 h-3.5 text-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generated script */}
          <div className="glass shadow-2xl rounded-3xl border border-white/[0.08] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#6366f1]/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06] relative z-10">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#6366f1]" />
                <h2 className="text-sm font-semibold text-white">Your Embed Script</h2>
              </div>
              <CopyButton text={script} />
            </div>
            
            <div className="relative z-10 group">
              <pre className="bg-[#08080f]/80 rounded-2xl p-5 text-[11px] text-[#a5b4fc] overflow-x-auto border border-white/[0.06] leading-[1.6] max-h-64 overflow-y-auto block custom-scrollbar font-mono shadow-inner group-hover:border-white/10 transition-colors">
                <code className="block">{script}</code>
              </pre>
            </div>
            
            <p className="text-xs text-white/40 mt-4 flex items-center gap-2 relative z-10">
              <Sparkles className="w-3.5 h-3.5 text-[#34d399] shrink-0" />
              <span>Paste this before the <code className="text-white/60 bg-white/5 border border-white/10 px-1 rounded mx-0.5">&lt;/body&gt;</code> tag in your theme.liquid.</span>
            </p>
            
            <Link href="/dashboard/test" className="relative z-10 mt-5 w-full flex items-center justify-center gap-2 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-sm font-medium text-white transition-all group">
              Test Agent in Simulator <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
