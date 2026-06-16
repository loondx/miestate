import { Droplet, Zap, Car, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocalitySentimentData } from "@/types/property";

type Quality = "good" | "average" | "poor";

function qualityOf(value: string): Quality {
  if (["good", "easy", "fast"].includes(value)) return "good";
  if (["average", "moderate", "normal"].includes(value)) return "average";
  return "poor";
}

const PILL: Record<Quality, string> = {
  good: "bg-forest-100 text-forest-800",
  average: "bg-gold-100 text-gold-600",
  poor: "bg-red-100 text-red-700",
};

const ROWS = [
  { key: "water", label: "Water supply", icon: Droplet },
  { key: "power", label: "Power stability", icon: Zap },
  { key: "commute", label: "Commute to tech park", icon: Car },
  { key: "delivery", label: "Delivery app access", icon: Package },
] as const;

export function LocalitySentiment({
  sentiment,
  asOf = "June 2026",
}: {
  sentiment: LocalitySentimentData;
  asOf?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="font-display text-lg font-semibold text-gray-900">
        Locality reality check
      </h3>
      <div className="mt-4 space-y-3">
        {ROWS.map(({ key, label, icon: Icon }) => {
          const value = sentiment[key];
          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <Icon className="h-4 w-4 text-forest-600" />
                {label}
              </span>
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-xs font-medium capitalize",
                  PILL[qualityOf(value)]
                )}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-gray-400">
        Verified by miestate team · {asOf}
      </p>
    </div>
  );
}
