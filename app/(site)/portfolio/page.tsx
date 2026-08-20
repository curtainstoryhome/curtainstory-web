import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import PortfolioFilter from "@/components/PortfolioFilter";
import { CtaGroup } from "@/components/CtaButtons";
import { getPublishedProjects, getBusinessInfo,
  getSiteText,
  getServices,
} from "@/lib/data";
import { fullBusinessName } from "@/lib/business-name";
import { og } from "@/lib/og";

const TITLE = "ผลงานของเรา";
const DESCRIPTION =
  "รวมผลงานติดตั้งผ้าม่าน วอลล์เปเปอร์ มู่ลี่ และฉากกั้นห้องจริงจากบ้าน คอนโด และอาคารสำนักงานในกรุงเทพฯ โดย CURTAIN STORY HOME ดูรูปจริงทุกงานก่อนตัดสินใจ";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/portfolio" },
    openGraph: og(
      { title: TITLE, description: DESCRIPTION, url: "/portfolio" },
      fullBusinessName(business),
    ),
  };
}

export default async function PortfolioPage() {
  const [projects, business, t, services] = await Promise.all([
    getPublishedProjects(),
    getBusinessInfo(),
    getSiteText(),
    getServices(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={t("portfolio_hero_eyebrow", "ผลงาน")}
        title={t("portfolio_hero_title", "ผลงานของเรา")}
        description={t("portfolio_hero_desc", "ตัวอย่างงานติดตั้งจริง ที่เราภูมิใจนำเสนอ ขอบคุณลูกค้าทุกท่านที่ไว้วางใจให้เราดูแล คลิกที่ผลงานเพื่อดูรูปเพิ่มเติม")}
        image={projects[0]?.images[0]?.image_url}
        imageAlt="ตัวอย่างผลงานติดตั้งผ้าม่านจริง โดย CURTAIN STORY HOME"
      />

      <section className="py-14 sm:py-16">
        <Container>
          <PortfolioFilter projects={projects} services={services} />
        </Container>
      </section>

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
