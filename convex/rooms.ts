import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Internal server-side variant - no identity check needed for background actions
export const getRoomInternal = internalQuery({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    return room;
  },
});

// Used by system-level actions (e.g., STT/Translation)
export const getMyRoomsByUserId = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const memberships = await ctx.db
      .query("roomMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const rooms = await Promise.all(memberships.map((m) => ctx.db.get(m.roomId)));
    return rooms
      .filter((r): r is any => !!r)
      .sort((a, b) => (b.lastMessageAt ?? b.createdAt) - (a.lastMessageAt ?? a.createdAt));
  },
});

// Create a new room
export const createRoom = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("group"), v.literal("direct")),
    memberIds: v.array(v.id("users")),
  },
  handler: async (ctx, { name, description, type, memberIds }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const allMembers = [...new Set([userId, ...memberIds])];
    
    // Insert room record
    const roomId = await ctx.db.insert("rooms", {
      name,
      description,
      type,
      createdBy: userId,
      adminIds: [userId],
      memberIds: allMembers,
      pinnedMessageIds: [],
      createdAt: Date.now(),
    });

    // Populate roomMembers junction table for efficient lookups
    for (const memberId of allMembers) {
      await ctx.db.insert("roomMembers", {
        roomId,
        userId: memberId,
        joinedAt: Date.now(),
      });
    }

    return roomId;
  },
});

/**
 * Get or create a direct message room between the current user and another user
 */
export const getOrCreateDM = mutation({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, { otherUserId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find if a DM already exists
    const myMemberships = await ctx.db
      .query("roomMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const membership of myMemberships) {
      const room = await ctx.db.get(membership.roomId);
      if (
        room &&
        room.type === "direct" &&
        room.memberIds.includes(otherUserId) &&
        room.memberIds.length === 2
      ) {
        return room._id;
      }
    }

    // Otherwise, create a new one
    const roomId = await ctx.db.insert("rooms", {
      name: `DM-${userId}-${otherUserId}`, // Internal name, UI shows user name
      type: "direct",
      createdBy: userId,
      memberIds: [userId, otherUserId],
      pinnedMessageIds: [],
      createdAt: Date.now(),
    });

    await ctx.db.insert("roomMembers", {
      roomId,
      userId: userId,
      joinedAt: Date.now(),
    });
    await ctx.db.insert("roomMembers", {
      roomId,
      userId: otherUserId,
      joinedAt: Date.now(),
    });

    return roomId;
  },
});

// Get all rooms for currently authenticated user
export const getMyRooms = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Use the junction table to eliminate full table scans on rooms
    const memberships = await ctx.db
      .query("roomMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const rooms = await Promise.all(memberships.map((m) => ctx.db.get(m.roomId)));
    
    return rooms
      .filter((r): r is any => !!r)
      .sort((a, b) => (b.lastMessageAt ?? b.createdAt) - (a.lastMessageAt ?? a.createdAt));
  },
});

// Get details for a single room
export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const room = await ctx.db.get(roomId);
    if (!room) return null;
    
    // Simple membership check using the array on the room document
    if (!room.memberIds.includes(userId)) return null;
    
    return room;
  },
});

// Get all members for an active room (to show labels and online status)
export const getRoomMembers = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const callerId = await getAuthUserId(ctx)
    if (!callerId) return []

    const room = await ctx.db.get(roomId)
    if (!room) return []
    if (!room.memberIds.includes(callerId)) return []

    const members = await Promise.all(
      room.memberIds.map(id => ctx.db.get(id))
    )

    return members
      .filter((u): u is any => !!u)
      .map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatarUrl,
        presence: u.presence,
        isAdmin: (room.adminIds ?? [room.createdBy]).includes(u._id),
      }))
  }
})

// Add a member to a room (Group chats)
export const addMember = mutation({
  args: { roomId: v.id("rooms"), userId: v.id("users") },
  handler: async (ctx, { roomId, userId: userIdToAdd }) => {
    const callerId = await getAuthUserId(ctx);
    if (!callerId) throw new Error("Not authenticated");

    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    
    // Only admins can add members
    const effectiveAdmins = room.adminIds ?? [room.createdBy]
    if (!effectiveAdmins.includes(callerId)) {
      throw new Error('Only admins can add members')
    }

    if (!room.memberIds.includes(userIdToAdd)) {
      // 1. Update the member list on the room itself
      await ctx.db.patch(roomId, { 
        memberIds: [...room.memberIds, userIdToAdd] 
      });

      // 2. Add to the junction table
      await ctx.db.insert("roomMembers", {
        roomId,
        userId: userIdToAdd,
        joinedAt: Date.now(),
      });
    }
  },
});

export const removeMember = mutation({
  args: {
    roomId: v.id("rooms"),
    userId: v.id("users"),
  },
  handler: async (ctx, { roomId, userId }) => {
    const callerId = await getAuthUserId(ctx)
    if (!callerId) throw new Error('Not authenticated')

    const room = await ctx.db.get(roomId)
    if (!room) throw new Error('Room not found')

    // Only admins can remove, or user removing themselves
    const effectiveAdmins = room.adminIds ?? [room.createdBy]
    if (!effectiveAdmins.includes(callerId) && callerId !== userId) {
      throw new Error('Unauthorized')
    }

    // Cannot remove the last admin
    if (
      effectiveAdmins.includes(userId) &&
      effectiveAdmins.length === 1
    ) {
      throw new Error('Cannot remove the only admin')
    }

    await ctx.db.patch(roomId, {
      memberIds: room.memberIds.filter(id => id !== userId),
      adminIds: effectiveAdmins.filter(id => id !== userId),
    })

    // Remove from roomMembers table
    const membership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_user", q =>
        q.eq("roomId", roomId).eq("userId", userId)
      )
      .unique()
    if (membership) await ctx.db.delete(membership._id)
  }
})

// Pin a message in a room
export const pinMessage = mutation({
  args: { roomId: v.id("rooms"), messageId: v.id("messages") },
  handler: async (ctx, { roomId, messageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    if (!room.memberIds.includes(userId)) throw new Error("Not a member of this room");

    const alreadyPinned = room.pinnedMessageIds.includes(messageId);
    if (!alreadyPinned) {
      await ctx.db.patch(roomId, { 
        pinnedMessageIds: [...room.pinnedMessageIds, messageId] 
      });
      await ctx.db.patch(messageId, { isPinned: true });
    }
  },
});

// Unpin a message from a room
export const unpinMessage = mutation({
  args: { roomId: v.id("rooms"), messageId: v.id("messages") },
  handler: async (ctx, { roomId, messageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const room = await ctx.db.get(roomId);
    if (!room) throw new Error("Room not found");
    if (!room.memberIds.includes(userId)) throw new Error("Not a member of this room");

    await ctx.db.patch(roomId, {
      pinnedMessageIds: room.pinnedMessageIds.filter((id) => id !== messageId),
    });
    await ctx.db.patch(messageId, { isPinned: false });
  },
});

// Get all pinned messages for a specific room
export const getPinnedMessages = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_room_pinned", (q) => q.eq("roomId", roomId).eq("isPinned", true))
      .collect();
  },
});
