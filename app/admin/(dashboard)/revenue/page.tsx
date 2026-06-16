import { RevenueStats } from "@/components/admin/RevenueStats";
import { getAll, FILES } from "@/lib/store";
import type { Transaction } from "@/types/report";

export const dynamic = "force-dynamic";

export default async function AdminRevenuePage() {
  const transactions = await getAll<Transaction>(FILES.transactions);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-gray-900">
          Revenue
        </h1>
        <p className="text-sm text-gray-500">
          Reports, concierge and expected commissions in a clean log.
        </p>
      </div>
      <RevenueStats initial={transactions} />
    </div>
  );
}
