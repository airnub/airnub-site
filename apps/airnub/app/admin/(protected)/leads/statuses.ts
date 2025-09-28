export const LEAD_STATUSES = ["new", "replied", "ignored", "handoff"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  replied: "Replied",
  ignored: "Ignored",
  handoff: "Handoff",
};
