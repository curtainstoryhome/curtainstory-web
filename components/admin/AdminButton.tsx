"use client";

import { forwardRef } from "react";

// One button for the whole admin, so every press looks and feels the same.
//
// The rule this exists to enforce: nothing in the admin may be pressed without
// visibly responding. Every button dips slightly when held, shows a focus ring
// when tabbed to, dims when disabled, and swaps to a spinner while it waits on
// the server.
type Variant = "primary" | "secondary" | "danger" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-[0_2px_8px_-2px_rgba(109,83,39,0.45)] hover:bg-brand-800 focus-visible:outline-brand-700",
  secondary:
    "border border-brand-200 bg-white text-ink-soft hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-brand-700",
  danger:
    "border border-red-200 bg-white text-red-600 hover:border-red-400 hover:bg-red-50 focus-visible:outline-red-600",
  ghost:
    "text-ink-soft hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-brand-700",
};

export type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  pending?: boolean;
  pendingLabel?: string;
  // Renders at 44px tall for comfortable tapping on a tablet.
  size?: "md" | "sm";
};

const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  function AdminButton(
    {
      variant = "primary",
      pending = false,
      pendingLabel,
      size = "md",
      disabled,
      className = "",
      children,
      ...rest
    },
    ref,
  ) {
    const isBlocked = pending || disabled;

    return (
      <button
        ref={ref}
        // A pending button must not be clickable again — double-submitting is
        // how duplicate records get created.
        disabled={isBlocked}
        aria-busy={pending || undefined}
        className={[
          "inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold",
          size === "md" ? "min-h-11 px-5 text-sm" : "min-h-9 px-3.5 text-sm",
          "transition-[background-color,border-color,color,transform,box-shadow] duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          // The press itself: a small dip, instant enough to feel physical.
          isBlocked ? "cursor-not-allowed opacity-60" : "active:scale-[0.97]",
          VARIANTS[variant],
          className,
        ].join(" ")}
        {...rest}
      >
        {pending && (
          <svg
            className="h-4 w-4 flex-none animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
        {pending && pendingLabel ? pendingLabel : children}
      </button>
    );
  },
);

export default AdminButton;
