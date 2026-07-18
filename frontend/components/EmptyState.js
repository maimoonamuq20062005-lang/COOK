/**
 * EmptyState — Elegant pre-search prompt or generic empty state.
 */

export default function EmptyState({ 
  title = "Ready to Discover Recipes?", 
  description = "Enter the ingredients from your kitchen above and we will instantly match you with delicious recipes you can cook tonight. No more wasted food, no more last-minute grocery runs.",
  icon = "🥘"
}) {
  return (
    <div className="card-animate flex flex-col items-center gap-6 py-20 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-100 text-5xl shadow-lg shadow-orange-500/10">
        {icon}
      </div>
      <div>
        <h3 className="font-heading text-2xl font-black text-gray-900">
          {title}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}
