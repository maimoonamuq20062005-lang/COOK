"use client";

import ComparisonSection from "@/components/ComparisonSection";
import { useRecipeContext } from "@/context/RecipeContext";

export default function ComparePage() {
  const { viewedRecipes } = useRecipeContext();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-extrabold">Compare Recipes</h1>
        </div>

        <div className="mx-auto max-w-4xl">
          <ComparisonSection viewedRecipes={viewedRecipes} />
        </div>
      </div>
    </div>
  );
}
