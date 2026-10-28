"use client";

import { useState } from "react";
import { askSavedMealsAgent } from "@/app/actions/chatSavedMeals";

export default function SavedMealsAgent() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer(null);

    const res = await askSavedMealsAgent(query);
    if (res.success && res.answer) {
      setAnswer(res.answer);
    } else {
      setAnswer("Failed to reach the agent. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200 mt-8 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🤖</span>
        <h3 className="text-lg font-bold text-amber-900">Ask Your Saved Meals Assistant</h3>
      </div>
      <p className="text-xs text-amber-700 mb-4">
        Ask anything about your saved recipes—prep times, ingredient substitutions, or custom meal plans!
      </p>

      <form onSubmit={handleAsk} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Which meal can I make in under 20 minutes?"
          className="flex-1 px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask Agent"}
        </button>
      </form>

      {answer && (
        <div className="bg-white p-4 rounded-xl border border-amber-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
}