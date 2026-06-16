/**
 * Monetization plans from PRD v3.0 — different prepaid vs postpaid options for
 * each audience. These are high-touch, RM-assisted plans, so CTAs route to
 * WhatsApp (brand is WhatsApp-first, and postpaid/percentage plans can't be a
 * simple one-time online charge).
 */

export type PlanIcon = "buyer" | "tenant" | "seller" | "landlord";

export interface PlanOption {
  kind: "Prepaid" | "Postpaid";
  name: string;
  price: string;
  priceSub: string;
  highlight?: boolean;
  tagline: string;
  features: string[];
  /** Pre-filled WhatsApp message for this plan. */
  message: string;
}

export interface AudiencePlan {
  slug: string;
  audience: string;
  who: string;
  icon: PlanIcon;
  options: [PlanOption, PlanOption];
}

export const PLANS: AudiencePlan[] = [
  {
    slug: "buyers",
    audience: "Buyers",
    who: "Buying a home or investment in Bangalore.",
    icon: "buyer",
    options: [
      {
        kind: "Prepaid",
        name: "Prepaid Buyer Plan",
        price: "₹45,000",
        priceSub: "one-time, paid upfront",
        tagline: "A dedicated person to run your whole purchase.",
        features: [
          "Dedicated Relationship Manager",
          "Custom shortlisting to your budget",
          "Site visits scheduled for you",
          "MOU & financial paperwork drafted",
          "Risk report included",
        ],
        message:
          "Hi miestate, I'd like the Prepaid Buyer Plan (₹45,000) with a dedicated RM. Can you help?",
      },
      {
        kind: "Postpaid",
        name: "Postpaid Buyer Plan",
        price: "1%",
        priceSub: "of property value · ₹0 upfront",
        highlight: true,
        tagline: "Pay nothing until you actually buy.",
        features: [
          "Zero upfront commitment",
          "End-to-end purchase tracking",
          "Direct on-site assistance",
          "100% free legal & verification suites",
          "1% charged only after you purchase",
        ],
        message:
          "Hi miestate, I'm interested in the Postpaid Buyer Plan (pay 1% only after I buy). Can you help?",
      },
    ],
  },
  {
    slug: "tenants",
    audience: "Tenants",
    who: "Looking to rent a home.",
    icon: "tenant",
    options: [
      {
        kind: "Prepaid",
        name: "Prepaid Tenant Package",
        price: "₹3,999",
        priceSub: "one-time fixed fee",
        tagline: "Fast access to verified rentals.",
        features: [
          "Automated property matching",
          "Instant access to verified rental database",
          "Self-service rental agreement generation",
          "Immediate platform access",
        ],
        message:
          "Hi miestate, I'd like the Prepaid Tenant Package (₹3,999) to find a rental. Can you help?",
      },
      {
        kind: "Postpaid",
        name: "Postpaid Tenant Package",
        price: "₹9,999",
        priceSub: "only on deal closure · ₹0 upfront",
        highlight: true,
        tagline: "Pay only when you've signed.",
        features: [
          "Zero upfront — pay on success",
          "Activated only when the rental is signed",
          "On-field physical check-ins",
          "Key handover handled for you",
        ],
        message:
          "Hi miestate, I'm interested in the Postpaid Tenant Package (pay ₹9,999 only on closure). Can you help?",
      },
    ],
  },
  {
    slug: "resale-sellers",
    audience: "Resale Sellers",
    who: "Selling a property you own.",
    icon: "seller",
    options: [
      {
        kind: "Prepaid",
        name: "Prepaid Resale Plan",
        price: "₹50,000",
        priceSub: "paid at listing activation",
        tagline: "Flat fee, zero commission, guaranteed window.",
        features: [
          "Assigned Relationship Manager",
          "0% commission on closing",
          "150-day guaranteed sale timeline",
          "5% package refund if unsold by day 151",
        ],
        message:
          "Hi miestate, I'd like the Prepaid Resale Plan (₹50,000) to sell my property. Can you help?",
      },
      {
        kind: "Postpaid",
        name: "Postpaid Resale Plan",
        price: "1%",
        priceSub: "of final property value · ₹0 upfront",
        highlight: true,
        tagline: "Nothing upfront, dedicated field sales team.",
        features: [
          "₹0 upfront (₹2,000 only if you add Assured)",
          "Dedicated end-to-end field sales assistance",
          "90-day guaranteed sale timeline",
          "Fee drops 10% if unsold by day 91",
          "Deducted from the token advance",
        ],
        message:
          "Hi miestate, I'm interested in the Postpaid Resale Plan (pay 1% on sale). Can you help?",
      },
    ],
  },
  {
    slug: "landlords",
    audience: "Landlords",
    who: "Renting out a property.",
    icon: "landlord",
    options: [
      {
        kind: "Prepaid",
        name: "Prepaid Landlord Plan",
        price: "₹10,000",
        priceSub: "one-time fixed cost",
        tagline: "Flat fee, no ongoing commission.",
        features: [
          "0% ongoing commission on closing",
          "45-day tenant sourcing window",
          "4%/month discount if unrented past 45 days",
        ],
        message:
          "Hi miestate, I'd like the Prepaid Landlord Plan (₹10,000) to rent out my property. Can you help?",
      },
      {
        kind: "Postpaid",
        name: "Postpaid Landlord Plan",
        price: "1 month rent",
        priceSub: "success fee · ₹0 upfront",
        highlight: true,
        tagline: "Pay one month's rent only when rented.",
        features: [
          "Zero upfront fee",
          "Success fee = 1 month gross rent",
          "25-day tenant sourcing window",
          "8% discount if unrented past 25 days",
        ],
        message:
          "Hi miestate, I'm interested in the Postpaid Landlord Plan (1 month rent on success). Can you help?",
      },
    ],
  },
];

/** miestate Assured — the 3-month liquidity guarantee, gated by a verification score. */
export const ASSURED = {
  name: "miestate Assured",
  fee: "₹2,000",
  blurb:
    "Activate the 3-Month Liquidity Guarantee. Once your listing reaches a 100% verification score (title deed, EC, RERA, tax clearance), miestate guarantees liquidity within the SLA window.",
  fineprint:
    "One-time, non-refundable Property Verification Charge of ₹2,000, collected at listing to cover manual legal compliance audits.",
  message:
    "Hi miestate, I'd like to activate miestate Assured (₹2,000 verification) for my listing.",
};
