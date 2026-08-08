"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteStorageImage } from "@/lib/supabase/storage-cleanup";

function revalidateHome() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/reviews");
}

// Returns the real row id so the client can swap out its optimistic
// placeholder — otherwise deleting a just-uploaded image sends a "temp-…"
// string where a uuid is expected.
export async function addReviewImage(imageUrl: string): Promise<string> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("review_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("review_images")
    .insert({
      image_url: imageUrl,
      sort_order: (existing?.sort_order ?? -1) + 1,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "บันทึกรูปไม่สำเร็จ");
  revalidateHome();
  return data.id;
}

export async function deleteReviewImage(id: string) {
  const supabase = await createClient();

  const { data: image } = await supabase
    .from("review_images")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("review_images").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (image?.image_url) {
    await deleteStorageImage(supabase, image.image_url);
  }

  revalidateHome();
}

export async function addWhyUsItem(formData: FormData): Promise<string> {
  const text = formData.get("text") as string;
  if (!text?.trim()) throw new Error("กรุณากรอกข้อความก่อนกดเพิ่ม");

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("why_us_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Returns the real id so the browser can replace its temporary placeholder.
  // Without this the new row keeps a fake "temp-" id and deleting it before a
  // refresh sends that fake id to the database.
  const { data, error } = await supabase
    .from("why_us_items")
    .insert({
      text: text.trim(),
      sort_order: (existing?.sort_order ?? -1) + 1,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidateHome();
  return data.id as string;
}

export async function deleteWhyUsItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("why_us_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateHome();
}
