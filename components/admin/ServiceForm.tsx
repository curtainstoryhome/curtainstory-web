"use client";

import AdminButton from "@/components/admin/AdminButton";

import { useState, useId } from "react";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import type { ServiceRow } from "@/lib/types";

export default function ServiceForm({
  service,
  action,
}: {
  service?: ServiceRow;
  action: (formData: FormData) => Promise<{ error: string } | void>;
}) {
  const [imageUrl, setImageUrl] = useState(service?.image_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const id = useId();

  return (
    <form
      action={async (formData) => {
        setPending(true);
        setError(null);
        const result = await action(formData);
        if (result?.error) setError(result.error);
        setPending(false);
      }}
      className="max-w-xl space-y-5"
    >
      <div>
        <label
          htmlFor={`${id}-title`}
          className="block text-sm font-medium text-ink"
        >
          ชื่อบริการ
        </label>
        <input
          id={`${id}-title`}
          name="title"
          defaultValue={service?.title}
          required
          className="mt-1 min-h-11 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`${id}-summary`}
          className="block text-sm font-medium text-ink"
        >
          คำอธิบายสั้น (แสดงในการ์ด)
        </label>
        <input
          id={`${id}-summary`}
          name="summary"
          defaultValue={service?.summary}
          required
          className="mt-1 min-h-11 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`${id}-description`}
          className="block text-sm font-medium text-ink"
        >
          คำอธิบายเต็ม
        </label>
        <textarea
          id={`${id}-description`}
          name="description"
          defaultValue={service?.description}
          required
          rows={4}
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`${id}-sort`}
          className="block text-sm font-medium text-ink"
        >
          ลำดับการแสดงผล
        </label>
        <input
          id={`${id}-sort`}
          name="sort_order"
          type="number"
          defaultValue={service?.sort_order ?? 0}
          className="mt-1 min-h-11 w-32 rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-ink">รูปภาพ</span>
        {imageUrl && (
          <div className="relative mt-2 h-40 w-56 overflow-hidden rounded-lg border border-brand-100">
            <Image
              src={imageUrl}
              alt="ตัวอย่างรูปบริการ"
              fill
              sizes="224px"
              className="object-cover"
            />
          </div>
        )}
        <input type="hidden" name="image_url" value={imageUrl} />
        <div className="mt-2">
          <ImageUploader
            pathPrefix="services"
            onUploaded={(url) => setImageUrl(url)}
            label="แนะนำอัตราส่วนภาพ 4:3"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <AdminButton type="submit" pending={pending} pendingLabel="กำลังบันทึก...">
          {"บันทึก"}
        </AdminButton>
    </form>
  );
}
