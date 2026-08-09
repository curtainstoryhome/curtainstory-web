import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { getBusinessInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว",
  description:
    "นโยบายความเป็นส่วนตัวของ CURTAIN STORY HOME — ข้อมูลอะไรที่เราเก็บ ใช้อย่างไร และสิทธิ์ของลูกค้าตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
  alternates: { canonical: "/privacy" },
};

// Static legal copy on purpose: this page is referenced from outside services
// (LINE OA, Facebook) and must stay readable even if someone edits shop text
// in the admin carelessly. Only the contact details come from the database.
export default async function PrivacyPage() {
  const business = await getBusinessInfo();

  return (
    <>
      <PageHero eyebrow="นโยบาย" title="นโยบายความเป็นส่วนตัว" />

      <section className="py-14 sm:py-16">
        <Container className="max-w-3xl space-y-8 leading-relaxed text-ink-soft">
          <p>
            {business.name} ("ร้าน") เคารพความเป็นส่วนตัวของลูกค้าและผู้เข้าชมเว็บไซต์
            เอกสารนี้อธิบายว่าเราเก็บข้อมูลอะไร ใช้อย่างไร
            ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
          </p>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              ข้อมูลที่เว็บไซต์นี้เก็บ
            </h2>
            <p className="mt-3">
              เว็บไซต์นี้เป็นเว็บให้ข้อมูลเท่านั้น <strong>ไม่มีแบบฟอร์มเก็บข้อมูล
              ไม่มีระบบสมาชิก และไม่ใช้คุกกี้ติดตามพฤติกรรมเพื่อการโฆษณา</strong>{" "}
              การเข้าชมเว็บไซต์จึงไม่มีการเก็บข้อมูลส่วนบุคคลของท่าน
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              ข้อมูลที่เกิดขึ้นเมื่อท่านติดต่อเรา
            </h2>
            <p className="mt-3">
              เมื่อท่านติดต่อร้านผ่าน LINE โทรศัพท์ หรือ Facebook
              ข้อมูลที่ท่านให้ไว้ (เช่น ชื่อ เบอร์โทร ที่อยู่หน้างาน
              และรูปภาพพื้นที่ที่ต้องการติดตั้ง) จะถูกใช้เพื่อ
              <strong>ประเมินราคา นัดหมายวัดหน้างาน และให้บริการเท่านั้น</strong>{" "}
              เราไม่ขายหรือส่งต่อข้อมูลของท่านให้บุคคลภายนอก
            </p>
            <p className="mt-3">
              การสนทนาผ่าน LINE และ Facebook อยู่ภายใต้นโยบายความเป็นส่วนตัวของ
              ผู้ให้บริการแพลตฟอร์มนั้นด้วย
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              รูปภาพผลงาน
            </h2>
            <p className="mt-3">
              รูปผลงานติดตั้งที่แสดงบนเว็บไซต์และช่องทางของร้าน
              จะถูกเผยแพร่<strong>เมื่อได้รับอนุญาตจากเจ้าของสถานที่แล้วเท่านั้น</strong>{" "}
              และเราหลีกเลี่ยงการเผยแพร่ภาพที่เห็นบุคคล ป้ายทะเบียนรถ
              หรือเลขที่บ้านชัดเจน
              หากท่านต้องการให้นำรูปที่เกี่ยวข้องกับท่านออก แจ้งเราได้ทุกเมื่อ
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-ink">
              สิทธิ์ของท่าน
            </h2>
            <p className="mt-3">
              ท่านมีสิทธิ์ขอดู แก้ไข หรือให้ลบข้อมูลส่วนบุคคลของท่านที่เราเก็บไว้
              รวมถึงถอนความยินยอมที่เคยให้ไว้ ติดต่อเราได้ตามช่องทางด้านล่าง
              เราจะดำเนินการโดยเร็วที่สุด
            </p>
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
