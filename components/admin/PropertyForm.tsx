"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { LOCALITIES } from "@/lib/data/localities";
import { slugify } from "@/lib/utils";
import { PROPERTY_TAGS } from "@/types/property";
import type { Property, LocalitySentimentData } from "@/types/property";

const SENTIMENT_OPTIONS = {
  water: ["good", "average", "poor"],
  power: ["good", "average", "poor"],
  commute: ["easy", "moderate", "heavy"],
  delivery: ["fast", "normal"],
} as const;

type FormState = Omit<Property, "id" | "createdAt" | "updatedAt" | "slug"> & {
  slug: string;
};

function initial(p?: Property): FormState {
  return {
    slug: p?.slug ?? "",
    name: p?.name ?? "",
    locality: p?.locality ?? LOCALITIES[0].name,
    type: p?.type ?? "flat",
    bhk: p?.bhk ?? 2,
    bathrooms: p?.bathrooms ?? 2,
    sqftSuperBuiltUp: p?.sqftSuperBuiltUp ?? 1000,
    sqftCarpet: p?.sqftCarpet ?? 750,
    floor: p?.floor ?? 1,
    totalFloors: p?.totalFloors ?? 10,
    facing: p?.facing ?? "East",
    ageYears: p?.ageYears ?? "new",
    price: p?.price ?? 7500000,
    maintenance: p?.maintenance ?? 3000,
    rera: p?.rera ?? "",
    status: p?.status ?? "available",
    furnishing: p?.furnishing ?? "semi",
    readyToMove: p?.readyToMove ?? true,
    deliveryDate: p?.deliveryDate ?? "",
    description: p?.description ?? "",
    verificationStatus: p?.verificationStatus ?? "pending",
    verificationNotes: p?.verificationNotes ?? "",
    photos: p?.photos ?? [],
    tags: p?.tags ?? [],
    locality_sentiment:
      p?.locality_sentiment ??
      ({ water: "good", power: "good", commute: "moderate", delivery: "normal" } as LocalitySentimentData),
  };
}

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const [f, setF] = useState<FormState>(initial(property));
  const [slugEdited, setSlugEdited] = useState(Boolean(property));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(property);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  function onName(value: string) {
    setF((prev) => ({
      ...prev,
      name: value,
      slug: slugEdited ? prev.slug : slugify(value),
    }));
  }

  function toggleTag(tag: string) {
    set(
      "tags",
      f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag]
    );
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
      deliveryDate: f.readyToMove ? undefined : f.deliveryDate || undefined,
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
          <Field label="Property name">
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
          <Field label="Locality">
            <Select value={f.locality} onChange={(e) => set("locality", e.target.value)}>
              {LOCALITIES.map((l) => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Type">
            <Select value={f.type} onChange={(e) => set("type", e.target.value as FormState["type"])}>
              <option value="flat">Flat</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
            </Select>
          </Field>
          <Field label="BHK">
            <Input type="number" min={1} value={f.bhk} onChange={(e) => set("bhk", Number(e.target.value))} />
          </Field>
          <Field label="Bathrooms">
            <Input type="number" min={1} value={f.bathrooms} onChange={(e) => set("bathrooms", Number(e.target.value))} />
          </Field>
          <Field label="Super built-up (sqft)">
            <Input type="number" value={f.sqftSuperBuiltUp} onChange={(e) => set("sqftSuperBuiltUp", Number(e.target.value))} />
          </Field>
          <Field label="Carpet area (sqft)">
            <Input type="number" value={f.sqftCarpet} onChange={(e) => set("sqftCarpet", Number(e.target.value))} />
          </Field>
          <Field label="Floor">
            <Input type="number" value={f.floor} onChange={(e) => set("floor", Number(e.target.value))} />
          </Field>
          <Field label="Total floors">
            <Input type="number" value={f.totalFloors} onChange={(e) => set("totalFloors", Number(e.target.value))} />
          </Field>
          <Field label="Facing">
            <Input value={f.facing} onChange={(e) => set("facing", e.target.value)} />
          </Field>
          <Field label="Age (years, or 'new')">
            <Input
              value={String(f.ageYears)}
              onChange={(e) => {
                const v = e.target.value.trim();
                set("ageYears", v === "new" || v === "" ? "new" : Number(v));
              }}
            />
          </Field>
          <Field label="Price (₹)">
            <Input type="number" value={f.price} onChange={(e) => set("price", Number(e.target.value))} />
          </Field>
          <Field label="Monthly maintenance (₹)">
            <Input type="number" value={f.maintenance} onChange={(e) => set("maintenance", Number(e.target.value))} />
          </Field>
          <Field label="RERA number">
            <Input value={f.rera} onChange={(e) => set("rera", e.target.value)} required />
          </Field>
          <Field label="Status">
            <Select value={f.status} onChange={(e) => set("status", e.target.value as FormState["status"])}>
              <option value="available">Available</option>
              <option value="negotiating">Under negotiation</option>
              <option value="sold">Sold</option>
            </Select>
          </Field>
          <Field label="Furnishing">
            <Select value={f.furnishing} onChange={(e) => set("furnishing", e.target.value as FormState["furnishing"])}>
              <option value="full">Fully furnished</option>
              <option value="semi">Semi furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </Select>
          </Field>
          <Field label="Ready to move">
            <Select
              value={f.readyToMove ? "yes" : "no"}
              onChange={(e) => set("readyToMove", e.target.value === "yes")}
            >
              <option value="yes">Yes</option>
              <option value="no">No, under construction</option>
            </Select>
          </Field>
          {!f.readyToMove && (
            <Field label="Delivery date">
              <Input type="date" value={f.deliveryDate ?? ""} onChange={(e) => set("deliveryDate", e.target.value)} />
            </Field>
          )}
        </div>
      </Section>

      <Section title="Verification">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Verification status">
            <Select value={f.verificationStatus} onChange={(e) => set("verificationStatus", e.target.value as FormState["verificationStatus"])}>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="verified">Verified</option>
            </Select>
          </Field>
        </div>
        <Field label="Verification notes (internal, not shown to buyers)">
          <Textarea value={f.verificationNotes ?? ""} onChange={(e) => set("verificationNotes", e.target.value)} />
        </Field>
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
      </Section>

      <Section title="Description">
        <Textarea value={f.description} onChange={(e) => set("description", e.target.value)} />
      </Section>

      <Section title="Locality sentiment">
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(SENTIMENT_OPTIONS) as (keyof typeof SENTIMENT_OPTIONS)[]).map((k) => (
            <Field key={k} label={k}>
              <Select
                value={f.locality_sentiment[k]}
                onChange={(e) =>
                  set("locality_sentiment", { ...f.locality_sentiment, [k]: e.target.value })
                }
              >
                {SENTIMENT_OPTIONS[k].map((opt) => (
                  <option key={opt} value={opt} className="capitalize">{opt}</option>
                ))}
              </Select>
            </Field>
          ))}
        </div>
      </Section>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-gray-50 py-4">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Save changes" : "Add property"}
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
      <Label className="capitalize">{label}</Label>
      {children}
    </div>
  );
}
