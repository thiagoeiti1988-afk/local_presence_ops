import type { Review } from "@local-presence-ops/reviews";
import type { LocalPostType } from "./post-types.js";

export interface DraftPostInput {
  businessName: string;
  type: LocalPostType;
  topic: string;
}

export interface DraftedPost {
  title: string;
  body: string;
  cta: string | null;
}

export interface ReviewsSummary {
  totalReviews: number;
  averageRating: number | null;
  topPositiveThemes: string[];
  topNegativeThemes: string[];
}

/**
 * Content generation is behind this interface so the rest of the system
 * never depends on a specific LLM. Draft output is always non-published —
 * publishing still goes through the review/post approval workflow.
 */
export interface ContentProvider {
  draftReviewReply(review: Review): Promise<string>;
  draftPost(input: DraftPostInput): Promise<DraftedPost>;
  summarizeReviews(reviews: Review[]): Promise<ReviewsSummary>;
}
