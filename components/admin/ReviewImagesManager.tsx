"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import { useRouter } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/Toast";
import type { ReviewImageRow } from "@/lib/types";

export default function ReviewImagesManager({
  images,
  onAdd,
  onDelete,
}: {
  images: ReviewImageRow[];
  onAdd: (imageUrl: string) => Promise<string>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [, startTransition] = useTransition();
  const [localImages, setLocalImages] = useState(images);
  const router = useRouter();

  // Keeps the on-screen list honest with the database. Holding only a local
  // copy meant a change could succeed on the server while the screen still
  // showed the old list, which reads as "the button did nothing".
  const serverKey = images.map((i) => i.id).join(",");
  const lastServerKey = useRef(serverKey);
  useEffect(() => {
    if (lastServerKey.current !== serverKey) {
      lastServerKey.current = serverKey;
      setLocalImages(images);
    }
  }, [serverKey, images]);
  const { notifySuccess, notifyError } = useToast();

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {localImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-[9/16] overflow-hidden rounded-lg border border-brand-100"
          >
            <Image
              src={image.image_url}
              alt=""
              fill
              sizes="150px"
              className="object-cover"
            />
            <ConfirmButton
              title="ลบรูปรีวิวนี้?"
              message={`รูปรีวิวที่ ${index + 1} จะถูกลบออกจากหน้าแรกและลบออกจากพื้นที่จัดเก็บถาวร`}
              onConfirm={async () => {
                const snapshot = localImages;
                setLocalImages((prev) => prev.filter((i) => i.id !== image.id));
                try {
                  await onDelete(image.id);
                  notifySuccess("ลบรูปรีวิวเรียบร้อยแล้ว");
                  router.refresh();
                } catch (err) {
                  setLocalImages(snapshot);
                  notifyError(
                    err instanceof Error
                      ? `ลบไม่สำเร็จ: ${err.message}`
                      : "ลบไม่สำเร็จ กรุณาลองใหม่",
                  );
                }
                startTransition(() => {});
              }}
              // Always visible: a hover-only control simply does not exist on a
              // touch screen, which is where this will mostly be used.
              className="absolute right-1.5 top-1.5 !min-h-9 border-0 bg-red-600/90 px-3 text-xs font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline-white"
            >
              ลบ
            </ConfirmButton>
          </div>
        ))}
        {localImages.length === 0 && (
          <p className="col-span-full text-sm text-ink-soft">
            ยังไม่มีรูปรีวิว
          </p>
        )}
      </div>
      <div className="mt-4 max-w-sm">
        <ImageUploader
          pathPrefix="reviews"
          label="ภาพแนวตั้งจะแสดงผลได้ดีที่สุด — ระบบจะบีบอัดให้อัตโนมัติ"
          onUploaded={(url) => {
            const tempId = `temp-${Date.now()}`;
            setLocalImages((prev) => [
              ...prev,
              { id: tempId, image_url: url, sort_order: prev.length },
            ]);
            startTransition(async () => {
              try {
                const realId = await onAdd(url);
                setLocalImages((prev) =>
                  prev.map((i) => (i.id === tempId ? { ...i, id: realId } : i)),
                );
              } catch (err) {
                setLocalImages((prev) => prev.filter((i) => i.id !== tempId));
                notifyError(
                  err instanceof Error
                    ? `บันทึกรูปไม่สำเร็จ: ${err.message}`
                    : "บันทึกรูปไม่สำเร็จ",
                );
              }
            });
          }}
        />
      </div>
    </div>
  );
}
