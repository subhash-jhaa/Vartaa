import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, internalMutation, internalQuery } from './_generated/server'
import { v } from 'convex/values'

export const getMeById = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, { userId }) => {
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
})

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
})

export const getUsersByIds = query({
  args: { userIds: v.array(v.id("users")) },
  handler: async (ctx, { userIds }) => {
    return Promise.all(userIds.map(id => ctx.db.get(id)))
  },
})

export const getUsersByIdsInternal = internalQuery({
  args: { userIds: v.array(v.id("users")) },
  handler: async (ctx, { userIds }) => {
    return Promise.all(userIds.map(id => ctx.db.get(id)))
  },
})

export const upsertUser = internalMutation({
  args: { name: v.string(), email: v.string(), avatarUrl: v.optional(v.string()) },
  handler: async (ctx, { name, email, avatarUrl }) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', email))
      .unique()
    if (existing) {
      await ctx.db.patch(existing._id, { name, avatarUrl, lastSeenAt: Date.now() })
      return existing._id
    }
    return await ctx.db.insert('users', {
      name, email, avatarUrl,
      preferredLang: 'en-IN',
      presence: 'online',
      lastSeenAt: Date.now(),
      createdAt: Date.now(),
    })
  }
})

export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')
    if (!name.trim()) throw new Error('Name cannot be empty')
    await ctx.db.patch(userId, { name: name.trim() })
  }
})

export const updatePreferredLang = mutation({
  args: { lang: v.string() },
  handler: async (ctx, { lang }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    await ctx.db.patch(userId, { preferredLang: lang });
  }
})

export const updatePresence = mutation({
  args: { presence: v.union(v.literal("online"), v.literal("away"), v.literal("dnd"), v.literal("offline")) },
  handler: async (ctx, { presence }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    await ctx.db.patch(userId, { presence, lastSeenAt: Date.now() });
  }
})

export const setOnboardingComplete = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return
    await ctx.db.patch(userId, { hasCompletedOnboarding: true })
  }
})

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    const found = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', email))
      .unique()
    if (!found) return null
    return {
      _id: found._id,
      name: found.name,
      email: found.email,
      avatarUrl: found.avatarUrl,
    }
  }
})

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const users = await ctx.db.query("users").collect();
    return users
      .filter((u) => u._id !== userId)
      .map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        image: u.image,
        avatarUrl: u.avatarUrl,
        presence: u.presence ?? "offline",
      }));
  },
});
