import type { Location } from "@local-presence-ops/profiles";
import type { LocalPost, NewLocalPost } from "@local-presence-ops/content";
import type { Review } from "@local-presence-ops/reviews";
import type { PerformanceSnapshot } from "./types.js";

/**
 * The boundary between this codebase and Google Business Profile. The MVP
 * ships with Mock and Manual implementations only — GoogleBusinessProfileProvider
 * is a skeleton (see google-business-profile-provider.ts and
 * docs/GOOGLE_API.md) that throws until real API access is granted and
 * configured. Nothing in the app is allowed to require it at runtime.
 */
export interface BusinessProfileProvider {
  getLocation(locationId: string): Promise<Location>;
  getReviews(locationId: string): Promise<Review[]>;
  replyToReview(reviewId: string, reply: string): Promise<void>;
  getPerformance(
    locationId: string,
    from: string,
    to: string,
  ): Promise<PerformanceSnapshot[]>;
  createPost(post: NewLocalPost): Promise<LocalPost>;
  updateLocation(location: Location): Promise<Location>;
}
