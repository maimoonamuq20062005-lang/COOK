/**
 * NutritionPanel — Premium floating color-coded nutrition stat cards.
 */

import { NUTRITION_STATS } from "@/constants";

export default function NutritionPanel({ nutrition }) {
  if (!nutrition) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {NUTRITION_STATS.map((stat) => (
        <div
          key={stat.key}
          className={`card-animate group flex flex-col items-center gap-2 rounded-3xl border p-6 text-center shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${stat.bg} ${stat.border}`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl text-white shadow-md ${stat.iconBg}`}>
            {stat.emoji}
          </div>
          <span className={`text-3xl font-black tabular-nums ${stat.text}`}>
            {nutrition[stat.key] ?? "—"}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
