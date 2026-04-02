import { NextRequest, NextResponse } from "next/server";
import { groq, SYSTEM_PROMPT } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Combine system prompt with history
    const conversation = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    // Check if the API key is a dummy mocking key (for visual build testing)
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "gsk_dummy_mock_key_for_build_purposes") {
       // Make actual call to Groq
       const reply = await groq.chat(conversation, {
         model: "llama3-8b-8192"
       });

       return NextResponse.json({
         reply: reply || "Sorry, I couldn't process that.",
       });
    } else {
       // Return a mock response if we have no valid API key yet
       return NextResponse.json({
         reply: "This is a mock response from ShopMind AI. Please add a valid GROQ_API_KEY to your env variables to enable real LLM responses."
       });
    }

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
