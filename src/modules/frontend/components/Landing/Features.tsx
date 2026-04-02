"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MessageSquare, Zap, BarChart3, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    title: "Conversational Intelligence.",
    description: "ShopMind doesn't just answer FAQs. It actively sells, recommends, and handles objections just like your best sales rep."
  },
  {
    icon: <Zap className="w-8 h-8 text-white" />,
    title: "Instant Cart Recovery.",
    description: "Reach out to abandoning users within seconds natively on your site, preventing them from ever leaving the tab."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-white" />,
    title: "Real-time Analytics.",
    description: "Track every interaction, objection, and conversion. Understand exactly what your customers are asking and why they buy."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: "Enterprise Grade.",
    description: "Built for massive scale. Fully compliant, with localized data processing and native integration into your existing stack."
  }
]

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Fade headline as person scrolls deep
  const headlineOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0])

  return (
    <section ref={containerRef} className="relative bg-black text-white py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Sticky Left - Headline */}
        <div className="lg:w-1/2">
          <motion.div 
            style={{ opacity: headlineOpacity }}
            className="lg:sticky lg:top-40 max-w-xl"
          >
            <h2 className="text-section text-gradient-silver mb-8">
              Intelligence, <br />
              built right in.
            </h2>
            <p className="text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed">
              ShopMind AI is natively integrated with your store, monitoring every action and acting flawlessly when it matters most.
            </p>
          </motion.div>
        </div>

        {/* Scrolling Right - Feature Cards */}
        <div className="lg:w-1/2 flex flex-col gap-8 md:gap-12 lg:pt-32 lg:pb-[50vh]">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 md:p-12 hover:border-white/20 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/5">
                {feature.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
                {feature.title}
              </h3>
              <p className="text-lg md:text-xl text-[#86868b] font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
