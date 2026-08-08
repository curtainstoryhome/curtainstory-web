"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { ProjectWithImages, ServiceRow } from "@/lib/types";

// Someone looking for roller blinds should not have to read through seven
// curtain jobs to find out whether the shop does them. Filtering happens in
// the browser — the whole list is already on the page, so switching is
// instant and costs no extra request.
export default function PortfolioFilter({
  projects,
  services,
}: {
  projects: ProjectWithImages[];
  services: ServiceRow[];
}) {
  const [active, setActive] = useState<string>("all");

  // Only offer a filter that would actually return something. A chip that
  // leads to an empty list makes the shop look like it has no work.
  const options = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const slug of project.service_slugs ?? []) {
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
    return [
      { slug: "all", label: "ทั้งหมด", count: projects.length },
      ...services
        .filter((service) => (counts.get(service.slug) ?? 0) > 0)
        .map((service) => ({
          slug: service.slug,
          label: service.title,
          count: counts.get(service.slug) ?? 0,
        })),
    ];
  }, [projects, services]);

  const shown =
    active === "all"
      ? projects
      : projects.filter((p) => (p.service_slugs ?? []).includes(active));

  return (
    <div>
      {options.length > 1 && (
        <div
          role="group"
          aria-label="กรองผลงานตามประเภทงาน"
          className="flex flex-wrap gap-2"
        >
          {options.map((option) => {
            const selected = option.slug === active;
            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => setActive(option.slug)}
                aria-pressed={selected}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97] ${
                  selected
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-brand-200 bg-white text-ink-soft hover:border-brand-500 hover:text-brand-700"
                }`}
              >
                {option.label}
                {/* The count says how much work is in each category, so it has
                    to be readable. Faded to 60%/70% it measured 2.51:1 and
                    4.48:1 against its own chip — both under the 4.5:1 floor,
                    and the unselected one was genuinely hard to read. */}
                <span className={selected ? "text-white" : "text-ink-soft"}>
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {/* Announced politely rather than leaving a blank space. In practice the
          filters above cannot produce this, but a project could lose its tag. */}
      {shown.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-brand-200 px-5 py-10 text-center text-ink-soft">
          ยังไม่มีผลงานในหมวดนี้ — ลองเลือก &ldquo;ทั้งหมด&rdquo; เพื่อดูผลงานอื่นของเรา
        </p>
      )}
    </div>
  );
}
