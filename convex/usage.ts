import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const DAILY_LIMIT = 25;

// Get today's date in YYYY-MM-DD format (UTC)
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

// Get usage for a session today
export const getToday = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const today = getTodayDate();

    const usage = await ctx.db
      .query("usage")
      .withIndex("by_session_date", (q) =>
        q.eq("sessionId", args.sessionId).eq("date", today)
      )
      .first();

    return {
      count: usage?.messageCount ?? 0,
      limit: DAILY_LIMIT,
      remaining: DAILY_LIMIT - (usage?.messageCount ?? 0),
    };
  },
});

// Increment usage for a session
export const increment = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const today = getTodayDate();

    const existing = await ctx.db
      .query("usage")
      .withIndex("by_session_date", (q) =>
        q.eq("sessionId", args.sessionId).eq("date", today)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        messageCount: existing.messageCount + 1,
      });
      return existing.messageCount + 1;
    } else {
      await ctx.db.insert("usage", {
        sessionId: args.sessionId,
        date: today,
        messageCount: 1,
      });
      return 1;
    }
  },
});

// Check if user can send a message
export const canSend = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const today = getTodayDate();

    const usage = await ctx.db
      .query("usage")
      .withIndex("by_session_date", (q) =>
        q.eq("sessionId", args.sessionId).eq("date", today)
      )
      .first();

    const count = usage?.messageCount ?? 0;
    return count < DAILY_LIMIT;
  },
});
