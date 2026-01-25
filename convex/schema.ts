import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Simplified for alpha - no user accounts, just browser session ID
  conversations: defineTable({
    sessionId: v.string(), // Browser fingerprint/localStorage ID
    title: v.string(),
    mode: v.union(v.literal("standard"), v.literal("aquinas")),
    createdAt: v.number(),
    updatedAt: v.number(),
    isDeleted: v.boolean(), // Soft delete
  })
    .index("by_session", ["sessionId"])
    .index("by_session_updated", ["sessionId", "updatedAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    citations: v.optional(
      v.array(
        v.object({
          title: v.string(),
          source: v.string(),
          url: v.optional(v.string()),
          year: v.optional(v.string()),
        })
      )
    ),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  // Track daily usage per session
  usage: defineTable({
    sessionId: v.string(),
    date: v.string(), // YYYY-MM-DD
    messageCount: v.number(),
  }).index("by_session_date", ["sessionId", "date"]),
});
