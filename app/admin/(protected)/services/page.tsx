import Link from "next/link";
import Image from "next/image";
import { getServices } from "@/lib/data";
import { deleteService } from "./actions";
import DeleteRowButton from "@/components/admin/DeleteRowButton";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-ink">
          บริการ
        </h1>
        <Link
          href="/admin/services/new"
          className="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white shadow-[0_2px_8px_-2px_rgba(109,83,39,0.45)] transition-[background-color,transform,box-shadow] duration-150 hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
        >
          + เพิ่มบริการ
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-brand-100 bg-white p-4"
          >
            <div className="relative h-16 w-20 flex-none overflow-hidden rounded-lg">
              <Image
                src={service.image_url}
                alt={service.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{service.title}</p>
              <p className="line-clamp-2 text-sm text-ink-soft">{service.summary}</p>
            </div>
            <div className="ml-auto flex flex-none items-center gap-2">
              <Link
                href={`/admin/services/${service.id}`}
                className="inline-flex min-h-9 items-center rounded-full border border-brand-200 px-4 text-sm font-medium text-ink-soft hover:bg-brand-50 transition-[background-color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 active:scale-[0.97]"
              >
                แก้ไข
              </Link>
              <DeleteRowButton
                kind="บริการ"
                itemName={service.title}
                onDelete={async () => {
                  "use server";
                  await deleteService(service.id);
                }}
              />
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-ink-soft">ยังไม่มีบริการ</p>
        )}
      </div>
    </div>
  );
}
