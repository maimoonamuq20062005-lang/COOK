"use client";

/**
 * Header — Ultra-premium sticky glassmorphism navigation.
 *
 * Bold "Cook." logo on the left, navigation links in center,
 * vibrant orange "Start Cooking" CTA on the right.
 * Transitions to more opaque on scroll.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, sectionId) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-xl"
          : "bg-white/50 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-foreground)] transition-colors group-hover:text-orange-500">
            Cook
          </span>
          <span className="text-2xl sm:text-3xl font-black text-orange-500">.</span>
        </Link>

        {/* Center nav — hidden on mobile */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            Home
          </Link>
          <Link
            href="/#search-section"
            onClick={(e) => handleNavClick(e, "search-section")}
            className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            Search Recipes
          </Link>
          <Link
            href="/favorites"
            className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            Favorites
          </Link>
          <Link
            href="/#about-section"
            onClick={(e) => handleNavClick(e, "about-section")}
            className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-orange-500"
          >
            How It Works
          </Link>
        </nav>

        {/* CTA */}
        <Link
          href="/#search-section"
          onClick={(e) => handleNavClick(e, "search-section")}
          className="whitespace-nowrap rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.03] active:scale-[0.97] sm:px-6 sm:py-2.5 sm:text-sm"
        >
          Start Cooking
        </Link>
      </div>
    </header>
  );
}
