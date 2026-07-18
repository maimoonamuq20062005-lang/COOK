"use client";

/**
 * ToastContext — Beautiful floating notification system.
 *
 * Any component can call showToast(message, type) to display a
 * premium slide-in toast that auto-dismisses after 4 seconds.
 */

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    // Auto-dismiss after 4s
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 400);
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${
              toast.exiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
            } ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
                : toast.type === "error"
                ? "border-rose-200 bg-rose-50/95 text-rose-800"
                : "border-orange-200 bg-orange-50/95 text-orange-800"
            }`}
            style={{
              animation: toast.exiting ? "toast-slide-out 0.4s ease forwards" : "toast-slide-in 0.4s ease forwards",
              minWidth: "300px",
            }}
          >
            <span className="text-xl">
              {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "🔔"}
            </span>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="ml-2 rounded-full p-1 transition-colors hover:bg-black/10"
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
