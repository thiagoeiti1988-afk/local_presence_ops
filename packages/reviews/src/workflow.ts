import type { Review, ReviewSentiment, ReviewStatus } from "./types.js";
import { classifyReview } from "./classify.js";

export class ReviewWorkflowError extends Error {}

const ALLOWED_TRANSITIONS: Record<ReviewStatus, ReviewStatus[]> = {
  new: ["drafted", "escalated"],
  drafted: ["approved", "escalated"],
  approved: ["replied", "escalated"],
  replied: [],
  escalated: ["drafted"],
};

export function canTransition(from: ReviewStatus, to: ReviewStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/**
 * Moves a review to `drafted` with the proposed reply text. Never sets
 * replyStatus beyond "drafted" — publishing requires a separate, explicit
 * human approval step (approveReply) regardless of sentiment.
 */
export function draftReply(review: Review, draft: string): Review {
  if (!canTransition(review.status, "drafted")) {
    throw new ReviewWorkflowError(
      `Cannot draft a reply from status "${review.status}"`,
    );
  }
  return {
    ...review,
    reply: draft,
    replyStatus: "drafted",
    status: "drafted",
  };
}

/**
 * Human-in-the-loop approval gate. This is the ONLY function allowed to move
 * a review into "approved" — publishReply refuses anything that didn't pass
 * through here, and negative reviews are additionally asserted (defense in
 * depth, not just relying on the general state machine).
 */
export function approveReply(review: Review, approvedBy: string): Review {
  if (!approvedBy || approvedBy.trim().length === 0) {
    throw new ReviewWorkflowError("approveReply requires a human approver id");
  }
  if (!canTransition(review.status, "approved")) {
    throw new ReviewWorkflowError(
      `Cannot approve a reply from status "${review.status}"`,
    );
  }
  if (!review.reply) {
    throw new ReviewWorkflowError("Cannot approve a review with no drafted reply");
  }
  return {
    ...review,
    replyStatus: "approved",
    status: "approved",
  };
}

/**
 * Publishes the reply. Throws unless the review already went through
 * approveReply — this is what makes "never auto-publish a negative review"
 * a structural guarantee instead of a convention.
 */
export function publishReply(review: Review): Review {
  const sentiment: ReviewSentiment = classifyReview(review.rating);

  if (review.status !== "approved" || review.replyStatus !== "approved") {
    if (sentiment === "negative") {
      throw new ReviewWorkflowError(
        "Negative reviews require explicit human approval before publishing",
      );
    }
    throw new ReviewWorkflowError(
      `Cannot publish a reply from status "${review.status}"`,
    );
  }

  return {
    ...review,
    status: "replied",
    replyStatus: "published",
  };
}

export function escalate(review: Review): Review {
  if (!canTransition(review.status, "escalated")) {
    throw new ReviewWorkflowError(
      `Cannot escalate a review from status "${review.status}"`,
    );
  }
  return { ...review, status: "escalated" };
}
