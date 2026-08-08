"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroImageRow } from "@/lib/types";

const INTERVAL_MS = 5500;
const SWIPE_THRESHOLD_PX = 60;
// A quick flick is a swipe even when the finger barely travels. Distance alone
// meant a fast, short flick — how people actually swipe photos on a phone —
// sprang back to where it started and felt like the drag had been ignored.
const FLICK_SPEED_PX_PER_MS = 0.35;
const FLICK_MIN_TRAVEL_PX = 12;
const SLIDE_MS = 420;

// A real filmstrip: the neighbouring photo sits just off-screen and travels
// with your finger, so dragging reveals the next picture instead of sliding
// the frame off and leaving a hole.
//
// Every photo gets its own permanent slot, placed by how far it is from the
// current one. That matters: an earlier version reused three slots and swapped
// their `src` on each move, which forced the browser to re-decode the image
// and flashed an empty white panel mid-slide.
export default function HeroCarousel({
  images,
  alt,
}: {
  images: HeroImageRow[];
  alt: string;
}) {
  const count = images.length;
  const wrap = (i: number) => ((i % count) + count) % count;

  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const [slideTo, setSlideTo] = useState<null | 1 | -1>(null);
  const [instant, setInstant] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [animate, setAnimate] = useState(true);

  const frameRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  // Timestamps for working out how fast the finger was moving on release.
  const startT = useRef(0);
  const lastT = useRef(0);
  // The travelled distance is mirrored in a ref because endDrag has to read it
  // the instant the finger lifts. Reading the state value meant that on a fast
  // flick — where React batches the whole gesture into one render — the release
  // handler still saw 0 and sprang the photo back. That is the "I swiped and
  // nothing happened" the shop owner kept hitting.
  const dxRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAnimate(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const width = () => frameRef.current?.clientWidth ?? 0;

  const startTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (!animate || count < 2) return;
    timer.current = setInterval(() => setSlideTo(1), INTERVAL_MS);
  }, [animate, count]);

  useEffect(() => {
    startTimer();
    const onVisibility = () => {
      if (document.hidden) {
        if (timer.current) clearInterval(timer.current);
      } else {
        startTimer();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (timer.current) clearInterval(timer.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [startTimer]);

  // Runs when the slide animation lands: adopt the new photo as "current",
  // then recentre the strip without animating so nothing visibly jumps.
  const commitSlide = useCallback(() => {
    if (slideTo === null) return;
    setInstant(true);
    setIndex((i) => wrap(i + slideTo));
    setSlideTo(null);
    setDx(0);
    // A timeout rather than rAF: this also has to work in a background tab,
    // where animation frames stop firing entirely.
    setTimeout(() => setInstant(false), 30);
    startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideTo, count, startTimer]);

  // Safety net — if the browser never fires transitionend (interrupted
  // transition, reduced motion, background tab) the strip would otherwise
  // stay stuck mid-slide.
  useEffect(() => {
    if (slideTo === null) return;
    const id = setTimeout(commitSlide, SLIDE_MS + 90);
    return () => clearTimeout(id);
  }, [slideTo, commitSlide]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (count < 2 || slideTo !== null) return;
    startX.current = event.clientX;
    startY.current = event.clientY;
    startT.current = event.timeStamp;
    lastT.current = event.timeStamp;
    dxRef.current = 0;
    setDragging(true);
    if (timer.current) clearInterval(timer.current);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (startX.current === null || startY.current === null) return;
    lastT.current = event.timeStamp;
    const moveX = event.clientX - startX.current;
    const moveY = event.clientY - startY.current;

    // A mostly-vertical drag is the visitor scrolling the page, not swiping.
    if (Math.abs(moveY) > Math.abs(moveX) && Math.abs(moveY) > 12) {
      startX.current = null;
      startY.current = null;
      setDragging(false);
      dxRef.current = 0;
      setDx(0);
      startTimer();
      return;
    }
    // Clamped to one frame so you can never drag past the neighbour.
    const limit = width();
    const next = Math.max(-limit, Math.min(limit, moveX));
    dxRef.current = next;
    setDx(next);
  }

  function endDrag() {
    if (startX.current === null) {
      setDragging(false);
      return;
    }
    const travelled = dxRef.current;
    // Speed over the drag, so a flick counts even when it covers less ground
    // than a slow deliberate pull would.
    const elapsed = Math.max(1, lastT.current - startT.current);
    const speed = Math.abs(travelled) / elapsed;
    const flicked =
      speed >= FLICK_SPEED_PX_PER_MS &&
      Math.abs(travelled) >= FLICK_MIN_TRAVEL_PX;

    startX.current = null;
    startY.current = null;
    dxRef.current = 0;
    setDragging(false);

    if (Math.abs(travelled) >= SWIPE_THRESHOLD_PX || flicked) {
      setSlideTo(travelled < 0 ? 1 : -1);
    } else {
      setDx(0); // snap back
      startTimer();
    }
  }

  // Jumping straight to a dot: slide if it is a neighbour, otherwise swap.
  function goTo(target: number) {
    if (target === index || slideTo !== null) return;
    if (wrap(index + 1) === target) setSlideTo(1);
    else if (wrap(index - 1) === target) setSlideTo(-1);
    else {
      setInstant(true);
      setIndex(target);
      setDx(0);
      setTimeout(() => setInstant(false), 30);
      startTimer();
    }
  }

  // The slide distance is expressed in the same unit the slots are positioned
  // with. An earlier version moved the strip by a pixel width measured during
  // render while the slots sat at ±100%; whenever those two disagreed the
  // strip landed off its slot and left a blank panel beside the photo.
  const slidePercent = -(slideTo ?? 0) * 100;
  const noTransition = dragging || instant || !animate;

  // Signed distance from the current photo, wrapped so the strip can loop in
  // either direction by the shortest route.
  const distance = (i: number) => {
    let d = i - index;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  const caption = images[index]?.caption;

  return (
    <div className="relative h-full w-full">
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-5 -z-10 rounded-[2.5rem] bg-brand-400/25 blur-3xl"
      />

      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        role="group"
        aria-roledescription="แกลเลอรีรูป"
        aria-label={`${alt} — ลากซ้ายขวาเพื่อดูรูปอื่น`}
        className={`relative h-full w-full touch-pan-y overflow-hidden rounded-3xl ${
          count > 1 ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
        }`}
      >
        <div
          onTransitionEnd={commitSlide}
          className="absolute inset-0"
          style={{
            transform: `translate3d(calc(${slidePercent}% + ${dx}px),0,0)`,
            transition: noTransition
              ? "none"
              : `transform ${SLIDE_MS}ms cubic-bezier(0.22,1,0.36,1)`,
          }}
        >
          {images.map((image, i) => {
            const d = distance(i);
            return (
              <div
                key={image.id}
                className="absolute inset-0"
                style={{ transform: `translate3d(${d * 100}%,0,0)` }}
                aria-hidden={d !== 0}
              >
                <Image
                  src={image.image_url}
                  alt={d === 0 ? image.caption || alt : ""}
                  fill
                  // The first frame blocks the first paint; the rest are
                  // fetched once the page is up. They cannot be lazy — they
                  // sit at opacity 0 in the same spot and would never load —
                  // but they must not cost the visitor anything on arrival.
                  loading="eager"
                  fetchPriority={i === 0 ? "high" : "low"}
                  {...(i === 0 ? { priority: true } : {})}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  draggable={false}
                  className="select-none object-cover"
                
          quality={90}
        />
              </div>
            );
          })}
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/45 via-ink/10 to-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15"
        />

        {caption && (
          <span className="pointer-events-none absolute bottom-14 left-1/2 max-w-[80%] -translate-x-1/2 truncate rounded-full bg-ink/45 px-4 py-1.5 text-center text-xs font-medium text-white backdrop-blur-sm">
            {caption}
          </span>
        )}
      </div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`ดูรูปที่ ${i + 1}`}
              aria-current={i === index}
              // 44px target and a real press response — these gave nothing back
              // when tapped, on top of being too small to hit reliably.
              className="group flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-90"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === index
                    ? "h-2 w-7 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.45)]"
                    : "h-2 w-2 bg-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.35)] group-hover:bg-white/90 group-active:bg-white"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
