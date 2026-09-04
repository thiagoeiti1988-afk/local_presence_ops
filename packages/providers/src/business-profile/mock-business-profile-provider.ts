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

  async getLocation(locationId: string): Promise<Location> {
    const location = this.locations.get(locationId);
    if (!location) throw new Error(`No mock location seeded for ${locationId}`);
    return location;
  }

  async getReviews(locationId: string): Promise<Review[]> {
    return this.reviews.get(locationId) ?? [];
  }

  async replyToReview(reviewId: string, reply: string): Promise<void> {
    for (const list of this.reviews.values()) {
      const review = list.find((r) => r.id === reviewId);
      if (review) {
        review.reply = reply;
        review.replyStatus = "published";
        review.status = "replied";
        return;
      }
    }
    throw new Error(`No mock review found for ${reviewId}`);
  }

  async getPerformance(
    locationId: string,
    from: string,
    to: string,
  ): Promise<PerformanceSnapshot[]> {
    const all = this.performance.get(locationId) ?? [];
    return all.filter((snapshot) => snapshot.date >= from && snapshot.date <= to);
  }

  async createPost(post: NewLocalPost): Promise<LocalPost> {
    const created: LocalPost = { id: crypto.randomUUID(), ...post };
    const existing = this.posts.get(post.locationId) ?? [];
    this.posts.set(post.locationId, [...existing, created]);
    return created;
  }

  async updateLocation(location: Location): Promise<Location> {
    this.locations.set(location.id, location);
    return location;
  }
}
