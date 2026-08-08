"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";


const SWIPE_THRESHOLD_PX = 45;
// A fast flick is a swipe even when the finger barely travels — matching how
// people actually page through photos. Distance alone sprang back and read as
// "it ignored me".
const FLICK_SPEED_PX_PER_MS = 0.35;
const FLICK_MIN_TRAVEL_PX = 12;
const SLIDE_MS = 320;

// Photo grid plus a full-screen viewer. Customers buying curtains want to look
// closely at the fabric, the pleats and the stitching — a grid of small tiles
// cannot answer that question, so every tile opens full size.
//
// Two things this gets right that the obvious version does not:
//
// 1. Each photo keeps its own slot and its own `src` for the life of the
//    component, positioned by how far it is from the one being viewed. Reusing
//    a few slots and swapping their `src` makes the browser re-decode and
//    flashes an empty panel mid-swipe.
// 2. Letting go of a swipe starts an animation rather than jumping straight to
//    the next photo, so the picture glides to where the finger left it.
export default function ProjectGallery({
  images,
  projectTitle,
  altPrefix = "ผลงานติดตั้งผ้าม่าน",
  fit = "cover",
}: {
  // Structural, not tied to one table: the same viewer serves project photos
  // and service catalogue sheets.
  images: { id: string; image_url: string }[];
  projectTitle: string;
  altPrefix?: string;
  // Room photos are cropped to a common shape so the grid reads evenly.
  // Catalogue sheets must not be: cropping one cuts the fabric codes off the
  // top and bottom, which is the whole reason someone opens it.
  fit?: "cover" | "contain";
}) {
  const count = images.length;
  const wrap = (i: number) => ((i % count) + count) % count;

  const [openAt, setOpenAt] = useState<number | null>(null);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [slideTo, setSlideTo] = useState<null | 1 | -1>(null);
  const [instant, setInstant] = useState(false);
  // Catalogue sheets carry fabric codes, widths and prices in small print, so
  // the viewer has to let people get closer. Zoomed, a drag pans the picture
  // instead of moving to the next one.
  const [zoom, setZoom] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  // When the drag began, for judging a flick by speed rather than distance.
  const startT = useRef(0);
  // Mirrors dx synchronously — see HeroCarousel: reading the state value in the
  // release handler loses a fast flick to React's batching.
  const dxRef = useRef(0);

  const isOpen = openAt !== null;

  const close = useCallback(() => {
    setOpenAt(null);
    setDx(0);
    setSlideTo(null);
    setZoom(0);
    setPan({ x: 0, y: 0 });
    restoreFocus.current?.focus();
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(0);
    setPan({ x: 0, y: 0 });
  }, []);

  const open = (index: number) => {
    restoreFocus.current = document.activeElement as HTMLElement;
    setOpenAt(index);
  };

  const commitSlide = useCallback(() => {
    setSlideTo((dir) => {
      if (dir === null) return null;
      setInstant(true);
      setOpenAt((current) => (current === null ? current : wrap(current + dir)));
      setDx(0);
      setZoom(0);
      setPan({ x: 0, y: 0 });
      setTimeout(() => setInstant(false), 30);
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // If transitionend never arrives — interrupted transition, hidden tab,
  // reduced motion — the strip would otherwise stay stuck mid-slide.
  useEffect(() => {
    if (slideTo === null) return;
    const id = setTimeout(commitSlide, SLIDE_MS + 90);
    return () => clearTimeout(id);
  }, [slideTo, commitSlide]);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (count < 2) return;
      setSlideTo((current) => (current === null ? dir : current));
    },
    [count],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (zoom) resetZoom();
        else close();
      }
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else if (event.key === "Tab") {
        // Only the close button is focusable inside, so keep focus on it
        // rather than letting Tab wander into the page behind.
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // Stop the page behind from scrolling, without the content jumping as the
    // scrollbar disappears.
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [isOpen, close, step, zoom, resetZoom]);

  function onPointerDown(event: React.PointerEvent) {
    if (slideTo !== null) return;
    if (!zoom && count < 2) return;
    startX.current = event.clientX;
    startY.current = event.clientY;
    startT.current = event.timeStamp;
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent) {
    if (startX.current === null || startY.current === null) return;
    const moveX = event.clientX - startX.current;
    const moveY = event.clientY - startY.current;

    if (zoom) {
      // Panning: follow the finger in both directions, bounded so the picture
      // can never be dragged completely out of view.
      const stage = stageRef.current;
      const limitX = stage ? (stage.clientWidth * (zoom - 1)) / 2 : 0;
      const limitY = stage ? (stage.clientHeight * (zoom - 1)) / 2 : 0;
      setPan((prev) => ({
        x: Math.max(-limitX, Math.min(limitX, prev.x + moveX * 0.6)),
        y: Math.max(-limitY, Math.min(limitY, prev.y + moveY * 0.6)),
      }));
      startX.current = event.clientX;
      startY.current = event.clientY;
      return;
    }
    // A mostly-vertical drag is not a swipe.
    if (Math.abs(moveY) > Math.abs(moveX) && Math.abs(moveY) > 24) {
      startX.current = null;
      startY.current = null;
      setDragging(false);
      dxRef.current = 0;
      setDx(0);
      return;
    }
    const limit = stageRef.current?.clientWidth ?? 0;
    const next = Math.max(-limit, Math.min(limit, moveX));
    dxRef.current = next;
    setDx(next);
  }

  function onPointerUp(event: React.PointerEvent) {
    const travelled = dxRef.current;
    const wasDragging = startX.current !== null;
    const elapsed = Math.max(1, event.timeStamp - startT.current);
    const flicked =
      Math.abs(travelled) / elapsed >= FLICK_SPEED_PX_PER_MS &&
      Math.abs(travelled) >= FLICK_MIN_TRAVEL_PX;
    startX.current = null;
    startY.current = null;
    dxRef.current = 0;
    setDragging(false);
    if (zoom) return;

    if (wasDragging && (Math.abs(travelled) >= SWIPE_THRESHOLD_PX || flicked)) {
      setSlideTo(travelled < 0 ? 1 : -1);
    } else {
      setDx(0); // ease back to centre
    }
  }

  function jumpTo(target: number) {
    if (openAt === null || target === openAt || slideTo !== null) return;
    resetZoom();
    if (wrap(openAt + 1) === target) setSlideTo(1);
    else if (wrap(openAt - 1) === target) setSlideTo(-1);
    else {
      setInstant(true);
      setOpenAt(target);
      setDx(0);
      setTimeout(() => setInstant(false), 30);
    }
  }

  // Same unit as the slots themselves — see the note in HeroCarousel.
  const slidePercent = -(slideTo ?? 0) * 100;
  const noTransition = dragging || instant;

  return (
    <>
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          count >= 3 ? "lg:grid-cols-3" : ""
        }`}
      >
        {images.map((image, i) => (
          <button
            key={image.id}
            type="button"
            onClick={() => open(i)}
            aria-label={`ขยายรูปที่ ${i + 1} ของ ${projectTitle}`}
            className={`group relative cursor-zoom-in overflow-hidden rounded-2xl border border-brand-100 shadow-[0_2px_10px_-3px_rgba(109,83,39,0.18)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-12px_rgba(109,83,39,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:translate-y-0 ${
              fit === "contain" ? "aspect-[3/4] bg-white p-2" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={image.image_url}
              alt={`${altPrefix} ${projectTitle} รูปที่ ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              quality={90}
              className={`transition-transform duration-500 ${
                fit === "contain"
                  ? "object-contain"
                  : "object-cover group-hover:scale-[1.06]"
              }`}
            />
            <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/15" />
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle}`}
          className="fixed inset-0 z-[100] flex touch-pan-y flex-col overscroll-contain bg-ink/95 backdrop-blur-md"
          onClick={close}
        >
          <div className="flex flex-none items-center justify-between px-4 py-4 sm:px-6">
            <p className="text-sm font-medium text-white/90">
              {zoom ? (
                <span className="mr-3 rounded-full bg-white/15 px-2.5 py-1 text-xs">
                  ซูมอยู่ — ลากเพื่อเลื่อนดู
                </span>
              ) : (
                <span className="mr-3 hidden rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70 sm:inline">
                  กดที่รูปเพื่อซูมดูรายละเอียด
                </span>
              )}
              {openAt + 1} / {count}
              <span className="ml-3 hidden text-white/60 sm:inline">
                {projectTitle}
              </span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="ปิดรูป"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-[background-color,transform] hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div
            ref={stageRef}
            className={`relative flex min-h-0 flex-1 touch-pan-y items-center justify-center overflow-hidden overscroll-contain px-2 sm:px-16 ${
              zoom
                ? dragging
                  ? "cursor-grabbing"
                  : "cursor-zoom-out"
                : count > 1
                  ? dragging
                    ? "cursor-grabbing"
                    : "cursor-zoom-in"
                  : "cursor-zoom-in"
            }`}
            onClick={(event) => {
              event.stopPropagation();
              // A plain click after a drag should not also toggle zoom.
              if (Math.abs(dx) > 4) return;
              if (zoom) resetZoom();
              else setZoom(2.2);
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
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
                let d = i - openAt;
                if (d > count / 2) d -= count;
                if (d < -count / 2) d += count;
                // Only the visible photo and its two neighbours need to be in
                // the DOM; the rest would just be decoding work nobody sees.
                if (Math.abs(d) > 1) return null;
                return (
                  <div
                    key={image.id}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `translate3d(${d * 100}%,0,0)` }}
                    aria-hidden={d !== 0}
                  >
                    {/* Capped rather than stretched edge to edge. These photos
                        come off LINE around 1280px wide, and blowing one up
                        across a 1900px screen is exactly what makes it look
                        blurry — better to show it slightly smaller and sharp. */}
                    <div
                      className="relative h-full max-h-full w-full max-w-[1400px]"
                      style={
                        d === 0 && zoom
                          ? {
                              transform: `scale(${zoom}) translate3d(${pan.x / zoom}px,${pan.y / zoom}px,0)`,
                              transition: dragging ? "none" : "transform 220ms ease-out",
                            }
                          : undefined
                      }
                    >
                      <Image
                        src={image.image_url}
                        alt={
                          d === 0
                            ? `${altPrefix} ${projectTitle} รูปที่ ${openAt + 1}`
                            : ""
                        }
                        fill
                        sizes="(min-width: 1400px) 1400px, 100vw"
                        quality={90}
                        className="select-none object-contain"
                        draggable={false}
                        priority={d === 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="รูปก่อนหน้า"
                  className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-[background-color,transform] hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white active:scale-90 sm:left-3"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="รูปถัดไป"
                  className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-[background-color,transform] hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white active:scale-90 sm:right-3"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div
              className="flex flex-none justify-center gap-2 overflow-x-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onClick={(event) => event.stopPropagation()}
            >
              {images.map((image, i) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`ไปที่รูปที่ ${i + 1}`}
                  aria-current={i === openAt}
                  className={`relative h-14 w-16 flex-none overflow-hidden rounded-lg transition-[opacity,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 ${
                    i === openAt ? "ring-2 ring-white" : "opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
