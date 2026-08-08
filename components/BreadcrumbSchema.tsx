import { siteUrl } from "@/lib/site-url";

// Tells Google where a page sits in the site rather than leaving it to guess
// from the URL. On a result for "ผ้าม่านวังทองหลาง" this turns a bare
// buitincurtains.vercel.app/services/curtains into
// "CURTAIN STORY › บริการ › ผ้าม่านทุกชนิด", which reads as a real shop.
//
// Emitted as its own node, separate from the business schema, so neither can
// invalidate the other if one has a bad field.
export default function BreadcrumbSchema({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: `${siteUrl}${step.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Our own content, not user-supplied HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
