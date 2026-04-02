'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDashboardMetrics() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // 1. Fetch store metrics
  const { data: metrics } = await supabase
    .from('store_metrics')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // 2. Fetch conversation count
  const { count: conversationsCount } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const hasMetrics = !!metrics

  // Return the fetched data, or 0s if no data exists
  return {
    revenue: hasMetrics ? metrics.total_revenue : 0,
    activeSessions: hasMetrics ? metrics.active_sessions : 0,
    abandonedCartsRecovered: hasMetrics ? metrics.abandoned_carts_recovered : 0,
    totalConversations: conversationsCount || 0,
  }
}
