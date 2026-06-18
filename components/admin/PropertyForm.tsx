"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { CORRIDORS } from "@/lib/config";
import { slugify } from "@/lib/utils";
import {
  PROPERTY_TAGS,
  PROJECT_STATUS_LABEL,
  type Property,
  type ProjectStatus,
} from "@/types/property";

/* ── line-based parsers / serialisers for the array fields ── */
const lines = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean);

const parseConfigs = (t: string) =>
  lines(t).map((l) => {
    const [label, phase, note] = l.split("|").map((s) => s.trim());
    return { label, phase: phase || undefined, note: note || undefined };
  });
const serConfigs = (a: Property["configurations"]) =>
  a.map((c) => [c.label, c.phase ?? "", c.note ?? ""].join(" | ")).join("\n");

const parseRera = (t: string) =>
  lines(t).map((l) => {
    const parts = l.split("|").map((s) => s.trim());
    return parts.length > 1
      ? { phase: parts[0] || undefined, number: parts[1] }
      : { number: parts[0] };
  });
const serRera = (a: Property["rera"]) =>
  a.map((r) => (r.phase ? `${r.phase} | ${r.number}` : r.number)).join("\n");

const parseGroups = (t: string, key: "category" | "group") =>
  lines(t).map((l) => {
    const [head, rest = ""] = l.split(":");
    return {
      [key]: head.trim(),
      items: rest.split(",").map((s) => s.trim()).filter(Boolean),
    };
  });
const serGroups = (a: { items: string[] }[], key: "category" | "group") =>
  a.map((g: any) => `${g[key]}: ${g.items.join(", ")}`).join("\n");

const parsePairs = (t: string) =>
  lines(t).map((l) => {
    const [label, ...body] = l.split("|");
    return { label: (label || "").trim(), body: body.join("|").trim() };
  });
const serPairs = (a: { label: string; body: string }[]) =>
  a.map((p) => `${p.label} | ${p.body}`).join("\n");

interface Text {
  configurations: string;
  rera: string;
  whyThisProperty: string;
  idealFor: string;
  locationAdvantages: string;
  amenities: string;
  specifications: string;
  legal: string;
}

type Basic = Omit<
  Property,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "configurations"
  | "rera"
  | "whyThisProperty"
  | "idealFor"
  | "locationAdvantages"
  | "amenities"
  | "specifications"
  | "legal"
>;

function initBasic(p?: Property): Basic {
  return {
    slug: p?.slug ?? "",
    name: p?.name ?? "",
    developer: p?.developer ?? "",
    locality: p?.locality ?? "",
    corridor: p?.corridor ?? CORRIDORS[0],
    status: p?.status ?? "under-construction",
    featured: p?.featured ?? true,
    verified: p?.verified ?? true,
    pricePerSqftMin: p?.pricePerSqftMin ?? 10000,
    pricePerSqftMax: p?.pricePerSqftMax ?? 13000,
    priceFromLabel: p?.priceFromLabel ?? "",
    investmentSummary: p?.investmentSummary ?? "",
    landAcres: p?.landAcres,
    openSpacePct: p?.openSpacePct,
    totalUnits: p?.totalUnits,
    floorsLabel: p?.floorsLabel ?? "",
    possession: p?.possession ?? "",
    description: p?.description ?? "",
    photos: p?.photos ?? [],
    brochureUrl: p?.brochureUrl ?? "",
    tags: p?.tags ?? [],
  };
}

function initText(p?: Property): Text {
  return {
    configurations: p ? serConfigs(p.configurations) : "",
    rera: p ? serRera(p.rera) : "",
    whyThisProperty: p ? p.whyThisProperty.join("\n") : "",
    idealFor: p ? p.idealFor.join("\n") : "",
    locationAdvantages: p ? serGroups(p.locationAdvantages, "category") : "",
    amenities: p ? serGroups(p.amenities, "group") : "",
    specifications: p ? serPairs(p.specifications) : "",
    legal: p ? serPairs(p.legal) : "",
  };
}

