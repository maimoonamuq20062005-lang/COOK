/**
 * SmartMeal — Centralized API Layer
 *
 * Every backend call goes through this file. Components never use fetch()
 * directly — they import one of these three functions.
 */

import { API_BASE_URL } from "@/constants";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Shared fetch wrapper with error handling.
 * Throws an Error with a user-friendly message on non-2xx responses.
 */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(
      errorBody || `Request failed with status ${res.status}`
    );
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

/**
 * Search recipes by comma-separated ingredients.
 * GET /api/recipes/search?ingredients=chicken,rice,onion
 *
 * @param {string} ingredients — raw comma-separated string from the input
 * @returns {Promise<Object>} — { searched_ingredients, count, recipes }
 */
export async function searchRecipes(ingredients, options = {}) {
  // Clean up whitespace so the query param is tidy
  const cleaned = ingredients
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean)
    .join(",");

  if (!cleaned) throw new Error("Please enter at least one ingredient.");

  const params = new URLSearchParams({ ingredients: cleaned });
  if (options.macros) {
    const { maxCalories, minProtein } = options.macros;
    if (typeof maxCalories === "number") params.set("max_calories", String(maxCalories));
    if (typeof minProtein === "number") params.set("min_protein", String(minProtein));
  }

  return apiFetch(`${API_BASE_URL}/api/recipes/search?${params.toString()}`);
}

/**
 * Get full recipe details by ID.
 * GET /api/recipes/{recipe_id}
 *
 * @param {number|string} recipeId
 * @returns {Promise<Object>} — full recipe object with nutrition
 */
export async function getRecipeDetail(recipeId) {
  return apiFetch(`${API_BASE_URL}/api/recipes/${recipeId}`);
}

/**
 * Compare multiple recipes' nutrition.
 * POST /api/recipes/compare
 *
 * @param {Array<{title:string, calories:number, protein:number, carbs:number, fat:number}>} recipes
 * @returns {Promise<Object>} — comparison results with category winners + summary
 */
export async function compareRecipes(recipes) {
  if (!recipes || recipes.length < 2) {
    throw new Error("At least 2 recipes are needed for comparison.");
  }

  return apiFetch(`${API_BASE_URL}/api/recipes/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipes),
  });
}

/**
 * Get ingredient substitutes.
 * GET /api/recipes/substitute?ingredient={ingredient}
 *
 * @param {string} ingredient
 * @returns {Promise<Object>}
 */
export async function getSubstitutes(ingredient) {
  if (!ingredient) throw new Error("Ingredient name is required.");
  const params = new URLSearchParams({ ingredient });
  return apiFetch(`${API_BASE_URL}/api/recipes/substitute?${params.toString()}`);
}
