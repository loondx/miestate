import Link from "next/link";
import { Phone, ArrowRight, FileText, Briefcase, IndianRupee, Users } from "lucide-react";
import { getAll, FILES } from "@/lib/store";
import { type Lead } from "@/types/lead";
import type { Report, Transaction } from "@/types/report";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { formatINR, relativeDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function isThisMonth(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default async function AdminDashboard() {
  const [leads, reports, txns] = await Promise.all([
    getAll<Lead>(FILES.leads),
    getAll<Report>(FILES.reports),
    getAll<Transaction>(FILES.transactions),
  ]);

  const paidThisMonth = (pkg: Report["packageType"]) =>
    reports.filter(
      (r) => r.paymentStatus === "paid" && r.packageType === pkg && isThisMonth(r.paidAt)
    );
  const reportsM = paidThisMonth("report");
  const conciergeM = paidThisMonth("concierge");
  const commissionsDue = txns
    .filter((t) => t.type === "commission" && t.status === "expected")
    .reduce((s, t) => s + t.amount, 0);

  const activeLeads = leads.filter((l) => !["closed", "lost"].includes(l.status));

  const today = new Date().toISOString().slice(0, 10);
  const followUps = leads.filter(
    (l) => l.followUpDate && l.followUpDate.slice(0, 10) <= today && !["closed", "lost"].includes(l.status)
  );

  const recent = leads.slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-gray-900">
          Good to see you, Rohit
        </h1>
        <p className="text-sm text-gray-500">Here&apos;s today at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Reports this month"
          value={formatINR(reportsM.reduce((s, r) => s + r.amount, 0))}
          note={`${reportsM.length} sold`}
          href="/admin/reports"
        />
        <StatCard
          icon={Briefcase}
          label="Concierge this month"
          value={formatINR(conciergeM.reduce((s, r) => s + r.amount, 0))}
          note={`${conciergeM.length} sold`}
          href="/admin/reports"
        />
        <StatCard
          icon={IndianRupee}
          label="Commissions due"
          value={formatINR(commissionsDue)}
          note="expected"
          href="/admin/revenue"
        />
        <StatCard
          icon={Users}
          label="Active leads"
          value={String(activeLeads.length)}
          note="in pipeline"
          href="/admin/leads"
        />
      </div>

      {/* Today's follow-ups */}
      <section className="rounded-lg border border-gold-400 bg-gold-50 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Today&apos;s follow-ups</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-forest-700 hover:underline">
            All leads <ArrowRight className="inline h-3.5 w-3.5" />
          </Link>
        </div>
        {followUps.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">Nothing flagged for today.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {followUps.map((l) => (
              <li key={l.id} className="flex items-center justify-between rounded-md bg-white p-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">{l.name}</p>
                  <p className="capitalize text-gray-500">{l.requirement}</p>
                </div>
                <a href={`tel:${l.phone}`} className="flex items-center gap-1.5 font-medium text-forest-700">
                  <Phone className="h-4 w-4" /> {l.phone}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent leads */}
      <section>
        <h2 className="mb-3 font-semibold text-gray-900">Recent leads</h2>
        {recent.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-gray-500">
            No leads yet. Share miestate.in with your next buyer.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Requirement</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map((l) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{l.name}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${l.phone}`} className="text-forest-700">{l.phone}</a>
                    </td>
                    <td className="hidden px-4 py-3 capitalize text-gray-500 sm:table-cell">{l.requirement}</td>
                    <td className="px-4 py-3"><LeadStatusBadge status={l.status} /></td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{relativeDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300">
      <Icon className="h-5 w-5 text-forest-600" />
      <p className="mono mt-2 text-xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-[11px] text-gray-400">{note}</p>
    </Link>
  );
}
