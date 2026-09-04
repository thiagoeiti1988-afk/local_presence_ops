import type { LocalPresenceAudit } from "@local-presence-ops/audit";
import type { MonthOverMonth } from "@local-presence-ops/analytics";
import type { MonthlyReport, ReviewsSummaryForReport } from "./types.js";

export interface GenerateReportInput {
  locationId: string;
  locationName: string;
  periodStart: string;
  periodEnd: string;
  audit: LocalPresenceAudit;
  previousScore: number | null;
  reviews: ReviewsSummaryForReport;
  performance: MonthOverMonth;
  completedActions: string[];
}

function buildRecommendations(audit: LocalPresenceAudit): string[] {
  return Object.values(audit.sections)
    .flatMap((section) => section.items)
    .filter((item) => item.status !== "pass")
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))
    .slice(0, 5)
    .map((item) => item.recommendedAction);
}

function buildOpenIssues(audit: LocalPresenceAudit): string[] {
  return Object.values(audit.sections)
    .flatMap((section) => section.items)
    .filter((item) => item.status === "fail")
    .map((item) => `${item.label}: ${item.description}`);
}

function severityRank(severity: "low" | "medium" | "high"): number {
  return { low: 0, medium: 1, high: 2 }[severity];
}

function buildSummary(input: GenerateReportInput): string {
  const change =
    input.previousScore === null
      ? "Esta é a primeira nota registrada."
      : `A nota foi de ${input.previousScore} para ${input.audit.score} desde o mês passado.`;

  return `O Local Presence Score de ${input.locationName} é ${input.audit.score}/100. ${change} ${input.reviews.unansweredReviews} avaliação(ões) ainda precisam de resposta.`;
}

export function generateMonthlyReport(input: GenerateReportInput): MonthlyReport {
  const scoreChange =
    input.previousScore === null ? null : input.audit.score - input.previousScore;

  return {
    locationId: input.locationId,
    locationName: input.locationName,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    summary: buildSummary(input),
    score: input.audit.score,
    scoreChange,
    reviews: input.reviews,
    performance: {
      totals: input.performance.current,
      changePercent: input.performance.changePercent,
    },
    completedActions: input.completedActions,
    openIssues: buildOpenIssues(input.audit),
    recommendations: buildRecommendations(input.audit),
    audit: input.audit,
  };
}
