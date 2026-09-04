import type { Location } from "@local-presence-ops/profiles";
import type { LocalPost, NewLocalPost } from "@local-presence-ops/content";
import type { Review } from "@local-presence-ops/reviews";
import type { BusinessProfileProvider } from "./business-profile-provider.js";
import type { PerformanceSnapshot } from "./types.js";

export interface GoogleBusinessProfileCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

/**
 * Skeleton only. Every method throws until real Google Business Profile API
 * access is granted, the OAuth flow is implemented, and this class is filled
 * in — see docs/GOOGLE_API.md for the access request process. Constructing
 * this class never requires real credentials, so the rest of the app can
 * reference the type without forcing anyone to have a Google Cloud project.
 */
export class GoogleBusinessProfileProvider implements BusinessProfileProvider {
  constructor(private readonly credentials?: GoogleBusinessProfileCredentials) {}

  private notImplemented<T>(method: string): Promise<T> {
    return Promise.reject(
      new Error(
        `GoogleBusinessProfileProvider.${method} is not implemented yet. ` +
          "Use MockBusinessProfileProvider or ManualBusinessProfileProvider, " +
          "or implement this method once Google API access is granted " +
          "(see docs/GOOGLE_API.md).",
      ),
    );
  }

  getLocation(_locationId: string): Promise<Location> {
    return this.notImplemented("getLocation");
  }

  getReviews(_locationId: string): Promise<Review[]> {
    return this.notImplemented("getReviews");
  }

  replyToReview(_reviewId: string, _reply: string): Promise<void> {
    return this.notImplemented("replyToReview");
  }

  getPerformance(
    _locationId: string,
    _from: string,
    _to: string,
  ): Promise<PerformanceSnapshot[]> {
    return this.notImplemented("getPerformance");
  }

  createPost(_post: NewLocalPost): Promise<LocalPost> {
    return this.notImplemented("createPost");
  }

  updateLocation(_location: Location): Promise<Location> {
    return this.notImplemented("updateLocation");
  }
}
