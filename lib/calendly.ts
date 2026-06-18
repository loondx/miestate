import { CALENDLY } from "./config";

/**
 * Build a Calendly booking link. Site-visit and consultation CTAs across the
 * site open this directly so visitors can self-schedule a slot.
 *
 * `name` prefills the invitee name field; `context` (e.g. a property + locality)
 * prefills Calendly's first custom question (a1) so Rohit sees what the booking
 * is about.
 */
export function calendlyLink(opts?: {
  event?: string;
  name?: string;
  context?: string;
}): string {
  const event = opts?.event || CALENDLY.events.siteVisit;
  const url = new URL(`https://calendly.com/${CALENDLY.user}/${event}`);
  if (opts?.name) url.searchParams.set("name", opts.name);
  if (opts?.context) {
    // Calendly prefills custom questions via a1/a2…; also pass a readable
    // `location` param the way the brief specified.
    url.searchParams.set("a1", opts.context);
    url.searchParams.set("location", opts.context);
  }
  return url.toString();
}

export const CALENDLY_EVENT = CALENDLY.events;
