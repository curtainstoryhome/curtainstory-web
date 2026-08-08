// The one place the site's public address is decided. Canonical tags, the
// sitemap, robots.txt and social share images all read from here, so they can
// never disagree with each other.
//
// Order matters:
//  1. NEXT_PUBLIC_SITE_URL — an explicit override, if one is ever set.
//  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel fills this with the project's
//     production domain. Today that is the .vercel.app address; the moment
//     curtainstoryhome.com is attached to the project and the site is
//     redeployed, this becomes the real domain on its own.
//  3. The .vercel.app address, so local builds still produce absolute URLs.
//
// Deliberately NOT hardcoded to buitincurtains.com: that is the old brand's
// domain and it still serves the old WordPress site, so pointing canonicals at
// it would tell Google our pages are duplicates of URLs that 404 there. It is
// being 301'd to the new domain instead — see ย้ายเว็บเก่า-htaccess.md.
const fallback = "https://buitincurtains.vercel.app";

function normalise(url: string) {
  const withScheme = url.startsWith("http") ? url : `https://${url}`;
  return withScheme.replace(/\/$/, "");
}

export const siteUrl = normalise(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    fallback,
);
