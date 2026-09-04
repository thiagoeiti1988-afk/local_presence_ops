import type { MonthlyReport } from "./types.js";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function listItems(items: string[]): string {
  if (items.length === 0) return "<li>None</li>";
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
}

/**
 * Plain, dependency-free HTML render. Good enough to email or print to PDF
 * with a headless browser later (see docs/DEPLOYMENT.md) — kept intentionally
 * simple per KISS/YAGNI, no PDF generation dependency added for the MVP.
 */
export function renderMonthlyReportHtml(report: MonthlyReport): string {
  const changeLabel =
    report.scoreChange === null
      ? "—"
      : report.scoreChange >= 0
        ? `+${report.scoreChange}`
        : `${report.scoreChange}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Monthly Report — ${escapeHtml(report.locationName)}</title>
</head>
<body>
  <h1>${escapeHtml(report.locationName)} — Monthly Report</h1>
  <p>${escapeHtml(report.periodStart)} to ${escapeHtml(report.periodEnd)}</p>
  <p>${escapeHtml(report.summary)}</p>

  <h2>Local Presence Score</h2>
  <p>${report.score}/100 (${changeLabel})</p>

  <h2>Reviews</h2>
  <ul>
    <li>New this month: ${report.reviews.totalThisMonth}</li>
    <li>Average rating: ${report.reviews.averageRating ?? "—"}</li>
    <li>Unanswered: ${report.reviews.unansweredReviews}</li>
  </ul>

  <h2>Performance</h2>
  <ul>
    <li>Views: ${report.performance.totals.views}</li>
    <li>Searches: ${report.performance.totals.searches}</li>
    <li>Calls: ${report.performance.totals.calls}</li>
    <li>Website clicks: ${report.performance.totals.websiteClicks}</li>
    <li>Directions: ${report.performance.totals.directions}</li>
    <li>Bookings: ${report.performance.totals.bookings}</li>
  </ul>

  <h2>Completed actions</h2>
  <ul>${listItems(report.completedActions)}</ul>

  <h2>Open issues</h2>
  <ul>${listItems(report.openIssues)}</ul>

  <h2>Recommendations</h2>
  <ul>${listItems(report.recommendations)}</ul>
</body>
</html>`;
}
