import { PERFORMANCE_TOTAL_FIELDS, type PerformanceMetric, type PerformanceTotals } from "./types.js";

export function sumPerformance(metrics: PerformanceMetric[]): PerformanceTotals {
  const totals: PerformanceTotals = {
    views: 0,
    searches: 0,
    calls: 0,
    websiteClicks: 0,
    directions: 0,
    bookings: 0,
  };

  for (const metric of metrics) {
    for (const field of PERFORMANCE_TOTAL_FIELDS) {
      totals[field] += metric[field];
    }
  }

  return totals;
}

export function filterByDateRange(
  metrics: PerformanceMetric[],
  from: string,
  to: string,
): PerformanceMetric[] {
  return metrics.filter((m) => m.date >= from && m.date <= to);
}

/**
 * Percentage change from `previous` to `current`, rounded to one decimal.
 * Returns null when there is no baseline to compare against (previous === 0)
 * instead of Infinity/NaN, which would otherwise leak into report rendering.
 */
export function percentChange(previous: number, current: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export interface MonthOverMonth {
  current: PerformanceTotals;
  previous: PerformanceTotals;
  changePercent: Partial<Record<keyof PerformanceTotals, number | null>>;
}

export function compareMonthOverMonth(
  currentMonth: PerformanceMetric[],
  previousMonth: PerformanceMetric[],
): MonthOverMonth {
  const current = sumPerformance(currentMonth);
  const previous = sumPerformance(previousMonth);

  const changePercent: MonthOverMonth["changePercent"] = {};
  for (const field of PERFORMANCE_TOTAL_FIELDS) {
    changePercent[field] = percentChange(previous[field], current[field]);
  }

  return { current, previous, changePercent };
}
