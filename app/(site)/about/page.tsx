import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { CtaGroup } from "@/components/CtaButtons";
import { fullBusinessName } from "@/lib/business-name";
import { getBusinessInfo, getServices, getWhyUsItems,
  getSiteText,
} from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();
  return {
    title: "เกี่ยวกับเรา",
    // The shop's own description runs ~280 characters and Google cuts the
    // snippet near 155, so the half naming the services was never shown.
    description: `รู้จัก ${business.name} ร้านผ้าม่าน วอลล์เปเปอร์ และมู่ลี่ ย่านลาดพร้าว-วังทองหลาง รับออกแบบ ตัดเย็บ และติดตั้งครบวงจร ดูแลตั้งแต่เลือกวัสดุจนติดตั้งเสร็จ`,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [business, services, whyUs, t] = await Promise.all([
    getBusinessInfo(),
    getServices(),
    getWhyUsItems(),
    getSiteText(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={t("about_hero_eyebrow", "เกี่ยวกับเรา")}
        title={fullBusinessName(business)}
      />

      <section className="py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-brand-100 shadow-sm">
            <Image
              src={t("about_image", "/images/proj-saransiri-91-1.jpg")}
              alt={business.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            
          quality={90}
        />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
              {business.name_en}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              {business.description}
            </p>
            <CtaGroup business={business} className="mt-8" />
          </div>
        </Container>
      </section>

      <section className="bg-cream-deep py-14 sm:py-16">
        <Container>
          <h2 className="text-center font-heading text-2xl font-semibold text-ink sm:text-3xl">
            {t("about_whyus_title", "ทำไมต้องเลือกเรา")}
          </h2>
          <ul className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            {whyUs.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand-700 text-xs text-white">
                  ✓
                </span>
                <span className="text-ink-soft">{item.text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="text-center font-heading text-2xl font-semibold text-ink sm:text-3xl">
            {t("about_services_title", "บริการของเรา")}
          </h2>
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="flex min-h-11 items-center justify-center rounded-full border border-brand-200 bg-white px-4 py-3 text-center text-sm text-ink-soft shadow-[0_2px_8px_-3px_rgba(124,94,62,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700 hover:shadow-[0_10px_20px_-8px_rgba(124,94,62,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:translate-y-0 active:scale-[0.97]"
              >
                {service.title}
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-brand-500 px-6 py-3 text-sm font-semibold text-brand-700 transition-[background-color,transform] duration-150 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
            >
              ดูรายละเอียดบริการ
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
