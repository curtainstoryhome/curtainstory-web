import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import { ChatIcon, ClockIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { og, tw } from "@/lib/og";
import { directionsUrl } from "@/lib/geo";
import { lineChatHref, OPENING_MESSAGE_EN } from "@/lib/line";
import { getBusinessInfo, getPublishedProjects } from "@/lib/data";
import type { BusinessInfo } from "@/lib/types";

const TITLE = "Custom Curtains & Blinds in Bangkok";
const DESCRIPTION =
  "Made-to-measure curtains, blinds and wallpaper in Bangkok. Free home measuring and quote, no-drill fitting for condos, installed by our own team in 7–10 days. Chat with us in English on LINE.";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();
  const siteName = business.name;
  return {
    title: { absolute: `${TITLE} | ${siteName}` },
    description: DESCRIPTION,
    alternates: { canonical: "/en" },
    openGraph: {
      ...og({ title: TITLE, description: DESCRIPTION, url: "/en" }, siteName),
      locale: "en_US",
    },
    twitter: tw({ title: TITLE, description: DESCRIPTION }),
  };
}

// Everything stated here is already promised on the Thai pages: free measuring
// with no deposit, a same-day quote from photos, 7-10 days to install, no-drill
// rails for condos, one in-house team. Nothing is added that the shop has not
// said in Thai first.
const STEPS = [
  {
    title: "Send us a photo",
    body: "Take a picture of your window or balcony and send it on LINE, with your area or condo name. We reply with a rough price the same day.",
  },
  {
    title: "Free measuring at home",
    body: "Our installer comes to your home or condo to measure. Measuring and the quote are free, with no deposit.",
  },
  {
    title: "Made and installed",
    body: "Everything is cut to your windows, not standard sizes, and fitted by the same team that measured, usually within 7–10 days.",
  },
];

const PRODUCTS = [
  {
    title: "Curtains",
    body: "Pinch pleat, wave, eyelet, sheer and blackout, in the fabric and colour you choose.",
    image: "/images/product-curtains-elegant.jpg",
  },
  {
    title: "Roller blinds & Venetian blinds",
    body: "Roller blinds, Roman blinds, and wood or aluminium Venetian blinds that let you tilt the light.",
    image: "/images/cat-blinds-1.jpg",
  },
  {
    title: "Wallpaper",
    body: "Luxury, modern and minimal patterns, supplied and hung by our team.",
    image: "/images/product-wallpaper-1.jpg",
  },
  {
    title: "Mosquito screens",
    body: "Insect screens for windows and doors, plus decorative window grilles.",
    image: "/images/product-window-screen.jpg",
  },
  {
    title: "Window film",
    body: "Heat and UV control film for homes, condos and offices.",
    image: "/images/product-window-film.jpg",
  },
  {
    title: "Curtain cleaning",
    body: "Curtain, carpet and sofa cleaning.",
    image: "/images/product-cleaning.jpg",
  },
];

const FAQ = [
  {
    q: "My condo doesn't allow drilling. Can you still fit curtains?",
    a: "Yes. We use rails fixed to the ceiling or the window frame instead of the wall. We check what your building allows when we come to measure.",
  },
  {
    q: "Do you charge for measuring?",
    a: "No. Measuring and the quote are free, and there is no deposit to book the visit.",
  },
  {
    q: "How long does it take?",
    a: "Usually 7–10 days from measuring to installation.",
  },
  {
    q: "I'm renting. Can I take the curtains with me?",
    a: "Yes. Tell us it's a rental and we'll use rails that come off without marks and leave some extra fabric so they can fit your next place.",
  },
  {
    q: "Which areas do you cover?",
    a: "Bangkok, including Lat Phrao, Wang Thonglang, Khlong Toei, Watthana and Sathorn, and Nonthaburi.",
  },
];

// The profile and the site both say 06:00-22:00; the owner confirmed ten at
// night is when she stops answering (StructuredData.tsx).
const HOURS = "Every day, 6:00 am – 10:00 pm";

// A visitor on a foreign SIM dials the +66 form; the local 0 form can fail.
function internationalPhone(business: BusinessInfo) {
  return `+66 ${business.phone.replace(/^0/, "")}`;
}

function internationalTel(business: BusinessInfo) {
  return `tel:+66${business.phone_href.replace(/[^0-9]/g, "").replace(/^0/, "")}`;
}

