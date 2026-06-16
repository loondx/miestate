export const SITE = {
  name: "miestate",
  tagline: "Know before you pay the token.",
  description:
    "Get a full property risk report before paying any token amount. Legal check, fair price, builder reputation, delivered in 48 hours.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://miestate.in",
  city: "Bangalore",
} as const;

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

export const TRUST_STATS = {
  propertiesVerified: 47,
  dealsClosedCr: 5,
  turnaroundHours: 48,
} as const;

export const SERVICE_PRICES = {
  report: 4999,
  concierge: 14999,
} as const;

export type ServiceType = "report" | "concierge";

export interface Service {
  type: ServiceType;
  tag: string;
  name: string;
  sub: string;
  includes: string[];
  price: number;
  priceLabel: string;
  priceNote: string;
  cta: string;
}

export const SERVICES: Record<ServiceType, Service> = {
  report: {
    type: "report",
    tag: "Most popular",
    name: "Property risk report",
    sub: "Know every risk before you pay the token amount.",
    includes: [
      "Title & ownership",
      "Encumbrance (15 yr)",
      "Fair price vs locality",
      "Builder reputation",
      "Litigation history",
      "Locality intel",
    ],
    price: SERVICE_PRICES.report,
    priceLabel: "₹4,999",
    priceNote: "Delivered in 48 hours",
    cta: "Get my report →",
  },
  concierge: {
    type: "concierge",
    tag: "Full service",
    name: "Concierge package",
    sub: "Tell us your budget. We handle everything else.",
    includes: [
      "Property shortlisting",
      "Site visits arranged",
      "Legal check",
      "Home loan assistance",
      "Registration support",
    ],
    price: SERVICE_PRICES.concierge,
    priceLabel: "₹14,999",
    priceNote: "One-time flat fee",
    cta: "Start my search →",
  },
};
