import { z } from "zod";
import type { ScoreSection } from "@local-presence-ops/config";

export const auditStatusSchema = z.enum(["pass", "warning", "fail"]);
export type AuditStatus = z.infer<typeof auditStatusSchema>;

export const auditSeveritySchema = z.enum(["low", "medium", "high"]);
export type AuditSeverity = z.infer<typeof auditSeveritySchema>;

export interface AuditItem {
  key: string;
  label: string;
  status: AuditStatus;
  severity: AuditSeverity;
  description: string;
  recommendedAction: string;
}

export interface AuditSectionResult {
  section: ScoreSection;
  score: number; // 0-100
  weight: number; // fraction, matches SCORE_WEIGHTS
  items: AuditItem[];
}

export interface LocalPresenceAudit {
  locationId: string;
  generatedAt: string;
  score: number; // 0-100, weighted overall score
  sections: Record<ScoreSection, AuditSectionResult>;
}

/**
 * The observed facts an audit is built from. All fields are optional because
 * the /audit lead magnet is filled manually by whoever is looking at the
 * client's Google Business Profile — see docs/AUDIT_SCORE.md.
 */
export interface AuditInput {
  businessName: string | null;
  category: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  openingHoursComplete: boolean | null;
  description: string | null;
  services: string[] | null;
  bookingUrl: string | null;
  photoCount: number | null;
  reviewCount: number | null;
  averageRating: number | null;
  unansweredReviews: number | null;
  latestPostDaysAgo: number | null;
}
