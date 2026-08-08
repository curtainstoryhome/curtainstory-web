import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import ProjectCarousel from "@/components/ProjectCarousel";
import ReviewMarquee from "@/components/ReviewMarquee";
import CurtainReveal from "@/components/CurtainReveal";
import VideoEmbed from "@/components/VideoEmbed";
import HeroCarousel from "@/components/HeroCarousel";
import Reveal from "@/components/Reveal";
import { PlayIcon } from "@/components/icons";
import { CtaGroup } from "@/components/CtaButtons";
import {
  getBusinessInfo,
  getServices,
  getPublishedProjects,
  getWhyUsItems,
  getReviewImages,
  getSiteText,
  getHeroImages,
} from "@/lib/data";


export default async function Home() {
  const [business, services, projects, whyUs, reviewImages, t, heroImages] =
    await Promise.all([
      getBusinessInfo(),
      getServices(),
      getPublishedProjects(),
      getWhyUsItems(),
      getReviewImages(),
      getSiteText(),
      getHeroImages(),
    ]);

  return (
    <>
      <section className="relative overflow-hidden bg-cream-deep">
        {/* On a phone the order is deliberate: name, promise, then the work
            itself — before any long copy. This is a business people buy with
            their eyes, and the previous order pushed the photo almost entirely
            below the fold behind a 280-character paragraph. */}
        <Container className="flex flex-col gap-8 py-12 sm:py-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-24">
          {/* `contents` on a phone lets the two text blocks be ordered
              individually around the photo; from lg it becomes one grid cell
              so the text simply stacks in the left column beside the picture.
              Ordering three separate items inside a two-column grid is what
              scattered them across the wrong cells. */}
          <div className="contents lg:block">
            <div className="order-1">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-700">
                <span className="h-px w-7 bg-brand-400/70" />
                {business.name}
              </p>
              <h1 className="mt-4 font-heading text-[30px] font-semibold leading-[1.22] tracking-tight text-ink sm:text-[40px] lg:text-[46px]">
                {business.tagline}
              </h1>
            </div>

            {/* No LINE/phone pair here on purpose. It sat one swipe above the
                same pair further down, the footer's pair and the floating pair
                — thirteen contact buttons on this page. The floating pair in
                the corner covers the top of the page now, so the first thing
                someone reads is what the shop does, not a second ask. */}
            <div className="order-3 lg:mt-8">
              {business.video_url && (
                // Quiet on purpose: it tells people the video exists without
                // competing with LINE and the phone number.
                <a
                  href="#video"
                  className="group mt-5 inline-flex min-h-11 items-center gap-2.5 rounded-full text-sm font-medium text-ink-soft transition-[color,transform] duration-150 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
                >
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 shadow-[0_2px_8px_-3px_rgba(124,94,62,0.2)] transition-all duration-200 group-hover:border-brand-500 group-hover:shadow-[0_8px_18px_-8px_rgba(124,94,62,0.34)]">
                    <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
                  </span>
                  {t("home_video_link", "ดูวิดีโอบรรยากาศงานติดตั้งจริง")}
                </a>
              )}
              <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-ink-soft sm:text-[16px]">
                {business.description}
              </p>
            </div>
          </div>

          <div className="relative order-2 aspect-[4/3] w-full rounded-3xl shadow-[0_30px_70px_-28px_rgba(60,42,20,0.6)] lg:aspect-[5/6]">
            <HeroCarousel alt={business.name} images={heroImages} />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
          <SectionHeading
            eyebrow={t("home_services_eyebrow", "สินค้าและบริการ")}
            title={t("home_services_title", "บริการครบวงจร ในที่เดียว")}
            description={t("home_services_desc", "เลือกบริการที่เหมาะกับพื้นที่และความต้องการของคุณ เราพร้อมให้คำแนะนำและดูแลตั้งแต่การเลือกวัสดุจนถึงการติดตั้ง")}
          />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-brand-500 px-6 py-3 text-sm font-semibold text-brand-700 transition-[background-color,transform] duration-150 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
            >
              {t("home_services_button", "ดูบริการทั้งหมด")}
            </Link>
          </div>
        </Container>
      </section>

      {business.video_url && (
        // scroll-mt keeps the heading clear of the sticky header when the
        // hero link jumps down here.
        <section id="video" className="scroll-mt-20 bg-cream-deep py-16 sm:py-20">
          <Container>
            <SectionHeading
              align="center"
              eyebrow={t("home_video_eyebrow", "วิดีโอ")}
              title={business.video_title || "ชมผลงานของเรา"}
              description={t("home_video_desc", "ดูบรรยากาศงานติดตั้งจริงของเรา ตั้งแต่วัดหน้างานจนติดตั้งเสร็จ")}
            />
            <div className="mx-auto mt-10 max-w-4xl">
              <VideoEmbed
                url={business.video_url}
                title={business.video_title || "วิดีโอผลงาน"}
              />
            </div>
          </Container>
        </section>
      )}

      <section className="bg-cream-deep py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow={t("home_projects_eyebrow", "ผลงานของเรา")}
            title={t("home_projects_title", "ผลงานที่ลูกค้าไว้วางใจ")}
            description={t("home_projects_desc", "ตัวอย่างงานติดตั้งจริง ที่เราภูมิใจนำเสนอ")}
          />
          <div className="mt-10">
            <ProjectCarousel
              projects={projects}
              title={t("home_projects_title", "ผลงานที่ลูกค้าไว้วางใจ")}
              headingLevel="none"
            />
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/portfolio"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-brand-500 px-6 py-3 text-sm font-semibold text-brand-700 transition-[background-color,transform] duration-150 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
            >
              {t("home_projects_button", "ดูผลงานทั้งหมด")}
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow={t("home_whyus_eyebrow", "ทำไมต้องเลือกเรา")}
              title={t("home_whyus_title", "ใส่ใจตั้งแต่เลือกผ้า จนติดตั้งเสร็จ")}
              description={t("home_whyus_desc", "เราดูแลทุกขั้นตอนด้วยทีมงานของเราเอง ตั้งแต่ให้คำปรึกษา วัดหน้างาน ตัดเย็บ จนถึงติดตั้ง")}
            />
            <ul className="mt-6 space-y-3">
              {whyUs.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-700 text-xs text-white">
                    ✓
                  </span>
                  <span className="text-ink-soft">{item.text}</span>
                </li>
              ))}
            </ul>
            <CtaGroup business={business} className="mt-8" />
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand-700">
              {t("home_reviews_label", "รีวิวจริงจากลูกค้าทาง LINE")}
            </p>
            <ReviewMarquee images={reviewImages.map((r) => r.image_url)} />
          </div>
        </Container>
      </section>

      {/* This is the page's closing ask, and the only one. It used to be
          followed immediately by a second identical block, so the end of the
          page was the same two buttons twice over plus the footer's pair. The
          curtain moment is the strongest place to ask, so the duplicate went
          and this one carries the invitation. */}
      <CurtainReveal
        business={business}
        title={t("curtain_reveal_title", "เปิดม่าน เปิดมุมมองใหม่ให้บ้านคุณ")}
        description={t(
          "curtain_reveal_desc",
          "ให้คำปรึกษาฟรี พร้อมนัดวัดพื้นที่หน้างาน ทักมาคุยกันก่อนได้เลย ไม่มีค่าใช้จ่าย",
        )}
      />
    </>
  );
}
