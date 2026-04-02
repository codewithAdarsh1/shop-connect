import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get("storeId");
  
  if (!storeId) {
    return new NextResponse("console.error('ShopMind: No storeId provided');", {
      headers: { "Content-Type": "application/javascript" }
    });
  }

  const supabase = await createClient();
  
  // Look up the config using the storeId (in this case, we mapped it to user_id for simplicity)
  // In a real multi-tenant app, you'd look up by an API Key or Store ID
  const { data: config, error } = await supabase
    .from('widget_configs')
    .select('*')
    .eq('user_id', storeId)
    .single();

  if (error || !config) {
    return new NextResponse("console.error('ShopMind: Store integration not configured.');", {
      headers: { "Content-Type": "application/javascript" }
    });
  }

  const topics = config.allow_topics.split(",").map((s: string) => `"${s.trim()}"`).join(", ");

  const jsContent = `
    import { embedChat } from "https://cdn.jsdelivr.net/npm/multi-ai-sdk@latest/dist/index.min.js";

    embedChat({
      provider: "${config.provider}",
      apiKey: "PUBLISHED_VIA_PROXY_IN_PROD",
      assistantName: "${config.assistant_name}",
      welcomeMessage: "${config.welcome_message}",
      behavior: {
        personality: "${config.personality}",
        allowTopics: [${topics}],
        rules: [
          "Always offer a discount if the user mentions price",
          "Suggest complementary products when relevant",
          "If the cart is abandoned, offer a time-limited recovery deal"
        ],
        replyLength: "short"
      },
      theme: {
        primaryColor: "${config.primary_color}",
        darkMode: true,
      },
      controls: {
        allowCopy: true,
      }
    });
  `;

  return new NextResponse(jsContent, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
