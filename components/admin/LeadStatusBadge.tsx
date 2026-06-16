import { Badge } from "@/components/ui/Badge";
import { LEAD_STATUS_LABEL, type LeadStatus } from "@/types/lead";

const TONE: Record<LeadStatus, Parameters<typeof Badge>[0]["tone"]> = {
  new: "info",
  contacted: "neutral",
  site_visit: "warning",
  negotiating: "warning",
  closed: "success",
  lost: "danger",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge tone={TONE[status]}>{LEAD_STATUS_LABEL[status]}</Badge>;
}
