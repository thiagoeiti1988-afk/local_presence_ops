import type { Location } from "@local-presence-ops/profiles";
import type { LocalPost, NewLocalPost } from "@local-presence-ops/content";
import type { Review } from "@local-presence-ops/reviews";
import type { BusinessProfileProvider } from "./business-profile-provider.js";
import type { PerformanceSnapshot } from "./types.js";

export interface ManualDataStore {
  getLocation(locationId: string): Promise<Location>;
  getReviews(locationId: string): Promise<Review[]>;
  saveReply(reviewId: string, reply: string): Promise<void>;
  getPerformance(
    locationId: string,
    from: string,
    to: string,
  ): Promise<PerformanceSnapshot[]>;
  savePost(post: NewLocalPost): Promise<LocalPost>;
  saveLocation(location: Location): Promise<Location>;
}

/**
 * Backs every operation with whatever the operator entered by hand in the
 * dashboard (Supabase in production, the demo store locally) instead of a
 * live Google API call. This is the default provider for the MVP — see
 * docs/GOOGLE_API.md for why the Google API is not required to ship.
 */
export class ManualBusinessProfileProvider implements BusinessProfileProvider {
  constructor(private readonly store: ManualDataStore) {}

  getLocation(locationId: string): Promise<Location> {
    return this.store.getLocation(locationId);
  }

  getReviews(locationId: string): Promise<Review[]> {
    return this.store.getReviews(locationId);
  }

  replyToReview(reviewId: string, reply: string): Promise<void> {
    return this.store.saveReply(reviewId, reply);
  }

  getPerformance(
    locationId: string,
    from: string,
    to: string,
  ): Promise<PerformanceSnapshot[]> {
    return this.store.getPerformance(locationId, from, to);
  }

  createPost(post: NewLocalPost): Promise<LocalPost> {
    return this.store.savePost(post);
  }

  updateLocation(location: Location): Promise<Location> {
    return this.store.saveLocation(location);
  }
}
