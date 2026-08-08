"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { deleteStorageImage } from "@/lib/supabase/storage-cleanup";
import { friendlyDbError } from "@/lib/slug";

export async function addHeroImage(imageUrl: string, caption: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("hero_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("hero_images")
    .insert({ image_url: imageUrl, caption: caption.trim(), sort_order: nextOrder })
    .select("id")
    .single();

  if (error) return { error: friendlyDbError(error.message), id: null };

  revalidatePath("/", "layout");
  // The real id goes back to the browser so the newly added row is editable
  // straight away instead of holding a placeholder.
  return { error: null, id: data.id as string };
}

export async function updateHeroCaption(id: string, caption: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("hero_images")
    .update({ caption: caption.trim() })
    .eq("id", id);
  if (error) return { error: friendlyDbError(error.message) };
  revalidatePath("/", "layout");
  return { error: null };
}

export async function moveHeroImage(id: string, direction: "up" | "down") {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("hero_images")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (!rows) return { error: "โหลดรายการรูปไม่สำเร็จ" };

  const index = rows.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= rows.length) {
    return { error: null }; // already at the end — nothing to do
  }

  const a = rows[index];
  const b = rows[swapWith];

  // Park one row out of the way first: sort_order has no unique constraint
  // today, but swapping via a temporary keeps this correct if one is added.
  await supabase.from("hero_images").update({ sort_order: -1 }).eq("id", a.id);
  await supabase.from("hero_images").update({ sort_order: a.sort_order }).eq("id", b.id);
  await supabase.from("hero_images").update({ sort_order: b.sort_order }).eq("id", a.id);

  revalidatePath("/", "layout");
  return { error: null };
}

export async function deleteHeroImage(id: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("hero_images")
    .select("id", { count: "exact", head: true });

  if ((count ?? 0) <= 1) {
    return { error: "ต้องเหลือรูปแบนเนอร์อย่างน้อย 1 รูป กรุณาเพิ่มรูปใหม่ก่อนลบรูปนี้" };
  }

  const { data: row } = await supabase
    .from("hero_images")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("hero_images").delete().eq("id", id);
  if (error) return { error: friendlyDbError(error.message) };

  if (row?.image_url) await deleteStorageImage(supabase, row.image_url);

  revalidatePath("/", "layout");
  return { error: null };
}
