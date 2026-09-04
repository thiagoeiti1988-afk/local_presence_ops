import type { LocalPresenceAudit } from "@local-presence-ops/audit";
import type { PerformanceTotals } from "@local-presence-ops/analytics";

export interface ReviewsSummaryForReport {
  totalThisMonth: number;
  averageRating: number | null;
  unansweredReviews: number;
}

export interface MonthlyReport {
  locationId: string;
  locationName: string;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD

  summary: string;

  score: number;
  scoreChange: number | null;

  reviews: ReviewsSummaryForReport;
  performance: {
    totals: PerformanceTotals;
    changePercent: Partial<Record<keyof PerformanceTotals, number | null>>;
  };

  completedActions: string[];
  openIssues: string[];
  recommendations: string[];

  audit: LocalPresenceAudit;
}
