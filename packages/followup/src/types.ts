import { z } from "zod";

/**
 * Fixed T+0 / T+24h / T+72h cadence, adapted from the lead_rescuer project's
 * follow-up engine. Per-client configurable offsets are a real feature
 * lead_rescuer already has — deliberately not copied here yet (YAGNI): this
 * package ships the fixed default first, and only grows a config surface
 * once a real client asks for a different cadence.
 */
export const FOLLOW_UP_OFFSETS_HOURS = [0, 24, 72] as const;
export type FollowUpOffsetHours = (typeof FOLLOW_UP_OFFSETS_HOURS)[number];

export const followUpStepStatusSchema = z.enum(["pending", "due", "sent", "skipped"]);
export type FollowUpStepStatus = z.infer<typeof followUpStepStatusSchema>;

export interface FollowUpStep {
  offsetHours: FollowUpOffsetHours;
  dueAt: string; // ISO
  status: FollowUpStepStatus;
}

export const leadStatusSchema = z.enum(["new", "contacted", "qualified", "lost"]);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export type UrgencyBucket = "overdue" | "dueSoon" | "scheduled" | "done";
