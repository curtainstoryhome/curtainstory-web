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

// หน้านี้มีไว้รับคำค้นเรื่องคอนโดโดยเฉพาะ
//
// รายงานคำค้นของ Google Ads เดือนสิงหาคม 2569 บอกว่าคนพิมพ์
// "ผ้าม่านคอนโด" "ม่านกันแดดระเบียงคอนโด" "ผ้าม่านระเบียงคอนโด" เข้ามารวมกัน
// เกินร้อยคลิก และคีย์เวิร์ด "ผ้าม่านคอนโด" ปิดการขายได้ถูกที่สุดในบัญชี
// ที่ 34 บาทต่อหนึ่งคนที่ติดต่อเข้ามา
//
// แต่ Google ตีตราคีย์เวิร์ดนั้นว่าคะแนนคุณภาพต่ำและกดไม่ให้แสดงเต็มที่
// เพราะคนค้นเรื่องคอนโดแล้วถูกส่งมาหน้าแรกที่ไม่พูดถึงคอนโดสักคำ
// หน้านี้คือปลายทางที่ตรงกับสิ่งที่เขาพิมพ์มา
const TITLE = "ผ้าม่านคอนโด ม่านกันแดดระเบียง";
const DESCRIPTION =
  "รับตัดผ้าม่านคอนโด ม่านกันแดดระเบียง ม่านกันแสงกันเสียง วัดหน้างานฟรีถึงห้อง ไม่เจาะผนังก็ติดตั้งได้ งานเสร็จใน 7-10 วัน ส่งรูปห้องมาประเมินราคาก่อนได้";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/curtains-condo" },
    openGraph: og(
      { title: TITLE, description: DESCRIPTION, url: "/curtains-condo" },
      fullBusinessName(business),
    ),
    twitter: tw({ title: TITLE, description: DESCRIPTION }),
  };
}

// คำถามที่ลูกค้าคอนโดถามซ้ำที่สุด ตอบไว้บนหน้าเลยเพื่อไม่ให้ต้องปิดหน้าไปหาที่อื่น
const FAQ = [
  {
    q: "คอนโดไม่ให้เจาะผนัง ติดผ้าม่านได้ไหม",
    a: "ได้ค่ะ ใช้รางแบบยึดกับฝ้าหรือขอบวงกบแทนการเจาะผนัง หลายโครงการห้ามเจาะผนังปูน เราเจอบ่อยและมีวิธีติดตั้งที่ไม่ผิดกฎนิติบุคคล ตอนวัดหน้างานเราดูให้ว่าห้องของคุณติดแบบไหนได้",
  },
  {
    q: "ระเบียงคอนโดแดดแรงมาก ใช้ผ้าแบบไหนดี",
    a: "ถ้าแดดเข้าตรงและร้อนสะสม แนะนำผ้าทึบแสงหรือม่านม้วนกันความร้อน จะช่วยลดอุณหภูมิห้องและถนอมเฟอร์นิเจอร์ไม่ให้สีซีด ถ้าอยากได้แสงธรรมชาติแต่ไม่อยากร้อน ใช้ม่านสองชั้นโปร่งคู่ทึบได้",
  },
  {
    q: "ห้องติดถนน เสียงดัง ผ้าม่านช่วยได้จริงไหม",
    a: "ช่วยได้ในระดับหนึ่ง ผ้าม่านหนาทึบช่วยดูดซับเสียงสะท้อนและลดเสียงรบกวนจากภายนอกได้พอสมควร แต่ไม่ได้กันเสียงเหมือนกระจกสองชั้น เราจะบอกตามจริงว่าห้องแบบไหนคุ้มที่จะลงทุน",
  },
  {
    q: "ห้องเช่า ย้ายออกแล้วเอาไปใช้ต่อได้ไหม",
    a: "ได้ค่ะ ถ้าแจ้งตั้งแต่แรกว่าเป็นห้องเช่า เราจะเลือกระบบรางที่ถอดออกได้โดยไม่ทิ้งรอย และตัดขนาดผ้าเผื่อให้ปรับใช้กับห้องใหม่ได้",
  },
  {
    q: "วัดหน้างานคิดเงินไหม อยู่คอนโดต้องลงทะเบียนเข้าอาคาร",
    a: "วัดหน้างานและประเมินราคาฟรี ไม่มีค่าใช้จ่ายและไม่มีมัดจำ ช่างของเราเข้าคอนโดเป็นประจำ นัดเวลาแล้วแจ้งชื่อช่างให้นิติบุคคลล่วงหน้าได้",
  },
];

