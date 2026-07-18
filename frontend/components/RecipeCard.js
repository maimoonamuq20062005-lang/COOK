"use client";

/**
 * RecipeCard — Ultra-premium recipe card with large image,
 * hover lift, match badge, and vibrant orange CTA button.
 */

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import MatchBadge from "./MatchBadge";

export default function RecipeCard({ recipe, index = 0, isViewed = false, onUnfavorite, hideBadge = false }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("smartmeal_favorites") || "[]");
      setIsFavorite(saved.some((r) => r.id === recipe.id));
    }
  }, [recipe.id]);

  const toggleFavorite = (e) => {
    e.preventDefault(); // Prevent navigating to detail page
    if (typeof window === "undefined") return;

    const saved = JSON.parse(localStorage.getItem("smartmeal_favorites") || "[]");
    if (isFavorite) {
      const newSaved = saved.filter((r) => r.id !== recipe.id);
      localStorage.setItem("smartmeal_favorites", JSON.stringify(newSaved));
      setIsFavorite(false);
      if (onUnfavorite) onUnfavorite(recipe.id);
    } else {
      const newSaved = [...saved, { id: recipe.id, title: recipe.title, image: recipe.image, badge: recipe.badge, badge_text: recipe.badge_text }];
      localStorage.setItem("smartmeal_favorites", JSON.stringify(newSaved));
      setIsFavorite(true);
    }
  };

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="card-animate group flex flex-col overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/5 ring-1 ring-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:ring-orange-200"
      style={{ "--delay": `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">🍽️</div>
        )}

        {/* Viewed indicator */}
        {isViewed && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-600 shadow-md backdrop-blur-sm z-10">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Viewed
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorite ? "#ef4444" : "none"}
            stroke={isFavorite ? "#ef4444" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-colors ${isFavorite ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5 pb-4">
        <h3 className="font-heading text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-orange-600 line-clamp-2">
          {recipe.title}
        </h3>

        <div className="mt-auto">
          {!hideBadge && <MatchBadge badge={recipe.badge} badgeText={recipe.badge_text} />}
        </div>
      </div>

      {/* Orange CTA button */}
      <div className="px-5 pb-5">
        <span className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-300 group-hover:bg-orange-600 group-hover:shadow-lg group-hover:shadow-orange-500/30">
          See Full Details
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
