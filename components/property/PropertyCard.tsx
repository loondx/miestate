import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VerifiedBadge } from "./VerifiedBadge";
import { whatsappLink, msgForProperty } from "@/lib/whatsapp";
import { formatINR } from "@/lib/utils";
import { assessFairPrice } from "@/lib/data/localities";
import type { Property } from "@/types/property";

const STATUS_LABEL: Record<Property["status"], string> = {
  available: "Available",
  sold: "Sold",
  negotiating: "Under negotiation",
};

export function PropertyCard({ property: p }: { property: Property }) {
  const ppsf = Math.round(p.price / p.sqftSuperBuiltUp);
  const fair = assessFairPrice(p.locality, ppsf);

  let priceLine: { text: string; tone: string } | null = null;
  if (fair.benchmark) {
    if (fair.verdict === "below-market") {
      priceLine = {
        text: `${formatINR(ppsf)}/sqft · ${Math.abs(fair.deltaPct)}% below market`,
        tone: "text-gold-600",
      };
    } else if (fair.verdict === "above-market") {
      priceLine = {
        text: `${formatINR(ppsf)}/sqft · ${fair.deltaPct}% above locality avg`,
        tone: "text-amber-600",
      };
    } else {
      priceLine = {
        text: `${formatINR(ppsf)}/sqft · within fair range`,
        tone: "text-gray-500",
      };
    }
  }

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
        {/* gradient scrim for badge legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent" />
        <span className="absolute left-2.5 top-2.5">
          <VerifiedBadge status={p.verificationStatus} />
        </span>
        {p.rera && (
          <span className="mono absolute right-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-forest-800 backdrop-blur">
            RERA ✓
          </span>
        )}
        {p.status !== "available" && (
          <span className="absolute bottom-2.5 left-2.5">
            <Badge tone={p.status === "sold" ? "danger" : "warning"}>
              {STATUS_LABEL[p.status]}
            </Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/properties/${p.slug}`}>
          <h3 className="font-display text-lg font-bold text-gray-900 transition-colors group-hover:text-forest-700">
            {p.name}
          </h3>
        </Link>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5" />
          {p.locality} · {p.bhk} BHK · {p.sqftSuperBuiltUp.toLocaleString("en-IN")} sqft
        </p>

        <p className="mt-3 font-display text-xl font-bold text-forest-800">
          {formatINR(p.price)}
        </p>
        {priceLine && (
          <p className={`mt-0.5 text-xs font-medium ${priceLine.tone}`}>
            {priceLine.text}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {p.readyToMove && <Badge tone="forest">Ready to move</Badge>}
          {p.tags.includes("No Litigation") && (
            <Badge tone="success">No litigation</Badge>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
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
