"use client";

/**
 * Favorites Page — app/favorites/page.js
 */

import { useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import EmptyState from "@/components/EmptyState";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("smartmeal_favorites") || "[]");
      setFavorites(saved);
      setHasLoaded(true);
    }
  }, []);

  const handleUnfavorite = (id) => {
    setFavorites((prev) => prev.filter((r) => r.id !== id));
  };

  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="h-64 w-full animate-pulse rounded-3xl bg-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">
            Your Collection
          </span>
          <h1 className="font-heading text-4xl font-black text-gray-900 sm:text-5xl">
            Saved Recipes
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            {favorites.length} {favorites.length === 1 ? "recipe" : "recipes"} saved
          </p>
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            title="No Saved Recipes Yet"
            description="When you find a recipe you love, click the heart icon to save it here for easy access."
            icon="❤️"
          />
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={index}
                onUnfavorite={handleUnfavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
