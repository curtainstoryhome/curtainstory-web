import type { Metadata } from "next";
import { Kanit, Sarabun } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getBusinessInfo } from "@/lib/data";
import { fullBusinessName } from "@/lib/business-name";
import { siteUrl } from "@/lib/site-url";
import { googleAdsId, gtagSrc, gtagInit } from "@/lib/google-ads";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["400", "600"],
  display: "swap",
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});


export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();
  const fullName = fullBusinessName(business);

  // The shop's own description runs ~280 characters, and Google cuts the
  // snippet around 155 — so the half that named the services was never shown.
  // This is a purpose-built snippet: brand, what we sell, where we are, and a
  // phone number, in that order. Built from the same fields the owner edits,
  // so it stays true if they change their details. The full description still
  // appears on the page itself; only the search snippet is shortened.
  const searchSnippet =
    `${fullName} — ${business.tagline} รับออกแบบ ตัดเย็บ ติดตั้ง ` +
    `ย่านลาดพร้าว-วังทองหลาง กรุงเทพฯ โทร ${business.phone}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: fullName,
      template: `%s | ${business.name}`,
    },
    description: searchSnippet,
    // Search terms real customers type. Modern Google mostly ignores the
    // keywords tag, but these same terms are carried in the visible copy,
    // headings and alt text where they actually count.
    keywords: [
      "ผ้าม่าน",
      "ร้านผ้าม่าน",
      "ผ้าม่านกรุงเทพ",
      "รับตัดผ้าม่าน",
      "ติดตั้งผ้าม่าน",
      "ม่านจีบ",
      "ม่านม้วน",
      "ม่านปรับแสง",
      "มู่ลี่",
      "วอลล์เปเปอร์",
      "วอลเปเปอร์ติดผนัง",
      "มุ้งลวด",
      "ฟิล์มกรองแสง",
      "ซักผ้าม่าน",
      "ผ้าม่านลาดพร้าว",
      "ผ้าม่านวังทองหลาง",
      "CURTAIN STORY HOME",
    ],
    // Relative, so it resolves against metadataBase and only claims the home
    // page. Every other page sets its own — a shared absolute canonical would
    // tell Google the whole site is a duplicate of the home page.
    alternates: { canonical: "/" },
    openGraph: {
      title: fullName,
      description: business.description,
      url: siteUrl,
      siteName: fullName,
      locale: "th_TH",
      type: "website",
      images: [
        {
          url: "/images/hero-living-room.jpg",
          width: 2048,
          height: 1536,
          alt: fullName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullName,
      description: business.description,
      images: ["/images/hero-living-room.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    // Google Search Console proves ownership before it will accept the sitemap
    // or show what people searched to find the shop. Driven by an env var so
    // the token can be pasted into Vercel without touching code — leave it
    // unset and no tag is emitted at all.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${kanit.variable} ${sarabun.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
        {children}
      </body>
      {/* Google Ads tag. `afterInteractive` rather than Google's plain async
          <script>: the page paints first and the tag loads a beat later, which
          keeps the ad money from paying for a slower page. Google's snippet
          measures the same either way. The inline half needs an id of its own
          or next/script cannot dedupe it across navigations. */}
      <Script id="gtag-src" src={gtagSrc} strategy="afterInteractive" />
      <Script id={`gtag-init-${googleAdsId}`} strategy="afterInteractive">
        {gtagInit}
      </Script>
    </html>
  );
}
