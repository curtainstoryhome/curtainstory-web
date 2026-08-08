"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ToastKind = "success" | "error";

type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastContextValue = {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

let nextId = 1;

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    // Errors linger longer — the user needs time to actually read what broke.
    const ms = toast.kind === "error" ? 7000 : 3500;
    const timer = setTimeout(() => onDismiss(toast.id), ms);
    return () => clearTimeout(timer);
  }, [toast.id, toast.kind, onDismiss]);

  const isError = toast.kind === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-bold text-white">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full ${
            isError ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isError ? "!" : "✓"}
        </span>
      </span>
      <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="ปิดการแจ้งเตือน"
        className="flex-none text-lg leading-none opacity-60 hover:opacity-100 rounded-full transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:scale-90"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((kind: ToastKind, message: string) => {
    setToasts((prev) => [...prev, { id: nextId++, kind, message }]);
  }, []);

  const notifySuccess = useCallback(
    (message: string) => push("success", message),
    [push],
  );
  const notifyError = useCallback(
    (message: string) => push("error", message),
    [push],
  );

  return (
    <ToastContext.Provider value={{ notifySuccess, notifyError }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