const STATUS_OPTIONS = Object.keys(PROJECT_STATUS_LABEL) as ProjectStatus[];

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const [f, setF] = useState<Basic>(initBasic(property));
  const [t, setT] = useState<Text>(initText(property));
  const [slugEdited, setSlugEdited] = useState(Boolean(property));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(property);

  function set<K extends keyof Basic>(key: K, value: Basic[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }
  function setText<K extends keyof Text>(key: K, value: string) {
    setT((prev) => ({ ...prev, [key]: value }));
  }
  function onName(value: string) {
    setF((prev) => ({ ...prev, name: value, slug: slugEdited ? prev.slug : slugify(value) }));
  }
  function toggleTag(tag: string) {
    set("tags", f.tags.includes(tag) ? f.tags.filter((x) => x !== tag) : [...f.tags, tag]);
  }

  async function onPhotos(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).slice(0, 8 - f.photos.length);
    const encoded = await Promise.all(
      arr.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.onerror = reject;
            r.readAsDataURL(file);
          })
      )
    );
    set("photos", [...f.photos, ...encoded].slice(0, 8));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...(property ? { id: property.id } : {}),
      ...f,
      brochureUrl: f.brochureUrl || undefined,
      configurations: parseConfigs(t.configurations),
      rera: parseRera(t.rera),
      whyThisProperty: lines(t.whyThisProperty),
      idealFor: lines(t.idealFor),
      locationAdvantages: parseGroups(t.locationAdvantages, "category"),
      amenities: parseGroups(t.amenities, "group"),
      specifications: parsePairs(t.specifications),
      legal: parsePairs(t.legal),
    };
    const res = await fetch(
      isEdit ? `/api/admin/properties/${property!.id}` : "/api/admin/properties",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setSaving(false);
    if (res.ok) {
      router.push("/admin/properties");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Could not save. Check the fields.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project name">
            <Input value={f.name} onChange={(e) => onName(e.target.value)} required />
          </Field>
          <Field label="Slug">
            <Input
              value={f.slug}
              onChange={(e) => {
                setSlugEdited(true);
                set("slug", slugify(e.target.value));
              }}
              required
            />
          </Field>
          <Field label="Developer">
            <Input value={f.developer} onChange={(e) => set("developer", e.target.value)} required />
          </Field>
          <Field label="Locality">
            <Input value={f.locality} onChange={(e) => set("locality", e.target.value)} required />
          </Field>
          <Field label="Corridor">
            <Select value={f.corridor} onChange={(e) => set("corridor", e.target.value)}>
              {CORRIDORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={f.status} onChange={(e) => set("status", e.target.value as ProjectStatus)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Price/sqft min (₹)">
            <Input type="number" value={f.pricePerSqftMin} onChange={(e) => set("pricePerSqftMin", Number(e.target.value))} />
          </Field>
          <Field label="Price/sqft max (₹)">
            <Input type="number" value={f.pricePerSqftMax} onChange={(e) => set("pricePerSqftMax", Number(e.target.value))} />
          </Field>
          <Field label="Price label (card headline)">
            <Input value={f.priceFromLabel} onChange={(e) => set("priceFromLabel", e.target.value)} placeholder="₹11,500 / sq.ft. onwards" required />
          </Field>
          <Field label="Possession">
            <Input value={f.possession} onChange={(e) => set("possession", e.target.value)} placeholder="Phase 1 from late 2027" required />
          </Field>
          <Field label="Structure / floors">
            <Input value={f.floorsLabel ?? ""} onChange={(e) => set("floorsLabel", e.target.value)} placeholder="G+27" />
          </Field>
          <Field label="Land area (acres)">
            <Input type="number" step="0.01" value={f.landAcres ?? ""} onChange={(e) => set("landAcres", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="Open space (%)">
            <Input type="number" value={f.openSpacePct ?? ""} onChange={(e) => set("openSpacePct", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="Total units">
            <Input type="number" value={f.totalUnits ?? ""} onChange={(e) => set("totalUnits", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="Featured on homepage">
            <Select value={f.featured ? "yes" : "no"} onChange={(e) => set("featured", e.target.value === "yes")}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </Field>
          <Field label="Verified by MI Estate">
            <Select value={f.verified ? "yes" : "no"} onChange={(e) => set("verified", e.target.value === "yes")}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </Field>
          <Field label="Brochure URL (Drive link)">
            <Input value={f.brochureUrl ?? ""} onChange={(e) => set("brochureUrl", e.target.value)} placeholder="https://drive.google.com/..." />
          </Field>
        </div>
        <Field label="Investment summary (1 line, shown on card)">
          <Textarea value={f.investmentSummary} onChange={(e) => set("investmentSummary", e.target.value)} required />
        </Field>
        <Field label="Description">
          <Textarea value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </Section>

      <Section title="Configurations & RERA">
        <Field label="Configurations, one per line: label | phase | note">
          <Textarea rows={5} value={t.configurations} onChange={(e) => setText("configurations", e.target.value)} placeholder="2 BHK | Phase 1 | Balanced family layout" />
        </Field>
        <Field label="RERA, one per line: phase | number  (or just number)">
          <Textarea rows={3} value={t.rera} onChange={(e) => setText("rera", e.target.value)} placeholder="Phase 1 | PRM/KA/RERA/..." />
        </Field>
      </Section>

      <Section title="Advisory content">
        <Field label="Why this property, one reason per line">
          <Textarea rows={5} value={t.whyThisProperty} onChange={(e) => setText("whyThisProperty", e.target.value)} />
        </Field>
        <Field label="Ideal for, one audience per line">
          <Textarea rows={4} value={t.idealFor} onChange={(e) => setText("idealFor", e.target.value)} />
        </Field>
        <Field label="Location advantages, one per line: Category: item, item, item">
          <Textarea rows={5} value={t.locationAdvantages} onChange={(e) => setText("locationAdvantages", e.target.value)} placeholder="IT Hubs: ITPL, Hoodi, ORR" />
        </Field>
        <Field label="Amenities, one per line: Group: item, item, item">
          <Textarea rows={5} value={t.amenities} onChange={(e) => setText("amenities", e.target.value)} placeholder="Clubhouse & Indoor: Gym, Pool, Games room" />
        </Field>
        <Field label="Specifications, one per line: Label | body">
          <Textarea rows={4} value={t.specifications} onChange={(e) => setText("specifications", e.target.value)} placeholder="Construction | Monolithic RCC..." />
        </Field>
        <Field label="Legal & due-diligence, one per line: Label | body">
          <Textarea rows={5} value={t.legal} onChange={(e) => setText("legal", e.target.value)} placeholder="RERA Compliance | Registered under Karnataka RERA..." />
        </Field>
      </Section>

      <Section title="Photos (up to 8)">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onPhotos(e.target.files)}
          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-forest-700 file:px-3 file:py-2 file:text-white"
        />
        {f.photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {f.photos.map((src, i) => (
              <div key={i} className="relative h-16 w-24 overflow-hidden rounded-md bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => set("photos", f.photos.filter((_, j) => j !== i))}
                  className="absolute right-0 top-0 bg-black/60 p-0.5 text-white"
                  aria-label="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-gray-400">
          Uploads are stored inline. For hosted images, leave photos empty and paste
          URLs into properties.json directly.
        </p>
      </Section>

      <Section title="Trust tags">
        <Field label="Tags">
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={
                  "rounded-md border px-2.5 py-1 text-xs " +
                  (f.tags.includes(tag)
                    ? "border-forest-700 bg-forest-50 text-forest-700"
                    : "border-gray-300 text-gray-600")
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-gray-50 py-4">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Save changes" : "Add project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/properties")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-4 font-semibold text-gray-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
