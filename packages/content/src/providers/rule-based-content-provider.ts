import { classifyReview, type Review } from "@local-presence-ops/reviews";
import type {
  ContentProvider,
  DraftedPost,
  DraftPostInput,
  ReviewsSummary,
} from "../provider.js";

const REPLY_TEMPLATES = {
  positive: (author: string) =>
    `Thank you so much, ${author}! We're thrilled you had a great experience — we hope to see you again soon.`,
  neutral: (author: string) =>
    `Thanks for the feedback, ${author}. We're always looking to improve — if there's anything specific we can do better, please let us know.`,
  negative: (author: string) =>
    `We're sorry to hear about your experience, ${author}. This isn't the standard we hold ourselves to, and we'd like to make it right — please reach out to us directly so we can help.`,
} as const;

const POST_TEMPLATES: Record<
  DraftPostInput["type"],
  (input: DraftPostInput) => DraftedPost
> = {
  update: (input) => ({
    title: `What's new at ${input.businessName}`,
    body: `We wanted to share an update: ${input.topic}. Come see what's new!`,
    cta: null,
  }),
  offer: (input) => ({
    title: `Special offer: ${input.topic}`,
    body: `For a limited time, ${input.businessName} is offering ${input.topic}. Don't miss out!`,
    cta: "Book now",
  }),
  event: (input) => ({
    title: `You're invited: ${input.topic}`,
    body: `Join us at ${input.businessName} for ${input.topic}. We'd love to see you there!`,
    cta: "Learn more",
  }),
};

/**
 * Template-based generation — no external API call, deterministic given the
 * same input, but not hardcoded like MockContentProvider: templates actually
 * branch on review sentiment / post type.
 */
export class RuleBasedContentProvider implements ContentProvider {
  draftReviewReply(review: Review): Promise<string> {
    const sentiment = classifyReview(review.rating);
    return Promise.resolve(REPLY_TEMPLATES[sentiment](review.author));
  }

  draftPost(input: DraftPostInput): Promise<DraftedPost> {
    return Promise.resolve(POST_TEMPLATES[input.type](input));
  }

  summarizeReviews(reviews: Review[]): Promise<ReviewsSummary> {
    const rated = reviews.filter((r) => typeof r.rating === "number");
    const averageRating =
      rated.length === 0
        ? null
        : rated.reduce((sum, r) => sum + r.rating, 0) / rated.length;

    const positive = reviews.filter((r) => classifyReview(r.rating) === "positive");
    const negative = reviews.filter((r) => classifyReview(r.rating) === "negative");

    return Promise.resolve({
      totalReviews: reviews.length,
      averageRating,
      topPositiveThemes:
        positive.length > 0 ? [`${positive.length} positive review(s)`] : [],
      topNegativeThemes:
        negative.length > 0 ? [`${negative.length} negative review(s)`] : [],
    });
  }
}
