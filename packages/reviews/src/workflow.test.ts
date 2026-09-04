import { describe, expect, it } from "vitest";
import { classifyReview } from "./classify.js";
import {
  approveReply,
  draftReply,
  publishReply,
  ReviewWorkflowError,
} from "./workflow.js";
import type { Review } from "./types.js";

function makeReview(overrides: Partial<Review> = {}): Review {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    locationId: "22222222-2222-2222-2222-222222222222",
    externalId: null,
    author: "Jane Doe",
    rating: 2,
    comment: "Waited 40 minutes past my appointment.",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    reply: null,
    replyStatus: "none",
    status: "new",
    ...overrides,
  };
}

describe("classifyReview", () => {
  it("classifies 4-5 stars as positive", () => {
    expect(classifyReview(5)).toBe("positive");
    expect(classifyReview(4)).toBe("positive");
  });

  it("classifies 3 stars as neutral", () => {
    expect(classifyReview(3)).toBe("neutral");
  });

  it("classifies 1-2 stars as negative", () => {
    expect(classifyReview(2)).toBe("negative");
    expect(classifyReview(1)).toBe("negative");
  });
});

describe("review workflow — negative review approval requirement", () => {
  it("never allows a negative review to publish without approval", () => {
    const review = draftReply(makeReview({ rating: 1 }), "We're sorry to hear that.");
    expect(() => publishReply(review)).toThrow(ReviewWorkflowError);
    expect(() => publishReply(review)).toThrow(/human approval/);
  });

  it("allows publishing only after explicit human approval", () => {
    let review = makeReview({ rating: 1 });
    review = draftReply(review, "We're sorry to hear that — please call us.");
    review = approveReply(review, "manager-42");
    review = publishReply(review);

    expect(review.status).toBe("replied");
    expect(review.replyStatus).toBe("published");
  });

  it("rejects approval without an approver id, even for positive reviews", () => {
    let review = makeReview({ rating: 5, comment: "Loved it!" });
    review = draftReply(review, "Thank you so much!");
    expect(() => approveReply(review, "")).toThrow(ReviewWorkflowError);
  });

  it("refuses to approve a review with no drafted reply", () => {
    const review = makeReview({ status: "drafted", reply: null });
    expect(() => approveReply(review, "manager-42")).toThrow(
      /no drafted reply/,
    );
  });

  it("refuses to publish a reply that skipped approval, positive or not", () => {
    let review = makeReview({ rating: 5 });
    review = draftReply(review, "Thanks!");
    expect(() => publishReply(review)).toThrow(ReviewWorkflowError);
  });

  it("rejects an invalid state transition", () => {
    const review = makeReview({ status: "replied" });
    expect(() => draftReply(review, "too late")).toThrow(ReviewWorkflowError);
  });
});
