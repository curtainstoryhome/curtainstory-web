import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectImageGallery from "@/components/admin/ProjectImageGallery";
import ProjectInfoForm from "@/components/admin/ProjectInfoForm";
import { getServices } from "@/lib/data";
import { updateProject, addProjectImage, deleteProjectImage } from "../actions";
import type { ProjectRow, ProjectImageRow } from "@/lib/types";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: images }, services] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle<ProjectRow>(),
    supabase
      .from("project_images")
      .select("*")
      .eq("project_id", id)
      .order("sort_order", { ascending: true })
      .returns<ProjectImageRow[]>(),
    getServices(),
  ]);

  if (!project) notFound();

  async function updateAction(formData: FormData) {
    "use server";
    return updateProject(id, formData);
  }

  async function addImageAction(imageUrl: string) {
    "use server";
    return addProjectImage(id, project!.slug, imageUrl);
  }

  async function deleteImageAction(imageId: string) {
    "use server";
    await deleteProjectImage(imageId, project!.slug);
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">
        แก้ไขผลงาน
      </h1>

      <div className="mt-6">
        <ProjectInfoForm
          project={project}
          action={updateAction}
          services={services}
        />
      </div>

      <div className="mt-10 max-w-3xl">
        <h2 className="font-heading text-lg font-semibold text-ink">
          รูปภาพผลงาน
        </h2>
        <div className="mt-3">
          <ProjectImageGallery
            images={images ?? []}
            onAdd={addImageAction}
            onDelete={deleteImageAction}
          />
        </div>
      </div>
    </div>
  );
}
