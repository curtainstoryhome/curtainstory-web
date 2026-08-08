"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "แดชบอร์ด" },
  { href: "/admin/projects", label: "ผลงาน" },
  { href: "/admin/services", label: "บริการ" },
  { href: "/admin/reviews", label: "รีวิว" },
  { href: "/admin/hero-images", label: "รูปแบนเนอร์" },
  { href: "/admin/content", label: "ข้อความและสี" },
  { href: "/admin/settings", label: "ข้อมูลร้าน" },
  { href: "/admin/manual", label: "คู่มือการใช้งาน" },
];

// Marks where you are. Without this every admin page looked identical at the
// top and it was easy to lose track of which section you were editing.
export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="เมนูผู้ดูแล" className="flex flex-wrap items-center gap-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-[background-color,color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97] ${
              active
                ? "bg-brand-700 text-white"
                : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
