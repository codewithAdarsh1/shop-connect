'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { WidgetConfig } from '@/types/widget'

export async function saveWidgetConfig(config: WidgetConfig) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'You must be logged in to save.' }
  }

  const { error } = await supabase
    .from('widget_configs')
    .upsert(
      {
        user_id: user.id,
        assistant_name: config.assistantName,
        welcome_message: config.welcomeMessage,
        personality: config.personality,
        primary_color: config.primaryColor,
        allow_topics: config.allowTopics,
        provider: config.provider,
        max_discount: config.maxDiscount,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    )

  if (error) {
    console.error('Save config error:', error)
    return { error: 'Failed to save configuration.' }
  }

  revalidatePath('/dashboard/widget')
  return { success: true }
}

export async function getWidgetConfig() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('widget_configs')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return null
  }

  return {
    assistantName: data.assistant_name,
    welcomeMessage: data.welcome_message,
    personality: data.personality,
    primaryColor: data.primary_color,
    allowTopics: data.allow_topics,
    provider: data.provider,
    maxDiscount: data.max_discount,
    publicToken: data.public_token,
  }
}
