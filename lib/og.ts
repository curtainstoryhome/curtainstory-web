import type { Metadata } from "next";

// Next replaces `openGraph` wholesale rather than merging it field by field,
// which is easy to miss because `title` and `description` beside it do merge.
// A page that set only its own title, description and url therefore dropped
// og:site_name, og:locale and og:type, and a page that set none of them kept
// the root's — advertising the home page as the URL of every share card.
//
// So every page states the whole object, and states it through here: pass what
// is specific to the page and the shared fields come along.
export function og(
  page: {
    title: string;
    description?: string;
    url: string;
    image?: { url: string; alt: string };
    // A finished job is a piece of work, not another page of the site, and the
    // portfolio said so before this helper existed. Keep letting it.
    type?: "website" | "article";
  },
  siteName: string,
): Metadata["openGraph"] {
  return {
    title: page.title,
    description: page.description,
    url: page.url,
    siteName,
    locale: "th_TH",
    type: page.type ?? "website",
    images: page.image
      ? [{ url: page.image.url, alt: page.image.alt }]
      : [
          {
            url: "/images/hero-living-room.jpg",
            width: 2048,
            height: 1536,
            alt: siteName,
          },
        ],
  };
}

// `twitter` is replaced the same way `openGraph` is, and the root sets one, so
// a page that stated neither served the root's title and description under its
// own URL. Stated here alongside the Open Graph object so the two cannot drift.
export function tw(page: {
  title: string;
  description?: string;
  image?: { url: string; alt: string };
}): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: page.title,
    description: page.description,
    images: [page.image?.url ?? "/images/hero-living-room.jpg"],
  };
}
