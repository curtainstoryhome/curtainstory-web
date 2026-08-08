"use client";

import { useState } from "react";
import { PlayIcon } from "@/components/icons";
import {
  parseYouTubeId,
  youTubeEmbedUrl,
  youTubeThumbnail,
  youTubeThumbnailFallback,
} from "@/lib/youtube";

// Loads only a thumbnail until the visitor presses play. YouTube's real
// iframe pulls well over a megabyte of script, which would wreck the
// first-load experience if it ran on every page view.
export default function VideoEmbed({
  url,
  title = "วิดีโอผลงาน",
  className = "",
}: {
  url: string;
  title?: string;
  className?: string;
}) {
  const id = parseYouTubeId(url);
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(() => (id ? youTubeThumbnail(id) : ""));

  if (!id) return null;

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-brand-100 bg-ink shadow-[0_18px_45px_-18px_rgba(124,94,62,0.5)] ${className}`}
    >
      {playing ? (
        <iframe
          src={youTubeEmbedUrl(id)}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`เล่นวิดีโอ: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.99]"
        >
          {/* Plain img: the thumbnail host is outside our image config and
              this is a fixed-size decorative frame. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt=""
            onError={() => setThumb(youTubeThumbnailFallback(id))}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/20 to-ink/25 transition-colors group-hover:from-ink/45 group-hover:via-ink/10" />
          {/* Soft halo behind the button so it reads clearly whatever the
              thumbnail happens to look like. */}
          <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-xl transition-transform duration-500 group-hover:scale-125" />
          <span className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
            <PlayIcon className="ml-1 h-7 w-7 text-brand-700" />
          </span>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/55 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            กดเพื่อเล่นวิดีโอ
          </span>
        </button>
      )}
    </div>
  );
}
