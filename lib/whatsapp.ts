import { WHATSAPP_NUMBER } from "./config";

/** Build a wa.me deep link with a pre-filled, context-aware message. */
export function whatsappLink(message: string): string {
  const num = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export const WA = {
  home: "Hi MI Estate, I'd like guidance on buying a verified property in Bangalore. Can we talk?",
  properties:
    "Hi MI Estate, I'm looking at your handpicked projects. Can you help me shortlist?",
  consultation:
    "Hi MI Estate, I'd like to schedule a free property consultation.",
  siteVisit:
    "Hi MI Estate, I'd like to schedule a site visit for one of your verified projects.",
  contact: "Hi MI Estate, I have an enquiry about your properties.",
} as const;

/** Pre-filled WhatsApp message for a specific project. */
export function msgForProperty(name: string, locality: string): string {
  return `Hi MI Estate, I'm interested in ${name} (${locality}). I'd like a consultation / site visit and the cost sheet.`;
}
