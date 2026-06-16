"use client";

import { useState } from "react";
import { Phone, Flag, Trash2, StickyNote, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { relativeDate } from "@/lib/utils";
import {
  LEAD_PIPELINE,
  LEAD_STATUS_LABEL,
  type Lead,
  type LeadStatus,
  type LeadRequirement,
  type LeadSource,
} from "@/types/lead";

const STATUSES: LeadStatus[] = [...LEAD_PIPELINE];
const REQUIREMENTS: LeadRequirement[] = ["buy", "rent", "report", "concierge", "sell"];
const SOURCES: LeadSource[] = ["whatsapp", "referral", "website", "reddit", "other"];

const today = () => new Date().toISOString().slice(0, 10);

export function LeadsTable({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initial);
  const [saving, setSaving] = useState(false);
  const [notesOpen, setNotesOpen] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    requirement: "buy" as LeadRequirement,
    source: "whatsapp" as LeadSource,
  });

  async function addLead(e: React.FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.phone.trim().length < 6) return;
    setSaving(true);
    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const { lead } = await res.json();
      setLeads((prev) => [lead, ...prev]);
      setForm({ ...form, name: "", phone: "" });
    }
  }

  async function patch(id: string, patch: Partial<Lead>) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function del(id: string) {
    if (!confirm("Delete this lead?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
  }

  const counts = (s: LeadStatus) => leads.filter((l) => l.status === s).length;
  const visible = filterStatus
    ? leads.filter((l) => l.status === filterStatus)
    : leads;

  return (
    <div className="space-y-6">
      {/* Quick add */}
      <form onSubmit={addLead} className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-gray-900">Log a new lead</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Input autoFocus placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input inputMode="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value as LeadRequirement })}>
            {REQUIREMENTS.map((r) => (
              <option key={r} value={r} className="capitalize">{r}</option>
            ))}
          </Select>
          <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}>
            {SOURCES.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </Select>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Save lead</>}
          </Button>
        </div>
      </form>

      {/* Pipeline */}
      <div className="flex flex-wrap items-center gap-2">
        {LEAD_PIPELINE.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? null : s)}
            className={
              "rounded-md border px-3 py-1.5 text-left text-xs " +
              (filterStatus === s
                ? "border-forest-700 bg-forest-50 text-forest-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
            }
          >
            <span className="block font-semibold text-gray-900">{counts(s)}</span>
            {LEAD_STATUS_LABEL[s]}
          </button>
        ))}
        {filterStatus && (
          <button onClick={() => setFilterStatus(null)} className="text-xs text-forest-700 underline">
            Clear
          </button>
        )}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="font-medium text-gray-700">No leads here yet.</p>
          <p className="mt-1 text-sm text-gray-500">Log a lead above as soon as a buyer messages you.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((l) => {
            const flagged = l.followUpDate && l.followUpDate.slice(0, 10) <= today();
            return (
              <div key={l.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{l.name}</p>
                      <Badge tone="neutral" className="capitalize">{l.requirement}</Badge>
                      <Badge tone="neutral" className="capitalize">{l.source}</Badge>
                    </div>
                    <a href={`tel:${l.phone}`} className="mt-1 inline-flex items-center gap-1.5 text-sm text-forest-700">
                      <Phone className="h-3.5 w-3.5" /> {l.phone}
                    </a>
                    {(l.budget || l.locality) && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {l.budget ? `₹${(l.budget / 100000).toFixed(0)}L` : ""}
                        {l.budget && l.locality ? " · " : ""}
                        {l.locality || ""}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-gray-400">{relativeDate(l.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={l.status} onChange={(e) => patch(l.id, { status: e.target.value as LeadStatus })} className="h-9 w-auto text-sm">
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{LEAD_STATUS_LABEL[s]}</option>
                      ))}
                    </Select>
                    <LeadStatusBadge status={l.status} />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => patch(l.id, { followUpDate: flagged ? undefined : today() })}
                    className={
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium " +
                      (flagged ? "bg-gold-100 text-gold-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                    }
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {flagged ? "Following up today" : "Flag for follow-up"}
                  </button>
                  <button
                    onClick={() => setNotesOpen(notesOpen === l.id ? null : l.id)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                  >
                    <StickyNote className="h-3.5 w-3.5" /> Notes
                  </button>
                  <button
                    onClick={() => del(l.id)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>

                {notesOpen === l.id && (
                  <div className="mt-3">
                    <Textarea defaultValue={l.notes} placeholder="Add a note…" onBlur={(e) => patch(l.id, { notes: e.target.value })} />
                    <p className="mt-1 text-xs text-gray-400">Saved when you click away.</p>
                  </div>
                )}
                {l.notes && notesOpen !== l.id && <p className="mt-2 text-sm text-gray-600">{l.notes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
