import Link from "next/link";
import {
  getServices,
  getProjects,
  getWhyUsItems,
  getReviewImages,
  getHeroImages,
  getSiteSettings,
} from "@/lib/data";

export default async function AdminDashboard() {
  const [services, projects, whyUs, reviews, heroImages, settings] =
    await Promise.all([
      getServices(),
      getProjects(),
      getWhyUsItems(),
      getReviewImages(),
      getHeroImages(),
      getSiteSettings(),
    ]);

  const cards = [
    {
      href: "/admin/services",
      label: "บริการ",
      count: services.length,
      desc: "แก้ไขรายการบริการ รูปภาพ และรายละเอียด",
    },
    {
      href: "/admin/projects",
      label: "ผลงาน",
      count: projects.length,
      desc: "เพิ่ม/แก้ไขผลงานและรูปภาพในแต่ละโปรเจกต์",
    },
    {
      href: "/admin/reviews",
      label: "รีวิว",
      count: reviews.length,
      desc: "จัดการรูปรีวิวและจุดเด่นของร้าน",
    },
    {
      href: "/admin/hero-images",
      label: "รูปแบนเนอร์",
      count: heroImages.length,
      desc: "รูปใหญ่ด้านบนหน้าแรก ที่สลับเปลี่ยนไปเรื่อยๆ",
    },
    {
      href: "/admin/content",
      label: "ข้อความและสี",
      count: settings.length,
      desc: "แก้ข้อความทุกจุดในเว็บ และเปลี่ยนสีของเว็บ",
    },
    {
      href: "/admin/settings",
      label: "ข้อมูลร้าน",
      count: whyUs.length,
      desc: "เบอร์โทร LINE ที่อยู่ และจุดเด่น",
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">
        แดชบอร์ด
      </h1>
      <p className="mt-1 text-ink-soft">จัดการเนื้อหาเว็บไซต์ของคุณ</p>

      <div className="mt-5 rounded-2xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm leading-relaxed text-ink-soft">
          ใช้งานครั้งแรก หรือไม่แน่ใจว่าต้องกดตรงไหน อ่าน{" "}
          <Link
            href="/admin/manual"
            className="-mx-1 inline-flex min-h-9 items-center rounded-lg px-1 font-semibold text-brand-700 transition-colors hover:bg-brand-100/60 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            คู่มือการใช้งาน
          </Link>{" "}
          ได้เลย มีอธิบายทีละขั้นตอน
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-brand-100 bg-white p-5 shadow-[0_2px_10px_-3px_rgba(109,83,39,0.16)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_14px_28px_-12px_rgba(109,83,39,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:translate-y-0 active:scale-[0.99]"
          >
            <p className="font-heading text-3xl font-semibold text-brand-600">
              {card.count}
            </p>
            <p className="mt-1 font-medium text-ink">{card.label}</p>
            <p className="mt-1 text-sm text-ink-soft">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
