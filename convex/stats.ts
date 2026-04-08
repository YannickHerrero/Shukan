import { v } from "convex/values";
import { query } from "./_generated/server";
import { getUserOrThrow } from "./lib/auth";

export const getDailyTotals = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);

    const entries = await ctx.db
      .query("mealEntries")
      .withIndex("by_userId_and_date", (q) =>
        q
          .eq("userId", userId)
          .gte("date", args.startDate)
          .lte("date", args.endDate),
      )
      .take(1000);

    const quickAdds = await ctx.db
      .query("quickAdds")
      .withIndex("by_userId_and_date", (q) =>
        q
          .eq("userId", userId)
          .gte("date", args.startDate)
          .lte("date", args.endDate),
      )
      .take(1000);

    const allItems = [...entries, ...quickAdds];
    const byDate: Record<
      string,
      { kcal: number; protein: number; carbs: number; fat: number }
    > = {};

    for (const item of allItems) {
      if (!byDate[item.date]) {
        byDate[item.date] = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
      }
      byDate[item.date].kcal += item.kcal;
      byDate[item.date].protein += item.protein;
      byDate[item.date].carbs += item.carbs;
      byDate[item.date].fat += item.fat;
    }

    return byDate;
  },
});
