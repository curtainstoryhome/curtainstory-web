import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { CtaGroup } from "@/components/CtaButtons";
import { getServices, getBusinessInfo,
  getSiteText,
} from "@/lib/data";
import { fullBusinessName } from "@/lib/business-name";
import { og } from "@/lib/og";

const TITLE = "บริการของเรา";
const DESCRIPTION =
  "ผ้าม่าน วอลล์เปเปอร์ มู่ลี่ มุ้งลวด เหล็กดัด ฟิล์มกรองแสง และบริการซักผ้าม่าน โดย CURTAIN STORY HOME";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/services" },
    openGraph: og(
      { title: TITLE, description: DESCRIPTION, url: "/services" },
      fullBusinessName(business),
    ),
  };
}

export default async function ServicesPage() {
  const [services, business, t] = await Promise.all([
    getServices(),
    getBusinessInfo(),
    getSiteText(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={t("services_hero_eyebrow", "สินค้าและบริการ")}
        title={t("services_hero_title", "บริการของเรา")}
        description={t("services_hero_desc", "รับออกแบบ ตัดเย็บ และติดตั้ง ผ้าม่าน วอลล์เปเปอร์ มู่ลี่ และงานตกแต่งหน้าต่างครบวงจร ด้วยทีมงานมืออาชีพและวัสดุคุณภาพสูง")}
        image={services[0]?.image_url}
        imageAlt="งานผ้าม่านและงานตกแต่งหน้าต่าง โดย CURTAIN STORY HOME"
      />

      <section className="py-14 sm:py-16">
        <Container className="space-y-14">
          {services.map((service, index) => (
            // One link per card, not three. The photo, the heading and the
            // "ดูรายละเอียด" row all pointed at the same page, so a keyboard or
            // screen-reader user had to pass the same destination three times
            // per service — 21 stops to get through this list. The heading now
            // carries the only link and stretches over the whole card, which
            // also makes the target the full card instead of a 29px word.
            <article
              key={service.slug}
              className={`group relative grid items-center gap-8 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-brand-100 shadow-[0_4px_16px_-6px_rgba(124,94,62,0.22)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_-14px_rgba(124,94,62,0.36)]">
                <Image
                  src={service.image_url}
                  alt={`บริการ${service.title}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  quality={90}
                />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
                  <Link
                    href={`/services/${service.slug}`}
                    // after:z-10 matters — without it the blurb and the
                    // "ดูรายละเอียด" row come later in the DOM and paint over
                    // the overlay, so only the photo half of the card was
                    // actually clickable.
                    className="rounded transition-colors after:absolute after:inset-0 after:z-10 after:content-[''] hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 active:text-brand-800"
                  >
                    {service.title}
                  </Link>
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  {service.description}
                </p>
                {/* Reads as the affordance; the card itself is the link. */}
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:underline">
                  ดูรายละเอียด{service.title}
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section className="bg-cream-deep py-14">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            {t("services_cta_title", "สนใจบริการไหนเป็นพิเศษ?")}
          </h2>
          <p className="max-w-xl text-ink-soft">
            {t("cta_desc", "ทักหาเราได้เลย ให้คำปรึกษาฟรี พร้อมนัดวัดพื้นที่หน้างาน")}
          </p>
          <CtaGroup business={business} />
        </Container>
      </section>
    </>
  );
}
