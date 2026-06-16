import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getById, FILES } from "@/lib/store";
import { PropertyForm } from "@/components/admin/PropertyForm";
import type { Property } from "@/types/property";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await getById<Property>(FILES.properties, params.id);
  if (!property) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/properties"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-forest-700"
      >
        <ArrowLeft className="h-4 w-4" /> Properties
      </Link>
      <h1 className="font-display text-2xl font-bold text-gray-900">
        Edit · {property.name}
      </h1>
      <PropertyForm property={property} />
    </div>
  );
}
