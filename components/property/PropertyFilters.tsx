"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { PropertyGrid } from "./PropertyGrid";
import { LOCALITIES } from "@/lib/data/localities";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

const BHK_OPTIONS = [1, 2, 3, 4];
const BUDGETS = [0, 6000000, 8000000, 10000000, 12000000, 15000000, 100000000];
const budgetLabel = (v: number) =>
  v === 0 ? "No min" : v >= 100000000 ? "No max" : `₹${(v / 100000).toFixed(0)}L`;

type StatusFilter = "any" | "ready" | "construction";
type SortKey = "recommended" | "price-asc" | "price-desc" | "newest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "newest", label: "Newest first" },
];

const STATUSES: { key: StatusFilter; label: string }[] = [
  { key: "any", label: "Any" },
  { key: "ready", label: "Ready to move" },
  { key: "construction", label: "Under construction" },
];

export function PropertyFilters({ properties }: { properties: Property[] }) {
  const [search, setSearch] = useState("");
  const [bhk, setBhk] = useState<number | null>(null);
  const [localities, setLocalities] = useState<string[]>([]);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(100000000);
  const [status, setStatus] = useState<StatusFilter>("any");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [panelOpen, setPanelOpen] = useState(false);

  function toggleLocality(name: string) {
    setLocalities((prev) =>
      prev.includes(name) ? prev.filter((l) => l !== name) : [...prev, name]
    );
  }

  function reset() {
    setSearch("");
    setBhk(null);
    setLocalities([]);
    setMinBudget(0);
    setMaxBudget(100000000);
    setStatus("any");
  }

  const activeCount =
    (bhk !== null ? 1 : 0) +
    localities.length +
    (minBudget > 0 ? 1 : 0) +
    (maxBudget < 100000000 ? 1 : 0) +
    (status !== "any" ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = properties.filter((p) => {
      if (q && !`${p.name} ${p.locality}`.toLowerCase().includes(q)) return false;
      if (bhk !== null && (bhk === 4 ? p.bhk < 4 : p.bhk !== bhk)) return false;
      if (localities.length && !localities.includes(p.locality)) return false;
      if (p.price < minBudget || p.price > maxBudget) return false;
      if (status === "ready" && !p.readyToMove) return false;
      if (status === "construction" && p.readyToMove) return false;
      return true;
    });

    const rank = (p: Property) => (p.verificationStatus === "verified" ? 0 : 1);
    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest")
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      // recommended: verified first, then newest
      return rank(a) - rank(b) || +new Date(b.createdAt) - +new Date(a.createdAt);
    });
  }, [properties, search, bhk, localities, minBudget, maxBudget, status, sort]);

  const localityNames = LOCALITIES.map((l) => l.name);

  return (
    <div>
      {/* ── Toolbar: search + sort ── */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project or locality"
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-10 text-[15px] text-gray-900 placeholder:text-gray-400 shadow-card focus:border-forest-600 focus-ring"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-card lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-forest-700 px-1.5 text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort properties"
              className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-9 text-sm font-semibold text-gray-700 shadow-card focus:border-forest-600 focus-ring sm:w-auto"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ── Filter panel ── */}
      <div
        className={cn(
          "mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card lg:block",
          panelOpen ? "block" : "hidden"
        )}
      >
        <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-[auto_auto_1fr] lg:items-start lg:gap-8">
          {/* BHK */}
          <Group label="Configuration">
            <div className="flex gap-2">
              {BHK_OPTIONS.map((n) => (
                <Pill
                  key={n}
                  active={bhk === n}
                  onClick={() => setBhk(bhk === n ? null : n)}
                >
                  {n === 4 ? "4+ BHK" : `${n} BHK`}
                </Pill>
              ))}
            </div>
          </Group>

          {/* Budget */}
          <Group label="Budget">
            <div className="flex items-center gap-2">
              <BudgetSelect
                value={minBudget}
                onChange={setMinBudget}
                options={BUDGETS.slice(0, -1)}
              />
              <span className="text-gray-300">to</span>
              <BudgetSelect
                value={maxBudget}
                onChange={setMaxBudget}
                options={BUDGETS.slice(1)}
              />
            </div>
          </Group>

          {/* Status */}
          <Group label="Availability">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <Pill
                  key={s.key}
                  active={status === s.key}
                  onClick={() => setStatus(s.key)}
                >
                  {s.label}
                </Pill>
              ))}
            </div>
          </Group>
        </div>

        {/* Locality */}
        <div className="border-t border-gray-100 p-5">
          <Group label="Locality">
            <div className="flex flex-wrap gap-2">
              {localityNames.map((name) => {
                const active = localities.includes(name);
                return (
                  <Pill key={name} active={active} onClick={() => toggleLocality(name)}>
                    <MapPin className="h-3 w-3" /> {name}
                  </Pill>
                );
              })}
            </div>
          </Group>
        </div>
      </div>

      {/* ── Active filters + count ── */}
      <div className="mb-5 mt-4 flex flex-wrap items-center gap-2">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{filtered.length}</span>{" "}
          verified {filtered.length === 1 ? "property" : "properties"}
        </p>

        {activeCount > 0 && (
          <>
            <span className="text-gray-300">·</span>
            {bhk !== null && (
              <Chip onRemove={() => setBhk(null)}>{bhk === 4 ? "4+ BHK" : `${bhk} BHK`}</Chip>
            )}
            {status !== "any" && (
              <Chip onRemove={() => setStatus("any")}>
                {STATUSES.find((s) => s.key === status)?.label}
              </Chip>
            )}
            {(minBudget > 0 || maxBudget < 100000000) && (
              <Chip
                onRemove={() => {
                  setMinBudget(0);
                  setMaxBudget(100000000);
                }}
              >
                {budgetLabel(minBudget)} – {budgetLabel(maxBudget)}
              </Chip>
            )}
            {localities.map((l) => (
              <Chip key={l} onRemove={() => toggleLocality(l)}>
                {l}
              </Chip>
            ))}
            <button
              onClick={reset}
              className="ml-1 text-sm font-semibold text-forest-700 hover:underline"
            >
              Clear all
            </button>
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <p className="font-semibold text-gray-800">
            No properties match your filters.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Try widening your budget or removing a locality.
          </p>
          <button
            onClick={reset}
            className="mt-4 inline-flex h-11 items-center rounded-lg bg-forest-700 px-5 text-sm font-semibold text-white shadow-cta active:scale-[0.98]"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <PropertyGrid properties={filtered} />
      )}
    </div>
  );
}

/* ── small building blocks ── */

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[36px] items-center gap-1 rounded-full border px-3.5 text-sm font-medium transition-all active:scale-95",
        active
          ? "border-forest-700 bg-forest-700 text-white shadow-cta"
          : "border-gray-200 bg-white text-gray-600 hover:border-forest-600 hover:text-forest-700"
      )}
    >
      {children}
    </button>
  );
}

function Chip({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 py-1 pl-3 pr-1.5 text-xs font-medium text-forest-700">
      {children}
      <button
        onClick={onRemove}
        aria-label="Remove filter"
        className="flex h-4 w-4 items-center justify-center rounded-full text-forest-600 hover:bg-forest-100"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function BudgetSelect({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (v: number) => void;
  options: number[];
}) {
  return (
    <div className="relative">
      <select
        value={String(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm font-medium text-gray-700 focus:border-forest-600 focus-ring"
      >
        {options.map((v) => (
          <option key={v} value={v}>
            {budgetLabel(v)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}
