"use server";

import { db } from "@/db";
import { recipes } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export interface NewRecipeInput {
  title: string;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
}

// INSERT query: Add custom recipe
export async function addCustomRecipe(input: NewRecipeInput) {
  try {
    const [newRecipe] = await db
      .insert(recipes)
      .values({
        title: input.title,
        prepTime: input.prepTime,
        ingredients: input.ingredients,
        instructions: input.instructions,
        isCustom: true,
      })
      .returning();

    return { success: true, recipe: newRecipe };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// SELECT query: Fetch custom recipes from PostgreSQL
export async function getCustomRecipes() {
  try {
    const customList = await db
      .select()
      .from(recipes)
      .where(eq(recipes.isCustom, true))
      .orderBy(desc(recipes.createdAt));

    return { success: true, recipes: customList };
  } catch (error: any) {
    return { success: false, recipes: [], error: error.message };
  }
}