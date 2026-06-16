import { ReportsTable } from "@/components/admin/ReportsTable";
import { getAll, FILES } from "@/lib/store";
import type { Report } from "@/types/report";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await getAll<Report>(FILES.reports);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-gray-900">
          Reports
        </h1>
        <p className="text-sm text-gray-500">
          Track paid reports, add the PDF link, and send it to the buyer.
        </p>
      </div>
      <ReportsTable initial={reports} />
    </div>
  );
}
