// Accepts whatever form the owner pastes in: watch links, share links,
// shorts, or a bare id. Returns null when it isn't a YouTube URL at all.
export function parseYouTubeId(input: string): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;

  // Bare 11-char id
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  const idLike = (s: string) => (/^[a-zA-Z0-9_-]{11}$/.test(s) ? s : null);

  if (host === "youtu.be") {
    return idLike(url.pathname.slice(1).split("/")[0]);
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v) return idLike(v);
    const parts = url.pathname.split("/").filter(Boolean);
    // /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>
    if (["embed", "shorts", "live", "v"].includes(parts[0]) && parts[1]) {
      return idLike(parts[1]);
    }
  }
  return null;
}

// nocookie host = no tracking cookies until the visitor actually plays.
export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export function youTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

export function youTubeThumbnailFallback(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
