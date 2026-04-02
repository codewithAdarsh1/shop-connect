"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "We were skeptical. Then ShopMind recovered a $340 cart in the first 6 hours. It paid for 3 months of the subscription in a single conversation.",
    name: "Marcus H.",
    role: "Founder",
    store: "BOLDFIT Athletics",
    metric: "+$8,400/mo",
    metricLabel: "additional revenue",
    avatar: "MH",
    gradient: "from-[#6366f1] to-[#8b5cf6]",
  },
  {
    quote: "Our support ticket volume dropped 62%. The AI handles sizing questions, return policies, and stock queries — better than half my team. Brutal but true.",
    name: "Priya S.",
    role: "Head of CX",
    store: "Rooted Botanicals",
    metric: "−62%",
    metricLabel: "support tickets",
    avatar: "PS",
    gradient: "from-[#059669] to-[#10b981]",
  },
  {
    quote: "Setup took a Saturday afternoon. By Monday, it had already upsold $450 in complementary products I never would have thought to pitch manually.",
    name: "Tyler M.",
    role: "Solo Founder",
    store: "NorthBound Goods",
    metric: "$450",
    metricLabel: "first weekend revenue",
    avatar: "TM",
    gradient: "from-[#d97706] to-[#f59e0b]",
  },
  {
    quote: "The exit-intent recovery alone is worth 10× the price. We went from 73% cart abandonment to 51% in three weeks. I wish I'd installed this on day one.",
    name: "Sarah K.",
    role: "E-commerce Director",
    store: "Pure&Co Skincare",
    metric: "−22%",
    metricLabel: "abandonment rate",
    avatar: "SK",
    gradient: "from-[#db2777] to-[#ec4899]",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent(i => (i + 1) % testimonials.length)
  const t = testimonials[current]

  return (
    <section className="relative overflow-hidden bg-[#04040a]">
      {/* Aurora glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6366f1]/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-32">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs font-bold tracking-[0.2em] uppercase text-[#6366f1] mb-5"
          >
            Merchant stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-section text-white-fade max-w-2xl mx-auto"
          >
            Real stores.
            <br />
            <span className="text-gradient">Real numbers.</span>
          </motion.h2>
        </div>

        {/* Main testimonial card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-hi rounded-[2rem] border border-white/[0.08] overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left: metric callout */}
                <div className={`relative flex flex-col items-center justify-center py-14 px-8 text-center bg-gradient-to-br ${t.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 dot-grid" />
                  <div className="relative z-10">
                    <div className="text-6xl font-bold text-white mb-2 tracking-tight">{t.metric}</div>
                    <div className="text-white/70 text-sm font-medium">{t.metricLabel}</div>
                    <div className="mt-6 pt-6 border-t border-white/20 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
                        {t.avatar}
                      </div>
                      <div className="text-left">
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        <p className="text-white/60 text-xs">{t.role} · {t.store}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: quote */}
                <div className="lg:col-span-2 flex flex-col justify-between p-10 md:p-12">
                  <Quote className="w-10 h-10 text-white/10 mb-6" />
                  <blockquote className="text-xl md:text-2xl text-white/75 leading-relaxed font-light tracking-tight flex-1 flex items-center">
                    "{t.quote}"
                  </blockquote>
                  <div className="flex gap-2 mt-8">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[#f59e0b] text-base">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all ${i === current ? "w-8 h-2 bg-[#6366f1]" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
                />
              ))}
            </div>
            {/* Arrows */}
            <div className="flex gap-3">
              <button onClick={prev}
                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/25 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={next}
                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/25 transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mini testimonials grid below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 max-w-4xl mx-auto">
          {testimonials.map((t2, i) => (
            <motion.button key={i} onClick={() => setCurrent(i)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`text-left p-4 rounded-2xl border transition-all ${i === current ? "glass-hi border-[#6366f1]/40" : "glass border-white/[0.06] hover:border-white/15"}`}
            >
              <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-3">"{t2.quote.slice(0, 60)}..."</p>
              <p className="text-xs font-semibold text-white/60">{t2.name}</p>
              <p className="text-[10px] text-white/30">{t2.store}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
