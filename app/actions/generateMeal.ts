"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Recipe {
  title: string;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
}

export async function generateRecipe(ingredientsInput: string, mood: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "Missing API Key" };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-2.5-flash"];

    const prompt = `
      You are a helpful family chef. Generate 1 practical recipe based on these inputs:
      - Ingredients on hand: ${ingredientsInput || "Any basic household ingredients"}
      - Preference/Mood: ${mood || "Quick and Easy"}

      Return ONLY valid JSON with this exact structure (no markdown code blocks, no extra text):
      {
        "title": "Recipe Title",
        "prepTime": "20 mins",
        "ingredients": ["Item 1", "Item 2"],
        "instructions": ["Step 1", "Step 2"]
      }
    `;

    let lastError = null;
    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: "application/json" }
        });
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const recipe: Recipe = JSON.parse(text);

        return { success: true, recipe };
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    throw lastError;
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to generate recipe." };
  }
}