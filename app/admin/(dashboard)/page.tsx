import Link from "next/link";
import { Phone, ArrowRight, Users, CalendarClock, MapPinned, Building2 } from "lucide-react";
import { getAll, FILES } from "@/lib/store";
import {
  LEAD_REQUIREMENT_LABEL,
  LEAD_SOURCE_LABEL,
  type Lead,
} from "@/types/lead";
import type { Property } from "@/types/property";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { relativeDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [leads, properties] = await Promise.all([
    getAll<Lead>(FILES.leads),
    getAll<Property>(FILES.properties),
  ]);

  const newLeads = leads.filter((l) => l.status === "new");
  const inPipeline = leads.filter((l) => l.status === "site_visit" || l.status === "negotiating");
  const activeLeads = leads.filter((l) => !["closed", "lost"].includes(l.status));

  const today = new Date().toISOString().slice(0, 10);
  const followUps = leads.filter(
    (l) =>
      l.followUpDate &&
      l.followUpDate.slice(0, 10) <= today &&
      !["closed", "lost"].includes(l.status)
  );

  const recent = leads.slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-gray-900">
          Good to see you, Rohit
        </h1>
        <p className="text-sm text-gray-500">Here&apos;s your pipeline at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="New leads" value={String(newLeads.length)} note="awaiting first contact" href="/admin/leads" />
        <StatCard icon={CalendarClock} label="In pipeline" value={String(inPipeline.length)} note="site visit / negotiating" href="/admin/leads" />
        <StatCard icon={MapPinned} label="Active leads" value={String(activeLeads.length)} note="not closed/lost" href="/admin/leads" />
        <StatCard icon={Building2} label="Live projects" value={String(properties.length)} note="published" href="/admin/properties" />
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
                  <p className="text-gray-500">
                    {LEAD_REQUIREMENT_LABEL[l.requirement]}
                    {l.propertyInterest ? ` · ${l.propertyInterest}` : ""}
                  </p>
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
                  <th className="hidden px-4 py-3 sm:table-cell">Source</th>
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
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{LEAD_REQUIREMENT_LABEL[l.requirement]}</td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{LEAD_SOURCE_LABEL[l.source]}</td>
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
