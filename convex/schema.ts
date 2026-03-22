import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // -- USERS ----------------------------------------------------------
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),

    // Professional/Social fields
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    preferredLang: v.optional(v.string()),         // BCP-47 e.g. "hi-IN", "en-IN"
    hasCompletedOnboarding: v.optional(v.boolean()),
    presence: v.optional(v.union(
      v.literal("online"),
      v.literal("away"),
      v.literal("dnd"),
      v.literal("offline")
    )),
    lastSeenAt: v.optional(v.number()),            // timestamp
    createdAt: v.optional(v.number()),
  })
  .index("email", ["email"]),

  // -- ROOMS ----------------------------------------------------------
  rooms: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("group"), v.literal("direct")),
    createdBy: v.id("users"),
    adminIds: v.optional(v.array(v.id("users"))),
    memberIds: v.array(v.id("users")),  // all member user IDs
    pinnedMessageIds: v.array(v.id("messages")),
    createdAt: v.number(),
    lastMessageAt: v.optional(v.number()),
    lastMessagePreview: v.optional(v.string()),
  })
  .index("by_created_by", ["createdBy"])
  .index("by_last_message", ["lastMessageAt"]),

  // -- ROOM MEMBERS ---------------------------------------------------
  roomMembers: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    joinedAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_room", ["roomId"])
  .index("by_room_user", ["roomId", "userId"]),

  // -- MESSAGES -------------------------------------------------------
  messages: defineTable({
    roomId: v.id("rooms"),
    senderId: v.id("users"),
    type: v.union(
      v.literal("text"),
      v.literal("voice"),
      v.literal("image"),
      v.literal("file")
    ),
    // Text content
    body: v.optional(v.string()),

    // Voice message fields
    audioStorageId: v.optional(v.id("_storage")),
    audioDuration: v.optional(v.number()),         // seconds
    transcript: v.optional(v.string()),             // filled after STT

    // File/image fields
    fileStorageId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),

    // Translation
    originalLang: v.optional(v.string()),           // detected language code
    translations: v.optional(v.any()),              // { "hi-IN": "...", "ta-IN": "..." }
    languageInsight: v.optional(v.string()),
    translationStatus: v.union(
      v.literal("pending"),
      v.literal("done"),
      v.literal("failed"),
      v.literal("skipped")
    ),

    // Reply threading
    replyToId: v.optional(v.id("messages")),

    // Metadata
    isEdited: v.boolean(),
    editedAt: v.optional(v.number()),
    isDeleted: v.boolean(),
    deletedAt: v.optional(v.number()),
    isPinned: v.boolean(),

    createdAt: v.number(),
  })
  .index("by_room", ["roomId", "createdAt"])
  .index("by_sender", ["senderId"])
  .index("by_room_pinned", ["roomId", "isPinned"]),

  // -- REACTIONS ------------------------------------------------------
  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),                 // e.g. "??", "??", "??"
    createdAt: v.number(),
  })
  .index("by_message", ["messageId"])
  .index("by_message_user", ["messageId", "userId"]),

  // -- TASKS ----------------------------------------------------------
  tasks: defineTable({
    roomId: v.id("rooms"),
    createdFromMessageId: v.optional(v.id("messages")),
    title: v.string(),
    assigneeId: v.optional(v.id("users")),
    dueDate: v.optional(v.string()),   // ISO date string
    isDone: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
  .index("by_room", ["roomId"])
  .index("by_assignee", ["assigneeId"]),

  // -- READ RECEIPTS --------------------------------------------------
  readReceipts: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    lastReadMessageId: v.id("messages"),
    lastReadAt: v.number(),
  })
  .index("by_room_user", ["roomId", "userId"]),

  // -- BOOKMARKS ------------------------------------------------------
  bookmarks: defineTable({
    userId: v.id("users"),
    messageId: v.id("messages"),
    createdAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_user_message", ["userId", "messageId"]),

  // -- TYPING INDICATORS (ephemeral) ----------------------------------
  typingIndicators: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    userName: v.string(),
    updatedAt: v.number(),
  })
  .index("by_room", ["roomId"]),
});
