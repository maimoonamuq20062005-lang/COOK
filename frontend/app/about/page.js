"use client";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-extrabold">About Cook.</h1>
          <p className="mt-4 text-lg text-stone-600">Cook. helps you transform the ingredients you already have into chef-quality meals. We prioritize real recipes, clear nutrition, and simple tools to make cooking delightful.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-orange-100 p-6">
            <h3 className="font-semibold">Our Mission</h3>
            <p className="mt-2 text-sm text-stone-600">Reduce food waste and make healthy cooking accessible by matching pantry items to great recipes.</p>
          </div>
          <div className="rounded-2xl border border-orange-100 p-6">
            <h3 className="font-semibold">Privacy</h3>
            <p className="mt-2 text-sm text-stone-600">We store only local preferences in your browser and never sell your data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
