"use client";

/**
 * Footer — Massive premium footer with newsletter signup, branding,
 * navigation columns, and organic background shapes.
 * Newsletter subscribe triggers a working toast notification.
 */

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setSubscribed(true);
    setEmail("");
    showToast("Welcome to the SmartMeal family! Check your inbox for your first recipe inspiration.", "success");
  };

  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gray-900 text-white">
      {/* Organic background blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl blob-animation" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl blob-animation" style={{ animationDelay: "-7s" }} aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/5 blur-3xl blob-animation" style={{ animationDelay: "-13s" }} aria-hidden="true" />

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400">
              Stay Inspired
            </span>
            <h3 className="font-heading text-3xl font-black sm:text-4xl">
              Join Our Newsletter
            </h3>
            <p className="mt-3 text-gray-400">
              Get weekly recipe inspiration, seasonal ingredient guides, and exclusive cooking tips delivered straight to your inbox. Over 25,000 home cooks already subscribe.
            </p>

            {subscribed ? (
              <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-6 py-3 text-sm font-bold text-emerald-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                You are subscribed! Watch your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 outline-none backdrop-blur-sm transition-colors focus:border-orange-500 focus:bg-white/15"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:bg-orange-600 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="font-heading text-2xl font-black">Cook</span>
              <span className="text-2xl font-black text-orange-500">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              The smartest way to cook at home. Turn the ingredients you already have into restaurant-quality meals — no waste, no stress, just great food.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Home</Link></li>
              <li><a href="#search-section" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Search Recipes</a></li>
              <li><a href="#about-section" className="text-sm text-gray-400 transition-colors hover:text-orange-400">How It Works</a></li>
              <li><a href="#recipes-section" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Popular Recipes</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Cooking Tips</a></li>
              <li><a href="#" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Nutrition Guide</a></li>
              <li><a href="#" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Ingredient Glossary</a></li>
              <li><a href="#" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Meal Planning</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-gray-400 transition-colors hover:text-orange-400">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {year} SmartMeal. Crafted with 🧡 for home cooks everywhere.
          </p>
          <p className="text-xs text-gray-600">
            Powered by real recipes. Built for real kitchens.
          </p>
        </div>
      </div>
    </footer>
  );
}
