"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Check, X, ShoppingCart } from "lucide-react";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  toast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  let counter = 0;

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now() + counter++;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((i) => i.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-item flex items-center gap-3 bg-[#2C1810] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium pointer-events-auto"
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === "success" ? "bg-[#C9A84C]" : "bg-red-400"}`}>
              {t.type === "success" ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