function Buttons({
  business,
  className = "",
  onDark = false,
}: {
  business: BusinessInfo;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <div
      data-cta-block
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      <a
        href={lineChatHref(business, OPENING_MESSAGE_EN)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-line px-6 py-3 text-sm font-semibold text-white transition-[opacity,transform] duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line active:scale-[0.97]"
      >
        <ChatIcon className="h-4 w-4" />
        Chat on LINE
      </a>
      <a
        href={internationalTel(business)}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-semibold transition-[background-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] ${
          onDark
            ? "border-white text-white hover:bg-white/10 focus-visible:outline-white"
            : "border-brand-500 text-brand-700 hover:bg-brand-50 focus-visible:outline-brand-700"
        }`}
      >
        <PhoneIcon className="h-4 w-4" />
        Call {internationalPhone(business)}
      </a>
    </div>
  );
}

export default async function EnglishPage() {
  const [business, projects] = await Promise.all([
    getBusinessInfo(),
    getPublishedProjects(),
  ]);
  // Shown beside the condo section, so condo jobs go first and the latest
  // other work fills any gap.
  const isCondo = (project: (typeof projects)[number]) =>
    /คอนโด|condo/i.test(`${project.title} ${project.description}`);
  const photos = [
    ...projects.filter(isCondo),
    ...projects.filter((project) => !isCondo(project)),
  ].slice(0, 3);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="border-b border-brand-100 bg-cream-deep py-12 sm:py-16">
        <Container>
          <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-700">
            <span className="h-px w-7 bg-brand-400/70" />
            Curtain shop in Bangkok
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-[30px] font-semibold leading-[1.2] tracking-tight text-ink sm:text-[42px]">
            Made-to-measure curtains and blinds, fitted in your home
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
            Free measuring and quote, no deposit. No-drill fitting for condos.
            Message us in English and send a photo of your window to get a
            price today.
          </p>
          <Buttons business={business} className="mt-6" />
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 font-heading font-semibold text-brand-700">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-cream-deep py-14 sm:py-16">
        <Container>
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            What we make and fit
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] sm:aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
              Living in a condo?
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">
              <p>
                Many buildings don&apos;t allow drilling into the walls, balconies
                take the full afternoon sun, and floor-to-ceiling glass is
                taller than ready-made curtains. Fitting condos across Bangkok
                is everyday work for us, and we measure every window before we
                cut.
              </p>
              <p>
                Blackout curtains and heat-reducing roller blinds keep a
                west-facing room cool and stop furniture fading. A sheer and
                blackout pair gives you daylight with privacy from the building
                opposite.
              </p>
            </div>
            <Buttons business={business} className="mt-8" />
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((project, i) => (
                <div
                  key={project.slug}
                  className={`relative overflow-hidden rounded-2xl border border-brand-100 ${
                    i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={project.images[0].image_url}
                    alt={`Curtains installed by ${business.name} in Bangkok`}
                    fill
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-cream-deep py-14 sm:py-16">
        <Container className="max-w-3xl">
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            Questions we get asked
          </h2>
          <dl className="mt-8 space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm"
              >
                <dt className="font-heading text-lg font-semibold text-ink">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            Visit the shop
          </h2>
          <div className="mt-6 space-y-4 text-ink-soft">
            <p className="flex items-start gap-3">
              <PinIcon className="mt-0.5 h-5 w-5 flex-none text-brand-600" />
              <span>
                Soi Lat Phrao 64, Wang Thonglang, Bangkok 10310
                <span lang="th" className="mt-1 block text-sm">
                  {business.address}
                </span>
              </span>
            </p>
            <p className="flex items-center gap-3">
              <ClockIcon className="h-5 w-5 flex-none text-brand-600" />
              {HOURS}
            </p>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            <PinIcon className="h-4 w-4" />
            Directions in Google Maps
          </a>
        </Container>
      </section>

      <section className="bg-ink py-14 sm:py-16">
        <Container className="max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
            Not sure what you need?
          </h2>
          <p className="mt-4 leading-relaxed text-white/80">
            You don&apos;t need to measure anything. Send a photo of the window
            on LINE and we&apos;ll tell you what would work and roughly what it
            costs.
          </p>
          <Buttons business={business} className="mt-8 justify-center" onDark />
        </Container>
      </section>
    </>
  );
}
