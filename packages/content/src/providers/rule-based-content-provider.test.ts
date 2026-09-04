import { describe, expect, it } from "vitest";
import type { Review } from "@local-presence-ops/reviews";
import { RuleBasedContentProvider } from "./rule-based-content-provider.js";

function makeReview(rating: number, overrides: Partial<Review> = {}): Review {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    locationId: "22222222-2222-2222-2222-222222222222",
    externalId: null,
    author: "Jane Doe",
    rating,
    comment: null,
    createdAt: new Date(),
    reply: null,
    replyStatus: "none",
    status: "new",
    ...overrides,
  };
}

describe("RuleBasedContentProvider", () => {
  const provider = new RuleBasedContentProvider();

  it("drafts an apologetic reply for a negative review", async () => {
    const reply = await provider.draftReviewReply(makeReview(1));
    expect(reply.toLowerCase()).toContain("sorry");
  });

  it("drafts a thankful reply for a positive review", async () => {
    const reply = await provider.draftReviewReply(makeReview(5));
    expect(reply.toLowerCase()).toContain("thank you");
  });

  it("drafts a post with a CTA for offers but not for updates", async () => {
    const offer = await provider.draftPost({
      businessName: "Clínica Odonto Vale",
      type: "offer",
      topic: "10% off cleanings",
    });
    const update = await provider.draftPost({
      businessName: "Clínica Odonto Vale",
      type: "update",
      topic: "new hours",
    });
    expect(offer.cta).toBe("Book now");
    expect(update.cta).toBeNull();
  });

  it("summarizes reviews by sentiment counts", async () => {
    const summary = await provider.summarizeReviews([
      makeReview(5),
      makeReview(5),
      makeReview(1),
    ]);
    expect(summary.totalReviews).toBe(3);
    expect(summary.averageRating).toBeCloseTo((5 + 5 + 1) / 3);
    expect(summary.topPositiveThemes[0]).toContain("2 positive");
    expect(summary.topNegativeThemes[0]).toContain("1 negative");
  });
});
