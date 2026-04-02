"use client"

import { Check } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { MouseEvent } from "react"

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
              rgba(255,255,255,0.06),
              transparent 40%
            )
          `,
        }}
      />
      {children}
    </div>
  )
}

export default function Pricing() {
  const tiers = [
    {
      name: "Pro",
      price: "$299",
      period: "/ mo",
      desc: "Everything you need to automate your store's sales.",
      features: [
        "Up to 5,000 active conversations",
        "Autonomous Cart Recovery",
        "Unlimited custom knowledge base",
        "Real-time analytics dashboard",
        "Email & Chat support"
      ],
      button: "Start 14-day free trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For high-volume merchants needing dedicated power.",
      features: [
        "Unlimited active conversations",
        "Custom ERP/CRM integrations",
        "Dedicated Success Manager",
        "SLA & localized data processing",
        "Priority 24/7 Phone Support"
      ],
      button: "Contact Sales"
    }
  ]

  return (
    <section className="bg-black py-32 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-20">
          <h2 className="text-section font-bold text-gradient-silver mb-6">
            Priced for growth.
          </h2>
          <p className="text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto tracking-tight">
            Transparent pricing based on performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none animate-ambient z-0" />

          {tiers.map((tier, i) => (
            <SpotlightCard 
              key={i} 
              className="p-10 md:p-14 flex flex-col z-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-semibold text-white mb-2">{tier.name}</h3>
                <p className="text-[#86868b] text-lg mb-8 h-12">{tier.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-white">{tier.price}</span>
                  <span className="text-xl text-[#86868b] font-medium">{tier.period}</span>
                </div>
              </div>

              <div className="flex-1 mb-10 relative z-10">
                <ul className="flex flex-col gap-5 text-lg">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-4 text-white/90">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-white/20 transition-colors">
                        <Check className="w-3.5 h-3.5 text-white/80" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 block mt-auto">
                <button className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${
                  i === 0 
                  ? 'bg-white text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-[0.98]' 
                  : 'bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40 active:scale-[0.98]'
                }`}>
                  {tier.button}
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
