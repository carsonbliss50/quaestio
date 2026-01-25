import { streamText, convertToModelMessages } from "ai";
import { magisterium, MAGISTERIUM_MODEL } from "@/lib/magisterium";
import { getSystemPrompt, type ChatMode } from "@/lib/system-prompts";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, mode = "standard" } = await req.json();

    const systemPrompt = getSystemPrompt(mode as ChatMode);

    const result = streamText({
      model: magisterium(MAGISTERIUM_MODEL),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
