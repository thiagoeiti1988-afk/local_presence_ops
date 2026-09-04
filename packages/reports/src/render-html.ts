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
  if (items.length === 0) return "<li>Nenhum</li>";
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
}

/**
 * Plain, dependency-free HTML render, styled for print/PDF (see
 * apps/web/app/dashboard/report/pdf/route.ts, which prints this exact
 * markup to PDF with a headless browser) as well as for on-screen viewing
 * or email. No client-side JS or external assets — everything a PDF
 * renderer needs is inline.
 */
export function renderMonthlyReportHtml(report: MonthlyReport): string {
  const changeLabel =
    report.scoreChange === null
      ? "—"
      : report.scoreChange >= 0
        ? `+${report.scoreChange}`
        : `${report.scoreChange}`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Relatório mensal — ${escapeHtml(report.locationName)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; max-width: 720px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.5; }
  h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
  h2 { font-size: 1.1rem; margin-top: 2rem; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; }
  .period { color: #555; margin-top: 0; }
  .score { font-size: 2.5rem; font-weight: bold; margin: 0.25rem 0; }
  .change { font-size: 1rem; color: #555; }
  ul { padding-left: 1.25rem; }
  li { margin-bottom: 0.35rem; }
</style>
</head>
<body>
  <h1>${escapeHtml(report.locationName)} — Relatório mensal</h1>
  <p class="period">${escapeHtml(report.periodStart)} a ${escapeHtml(report.periodEnd)}</p>
  <p>${escapeHtml(report.summary)}</p>

  <h2>Local Presence Score</h2>
  <p class="score">${report.score}<span class="change">/100 (${changeLabel})</span></p>

  <h2>Avaliações</h2>
  <ul>
    <li>Novas neste período: ${report.reviews.totalThisMonth}</li>
    <li>Nota média: ${report.reviews.averageRating ?? "—"}</li>
    <li>Sem resposta: ${report.reviews.unansweredReviews}</li>
  </ul>

  <h2>Desempenho</h2>
  <ul>
    <li>Visualizações: ${report.performance.totals.views}</li>
    <li>Buscas: ${report.performance.totals.searches}</li>
    <li>Ligações: ${report.performance.totals.calls}</li>
    <li>Cliques no site: ${report.performance.totals.websiteClicks}</li>
    <li>Pedidos de rota: ${report.performance.totals.directions}</li>
    <li>Agendamentos: ${report.performance.totals.bookings}</li>
  </ul>

  <h2>Ações concluídas</h2>
  <ul>${listItems(report.completedActions)}</ul>

  <h2>Pendências</h2>
  <ul>${listItems(report.openIssues)}</ul>

  <h2>Recomendações</h2>
  <ul>${listItems(report.recommendations)}</ul>
</body>
</html>`;
}
