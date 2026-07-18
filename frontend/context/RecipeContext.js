"use client";

/**
 * RecipeContext — Cross-page state for SmartMeal
 *
 * Stores:
 *  - searchResults: the most recent search response (recipes array, searched_ingredients, count)
 *  - viewedRecipes: Map of recipe ID → { title, nutrition } for recipes the user has opened
 *
 * The detail page calls `addViewedRecipe` after fetching nutrition data,
 * so the home page can build the payload for POST /api/recipes/compare.
 */

import { createContext, useContext, useState, useCallback } from "react";

const RecipeContext = createContext(null);

export function RecipeProvider({ children }) {
  // Full search response from GET /api/recipes/search
  const [searchResults, setSearchResults] = useState(null);

  // Searched ingredient string (preserved so we can show it on return)
  const [searchQuery, setSearchQuery] = useState("");

  // Map: recipeId → { title, nutrition: { calories, protein, carbs, fat } }
  const [viewedRecipes, setViewedRecipes] = useState({});

  /**
   * Save a recipe's nutrition after the user visits its detail page.
   * Called from the recipe detail page once data is fetched.
   */
  const addViewedRecipe = useCallback((id, title, nutrition) => {
    setViewedRecipes((prev) => ({
      ...prev,
      [id]: { title, nutrition },
    }));
  }, []);

  /**
   * Reset everything for a fresh search session.
   */
  const clearSession = useCallback(() => {
    setSearchResults(null);
    setSearchQuery("");
    setViewedRecipes({});
  }, []);

  return (
    <RecipeContext.Provider
      value={{
        searchResults,
        setSearchResults,
        searchQuery,
        setSearchQuery,
        viewedRecipes,
        addViewedRecipe,
        clearSession,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

/**
 * Hook for consuming RecipeContext.
 * Throws if used outside a RecipeProvider.
 */
export function useRecipeContext() {
  const ctx = useContext(RecipeContext);
  if (!ctx) {
    throw new Error("useRecipeContext must be used within a RecipeProvider");
  }
  return ctx;
}
