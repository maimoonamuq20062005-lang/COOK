/**
 * MatchBadge — Premium match indicator pill.
 */

import { BADGE_STYLES, BADGE_STYLE_DEFAULT } from "@/constants";

export default function MatchBadge({ badge, badgeText }) {
  const emojiKey = badge?.includes("✅") ? "✅" : badge?.includes("🟡") ? "🟡" : badge?.includes("🔴") ? "🔴" : null;
  const style = (emojiKey && BADGE_STYLES[emojiKey]) || BADGE_STYLE_DEFAULT;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wide ${style.bg} ${style.text} ${style.border}`}>
      {badgeText || badge}
    </span>
  );
}
