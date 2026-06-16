export type VerificationStatus = "pending" | "partial" | "verified";
export type PropertyStatus = "available" | "sold" | "negotiating";

export type SentimentWater = "good" | "average" | "poor";
export type SentimentPower = "good" | "average" | "poor";
export type SentimentCommute = "easy" | "moderate" | "heavy";
export type SentimentDelivery = "fast" | "normal";

export interface LocalitySentimentData {
  water: SentimentWater;
  power: SentimentPower;
  commute: SentimentCommute;
  delivery: SentimentDelivery;
}

export const PROPERTY_TAGS = [
  "Clear Title",
  "No Litigation",
  "RERA Registered",
  "Fair Price",
  "Ready to Move",
] as const;

export type PropertyTag = (typeof PROPERTY_TAGS)[number];

export interface Property {
  id: string;
  slug: string;
  name: string;
  locality: string;
  type: "flat" | "villa" | "plot";
  bhk: number;
  bathrooms: number;
  sqftSuperBuiltUp: number;
  sqftCarpet: number;
  floor: number;
  totalFloors: number;
  facing: string;
  ageYears: number | "new";
  price: number;
  maintenance: number;
  rera: string;
  status: PropertyStatus;
  furnishing: "full" | "semi" | "unfurnished";
  readyToMove: boolean;
  deliveryDate?: string;
  description: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  photos: string[];
  tags: string[];
  locality_sentiment: LocalitySentimentData;
  createdAt: string;
  updatedAt: string;
}
