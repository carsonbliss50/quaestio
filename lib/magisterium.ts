import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Magisterium API client configuration
// Uses OpenAI-compatible API format
export const magisterium = createOpenAICompatible({
  name: "magisterium",
  baseURL: "https://www.magisterium.com/api",
  headers: {
    Authorization: `Bearer ${process.env.MAGISTERIUM_API_KEY}`,
  },
});

// Model identifier for the Magisterium API
export const MAGISTERIUM_MODEL = "magisterium-1";

// Daily message limit for free tier
export const DAILY_MESSAGE_LIMIT = 25;
