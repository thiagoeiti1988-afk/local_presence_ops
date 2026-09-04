import { SCORE_WEIGHTS } from "@local-presence-ops/config";
import type {
  AuditInput,
  AuditItem,
  AuditSectionResult,
  AuditStatus,
} from "./types.js";

const STATUS_SCORE: Record<AuditStatus, number> = {
  pass: 100,
  warning: 50,
  fail: 0,
};

function item(
  key: string,
  label: string,
  status: AuditStatus,
  description: string,
  recommendedAction: string,
): AuditItem {
  return {
    key,
    label,
    status,
    severity: status === "fail" ? "high" : status === "warning" ? "medium" : "low",
    description,
    recommendedAction,
  };
}

function presence(
  key: string,
  label: string,
  value: string | null | undefined,
  fixHint: string,
): AuditItem {
  const present = Boolean(value && value.trim().length > 0);
  return item(
    key,
    label,
    present ? "pass" : "fail",
    present ? `${label} is set.` : `${label} is missing.`,
    present ? "No action needed." : fixHint,
  );
}

function profileCompletenessItems(input: AuditInput): AuditItem[] {
  return [
    presence(
      "businessName",
      "Business name",
      input.businessName,
      "Add the exact legal/trading name as it appears on the storefront.",
    ),
    presence(
      "category",
      "Primary category",
      input.category,
      "Set a primary category that matches the main service offered.",
    ),
    presence(
      "address",
      "Address",
      input.address,
      "Add a complete, verifiable street address.",
    ),
    presence(
      "phone",
      "Phone number",
      input.phone,
      "Add a local phone number customers can call directly.",
    ),
    presence(
      "website",
      "Website",
      input.website,
      "Link a working website or booking page.",
    ),
    item(
      "openingHours",
      "Opening hours",
      input.openingHoursComplete === true
        ? "pass"
        : input.openingHoursComplete === false
          ? "fail"
          : "fail",
      input.openingHoursComplete
        ? "Opening hours are complete."
        : "Opening hours are missing or incomplete.",
      input.openingHoursComplete
        ? "No action needed."
        : "Fill in opening hours for every day, including holiday exceptions.",
    ),
    presence(
      "description",
      "Business description",
      input.description,
      "Write a description covering what the business does and who it serves.",
    ),
    item(
      "services",
      "Services listed",
      input.services && input.services.length > 0 ? "pass" : "fail",
      input.services && input.services.length > 0
        ? `${input.services.length} service(s) listed.`
        : "No services listed.",
      "List the specific services offered, not just the category.",
    ),
    item(
      "photos",
      "Photos",
      (input.photoCount ?? 0) >= 10
        ? "pass"
        : (input.photoCount ?? 0) > 0
          ? "warning"
          : "fail",
      `${input.photoCount ?? 0} photo(s) on the profile.`,
      "Add at least 10 recent, real photos of the business, staff, and work.",
    ),
  ];
}

function reputationItems(input: AuditInput): AuditItem[] {
  const reviewCount = input.reviewCount ?? 0;
  const rating = input.averageRating;
  const unanswered = input.unansweredReviews;

  return [
    item(
      "reviewCount",
      "Review volume",
      reviewCount >= 20 ? "pass" : reviewCount >= 5 ? "warning" : "fail",
      `${reviewCount} review(s) collected.`,
      "Ask recent happy customers directly for a review; aim for a steady trickle, not a spike.",
    ),
    item(
      "averageRating",
      "Average rating",
      rating === null || rating === undefined
        ? "fail"
        : rating >= 4.5
          ? "pass"
          : rating >= 3.5
            ? "warning"
            : "fail",
      rating === null || rating === undefined
        ? "No rating available."
        : `Average rating is ${rating.toFixed(1)}.`,
      "Resolve recurring complaints found in reviews before asking for more of them.",
    ),
    item(
      "unansweredReviews",
      "Unanswered reviews",
      // A null/undefined count means "not observed", not "zero unanswered" —
      // only a confirmed 0 counts as a pass.
      unanswered === null || unanswered === undefined
        ? "fail"
        : unanswered === 0
          ? "pass"
          : unanswered <= 5
            ? "warning"
            : "fail",
      unanswered === null || unanswered === undefined
        ? "Unanswered review count not observed."
        : `${unanswered} unanswered review(s).`,
      "Reply to every review, starting with the negative ones (see docs/REVIEWS.md).",
    ),
  ];
}

function contentActivityItems(input: AuditInput): AuditItem[] {
  const days = input.latestPostDaysAgo;
  return [
    item(
      "latestPost",
      "Latest post",
      days === null || days === undefined
        ? "fail"
        : days <= 30
          ? "pass"
          : days <= 90
            ? "warning"
            : "fail",
      days === null || days === undefined
        ? "No posts found."
        : `Last post was ${days} day(s) ago.`,
      "Publish at least one update or offer per month.",
    ),
  ];
}

function conversionReadinessItems(input: AuditInput): AuditItem[] {
  return [
    presence(
      "bookingUrl",
      "Booking link",
      input.bookingUrl,
      "Add a direct booking or scheduling link.",
    ),
    presence(
      "website",
      "Website (conversion path)",
      input.website,
      "Link a website or landing page a customer can act on.",
    ),
    presence(
      "phone",
      "Phone (conversion path)",
      input.phone,
      "Add a phone number so customers can call directly from Search/Maps.",
    ),
  ];
}

function sectionFromItems(
  section: AuditSectionResult["section"],
  items: AuditItem[],
): AuditSectionResult {
  const total = items.reduce((sum, i) => sum + STATUS_SCORE[i.status], 0);
  const score = items.length === 0 ? 0 : Math.round(total / items.length);
  return {
    section,
    score,
    weight: SCORE_WEIGHTS[section],
    items,
  };
}

/**
 * Deterministic scoring: no LLM involved. Every number here is derived from
 * `input` through fixed thresholds — see docs/AUDIT_SCORE.md for the
 * rationale behind each threshold and the section weights.
 */
export function buildAuditSections(
  input: AuditInput,
): LocalPresenceAuditSections {
  return {
    profileCompleteness: sectionFromItems(
      "profileCompleteness",
      profileCompletenessItems(input),
    ),
    reputation: sectionFromItems("reputation", reputationItems(input)),
    contentActivity: sectionFromItems(
      "contentActivity",
      contentActivityItems(input),
    ),
    conversionReadiness: sectionFromItems(
      "conversionReadiness",
      conversionReadinessItems(input),
    ),
  };
}

export type LocalPresenceAuditSections = Record<
  keyof typeof SCORE_WEIGHTS,
  AuditSectionResult
>;

export function computeOverallScore(
  sections: LocalPresenceAuditSections,
): number {
  const weighted = Object.values(sections).reduce(
    (sum, section) => sum + section.score * section.weight,
    0,
  );
  return Math.max(0, Math.min(100, Math.round(weighted)));
}
