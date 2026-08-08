"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { updateSiteSettings, type SaveState } from "@/app/admin/(protected)/content/actions";
import AdminButton from "@/components/admin/AdminButton";
import ImageUploader from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/Toast";
import type { SiteSettingRow } from "@/lib/types";

const initial: SaveState = { error: null, success: false };

// Contrast against the page background, so the owner is warned before they
// pick a colour nobody can read.
function contrastOnCream(hex: string, bg: string) {
  const toRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lum = (rgb: number[]) => {
    const f = (v: number) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  };
  const a = lum(toRgb(hex));
  const b = lum(toRgb(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const HEX = /^#[0-9a-fA-F]{6}$/;

export default function SiteSettingsGroupForm({
  groupKey,
  groupLabel,
  fields,
}: {
  groupKey: string;
  groupLabel: string;
  fields: SiteSettingRow[];
}) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initial);
  const { notifySuccess, notifyError } = useToast();
  const [values, setValues] = useState<Record<string, string>>(
    () => Object.fromEntries(fields.map((f) => [f.key, f.value])),
  );

  useEffect(() => {
    if (state.success) notifySuccess(`บันทึก "${groupLabel}" เรียบร้อยแล้ว`);
    if (state.error) notifyError(state.error);
  }, [state, groupLabel, notifySuccess, notifyError]);

  const set = (key: string, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const bg = values["color_cream"] ?? "#faf8f4";

  return (
    <form action={formAction} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6">
      <input type="hidden" name="group_key" value={groupKey} />

      <h2 className="font-heading text-lg font-semibold text-ink">{groupLabel}</h2>

      <div className="mt-5 space-y-6">
        {fields.map((field) => {
          const value = values[field.key] ?? "";
          const id = `field-${field.key}`;

          return (
            <div key={field.key}>
              <label htmlFor={id} className="block text-sm font-medium text-ink">
                {field.label}
              </label>
              {field.hint && (
                <p className="mt-0.5 text-xs text-ink-soft">{field.hint}</p>
              )}

              {field.kind === "image" ? (
                <div className="mt-2 flex flex-wrap items-start gap-4">
                  {value && (
                    <span className="relative h-24 w-32 flex-none overflow-hidden rounded-xl border border-brand-100">
                      <Image
                        src={value}
                        alt={field.label}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  <div className="min-w-[240px] flex-1">
                    {/* Upload sits right beside the picture it replaces. */}
                    <ImageUploader
                      pathPrefix={`content/${field.key}`}
                      label="เลือกรูปใหม่เพื่อเปลี่ยนรูปนี้ (ระบบย่อขนาดให้อัตโนมัติ)"
                      onUploaded={(url) => {
                        set(field.key, url);
                        notifySuccess("อัปโหลดแล้ว — กด \"บันทึก\" ด้านล่างเพื่อให้ขึ้นเว็บจริง");
                      }}
                    />
                    <input type="hidden" name={`field:${field.key}`} value={value} />
                  </div>
                </div>
              ) : field.kind === "color" ? (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <input
                    id={id}
                    type="color"
                    value={HEX.test(value) ? value : "#000000"}
                    onChange={(e) => set(field.key, e.target.value)}
                    aria-label={`เลือก${field.label}`}
                    className="h-11 w-16 cursor-pointer rounded-lg border border-brand-200 bg-white p-1"
                  />
                  <input
                    type="text"
                    name={`field:${field.key}`}
                    value={value}
                    onChange={(e) => set(field.key, e.target.value)}
                    aria-label={`รหัสสีของ${field.label}`}
                    spellCheck={false}
                    className="w-32 rounded-lg border border-brand-200 px-3 py-2 font-mono text-sm text-ink focus:border-brand-500 focus:outline-none"
                  />
                  {HEX.test(value) && field.key !== "color_cream" && (
                    (() => {
                      const ratio = contrastOnCream(value, HEX.test(bg) ? bg : "#faf8f4");
                      const ok = ratio >= 4.5;
                      return (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            ok ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-700"
                          }`}
                        >
                          {ok
                            ? `อ่านง่าย (ชัด ${ratio.toFixed(1)} เท่า)`
                            : `สีอ่อนไป อ่านยาก (${ratio.toFixed(1)} เท่า ควรเกิน 4.5)`}
                        </span>
                      );
                    })()
                  )}
                </div>
              ) : field.kind === "longtext" ? (
                <textarea
                  id={id}
                  name={`field:${field.key}`}
                  value={value}
                  rows={3}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="mt-2 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm leading-relaxed text-ink focus:border-brand-500 focus:outline-none"
                />
              ) : (
                <input
                  id={id}
                  type="text"
                  name={`field:${field.key}`}
                  value={value}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="mt-2 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <AdminButton type="submit" pending={pending} pendingLabel="กำลังบันทึก...">
          {`บันทึก ${groupLabel}`}
        </AdminButton>
        <span className="text-xs text-ink-soft">
          กดบันทึกแล้วเว็บจริงจะเปลี่ยนทันที
        </span>
      </div>
    </form>
  );
}
