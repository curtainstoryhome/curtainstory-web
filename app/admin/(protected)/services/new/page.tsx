import ServiceForm from "@/components/admin/ServiceForm";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">
        เพิ่มบริการใหม่
      </h1>
      <div className="mt-6">
        <ServiceForm action={createService} />
      </div>
    </div>
  );
}
