"use client";

import AdminButton from "@/components/admin/AdminButton";

import { useState } from "react";
import { createProject } from "../actions";

export default function NewProjectPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">
        เพิ่มผลงานใหม่
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        กรอกข้อมูลก่อน แล้วเพิ่มรูปภาพในขั้นตอนถัดไป
      </p>

      <form
        action={async (formData) => {
          setPending(true);
          setError(null);
          const result = await createProject(formData);
          if (result?.error) {
            setError(result.error);
            setPending(false);
          }
        }}
        className="mt-6 max-w-xl space-y-5"
      >
        {/* htmlFor/id on every field: without it, tapping the label does not
            focus the box — which on a phone reads as "the form is broken". */}
        <div>
          <label
            htmlFor="project-title"
            className="block text-sm font-medium text-ink"
          >
            ชื่อผลงาน
          </label>
          <input
            id="project-title"
            name="title"
            required
            className="mt-1 min-h-11 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-ink"
          >
            คำอธิบาย
          </label>
          <textarea
            id="project-description"
            name="description"
            required
            rows={3}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="project-sort-order"
            className="block text-sm font-medium text-ink"
          >
            ลำดับการแสดงผล
          </label>
          <input
            id="project-sort-order"
            name="sort_order"
            type="number"
            defaultValue={0}
            aria-describedby="project-sort-order-hint"
            className="mt-1 min-h-11 w-32 rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <p id="project-sort-order-hint" className="mt-1 text-xs text-ink-soft">
            เลขน้อยขึ้นก่อน — ใส่ 0 ไว้ก็ได้ถ้ายังไม่แน่ใจ
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <AdminButton type="submit" pending={pending} pendingLabel="กำลังสร้าง...">
          {"สร้างผลงาน และเพิ่มรูป →"}
        </AdminButton>
      </form>
    </div>
  );
}
