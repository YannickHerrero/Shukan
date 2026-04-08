import { mutation } from "./_generated/server";
import { getUserOrThrow } from "./lib/auth";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getUserOrThrow(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
