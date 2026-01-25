import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { magisterium, MAGISTERIUM_MODEL, type MagisteriumCitation } from "@/lib/magisterium";
import { getSystemPrompt, type ChatMode } from "@/lib/system-prompts";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, mode = "standard" } = await req.json();

    const systemPrompt = getSystemPrompt(mode as ChatMode);

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const result = streamText({
          model: magisterium(MAGISTERIUM_MODEL),
          system: systemPrompt,
          messages: await convertToModelMessages(messages),
          onFinish: ({ providerMetadata }) => {
            // Extract citations from provider metadata
            const citations = (providerMetadata?.magisterium?.citations ?? []) as unknown as MagisteriumCitation[];

            if (citations.length > 0) {
              // Send citations as custom data part
              writer.write({
                type: "data-citations",
                data: { citations },
              });
            }
          },
        });

        // Merge the text stream
        writer.merge(result.toUIMessageStream());
      },
    });

    return createUIMessageStreamResponse({ stream });
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
