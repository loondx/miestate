import { ShieldCheck, Handshake, MapPinned, Headset } from "lucide-react";

/**
 * Trust signals at the bottom of the hero (white text on teal).
 * Advisory positioning, verification, direct network, local expertise, support.
 */
const ITEMS = [
  { icon: ShieldCheck, label: "Verified Listings" },
  { icon: Handshake, label: "Direct Owner & Builder Network" },
  { icon: MapPinned, label: "Local Market Experts" },
  { icon: Headset, label: "End-to-End Assistance" },
];

export function TrustBar() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 sm:gap-3">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-400 ring-1 ring-white/10">
            <item.icon className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
          <span className="text-[13px] font-medium leading-tight text-white/85">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
