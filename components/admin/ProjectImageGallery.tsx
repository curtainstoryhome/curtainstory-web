"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/Toast";
import type { ProjectImageRow } from "@/lib/types";

// Mirrors the project_images_limit_check trigger in the database. The DB is
// the enforcer; this just keeps the UI honest so the user sees the limit
// before they hit an error.
const MAX_IMAGES = 10;

export default function ProjectImageGallery({
  images,
  onAdd,
  onDelete,
}: {
  images: ProjectImageRow[];
  onAdd: (imageUrl: string) => Promise<string>;
  onDelete: (imageId: string) => Promise<void>;
}) {
  const [, startTransition] = useTransition();
  const [localImages, setLocalImages] = useState(images);
  const { notifySuccess, notifyError } = useToast();

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {localImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-brand-100"
          >
            <Image
              src={image.image_url}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
            <ConfirmButton
              title="ลบรูปนี้?"
              message={`รูปที่ ${index + 1} จะถูกลบออกจากผลงานนี้และลบออกจากพื้นที่จัดเก็บถาวร`}
              onConfirm={async () => {
                const snapshot = localImages;
                setLocalImages((prev) =>
                  prev.filter((i) => i.id !== image.id),
                );
                try {
                  await onDelete(image.id);
                  notifySuccess("ลบรูปเรียบร้อยแล้ว");
                } catch (err) {
                  // Put the image back — the delete did not actually happen.
                  setLocalImages(snapshot);
                  notifyError(
                    err instanceof Error
                      ? `ลบรูปไม่สำเร็จ: ${err.message}`
                      : "ลบรูปไม่สำเร็จ กรุณาลองใหม่",
                  );
                }
                startTransition(() => {});
              }}
              className="absolute right-1.5 top-1.5 rounded-full bg-red-600/90 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
            >
              ลบ
            </ConfirmButton>
          </div>
        ))}
        {localImages.length === 0 && (
          <p className="col-span-full text-sm text-ink-soft">
            ยังไม่มีรูปภาพ
          </p>
        )}
      </div>

      <p className="mt-3 text-sm text-ink-soft">
        ใช้ไปแล้ว{" "}
        <span
          className={
            localImages.length >= MAX_IMAGES
              ? "font-semibold text-red-600"
              : "font-semibold text-ink"
          }
        >
          {localImages.length}
        </span>{" "}
        จาก {MAX_IMAGES} รูป
      </p>

      {localImages.length >= MAX_IMAGES ? (
        <p className="mt-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-ink-soft">
          ครบ {MAX_IMAGES} รูปแล้ว — หากต้องการเพิ่มรูปใหม่ กรุณาลบรูปเดิมออกก่อน
        </p>
      ) : (
      <div className="mt-4 max-w-sm">
        <ImageUploader
          pathPrefix="projects"
          label={`เพิ่มได้อีก ${MAX_IMAGES - localImages.length} รูป — ระบบจะบีบอัดให้อัตโนมัติ`}
          onUploaded={(url) => {
            const tempId = `temp-${Date.now()}`;
            setLocalImages((prev) => [
              ...prev,
              {
                id: tempId,
                project_id: "",
                image_url: url,
                sort_order: prev.length,
                created_at: new Date().toISOString(),
              },
            ]);
            startTransition(async () => {
              try {
                const realId = await onAdd(url);
                // Swap the placeholder id for the real one so an immediate
                // delete targets a valid row.
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
      )}
    </div>
  );
}
