import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { CtaGroup } from "@/components/CtaButtons";
import { fullBusinessName } from "@/lib/business-name";
import { og, tw } from "@/lib/og";
import { getBusinessInfo, getPublishedProjects } from "@/lib/data";

// หน้านี้มีไว้รับคนที่ค้นหาม่านม้วนโดยเฉพาะ
//
// แคมเปญม่านม้วนใน Google Ads ใช้เงินไป 1,122 บาทใน 30 วันเพื่อ 38 คลิก
// เฉลี่ยคลิกละ 29.54 บาท ขณะที่แคมเปญแผนที่ร้านได้คลิกละ 1.03 บาท
// และแคมเปญค้นหาหลักได้คลิกละ 7.69 บาท
//
// สาเหตุอยู่ที่คะแนนคุณภาพของคีย์เวิร์ดม่านม้วนทั้งสองคำ ซึ่ง Google ให้ 3 เต็ม 10
// และตีตราประสบการณ์หน้า Landing Page ว่าต่ำกว่าค่าเฉลี่ย เพราะคนค้นคำว่าม่านม้วน
// แล้วถูกส่งไปหน้าที่ไม่ได้พูดถึงม่านม้วนเป็นเรื่องหลัก คะแนนต่ำแปลว่าจ่ายแพงกว่า
// คู่แข่งเพื่อตำแหน่งเดียวกัน
//
// หน้านี้คือปลายทางที่ตรงกับสิ่งที่เขาพิมพ์มา และเป็นหน้าที่คนค้นหาเองโดยไม่ผ่าน
// โฆษณาก็เจอได้ด้วย
const TITLE = "ม่านม้วน กันแสง กันความร้อน";
const DESCRIPTION =
  "รับตัดม่านม้วนตามขนาดจริง ทั้งแบบทึบแสง กรองแสง และกันความร้อน วัดหน้างานฟรีทั่วกรุงเทพและนนทบุรี คอนโดไม่เจาะผนังก็ติดตั้งได้ งานเสร็จใน 7-10 วัน";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/roller-blinds" },
    openGraph: og(
      { title: TITLE, description: DESCRIPTION, url: "/roller-blinds" },
      fullBusinessName(business),
    ),
    twitter: tw({ title: TITLE, description: DESCRIPTION }),
  };
}

// คำถามที่คนถามก่อนตัดสินใจเรื่องม่านม้วน ตอบไว้บนหน้าเลย
// คนที่ต้องปิดหน้าไปหาคำตอบที่อื่นมักไม่กลับมา
const FAQ = [
  {
    q: "ม่านม้วนต่างจากผ้าม่านจีบยังไง เลือกแบบไหนดี",
    a: "ม่านม้วนเก็บตัวเป็นแท่งเดียวด้านบน ไม่กินพื้นที่ข้างหน้าต่าง เหมาะกับห้องเล็ก ห้องครัว ห้องน้ำ ห้องทำงาน และหน้าต่างที่มีเฟอร์นิเจอร์ชิดผนัง ส่วนผ้าม่านจีบให้ความรู้สึกอบอุ่นและกันแสงตรงขอบได้ดีกว่า เหมาะกับห้องนอนและห้องรับแขก หลายบ้านใช้ทั้งสองแบบคนละห้อง",
  },
  {
    q: "ม่านม้วนกันแดดกันร้อนได้จริงไหม",
    a: "ได้ค่ะ แต่ขึ้นกับชนิดผ้า ผ้าทึบแสงกันแสงได้เกือบหมดและลดความร้อนสะสมได้ชัดเจน ผ้ากรองแสงยอมให้แสงผ่านบางส่วนแต่ยังเห็นวิวข้างนอกและลดแสงจ้าได้ ถ้าห้องหันทิศตะวันตกและร้อนทั้งบ่าย เราจะแนะนำผ้าทึบหรือผ้าเคลือบกันความร้อน",
  },
  {
    q: "ห้องน้ำกับห้องครัวใช้ม่านม้วนได้ไหม",
    a: "ได้และเหมาะกว่าผ้าม่านทั่วไป เพราะเลือกผ้าพีวีซีหรือผ้าเคลือบที่เช็ดทำความสะอาดได้ ไม่อมความชื้นและไม่อมกลิ่นอาหารเหมือนผ้าหนา",
  },
  {
    q: "คอนโดห้ามเจาะผนัง ติดม่านม้วนได้ไหม",
    a: "ได้ค่ะ ยึดกับฝ้าหรือขอบวงกบแทนการเจาะผนังปูน เราติดตั้งในคอนโดที่นิติบุคคลห้ามเจาะเป็นงานประจำ ตอนวัดหน้างานเราดูให้ว่าห้องของคุณติดแบบไหนได้โดยไม่ผิดกฎอาคาร",
  },
  {
    q: "ทำความสะอาดยังไง ต้องถอดซักไหม",
    a: "ไม่ต้องถอดซัก ปกติใช้ผ้าหมาดเช็ดตามแนวผ้าหรือใช้เครื่องดูดฝุ่นหัวแปรงก็พอ ม่านม้วนอมฝุ่นน้อยกว่าผ้าม่านจีบมาก จึงเป็นตัวเลือกที่ดีสำหรับคนแพ้ฝุ่น",
  },
  {
    q: "ราคาเท่าไหร่ ต้องวัดขนาดมาเองไหม",
    a: "ราคาขึ้นกับขนาดหน้าต่างและชนิดผ้า ส่งรูปหน้าต่างมาทางไลน์ก่อนได้ เราประเมินให้คร่าวๆ ภายในวันเดียวกัน ถ้าจะสั่งจริงเราเข้าไปวัดหน้างานให้ฟรี ไม่มีค่าใช้จ่ายและไม่มีมัดจำ",
  },
];

