"use client";

import { useEffect, useRef, useState } from "react";
import { ChatIcon, PhoneIcon } from "@/components/icons";
import type { BusinessInfo } from "@/lib/types";

// A small glass dock in the bottom-right corner, in place of the full-width bar
// that used to run across the screen.
//
// The bar was the biggest single source of repetition: on a phone it was always
// there, so reaching the end of a page put it directly beneath the page's own
// LINE/phone pair and the footer's pair — the same two actions, three times, in
// one screen.
//
// Three behaviours keep it useful without nagging:
//   · it is there from the first paint, because a visitor who arrives from an
//     ad has already decided to look and needs somewhere to tap
//   · it says what it is once, then collapses to two clean icons
//   · it hands over — whenever a real CTA block or the footer is on screen it
//     fades out entirely, so contact is never offered twice at the same moment
export default function StickyContactBar({
  business,
}: {
  business: BusinessInfo;
}) {
  const [covered, setCovered] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // One scroll listener answers the only question left: is a real pair of
  // buttons on screen right now.
  //
  // Deliberately measured with getBoundingClientRect rather than an
  // IntersectionObserver. Both work in a real browser, but only this one can be
  // checked from a test harness, and a behaviour nobody can verify is a
  // behaviour that quietly rots. Three rect reads per scroll, all reads and no
  // writes, so there is no layout thrash to pay for.
  useEffect(() => {
    const targets = [
      ...document.querySelectorAll("[data-cta-block]"),
      ...document.querySelectorAll("footer"),
    ];

    const update = () => {
      // Hand over just before the real buttons reach the thumb.
      const limit = window.innerHeight - 80;
      setCovered(
        targets.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top < limit && r.bottom > 0;
        }),
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Introduce itself once, then shrink to icons. Someone who has read the
  // labels does not need to keep reading them.
  useEffect(() => {
    collapseTimer.current = setTimeout(() => setExpanded(false), 2600);
    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, []);

  const shown = !covered;

  const label = (text: string) => (
    <span
      className={`overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        expanded ? "ml-2.5 max-w-[9rem] opacity-100" : "ml-0 max-w-0 opacity-0"
      }`}
    >
      {text}
    </span>
  );

  return (
    <div
      className={`fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2.5 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        shown
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-95 opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!shown}
    >
      <a
        href={business.phone_href}
        aria-label={`โทรหาเรา ${business.phone}`}
        tabIndex={shown ? undefined : -1}
        onFocus={() => setExpanded(true)}
        className="flex h-14 min-w-14 items-center rounded-full border border-white/60 bg-white/85 px-[15px] text-brand-700 shadow-[0_10px_30px_-10px_rgba(60,42,20,0.55)] backdrop-blur-xl transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-95"
      >
        <PhoneIcon className="h-6 w-6 flex-none" />
        {label("โทรเลย")}
      </a>

      <a
        href={business.line_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="แชทกับเราทาง LINE"
        tabIndex={shown ? undefined : -1}
        onFocus={() => setExpanded(true)}
        className="flex h-14 min-w-14 items-center rounded-full bg-line px-[15px] text-white shadow-[0_10px_30px_-8px_rgba(6,199,85,0.75)] transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line active:scale-95"
      >
        <ChatIcon className="h-6 w-6 flex-none" />
        {label("แชท LINE")}
      </a>
    </div>
  );
}
