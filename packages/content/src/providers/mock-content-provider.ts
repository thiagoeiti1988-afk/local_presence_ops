import type { Review } from "@local-presence-ops/reviews";
import type {
  ContentProvider,
  DraftedPost,
  DraftPostInput,
  ReviewsSummary,
} from "../provider.js";

/**
 * Fully deterministic, fixed-output provider. Used in tests and as the
 * default in demo mode — no external calls, no randomness.
 */
export class MockContentProvider implements ContentProvider {
  draftReviewReply(review: Review): Promise<string> {
    return Promise.resolve(
      `Thank you for your feedback, ${review.author}. [mock draft reply]`,
    );
  }

  draftPost(input: DraftPostInput): Promise<DraftedPost> {
    return Promise.resolve({
      title: `[mock] ${input.type} — ${input.topic}`,
      body: `This is a mock ${input.type} post about ${input.topic} for ${input.businessName}.`,
      cta: input.type === "offer" ? "Book now" : null,
    });
  }

  summarizeReviews(reviews: Review[]): Promise<ReviewsSummary> {
    const rated = reviews.filter((r) => typeof r.rating === "number");
    const averageRating =
      rated.length === 0
        ? null
        : rated.reduce((sum, r) => sum + r.rating, 0) / rated.length;

    return Promise.resolve({
      totalReviews: reviews.length,
      averageRating,
      topPositiveThemes: ["[mock] friendly staff"],
      topNegativeThemes: ["[mock] wait times"],
    });
  }
}
