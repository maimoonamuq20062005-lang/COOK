"use client";

/**
 * SearchBar — Premium pill-shaped search with vibrant orange CTA.
 *
 * Features glassmorphism card wrapper, focus glow animation,
 * and integrated loading state.
 */

import { useState } from "react";

export default function SearchBar({ onSearch, isLoading = false, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !isLoading) onSearch(trimmed);
  };

  return (
    <div className="search-glow mx-auto w-full max-w-2xl rounded-full border border-gray-200 bg-white p-2 shadow-2xl shadow-black/5 transition-all duration-300 focus-within:border-orange-300 focus-within:shadow-orange-500/10">
      <div className="flex items-center gap-3 pl-5 pr-1">
        {/* Search icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" className="shrink-0">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isLoading}
          placeholder="Type ingredients — chicken, rice, garlic..."
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-gray-800 placeholder:text-gray-400 outline-none disabled:opacity-50"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          className="shrink-0 rounded-full bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:bg-orange-600 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              Searching...
            </span>
          ) : (
            "Search Recipes"
          )}
        </button>
      </div>
    </div>
  );
}
