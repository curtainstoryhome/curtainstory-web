import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "คู่มือการใช้งาน" };

// Written for someone who has never used an admin panel. Every instruction is
// a thing you can literally see on screen, in the order you would do it.
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white">
        {n}
      </span>
      <span className="pt-0.5 leading-relaxed text-ink-soft">{children}</span>
    </li>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

const B = ({
  children,
  className = "text-ink",
}: {
  children: React.ReactNode;
  className?: string;
}) => <strong className={`font-semibold ${className}`}>{children}</strong>;

export default async function ManualPage() {
  // Read the signed-in account rather than printing a fixed address. The
  // address used to be written into the source, and this repository is public
  // — that publishes half of the login pair to anyone who looks. It was also
  // liable to be wrong the moment the account changed. Shown from the session,
  // it is always the owner's real address and lives nowhere in the code.
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? "อีเมลที่ใช้เข้าสู่ระบบ";

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-2xl font-semibold text-ink">
        คู่มือการใช้งาน
      </h1>
      <p className="mt-2 leading-relaxed text-ink-soft">
        หน้านี้อธิบายวิธีแก้เว็บทุกอย่างด้วยตัวเอง อ่านตามทีละข้อได้เลย
        ไม่ต้องมีความรู้เรื่องคอมพิวเตอร์ ทุกอย่างที่แก้จะขึ้นเว็บจริงทันทีหลังกดบันทึก
      </p>

      <div className="mt-5 rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <p className="font-semibold text-ink">อ่านก่อนเริ่ม 3 ข้อ</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
          <li>
            • <B>แก้ผิดไม่พัง</B> ทุกช่องพิมพ์ทับได้เรื่อยๆ ถ้าพิมพ์ผิดก็แค่พิมพ์ใหม่แล้วกดบันทึกอีกครั้ง
          </li>
          <li>
            • <B>ต้องกดปุ่มบันทึกเสมอ</B> พิมพ์อย่างเดียวยังไม่ขึ้นเว็บ ต้องกดปุ่มสีน้ำตาลที่เขียนว่า
            &ldquo;บันทึก&rdquo; ก่อน
          </li>
          <li>
            • <B>การลบย้อนกลับไม่ได้</B> ระบบจะถามยืนยันทุกครั้ง ถ้าไม่แน่ใจให้กดยกเลิกไว้ก่อน
          </li>
        </ul>
      </div>

      <div className="mt-6 space-y-5">
        <Card
          title="เข้าระบบ / ออกจากระบบ"
          subtitle="ที่อยู่สำหรับเข้าหลังบ้าน"
        >
          <ol className="space-y-3">
            <Step n={1}>
              เปิดเว็บแล้วต่อท้ายที่อยู่ด้วยคำว่า <B>/admin</B> เช่น
              <span className="mx-1 rounded bg-cream-deep px-1.5 py-0.5 font-mono text-sm">
                เว็บของเรา/admin
              </span>
            </Step>
            <Step n={2}>
              ใส่อีเมล{" "}
              <span className="rounded bg-cream-deep px-1.5 py-0.5 font-mono text-sm">
                {email}
              </span>{" "}
              และรหัสผ่านที่ได้รับ แล้วกดเข้าสู่ระบบ
            </Step>
            <Step n={3}>
              เลิกใช้งานแล้วให้กด <B>ออกจากระบบ</B> ที่มุมขวาบนทุกครั้ง
              โดยเฉพาะถ้าใช้เครื่องที่ไม่ใช่ของตัวเอง
            </Step>
          </ol>
          <p className="mt-4 rounded-xl bg-cream-deep p-3 text-sm leading-relaxed text-ink-soft">
            อยากเปลี่ยนรหัสผ่าน ไปที่เมนู <B>ข้อมูลร้าน</B> เลื่อนลงล่างสุด จะมีช่องให้ตั้งรหัสใหม่
          </p>
        </Card>

        <Card
          title="เปลี่ยนรูปใหญ่หน้าแรก"
          subtitle="เมนู รูปแบนเนอร์"
        >
          <ol className="space-y-3">
            <Step n={1}>
              กดเมนู <B>รูปแบนเนอร์</B> ด้านบน
            </Step>
            <Step n={2}>
              กดปุ่มเลือกไฟล์ในกล่อง <B>เพิ่มรูปแบนเนอร์</B> แล้วเลือกรูปจากเครื่องหรือมือถือ
              รูปจะถูกย่อขนาดให้เองอัตโนมัติ ไม่ต้องย่อมาก่อน
            </Step>
            <Step n={3}>
              ใส่ได้สูงสุด <B>6 รูป</B> รูปจะสลับเปลี่ยนไปเรื่อยๆ ทุก 5 วินาที
            </Step>
            <Step n={4}>
              <B>รูปลำดับที่ 1 สำคัญที่สุด</B> เพราะเป็นรูปแรกที่ลูกค้าเห็น
              ใช้ปุ่มลูกศรขึ้น-ลงเลื่อนรูปที่สวยที่สุดมาไว้อันดับ 1
            </Step>
            <Step n={5}>
              กด <B>ลบ</B> ถ้าไม่อยากใช้รูปไหนแล้ว (ต้องเหลืออย่างน้อย 1 รูปเสมอ)
            </Step>
          </ol>
          <p className="mt-4 rounded-xl bg-cream-deep p-3 text-sm leading-relaxed text-ink-soft">
            <B>รูปแบบไหนสวย:</B> ถ่ายแนวนอน ห้องสว่าง เห็นผ้าม่านเต็มบาน เก็บของให้เรียบร้อยก่อนถ่าย
            และ<B>อย่าให้ติดหน้าคน ป้ายทะเบียนรถ หรือเลขที่บ้าน</B> ของลูกค้า
          </p>
        </Card>

        <Card
          title="แก้ข้อความทุกจุดในเว็บ"
          subtitle="เมนู ข้อความและสี"
        >
          <ol className="space-y-3">
            <Step n={1}>
              กดเมนู <B>ข้อความและสี</B> จะเห็นกล่องแยกตามหน้า เช่น หน้าแรก หน้าบริการ หน้าผลงาน
            </Step>
            <Step n={2}>
              ทุกช่องมีคำอธิบายกำกับว่าข้อความนั้น<B>อยู่ตรงไหนของเว็บ</B> อ่านแล้วแก้ได้เลย
            </Step>
            <Step n={3}>
              แก้เสร็จในกล่องไหน ให้กดปุ่ม <B>บันทึก</B> ของกล่องนั้น (แต่ละกล่องมีปุ่มของตัวเอง)
            </Step>
            <Step n={4}>
              อยากเห็นผล กด <B>ดูเว็บไซต์</B> มุมขวาบน จะเปิดหน้าใหม่ให้ดูของจริง
            </Step>
          </ol>
          <p className="mt-4 rounded-xl bg-cream-deep p-3 text-sm leading-relaxed text-ink-soft">
            ถ้าเผลอลบข้อความจนว่าง เว็บจะกลับไปใช้ข้อความเดิมให้เองอัตโนมัติ หน้าเว็บจะไม่โล่ง
          </p>
        </Card>

        <Card title="เปลี่ยนสีของเว็บ" subtitle="เมนู ข้อความและสี เลื่อนลงล่างสุด">
          <ol className="space-y-3">
            <Step n={1}>
              เลื่อนลงไปกล่อง <B>สีของเว็บไซต์</B> จะมี 4 สีให้ปรับ
            </Step>
            <Step n={2}>
              กดที่<B>ช่องสีเหลี่ยม</B>เพื่อเลือกสีจากจานสี หรือพิมพ์รหัสสีเองก็ได้
            </Step>
            <Step n={3}>
              ดูป้ายข้างๆ ถ้าขึ้นว่า <B className="text-brand-700">อ่านง่าย</B> คือใช้ได้
              ถ้าขึ้นสีแดงว่า <B>สีอ่อนไป อ่านยาก</B> แปลว่าลูกค้าจะอ่านตัวหนังสือไม่ออก ให้เลือกสีเข้มขึ้น
            </Step>
            <Step n={4}>กดบันทึก แล้วเปิดเว็บดูผล</Step>
          </ol>
          <p className="mt-4 rounded-xl bg-cream-deep p-3 text-sm leading-relaxed text-ink-soft">
            เปลี่ยนสีแล้วไม่ถูกใจ ให้ใส่ค่าเดิมกลับไป:
            สีหลัก <span className="font-mono">#6d5327</span> ·
            พื้นหลัง <span className="font-mono">#faf8f4</span> ·
            แถบสลับ <span className="font-mono">#eee8df</span> ·
            ตัวหนังสือ <span className="font-mono">#221d19</span>
          </p>
        </Card>

        <Card title="เพิ่มผลงานใหม่" subtitle="เมนู ผลงาน">
          <ol className="space-y-3">
            <Step n={1}>
              กดเมนู <B>ผลงาน</B> แล้วกดปุ่ม <B>เพิ่มผลงานใหม่</B>
            </Step>
            <Step n={2}>
              ใส่<B>ชื่องาน</B> (เช่น ชื่อหมู่บ้านหรือชื่อลูกค้า) และ<B>คำอธิบาย</B>
              ว่าเป็นม่านแบบไหน โทนสีอะไร ห้องไหนบ้าง
            </Step>
            <Step n={3}>
              กดบันทึก แล้วอัปโหลดรูปได้ <B>สูงสุด 10 รูปต่อ 1 งาน</B>
              ถ้าใส่เกินระบบจะเตือนและไม่ให้ใส่
            </Step>
            <Step n={4}>
              เลือก<B>บริการที่ใช้ในงานนี้</B> เช่น ผ้าม่าน หรือ วอลล์เปเปอร์
              งานจะไปโผล่ในหน้าบริการนั้นให้เองด้วย
            </Step>
            <Step n={5}>
              ถ้ามีคลิปวิดีโองานนี้ ให้ก๊อปลิงก์จาก YouTube มาวางในช่องลิงก์วิดีโอ
            </Step>
          </ol>
          <p className="mt-4 rounded-xl bg-cream-deep p-3 text-sm leading-relaxed text-ink-soft">
            <B>รูปแรกของแต่ละงานคือรูปหน้าปก</B> ที่ลูกค้าเห็นในหน้ารวมผลงาน เลือกรูปที่สวยที่สุดไว้อันแรก
          </p>
        </Card>

        <Card title="แก้เบอร์โทร LINE ที่อยู่ และวิดีโอ" subtitle="เมนู ข้อมูลร้าน">
          <ol className="space-y-3">
            <Step n={1}>
              กดเมนู <B>ข้อมูลร้าน</B> จะมีทั้งชื่อร้าน คำโปรย เบอร์โทร ลิงก์ LINE รูป QR
              เฟซบุ๊ก และที่อยู่
            </Step>
            <Step n={2}>
              ช่อง <B>ลิงก์วิดีโอ</B> ให้วางลิงก์จาก YouTube ระบบจะเตือนถ้าลิงก์ไม่ถูกต้อง
            </Step>
            <Step n={3}>แก้เสร็จกดบันทึกด้านล่าง</Step>
          </ol>
        </Card>

        <Card title="เพิ่มรูปรีวิวจากลูกค้า" subtitle="เมนู รีวิว">
          <ol className="space-y-3">
            <Step n={1}>
              แคปหน้าจอข้อความชมจากลูกค้าในไลน์เก็บไว้
            </Step>
            <Step n={2}>
              กดเมนู <B>รีวิว</B> แล้วอัปโหลดรูปที่แคปไว้ รูปจะเลื่อนขึ้นอัตโนมัติในหน้าแรก
            </Step>
            <Step n={3}>
              <B>สำคัญ:</B> ลบชื่อและรูปโปรไฟล์ลูกค้าออกก่อนแคป หรือเบลอทิ้ง
              เพราะเป็นข้อมูลส่วนตัวของเขา
            </Step>
          </ol>
        </Card>

        <Card title="ถ้ามีปัญหา" subtitle="อาการที่เจอบ่อยและวิธีแก้">
          <dl className="space-y-4 text-sm leading-relaxed">
            <div>
              <dt className="font-semibold text-ink">แก้แล้วเว็บยังไม่เปลี่ยน</dt>
              <dd className="mt-1 text-ink-soft">
                เช็กก่อนว่ากดปุ่ม <B>บันทึก</B> แล้วหรือยัง ถ้ากดแล้วให้กดปุ่มรีเฟรช (วงกลมลูกศร)
                ที่หน้าเว็บ หรือปิดแล้วเปิดหน้าใหม่อีกครั้ง
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">อัปโหลดรูปไม่ได้</dt>
              <dd className="mt-1 text-ink-soft">
                รองรับเฉพาะไฟล์ <B>JPG PNG WEBP</B> และไฟล์ต้องไม่เกิน 25MB
                ถ้าเป็นไฟล์จากกล้องมืออาชีพลองส่งเข้าไลน์ตัวเองก่อนแล้วเซฟจากไลน์มาใช้
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">ขึ้นเตือนว่าใส่รูปเกิน</dt>
              <dd className="mt-1 text-ink-soft">
                1 ผลงานใส่ได้ 10 รูป และแบนเนอร์หน้าแรกใส่ได้ 6 รูป
                ต้องลบรูปเก่าออกก่อนถึงจะเพิ่มใหม่ได้
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">ขึ้นเตือนว่าชื่อซ้ำ</dt>
              <dd className="mt-1 text-ink-soft">
                มีผลงานชื่อนี้อยู่แล้ว ให้เติมคำต่อท้ายให้ต่างกัน เช่น ใส่ชื่อโครงการหรือปีเพิ่ม
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">เข้าระบบไม่ได้</dt>
              <dd className="mt-1 text-ink-soft">
                ลองพิมพ์รหัสผ่านใหม่ช้าๆ ระวังปุ่ม Caps Lock ถ้ายังไม่ได้ให้ติดต่อผู้ดูแลเว็บ
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="ข้อควรระวัง" subtitle="เพื่อไม่ให้เกิดปัญหาภายหลัง">
          <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
            <li>
              • <B>อย่าบอกรหัสผ่านให้ใคร</B> และอย่าส่งรหัสผ่านทางไลน์หรือแชท
            </li>
            <li>
              • <B>อย่าลงรูปที่ติดข้อมูลส่วนตัวลูกค้า</B> เช่น หน้าคน ป้ายทะเบียนรถ เลขที่บ้าน
              หรือชื่อในแชท เพราะผิดกฎหมายข้อมูลส่วนบุคคล (PDPA)
            </li>
            <li>
              • <B>ขออนุญาตลูกค้าก่อนลงรูปบ้านเขา</B> ทุกครั้ง
            </li>
            <li>
              • ลบผลงานหรือรูปแล้ว <B>เอากลับคืนไม่ได้</B> ต้องอัปโหลดใหม่เท่านั้น
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-white p-5 text-sm text-ink-soft shadow-sm">
        เริ่มใช้งานได้เลยที่{" "}
        <Link href="/admin/hero-images" className="-mx-1 inline-flex min-h-9 items-center rounded-lg px-1 font-semibold text-brand-700 transition-colors hover:bg-brand-100/60 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          รูปแบนเนอร์
        </Link>
        {" · "}
        <Link href="/admin/content" className="-mx-1 inline-flex min-h-9 items-center rounded-lg px-1 font-semibold text-brand-700 transition-colors hover:bg-brand-100/60 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          ข้อความและสี
        </Link>
        {" · "}
        <Link href="/admin/projects" className="-mx-1 inline-flex min-h-9 items-center rounded-lg px-1 font-semibold text-brand-700 transition-colors hover:bg-brand-100/60 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          ผลงาน
        </Link>
      </div>
    </div>
  );
}
