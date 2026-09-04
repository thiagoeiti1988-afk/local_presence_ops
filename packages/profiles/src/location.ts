import { z } from "zod";
import { sanitizeUrl } from "@local-presence-ops/config";

const optionalSafeUrl = z
  .string()
  .nullable()
  .optional()
  .default(null)
  .transform((value) => sanitizeUrl(value ?? null));

export const openingHoursSchema = z.record(
  z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  z
    .object({
      open: z.string().regex(/^\d{2}:\d{2}$/),
      close: z.string().regex(/^\d{2}:\d{2}$/),
    })
    .nullable(),
);

export type OpeningHours = z.infer<typeof openingHoursSchema>;

export const locationStatusSchema = z.enum([
  "active",
  "onboarding",
  "paused",
  "archived",
]);

export type LocationStatus = z.infer<typeof locationStatusSchema>;

/**
 * Every entity in this system carries clientId — it is the multi-tenancy
 * boundary enforced both at the application layer (this schema) and in
 * Postgres via RLS (see supabase/migrations and docs/SECURITY.md).
 */
export const locationSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),

  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  country: z.string().length(2, "use an ISO 3166-1 alpha-2 country code"),

  phone: z.string().min(1).nullable().default(null),
  website: optionalSafeUrl,

  googleProfileUrl: optionalSafeUrl,

  // Only needed for GooglePlacesCompetitiveDiscoveryProvider (Nearby Search
  // requires coordinates, not an address string) — null until geocoded or
  // entered manually. See packages/providers/src/competitive/.
  latitude: z.number().min(-90).max(90).nullable().default(null),
  longitude: z.number().min(-180).max(180).nullable().default(null),

  primaryCategory: z.string().min(1),
  secondaryCategories: z.array(z.string().min(1)).default([]),

  openingHours: openingHoursSchema.nullable().default(null),

  bookingUrl: optionalSafeUrl,

  status: locationStatusSchema.default("onboarding"),
});

export type Location = z.infer<typeof locationSchema>;

export const newLocationSchema = locationSchema.omit({ id: true });
export type NewLocation = z.infer<typeof newLocationSchema>;

/**
 * Every list of tenant-scoped records passed between layers should have come
 * from a single clientId. This guard exists so a programming mistake that
 * mixes tenants is caught in the application layer too, not only by RLS.
 */
export function assertSingleTenant<T extends { clientId: string }>(
  records: readonly T[],
  clientId: string,
): void {
  const leaked = records.find((record) => record.clientId !== clientId);
  if (leaked) {
    throw new Error(
      `Tenant isolation violation: expected clientId ${clientId}, found ${leaked.clientId}`,
    );
  }
}
