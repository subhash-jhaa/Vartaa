import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Toggle a reaction with duplicate handling/cleanup
export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },
  handler: async (ctx, { messageId, emoji }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Use collect() instead of unique() to handle existing duplicates
    const existingReactions = await ctx.db
      .query("reactions")
      .withIndex("by_message_user", (q) =>
        q.eq("messageId", messageId).eq("userId", userId)
      )
      .collect();

    const wasSameEmoji = existingReactions.some(r => r.emoji === emoji);

    // If there ARE existing reactions, delete ALL of them
    // (This cleans up pre-existing duplicates and prepares for a replacement if needed)
    if (existingReactions.length > 0) {
      await Promise.all(existingReactions.map(r => ctx.db.delete(r._id)));
    }

    // If they clicked the same emoji, we just removed it (toggle off)
    // If they clicked a DIFFERENT emoji (or hadn't reacted at all), insert the new one
    if (!wasSameEmoji) {
      await ctx.db.insert("reactions", {
        messageId,
        userId,
        emoji,
        createdAt: Date.now(),
      });
    }
  },
});

// Get reactions for a message grouped by emoji
export const getReactions = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const all = await ctx.db
      .query("reactions")
      .withIndex("by_message", (q) => q.eq("messageId", messageId))
      .collect();

    // Group by emoji — return as array not object
    const grouped: Record<string, { emoji: string; count: number; userIds: string[] }> = {};
    for (const r of all) {
      if (!grouped[r.emoji]) {
        grouped[r.emoji] = { emoji: r.emoji, count: 0, userIds: [] };
      }
      grouped[r.emoji].count++;
      grouped[r.emoji].userIds.push(r.userId);
    }
    // Return as array so emoji are values not field names
    return Object.values(grouped);
  },
});
