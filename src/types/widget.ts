export interface WidgetConfig {
  assistantName: string
  welcomeMessage: string
  personality: string
  primaryColor: string
  allowTopics: string
  provider: 'groq' | 'openai' | 'gemini' | 'anthropic'
  publicToken?: string
}

export const defaultWidgetConfig: WidgetConfig = {
  assistantName: 'ShopMind AI',
  welcomeMessage: 'Hi! How can I help you today?',
  personality: 'friendly',
  primaryColor: '#6366f1',
  allowTopics: 'product questions, sizing, returns, availability',
  provider: 'groq',
}
