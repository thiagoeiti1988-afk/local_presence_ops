"use server";

import { revalidatePath } from "next/cache";
import { markFollowUpSent, setLeadStatus } from "../../../lib/leads-store";
import type { FollowUpOffsetHours } from "@local-presence-ops/followup";

// Same require-await exemption and reasoning as app/audit/actions.ts —
// Next.js Server Actions must be declared `async` regardless of whether
// they await anything.
export async function confirmFollowUpSent(formData: FormData): Promise<void> {
  const leadId = String(formData.get("leadId") ?? "");
  const offsetHours = Number(formData.get("offsetHours")) as FollowUpOffsetHours;
  if (!leadId) return;
  markFollowUpSent(leadId, offsetHours);
  revalidatePath("/dashboard/leads");
}

export async function markLeadContacted(formData: FormData): Promise<void> {
  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) return;
  setLeadStatus(leadId, "contacted");
  revalidatePath("/dashboard/leads");
}
