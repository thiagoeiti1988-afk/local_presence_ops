import type {
  CompetitiveDiscoveryProvider,
  CompetitorSummary,
} from "./competitive-discovery-provider.js";

export class MockCompetitiveDiscoveryProvider
  implements CompetitiveDiscoveryProvider
{
  findNearbyCompetitors(
    _locationId: string,
    _radiusKm: number,
  ): Promise<CompetitorSummary[]> {
    return Promise.resolve([
      {
        name: "[mock] Competitor A",
        category: "Dentist",
        distanceKm: 1.2,
        reviewCount: 88,
        averageRating: 4.3,
      },
    ]);
  }
}
