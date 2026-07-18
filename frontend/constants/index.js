/**
 * SmartMeal — Centralized Constants
 *
 * API config, badge styles, comparison callout themes, and nutrition stat config.
 * All premium styling tokens used across components live here.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
// ---------------------------------------------------------------------------
// Badge Styles — maps emoji to premium pill colors
// ---------------------------------------------------------------------------
export const BADGE_STYLES = {
  "✅": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  "🟡": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  "🔴": { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-300" },
};

export const BADGE_STYLE_DEFAULT = {
  bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300",
};

// ---------------------------------------------------------------------------
// Comparison Callout Colors — vibrant premium floating cards
// ---------------------------------------------------------------------------
export const COMPARISON_CALLOUTS = [
  {
    key: "healthiest_overall",
    label: "Healthiest Overall",
    emoji: "💚",
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-900",
    accent: "text-emerald-600",
    iconBg: "bg-emerald-500",
  },
  {
    key: "best_for_weight_loss",
    label: "Best for Weight Loss",
    emoji: "🏃",
    bg: "bg-gradient-to-br from-teal-50 to-cyan-100",
    border: "border-teal-200",
    text: "text-teal-900",
    accent: "text-teal-600",
    iconBg: "bg-teal-500",
  },
  {
    key: "best_for_weight_gain",
    label: "Best for Weight Gain",
    emoji: "📈",
    bg: "bg-gradient-to-br from-amber-50 to-orange-100",
    border: "border-amber-200",
    text: "text-amber-900",
    accent: "text-amber-600",
    iconBg: "bg-amber-500",
  },
  {
    key: "best_for_muscle_gain",
    label: "Best for Muscle Gain",
    emoji: "💪",
    bg: "bg-gradient-to-br from-indigo-50 to-violet-100",
    border: "border-indigo-200",
    text: "text-indigo-900",
    accent: "text-indigo-600",
    iconBg: "bg-indigo-500",
  },
];

// ---------------------------------------------------------------------------
// Nutrition Stat Config — premium floating stat cards
// ---------------------------------------------------------------------------
export const NUTRITION_STATS = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    emoji: "🔥",
    bg: "bg-gradient-to-br from-orange-50 to-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
    iconBg: "bg-orange-500",
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    emoji: "🥩",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    iconBg: "bg-blue-500",
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    emoji: "🍞",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-100",
    text: "text-amber-800",
    border: "border-amber-200",
    iconBg: "bg-amber-500",
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    emoji: "🧈",
    bg: "bg-gradient-to-br from-rose-50 to-pink-100",
    text: "text-rose-800",
    border: "border-rose-200",
    iconBg: "bg-rose-500",
  },
];
