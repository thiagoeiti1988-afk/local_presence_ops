import type { ReviewSentiment } from "./types.js";

/**
 * Deterministic, rating-based classification. This intentionally does not
 * call any ContentProvider/LLM — sentiment gates the approval workflow
 * (see workflow.ts) and must not depend on an external, non-deterministic
 * service.
 */
export function classifyReview(rating: number): ReviewSentiment {
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
}
