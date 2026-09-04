import { z } from "zod";

export const reviewStatusSchema = z.enum([
  "new",
  "drafted",
  "approved",
  "replied",
  "escalated",
]);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

export const reviewSentimentSchema = z.enum(["positive", "neutral", "negative"]);
export type ReviewSentiment = z.infer<typeof reviewSentimentSchema>;

export const replyStatusSchema = z.enum(["none", "drafted", "approved", "published"]);
export type ReplyStatus = z.infer<typeof replyStatusSchema>;

export const reviewSchema = z.object({
  id: z.string().uuid(),
  locationId: z.string().uuid(),
  externalId: z.string().min(1).nullable().default(null),

  author: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable().default(null),

  createdAt: z.coerce.date(),

  reply: z.string().nullable().default(null),
  replyStatus: replyStatusSchema.default("none"),

  status: reviewStatusSchema.default("new"),
});

export type Review = z.infer<typeof reviewSchema>;

export const newReviewSchema = reviewSchema.omit({ id: true });
export type NewReview = z.infer<typeof newReviewSchema>;
