"use client";

import { useState, useRef, useId } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressImage, formatBytes } from "@/lib/compress-image";
import { useToast } from "@/components/admin/Toast";

const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB in, compressed down before upload
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploader({
  pathPrefix,
  onUploaded,
  label = "อัปโหลดรูปภาพ",
}: {
  pathPrefix: string;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const { notifySuccess, notifyError } = useToast();

  async function handleFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      notifyError("รองรับเฉพาะไฟล์รูป JPG, PNG หรือ WEBP เท่านั้น");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      notifyError(
        `ไฟล์ใหญ่เกินไป (${formatBytes(file.size)}) — ต้องไม่เกิน 25MB`,
      );
      return;
    }

    setUploading(true);
    setStatus("กำลังบีบอัดรูป...");

    try {
      const { blob, ext, originalBytes, compressedBytes } =
        await compressImage(file);

      setStatus("กำลังอัปโหลด...");

      const supabase = createClient();
      const filename = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(filename, blob, {
          cacheControl: "31536000",
          upsert: false,
          contentType: blob.type,
        });

      if (uploadError) {
        notifyError(`อัปโหลดไม่สำเร็จ: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage
        .from("site-images")
        .getPublicUrl(filename);

      onUploaded(data.publicUrl);

      const saved = originalBytes - compressedBytes;
      if (saved > 0) {
        notifySuccess(
          `อัปโหลดสำเร็จ — บีบอัดจาก ${formatBytes(originalBytes)} เหลือ ${formatBytes(compressedBytes)}`,
        );
      } else {
        notifySuccess("อัปโหลดสำเร็จ");
      }
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ กรุณาลองใหม่",
      );
    } finally {
      setUploading(false);
      setStatus(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  // The hint under the field is not a substitute for a name: on the banner
  // screen there are four of these in a row, and without a name each one is
  // announced only as "choose file" — indistinguishable from the others.
  const hintId = `${inputId}-hint`;

  return (
    <div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading}
        aria-label={label}
        aria-describedby={hintId}
        aria-busy={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="block w-full text-sm text-ink-soft file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 disabled:opacity-60"
      />
      {/* One live region that never unmounts, so "กำลังอัปโหลด..." is actually
          announced. Swapping two elements meant the progress text was silent. */}
      <p
        id={hintId}
        aria-live="polite"
        className={`mt-1 ${status ? "text-sm text-brand-600" : "text-xs text-ink-soft"}`}
      >
        {status ?? label}
      </p>
    </div>
  );
}
