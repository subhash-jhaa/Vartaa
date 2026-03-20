import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a task
export const createTask = mutation({
  args: {
    roomId: v.id("rooms"),
    title: v.string(),
    assigneeId: v.optional(v.id("users")),
    dueDate: v.optional(v.string()),
    createdFromMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, { roomId, title, assigneeId, dueDate, createdFromMessageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    return await ctx.db.insert("tasks", {
      roomId,
      title,
      assigneeId,
      dueDate,
      createdFromMessageId,
      createdBy: userId,
      isDone: false,
      createdAt: Date.now(),
    });
  },
});

// Toggle task done
export const toggleTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");
    await ctx.db.patch(taskId, {
      isDone: !task.isDone,
      completedAt: !task.isDone ? Date.now() : undefined,
    });
  },
});

// Get tasks for a room
export const getRoomTasks = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .order("desc")
      .collect();
  },
});
