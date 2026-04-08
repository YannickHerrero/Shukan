import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const mealSlotValidator = v.union(
  v.literal("breakfast"),
  v.literal("lunch"),
  v.literal("dinner"),
  v.literal("snacks"),
);

export default defineSchema({
  ...authTables,

  foods: defineTable({
    userId: v.string(),
    name: v.string(),
    brand: v.optional(v.string()),
    kcal: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    defaultServingSize: v.number(),
    servingUnit: v.string(),
    barcode: v.optional(v.string()),
    isFavorite: v.boolean(),
    lastUsedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_isFavorite", ["userId", "isFavorite"])
    .index("by_userId_and_lastUsedAt", ["userId", "lastUsedAt"])
    .index("by_userId_and_barcode", ["userId", "barcode"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    }),

  mealEntries: defineTable({
    userId: v.string(),
    date: v.string(),
    mealSlot: mealSlotValidator,
    foodId: v.id("foods"),
    foodName: v.string(),
    servings: v.number(),
    kcal: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
  })
    .index("by_userId_and_date", ["userId", "date"])
    .index("by_userId_and_date_and_mealSlot", ["userId", "date", "mealSlot"]),

  quickAdds: defineTable({
    userId: v.string(),
    date: v.string(),
    mealSlot: mealSlotValidator,
    kcal: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    note: v.optional(v.string()),
  }).index("by_userId_and_date", ["userId", "date"]),

  userGoals: defineTable({
    userId: v.string(),
    dailyKcal: v.number(),
    dailyProtein: v.number(),
    dailyCarbs: v.number(),
    dailyFat: v.number(),
  }).index("by_userId", ["userId"]),
});
