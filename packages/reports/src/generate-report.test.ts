import { describe, expect, it } from "vitest";
import { buildAudit } from "@local-presence-ops/audit";
import { generateMonthlyReport } from "./generate-report.js";
import { renderMonthlyReportHtml } from "./render-html.js";

const audit = buildAudit("loc-1", {
  businessName: "Clínica Odonto Vale",
  category: "Dentist",
  address: "Rua das Flores, 100",
  phone: "+55 11 90000-0000",
  website: null,
  openingHoursComplete: false,
  description: null,
  services: null,
  bookingUrl: null,
  photoCount: 2,
  reviewCount: 67,
  averageRating: 4.5,
  unansweredReviews: 12,
  latestPostDaysAgo: 120,
});

describe("generateMonthlyReport", () => {
  it("computes scoreChange relative to the previous score", () => {
    const report = generateMonthlyReport({
      locationId: "loc-1",
      locationName: "Clínica Odonto Vale",
      periodStart: "2026-08-01",
      periodEnd: "2026-08-31",
      audit,
      previousScore: 40,
      reviews: { totalThisMonth: 5, averageRating: 4.5, unansweredReviews: 12 },
      performance: {
        current: {
          views: 100,
          searches: 50,
          calls: 10,
          websiteClicks: 5,
          directions: 3,
          bookings: 1,
        },
        previous: {
          views: 80,
          searches: 40,
          calls: 8,
          websiteClicks: 4,
          directions: 2,
          bookings: 1,
        },
        changePercent: { calls: 25 },
      },
      completedActions: ["Replied to 3 reviews"],
    });

    expect(report.scoreChange).toBe(audit.score - 40);
    expect(report.openIssues.length).toBeGreaterThan(0);
    expect(report.recommendations.length).toBeGreaterThan(0);
    expect(report.recommendations.length).toBeLessThanOrEqual(5);
  });

  it("returns null scoreChange with no previous score", () => {
    const report = generateMonthlyReport({
      locationId: "loc-1",
      locationName: "Clínica Odonto Vale",
      periodStart: "2026-08-01",
      periodEnd: "2026-08-31",
      audit,
      previousScore: null,
      reviews: { totalThisMonth: 0, averageRating: null, unansweredReviews: 0 },
      performance: {
        current: {
          views: 0,
          searches: 0,
          calls: 0,
          websiteClicks: 0,
          directions: 0,
          bookings: 0,
        },
        previous: {
          views: 0,
          searches: 0,
          calls: 0,
          websiteClicks: 0,
          directions: 0,
          bookings: 0,
        },
        changePercent: {},
      },
      completedActions: [],
    });

    expect(report.scoreChange).toBeNull();
  });

  it("renders valid, escaped HTML", () => {
    const report = generateMonthlyReport({
      locationId: "loc-1",
      locationName: "<script>alert(1)</script>",
      periodStart: "2026-08-01",
      periodEnd: "2026-08-31",
      audit,
      previousScore: null,
      reviews: { totalThisMonth: 0, averageRating: null, unansweredReviews: 0 },
      performance: {
        current: {
          views: 0,
          searches: 0,
          calls: 0,
          websiteClicks: 0,
          directions: 0,
          bookings: 0,
        },
        previous: {
          views: 0,
          searches: 0,
          calls: 0,
          websiteClicks: 0,
          directions: 0,
          bookings: 0,
        },
        changePercent: {},
      },
      completedActions: [],
    });

    const html = renderMonthlyReportHtml(report);
    expect(html).toContain("<!doctype html>");
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
