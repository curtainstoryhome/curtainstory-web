import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ThemeColors from "@/components/ThemeColors";
import StickyContactBar from "@/components/StickyContactBar";
import { getBusinessInfo, getSiteSettings } from "@/lib/data";

// The English page sits outside the Thai site layout on purpose. Its header
// menu, footer and floating buttons are all Thai, and the people this page is
// for arrive from English searches ("curtain store Bangkok", "custom curtains
// Bangkok"): about 110 paid clicks a month that were landing on a page they
// could not read.
export default async function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [business, settings] = await Promise.all([
    getBusinessInfo(),
    getSiteSettings(),
  ]);
  const year = new Date().getFullYear();

  return (
    <div lang="en" className="flex flex-1 flex-col">
      <ThemeColors settings={settings} />
      <header className="sticky top-0 z-50 border-b border-brand-100 bg-cream/90 backdrop-blur-md">
        <Container className="flex items-center justify-between py-3">
          <Link
            href="/en"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            <Image
              src="/images/logo.jpg"
              alt=""
              width={44}
              height={44}
              sizes="44px"
              priority
              className="h-11 w-11 flex-none rounded-full object-cover"
            />
            <span className="leading-tight">
              <span className="block font-heading text-lg font-semibold tracking-tight text-ink">
                {business.name}
              </span>
              <span className="block text-[11px] tracking-wide text-brand-700">
                Curtains · Blinds · Wallpaper
              </span>
            </span>
          </Link>
          <Link
            href="/"
            lang="th"
            hrefLang="th"
            className="inline-flex min-h-11 items-center rounded-full border border-brand-200 px-4 text-sm font-semibold text-brand-700 transition-colors duration-150 hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            ภาษาไทย
          </Link>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-brand-100 bg-cream-deep">
        <Container className="grid gap-8 py-12 sm:grid-cols-2">
          <div>
            <p className="font-heading text-lg font-semibold text-ink">
              {business.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Made-to-measure curtains, blinds and wallpaper in Bangkok.
            </p>
          </div>
          <div className="text-sm leading-relaxed text-ink-soft">
            <p lang="th">{business.address}</p>
            <a
              href={business.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-2 mt-1 inline-block min-h-11 rounded-lg px-2 py-2.5 font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Open in Google Maps →
            </a>
          </div>
        </Container>
        <div className="border-t border-brand-100 py-5">
          <Container>
            <p className="text-center text-xs text-ink-soft">
              © {year} {business.name}
            </p>
          </Container>
        </div>
      </footer>

      <StickyContactBar business={business} lang="en" />
      <div aria-hidden className="h-[68px] md:hidden" />
    </div>
  );
}
