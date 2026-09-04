import { buildAuditSections, computeOverallScore } from "./scoring.js";
import type { AuditInput, LocalPresenceAudit } from "./types.js";

export function buildAudit(
  locationId: string,
  input: AuditInput,
  now: Date = new Date(),
): LocalPresenceAudit {
  const sections = buildAuditSections(input);
  return {
    locationId,
    generatedAt: now.toISOString(),
    score: computeOverallScore(sections),
    sections,
  };
}
