import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/data";
import { deleteProject } from "./actions";
import DeleteRowButton from "@/components/admin/DeleteRowButton";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-ink">
          ผลงาน
        </h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white shadow-[0_2px_8px_-2px_rgba(109,83,39,0.45)] transition-[background-color,transform,box-shadow] duration-150 hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
        >
          + เพิ่มผลงาน
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-brand-100 bg-white p-4"
          >
            <div className="relative h-16 w-20 flex-none overflow-hidden rounded-lg bg-cream-deep">
              {project.images[0] && (
                <Image
                  src={project.images[0].image_url}
                  alt={project.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{project.title}</p>
              {/* A project with no photos is deliberately kept off the public
                  site. Saying so here is the difference between "I understand"
                  and "the website is broken, it didn't save my work". */}
              {project.images.length === 0 ? (
                <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                  ยังไม่แสดงบนเว็บ — ใส่รูปอย่างน้อย 1 รูปก่อน
                </p>
              ) : (
                <p className="text-sm text-ink-soft">
                  {project.images.length} รูป
                </p>
              )}
            </div>
            <div className="ml-auto flex flex-none items-center gap-2">
              <Link
                href={`/admin/projects/${project.id}`}
                className="inline-flex min-h-9 items-center rounded-full border border-brand-200 px-4 text-sm font-medium text-ink-soft hover:bg-brand-50 transition-[background-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
              >
                แก้ไข
              </Link>
              <DeleteRowButton
                kind="ผลงาน"
                itemName={project.title}
                // Warning only when there is something to warn about — a
                // project with none was being announced as "all 0 photos will
                // also be deleted", which just reads as a broken message.
                extraWarning={
                  project.images.length > 0
                    ? `รูปภาพทั้งหมด ${project.images.length} รูปในผลงานนี้จะถูกลบไปด้วย`
                    : undefined
                }
                onDelete={async () => {
                  "use server";
                  await deleteProject(project.id);
                }}
              />
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-ink-soft">ยังไม่มีผลงาน</p>
        )}
      </div>
    </div>
  );
}
