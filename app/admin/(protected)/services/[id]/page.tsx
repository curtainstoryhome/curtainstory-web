import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ServiceForm from "@/components/admin/ServiceForm";
import { updateService } from "../actions";
import type { ServiceRow } from "@/lib/types";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle<ServiceRow>();

  if (!service) notFound();

  async function action(formData: FormData) {
    "use server";
    return updateService(id, formData);
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">
        แก้ไขบริการ
      </h1>
      <div className="mt-6">
        <ServiceForm service={service} action={action} />
      </div>
    </div>
  );
}
