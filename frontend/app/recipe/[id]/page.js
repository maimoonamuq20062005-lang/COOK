"use client";

/**
 * Recipe Detail Page — app/recipe/[id]/page.js
 *
 * High-end editorial layout:
 *  - Desktop: 50/50 split — massive square image left, content right
 *  - Mobile: stacked — image on top, content below
 *  - Floating nutrition stat cards
 *  - Premium ingredient list with custom bullets
 *  - Safely rendered HTML instructions from Spoonacular
 */

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getRecipeDetail, getSubstitutes } from "@/lib/api";
import { useRecipeContext } from "@/context/RecipeContext";

import NutritionPanel from "@/components/NutritionPanel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";

export default function RecipeDetailPage({ params }) {
  const router = useRouter();
  const { addViewedRecipe } = useRecipeContext();
  const { id } = use(params);

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New states
  const [isFavorite, setIsFavorite] = useState(false);
  const [substitutes, setSubstitutes] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function fetchRecipe() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRecipeDetail(id);
        if (!cancelled) {
          setRecipe(data);
          if (data.nutrition) addViewedRecipe(data.id, data.title, data.nutrition);
          
          if (typeof window !== "undefined") {
            const saved = JSON.parse(localStorage.getItem("smartmeal_favorites") || "[]");
            setIsFavorite(saved.some((r) => r.id === data.id));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load recipe details.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchRecipe();
    return () => { cancelled = true; };
  }, [id, addViewedRecipe]);

  const handleRetry = () => {
    setRecipe(null);
    setIsLoading(true);
    setError(null);
    getRecipeDetail(id)
      .then((data) => {
        setRecipe(data);
        if (data.nutrition) addViewedRecipe(data.id, data.title, data.nutrition);
        
        if (typeof window !== "undefined") {
          const saved = JSON.parse(localStorage.getItem("smartmeal_favorites") || "[]");
          setIsFavorite(saved.some((r) => r.id === data.id));
        }
      })
      .catch((err) => setError(err.message || "Failed to load recipe details."))
      .finally(() => setIsLoading(false));
  };

  if (isLoading) {
    return <LoadingSkeleton type="detail" />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 pt-20">
        <ErrorState message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (!recipe) return null;

  const toggleFavorite = () => {
    if (typeof window === "undefined") return;
    const saved = JSON.parse(localStorage.getItem("smartmeal_favorites") || "[]");
    if (isFavorite) {
      const newSaved = saved.filter((r) => r.id !== recipe.id);
      localStorage.setItem("smartmeal_favorites", JSON.stringify(newSaved));
      setIsFavorite(false);
    } else {
      const newSaved = [...saved, { id: recipe.id, title: recipe.title, image: recipe.image, badge: recipe.badge, badge_text: recipe.badge_text }];
      localStorage.setItem("smartmeal_favorites", JSON.stringify(newSaved));
      setIsFavorite(true);
    }
  };

  const handleSubstituteClick = async (ingredient, index) => {
    if (substitutes[index]) {
      setSubstitutes(prev => ({
        ...prev,
        [index]: { ...prev[index], open: !prev[index].open }
      }));
      return;
    }

    setSubstitutes(prev => ({
      ...prev,
      [index]: { loading: true, data: null, error: null, open: true }
    }));

    try {
      const coreName = ingredient
        .replace(/^[\d\.\/]+\s*(cups?|tablespoons?|tbsp|teaspoons?|tsp|grams?|g|oz|ounces?|pounds?|lbs?|cloves?|pinches?|handfuls?)?\s*/i, '')
        .trim();

      const result = await getSubstitutes(coreName);
      setSubstitutes(prev => ({
        ...prev,
        [index]: { loading: false, data: result.substitutes, error: null, open: true }
      }));
    } catch (err) {
      setSubstitutes(prev => ({
        ...prev,
        [index]: { loading: false, data: null, error: err.message, open: true }
      }));
    }
  };

  return (
    <div className="bg-white pt-20">
      {/* ── Back Button ── */}
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 shadow-md transition-all duration-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-lg hover:scale-[1.03] active:scale-[0.97]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Recipes
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SPLIT LAYOUT — Image + Content
          ══════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">

          {/* ── Left: Recipe Image ── */}
          <div className="card-animate relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/10 ring-1 ring-black/5">
              {recipe.image ? (
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-orange-50 text-8xl">🍽️</div>
              )}
            </div>

            {/* Floating meta tags over image */}
            <div className="absolute -bottom-5 left-4 right-4 flex flex-wrap gap-3 sm:left-6 sm:right-6">
              {recipe.servings && (
                <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-5 py-3 shadow-xl backdrop-blur-md">
                  <span className="text-xl">🍽️</span>
                  <div>
                    <p className="text-lg font-black text-gray-900">{recipe.servings}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Servings</p>
                  </div>
                </div>
              )}

              {recipe.ready_in_minutes && (
                <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-5 py-3 shadow-xl backdrop-blur-md">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <p className="text-lg font-black text-gray-900">{recipe.ready_in_minutes} min</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Prep Time</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Content ── */}
          <div className="card-animate py-2" style={{ "--delay": "150ms" }}>
            <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">
              Recipe Details
            </span>

            <div className="flex items-start justify-between gap-4">
              <h1 className="font-heading text-3xl font-black leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {recipe.title}
              </h1>
              
              <button
                onClick={toggleFavorite}
                className="mt-2 shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500 transition-all hover:scale-110 active:scale-95 hover:bg-orange-100"
                aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isFavorite ? "text-red-500" : "text-orange-500"}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* ── Ingredients ── */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-5 flex items-center gap-2 font-heading text-xl font-black text-gray-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm text-white">🥘</span>
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li
                      key={i}
                      className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white px-5 py-3.5 shadow-md shadow-black/3 transition-all duration-200 hover:bg-orange-50/50 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-600">
                          {i + 1}
                        </span>
                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-sm font-medium text-gray-700">{ingredient}</span>
                          <button 
                            onClick={() => handleSubstituteClick(ingredient, i)}
                            className="text-xs font-semibold text-orange-500 hover:text-orange-600 text-left sm:text-right"
                          >
                            Substitute?
                          </button>
                        </div>
                      </div>
                      
                      {/* Substitute Panel */}
                      {substitutes[i]?.open && (
                        <div className="ml-12 mt-2 rounded-xl bg-orange-50 p-4 border border-orange-100">
                          {substitutes[i].loading ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin text-orange-500">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
                                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                              </svg>
                              Finding substitutes...
                            </div>
                          ) : substitutes[i].error ? (
                            <div className="text-sm text-red-600">
                              {substitutes[i].error}
                              <button onClick={() => handleSubstituteClick(ingredient, i)} className="ml-2 underline font-semibold">Retry</button>
                            </div>
                          ) : substitutes[i].data ? (
                            <div className="space-y-3">
                              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Suggested Substitutes:</p>
                              <ul className="space-y-2">
                                {substitutes[i].data.map((sub, idx) => (
                                  <li key={idx} className="text-sm">
                                    <span className="font-bold text-gray-900">{sub.name}</span>
                                    <span className="text-gray-600 block text-xs mt-0.5">{sub.note}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Instructions ── */}
            {recipe.instructions && (
              <div className="mt-10">
                <h2 className="mb-5 flex items-center gap-2 font-heading text-xl font-black text-gray-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm text-white">📝</span>
                  Cooking Method
                </h2>
                <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-lg shadow-black/3">
                  <div
                    className="recipe-instructions"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          NUTRITION PANEL — Full-width floating cards
          ══════════════════════════════════════════════════════════════ */}
      {recipe.nutrition && (
        <div className="bg-[var(--color-background-cream)] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">
                Nutrition Facts
              </span>
              <h2 className="font-heading text-3xl font-black text-gray-900 sm:text-4xl">
                Macros Per Serving
              </h2>
              <p className="mt-2 text-gray-500">
                Full nutritional breakdown so you can cook with confidence.
              </p>
            </div>
            <NutritionPanel nutrition={recipe.nutrition} />
          </div>
        </div>
      )}
    </div>
  );
}
