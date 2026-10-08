"use client";

import { useState } from "react";
import { addCustomRecipe } from "@/app/actions/recipeActions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRecipeAdded: () => void;
}

export default function AddMealModal({ isOpen, onClose, onRecipeAdded }: Props) {
  const [title, setTitle] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    const res = await addCustomRecipe({
      title,
      prepTime: prepTime || "15 mins",
      ingredients: ingredients.split(",").map((i) => i.trim()).filter(Boolean),
      instructions: instructions.split("\n").map((i) => i.trim()).filter(Boolean),
    });

    setLoading(false);

    if (res.success) {
      onRecipeAdded();
      onClose();
      setTitle("");
      setPrepTime("");
      setIngredients("");
      setInstructions("");
    } else {
      setError(res.error || "Failed to save recipe to database.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl border border-amber-100">
        <h2 className="text-xl font-bold text-amber-900 mb-4">Add Custom Recipe 📝</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Recipe Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Grandma's Meatballs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Prep Time</label>
            <input
              type="text"
              placeholder="e.g. 25 mins"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Ingredients (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Beef, Garlic, Tomato Sauce, Breadcrumbs"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Instructions (one step per line)
            </label>
            <textarea
              rows={3}
              placeholder="Mix ingredients&#10;Roll into balls&#10;Simmer in sauce"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm text-gray-800"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save to PostgreSQL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}