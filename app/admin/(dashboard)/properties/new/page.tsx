import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/properties"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-forest-700"
      >
        <ArrowLeft className="h-4 w-4" /> Properties
      </Link>
      <h1 className="font-display text-2xl font-bold text-gray-900">
        Add property
      </h1>
      <PropertyForm />
    </div>
  );
}
