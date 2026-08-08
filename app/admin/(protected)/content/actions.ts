"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteStorageImage } from "@/lib/supabase/storage-cleanup";

const HEX = /^#[0-9a-fA-F]{6}$/;

export type SaveState = { error: string | null; success: boolean };

// Saves one group of fields at a time (one page's worth), so the owner presses
// save once for the section they were looking at rather than hunting for a
// single button at the bottom of a very long form.
export async function updateSiteSettings(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const supabase = await createClient();

  const groupKey = String(formData.get("group_key") ?? "");
  if (!groupKey) return { error: "ไม่พบกลุ่มข้อมูลที่ต้องการบันทึก", success: false };

  const { data: rows, error: readError } = await supabase
    .from("site_settings")
    .select("key, kind, label, value")
    .eq("group_key", groupKey);

  if (readError || !rows) {
    return { error: "โหลดข้อมูลเดิมไม่สำเร็จ กรุณาลองใหม่", success: false };
  }

  // Validate the whole group BEFORE writing any of it. Checking inside the
  // write loop would let the fields before a bad one save and then abort,
  // leaving the site half-recoloured.
  const changes: { key: string; label: string; kind: string; value: string; previous: string }[] = [];

  for (const row of rows) {
    const raw = formData.get(`field:${row.key}`);
    // A field missing from the form (e.g. the browser dropped it) must not
    // silently blank out live wording.
    if (raw === null) continue;
    const value = String(raw).trim();

    if (row.kind === "color" && value && !HEX.test(value)) {
      return {
        error: `สี "${row.label}" ไม่ถูกต้อง ต้องอยู่ในรูปแบบ #RRGGBB เช่น #6d5327`,
        success: false,
      };
    }

    if (value === row.value) continue;
    changes.push({
      key: row.key,
      label: row.label,
      kind: row.kind,
      value,
      previous: row.value,
    });
  }

  const oldImages: string[] = [];

  for (const change of changes) {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: change.value })
      .eq("key", change.key);

    if (error) {
      return {
        error: `บันทึก "${change.label}" ไม่สำเร็จ: ${error.message}`,
        success: false,
      };
    }

    // Replaced photo: drop the old file so storage does not fill up with
    // images nothing points at any more.
    if (change.kind === "image" && change.previous) {
      oldImages.push(change.previous);
    }
  }

  for (const url of oldImages) {
    await deleteStorageImage(supabase, url);
  }

  revalidatePath("/", "layout");
  return { error: null, success: true };
}
