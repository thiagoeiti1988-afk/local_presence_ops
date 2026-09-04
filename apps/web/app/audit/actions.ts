"use server";

import { z } from "zod";
import { buildAudit, type LocalPresenceAudit } from "@local-presence-ops/audit";

const auditFormSchema = z.object({
  businessName: z.string().min(1),
  city: z.string().min(1),
  website: z.string().optional(),
  googleProfileUrl: z.string().optional(),
  category: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  openingHoursComplete: z.enum(["yes", "no"]).optional(),
  description: z.string().optional(),
  services: z.string().optional(),
  bookingUrl: z.string().optional(),
  photoCount: z.coerce.number().int().min(0).optional(),
  reviewCount: z.coerce.number().int().min(0).optional(),
  averageRating: z.coerce.number().min(0).max(5).optional(),
  unansweredReviews: z.coerce.number().int().min(0).optional(),
  latestPostDaysAgo: z.coerce.number().int().min(0).optional(),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

/**
 * Manual-assisted audit: this NEVER scrapes Google — every field comes from
 * whoever is looking at the client's live Google Business Profile and typing
 * in what they see. See docs/GOOGLE_API.md for why.
 */
// Pulled out of the require-await burn-down deliberately: Next.js Server
// Actions must be declared `async` for the framework's compiler to
// recognize and wire them up at all — this isn't the "async with no await"
// pattern the rule is built for, and removing `async` here would break the
// action, not just the lint warning. The rule is turned off for this file
// specifically in eslint.typed.config.mjs, with the same justification.
export async function runManualAudit(
  formData: FormData,
): Promise<{ audit: LocalPresenceAudit; businessName: string } | { error: string }> {
  const raw = Object.fromEntries(
    [
      "businessName",
      "city",
      "website",
      "googleProfileUrl",
      "category",
      "address",
      "phone",
      "openingHoursComplete",
      "description",
      "services",
      "bookingUrl",
      "photoCount",
      "reviewCount",
      "averageRating",
      "unansweredReviews",
      "latestPostDaysAgo",
    ].map((key) => [key, emptyToUndefined(formData.get(key))]),
  );

  const parsed = auditFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const input = parsed.data;

  const audit = buildAudit(`lead-${Date.now()}`, {
    businessName: input.businessName,
    category: input.category ?? null,
    address: input.address ?? null,
    phone: input.phone ?? null,
    website: input.website ?? null,
    openingHoursComplete:
      input.openingHoursComplete === undefined
        ? null
        : input.openingHoursComplete === "yes",
    description: input.description ?? null,
    services: input.services
      ? input.services.split(",").map((s) => s.trim()).filter(Boolean)
      : null,
    bookingUrl: input.bookingUrl ?? null,
    photoCount: input.photoCount ?? null,
    reviewCount: input.reviewCount ?? null,
    averageRating: input.averageRating ?? null,
    unansweredReviews: input.unansweredReviews ?? null,
    latestPostDaysAgo: input.latestPostDaysAgo ?? null,
  });

  return { audit, businessName: input.businessName };
}
