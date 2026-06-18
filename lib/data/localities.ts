/**
 * Corridor-level market context for the detail-page "Investment Analysis".
 * Figures are indicative 2026 market benchmarks for advisory framing, not a
 * valuation of any individual unit.
 */
export interface CorridorContext {
  corridor: string;
  /** Indicative 2026 average ₹/sqft for new-launch inventory in the corridor. */
  avgPricePerSqft: number;
  /** Indicative annual appreciation potential band, e.g. "12–14%". */
  appreciationBand: string;
  /** One-line driver of demand in the corridor. */
  driver: string;
}

export const CORRIDOR_CONTEXT: CorridorContext[] = [
  {
    corridor: "Sarjapur Road",
    avgPricePerSqft: 12000,
    appreciationBand: "12–14%",
    driver: "IT corridor expansion, ORR access and the upcoming Sarjapur Metro extension.",
  },
  {
    corridor: "Whitefield",
    avgPricePerSqft: 12000,
    appreciationBand: "10–12%",
    driver: "ITPL employment density, Whitefield Metro and mature social infrastructure.",
  },
  {
    corridor: "KR Puram",
    avgPricePerSqft: 11000,
    appreciationBand: "10–12%",
    driver: "Purple Line Metro connectivity and proximity to Whitefield / Manyata hubs.",
  },
  {
    corridor: "Outer Ring Road",
    avgPricePerSqft: 12500,
    appreciationBand: "8–10%",
    driver: "Dense tech-park employment along the ORR commercial stretch.",
  },
  {
    corridor: "Electronic City",
    avgPricePerSqft: 8000,
    appreciationBand: "10–12%",
    driver: "Affordable entry, large IT workforce and improving metro links.",
  },
  {
    corridor: "Hebbal / North Bangalore",
    avgPricePerSqft: 11000,
    appreciationBand: "12–15%",
    driver: "Airport corridor growth, Manyata Tech Park and upcoming infrastructure.",
  },
];

export function getCorridorContext(
  corridor: string
): CorridorContext | undefined {
  return CORRIDOR_CONTEXT.find(
    (c) => c.corridor.toLowerCase() === corridor.toLowerCase()
  );
}
