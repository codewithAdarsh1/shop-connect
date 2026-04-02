"use client"

import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { MouseEvent } from "react"

// Spotlight wrapper for individual cards
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative glass-card overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 mix-blend-screen"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.08),
              transparent 40%
            )
          `,
        }}
      />
      {children}
    </div>
  )
}

export default function BentoGrid() {
  return (
    <section className="bg-black py-32 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-section font-bold text-gradient-silver mb-6">
            A closer look at power.
          </h2>
          <p className="text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto tracking-tight">
            Everything you need to automate your sales, beautifully integrated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Large Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2"
          >
            <SpotlightCard className="p-10 md:p-14 min-h-[400px] flex flex-col justify-end">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0" />
              <div className="relative z-10 w-full md:w-2/3">
                <h3 className="text-3xl md:text-5xl font-semibold text-white mb-4">
                  Total Control.
                </h3>
                <p className="text-lg md:text-xl text-[#86868b] leading-relaxed">
                  Set custom guardrails, tone of voice, and exact pricing thresholds. ShopMind stays within the lines, always.
                </p>
              </div>
              
              {/* Mockup decoration */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[400px] h-[300px] bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hidden md:flex flex-col gap-4 shadow-[0_0_80px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:-translate-x-4">
                <div className="h-6 w-1/3 bg-white/10 rounded" />
                <div className="flex flex-col gap-2 mt-2">
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-3/4 bg-white/5 rounded animate-typing-1" />
                </div>
                <div className="flex gap-4 mt-auto">
                  <div className="h-28 flex-1 bg-gradient-to-br from-green-500/20 to-transparent rounded-lg border border-green-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-green-400/10 animate-pulse mix-blend-overlay" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs font-mono text-green-400/80">ACTIVE</span>
                    </div>
                  </div>
                  <div className="h-28 flex-1 bg-white/[0.03] rounded-lg border border-white/5 p-4 flex flex-col justify-end">
                    <div className="h-2 w-full bg-white/10 rounded animate-typing-2" />
                    <div className="h-2 w-2/3 bg-white/10 rounded mt-2 animate-typing-3" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Top Small Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SpotlightCard className="p-10 min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="flex items-start justify-center mb-4">
                  <span className="text-8xl font-bold tracking-tighter text-white">14</span>
                  <span className="text-3xl font-bold text-[#86868b] mt-2 ml-1">d</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Free Trial.</h3>
                <p className="text-[#86868b]">No credit card required. Setup in under 2 minutes.</p>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Bottom Small Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <SpotlightCard className="p-10 min-h-[300px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 blur-[80px] group-hover:bg-purple-500/30 transition-colors duration-700 rounded-full" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <span className="text-xl">🌍</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Multi-language.</h3>
                  <p className="text-[#86868b] leading-relaxed">
                    Fluently converse and negotiate in over 50 languages natively. No plugins required.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Bottom Large Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2"
          >
            <SpotlightCard className="p-10 md:p-14 min-h-[300px] flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent z-0" />
              <div className="relative z-10 w-full md:w-1/2">
                 <h3 className="text-3xl font-semibold text-white mb-4">
                   Blazing Fast Core.
                 </h3>
                 <p className="text-lg text-[#86868b] leading-relaxed">
                   Inference times under 300ms ensure your customers never feel like they are waiting for a bot. Responses flow as naturally as human chat.
                 </p>
              </div>
              
              {/* Graph Mockup */}
              <div className="absolute right-10 bottom-0 top-12 w-[300px] hidden md:flex items-end gap-3 px-6 pb-6">
                {[40, 70, 45, 90, 60, 100, 80].map((height, i) => (
                  <div key={i} className="flex-1 group-hover:opacity-100 transition-all duration-[800ms] ease-out flex flex-col justify-end" style={{ transitionDelay: `${i * 50}ms` }}>
                    {/* Animated vertical bar */}
                    <div 
                      className="w-full bg-gradient-to-t from-white/20 to-white/40 rounded-t-md relative overflow-hidden" 
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-in-out" style={{ transitionDelay: `${i * 100}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