export default async function CurtainsCondoPage() {
  const [business, projects] = await Promise.all([
    getBusinessInfo(),
    getPublishedProjects(),
  ]);

  // เอาผลงานคอนโดขึ้นก่อน คนที่อยู่คอนโดอยากเห็นห้องที่หน้าตาเหมือนห้องตัวเอง
  // ไม่ใช่บ้านเดี่ยวสองชั้น ถ้ายังไม่มีงานคอนโดในระบบก็ใช้ผลงานล่าสุดแทน
  const condoProjects = projects.filter((project) =>
    /คอนโด|condo/i.test(`${project.title} ${project.description}`),
  );
  // ต้องมีรูปปกถึงจะโชว์ได้ การ์ดที่ไม่มีรูปดูเหมือนหน้าพัง
  const shown = (condoProjects.length ? condoProjects : projects)
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
          { name: "ผ้าม่านคอนโด", path: "/curtains-condo" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHero
        eyebrow="ผ้าม่านคอนโด"
        title="ผ้าม่านคอนโด ม่านกันแดดระเบียง"
        description="วัดหน้างานฟรีถึงห้อง ไม่เจาะผนังก็ติดตั้งได้ ส่งรูปห้องมาประเมินราคาก่อนได้"
      >
        {/* คีย์เวิร์ดคอนโดทั้งหมดชี้มาหน้านี้แล้ว บนมือถือจอแรกเคยมีแต่ข้อความ
            "ส่งรูปห้องมาประเมินราคาก่อนได้" โดยไม่มีอะไรให้กด ปุ่มติดต่ออยู่แค่
            ที่มุมล่างและท้ายหน้า คนที่จ่ายเงินค่าคลิกพามาถึงแล้วต้องกดได้ทันที */}
        <CtaGroup business={business} className="mt-6" />
      </PageHero>

      <section className="py-14 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
              ห้องคอนโดมีข้อจำกัดที่บ้านเดี่ยวไม่มี
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                นิติบุคคลหลายที่ห้ามเจาะผนัง ระเบียงรับแดดตรงจนห้องร้อนทั้งบ่าย
                ผนังกระจกสูงจากพื้นจรดฝ้าที่ผ้าม่านสำเร็จรูปยาวไม่พอ
                และพื้นที่แคบจนรางผิดขนาดไปไม่กี่เซนติเมตรก็ปิดไม่สนิท
              </p>
              <p>
                เราตัดผ้าม่านให้ห้องคอนโดในกรุงเทพเป็นงานประจำ
                วัดหน้างานจริงทุกครั้งก่อนตัด ไม่ใช้ขนาดมาตรฐาน
                และเลือกระบบรางตามกฎของอาคารแต่ละแห่ง
              </p>
              <p>
                ช่างที่มาวัดกับช่างที่มาติดตั้งคือทีมเดียวกันของร้าน
                ไม่ได้จ้างช่างนอกมาทำต่อ ถ้ามีอะไรต้องแก้ เรารับผิดชอบเอง
              </p>
            </div>
            <CtaGroup business={business} className="mt-8" />
            <p className="mt-4 text-sm text-ink-soft">
              ส่งรูปห้องหรือระเบียงมาทางไลน์ก่อนก็ได้ ดูให้ว่าติดแบบไหนได้บ้าง
              แล้วแจ้งราคากลับให้ภายในวันเดียวกัน
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-brand-100 shadow-sm">
            <Image
              src="/images/product-curtains-elegant.jpg"
              alt="ผ้าม่านติดตั้งในห้องคอนโดพร้อมประตูกระจกออกระเบียง"
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
            แบบที่คนอยู่คอนโดเลือกบ่อยที่สุด
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "ม่านกันแดดระเบียง",
                body: "ผ้าทึบแสงหรือม่านม้วนกันความร้อน สำหรับห้องที่แดดเข้าตรงและร้อนสะสมทั้งบ่าย ลดอุณหภูมิห้องและกันสีเฟอร์นิเจอร์ซีด",
              },
              {
                title: "ม่านกันแสงกันเสียง",
                body: "ผ้าหนาสองชั้น สำหรับห้องนอนที่ติดถนนหรือรถไฟฟ้า ช่วยให้ห้องมืดสนิทตอนกลางวันและลดเสียงรบกวนจากภายนอก",
              },
              {
                title: "ม่านสองชั้น โปร่งคู่ทึบ",
                body: "กลางวันรูดผ้าโปร่งรับแสงธรรมชาติโดยไม่ต้องเปิดไฟ กลางคืนรูดผ้าทึบเพื่อความเป็นส่วนตัว เหมาะกับห้องที่มองเห็นจากตึกฝั่งตรงข้าม",
              },
              {
                title: "ม่านม้วน",
                body: "เก็บตัวเรียบ ไม่กินพื้นที่ เหมาะกับห้องเล็กหรือหน้าต่างในครัวและห้องน้ำที่ผ้าม่านจีบจะดูอึดอัดเกินไป",
              },
              {
                title: "มู่ลี่",
                body: "ปรับองศาแสงได้ตามช่วงเวลา ทำความสะอาดง่าย ไม่อมฝุ่นเท่าผ้า เหมาะกับคนแพ้ฝุ่นหรือห้องทำงานที่ต้องคุมแสงเข้าจอ",
              },
              {
                title: "รางไม่เจาะผนัง",
                body: "ยึดกับฝ้าหรือขอบวงกบแทนการเจาะผนังปูน สำหรับโครงการที่นิติบุคคลห้ามเจาะ และห้องเช่าที่ต้องคืนสภาพเดิมตอนย้ายออก",
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
            คำถามที่ลูกค้าคอนโดถามบ่อย
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
            ส่งรูปห้องมาก่อนก็ได้
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            ไม่ต้องรู้ว่าอยากได้แบบไหน ไม่ต้องวัดขนาดมาเอง
            ถ่ายรูปหน้าต่างหรือระเบียงส่งมาทางไลน์
            เราดูให้ว่าห้องแบบนี้ติดอะไรได้บ้างและราคาประมาณเท่าไหร่
          </p>
          <div className="mt-8 flex justify-center">
            <CtaGroup business={business} />
          </div>
        </Container>
      </section>
    </>
  );
}
