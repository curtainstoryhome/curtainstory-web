import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";

// Every page used to open with the same flat beige band, which made the
// services list, a single service and a project page look interchangeable.
// Now the page opens with its own subject at full width: the service's photo,
// the project's cover, real work. It tells you where you are before you read
// a word, and it puts the photography — the thing being sold — first.
//
// Pages with no photo of their own fall back to the plain band, so this can be
// dropped in anywhere without a broken-looking gap.
export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  backHref,
  backLabel,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  // The biggest photo on the page. Left empty it is invisible to image search,
  // which matters for a shop people buy with their eyes. Pass something that
  // adds to the heading rather than repeating it — a screen reader should not
  // hear the same sentence twice.
  imageAlt?: string;
  backHref?: string;
  backLabel?: string;
}) {
  if (!image) {
    return (
      <section className="border-b border-brand-100 bg-cream-deep py-14 sm:py-16">
        <Container>
          {backHref && (
            <Link
              href={backHref}
              className="-mx-2 mb-3 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-brand-700 transition-[background-color,transform] duration-150 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
            >
              ← {backLabel}
            </Link>
          )}
          {eyebrow && (
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700">
              <span className="h-px w-7 bg-brand-400/70" />
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-heading text-[28px] font-semibold leading-[1.25] tracking-tight text-ink sm:text-[38px]">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
              {description}
            </p>
          )}
        </Container>
      </section>
    );
  }

  return (
    <section className="relative isolate flex min-h-[58vh] items-end overflow-hidden bg-ink sm:min-h-[64vh]">
      <Image
        src={image}
        alt={imageAlt ?? ""}
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
      />
      {/* Weighted to the bottom, where the words sit, so the top of the photo
          stays bright and the text still clears 4.5:1 on a pale interior. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(34,29,25,0.94) 0%, rgba(34,29,25,0.88) 30%, rgba(34,29,25,0.74) 52%, rgba(34,29,25,0.30) 74%, rgba(34,29,25,0.06) 100%)",
        }}
      />

      <Container className="relative pb-12 pt-28 sm:pb-16 sm:pt-32">
        {backHref && (
          <Link
            href={backHref}
            // This control sits at the top of the frame, where the scrim is
            // deliberately light so the photo stays bright — measured 1.02:1
            // against a pale interior. It carries its own backing instead.
            className="mb-4 inline-flex min-h-11 items-center rounded-full bg-ink/60 px-4 text-sm font-semibold text-white backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-ink/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97]"
          >
            ← {backLabel}
          </Link>
        )}
        {eyebrow && (
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
            <span className="h-px w-7 bg-brand-200" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl font-heading text-[30px] font-semibold leading-[1.2] tracking-tight text-white sm:text-[44px] lg:text-[52px]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/85 sm:text-base">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
