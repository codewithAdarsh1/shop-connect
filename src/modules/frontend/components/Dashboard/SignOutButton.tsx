'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <button 
      onClick={handleSignOut}
      className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors group cursor-pointer text-white/30 hover:text-white"
      title="Sign Out"
    >
      <LogOut className="w-4 h-4" />
    </button>
  )
}
