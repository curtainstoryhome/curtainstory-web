import Image from "next/image";
import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import { ArrowRightIcon } from "@/components/icons";
import type { ServiceRow } from "@/lib/types";

// An editorial plate rather than a boxed photo with a caption stuck beneath.
// The picture fills the card, the name sits on the image, and a numbered index
// runs down the set — how interior studios present work, and it reads as
// considered rather than assembled from a template.
export default function ServiceCard({
  service,
  index,
}: {
  service: ServiceRow;
  index?: number;
}) {
  return (
    <TiltCard>
      <Link
        href={`/services/${service.slug}`}
        className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-ink shadow-[0_2px_10px_-3px_rgba(109,83,39,0.2)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-14px_rgba(109,83,39,0.42)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:translate-y-0"
      >
        <Image
          src={service.image_url}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          quality={90}
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
        />

        {/* Anchors the text to a dark base so it stays readable over any
            photo, bright or dark, without dimming the whole picture.
            The stops are explicit because the text block sits about a fifth of
            the way up: a plain two-stop gradient left that band too light and
            white type measured only 4.28:1 over a bright interior shot. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(34,29,25,0.97) 0%, rgba(34,29,25,0.93) 30%, rgba(34,29,25,0.72) 52%, rgba(34,29,25,0.18) 78%, rgba(34,29,25,0) 100%)",
          }}
        />

        {index !== undefined && (
          <span
            aria-hidden
            className="absolute left-5 top-5 font-heading text-xs font-semibold tracking-[0.2em] text-white/70"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <div className="relative p-5">
          {/* A hairline that draws itself outward on hover — the small detail
              that makes the set feel designed rather than assembled. */}
          <span
            aria-hidden
            className="mb-3 block h-px w-8 origin-left bg-brand-400 transition-transform duration-500 ease-out group-hover:scale-x-[4]"
          />
          <h3 className="font-heading text-lg font-semibold text-white">
            {service.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-white/85">
            {service.summary}
          </p>
          {/* Always visible, not hover-only — on a phone there is no hover, and
              the visitor still needs to see that this opens something. */}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-200">
            ดูรายละเอียด
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
