import Link from "next/link";
import SiteSettingsGroupForm from "@/components/admin/SiteSettingsGroupForm";
import { getSiteSettings } from "@/lib/data";
import type { SiteSettingRow } from "@/lib/types";

export const dynamic = "force-dynamic";

// Groups appear in the order someone would walk the site, not alphabetically.
const GROUP_ORDER = ["home", "services", "portfolio", "about", "contact", "shared", "theme"];

export default async function ContentPage() {
  const settings = await getSiteSettings();

  const groups = new Map<string, SiteSettingRow[]>();
  for (const row of settings) {
    const list = groups.get(row.group_key) ?? [];
    list.push(row);
    groups.set(row.group_key, list);
  }

  const ordered = [...groups.entries()].sort(
    (a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]),
  );

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">
        ข้อความและสีในเว็บ
      </h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">
        แก้ข้อความทุกจุดที่ลูกค้าเห็นบนเว็บได้จากหน้านี้ แต่ละช่องเขียนบอกไว้แล้วว่าอยู่ตรงไหนของเว็บ
        แก้เสร็จให้กดปุ่ม <strong className="text-ink">บันทึก</strong> ของกล่องนั้น
      </p>
      <p className="mt-3 text-sm text-ink-soft">
        ถ้ายังไม่แน่ใจว่าช่องไหนคือตรงไหน ลอง{" "}
        <Link href="/" target="_blank" className="-mx-1 inline-flex min-h-9 items-center rounded-lg px-1 font-semibold text-brand-700 transition-colors hover:bg-brand-100/60 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          เปิดเว็บจริงดูคู่กัน
        </Link>{" "}
        หรืออ่าน{" "}
        <Link href="/admin/manual" className="-mx-1 inline-flex min-h-9 items-center rounded-lg px-1 font-semibold text-brand-700 transition-colors hover:bg-brand-100/60 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          คู่มือการใช้งาน
        </Link>
      </p>

      <div className="mt-6 space-y-6">
        {ordered.map(([groupKey, fields]) => (
          <SiteSettingsGroupForm
            key={groupKey}
            groupKey={groupKey}
            groupLabel={fields[0].group_label}
            fields={fields}
          />
        ))}
      </div>
    </div>
  );
}
