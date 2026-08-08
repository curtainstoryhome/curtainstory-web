"use client";

import { useEffect, useRef } from "react";
import { ChatIcon, PhoneIcon } from "@/components/icons";
import type { BusinessInfo } from "@/lib/types";

const PLEAT_TEXTURE =
  "repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 3px, rgba(255,255,255,0.10) 3px, rgba(255,255,255,0.10) 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 16px)";

export default function CurtainReveal({
  business,
  title,
  description,
}: {
  business: BusinessInfo;
  title: string;
  // Passed in rather than reusing business.description, which is already
  // printed in full at the top of the same page.
  description: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // The curtains follow the scroll instead of opening once and staying open:
  // scroll down and they part, scroll back up and they draw closed again.
  //
  // Styles are written straight to the elements rather than through React
  // state — re-rendering on every scroll frame is what makes this kind of
  // effect stutter.
  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !left || !right) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = (progress: number) => {
      const angle = progress * 112;
      const shift = progress * 8;
      left.style.transform = `rotateY(${-angle}deg) translateX(${-shift}%)`;
      right.style.transform = `rotateY(${angle}deg) translateX(${shift}%)`;
    };

    if (reduced.matches) {
      apply(1); // no motion: just show the content
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Closed while the section is still below the fold, fully open by the
      // time its top has travelled up to a quarter of the screen.
      const start = vh;
      const end = vh * 0.25;
      const raw = (start - rect.top) / (start - end);
      apply(Math.max(0, Math.min(1, raw)));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-20 sm:py-28"
    >
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
          {business.name}
        </p>
        <h2 className="mt-4 font-heading text-3xl font-semibold text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          {description}
        </p>
        <div
          data-cta-block
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={business.line_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-line px-6 py-3 text-sm font-semibold text-white transition-[opacity,transform] duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97]"
          >
            <ChatIcon className="h-4 w-4" />
            ปรึกษาฟรีทาง LINE
          </a>
          <a
            href={business.phone_href}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-brand-200 px-6 py-3 text-sm font-semibold text-brand-100 transition-[background-color,transform] duration-150 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97]"
          >
            <PhoneIcon className="h-4 w-4" />
            โทร {business.phone}
          </a>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ perspective: "1400px" }}
      >
        <div
          ref={leftRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2 border-r border-black/20 shadow-[12px_0_40px_rgba(0,0,0,0.45)] will-change-transform"
          style={{
            background: `linear-gradient(115deg, var(--color-brand-700), var(--color-brand-500) 55%, var(--color-brand-600)), ${PLEAT_TEXTURE}`,
            backgroundBlendMode: "overlay",
            transformOrigin: "left center",
          }}
        />
        <div
          ref={rightRef}
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1/2 border-l border-black/20 shadow-[-12px_0_40px_rgba(0,0,0,0.45)] will-change-transform"
          style={{
            background: `linear-gradient(245deg, var(--color-brand-700), var(--color-brand-500) 55%, var(--color-brand-600)), ${PLEAT_TEXTURE}`,
            backgroundBlendMode: "overlay",
            transformOrigin: "right center",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-black/50 to-transparent" />
      </div>
    </section>
  );
}
