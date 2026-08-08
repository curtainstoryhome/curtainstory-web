"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CallButton, LineButton } from "@/components/CtaButtons";
import Container from "@/components/Container";
import { ArrowRightIcon } from "@/components/icons";
import type { BusinessInfo } from "@/lib/types";

const navLinks = [
  { href: "/", label: "หน้าแรก" },
  { href: "/services", label: "บริการ" },
  { href: "/portfolio", label: "ผลงาน" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/contact", label: "ติดต่อเรา" },
];

// Three things sit in the bar and nothing else: the mark, one way to make
// contact, and a way into the menu. Carrying five links plus two buttons meant
// the labels wrapped at every width between 768px and 1280px, which is what
// made the top of the site look busy.
//
// The bar also thins once the page is scrolled, handing the space back to the
// photography — which is what the shop is actually selling.
export default function Header({ business }: { business: BusinessInfo }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // A boolean that flips once, not a per-frame style write — the bar animates
  // in CSS so scrolling stays smooth.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on navigation, otherwise the panel stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-cream/90 backdrop-blur-md">
      <Container
        className={`flex items-center justify-between transition-[padding] duration-300 ease-out ${
          scrolled ? "py-2" : "py-3.5"
        }`}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded-lg transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.98]"
        >
          <Image
            src="/images/logo.jpg"
            alt=""
            // Matches the largest size this ever renders at (h-11 = 44px), so
            // the preload and the picked source agree. Declaring 52 made the
            // browser fetch a variant it then threw away on every page load.
            width={44}
            height={44}
            sizes="44px"
            priority
            className={`flex-none rounded-full object-cover transition-[width,height] duration-300 ease-out ${
              scrolled ? "h-9 w-9" : "h-11 w-11"
            }`}
          />
          <span className="leading-tight">
            <span
              className={`block font-heading font-semibold tracking-tight text-ink transition-[font-size] duration-300 ${
                scrolled ? "text-base" : "text-lg"
              }`}
            >
              {business.name}
            </span>
            {/* Drops away once scrolled so the bar can be genuinely thin. */}
            <span
              className={`block overflow-hidden whitespace-nowrap text-[11px] font-normal tracking-wide text-brand-700 transition-[max-height,opacity] duration-300 ${
                scrolled ? "max-h-0 opacity-0" : "max-h-5 opacity-100"
              }`}
            >
              {business.name_en}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* One action in the bar. The phone number joins it only where there
              is room to spare. */}
          <span className="hidden sm:block">
            <LineButton
              business={business}
              className="whitespace-nowrap px-4 py-2 text-[13px]"
            />
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-brand-200 bg-white text-ink transition-[background-color,transform] hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-95"
          >
            <span className="sr-only">{open ? "ปิดเมนู" : "เปิดเมนู"}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {open ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <path d="M3 6h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M3 10h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <>
          {/* Dims the page rather than covering it, so it still reads as a
              panel belonging to this site. */}
          <button
            type="button"
            aria-label="ปิดเมนู"
            onClick={() => setOpen(false)}
            // top-full pins this to the bar's real bottom edge. It used to use
            // a hardcoded 72px, which was only right while the bar was at full
            // height — once scrolled it left an undimmed strip that ate taps
            // instead of closing the menu.
            className="absolute inset-x-0 top-full z-40 h-screen cursor-default bg-ink/30 backdrop-blur-sm"
          />
          <div
            id="site-menu"
            className="absolute inset-x-0 z-50 border-t border-brand-100 bg-cream shadow-[0_20px_40px_-24px_rgba(60,42,20,0.5)]"
          >
            <Container className="py-4">
              <nav aria-label="เมนูหลัก" className="grid gap-1">
                {navLinks.map((link) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-12 items-center justify-between rounded-xl px-4 font-heading text-[17px] font-medium transition-[background-color,transform] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.99] ${
                        active
                          ? "bg-brand-700 text-white"
                          : "text-ink hover:bg-brand-50"
                      }`}
                    >
                      {link.label}
                      <ArrowRightIcon
                        className={`h-4 w-4 ${active ? "text-white/70" : "text-brand-400"}`}
                      />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 flex flex-col gap-2.5 border-t border-brand-100 pt-4 sm:flex-row">
                <LineButton business={business} className="flex-1" />
                <CallButton business={business} className="flex-1" />
              </div>
            </Container>
          </div>
        </>
      )}
    </header>
  );
}
