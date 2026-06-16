import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { getAll, FILES } from "@/lib/store";
import { ButtonLink } from "@/components/ui/Button";
import { VerifiedBadge } from "@/components/property/VerifiedBadge";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";
import type { Property } from "@/types/property";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<Property["status"], string> = {
  available: "Available",
  sold: "Sold",
  negotiating: "Under negotiation",
};

export default async function AdminPropertiesPage() {
  const properties = await getAll<Property>(FILES.properties);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-500">
            {properties.length} listing{properties.length === 1 ? "" : "s"}
          </p>
        </div>
        <ButtonLink href="/admin/properties/new">
          <Plus className="h-4 w-4" /> Add property
        </ButtonLink>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="font-medium text-gray-700">
            Add your first verified property to start building trust with buyers.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {p.photos[0] &&
                  (p.photos[0].startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.photos[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Image src={p.photos[0]} alt="" fill sizes="80px" className="object-cover" />
                  ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{p.name}</p>
                <p className="text-sm text-gray-500">
                  {p.locality} · {p.bhk} BHK · {formatINR(p.price)}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <VerifiedBadge status={p.verificationStatus} />
                  <Badge
                    tone={p.status === "available" ? "success" : p.status === "sold" ? "danger" : "warning"}
                  >
                    {STATUS_LABEL[p.status]}
                  </Badge>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
                <DeletePropertyButton id={p.id} name={p.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
