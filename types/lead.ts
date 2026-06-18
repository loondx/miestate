export type LeadStatus =
  | "new"
  | "contacted"
  | "site_visit"
  | "negotiating"
  | "closed"
  | "lost";

export type LeadRequirement =
  | "consultation"
  | "site-visit"
  | "brochure"
  | "investment"
  | "callback";

/** What the visitor is trying to do, captured on the quick enquiry form. */
export type LeadIntent = "buy" | "rent" | "sell" | "resale" | "invest";

export const LEAD_INTENT_LABEL: Record<LeadIntent, string> = {
  buy: "Buy a property",
  rent: "Rent a property",
  sell: "Sell my property",
  resale: "Resale / resell",
  invest: "Invest",
};

export type LeadSource =
  | "website"
  | "whatsapp"
  | "referral"
  | "property-page"
  | "lead-magnet"
  | "brochure-gate";

export const LEAD_PIPELINE: LeadStatus[] = [
  "new",
  "contacted",
  "site_visit",
  "negotiating",
  "closed",
  "lost",
];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  site_visit: "Site visit",
  negotiating: "Negotiating",
  closed: "Closed",
  lost: "Lost",
};

export const LEAD_REQUIREMENT_LABEL: Record<LeadRequirement, string> = {
  consultation: "Consultation",
  "site-visit": "Site visit",
  brochure: "Brochure / cost sheet",
  investment: "Investment advice",
  callback: "Callback",
};

export const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  website: "Website",
  whatsapp: "WhatsApp",
  referral: "Referral",
  "property-page": "Property page",
  "lead-magnet": "Lead magnet",
  "brochure-gate": "Brochure download",
};

export interface Lead {
  id: string;
  name: string;
  phone: string;
  requirement: LeadRequirement;
  /** What the visitor wants to do (buy/rent/sell/resale/invest). */
  intent?: LeadIntent;
  source: LeadSource;
  /** Free-text budget band, e.g. "₹1–1.5 Cr". */
  budget?: string;
  status: LeadStatus;
  notes?: string;
  followUpDate?: string;
  propertyInterest?: string;
  createdAt: string;
  updatedAt: string;
}
