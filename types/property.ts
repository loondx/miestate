/**
 * miestate models curated *new-launch / under-construction* projects from
 * trusted developers (Godrej, Sobha, Mana …), not individual resale flats.
 * The exported name stays `Property` to keep imports stable across the app.
 */

export type ProjectStatus =
  | "pre-launch"
  | "new-launch"
  | "under-construction"
  | "ready-to-move";

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  "pre-launch": "Pre-Launch",
  "new-launch": "New Launch",
  "under-construction": "Under Construction",
  "ready-to-move": "Ready to Move",
};

export interface ReraEntry {
  /** e.g. "Phase 1", optional for single-phase or "approved, number on request". */
  phase?: string;
  /** RERA number, or a short status like "Approved, number on request". */
  number: string;
}

export interface Configuration {
  /** e.g. "2 BHK", "3 BHK 2T". */
  label: string;
  phase?: string;
  /** Short typology highlight. */
  note?: string;
}

export interface LocationGroup {
  /** e.g. "IT Hubs", "Schools", "Hospitals", "Transit", "Daily Life". */
  category: string;
  items: string[];
}

export interface AmenityGroup {
  /** e.g. "Clubhouse & Indoor", "Sports & Outdoor", "Nature", "Core Systems". */
  group: string;
  items: string[];
}

export interface SpecItem {
  label: string;
  body: string;
}

export interface LegalItem {
  label: string;
  body: string;
}

/** Tags surfaced as quick trust chips on cards. */
export const PROPERTY_TAGS = [
  "RERA Registered",
  "Clear Title",
  "Bank Approved",
  "Direct Developer",
  "Verified Project",
] as const;

export type PropertyTag = (typeof PROPERTY_TAGS)[number];

export interface Property {
  id: string;
  slug: string;
  name: string;
  developer: string;
  locality: string;
  /** Growth corridor used for filtering + investment context. */
  corridor: string;
  status: ProjectStatus;
  featured: boolean;
  /** Independently checked by miestate (RERA, title, approvals). */
  verified: boolean;

  // Pricing
  pricePerSqftMin: number;
  pricePerSqftMax: number;
  /** Card headline price, e.g. "₹1.05 Cr onwards". */
  priceFromLabel: string;
  /** One-line investment blurb for the card. */
  investmentSummary: string;

  // Quick facts
  landAcres?: number;
  openSpacePct?: number;
  totalUnits?: number;
  /** e.g. "G+27", "3B+G+33". */
  floorsLabel?: string;
  /** Free-text possession line, e.g. "Phase 1: late 2027". */
  possession: string;
  configurations: Configuration[];
  rera: ReraEntry[];

  // Advisory content
  description: string;
  whyThisProperty: string[];
  idealFor: string[];
  locationAdvantages: LocationGroup[];
  amenities: AmenityGroup[];
  specifications: SpecItem[];
  legal: LegalItem[];

  // Media
  photos: string[];
  /** Brochure / cost-sheet link, delivered only after lead capture. */
  brochureUrl?: string;

  tags: string[];
  createdAt: string;
  updatedAt: string;
}
