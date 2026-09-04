export interface CompetitorSummary {
  name: string;
  category: string;
  distanceKm: number | null;
  reviewCount: number | null;
  averageRating: number | null;
}

/**
 * "Farol" — a future feature that discovers nearby competitors for a
 * location. Not wired into any dashboard page yet; only the interface and a
 * mock implementation exist, so a real implementation can be dropped in
 * later without touching call sites.
 */
export interface CompetitiveDiscoveryProvider {
  findNearbyCompetitors(
    locationId: string,
    radiusKm: number,
  ): Promise<CompetitorSummary[]>;
}
