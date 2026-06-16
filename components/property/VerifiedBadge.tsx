import { ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import type { VerificationStatus } from "@/types/property";

/**
 * The verified badge — the single most important pixel in the product.
 * Solid brand green with white text, used on every verified property.
 */
export function VerifiedBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/30">
        <ShieldCheck size={12} /> Verified by miestate
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/30">
        <AlertTriangle size={12} /> Partial check
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-700/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
      <Clock size={12} /> Pending
    </span>
  );
}

export const VERIFIED_TOOLTIP =
  "Independently verified by miestate: title documents, encumbrance certificate, RERA registration, and fair market pricing.";
