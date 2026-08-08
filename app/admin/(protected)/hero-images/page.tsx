import Link from "next/link";
import HeroImagesManager from "@/components/admin/HeroImagesManager";
import { getHeroImages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HeroImagesPage() {
  const images = await getHeroImages();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">
        รูปแบนเนอร์หน้าแรก
      </h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">
        รูปใหญ่ด้านบนสุดของหน้าแรก จะสลับเปลี่ยนไปเรื่อยๆ ทุก 5 วินาที
        รูปลำดับที่ 1 คือรูปที่ลูกค้าเห็นเป็นรูปแรก จึงควรเป็นรูปที่สวยที่สุด
      </p>
      <p className="mt-3 text-sm text-ink-soft">
        แก้เสร็จแล้ว{" "}
        <Link href="/" target="_blank" className="-mx-1 inline-flex min-h-9 items-center rounded-lg px-1 font-semibold text-brand-700 transition-colors hover:bg-brand-100/60 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
          เปิดหน้าแรกดูผลได้เลย
        </Link>
      </p>

      <div className="mt-6">
        <HeroImagesManager initialImages={images} />
      </div>
    </div>
  );
}
