import { renderMonthlyReportHtml } from "@local-presence-ops/reports";
import { getDemoRepository } from "../../../../lib/demo-repository";

// A Route Handler, not a page: it returns the report's raw HTML with no
// dashboard chrome (sidebar/nav), so the browser's own Print → Save as PDF
// produces a clean document with nothing to hide via print CSS. Reuses
// packages/reports' renderer directly so this is byte-identical to the
// HTML report generated for email — no separate print markup to drift.
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const { report } = await getDemoRepository();
  return new Response(renderMonthlyReportHtml(report), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
