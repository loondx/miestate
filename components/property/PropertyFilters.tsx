"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, ShieldCheck } from "lucide-react";
import { PropertyGrid } from "./PropertyGrid";
import { cn } from "@/lib/utils";
import { PROJECT_STATUS_LABEL, type Property, type ProjectStatus } from "@/types/property";

const midPpsf = (p: Property) => (p.pricePerSqftMin + p.pricePerSqftMax) / 2;

/** Build configuration filter options from the real listing data. */
function deriveConfigs(properties: Property[]): string[] {
  const set = new Set<string>();
  for (const p of properties) {
    const hay = `${p.name} ${p.configurations.map((c) => c.label).join(" ")}`;
    for (const c of p.configurations) {
      const m = c.label.match(/(\d+)\s*BHK/i);
      if (m) set.add(`${m[1]} BHK`);
    }
    if (/villa/i.test(hay)) set.add("Villa");
    if (/plot/i.test(hay)) set.add("Plot");
  }
  return Array.from(set).sort((a, b) => {
    const na = parseInt(a), nb = parseInt(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    if (!isNaN(na)) return -1;
    if (!isNaN(nb)) return 1;
    return a.localeCompare(b);
  });
}

/** Does a property match a configuration token like "3 BHK", "Villa", "Plot"? */
function matchesConfig(p: Property, config: string): boolean {
  const hay = `${p.name} ${p.configurations.map((c) => c.label).join(" ")}`;
  if (config === "Villa") return /villa/i.test(hay);
  if (config === "Plot") return /plot/i.test(hay);
  return p.configurations.some((c) => c.label.startsWith(config));
}

type SortKey = "recommended" | "ppsf-asc" | "ppsf-desc" | "newest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Recommended" },
  { key: "ppsf-asc", label: "Price/sqft: low to high" },
  { key: "ppsf-desc", label: "Price/sqft: high to low" },
  { key: "newest", label: "Newest first" },
];

export function PropertyFilters({ properties }: { properties: Property[] }) {
  const [search, setSearch] = useState("");
  const [developer, setDeveloper] = useState<string | null>(null);
  const [corridor, setCorridor] = useState<string | null>(null);
  const [config, setConfig] = useState<string | null>(null);
  const [status, setStatus] = useState<ProjectStatus | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [panelOpen, setPanelOpen] = useState(false);

  const developers = Array.from(new Set(properties.map((p) => p.developer)));
  const corridors = Array.from(new Set(properties.map((p) => p.corridor)));
  const statuses = Array.from(new Set(properties.map((p) => p.status)));
  const configOptions = useMemo(() => deriveConfigs(properties), [properties]);

  function reset() {
    setSearch("");
    setDeveloper(null);
    setCorridor(null);
    setConfig(null);
    setStatus(null);
    setVerifiedOnly(false);
  }

  const activeCount =
    (developer ? 1 : 0) +
    (corridor ? 1 : 0) +
    (config ? 1 : 0) +
    (status ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = properties.filter((p) => {
      if (q && !`${p.name} ${p.locality} ${p.developer}`.toLowerCase().includes(q))
        return false;
      if (developer && p.developer !== developer) return false;
      if (corridor && p.corridor !== corridor) return false;
      if (status && p.status !== status) return false;
      if (verifiedOnly && !p.verified) return false;
      if (config && !matchesConfig(p, config)) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "ppsf-asc") return midPpsf(a) - midPpsf(b);
      if (sort === "ppsf-desc") return midPpsf(b) - midPpsf(a);
      if (sort === "newest") return b.updatedAt.localeCompare(a.updatedAt);
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [properties, search, developer, corridor, config, status, verifiedOnly, sort]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project, developer or locality"
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
          <button
            onClick={() => setVerifiedOnly((v) => !v)}
            aria-pressed={verifiedOnly}
            className={cn(
              "flex h-12 shrink-0 items-center gap-1.5 rounded-xl border px-4 text-sm font-semibold shadow-card transition-all active:scale-95",
              verifiedOnly
                ? "border-forest-700 bg-forest-700 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-forest-600 hover:text-forest-700"
            )}
          >
            <ShieldCheck className="h-4 w-4" /> Verified
          </button>
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

          <div className="relative flex-1 sm:flex-none">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort projects"
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

      {/* Filter panel */}
      <div
        className={cn(
          "mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card lg:block",
          panelOpen ? "block" : "hidden"
        )}
      >
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <Group label="Developer">
            <div className="flex flex-wrap gap-2">
              {developers.map((d) => (
                <Pill key={d} active={developer === d} onClick={() => setDeveloper(developer === d ? null : d)}>
                  {d}
                </Pill>
              ))}
            </div>
          </Group>
          <Group label="Corridor">
            <div className="flex flex-wrap gap-2">
              {corridors.map((c) => (
                <Pill key={c} active={corridor === c} onClick={() => setCorridor(corridor === c ? null : c)}>
                  {c}
                </Pill>
              ))}
            </div>
          </Group>
          <Group label="Configuration">
            <div className="flex flex-wrap gap-2">
              {configOptions.map((c) => (
                <Pill key={c} active={config === c} onClick={() => setConfig(config === c ? null : c)}>
                  {c}
                </Pill>
              ))}
            </div>
          </Group>
          <Group label="Status">
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <Pill key={s} active={status === s} onClick={() => setStatus(status === s ? null : s)}>
                  {PROJECT_STATUS_LABEL[s]}
                </Pill>
              ))}
            </div>
          </Group>
        </div>
      </div>

      {/* Count + active chips */}
      <div className="mb-5 mt-4 flex flex-wrap items-center gap-2">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "project" : "projects"}
        </p>
        {activeCount > 0 && (
          <>
            <span className="text-gray-300">·</span>
            {verifiedOnly && <Chip onRemove={() => setVerifiedOnly(false)}>Verified only</Chip>}
            {developer && <Chip onRemove={() => setDeveloper(null)}>{developer}</Chip>}
            {corridor && <Chip onRemove={() => setCorridor(null)}>{corridor}</Chip>}
            {config && <Chip onRemove={() => setConfig(null)}>{config}</Chip>}
            {status && (
              <Chip onRemove={() => setStatus(null)}>{PROJECT_STATUS_LABEL[status]}</Chip>
            )}
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
          <p className="font-semibold text-gray-800">No projects match your filters.</p>
          <p className="mt-1 text-sm text-gray-500">Try removing a filter or two.</p>
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

/* building blocks */
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
