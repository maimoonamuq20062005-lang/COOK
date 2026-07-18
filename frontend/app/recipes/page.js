"use client";

import CuratedRow from "@/components/CuratedRow";
import PopularRecipes from "@/components/PopularRecipes";
import HowItWorks from "@/components/HowItWorks";

export default function RecipesPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-extrabold">Explore Recipes</h1>
          <p className="mt-2 text-stone-600">Browse curated lists and discover recipes tailored to your pantry.</p>
        </div>

        <CuratedRow label="Quick Picks" ingredients="chicken,rice,garlic" />
        <CuratedRow label="High Protein" ingredients="chicken,eggs,quinoa" />
        <PopularRecipes recipes={null} />

        <HowItWorks />
      </div>
    </div>
  );
}
