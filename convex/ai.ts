"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const recognizeFood = action({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("File not found");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this food image. Return a JSON object with these fields:
- name: string (food name)
- kcal: number (estimated calories per serving)
- protein: number (grams)
- carbs: number (grams)
- fat: number (grams)
- servingSize: number (estimated serving size)
- servingUnit: string (e.g. "g", "piece", "cup")

Return ONLY the JSON object, no markdown or explanation.`,
              },
              {
                type: "image_url",
                image_url: { url },
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content ?? "";

    try {
      const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      throw new Error("Failed to parse AI response");
    }
  },
});
