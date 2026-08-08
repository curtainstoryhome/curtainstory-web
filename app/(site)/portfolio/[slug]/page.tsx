import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ProjectCarousel from "@/components/ProjectCarousel";
import ProjectGallery from "@/components/ProjectGallery";
import { ArrowRightIcon } from "@/components/icons";
import { CtaGroup } from "@/components/CtaButtons";
import VideoEmbed from "@/components/VideoEmbed";
import {
  getPublishedProjects,
  getProjectBySlug,
  getServices,
  getBusinessInfo,
  getSiteText,
} from "@/lib/data";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/portfolio/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  // The cover photo doubles as the share preview, so a project link pasted
  // into LINE shows the actual curtains instead of the generic hero.
  const cover = project.images[0]?.image_url;
  return {
    // "ผลงานติดตั้ง" is not decoration. Renaming the folding-door project to
    // match its service left two pages titled "ฉากกั้นห้อง | CURTAIN STORY",
    // which is a straight duplicate for Google — and it also tells someone
    // scanning results that this page is real finished work, not a sales page.
    title: `${project.title} — ผลงานติดตั้ง`,
    description: project.description,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `/portfolio/${project.slug}`,
      ...(cover ? { images: [{ url: cover, alt: project.title }] } : {}),
    },
    ...(cover ? { twitter: { card: "summary_large_image", images: [cover] } } : {}),
  };
}

export default async function ProjectDetailPage(
  props: PageProps<"/portfolio/[slug]">,
) {
  const { slug } = await props.params;
  const [project, business, allProjects, services, t] = await Promise.all([
    getProjectBySlug(slug),
    getBusinessInfo(),
    getPublishedProjects(),
    getServices(),
    getSiteText(),
  ]);
  // No photos means the owner has not finished adding it. The list already
  // hides it; without this the detail page would still render on demand and
  // show a project page with an empty gallery.
  if (!project || project.images.length === 0) notFound();

  const usedServices = services.filter((s) =>
    project.service_slugs.includes(s.slug),
  );

  // Someone who just liked this job is the most likely person to look at
  // another one. Without this the page dead-ends at the CTA. All of them are
  // offered, not a slice — the carousel makes the extras cost nothing.
  const otherProjects = allProjects.filter((p) => p.slug !== project.slug);

  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "หน้าแรก", path: "/" },
          { name: "ผลงาน", path: "/portfolio" },
          { name: project.title, path: `/portfolio/${project.slug}` },
        ]}
      />
      <PageHero
        eyebrow="ผลงาน"
        title={project.title}
        description={project.description}
        image={project.images[0]?.image_url}
        imageAlt={`ผลงานติดตั้ง${project.title} โดย CURTAIN STORY HOME`}
        backHref="/portfolio"
        backLabel="ผลงานทั้งหมด"
      />

      {usedServices.length > 0 && (
        <section className="border-b border-brand-100 py-6">
          <Container className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-soft">บริการที่ใช้ในงานนี้:</span>
            {usedServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 text-sm font-medium text-brand-700 shadow-[0_2px_8px_-3px_rgba(109,83,39,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-[0_10px_20px_-8px_rgba(109,83,39,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:translate-y-0"
              >
                {service.title}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            ))}
          </Container>
        </section>
      )}

      {project.video_url && (
        <section className="pt-14 sm:pt-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <VideoEmbed url={project.video_url} title={project.title} />
            </div>
          </Container>
        </section>
      )}

      <section className="py-14 sm:py-16">
        <Container>
          <ProjectGallery images={project.images} projectTitle={project.title} />
        </Container>
      </section>

      {otherProjects.length > 0 && (
        <section className="border-t border-brand-100 py-14 sm:py-16">
          <Container>
            <ProjectCarousel projects={otherProjects} />
          </Container>
        </section>
      )}

      <section className="bg-cream-deep py-14">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            {t("cta_title", "อยากให้บ้านคุณสวยแบบนี้บ้าง?")}
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
