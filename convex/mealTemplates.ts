import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserOrThrow } from "./lib/auth";
import { mealSlotValidator } from "./schema";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await getUserOrThrow(ctx);
    return await ctx.db
      .query("mealTemplates")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(100);
  },
});

export const getWithItems = query({
  args: { id: v.id("mealTemplates") },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const template = await ctx.db.get(args.id);
    if (!template || template.userId !== userId) return null;

    const items = await ctx.db
      .query("mealTemplateItems")
      .withIndex("by_templateId", (q) => q.eq("templateId", args.id))
      .take(50);

    const itemsWithFoods = await Promise.all(
      items.map(async (item) => {
        const food = await ctx.db.get(item.foodId);
        return { ...item, food };
      }),
    );

    return { ...template, items: itemsWithFoods };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    defaultSlot: v.optional(mealSlotValidator),
    items: v.array(
      v.object({
        foodId: v.id("foods"),
        servings: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const templateId = await ctx.db.insert("mealTemplates", {
      userId,
      name: args.name,
      defaultSlot: args.defaultSlot,
    });

    for (const item of args.items) {
      await ctx.db.insert("mealTemplateItems", {
        templateId,
        foodId: item.foodId,
        servings: item.servings,
      });
    }

    return templateId;
  },
});

export const update = mutation({
  args: {
    id: v.id("mealTemplates"),
    name: v.string(),
    defaultSlot: v.optional(mealSlotValidator),
    items: v.array(
      v.object({
        foodId: v.id("foods"),
        servings: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const template = await ctx.db.get(args.id);
    if (!template || template.userId !== userId) {
      throw new Error("Template not found");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      defaultSlot: args.defaultSlot,
    });

    const existingItems = await ctx.db
      .query("mealTemplateItems")
      .withIndex("by_templateId", (q) => q.eq("templateId", args.id))
      .take(50);

    for (const item of existingItems) {
      await ctx.db.delete(item._id);
    }

    for (const item of args.items) {
      await ctx.db.insert("mealTemplateItems", {
        templateId: args.id,
        foodId: item.foodId,
        servings: item.servings,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("mealTemplates") },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const template = await ctx.db.get(args.id);
    if (!template || template.userId !== userId) {
      throw new Error("Template not found");
    }

    const items = await ctx.db
      .query("mealTemplateItems")
      .withIndex("by_templateId", (q) => q.eq("templateId", args.id))
      .take(50);

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const logTemplate = mutation({
  args: {
    templateId: v.id("mealTemplates"),
    date: v.string(),
    mealSlot: mealSlotValidator,
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserOrThrow(ctx);
    const template = await ctx.db.get(args.templateId);
    if (!template || template.userId !== userId) {
      throw new Error("Template not found");
    }

    const items = await ctx.db
      .query("mealTemplateItems")
      .withIndex("by_templateId", (q) => q.eq("templateId", args.templateId))
      .take(50);

    for (const item of items) {
      const food = await ctx.db.get(item.foodId);
      if (!food) continue;

      await ctx.db.insert("mealEntries", {
        userId,
        date: args.date,
        mealSlot: args.mealSlot,
        foodId: item.foodId,
        foodName: food.name,
        servings: item.servings,
        kcal: Math.round(food.kcal * item.servings),
        protein: Math.round(food.protein * item.servings * 10) / 10,
        carbs: Math.round(food.carbs * item.servings * 10) / 10,
        fat: Math.round(food.fat * item.servings * 10) / 10,
      });
    }
  },
});
