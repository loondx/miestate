export type LeadStatus =
  | "new"
  | "contacted"
  | "site_visit"
  | "negotiating"
  | "closed"
  | "lost";

export type LeadRequirement = "buy" | "rent" | "report" | "concierge" | "sell";

export type LeadSource =
  | "whatsapp"
  | "referral"
  | "website"
  | "reddit"
  | "other";

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

export interface Lead {
  id: string;
  name: string;
  phone: string;
  requirement: LeadRequirement;
  source: LeadSource;
  budget?: number;
  locality?: string;
  status: LeadStatus;
  notes?: string;
  followUpDate?: string;
  propertyInterest?: string;
  createdAt: string;
  updatedAt: string;
}
