import { getBusinessInfo } from "@/lib/data";
import SettingsForm from "@/components/admin/SettingsForm";
import PasswordForm from "@/components/admin/PasswordForm";

export default async function AdminSettingsPage() {
  const business = await getBusinessInfo();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-ink">
          ข้อมูลร้าน
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          ข้อมูลนี้แสดงในทุกหน้าของเว็บไซต์ (เบอร์โทร, LINE, ที่อยู่ ฯลฯ)
        </p>
        <div className="mt-6">
          <SettingsForm business={business} />
        </div>
      </div>

      <div className="border-t border-brand-100 pt-10">
        <h2 className="font-heading text-xl font-semibold text-ink">
          เปลี่ยนรหัสผ่าน
        </h2>
        <p className="mt-1 max-w-lg text-sm text-ink-soft">
          แนะนำให้เปลี่ยนรหัสผ่านเป็นของคุณเองทันทีหลังเข้าใช้งานครั้งแรก
          เพื่อความปลอดภัยของเว็บไซต์
        </p>
        <div className="mt-6">
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
