import { WHATSAPP_NUMBER } from "./config";

/** Build a wa.me deep link with a pre-filled, context-aware message. */
export function whatsappLink(message: string): string {
  const num = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export const WA = {
  home: "Hi miestate, I want to buy a property in Bangalore. Can you help?",
  properties:
    "Hi miestate, I'm browsing your verified properties. Can we talk?",
  services:
    "Hi miestate, I'd like to know more about the Property Risk Report.",
  contact: "Hi miestate, I have an enquiry.",
} as const;

export function msgForProperty(name: string, locality: string): string {
  return `Hi miestate, I'm interested in ${name} in ${locality}. Can I get a risk report?`;
}
