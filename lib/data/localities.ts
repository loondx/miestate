export interface Locality {
  name: string;
  avgPricePerSqft: number;
  corridor: string;
  trending: boolean;
}

export const LOCALITIES: Locality[] = [
  { name: "Whitefield", avgPricePerSqft: 14000, corridor: "East", trending: true },
  { name: "Sarjapur Road", avgPricePerSqft: 12500, corridor: "Southeast", trending: true },
  { name: "HSR Layout", avgPricePerSqft: 13500, corridor: "South", trending: false },
  { name: "Koramangala", avgPricePerSqft: 16000, corridor: "South", trending: false },
  { name: "Electronic City", avgPricePerSqft: 7500, corridor: "South", trending: true },
  { name: "Hebbal", avgPricePerSqft: 11000, corridor: "North", trending: true },
  { name: "Bellandur", avgPricePerSqft: 12000, corridor: "Southeast", trending: false },
  { name: "Marathahalli", avgPricePerSqft: 10500, corridor: "East", trending: false },
  { name: "JP Nagar", avgPricePerSqft: 12000, corridor: "South", trending: false },
  { name: "Yelahanka", avgPricePerSqft: 8500, corridor: "North", trending: true },
  { name: "Bannerghatta Road", avgPricePerSqft: 9500, corridor: "South", trending: false },
  { name: "KR Puram", avgPricePerSqft: 8000, corridor: "East", trending: true },
  { name: "Devanahalli", avgPricePerSqft: 6500, corridor: "North", trending: true },
  { name: "Hennur", avgPricePerSqft: 9000, corridor: "North", trending: true },
];

export function getLocality(name: string): Locality | undefined {
  return LOCALITIES.find((l) => l.name.toLowerCase() === name.toLowerCase());
}

/** Fair-price assessment vs the locality ₹/sqft benchmark. */
export function assessFairPrice(locality: string, pricePerSqft: number) {
  const benchmark = getLocality(locality);
  if (!benchmark) {
    return { verdict: "unknown" as const, deltaPct: 0, benchmark: null };
  }
  const deltaPct = Math.round(
    ((pricePerSqft - benchmark.avgPricePerSqft) / benchmark.avgPricePerSqft) * 100
  );
  let verdict: "below-market" | "fair" | "above-market";
  if (deltaPct <= -5) verdict = "below-market";
  else if (deltaPct >= 8) verdict = "above-market";
  else verdict = "fair";
  return { verdict, deltaPct, benchmark: benchmark.avgPricePerSqft };
}
