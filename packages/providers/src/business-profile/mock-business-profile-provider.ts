import type { Location } from "@local-presence-ops/profiles";
import type { LocalPost, NewLocalPost } from "@local-presence-ops/content";
import type { Review } from "@local-presence-ops/reviews";
import type { BusinessProfileProvider } from "./business-profile-provider.js";
import type { PerformanceSnapshot } from "./types.js";

/**
 * In-memory, seedable provider for tests and local development. No network
 * calls, fully deterministic.
 */
export class MockBusinessProfileProvider implements BusinessProfileProvider {
  private readonly locations = new Map<string, Location>();
  private readonly reviews = new Map<string, Review[]>();
  private readonly performance = new Map<string, PerformanceSnapshot[]>();
  private readonly posts = new Map<string, LocalPost[]>();

  seedLocation(location: Location): void {
    this.locations.set(location.id, location);
  }

  seedReviews(locationId: string, reviews: Review[]): void {
    this.reviews.set(locationId, reviews);
  }

  seedPerformance(locationId: string, snapshots: PerformanceSnapshot[]): void {
    this.performance.set(locationId, snapshots);
  }

  // Not declared `async`: none of these bodies await anything, and wrapping
  // every return in Promise.resolve()/Promise.reject() (rather than just
  // dropping `async`) keeps a thrown error a rejected promise instead of a
  // synchronous throw — the same pitfall documented in
  // google-business-profile-provider.ts.

  getLocation(locationId: string): Promise<Location> {
    const location = this.locations.get(locationId);
    if (!location) {
      return Promise.reject(new Error(`No mock location seeded for ${locationId}`));
    }
    return Promise.resolve(location);
  }

  getReviews(locationId: string): Promise<Review[]> {
    return Promise.resolve(this.reviews.get(locationId) ?? []);
  }

  replyToReview(reviewId: string, reply: string): Promise<void> {
    for (const list of this.reviews.values()) {
      const review = list.find((r) => r.id === reviewId);
      if (review) {
        review.reply = reply;
        review.replyStatus = "published";
        review.status = "replied";
        return Promise.resolve();
      }
    }
    return Promise.reject(new Error(`No mock review found for ${reviewId}`));
  }

  getPerformance(
    locationId: string,
    from: string,
    to: string,
  ): Promise<PerformanceSnapshot[]> {
    const all = this.performance.get(locationId) ?? [];
    return Promise.resolve(
      all.filter((snapshot) => snapshot.date >= from && snapshot.date <= to),
    );
  }

  createPost(post: NewLocalPost): Promise<LocalPost> {
    const created: LocalPost = { id: crypto.randomUUID(), ...post };
    const existing = this.posts.get(post.locationId) ?? [];
    this.posts.set(post.locationId, [...existing, created]);
    return Promise.resolve(created);
  }

  updateLocation(location: Location): Promise<Location> {
    this.locations.set(location.id, location);
    return Promise.resolve(location);
  }
}
