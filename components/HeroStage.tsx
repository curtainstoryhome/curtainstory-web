"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// The hero photo, mounted on a surface that responds to the pointer.
//
// Two things are deliberate here. The tilt is small — five degrees at the
// corners — because a curtain shop is selling calm, and a card that lurches
// under the cursor reads as a demo, not a showroom. And the light moves with
// the pointer too: the sheen sits where the surface is tipped towards you, so
// the panel feels like a physical thing catching window light rather than a
// rectangle being rotated.
//
// Everything is opt-in by capability: a coarse pointer (a phone) or
// prefers-reduced-motion gets the same photo, framed the same way, with no
// motion attached at all.
const MAX_TILT_DEG = 5;

export default function HeroStage({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setInteractive(fine.matches && !calm.matches);
    sync();
    fine.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !interactive) return;

    let raf = 0;
    const apply = (rx: number, ry: number, gx: number, gy: number) => {
      frame.style.setProperty("--rx", `${rx}deg`);
      frame.style.setProperty("--ry", `${ry}deg`);
      frame.style.setProperty("--gx", `${gx}%`);
      frame.style.setProperty("--gy", `${gy}%`);
    };

    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = frame.getBoundingClientRect();
        // -0.5 … 0.5 from the centre of the card.
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        apply(-py * 2 * MAX_TILT_DEG, px * 2 * MAX_TILT_DEG, 50 + px * 60, 50 + py * 60);
      });
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      apply(0, 0, 50, 50);
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  return (
    <div className="hero-stage relative">
      {/* Warm light pooled behind the panel. Sits under everything and never
          takes pointer events. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_55%_at_50%_35%,rgba(201,162,98,0.30),transparent_72%)] blur-2xl"
      />
      <div
        ref={frameRef}
        data-interactive={interactive ? "true" : undefined}
        className="hero-frame relative rounded-3xl shadow-[0_30px_70px_-28px_rgba(60,42,20,0.6)]"
      >
        {children}
        {/* The sheen. Multiply-free: a soft white wash that follows the
            pointer across the glass. */}
        <div
          aria-hidden
          className="hero-sheen pointer-events-none absolute inset-0 rounded-3xl"
        />
      </div>
    </div>
  );
}
