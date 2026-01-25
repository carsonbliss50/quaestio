import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all conversations for a session (non-deleted, ordered by most recent)
export const list = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .order("desc")
      .collect();

    return conversations;
  },
});

// Get a single conversation by ID
export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.id);
    if (!conversation || conversation.isDeleted) {
      return null;
    }
    return conversation;
  },
});

// Create a new conversation
export const create = mutation({
  args: {
    sessionId: v.string(),
    mode: v.union(v.literal("standard"), v.literal("aquinas")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("conversations", {
      sessionId: args.sessionId,
      title: "New Conversation",
      mode: args.mode,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    });
    return id;
  },
});

// Update conversation title
export const updateTitle = mutation({
  args: {
    id: v.id("conversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});

// Update conversation mode
export const updateMode = mutation({
  args: {
    id: v.id("conversations"),
    mode: v.union(v.literal("standard"), v.literal("aquinas")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      mode: args.mode,
      updatedAt: Date.now(),
    });
  },
});

// Soft delete a conversation
export const remove = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isDeleted: true,
      updatedAt: Date.now(),
    });
  },
});

// Touch conversation (update timestamp without changing anything else)
export const touch = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      updatedAt: Date.now(),
    });
  },
});

// Generate a random share token
function generateShareToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 12; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// Toggle sharing for a conversation
export const toggleShare = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.id);
    if (!conversation) throw new Error("Conversation not found");

    if (conversation.isPublic) {
      // Unshare - remove token
      await ctx.db.patch(args.id, {
        isPublic: false,
        shareToken: undefined,
        updatedAt: Date.now(),
      });
      return null;
    } else {
      // Share - generate token
      const token = generateShareToken();
      await ctx.db.patch(args.id, {
        isPublic: true,
        shareToken: token,
        updatedAt: Date.now(),
      });
      return token;
    }
  },
});

// Get a conversation by its share token (for public viewing)
export const getByShareToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_share_token", (q) => q.eq("shareToken", args.token))
      .take(1);

    const conversation = conversations[0];
    if (!conversation?.isPublic || conversation.isDeleted) {
      return null;
    }
    return conversation;
  },
});
