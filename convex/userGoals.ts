import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserOrThrow } from "./lib/auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db
      .query("userGoals")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    dailyKcal: v.number(),
    dailyProtein: v.number(),
    dailyCarbs: v.optional(v.number()),
    dailyFat: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const existing = await ctx.db
      .query("userGoals")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("userGoals", { userId, ...args });
  },
});
