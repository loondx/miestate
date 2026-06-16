import { ShieldCheck, IndianRupee, Clock } from "lucide-react";
import { TRUST_STATS } from "@/lib/config";

const ITEMS = [
  { icon: ShieldCheck, value: `${TRUST_STATS.propertiesVerified}`, label: "properties verified" },
  { icon: IndianRupee, value: `${TRUST_STATS.dealsClosedCr} cr+`, label: "in deals closed" },
  { icon: Clock, value: `${TRUST_STATS.turnaroundHours} hr`, label: "report turnaround" },
];

/**
 * Trust signals at the bottom of the hero (white text on teal).
 * Mobile: 3-up grid. Desktop: spaced row. Iconographic for a premium feel.
 */
export function TrustBar() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-8">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-400 ring-1 ring-white/10">
            <item.icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="leading-tight">
            <span className="block font-display text-lg font-bold text-white">
              {item.value}
            </span>
            <span className="text-[12px] text-white/55">{item.label}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
