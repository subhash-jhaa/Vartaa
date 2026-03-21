import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

// Send a text message
export const sendMessage = mutation({
  args: {
    roomId: v.id("rooms"),
    body: v.string(),
    replyToId: v.optional(v.id("messages")),
  },
  handler: async (ctx, { roomId, body, replyToId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const messageId = await ctx.db.insert("messages", {
      roomId,
      senderId: userId,
      type: "text",
      body,
      replyToId,
      translations: {},
      translationStatus: "pending",
      isEdited: false,
      isDeleted: false,
      isPinned: false,
      createdAt: Date.now(),
    });

    await ctx.db.patch(roomId, {
      lastMessageAt: Date.now(),
      lastMessagePreview: body.slice(0, 80),
    });

    await ctx.scheduler.runAfter(0, internal.actions.translate.translateMessageAction, {
      messageId,
      text: body,
      roomId,
    });

    return messageId;
  },
});

// Get messages for a room (last N, default 50)
export const getMessages = query({
  args: { roomId: v.id("rooms"), limit: v.optional(v.number()) },
  handler: async (ctx, { roomId, limit = 50 }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .order("desc")
      .take(limit);
    return messages.reverse();
  },
});

// Edit a message
export const editMessage = mutation({
  args: { messageId: v.id("messages"), body: v.string() },
  handler: async (ctx, { messageId, body }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const msg = await ctx.db.get(messageId);
    if (!msg) throw new Error("Message not found");
    if (msg.senderId !== userId) throw new Error("Not your message");

    await ctx.db.patch(messageId, {
      body,
      isEdited: true,
      editedAt: Date.now(),
      translationStatus: "pending",
      translations: {},
    });

    await ctx.scheduler.runAfter(0, internal.actions.translate.translateMessageAction, {
      messageId,
      text: body,
      roomId: msg.roomId,
    });
  },
});

// Soft-delete a message
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const msg = await ctx.db.get(messageId);
    if (!msg) throw new Error("Message not found");
    if (msg.senderId !== userId) throw new Error("Not your message");

    await ctx.db.patch(messageId, {
      isDeleted: true,
      deletedAt: Date.now(),
      body: "This message was deleted",
    });
  },
});

// Internal mutation to update translation result
export const updateTranslations = internalMutation({
  args: {
    messageId: v.id("messages"),
    translations: v.any(),
    originalLang: v.string(),
  },
  handler: async (ctx, { messageId, translations, originalLang }) => {
    await ctx.db.patch(messageId, {
      translations,
      originalLang,
      translationStatus: "done",
    });
  },
});

// Mark a message as read
export const markRead = mutation({
  args: { roomId: v.id("rooms"), messageId: v.id("messages") },
  handler: async (ctx, { roomId, messageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const existing = await ctx.db
      .query("readReceipts")
      .withIndex("by_room_user", (q) => q.eq("roomId", roomId).eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { 
        lastReadMessageId: messageId, 
        lastReadAt: Date.now() 
      });
    } else {
      await ctx.db.insert("readReceipts", {
        roomId,
        userId,
        lastReadMessageId: messageId,
        lastReadAt: Date.now(),
      });
    }
  },
});

// Update typing indicator
export const setTyping = mutation({
  args: { roomId: v.id("rooms"), isTyping: v.boolean() },
  handler: async (ctx, { roomId, isTyping }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (isTyping) {
      if (existing) {
        await ctx.db.patch(existing._id, { updatedAt: Date.now() });
      } else {
        await ctx.db.insert("typingIndicators", {
          roomId,
          userId,
          userName: user.name ?? "Someone",
          updatedAt: Date.now(),
        });
      }
    } else {
      if (existing) await ctx.db.delete(existing._id);
    }
  },
});

// Get active typers in a room (active in last 5 seconds)
export const getTypingUsers = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const fiveSecondsAgo = Date.now() - 5000;
    return await ctx.db
      .query("typingIndicators")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .filter((q) => q.gt(q.field("updatedAt"), fiveSecondsAgo))
      .collect();
  },
});

// Bookmark a message
export const bookmarkMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_message", (q) => q.eq("userId", userId).eq("messageId", messageId))
      .unique();

    if (!existing) {
      await ctx.db.insert("bookmarks", { userId, messageId, createdAt: Date.now() });
    }
  },
});

// Get user bookmarks
export const getMyBookmarks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');
    
    return await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Storage upload URL generator
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');
    return await ctx.storage.generateUploadUrl();
  },
});

// Send a voice message
export const sendVoiceMessage = mutation({
  args: {
    roomId: v.id("rooms"),
    audioStorageId: v.id("_storage"),
    audioDuration: v.number(),
  },
  handler: async (ctx, { roomId, audioStorageId, audioDuration }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const messageId = await ctx.db.insert("messages", {
      roomId,
      senderId: userId,
      type: "voice",
      audioStorageId,
      audioDuration,
      translationStatus: "pending",
      isEdited: false,
      isDeleted: false,
      isPinned: false,
      createdAt: Date.now(),
    });

    await ctx.db.patch(roomId, {
      lastMessageAt: Date.now(),
      lastMessagePreview: "🔇 Voice message",
    });

    await ctx.scheduler.runAfter(0, internal.actions.stt.transcribeAndTranslate, {
      messageId,
      audioStorageId,
      roomId,
    });

    return messageId;
  },
});

// --- AS-IS FUNCTIONS ---

export const updateTranscript = internalMutation({
  args: { messageId: v.id("messages"), transcript: v.string() },
  handler: async (ctx, { messageId, transcript }) => {
    await ctx.db.patch(messageId, { body: transcript });
  },
});

export const getAudioUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
