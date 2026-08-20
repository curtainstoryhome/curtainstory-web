"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type ColumnConfig = {
  direction: "up" | "down";
  durationSeconds: number;
};

const columnConfigs: ColumnConfig[] = [
  { direction: "up", durationSeconds: 26 },
  { direction: "down", durationSeconds: 32 },
  { direction: "up", durationSeconds: 29 },
];

function rotate<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return items;
  const shift = offset % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function MarqueeColumn({
  images,
  direction,
  durationSeconds,
  onOpen,
}: ColumnConfig & { images: string[]; onOpen: (src: string) => void }) {
  const loop = [...images, ...images];
  return (
    <div className="relative h-[520px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex flex-col gap-4 ${direction === "up" ? "animate-marquee-up" : "animate-marquee-down"}`}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {loop.map((src, i) => (
          // A button, because these are messages rather than decoration. In the
          // column they are 158px wide on a phone and moving, which is small
          // enough that the words are texture and not text -- the shop's own
          // customers saying the work was good, unreadable. Opening one is the
          // only way that proof does any work.
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => onOpen(src)}
            aria-label="ดูข้อความจากลูกค้าเต็มรูป"
            className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-brand-100 shadow-sm transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            <Image
              src={src}
              alt="ข้อความจากลูกค้าจริงทาง LINE"
              fill
              sizes="(min-width: 1024px) 20vw, 33vw"
              className="object-cover"
              quality={90}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewMarquee({ images }: { images: string[] }) {
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const close = useCallback(() => setOpenSrc(null), []);

  useEffect(() => {
    if (!openSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    // The columns keep animating behind the overlay and the page keeps
    // scrolling under it otherwise, so the message being read drifts away.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [openSrc, close]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {columnConfigs.map((config, i) => (
          <div key={i} className={i === 2 ? "hidden sm:block" : ""}>
            <MarqueeColumn
              images={rotate(images, i)}
              onOpen={setOpenSrc}
              {...config}
            />
          </div>
        ))}
      </div>

      {openSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="ข้อความจากลูกค้า"
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
        >
          {/* contain, not cover. The container is 9/16 and these screenshots are
              768x1498, so cropping to fill takes roughly nine percent off the
              height -- the top or bottom of the conversation, which is where a
              chat starts or ends. */}
          <div className="relative h-full max-h-[88vh] w-full max-w-sm">
            <Image
              src={openSrc}
              alt="ข้อความจากลูกค้าจริงทาง LINE"
              fill
              sizes="(min-width: 640px) 384px, 92vw"
              className="object-contain"
              quality={95}
            />
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="ปิด"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
