import { getReviewImages, getWhyUsItems } from "@/lib/data";
import ReviewImagesManager from "@/components/admin/ReviewImagesManager";
import WhyUsManager from "@/components/admin/WhyUsManager";
import {
  addReviewImage,
  deleteReviewImage,
  addWhyUsItem,
  deleteWhyUsItem,
} from "./actions";

export default async function AdminReviewsPage() {
  const [reviewImages, whyUs] = await Promise.all([
    getReviewImages(),
    getWhyUsItems(),
  ]);

  async function addImage(url: string) {
    "use server";
    return addReviewImage(url);
  }
  async function deleteImage(id: string) {
    "use server";
    await deleteReviewImage(id);
  }
  async function addItem(formData: FormData) {
    "use server";
    return addWhyUsItem(formData);
  }
  async function deleteItem(id: string) {
    "use server";
    await deleteWhyUsItem(id);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-ink">
          รีวิว
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          ภาพแชทรีวิวจากลูกค้าจริง แสดงในหน้าแรกแบบเลื่อนอัตโนมัติ
        </p>
        <div className="mt-4 max-w-3xl">
          <ReviewImagesManager
            images={reviewImages}
            onAdd={addImage}
            onDelete={deleteImage}
          />
        </div>
      </div>

      <div>
        <h2 className="font-heading text-xl font-semibold text-ink">
          ทำไมต้องเลือกเรา
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          รายการจุดเด่น แสดงในหน้าแรกและหน้าเกี่ยวกับเรา
        </p>
        <div className="mt-4 max-w-md">
          <WhyUsManager items={whyUs} onAdd={addItem} onDelete={deleteItem} />
        </div>
      </div>
    </div>
  );
}
