import {
  FOLLOW_UP_OFFSETS_HOURS,
  type FollowUpOffsetHours,
  type FollowUpStep,
  type LeadStatus,
  type UrgencyBucket,
} from "./types.js";

const HOUR_MS = 60 * 60 * 1000;
const DUE_SOON_WINDOW_HOURS = 24;

/**
 * Builds the T+0/T+24h/T+72h schedule for a lead. `sentOffsets` marks which
 * steps a human already confirmed as sent (see docs/WHATSAPP.md — there is
 * no delivery webhook in the manual/wa.me mode, so "sent" is a human
 * confirmation, not a system-verified delivery).
 */
export function buildFollowUpSchedule(
  createdAt: Date,
  sentOffsets: readonly FollowUpOffsetHours[] = [],
  now: Date = new Date(),
): FollowUpStep[] {
  const sent = new Set(sentOffsets);
  return FOLLOW_UP_OFFSETS_HOURS.map((offsetHours) => {
    const dueAt = new Date(createdAt.getTime() + offsetHours * HOUR_MS);
    const status = sent.has(offsetHours)
      ? "sent"
      : dueAt.getTime() <= now.getTime()
        ? "due"
        : "pending";
    return { offsetHours, dueAt: dueAt.toISOString(), status };
  });
}

/** The next step that still needs a human action, or null if all are sent. */
export function nextActionableStep(schedule: FollowUpStep[]): FollowUpStep | null {
  return schedule.find((step) => step.status === "due" || step.status === "pending") ?? null;
}

/**
 * Where a lead sits in the "fila urgente" — mirrors lead_rescuer's
 * OVERDUE / NEXT 24H dashboard grouping. A lead already marked contacted,
 * qualified, or lost is always "done", regardless of schedule — a human
 * decision overrides the clock.
 */
export function urgencyOf(
  schedule: FollowUpStep[],
  leadStatus: LeadStatus,
  now: Date = new Date(),
): UrgencyBucket {
  if (leadStatus !== "new") return "done";

  const next = nextActionableStep(schedule);
  if (!next) return "done";

  const dueAt = new Date(next.dueAt).getTime();
  if (dueAt <= now.getTime()) return "overdue";
  if (dueAt - now.getTime() <= DUE_SOON_WINDOW_HOURS * HOUR_MS) return "dueSoon";
  return "scheduled";
}
