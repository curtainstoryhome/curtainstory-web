"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import type { ProjectWithImages } from "@/lib/types";

// Horizontal scroller for "other projects". The scrolling itself is native
// CSS scroll-snap, so swiping on a phone is handled by the browser and can
// never stutter — the arrows only nudge the same scroll container, and they
// wrap around at either end so the visitor can keep pressing one direction.
export default function ProjectCarousel({
  projects,
  title = "ผลงานอื่นๆ ของเรา",
  headingLevel = "h2",
}: {
  projects: ProjectWithImages[];
  title?: string;
  // "none" when the surrounding section already shows the title, so the page
  // does not print the same heading twice.
  headingLevel?: "h2" | "none";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  // Arrows are pointless when every card already fits on screen, and a
  // control that does nothing is worse than no control.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const check = () =>
      setScrollable(track.scrollWidth > track.clientWidth + 4);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(track);
    return () => observer.disconnect();
  }, [projects.length]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;

    // Measured rather than hard-coded, so it stays correct at every
    // breakpoint and however the gap is styled.
    const step =
      cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : cards[0].offsetWidth;
    const max = track.scrollWidth - track.clientWidth;

    // Someone who has asked their phone to stop animating things means it here
    // too. A hard-coded "smooth" overrides the CSS rule and the preference with
    // it, so the choice is made per press instead.
    const behavior: ScrollBehavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "auto"
      : "smooth";

    if (direction === 1 && track.scrollLeft >= max - 4) {
      track.scrollTo({ left: 0, behavior });
    } else if (direction === -1 && track.scrollLeft <= 4) {
      track.scrollTo({ left: max, behavior });
    } else {
      track.scrollBy({ left: direction * step, behavior });
    }
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        {headingLevel === "h2" ? (
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            {title}
          </h2>
        ) : (
          <span className="sr-only">{title}</span>
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/portfolio"
            className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 py-2.5 text-sm font-semibold text-brand-700 transition-[background-color,transform] duration-150 hover:bg-brand-50 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
          >
            ดูทั้งหมด →
          </Link>
          {scrollable && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="ดูผลงานก่อนหน้า"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 shadow-[0_2px_8px_-3px_rgba(124,94,62,0.18)] transition-all duration-200 hover:border-brand-500 hover:bg-brand-50 hover:shadow-[0_8px_18px_-8px_rgba(124,94,62,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-95"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="ดูผลงานถัดไป"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 shadow-[0_2px_8px_-3px_rgba(124,94,62,0.18)] transition-all duration-200 hover:border-brand-500 hover:bg-brand-50 hover:shadow-[0_8px_18px_-8px_rgba(124,94,62,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-95"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={trackRef}
        // Scrollbar hidden because the arrows and the peeking next card
        // already say "there is more this way".
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-[82%] flex-none snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </>
  );
}
