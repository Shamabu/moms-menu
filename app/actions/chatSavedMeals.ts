"use server";

import { db } from "@/db";
import { recipes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function askSavedMealsAgent(prompt: string) {
  try {
    const savedRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.isCustom, true));

    if (savedRecipes.length === 0) {
      return {
        success: true,
        answer: "You don't have any saved meals in your database yet! Add a custom meal first, and then I can help analyze it for you.",
      };
    }

    const formattedRecipes = savedRecipes
      .map((r, idx) => {
        return `Recipe #${idx + 1}: ${r.title}\nPrep Time: ${r.prepTime}\nIngredients: ${r.ingredients.join(", ")}\nInstructions: ${r.instructions.join(" ")}`;
      })
      .join("\n\n---\n\n");

    const systemPrompt = `
You are the official "Mom's Menu" AI Assistant.
Below is the complete list of custom recipes currently saved in the user's PostgreSQL database:

${formattedRecipes}

User Question: "${prompt}"

Provide a helpful, direct, and enthusiastic answer based on the user's saved meals above.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
    });

    return { success: true, answer: response.text };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}