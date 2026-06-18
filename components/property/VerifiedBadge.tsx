import { ShieldCheck } from "lucide-react";

/**
 * The verified badge, the single most important pixel in the product.
 * Solid brand gold with white text, shown on every independently-checked project.
 */
export function VerifiedBadge({ verified = true }: { verified?: boolean }) {
  if (!verified) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/30">
      <ShieldCheck size={12} /> Verified by MI Estate
    </span>
  );
}

export const VERIFIED_TOOLTIP =
  "Independently checked by MI Estate: RERA registration, title & ownership, plan sanctions and bank approvals, verified before we recommend it.";
