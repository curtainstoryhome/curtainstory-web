import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { getBusinessInfo } from "@/lib/data";
import { fullBusinessName } from "@/lib/business-name";
import { og, tw } from "@/lib/og";

const TITLE = "ข้อกำหนดการใช้บริการ";
const DESCRIPTION =
  "ข้อกำหนดการใช้บริการของ CURTAIN STORY HOME — ขอบเขตการให้บริการ การประเมินราคา และเงื่อนไขการใช้เว็บไซต์";

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessInfo();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/terms" },
    openGraph: og(
      { title: TITLE, description: DESCRIPTION, url: "/terms" },
      fullBusinessName(business),
    ),
    twitter: tw({ title: TITLE, description: DESCRIPTION }),
  };
}

// Static legal copy on purpose — same reasoning as the privacy page.
export default async function TermsPage() {
  const business = await getBusinessInfo();

  return (
    <>
      <PageHero eyebrow="นโยบาย" title="ข้อกำหนดการใช้บริการ" />

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl space-y-8 leading-relaxed text-ink-soft">
          <p>
            เว็บไซต์นี้ดำเนินการโดย {business.name} ("ร้าน")
            การใช้เว็บไซต์และการติดต่อขอรับบริการถือว่าท่านรับทราบข้อกำหนดต่อไปนี้
          </p>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              ขอบเขตการให้บริการ
            </h2>
            <p className="mt-3">
              ร้านให้บริการออกแบบ ตัดเย็บ และติดตั้งผ้าม่าน วอลล์เปเปอร์ มู่ลี่
              มุ้งลวด เหล็กดัด ฟิล์มกรองแสง และบริการทำความสะอาดผ้าม่าน
              ในเขตกรุงเทพมหานครและปริมณฑล
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              การประเมินราคา
            </h2>
            <p className="mt-3">
              ราคาที่แจ้งผ่านแชทหรือโทรศัพท์ก่อนการวัดหน้างานเป็น
              <strong>ราคาประเมินเบื้องต้น</strong> ราคาจริงจะยืนยันหลังการวัด
              พื้นที่หน้างานและเลือกวัสดุแล้วเท่านั้น
              การวัดหน้างานและประเมินราคาไม่มีค่าใช้จ่าย
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              เนื้อหาและรูปภาพบนเว็บไซต์
            </h2>
            <p className="mt-3">
              รูปผลงาน ข้อความ และเนื้อหาทั้งหมดบนเว็บไซต์เป็นลิขสิทธิ์ของร้าน
              ห้ามนำไปใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาต
              สีของสินค้าจริงอาจแตกต่างจากภาพบนหน้าจอตามการแสดงผลของอุปกรณ์
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              ลิงก์ไปบริการภายนอก
            </h2>
            <p className="mt-3">
              เว็บไซต์มีลิงก์ไปยังบริการภายนอก เช่น LINE, Facebook, YouTube และ
              Google Maps ซึ่งอยู่ภายใต้ข้อกำหนดของผู้ให้บริการนั้น ๆ
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              กฎหมายที่ใช้บังคับ
            </h2>
            <p className="mt-3">ข้อกำหนดนี้อยู่ภายใต้กฎหมายแห่งราชอาณาจักรไทย</p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              ติดต่อเรา
            </h2>
            <p className="mt-3">
              {business.name} · โทร {business.phone} · ที่อยู่ {business.address}
            </p>
          </div>

          <p className="text-sm">ปรับปรุงล่าสุด: สิงหาคม 2026</p>
        </Container>
      </section>
    </>
  );
}
