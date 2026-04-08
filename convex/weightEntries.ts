import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserOrThrow } from "./lib/auth";

export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db
      .query("weightEntries")
      .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .unique();
  },
});

export const upsert = mutation({
  args: {
    date: v.string(),
    weight: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const existing = await ctx.db
      .query("weightEntries")
      .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", userId).eq("date", args.date),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { weight: args.weight });
      return existing._id;
    }
    return await ctx.db.insert("weightEntries", {
      userId,
      date: args.date,
      weight: args.weight,
    });
  },
});

export const getRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db
      .query("weightEntries")
      .withIndex("by_userId_and_date", (q) =>
        q
          .eq("userId", userId)
          .gte("date", args.startDate)
          .lte("date", args.endDate),
      )
      .take(365);
  },
});
