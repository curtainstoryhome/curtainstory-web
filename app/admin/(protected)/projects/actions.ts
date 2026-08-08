"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  deleteStorageImage,
  deleteStorageImages,
} from "@/lib/supabase/storage-cleanup";
import { generateUniqueSlug, friendlyDbError } from "@/lib/slug";
import { parseYouTubeId } from "@/lib/youtube";

function revalidatePortfolio(slug?: string) {
  revalidatePath("/portfolio");
  revalidatePath("/");
  if (slug) revalidatePath(`/portfolio/${slug}`);
  revalidatePath("/admin/projects");
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sort_order = Number(formData.get("sort_order") || 0);

  if (!title?.trim()) return { error: "กรุณากรอกชื่อผลงาน" };

  // generateUniqueSlug only keeps the URL unique — two projects could still
  // end up with the same visible name, which the owner cannot tell apart.
  const { data: clash } = await supabase
    .from("projects")
    .select("id")
    .eq("title", title.trim())
    .maybeSingle();

  if (clash) {
    return {
      error: `มีผลงานชื่อ "${title.trim()}" อยู่แล้ว กรุณาตั้งชื่อให้ต่างกัน เช่น เติมชื่อโครงการหรือปีต่อท้าย`,
    };
  }

  const slug = await generateUniqueSlug(supabase, "projects", title);

  const { data, error } = await supabase
    .from("projects")
    .insert({ slug, title: title.trim(), description, sort_order })
    .select("id")
    .single();

  if (error || !data) {
    return {
      error: error ? friendlyDbError(error.message) : "สร้างผลงานไม่สำเร็จ",
    };
  }

  revalidatePortfolio(slug);
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sort_order = Number(formData.get("sort_order") || 0);
  const video_url = ((formData.get("video_url") as string) ?? "").trim();
  // Checkbox group: which services this job demonstrates.
  const service_slugs = formData.getAll("service_slugs").map(String);

  if (!title?.trim()) return { error: "กรุณากรอกชื่อผลงาน" };
  if (video_url && !parseYouTubeId(video_url)) {
    return { error: "ลิงก์วิดีโอไม่ถูกต้อง กรุณาใช้ลิงก์จาก YouTube" };
  }

  // The slug is fixed once created, so a duplicate title raises no database
  // error — it just quietly produces two projects with the same name, which
  // is impossible for the owner to tell apart in the list.
  const { data: clash } = await supabase
    .from("projects")
    .select("id")
    .eq("title", title.trim())
    .neq("id", id)
    .maybeSingle();

  if (clash) {
    return {
      error: `มีผลงานชื่อ "${title.trim()}" อยู่แล้ว กรุณาตั้งชื่อให้ต่างกัน เช่น เติมชื่อโครงการหรือปีต่อท้าย`,
    };
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      title: title.trim(),
      description,
      video_url,
      service_slugs,
      sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) {
    return { error: friendlyDbError(error.message) };
  }

  revalidatePortfolio(data?.slug);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("slug, images:project_images(image_url)")
    .eq("id", id)
    .maybeSingle();

  // project_images rows cascade-delete at the DB level, but the underlying
  // Storage files don't — clean those up explicitly first.
  if (project?.images?.length) {
    await deleteStorageImages(
      supabase,
      project.images.map((i) => i.image_url),
    );
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePortfolio(project?.slug);
}

// Returns the created row's real id so the client can replace its optimistic
// placeholder. Without this, deleting a just-uploaded image sends a "temp-…"
// string where a uuid is expected and the delete blows up.
export async function addProjectImage(
  projectId: string,
  projectSlug: string,
  imageUrl: string,
): Promise<string> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("project_images")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (existing?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("project_images")
    .insert({
      project_id: projectId,
      image_url: imageUrl,
      sort_order: nextOrder,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      error ? friendlyDbError(error.message) : "บันทึกรูปไม่สำเร็จ",
    );
  }
  revalidatePortfolio(projectSlug);
  return data.id;
}

export async function deleteProjectImage(
  imageId: string,
  projectSlug: string,
) {
  const supabase = await createClient();

  const { data: image } = await supabase
    .from("project_images")
    .select("image_url")
    .eq("id", imageId)
    .maybeSingle();

  const { error } = await supabase
    .from("project_images")
    .delete()
    .eq("id", imageId);
  if (error) throw new Error(error.message);

  if (image?.image_url) {
    await deleteStorageImage(supabase, image.image_url);
  }

  revalidatePortfolio(projectSlug);
}
