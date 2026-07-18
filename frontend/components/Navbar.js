/**
 * Navbar — Bold premium header with Cook. branding and CTA.
 */

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-orange-100/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-heading text-2xl font-extrabold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
            Cook<span className="text-orange-500">.</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 sm:flex">
          <Link href="/" className="text-sm font-medium hover:text-orange-500">Home</Link>
          <Link href="/recipes" className="text-sm font-medium hover:text-orange-500">Recipes</Link>
          <Link href="/favorites" className="text-sm font-medium hover:text-orange-500">Favorites</Link>
          <Link href="/compare" className="text-sm font-medium hover:text-orange-500">Compare</Link>
          <Link href="/about" className="text-sm font-medium hover:text-orange-500">About</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#search"
            className="hidden items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.03] active:scale-[0.98] sm:flex sm:px-6 sm:py-3 sm:text-base"
          >
            Start Cooking
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <Link href="/compare" className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-1.5 text-sm font-semibold text-orange-600 shadow-sm">Compare</Link>
        </div>
      </div>
    </nav>
  );
}
