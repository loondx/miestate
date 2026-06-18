import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, ArrowRight, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VerifiedBadge } from "./VerifiedBadge";
import { whatsappLink, msgForProperty } from "@/lib/whatsapp";
import { PROJECT_STATUS_LABEL, type Property } from "@/types/property";

const STATUS_TONE: Record<Property["status"], "forest" | "success" | "warning"> = {
  "ready-to-move": "success",
  "under-construction": "forest",
  "new-launch": "warning",
  "pre-launch": "warning",
};

/** Unique configuration labels (e.g. "1, 2 & 3 BHK"). */
function configSummary(p: Property): string {
  const labels = Array.from(new Set(p.configurations.map((c) => c.label)));
  return labels.join(" · ") || "Multiple configs";
}

export function PropertyCard({ property: p }: { property: Property }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-forest-100 hover:shadow-card-hover">
      <Link
        href={`/properties/${p.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gray-100"
      >
        {p.photos[0]?.startsWith("data:") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.photos[0]}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src={p.photos[0]}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent" />
        <span className="absolute left-2.5 top-2.5">
          <VerifiedBadge verified={p.verified} />
        </span>
        <span className="absolute bottom-2.5 left-2.5">
          <Badge tone={STATUS_TONE[p.status]}>
            {PROJECT_STATUS_LABEL[p.status]}
          </Badge>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-forest-600">
          <Building2 className="h-3.5 w-3.5" /> {p.developer}
        </p>
        <Link href={`/properties/${p.slug}`}>
          <h3 className="mt-1 font-display text-lg font-bold text-gray-900 transition-colors group-hover:text-forest-700">
            {p.name}
          </h3>
        </Link>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5" /> {p.locality}
        </p>

        <p className="mt-3 font-display text-lg font-bold text-forest-800">
          {p.priceFromLabel}
        </p>
        <p className="mt-0.5 text-xs font-medium text-gray-500">
          {configSummary(p)}
        </p>

        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-gray-600">
          {p.investmentSummary}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link
            href={`/properties/${p.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-forest-700 px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-cta"
          >
            View details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={whatsappLink(msgForProperty(p.name, p.locality))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp about ${p.name}`}
            className="flex h-10 w-11 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white transition-transform hover:scale-105"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
