"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteStorageImage } from "@/lib/supabase/storage-cleanup";
import { parseYouTubeId } from "@/lib/youtube";

export async function updateBusinessInfo(
  _prevState: { error: string | null; success: boolean },
  formData: FormData,
): Promise<{ error: string | null; success: boolean }> {
  const supabase = await createClient();

  const fields = {
    name: formData.get("name") as string,
    name_en: formData.get("name_en") as string,
    tagline: formData.get("tagline") as string,
    description: formData.get("description") as string,
    phone: formData.get("phone") as string,
    phone_href: formData.get("phone_href") as string,
    line_url: formData.get("line_url") as string,
    line_qr_image: formData.get("line_qr_image") as string,
    facebook_name: formData.get("facebook_name") as string,
    facebook_url: formData.get("facebook_url") as string,
    address: formData.get("address") as string,
    hours: ((formData.get("hours") as string) ?? "").trim(),
    map_url: formData.get("map_url") as string,
    review_url: ((formData.get("review_url") as string) ?? "").trim(),
    video_url: ((formData.get("video_url") as string) ?? "").trim(),
    video_title: ((formData.get("video_title") as string) ?? "").trim(),
    updated_at: new Date().toISOString(),
  };

  if (fields.video_url && !parseYouTubeId(fields.video_url)) {
    return {
      error: "ลิงก์วิดีโอไม่ถูกต้อง กรุณาใช้ลิงก์จาก YouTube",
      success: false,
    };
  }

  const { data: existing } = await supabase
    .from("business_info")
    .select("line_qr_image")
    .eq("id", true)
    .maybeSingle();

  const { error } = await supabase
    .from("business_info")
    .update(fields)
    .eq("id", true);

  if (error) {
    return { error: error.message, success: false };
  }

  if (
    existing?.line_qr_image &&
    existing.line_qr_image !== fields.line_qr_image
  ) {
    await deleteStorageImage(supabase, existing.line_qr_image);
  }

  revalidatePath("/", "layout");
  return { error: null, success: true };
}
