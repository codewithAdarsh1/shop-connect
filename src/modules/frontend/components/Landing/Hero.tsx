"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion"
import Link from "next/link"
import { Play, Activity } from "lucide-react"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Headline transforms
  const headlineScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.85])
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const headlineY = useTransform(scrollYProgress, [0, 0.4], [0, -100])

  // Mockup transforms
  const mockupScale = useTransform(scrollYProgress, [0.1, 0.6], [0.8, 1])
  const mockupOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 1])
  const mockupY = useTransform(scrollYProgress, [0.1, 0.6], [150, 0])

  // Ambient mouse follow for background glow
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse coordinates
      const { innerWidth, innerHeight } = window
      mouseX.set(e.clientX - innerWidth / 2)
      mouseY.set(e.clientY - innerHeight / 2)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-black">
      {/* Dynamic Ambient Background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
        style={{
          background: useMotionTemplate`radial-gradient(ellipse at calc(50% + ${mouseX}px * 0.1) calc(50% + ${mouseY}px * 0.1), rgba(99, 102, 241, 0.15), transparent 50%)`
        }}
      />
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-ambient z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-ambient z-0" style={{ animationDelay: '-5s' }} />

      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-10">
        
        {/* Animated Headline Group */}
        <motion.div 
          style={{ opacity: headlineOpacity, scale: headlineScale, y: headlineY }}
          className="absolute z-20 flex flex-col items-center justify-center text-center px-4"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
            <span className="text-sm font-medium tracking-wide text-white/90">
              System Online & Processing
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-display max-w-[1200px]"
          >
            Pro. <br className="md:hidden" />
            <span className="text-gradient-silver relative">
              Beyond powerful.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-xl md:text-3xl text-[#86868b] max-w-3xl font-medium tracking-tight"
          >
            An autonomous sales agent that handles objections, closes carts, and drives revenue 24/7.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-5"
          >
            <Link href="/sign-up" className="btn-primary">
              Start Free Trial
            </Link>
            <Link href="#demo" className="btn-secondary group gap-2">
              Watch Demo
              <Play className="w-4 h-4 fill-white/80 group-hover:fill-white transition-colors" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Product Mockup Reveal */}
        <motion.div 
          style={{ opacity: mockupOpacity, scale: mockupScale, y: mockupY }}
          className="absolute z-10 w-full max-w-6xl px-4 md:px-8 mt-24"
        >
          <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl md:rounded-[32px] overflow-hidden glass-card shadow-[0_0_120px_rgba(255,255,255,0.05)] border border-white/10 before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/5 before:to-transparent before:z-10 bg-[#0a0a0c]">
            {/* Animated Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-20 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-scanline" />
            </div>

            {/* Fake macOS Window Header */}
            <div className="absolute top-0 w-full h-12 bg-white/[0.02] border-b border-white/5 flex items-center px-6 gap-2.5 z-20 backdrop-blur-xl">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <div className="ml-4 h-6 w-48 bg-white/5 rounded mx-auto absolute left-1/2 -translate-x-1/2 hidden md:block" />
              <div className="absolute right-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white/50 font-mono">LIVE . 24ms</span>
              </div>
            </div>
            
            {/* Mockup UI Interface - CSS rendered */}
            <div className="w-full h-full pt-12 flex relative z-10">
              
              {/* Sidebar */}
              <div className="w-64 border-r border-white/5 hidden md:block p-6">
                <div className="h-6 w-24 bg-white/10 rounded mb-8" />
                <div className="flex flex-col gap-4">
                  <div className="h-8 bg-white/10 rounded-lg w-full flex items-center px-3 gap-3">
                     <span className="w-2 h-2 rounded-full bg-indigo-500" />
                     <div className="h-2 bg-white/20 rounded w-16" />
                  </div>
                  <div className="h-8 bg-white/5 rounded-lg w-5/6 flex items-center px-3 gap-3">
                     <span className="w-2 h-2 rounded-full bg-white/20" />
                     <div className="h-2 bg-white/10 rounded w-12" />
                  </div>
                  <div className="h-8 bg-white/5 rounded-lg w-4/5 flex items-center px-3 gap-3">
                     <span className="w-2 h-2 rounded-full bg-white/20" />
                     <div className="h-2 bg-white/10 rounded w-20" />
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">
                
                {/* Header Metrics */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div>
                     <div className="h-8 bg-white/10 rounded-lg w-48 mb-2" />
                     <div className="h-4 bg-white/5 rounded w-32" />
                   </div>
                   <div className="h-10 bg-white/10 border border-white/10 rounded-full w-32 flex items-center justify-center">
                     <div className="h-2 w-16 bg-white/30 rounded" />
                   </div>
                </div>

                {/* Data Cards */}
                <div className="flex flex-col md:flex-row gap-6 md:h-48">
                  {/* Active Card */}
                  <div className="flex-1 rounded-2xl bg-white/[0.03] border border-white/10 p-6 md:p-8 relative overflow-hidden group">
                     {/* Ambient Card Glow */}
                     <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-green-500/20 blur-[50px] rounded-full animate-ambient" />
                     
                     <div className="h-4 w-24 bg-white/20 rounded mb-6" />
                     <div className="flex items-end gap-3 mb-4">
                       <div className="h-16 w-3/4 bg-white/20 rounded font-mono flex items-center px-4">
                         <span className="text-2xl text-white tracking-widest">+12%</span>
                       </div>
                       <div className="w-2 h-2 bg-green-400 rounded-full mb-3 animate-pulse" />
                     </div>
                     <div className="h-2 w-1/2 bg-gradient-to-r from-green-400/80 to-transparent rounded" />
                  </div>

                  <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/5 p-6 md:p-8 relative overflow-hidden group">
                     <div className="absolute -left-4 -top-4 w-40 h-40 bg-blue-500/10 blur-[50px] rounded-full animate-ambient" style={{ animationDelay: '-10s' }} />
                     <div className="h-4 w-24 bg-white/20 rounded mb-6" />
                     <div className="flex flex-col gap-3">
                       <div className="h-3 w-5/6 bg-white/10 rounded animate-typing-1" />
                       <div className="h-3 w-full bg-white/10 rounded animate-typing-2" />
                       <div className="h-3 w-2/3 bg-white/10 rounded animate-typing-3" />
                     </div>
                  </div>
                </div>

                {/* Console / Stream Area */}
                <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-6 relative overflow-hidden flex flex-col shadow-inner">
                  <div className="absolute top-0 right-0 w-full h-10 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                  <div className="w-full flex justify-between border-b border-white/5 pb-4 mb-4">
                    <div className="h-3 w-20 bg-white/20 rounded" />
                    <div className="h-3 w-16 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/10 rounded" />
                  </div>
                  <div className="flex flex-col gap-5 flex-1 relative font-mono">
                    <div className="flex items-center gap-3">
                      <span className="text-green-400/60 text-xs text-[10px]">10:42:01</span>
                      <div className="h-2 bg-indigo-500/80 rounded animate-typing-1" style={{ width: '60%' }} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400/60 text-xs text-[10px]">10:42:02</span>
                      <div className="h-2 bg-white/20 rounded animate-typing-3" style={{ width: '45%' }} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400/60 text-xs text-[10px]">10:42:04</span>
                      <div className="h-2 bg-white/20 rounded animate-typing-2" style={{ width: '80%' }} />
                      <span className="w-1.5 h-3 bg-white/80 animate-pulse" /> {/* Blinking Cursor */}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
