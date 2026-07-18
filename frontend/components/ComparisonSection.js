"use client";

/**
 * ComparisonSection — Always-visible comparison with locked/unlocked states.
 *
 * LOCKED  (0–1 recipes opened): lock icon, progress text, greyed-out button.
 * UNLOCKED (2+ recipes opened): active button, compare API call, results.
 */

import { useState } from "react";
import { compareRecipes } from "@/lib/api";
import { COMPARISON_CALLOUTS } from "@/constants";

export default function ComparisonSection({ viewedRecipes }) {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const viewedList = Object.values(viewedRecipes || {});
  const viewedCount = viewedList.length;
  const canCompare = viewedCount >= 2;

  const handleCompare = async () => {
    if (!canCompare) return;
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const payload = viewedList.map((r) => ({
        title: r.title,
        calories: r.nutrition.calories,
        protein: r.nutrition.protein,
        carbs: r.nutrition.carbs,
        fat: r.nutrition.fat,
      }));
      const data = await compareRecipes(payload);
      setResults(data);
    } catch (err) {
      setError(err.message || "Comparison failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Lock icon (inline SVG) ── */
  const LockIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  /* ── Unlocked icon ── */
  const UnlockedIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-orange-500"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );

  return (
    <section className="w-full">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">
          Smart Compare
        </span>
        <h2 className="font-heading text-3xl font-black text-gray-900 sm:text-4xl">
          Compare Recipes
        </h2>

        {/* ── LOCKED state ── */}
        {!canCompare && (
          <div className="card-animate mx-auto mt-8 max-w-lg">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-8 text-center">
              {/* Lock icon centered */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <LockIcon />
              </div>

              {/* Progress text */}
              <p className="text-sm font-medium text-gray-600">
                {viewedCount === 0
                  ? "Open 2 recipes to unlock comparison"
                  : "Open 1 more recipe to unlock comparison"}
              </p>

              {/* Progress bar */}
              <div className="mx-auto mt-4 flex max-w-xs items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-orange-400 transition-all duration-500 ease-out"
                    style={{ width: `${(viewedCount / 2) * 100}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs font-bold text-gray-500">
                  {viewedCount}/2 opened
                </span>
              </div>

              {/* Disabled button */}
              <button
                disabled
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-bold text-white opacity-30 cursor-not-allowed"
              >
                Compare These Recipes
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── UNLOCKED state ── */}
        {canCompare && (
          <>
            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              {viewedList.length} recipes ready — compare their nutrition to find the best match for your health goals.
            </p>

            {/* Unlocked icon + badge */}
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <UnlockedIcon />
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                Unlocked
              </span>
            </div>

            {!results && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {viewedList.map((r, i) => (
                  <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {r.title}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleCompare}
              disabled={isLoading}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-black/10 transition-all duration-300 hover:bg-gray-800 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                  Analyzing Nutrition...
                </>
              ) : (
                <>
                  Compare These Recipes
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="mx-auto mb-8 max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center text-sm font-medium text-rose-700 shadow-lg">
          {error}
        </div>
      )}

      {results && (
        <div className="card-animate space-y-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COMPARISON_CALLOUTS.map((callout) => (
              <div
                key={callout.key}
                className={`group flex flex-col items-center gap-3 rounded-3xl border p-7 text-center shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${callout.bg} ${callout.border}`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white shadow-md ${callout.iconBg}`}>
                  {callout.emoji}
                </div>
                <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${callout.accent}`}>
                  {callout.label}
                </span>
                <span className={`text-lg font-bold leading-snug ${callout.text}`}>
                  {results[callout.key] || "—"}
                </span>
              </div>
            ))}
          </div>

          {results.summary && (
            <div className="mx-auto max-w-2xl rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-6 text-center shadow-lg">
              <p className="text-sm font-medium leading-relaxed text-gray-700">
                <span className="mr-2 text-lg">💡</span>
                {results.summary}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
