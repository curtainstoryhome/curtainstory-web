import type { BusinessInfo, ServiceRow } from "@/lib/types";
import { fullBusinessName } from "@/lib/business-name";

// JSON-LD is how Google understands that this is a local business with a
// phone number, address and service list — it drives the map pack and rich
// results, which is where local curtain searches actually convert.
export default function StructuredData({
  business,
  services,
  siteUrl,
}: {
  business: BusinessInfo;
  services: ServiceRow[];
  siteUrl: string;
}) {
  // Listing the shop's own Google profile here is what tells Google that this
  // website and that Business Profile are one business. That matters most right
  // now: the profile still carries the old shop name, and this is the link that
  // lets the reviews and history built up under it transfer to the new brand.
  const sameAs = [
    business.line_url,
    business.facebook_url,
    business.map_url,
  ].filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#business`,
    name: fullBusinessName(business),
    alternateName: business.name,
    description: business.description,
    url: siteUrl,
    telephone: business.phone_href.replace("tel:", ""),
    image: `${siteUrl}/images/hero-living-room.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: "วังทองหลาง",
      addressRegion: "กรุงเทพมหานคร",
      postalCode: "10310",
      addressCountry: "TH",
    },
    // Taken from the shop's own Google Maps pin (the map_url below resolves to
    // these exact coordinates), not estimated from the street address. This is
    // what lets the shop surface for "ร้านผ้าม่าน ใกล้ฉัน" in the map pack.
    // If the shop ever moves, re-resolve map_url and update these together.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.78625,
      longitude: 100.5930833,
    },
    ...(business.map_url ? { hasMap: business.map_url } : {}),
    // Copied from the shop's own Google Business Profile, which is the single
    // source of truth for this. Google cross-checks the two: hours here that
    // disagree with the profile are worse than none at all, so if the profile
    // hours change, change these in the same sitting.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "06:00",
      closes: "23:00",
    },
    areaServed: [
      { "@type": "City", name: "กรุงเทพมหานคร" },
      { "@type": "AdministrativeArea", name: "ปริมณฑล" },
    ],
    priceRange: "฿฿",
    ...(sameAs.length ? { sameAs } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "บริการของ " + business.name,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.summary,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Content is our own data, not user-supplied HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
