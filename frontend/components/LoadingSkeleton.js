/**
 * LoadingSkeleton — Premium shimmer loading placeholders.
 * Matches the exact shapes of the premium card/detail layouts.
 */

export default function LoadingSkeleton({ type = "card", count = 6 }) {
  if (type === "detail") return <DetailSkeleton />;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/5 ring-1 ring-gray-100">
      <div className="skeleton-shimmer aspect-[4/3] w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton-shimmer h-5 w-4/5 rounded-lg" />
        <div className="skeleton-shimmer h-5 w-3/5 rounded-lg" />
        <div className="skeleton-shimmer mt-2 h-7 w-2/5 rounded-full" />
      </div>
      <div className="px-5 pb-5">
        <div className="skeleton-shimmer h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 pt-28">
      <div className="skeleton-shimmer h-10 w-28 rounded-full" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="skeleton-shimmer aspect-square w-full rounded-3xl" />
        <div className="space-y-6 py-4">
          <div className="skeleton-shimmer h-10 w-4/5 rounded-xl" />
          <div className="flex gap-3">
            <div className="skeleton-shimmer h-10 w-28 rounded-full" />
            <div className="skeleton-shimmer h-10 w-28 rounded-full" />
          </div>
          <div className="space-y-3 pt-4">
            <div className="skeleton-shimmer h-6 w-32 rounded-lg" />
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton-shimmer h-5 rounded-lg" style={{ width: `${90 - i * 8}%` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton-shimmer h-36 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
