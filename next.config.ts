import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts quality to [75] unless listed here. Re-encoding an
    // already-compressed LINE photo at 75 visibly softens it, so photos are
    // served at 90; 75 stays available for anything decorative.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gaimepvsyrrykuqhdpiw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // YouTube thumbnails for the lite video embed.
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stops other sites embedding this one to impersonate the shop.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        // Project photos are immutable (new upload = new filename), so let
        // browsers and the CDN keep them for a year instead of re-fetching.
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Project renamed 9 -> 91; keep any already-shared link working.
        source: "/portfolio/saransiri-pracha-uthit-9",
        destination: "/portfolio/saransiri-pracha-uthit-91",
        permanent: true,
      },
      // The old site's paths, pointed at their match here. The old host already
      // 301s its own traffic, but it only does so while that domain is paid for,
      // and its catch-all sends /projects and /about to this homepage rather than
      // to the page a visitor was actually asking for. These cover the same paths
      // typed or shared against this domain, which until now returned 404.
      { source: "/projects", destination: "/portfolio", permanent: true },
      { source: "/contactus", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/service", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
