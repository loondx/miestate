import { LeadsTable } from "@/components/admin/LeadsTable";
import { getAll, FILES } from "@/lib/store";
import type { Lead } from "@/types/lead";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await getAll<Lead>(FILES.leads);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-500">
          Log a WhatsApp lead in seconds. Tap a pipeline stage to filter.
        </p>
      </div>
      <LeadsTable initial={leads} />
    </div>
  );
}
