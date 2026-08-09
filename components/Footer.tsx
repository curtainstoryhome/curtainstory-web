import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import type { BusinessInfo } from "@/lib/types";
import { fullBusinessName } from "@/lib/business-name";

const navLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/services", label: "บริการ" },
  { href: "/portfolio", label: "ผลงาน" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/contact", label: "ติดต่อเรา" },
];

export default function Footer({ business }: { business: BusinessInfo }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-100 bg-cream-deep">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <Image
            src="/images/logo.jpg"
            alt=""
            width={64}
            height={64}
            className="mb-3 h-14 w-14 rounded-full object-cover"
          />
          <p className="font-heading text-lg font-semibold leading-snug text-ink">
            {business.name}
            <span aria-hidden className="font-normal text-brand-400">{" | "}</span>
            <span className="font-normal text-brand-700">{business.name_en}</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {business.tagline}
          </p>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold text-ink">
            เมนู
          </p>
          <ul className="mt-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="-mx-2 inline-block min-h-11 rounded-lg px-2 py-2.5 text-sm text-ink-soft hover:text-brand-600 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:bg-brand-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold text-ink">
            ติดต่อเรา
          </p>
          <ul className="mt-1 text-sm text-ink-soft">
            <li>
              <a
                href={business.phone_href}
                className="-mx-2 inline-block min-h-11 rounded-lg px-2 py-2.5 hover:text-brand-600 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:bg-brand-50"
              >
                โทร {business.phone}
              </a>
            </li>
            <li>
              <a
                href={business.line_url}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-2 inline-block min-h-11 rounded-lg px-2 py-2.5 hover:text-brand-600 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:bg-brand-50"
              >
                แชทกับเราทาง LINE
              </a>
            </li>
            <li className="py-2.5">
              {business.facebook_url ? (
                <a
                  href={business.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-mx-2 inline-block min-h-11 rounded-lg px-2 py-2.5 hover:text-brand-600 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:bg-brand-50"
                >
                  Facebook: {business.facebook_name}
                </a>
              ) : (
                <span>Facebook: {business.facebook_name}</span>
              )}
            </li>
          </ul>
        </div>

        <div>
          <p className="font-heading text-sm font-semibold text-ink">
            ที่ตั้งร้าน
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {business.address}
          </p>
          <a
            href={business.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="-mx-2 mt-1 inline-block min-h-11 rounded-lg px-2 py-2.5 text-sm font-semibold text-brand-700 hover:underline transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:bg-brand-50"
          >
            ดูแผนที่ →
          </a>
        </div>
      </Container>

      <div className="border-t border-brand-100 py-5">
        <Container className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-ink-soft">
            © {year} {fullBusinessName(business)}. สงวนลิขสิทธิ์
          </p>
          <p className="flex gap-4 text-xs">
            <Link
              href="/privacy"
              className="text-ink-soft hover:text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link
              href="/terms"
              className="text-ink-soft hover:text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              ข้อกำหนดการใช้บริการ
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
