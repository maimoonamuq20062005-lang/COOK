"use client";

/**
 * Home Page — app/page.js
 *
 * Ultra-premium culinary homepage with:
 *  1. Immersive hero (50/50 split with chef image + search bar)
 *  2. About / Value Proposition section
 *  3. Popular Recipes grid (auto-populated with default search on mount)
 *  4. Comparison section (disabled until 2+ recipes clicked)
 *
 * All API logic uses existing context and lib/api.js functions.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

import { useRecipeContext } from "@/context/RecipeContext";
import { searchRecipes } from "@/lib/api";

import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import ComparisonSection from "@/components/ComparisonSection";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

export default function HomePage() {
  const {
    searchResults,
    setSearchResults,
    searchQuery,
    setSearchQuery,
    viewedRecipes,
  } = useRecipeContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isUserSearch, setIsUserSearch] = useState(false);
  const [hasSearchedManually, setHasSearchedManually] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  const resultsSectionRef = useRef(null);
  const viewedCount = Object.keys(viewedRecipes || {}).length;

  /* ---- Auto-dismiss the tip banner once user opens a recipe ---- */
  useEffect(() => {
    if (viewedCount >= 1) setHintDismissed(true);
  }, [viewedCount]);

  /* ---- Check sessionStorage on mount to persist dismissal ---- */
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("smartmeal-hint-dismissed")) {
      setHintDismissed(true);
    }
  }, []);

  const dismissHint = useCallback(() => {
    setHintDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("smartmeal-hint-dismissed", "1");
    }
  }, []);

  /* ---- Search handler ---- */
  const handleSearch = useCallback(
    async (ingredients, { userInitiated = true } = {}) => {
      setIsLoading(true);
      setError(null);
      setSearchQuery(ingredients);
      if (userInitiated) {
        setIsUserSearch(true);
        setHasSearchedManually(true);
      }
      try {
        const data = await searchRecipes(ingredients);
        setSearchResults(data);
      } catch (err) {
        setError(err.message || "Search failed. Please try again.");
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    [setSearchResults, setSearchQuery]
  );

  /* ---- Default search on mount ---- */
  useEffect(() => {
    if (!hasInitialized && !searchResults) {
      setHasInitialized(true);
      const defaults = [
        "chicken,rice,garlic",
        "pasta,tomato,basil",
        "salmon,lemon,asparagus",
        "beef,broccoli,soy sauce",
        "eggs,spinach,cheese"
      ];
      const randomQuery = defaults[Math.floor(Math.random() * defaults.length)];
      handleSearch(randomQuery, { userInitiated: false });
    }
  }, [hasInitialized, searchResults, handleSearch]);

  const handleRetry = useCallback(() => {
    if (searchQuery) handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  /* ---- Auto-scroll to results after a user-initiated search ---- */
  useEffect(() => {
    if (!isLoading && isUserSearch && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsUserSearch(false);
    }
  }, [isLoading, isUserSearch]);

  const recipes = searchResults?.recipes || [];
  const hasResults = recipes.length > 0;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION — Immersive 50/50 split
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white pt-20">
        {/* Organic blob decoration */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-[300px] w-[300px] rounded-full bg-orange-100/60 blur-3xl blob-animation sm:-right-32 sm:-top-32 sm:h-[500px] sm:w-[500px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[250px] w-[250px] rounded-full bg-amber-100/40 blur-3xl blob-animation sm:-left-40 sm:h-[400px] sm:w-[400px]" style={{ animationDelay: "-10s" }} aria-hidden="true" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:gap-16 lg:px-8 lg:py-24">
          {/* Left — Copy + Search */}
          <div className="flex-1 w-full text-center lg:text-left">
            <span className="mb-5 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">
              Smart Recipe Discovery
            </span>

            <h1 className="font-heading text-4xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-5xl md:text-6xl xl:text-7xl">
              Cook Like a Pro{" "}
              <span className="text-orange-500">with What You Have</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg lg:mx-0 lg:text-xl">
              Stop throwing away groceries. Enter the ingredients sitting in your fridge
              and we will instantly match you with chef-quality recipes — complete with
              nutrition breakdowns and smart comparisons.
            </p>

            {/* Search bar integrated into hero */}
            <div id="search-section" className="mx-auto mt-8 w-full max-w-md scroll-mt-28 sm:mt-10 lg:mx-0 lg:max-w-none">
              <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                initialValue={hasSearchedManually ? searchQuery : ""}
              />
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:justify-start">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <span className="text-base sm:text-lg">🍳</span> 10,000+ Recipes
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <span className="text-base sm:text-lg">⚡</span> Instant Results
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <span className="text-base sm:text-lg">📊</span> Nutrition Compare
              </div>
            </div>
          </div>

          {/* Right — Chef Image */}
          <div className="relative flex-1 w-full mt-6 sm:mt-8 lg:mt-0">
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-md lg:max-w-none">
              {/* Main image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-orange-500/15 ring-1 ring-black/5">
                <Image
                  src="/chef-hero.jpg"
                  alt="Professional chef wearing a crisp white chef suit"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:-left-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-xl text-white shadow-md">
                  🔥
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">98%</p>
                  <p className="text-xs font-medium text-gray-500">Match Accuracy</p>
                </div>
              </div>

              {/* Second floating card */}
              <div className="absolute -right-2 top-8 hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:-right-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-xl text-white shadow-md">
                  ✅
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">Fast</p>
                  <p className="text-xs font-medium text-gray-500">Under 2 Seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT / VALUE PROPOSITION
          ══════════════════════════════════════════════════════════════ */}
      <section id="about-section" className="relative overflow-hidden bg-[var(--color-background-cream)] py-20 sm:py-28">
        {/* Background blob */}
        <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-orange-200/30 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/10 ring-1 ring-black/5">
                <img
                  src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=600&fit=crop&q=80"
                  alt="Fresh colorful spices and cooking ingredients on a rustic wooden table"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -right-4 rounded-2xl bg-orange-500 px-6 py-4 shadow-xl shadow-orange-500/25 sm:-right-8">
                <p className="text-sm font-bold text-white">Zero Food Waste</p>
                <p className="text-xs text-orange-100">Cook what you already have</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">
                Why SmartMeal
              </span>
              <h2 className="font-heading text-3xl font-black leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Bringing Delicious Meals to Your Kitchen
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-500">
                We believe every ingredient deserves a second chance. SmartMeal connects the dots
                between what is in your pantry and thousands of chef-tested recipes — so you spend
                less time shopping and more time cooking incredible food.
              </p>

              {/* Value props grid */}
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {[
                  { icon: "🚀", title: "Lightning Fast", desc: "Results in under 2 seconds" },
                  { icon: "🥗", title: "Health Focused", desc: "Full nutrition on every recipe" },
                  { icon: "💰", title: "Save Money", desc: "No wasted groceries ever again" },
                ].map((prop) => (
                  <div
                    key={prop.title}
                    className="rounded-2xl border border-white/80 bg-white/80 p-6 shadow-lg shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
                      {prop.icon}
                    </div>
                    <h4 className="font-heading text-sm font-bold text-gray-900">{prop.title}</h4>
                    <p className="mt-1 text-xs text-gray-500">{prop.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          RECIPE RESULTS
          ══════════════════════════════════════════════════════════════ */}
      <section id="recipes-section" ref={resultsSectionRef} className="scroll-mt-20 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">
              Discover
            </span>
            <h2 className="font-heading text-3xl font-black text-gray-900 sm:text-4xl">
              {hasSearchedManually
                ? `Recipes You Can Make with ${searchResults?.searched_ingredients?.join(", ") || searchQuery || "Your Ingredients"}`
                : "Popular Recipes"}
            </h2>
            {hasResults && (
              <p className="mt-3 text-gray-500">
                Found <span className="font-bold text-gray-900">{searchResults?.count}</span> delicious recipes matching your ingredients
              </p>
            )}
          </div>

          {/* Content states */}
          {isLoading && <LoadingSkeleton type="card" count={6} />}

          {!isLoading && error && <ErrorState message={error} onRetry={handleRetry} />}

          {!isLoading && !error && !hasResults && !searchResults && <EmptyState />}

          {!isLoading && !error && searchResults && !hasResults && (
            <div className="card-animate py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-4xl">🫙</div>
              <h3 className="mt-5 font-heading text-xl font-black text-gray-900">No Recipes Found</h3>
              <p className="mt-2 text-sm text-gray-500">Try different ingredients or check your spelling.</p>
            </div>
          )}

          {!isLoading && !error && hasResults && (
            <>
              {/* ── Hint banner — compare feature discovery ── */}
              {!hintDismissed && (
                <div className="card-animate mb-8 flex items-center justify-between gap-4 rounded-2xl border border-orange-200/60 bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-3.5 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-base">💡</span>
                    <span><span className="font-bold text-orange-600">Tip:</span> Open 2 or more recipes below, then compare them to find the best one for your goals.</span>
                  </p>
                  <button
                    onClick={dismissHint}
                    className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-orange-100 hover:text-gray-600"
                    aria-label="Dismiss tip"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    index={index}
                    isViewed={!!viewedRecipes[recipe.id]}
                    hideBadge={!hasSearchedManually}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMPARISON SECTION — always visible once search has results
          ══════════════════════════════════════════════════════════════ */}
      {searchResults && (
        <section className="bg-[var(--color-background-cream)] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ComparisonSection viewedRecipes={viewedRecipes} />
          </div>
        </section>
      )}
    </>
  );
}
