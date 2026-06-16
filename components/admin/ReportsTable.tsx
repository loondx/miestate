"use client";

import { useState } from "react";
import { MessageCircle, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
import { Select, Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { whatsappLink } from "@/lib/whatsapp";
import { formatINR, relativeDate } from "@/lib/utils";
import type { Report, ReportStatus } from "@/types/report";

const STATUSES: ReportStatus[] = ["pending", "in_progress", "delivered"];
const LABEL: Record<ReportStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  delivered: "Delivered",
};
const TONE: Record<ReportStatus, Parameters<typeof Badge>[0]["tone"]> = {
  pending: "info",
  in_progress: "warning",
  delivered: "success",
};

export function ReportsTable({ initial }: { initial: Report[] }) {
  const [reports, setReports] = useState(initial);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function patch(id: string, patch: Partial<Report>) {
    setSavingId(id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSavingId(null);
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
        <p className="font-medium text-gray-700">No paid reports yet.</p>
        <p className="mt-1 text-sm text-gray-500">
          Paid orders appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div key={r.id} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{r.propertyAddress}</p>
                <Badge tone="neutral" className="capitalize">{r.packageType}</Badge>
              </div>
              <p className="text-sm text-gray-500">{r.buyerName} · {r.buyerPhone}</p>
              <p className="mt-1 text-xs text-gray-400">
                {formatINR(r.amount)} · paid {r.paidAt ? relativeDate(r.paidAt) : "not yet"}
              </p>
            </div>
            <Badge tone={TONE[r.reportStatus]}>{LABEL[r.reportStatus]}</Badge>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[180px_1fr_auto] sm:items-end">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Report status</label>
              <Select
                value={r.reportStatus}
                onChange={(e) => {
                  const next = e.target.value as ReportStatus;
                  patch(r.id, {
                    reportStatus: next,
                    deliveredAt: next === "delivered" ? new Date().toISOString() : r.deliveredAt,
                  });
                }}
                className="h-9 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{LABEL[s]}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Report PDF link</label>
              <Input
                defaultValue={r.reportPdfUrl ?? ""}
                placeholder="https://…/report.pdf"
                className="h-9 text-sm"
                onBlur={(e) => {
                  if (e.target.value !== (r.reportPdfUrl ?? "")) {
                    patch(r.id, { reportPdfUrl: e.target.value });
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2 pb-1">
              {savingId === r.id && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={whatsappLink(
                `Hi ${r.buyerName.split(" ")[0]}, your miestate ${r.packageType} for ${r.propertyAddress} is ${r.reportStatus === "delivered" ? "ready" : "being prepared"}.${r.reportPdfUrl ? " Download: " + r.reportPdfUrl : ""}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Send via WhatsApp
            </a>
            {r.reportPdfUrl && (
              <a
                href={r.reportPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open PDF
              </a>
            )}
            {r.reportStatus !== "delivered" && (
              <button
                onClick={() =>
                  patch(r.id, { reportStatus: "delivered", deliveredAt: new Date().toISOString() })
                }
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Mark delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
