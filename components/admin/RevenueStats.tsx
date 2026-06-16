"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatINR, formatDate } from "@/lib/utils";
import type { Transaction, TransactionType } from "@/types/report";

const TYPE_LABEL: Record<TransactionType, string> = {
  report: "Risk Report",
  concierge: "Concierge",
  commission: "Commission",
};
const TYPE_TONE: Record<TransactionType, Parameters<typeof Badge>[0]["tone"]> = {
  report: "info",
  concierge: "forest",
  commission: "success",
};

function isThisMonth(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function RevenueStats({ initial }: { initial: Transaction[] }) {
  const [txns, setTxns] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "commission" as TransactionType,
    amount: "",
    name: "",
    property: "",
    status: "expected" as Transaction["status"],
  });

  const month = txns.filter((t) => isThisMonth(t.date));
  const sum = (type: TransactionType) =>
    month.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);
  const count = (type: TransactionType) => month.filter((t) => t.type === type).length;
  const total = sum("report") + sum("concierge") + sum("commission");

  async function addTxn(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !Number(form.amount)) return;
    setSaving(true);
    const res = await fetch("/api/admin/revenue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    setSaving(false);
    if (res.ok) {
      const { transaction } = await res.json();
      setTxns((prev) => [transaction, ...prev]);
      setForm({ ...form, amount: "", name: "", property: "" });
      setAdding(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Reports" value={sum("report")} note={`${count("report")} this month`} />
        <SummaryCard label="Concierge" value={sum("concierge")} note={`${count("concierge")} this month`} />
        <SummaryCard label="Commissions" value={sum("commission")} note="this month" />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <p className="text-sm font-medium text-gray-500">Total this month</p>
        <p className="text-forest-700 mt-1 text-3xl font-medium">{formatINR(total)}</p>
      </div>

      {/* Manual add */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">All transactions</h2>
          <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
            <Plus className="h-4 w-4" /> Add transaction
          </Button>
        </div>

        {adding && (
          <form onSubmit={addTxn} className="mb-3 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-3 lg:grid-cols-6">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}>
              <option value="commission">Commission</option>
              <option value="report">Report</option>
              <option value="concierge">Concierge</option>
            </Select>
            <Input placeholder="Amount" inputMode="numeric" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Input placeholder="Buyer / seller name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Property" value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} />
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Transaction["status"] })}>
              <option value="expected">Expected</option>
              <option value="received">Received</option>
            </Select>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </form>
        )}

        {txns.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-gray-500">
            No transactions yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Property</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {txns.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-3"><Badge tone={TYPE_TONE[t.type]}>{TYPE_LABEL[t.type]}</Badge></td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{t.property || "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(t.date)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={t.status === "received" ? "success" : "warning"} className="capitalize">{t.status}</Badge>
                    </td>
                    <td className="mono px-4 py-3 text-right font-semibold text-gray-900">{formatINR(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-forest-700 mono mt-1 text-2xl font-medium">{formatINR(value)}</p>
      <p className="text-xs text-gray-400">{note}</p>
    </div>
  );
}
