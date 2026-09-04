import { z } from "zod";

export const performanceMetricSchema = z.object({
  locationId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),

  views: z.number().int().min(0),
  searches: z.number().int().min(0),
  calls: z.number().int().min(0),
  websiteClicks: z.number().int().min(0),
  directions: z.number().int().min(0),
  bookings: z.number().int().min(0),
});

export type PerformanceMetric = z.infer<typeof performanceMetricSchema>;

export const PERFORMANCE_TOTAL_FIELDS = [
  "views",
  "searches",
  "calls",
  "websiteClicks",
  "directions",
  "bookings",
] as const;

export type PerformanceTotals = Record<
  (typeof PERFORMANCE_TOTAL_FIELDS)[number],
  number
>;
