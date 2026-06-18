export const SITE = {
  name: "MI Estate",
  tagline: "Verified Premium Properties. Expert Guidance. Faster Closings.",
  description:
    "MI Estate is a trusted Bengaluru real estate consultancy to buy, rent and resell verified property across Sarjapur Road, Whitefield, KR Puram, Outer Ring Road, Electronic City and North Bangalore. Verified listings, legal verification, home loan assistance and end-to-end guidance, book a free consultation and site visit.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://miestate.co.in",
  city: "Bengaluru",
} as const;

export const CONTACT = {
  phoneDisplay: "+91 99725 04606",
  phoneHref: "+919972504606",
  whatsapp: "919972504606",
  email: "service@miestate.in",
  address: "Sarjapura, Bengaluru, Karnataka 562125",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sarjapura+Bengaluru+Karnataka+562125",
} as const;

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || CONTACT.whatsapp;

/** Direct phone line for the sticky call button / consultant contact. */
export const PHONE_NUMBER =
  process.env.NEXT_PUBLIC_PHONE_NUMBER || CONTACT.phoneHref;

/** The human trust anchor the brand is built around. */
export const CONSULTANT = {
  name: "Rohit Kumar",
  /** Casual first name for inline buttons where the full name reads long. */
  firstName: "Rohit",
  role: "Lead Property Consultant",
  phone: PHONE_NUMBER,
  /** Rohit's direct line, surfaced on the "Meet your advisor" section. */
  phoneDisplay: "+91 75439 15743",
  phoneHref: "+917543915743",
  /** Drop a real headshot at public/rohit.jpg to replace the placeholder. */
  photo: "/rohit.jpg",
  bio: "I help families and investors buy the right home in Bangalore, without the sales pressure. Every project I recommend is RERA-verified, and I stay with you from the first call to the final booking.",
} as const;

/**
 * Calendly scheduling. Site-visit and consultation CTAs open the booking
 * calendar directly so visitors can self-schedule. Set NEXT_PUBLIC_CALENDLY_USER
 * to Rohit's Calendly username.
 */
export const CALENDLY = {
  user: process.env.NEXT_PUBLIC_CALENDLY_USER || "service-miestate",
  events: {
    siteVisit: "30min",
    consultation: "30min",
  },
} as const;

/**
 * Advisory credibility numbers shown across the site.
 * Keep these honest and specific, they do the trust work.
 */
export const TRUST_STATS = {
  propertiesEvaluated: 120,
  consultations: 350,
  transactionsClosed: 40,
  corridorsCovered: 6,
} as const;

/** What MI Estate helps with, surfaced in trust strips and the footer. */
export const SERVICES = [
  "Buying & Resale",
  "Selling & Renting",
  "Legal Verification",
  "Home Loan Assistance",
  "Investment Advisory",
] as const;

/** Corridors we actively cover, surfaced in footer / coverage strips. */
export const CORRIDORS = [
  "Sarjapur Road",
  "Whitefield",
  "KR Puram",
  "Outer Ring Road",
  "Electronic City",
  "Hebbal / North Bangalore",
  "Bannerghatta / Jigani",
] as const;
