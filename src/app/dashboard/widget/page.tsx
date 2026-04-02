import { getWidgetConfig } from "./actions"
import { WidgetForm } from "./WidgetForm"
import { defaultWidgetConfig } from "@/types/widget"

export const metadata = {
  title: "Widget Generator | ShopMind AI",
  description: "Configure and generate your custom AI chat widget for your store",
}

export default async function WidgetPage() {
  const config = await getWidgetConfig()
  
  // If the user hasn't saved a config yet, we provide the default values
  const initialConfig = config || defaultWidgetConfig

  return <WidgetForm initialConfig={initialConfig as any} />
}
