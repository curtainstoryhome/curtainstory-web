import Link from "next/link";
import type { Metadata } from "next";
import { getBusinessInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "ไม่พบหน้าที่ต้องการ",
  // A missing page should never be offered to search engines as a result.
  robots: { index: false, follow: true },
};

// Lives at the app root so it also catches URLs outside the (site) group,
// which means it cannot inherit that group's header and footer — it carries
// its own way back instead. This page matters more than it looks: once the
// domain moves off WordPress, every old URL still sitting in Google's index
// lands here, and a dead end there is a lost customer.
export default async function NotFound() {
  const business = await getBusinessInfo();

  const links = [
    { href: "/", label: "หน้าแรก" },
    { href: "/services", label: "บริการของเรา" },
    { href: "/portfolio", label: "ผลงานของเรา" },
    { href: "/contact", label: "ติดต่อเรา" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-16 text-center">
      <p className="font-heading text-sm font-semibold tracking-widest text-brand-700">
        404
      </p>
      <h1 className="mt-3 font-heading text-2xl font-semibold text-ink sm:text-3xl">
        ไม่พบหน้าที่คุณกำลังมองหา
      </h1>
      <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
        หน้านี้อาจถูกย้ายหรือเปลี่ยนที่อยู่แล้ว
        ลองเลือกจากเมนูด้านล่าง หรือทักแชทมาถามเราได้เลย
      </p>

      <nav className="mt-8 flex flex-wrap justify-center gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-medium text-ink-soft transition-colors hover:border-brand-500 hover:text-brand-700"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={business.line_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          แชทกับเราทาง LINE
        </a>
        <a
          href={business.phone_href}
          className="rounded-full border-2 border-brand-500 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          โทร {business.phone}
        </a>
      </div>
    </div>
  );
}
