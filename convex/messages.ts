import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Citation schema for type safety
const citationSchema = v.object({
  title: v.string(),
  source: v.string(),
  url: v.optional(v.string()),
  year: v.optional(v.string()),
});

// Get all messages for a conversation
export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();

    return messages;
  },
});

// Add a user message
export const addUserMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: "user",
      content: args.content,
      createdAt: Date.now(),
    });

    // Update conversation timestamp
    await ctx.db.patch(args.conversationId, {
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Add an assistant message
export const addAssistantMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    citations: v.optional(v.array(citationSchema)),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: "assistant",
      content: args.content,
      citations: args.citations,
      createdAt: Date.now(),
    });

    // Update conversation timestamp
    await ctx.db.patch(args.conversationId, {
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Update an assistant message (for streaming updates)
export const updateMessage = mutation({
  args: {
    id: v.id("messages"),
    content: v.string(),
    citations: v.optional(v.array(citationSchema)),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      content: args.content,
      ...(args.citations !== undefined && { citations: args.citations }),
    });
  },
});

// Get message count for a conversation
export const count = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    return messages.length;
  },
});

// Delete the last assistant message (for regeneration)
export const deleteLastAssistant = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .take(1);

    const lastMessage = messages[0];
    if (lastMessage?.role === "assistant") {
      await ctx.db.delete(lastMessage._id);
      return lastMessage._id;
    }
    return null;
  },
});
