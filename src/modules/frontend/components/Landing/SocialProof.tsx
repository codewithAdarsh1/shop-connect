"use client"

import { motion } from "framer-motion"

export default function SocialProof() {
  const brands = [
    "ACME Corp", "GlobalTech", "Nexus", "Stark Industries", "Wayne Enterprises", "Cyberdyne", "Massive Dynamic", "Soylent Corp"
  ]

  // We duplicate the array to create a seamless infinite loop
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands]

  return (
    <section className="bg-black py-20 border-y border-white/5 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 text-center mb-10">
        <p className="text-[#86868b] text-sm md:text-base font-semibold tracking-wide uppercase">
          Trusted by innovative teams worldwide
        </p>
      </div>

      <div className="w-full flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          className="flex whitespace-nowrap"
        >
          {duplicatedBrands.map((brand, idx) => (
            <span key={idx} className="mx-12 text-2xl md:text-3xl font-bold text-white/30 hover:text-white/80 transition-colors duration-300">
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
