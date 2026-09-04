import { describe, expect, it } from "vitest";
import {
  compareMonthOverMonth,
  filterByDateRange,
  percentChange,
  sumPerformance,
} from "./aggregate.js";
import type { PerformanceMetric } from "./types.js";

const LOCATION = "11111111-1111-1111-1111-111111111111";

function metric(date: string, overrides: Partial<PerformanceMetric> = {}): PerformanceMetric {
  return {
    locationId: LOCATION,
    date,
    views: 10,
    searches: 5,
    calls: 1,
    websiteClicks: 2,
    directions: 1,
    bookings: 0,
    ...overrides,
  };
}

describe("sumPerformance", () => {
  it("sums every field across metrics", () => {
    const totals = sumPerformance([
      metric("2026-01-01", { calls: 1 }),
      metric("2026-01-02", { calls: 3 }),
    ]);
    expect(totals.calls).toBe(4);
    expect(totals.views).toBe(20);
  });

  it("returns all zeros for an empty list", () => {
    const totals = sumPerformance([]);
    expect(totals.views).toBe(0);
    expect(totals.bookings).toBe(0);
  });
});

describe("filterByDateRange", () => {
  it("keeps only metrics within [from, to] inclusive", () => {
    const metrics = [metric("2026-01-01"), metric("2026-01-15"), metric("2026-02-01")];
    const filtered = filterByDateRange(metrics, "2026-01-01", "2026-01-31");
    expect(filtered).toHaveLength(2);
  });
});

describe("percentChange", () => {
  it("computes a positive percent change", () => {
    expect(percentChange(100, 150)).toBe(50);
  });

  it("computes a negative percent change", () => {
    expect(percentChange(100, 50)).toBe(-50);
  });

  it("returns 0 when both previous and current are 0", () => {
    expect(percentChange(0, 0)).toBe(0);
  });

  it("returns null when there is no baseline but current is nonzero", () => {
    expect(percentChange(0, 10)).toBeNull();
  });
});

describe("compareMonthOverMonth", () => {
  it("aggregates and diffs two periods", () => {
    const previous = [metric("2025-12-01", { calls: 10 })];
    const current = [metric("2026-01-01", { calls: 15 })];
    const result = compareMonthOverMonth(current, previous);
    expect(result.current.calls).toBe(15);
    expect(result.previous.calls).toBe(10);
    expect(result.changePercent.calls).toBe(50);
  });
});