export default async function RollerBlindsPage() {
  const [business, projects] = await Promise.all([
    getBusinessInfo(),
    getPublishedProjects(),
  ]);

  // งานม่านม้วนขึ้นก่อน ถ้ายังไม่มีในระบบก็ใช้ผลงานล่าสุดแทน
  // การ์ดที่ไม่มีรูปดูเหมือนหน้าพัง จึงคัดเฉพาะงานที่มีรูปปก
  const rollerProjects = projects.filter((project) =>
    /ม่านม้วน|roller/i.test(`${project.title} ${project.description}`),
  );
  const shown = (rollerProjects.length ? rollerProjects : projects)
    .filter((project) => project.images.length > 0)
    .slice(0, 3);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "หน้าแรก", path: "/" },
          { name: "ม่านม้วน", path: "/roller-blinds" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHero
        eyebrow="ม่านม้วน"
        title="ม่านม้วน กันแสง กันความร้อน"
        description="ตัดตามขนาดจริงทุกบาน วัดหน้างานฟรี ส่งรูปหน้าต่างมาประเมินราคาก่อนได้"
      >
        {/* คนที่มาจากโฆษณาม่านม้วนจ่ายค่าคลิกแพงที่สุดในบัญชี
            จอแรกต้องมีปุ่มให้กดทันที ไม่ใช่ให้เลื่อนหาปุ่มลอยที่มุมล่าง */}
        <CtaGroup business={business} className="mt-6" />
      </PageHero>

      <section className="py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
              ม่านม้วนเหมาะกับห้องแบบไหน
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                ห้องที่พื้นที่ข้างหน้าต่างมีจำกัด มีเตียงหรือโซฟาชิดผนัง
                หรือหน้าต่างอยู่หลังอ่างล้างจาน ผ้าม่านจีบจะกินพื้นที่และเกะกะ
                ม่านม้วนเก็บตัวเป็นแท่งเดียวด้านบนจึงไม่เบียดของในห้อง
              </p>
              <p>
                เราตัดตามขนาดจริงของหน้าต่างแต่ละบาน ไม่ใช้ขนาดสำเร็จรูป
                เพราะม่านม้วนที่กว้างหรือแคบไปไม่กี่เซนติเมตร
                จะเหลือช่องแสงลอดตรงขอบและปิดไม่สนิท
              </p>
              <p>
                ช่างที่มาวัดกับช่างที่มาติดตั้งคือทีมเดียวกันของร้าน
                ไม่ได้จ้างช่างนอกมาทำต่อ ถ้ามีอะไรต้องแก้ เรารับผิดชอบเอง
              </p>
            </div>
            <CtaGroup business={business} className="mt-8" />
            <p className="mt-4 text-sm text-ink-soft">
              ส่งรูปหน้าต่างมาทางไลน์ก่อนก็ได้ บอกให้ว่าควรใช้ผ้าแบบไหน
              แล้วแจ้งราคากลับให้ภายในวันเดียวกัน
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-brand-100 shadow-sm">
            <Image
              src="/images/product-curtains-elegant.jpg"
              alt="ม่านม้วนติดตั้งที่หน้าต่างห้องนั่งเล่น"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              quality={90}
            />
          </div>
        </Container>
      </section>

      <section className="bg-cream-deep py-14 sm:py-16">
        <Container>
          <h2 className="text-center font-heading text-2xl font-semibold text-ink sm:text-3xl">
            ชนิดผ้าที่เลือกได้
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "ม่านม้วนทึบแสง",
                body: "กันแสงได้เกือบหมดและลดความร้อนสะสม เหมาะกับห้องนอน ห้องที่หันทิศตะวันตก และห้องดูหนังที่ต้องการความมืดตอนกลางวัน",
              },
              {
                title: "ม่านม้วนกรองแสง",
                body: "ยอมให้แสงผ่านบางส่วน ลดแสงจ้าและความร้อนแต่ยังเห็นวิวข้างนอกได้ เหมาะกับห้องนั่งเล่นและห้องทำงานที่ไม่อยากเปิดไฟกลางวัน",
              },
              {
                title: "ม่านม้วนกันความร้อน",
                body: "ผ้าเคลือบสะท้อนความร้อน สำหรับห้องที่แดดเข้าตรงทั้งบ่ายจนแอร์ทำงานหนัก ช่วยลดอุณหภูมิห้องและถนอมสีเฟอร์นิเจอร์",
              },
              {
                title: "ม่านม้วนสองชั้น",
                body: "สลับแถบโปร่งกับแถบทึบ ปรับระดับแสงได้ละเอียดโดยไม่ต้องม้วนเก็บทั้งผืน ให้หน้าตาเรียบร้อยกว่ามู่ลี่",
              },
              {
                title: "ผ้าเช็ดทำความสะอาดได้",
                body: "ผ้าพีวีซีหรือผ้าเคลือบสำหรับห้องครัวและห้องน้ำ ไม่อมความชื้นและกลิ่น เช็ดคราบได้โดยไม่ต้องถอดซัก",
              },
              {
                title: "ระบบไม่เจาะผนัง",
                body: "ยึดกับฝ้าหรือขอบวงกบแทนการเจาะผนังปูน สำหรับคอนโดที่นิติบุคคลห้ามเจาะ และห้องเช่าที่ต้องคืนสภาพเดิมตอนย้ายออก",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm"
              >
                <h3 className="font-heading text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {shown.length > 0 && (
        <section className="py-14 sm:py-16">
          <Container>
            <h2 className="text-center font-heading text-2xl font-semibold text-ink sm:text-3xl">
              ผลงานจริงที่เราติดตั้งมา
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((project) => (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="group overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.images[0].image_url}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-base font-semibold text-ink">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/portfolio"
                className="font-medium text-brand-700 underline underline-offset-4"
              >
                ดูผลงานทั้งหมด
              </Link>
            </div>
          </Container>
        </section>
      )}

      <section className="bg-cream-deep py-14 sm:py-16">
        <Container className="max-w-3xl">
          <h2 className="text-center font-heading text-2xl font-semibold text-ink sm:text-3xl">
            คำถามที่ถามบ่อยเรื่องม่านม้วน
          </h2>
          <dl className="mt-10 space-y-6">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm"
              >
                <dt className="font-heading text-lg font-semibold text-ink">
                  {item.q}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            ส่งรูปหน้าต่างมาก่อนก็ได้
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            ไม่ต้องรู้ว่าอยากได้ผ้าแบบไหน ไม่ต้องวัดขนาดมาเอง
            ถ่ายรูปหน้าต่างส่งมาทางไลน์
            เราดูให้ว่าห้องแบบนี้ควรใช้ผ้าอะไรและราคาประมาณเท่าไหร่
          </p>
          <div className="mt-8 flex justify-center">
            <CtaGroup business={business} />
          </div>
        </Container>
      </section>
    </>
  );
}
