import Hero from "@/components/Landing/Hero"
import SocialProof from "@/components/Landing/SocialProof"
import Features from "@/components/Landing/Features"
import BentoGrid from "@/components/Landing/BentoGrid"
import Pricing from "@/components/Landing/Pricing"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/utils/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col selection:bg-white/20">
      {/* Global Navigation (Sticky Glass Header) */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/[0.04] bg-black/40 backdrop-blur-xl saturate-200">
        <div className="container mx-auto h-full max-w-6xl px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-black rounded-full animate-pulse" />
            </div>
            <span className="font-semibold tracking-tight text-white">ShopMind</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/sign-in" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link href="/sign-in" className="btn-primary py-2 px-4 text-sm hidden md:flex">
                  Start Free Trial
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-white hover:text-white/80 transition-colors mr-2">
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Hero />
        <SocialProof />
        
        <div className="relative z-10 w-full overflow-hidden bg-black outline outline-1 outline-white/5 rounded-t-[3rem] -mt-10 pb-20">
          {/* Subtle top glow line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <Features />
          <BentoGrid />
          
          {/* Bottom call to action */}
          <div className="py-24 px-4 md:px-8 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
              Turn conversations into conversions.
            </h2>
            <p className="text-xl text-[#86868b] mb-10">
              Join 1,000+ merchants generating millions in automated revenue with ShopMind AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up" className="btn-primary w-full sm:w-auto text-lg py-4 px-8 flex items-center justify-center gap-2 group">
                Deploy your Agent
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/demo" className="text-white hover:text-white/80 font-medium py-4 px-8 transition-colors">
                Book a Demo
              </Link>
            </div>
          </div>
          
          <Pricing />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] bg-black py-12 px-4 md:px-8 text-sm">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <span className="font-semibold text-white">ShopMind</span>
            </div>
            <p className="text-white/40">The autonomous sales force for modern e-commerce.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white mb-2">Product</h4>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Features</Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Integrations</Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Changelog</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white mb-2">Resources</h4>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Documentation</Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Help Center</Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Blog</Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Community</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white mb-2">Legal</h4>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-white/40 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl pt-8 border-t border-white/[0.04] text-white/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ShopMind AI Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
