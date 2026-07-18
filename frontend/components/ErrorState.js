/**
 * ErrorState — Elegant error card with retry.
 */

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="card-animate mx-auto w-full max-w-md">
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 to-red-50 p-10 text-center shadow-xl shadow-rose-500/5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500 text-3xl text-white shadow-lg shadow-rose-500/25">
          ⚠️
        </div>
        <div>
          <h3 className="font-heading text-xl font-black text-rose-900">Something Went Wrong</h3>
          <p className="mt-2 text-sm leading-relaxed text-rose-600">
            {message || "We couldn\u2019t complete your request. Please check your connection and try again."}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-full border-2 border-rose-300 bg-white px-6 py-2.5 text-sm font-bold text-rose-700 shadow-md transition-all duration-300 hover:bg-rose-50 hover:shadow-lg hover:scale-[1.03] active:scale-[0.97]"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
