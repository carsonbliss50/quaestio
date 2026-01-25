import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible";
import type { MetadataExtractor } from "@ai-sdk/openai-compatible";

// Citation format from Magisterium API
export interface MagisteriumCitation {
  cited_text: string;
  cited_text_heading: string | null;
  document_title: string | null;
  document_author: string | null;
  document_year: string | null;
  document_reference: string | null;
  source_url: string;
}

// Metadata extractor to capture citations from API response
const magisteriumMetadataExtractor: MetadataExtractor = {
  // For non-streaming responses
  extractMetadata: async ({ parsedBody }) => ({
    magisterium: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      citations: (parsedBody as any).citations ?? [],
    },
  }),

  // For streaming responses - citations appear in final chunk
  createStreamExtractor: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let citations: any[] = [];

    return {
      processChunk: (parsedChunk: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chunk = parsedChunk as any;
        // Citations appear at the top level of the final chunk
        if (chunk?.citations) {
          citations = chunk.citations;
        }
      },
      buildMetadata: () => ({
        magisterium: { citations },
      }),
    };
  },
};

// Model identifier for the Magisterium API
export const MAGISTERIUM_MODEL = "magisterium-1";

// Create language model directly with full config including metadataExtractor
export const magisterium = (modelId: string) => {
  return new OpenAICompatibleChatLanguageModel(modelId, {
    provider: "magisterium",
    url: ({ path }) => `https://www.magisterium.com/api/v1${path}`,
    headers: () => ({
      Authorization: `Bearer ${process.env.MAGISTERIUM_API_KEY}`,
    }),
    metadataExtractor: magisteriumMetadataExtractor,
  });
};

// Daily message limit for free tier
export const DAILY_MESSAGE_LIMIT = 25;
