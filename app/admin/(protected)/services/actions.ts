"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteStorageImage } from "@/lib/supabase/storage-cleanup";
import { generateUniqueSlug, friendlyDbError } from "@/lib/slug";

function revalidateServices() {
  revalidatePath("/services");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/services");
}

export async function createService(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const sort_order = Number(formData.get("sort_order") || 0);

  if (!title?.trim()) return { error: "กรุณากรอกชื่อบริการ" };
  if (!image_url?.trim()) return { error: "กรุณาเลือกรูปภาพก่อนบันทึก" };

  const slug = await generateUniqueSlug(supabase, "services", title);

  const { error } = await supabase.from("services").insert({
    slug,
    title,
    summary,
    description,
    image_url,
    sort_order,
  });

  if (error) {
    return { error: friendlyDbError(error.message) };
  }

  revalidateServices();
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const image_url = formData.get("image_url") as string;
  const sort_order = Number(formData.get("sort_order") || 0);

  if (!title?.trim()) return { error: "กรุณากรอกชื่อบริการ" };
  if (!image_url?.trim()) return { error: "กรุณาเลือกรูปภาพก่อนบันทึก" };

  // Same reasoning as projects: the slug never changes on edit, so nothing in
  // the database stops two services sharing a name.
  const { data: clash } = await supabase
    .from("services")
    .select("id")
    .eq("title", title.trim())
    .neq("id", id)
    .maybeSingle();

  if (clash) {
    return {
      error: `มีบริการชื่อ "${title.trim()}" อยู่แล้ว กรุณาตั้งชื่อให้ต่างกัน`,
    };
  }

  const { data: existing } = await supabase
    .from("services")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("services")
    .update({
      title,
      summary,
      description,
      image_url,
      sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: friendlyDbError(error.message) };
  }

  if (existing?.image_url && existing.image_url !== image_url) {
    await deleteStorageImage(supabase, existing.image_url);
  }

  revalidateServices();
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("services")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.image_url) {
    await deleteStorageImage(supabase, existing.image_url);
  }

  revalidateServices();
}
