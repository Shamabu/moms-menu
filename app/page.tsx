"use client";

import { useState, useEffect } from "react";
import { generateRecipe } from "@/app/actions/generateMeal";
import { getCustomRecipes } from "@/app/actions/recipeActions";
import AddMealModal from "@/app/components/AddMealModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"ai" | "custom">("ai");
  const [ingredients, setIngredients] = useState("");
  const [mood, setMood] = useState("Quick & Easy");
  const [aiRecipe, setAiRecipe] = useState<any>(null);
  const [customRecipes, setCustomRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch custom recipes from Neon PostgreSQL
  const loadCustomRecipes = async () => {
    const res = await getCustomRecipes();
    if (res.success && res.recipes) {
      setCustomRecipes(res.recipes);
    }
  };

  useEffect(() => {
    loadCustomRecipes();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    const res = await generateRecipe(ingredients, mood);
    if (res.success && res.recipe) {
      setAiRecipe(res.recipe);
    } else {
      setError(res.error || "Failed to generate recipe.");
    }
    setLoading(false);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-amber-900 tracking-tight">Mom's Menu 🍳</h1>
        <p className="text-amber-700 mt-2">AI Recipe Recommendations & Personal Family Recipes</p>
      </header>

      {/* Navigation Bar with Tabs & Add Custom Meal Button */}
      <div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-3">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("ai")}
            className={`text-sm font-semibold pb-2 transition-all ${
              activeTab === "ai"
                ? "text-amber-800 border-b-2 border-amber-600"
                : "text-gray-500 hover:text-amber-700"
            }`}
          >
            🤖 AI Generator
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`text-sm font-semibold pb-2 transition-all ${
              activeTab === "custom"
                ? "text-amber-800 border-b-2 border-amber-600"
                : "text-gray-500 hover:text-amber-700"
            }`}
          >
            📖 My Saved Meals ({customRecipes.length})
          </button>
        </div>

        {/* Add Custom Meal Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          + Add Custom Meal
        </button>
      </div>

      {/* AI Generator Tab */}
      {activeTab === "ai" && (
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 mb-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What's in your fridge/pantry?
              </label>
              <input
                type="text"
                placeholder="e.g. eggs, tomatoes, pasta, cheese..."
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Vibe / Filter</label>
              <div className="flex flex-wrap gap-2">
                {["Quick & Easy", "Kid Friendly", "Healthy & Clean", "Budget Friendly"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setMood(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                      mood === tag
                        ? "bg-amber-600 text-white"
                        : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50 text-sm"
            >
              {loading ? "Generating Meal Idea..." : "Find Me a Recipe ✨"}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center mb-8 text-sm">
              {error}
            </div>
          )}

          {aiRecipe && (
            <div className="bg-white p-8 rounded-2xl shadow-md border border-amber-100">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{aiRecipe.title}</h2>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                  ⏱️ {aiRecipe.prepTime}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-amber-900 mb-3 text-base">Ingredients</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {aiRecipe.ingredients.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-amber-900 mb-3 text-base">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    {aiRecipe.instructions.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Recipes Tab */}
      {activeTab === "custom" && (
        <div className="space-y-6">
          {customRecipes.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-amber-100">
              <p>No custom recipes added yet.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 text-amber-600 font-semibold text-sm hover:underline"
              >
                + Add your first recipe to PostgreSQL
              </button>
            </div>
          ) : (
            customRecipes.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                    ⏱️ {item.prepTime}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2 text-sm">Ingredients</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-xs">
                      {item.ingredients.map((ing: string, i: number) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2 text-sm">Instructions</h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700 text-xs">
                      {item.instructions.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRecipeAdded={loadCustomRecipes}
      />
    </main>
  );
}