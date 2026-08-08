import Image from "next/image";
import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import type { ProjectWithImages } from "@/lib/types";

export default function ProjectCard({
  project,
}: {
  project: ProjectWithImages;
}) {
  return (
    <TiltCard>
    <Link
      href={`/portfolio/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-[0_2px_10px_-3px_rgba(124,94,62,0.16)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_18px_36px_-12px_rgba(124,94,62,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:translate-y-0 active:shadow-[0_4px_14px_-4px_rgba(124,94,62,0.28)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {project.images[0] && (
          <Image
            src={project.images[0].image_url}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          
          quality={90}
        />
        )}
        {project.images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {project.images.length} รูป
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-ink">
          {project.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {project.description}
        </p>
        <span className="mt-3 inline-block text-sm font-semibold text-brand-700">
          ดูผลงาน →
        </span>
      </div>
    </Link>
    </TiltCard>
  );
}
