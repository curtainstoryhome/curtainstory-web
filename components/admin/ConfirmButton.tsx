"use client";

import { useEffect, useRef, useState } from "react";
import AdminButton from "@/components/admin/AdminButton";

// A destructive-action button that always asks first. Deletes here remove real
// customer photos and project records with no undo, so every one of them goes
// through this.
export default function ConfirmButton({
  onConfirm,
  title,
  message,
  confirmLabel = "ลบ",
  children,
  className = "",
  disabled = false,
}: {
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // Focus lands on Cancel, not Confirm — a stray Enter keypress should not
    // delete anything.
    cancelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);

    // Stop the page behind scrolling under the dialog, and keep the layout
    // from jumping as the scrollbar disappears.
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        // Base feedback is baked in so no caller can accidentally ship a
        // button that does not respond to being pressed.
        className={`inline-flex min-h-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${className || "border border-red-200 text-red-600 hover:bg-red-50 focus-visible:outline-red-600"}`}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2
              id="confirm-title"
              className="font-heading text-lg font-semibold text-ink"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {message}
            </p>
            <p className="mt-2 text-sm font-medium text-red-600">
              การลบไม่สามารถย้อนกลับได้
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <AdminButton
                ref={cancelRef}
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                ยกเลิก
              </AdminButton>
              <AdminButton
                type="button"
                pending={busy}
                pendingLabel="กำลังลบ..."
                onClick={async () => {
                  setBusy(true);
                  try {
                    await onConfirm();
                    setOpen(false);
                  } finally {
                    setBusy(false);
                  }
                }}
                className="bg-red-600 text-white shadow-[0_2px_8px_-2px_rgba(220,38,38,0.5)] hover:bg-red-700 focus-visible:outline-red-600"
              >
                {confirmLabel}
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
