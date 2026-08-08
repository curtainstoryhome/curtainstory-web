import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ProjectCarousel from "@/components/ProjectCarousel";
import ProjectGallery from "@/components/ProjectGallery";
import { CtaGroup } from "@/components/CtaButtons";
import { ArrowRightIcon } from "@/components/icons";
import {
  getServices,
  getServiceBySlug,
  getServiceImages,
  getPublishedProjects,
  getBusinessInfo,
  getSiteText,
} from "@/lib/data";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description || service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.description || service.summary,
      url: `/services/${service.slug}`,
      images: [{ url: service.image_url, alt: service.title }],
    },
  };
}

export default async function ServiceDetailPage(
  props: PageProps<"/services/[slug]">,
) {
  const { slug } = await props.params;
  const [service, services, projects, business, t, catalogue] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getPublishedProjects(),
    getBusinessInfo(),
    getSiteText(),
    getServiceImages(slug),
  ]);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== service.slug);

  // Work that actually shows this service. When none is tagged yet, fall back
  // to recent work under a neutral heading rather than claiming these jobs
  // were something they weren't.
  const matching = projects.filter((p) => p.service_slugs.includes(service.slug));
  const showcase = matching.length > 0 ? matching : projects;
  const showcaseTitle =
    matching.length > 0
      ? `ผลงาน${service.title}ของเรา`
      : "ผลงานติดตั้งของเรา";

  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "หน้าแรก", path: "/" },
          { name: "บริการ", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
      />
      <PageHero
        eyebrow="บริการของเรา"
        title={service.title}
        description={service.summary}
        image={service.image_url}
        imageAlt={`บริการ${service.title} โดย CURTAIN STORY`}
        backHref="/services"
        backLabel="บริการทั้งหมด"
      />

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            รายละเอียดบริการ
          </h2>
          <p className="mt-4 text-[15px] leading-[1.9] text-ink-soft sm:text-base">
            {service.description || service.summary}
          </p>
          <CtaGroup business={business} className="mt-8" />
          <Link
            href="/portfolio"
            className="-mx-2 mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-brand-700 transition-[background-color,transform] duration-150 hover:bg-brand-50 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
          >
            ดูผลงานจริงของเรา
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </Container>
      </section>

      {catalogue.length > 0 && (
        <section className="border-t border-brand-100 bg-cream-deep py-14 sm:py-16">
          <Container>
            <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
              แคตตาล็อก{service.title}
            </h2>
            <p className="mt-2 max-w-2xl text-ink-soft">
              ตัวอย่างลายและสีที่มีให้เลือก กดที่รูปเพื่อดูขนาดใหญ่และดูรหัสสินค้า
              สนใจแบบไหนทักมาถามได้เลย
            </p>
            <div className="mt-8">
              <ProjectGallery
                images={catalogue}
                projectTitle={service.title}
                altPrefix="ตัวอย่างลาย"
                fit="contain"
              />
            </div>
          </Container>
        </section>
      )}

      {showcase.length > 0 && (
        <section className="border-t border-brand-100 py-14 sm:py-16">
          <Container>
            <ProjectCarousel projects={showcase} title={showcaseTitle} />
          </Container>
        </section>
      )}

      {otherServices.length > 0 && (
        <section className="border-t border-brand-100 py-14 sm:py-16">
          <Container>
            <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
              บริการอื่นๆ ของเรา
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {otherServices.map((other) => (
                <Link
                  key={other.slug}
                  href={`/services/${other.slug}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-medium text-ink-soft shadow-[0_2px_8px_-3px_rgba(124,94,62,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700 hover:shadow-[0_10px_20px_-8px_rgba(124,94,62,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:translate-y-0 active:scale-[0.97]"
                >
                  {other.title}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-cream-deep py-14">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            {t("service_detail_cta_title", "สนใจบริการนี้?")}
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
