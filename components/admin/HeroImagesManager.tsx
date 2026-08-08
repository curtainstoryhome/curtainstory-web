"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/Toast";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import {
  addHeroImage,
  updateHeroCaption,
  moveHeroImage,
  deleteHeroImage,
} from "@/app/admin/(protected)/hero-images/actions";
import type { HeroImageRow } from "@/lib/types";

const MAX_IMAGES = 6;

export default function HeroImagesManager({
  initialImages,
}: {
  initialImages: HeroImageRow[];
}) {
  const [images, setImages] = useState(initialImages);
  const [pending, startTransition] = useTransition();
  const { notifySuccess, notifyError } = useToast();
  const router = useRouter();

  // The list is held locally so edits feel instant, but that copy can drift
  // from the database — a delete succeeded server-side while the row stayed
  // on screen, which reads as "the button did nothing". Re-syncing whenever
  // the server sends a fresh list keeps the two honest.
  const serverKey = initialImages.map((i) => i.id).join(",");
  const lastServerKey = useRef(serverKey);
  useEffect(() => {
    if (lastServerKey.current !== serverKey) {
      lastServerKey.current = serverKey;
      setImages(initialImages);
    }
  }, [serverKey, initialImages]);

  const full = images.length >= MAX_IMAGES;

  function handleUploaded(url: string) {
    startTransition(async () => {
      const result = await addHeroImage(url, "");
      if (result.error || !result.id) {
        notifyError(result.error ?? "เพิ่มรูปไม่สำเร็จ");
        return;
      }
      setImages((current) => [
        ...current,
        {
          id: result.id as string,
          image_url: url,
          caption: "",
          sort_order: current.length + 1,
          created_at: new Date().toISOString(),
        },
      ]);
      notifySuccess("เพิ่มรูปแบนเนอร์แล้ว");
      router.refresh();
    });
  }

  function handleCaption(id: string, caption: string) {
    setImages((c) => c.map((i) => (i.id === id ? { ...i, caption } : i)));
  }

  function saveCaption(id: string, caption: string) {
    startTransition(async () => {
      const result = await updateHeroCaption(id, caption);
      if (result.error) notifyError(result.error);
      else notifySuccess("บันทึกคำบรรยายแล้ว");
    });
  }

  function handleMove(id: string, direction: "up" | "down") {
    const index = images.findIndex((i) => i.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;

    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next); // move on screen first so it feels instant

    startTransition(async () => {
      const result = await moveHeroImage(id, direction);
      if (result.error) {
        setImages(images); // put it back if the server disagreed
        notifyError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteHeroImage(id);
      if (result.error) {
        notifyError(result.error);
        return;
      }
      setImages((c) => c.filter((i) => i.id !== id));
      notifySuccess("ลบรูปแล้ว");
      router.refresh();
    });
  }

  return (
    <div>
      <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-ink">เพิ่มรูปแบนเนอร์</h2>
        <p className="mt-1 text-sm text-ink-soft">
          ใส่ได้สูงสุด {MAX_IMAGES} รูป ตอนนี้มี {images.length} รูป
          {full && " — ถ้าจะเพิ่มต้องลบรูปเก่าออกก่อน"}
        </p>
        {!full && (
          <div className="mt-4">
            <ImageUploader
              pathPrefix="hero"
              label="แนะนำรูปแนวนอน สว่าง เห็นผ้าม่านชัดๆ (ระบบย่อขนาดให้อัตโนมัติ)"
              onUploaded={handleUploaded}
            />
          </div>
        )}
      </div>

      <ol className="mt-6 space-y-4">
        {images.map((image, index) => (
          <li
            key={image.id}
            className="flex flex-wrap items-start gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm"
          >
            <span className="relative h-24 w-32 flex-none overflow-hidden rounded-xl border border-brand-100">
              <Image
                src={image.image_url}
                alt={image.caption || `รูปแบนเนอร์ที่ ${index + 1}`}
                fill
                sizes="128px"
                className="object-cover"
              />
              <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-xs font-medium text-white">
                {index + 1}
              </span>
            </span>

            <div className="min-w-[220px] flex-1">
              <label
                htmlFor={`caption-${image.id}`}
                className="block text-sm font-medium text-ink"
              >
                คำบรรยายรูป (ไม่บังคับ)
              </label>
              <p className="mt-0.5 text-xs text-ink-soft">
                ไม่แสดงบนเว็บ ใช้ช่วยให้ Google เข้าใจว่ารูปนี้คืองานอะไร
              </p>
              <input
                id={`caption-${image.id}`}
                type="text"
                value={image.caption}
                onChange={(e) => handleCaption(image.id, e.target.value)}
                onBlur={(e) => saveCaption(image.id, e.target.value)}
                placeholder="เช่น ม่านจีบทูโทนคู่ผ้าโปร่ง"
                className="mt-2 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-none items-center gap-2">
              <button
                type="button"
                onClick={() => handleMove(image.id, "up")}
                disabled={index === 0 || pending}
                aria-label={`เลื่อนรูปที่ ${index + 1} ขึ้น`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 text-brand-700 transition-[background-color,transform] hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeftIcon className="h-4 w-4 rotate-90" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(image.id, "down")}
                disabled={index === images.length - 1 || pending}
                aria-label={`เลื่อนรูปที่ ${index + 1} ลง`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 text-brand-700 transition-[background-color,transform] hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRightIcon className="h-4 w-4 rotate-90" />
              </button>
              <ConfirmButton
                onConfirm={() => handleDelete(image.id)}
                title="ลบรูปแบนเนอร์นี้?"
                message="รูปนี้จะหายจากหน้าแรกทันที การลบไม่สามารถย้อนกลับได้"
                confirmLabel="ลบรูป"
              >
                ลบ
              </ConfirmButton>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
