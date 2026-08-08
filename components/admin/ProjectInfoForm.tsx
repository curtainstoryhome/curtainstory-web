"use client";

import AdminButton from "@/components/admin/AdminButton";

import { useState, useId } from "react";
import { parseYouTubeId } from "@/lib/youtube";
import type { ProjectRow, ServiceRow } from "@/lib/types";

export default function ProjectInfoForm({
  project,
  action,
  services = [],
}: {
  project: ProjectRow;
  action: (formData: FormData) => Promise<{ error: string } | void>;
  services?: ServiceRow[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [videoWarning, setVideoWarning] = useState(false);
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
          ชื่อผลงาน
        </label>
        <input
          id={`${id}-title`}
          name="title"
          defaultValue={project.title}
          required
          className="mt-1 min-h-11 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`${id}-description`}
          className="block text-sm font-medium text-ink"
        >
          คำอธิบาย
        </label>
        <textarea
          id={`${id}-description`}
          name="description"
          defaultValue={project.description}
          required
          rows={3}
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`${id}-video`}
          className="block text-sm font-medium text-ink"
        >
          ลิงก์วิดีโอ YouTube (ถ้ามี)
        </label>
        <input
          id={`${id}-video`}
          name="video_url"
          defaultValue={project.video_url}
          placeholder="https://www.youtube.com/watch?v=..."
          aria-describedby={`${id}-video-hint`}
          aria-invalid={videoWarning || undefined}
          onChange={(e) => {
            const v = e.target.value.trim();
            setVideoWarning(v !== "" && !parseYouTubeId(v));
          }}
          className="mt-1 min-h-11 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        {/* One element that stays mounted and announces, instead of swapping
            two — the "not a YouTube link" warning was silent to a screen
            reader and unlinked from the field it describes. */}
        <p
          id={`${id}-video-hint`}
          aria-live="polite"
          className={`mt-1 text-xs ${videoWarning ? "text-red-600" : "text-ink-soft"}`}
        >
          {videoWarning
            ? "ลิงก์นี้ไม่ใช่ลิงก์ YouTube ที่ถูกต้อง — วิดีโอจะไม่แสดงบนเว็บ"
            : "วางลิงก์จาก YouTube ได้เลย (วิดีโอไม่กินพื้นที่เซิร์ฟเวอร์)"}
        </p>
      </div>

      {services.length > 0 && (
        <fieldset>
          <legend className="block text-sm font-medium text-ink">
            บริการที่ใช้ในงานนี้
          </legend>
          <p className="mt-1 text-xs text-ink-soft">
            เลือกได้มากกว่า 1 อย่าง งานนี้จะไปแสดงในหน้าบริการที่เลือกไว้ด้วย
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {services.map((service) => (
              <label
                key={service.slug}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-brand-200 px-3 py-2.5 text-sm text-ink-soft transition-colors hover:border-brand-500 hover:bg-brand-50"
              >
                <input
                  type="checkbox"
                  name="service_slugs"
                  value={service.slug}
                  defaultChecked={project.service_slugs?.includes(service.slug)}
                  className="h-4 w-4 accent-brand-700"
                />
                {service.title}
              </label>
            ))}
          </div>
        </fieldset>
      )}

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
          defaultValue={project.sort_order}
          className="mt-1 min-h-11 w-32 rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <AdminButton type="submit" pending={pending} pendingLabel="กำลังบันทึก...">
          {"บันทึกข้อมูล"}
        </AdminButton>
    </form>
  );
}
