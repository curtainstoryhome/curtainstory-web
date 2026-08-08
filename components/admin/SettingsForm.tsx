"use client";

import AdminButton from "@/components/admin/AdminButton";

import { useActionState, useState } from "react";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateBusinessInfo } from "@/app/admin/(protected)/settings/actions";
import type { BusinessInfo } from "@/lib/types";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  // The hint is tied to the input with aria-describedby rather than left as
  // loose text, so it is read out with the field instead of being skipped.
  const hintId = hint ? `${name}-hint` : undefined;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-describedby={hintId}
        className="mt-1 min-h-11 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}

export default function SettingsForm({ business }: { business: BusinessInfo }) {
  const [state, formAction, pending] = useActionState(updateBusinessInfo, {
    error: null,
    success: false,
  });
  const [qrImage, setQrImage] = useState(business.line_qr_image);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <Field
        label="ชื่อแบรนด์ (บรรทัดบน)"
        name="name"
        defaultValue={business.name}
      />
      <Field
        label="คำอธิบายใต้ชื่อ (บรรทัดล่าง)"
        name="name_en"
        defaultValue={business.name_en}
      />
      <p className="-mt-2 text-xs text-ink-soft">
        สองบรรทัดนี้จะแสดงบนหัวเว็บ และรวมกันเป็นชื่อที่ Google/Facebook เห็น เช่น
        &ldquo;{business.name} | {business.name_en}&rdquo;
      </p>
      <Field label="แท็กไลน์" name="tagline" defaultValue={business.tagline} />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-ink"
        >
          คำอธิบายร้าน
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={business.description}
          rows={4}
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="เบอร์โทร (แสดงผล)" name="phone" defaultValue={business.phone} />
        <Field
          label="เบอร์โทร (ลิงก์ tel:)"
          name="phone_href"
          defaultValue={business.phone_href}
        />
      </div>

      <Field label="ลิงก์ LINE" name="line_url" defaultValue={business.line_url} />

      <div>
        {/* Not a <label>: the control underneath is the uploader, which names
            itself. A label pointing at nothing is worse than a heading. */}
        <span className="block text-sm font-medium text-ink">QR Code LINE</span>
        {qrImage && (
          <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-lg border border-brand-100">
            <Image src={qrImage} alt="LINE QR" fill sizes="96px" className="object-cover" />
          </div>
        )}
        <input type="hidden" name="line_qr_image" value={qrImage} />
        <div className="mt-2">
          <ImageUploader pathPrefix="business" onUploaded={setQrImage} label="" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="ชื่อ Facebook Page"
          name="facebook_name"
          defaultValue={business.facebook_name}
        />
        <Field
          label="ลิงก์ Facebook (ถ้ามี)"
          name="facebook_url"
          defaultValue={business.facebook_url}
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-ink">
          ที่อยู่
        </label>
        <textarea
          id="address"
          name="address"
          defaultValue={business.address}
          rows={3}
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <Field
        label="เวลาเปิด-ปิด"
        name="hours"
        defaultValue={business.hours}
        placeholder="เช่น จันทร์-เสาร์ 9:00-18:00 (อาทิตย์ปิด)"
        hint="ลูกค้าถามบ่อยที่สุดข้อหนึ่ง จะแสดงในหน้าติดต่อเรา — เว้นว่างไว้ได้ถ้ายังไม่อยากบอก"
      />

      <Field
        label="ลิงก์ขอรีวิว Google"
        name="review_url"
        defaultValue={business.review_url}
        placeholder="https://g.page/r/.../review"
        hint="ปุ่ม “รีวิวให้เราบน Google” ในหน้าติดต่อเรา — เว้นว่างไว้ = ไม่แสดงปุ่ม"
      />

      <Field
        label="ลิงก์ Google Maps"
        name="map_url"
        defaultValue={business.map_url}
      />

      <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4">
        <p className="text-sm font-semibold text-ink">วิดีโอหน้าแรก</p>
        <p className="mt-1 text-xs text-ink-soft">
          วางลิงก์ YouTube แล้ววิดีโอจะขึ้นบนหน้าแรกอัตโนมัติ
          — ไม่กินพื้นที่เซิร์ฟเวอร์ เว้นว่างไว้ถ้าไม่ต้องการแสดง
        </p>
        <div className="mt-3 space-y-3">
          <Field
            label="ลิงก์วิดีโอ YouTube"
            name="video_url"
            defaultValue={business.video_url}
          />
          <Field
            label="หัวข้อวิดีโอ"
            name="video_title"
            defaultValue={business.video_title}
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm text-green-600">บันทึกเรียบร้อยแล้ว</p>
      )}

      <AdminButton type="submit" pending={pending} pendingLabel="กำลังบันทึก...">
          {"บันทึก"}
        </AdminButton>
    </form>
  );
}
