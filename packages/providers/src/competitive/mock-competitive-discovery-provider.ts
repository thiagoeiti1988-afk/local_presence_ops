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
        name: "Clínica Sorriso Feliz",
        category: "Dentista",
        distanceKm: 0.8,
        reviewCount: 142,
        averageRating: 4.7,
      },
      {
        name: "Odontologia Vale Verde",
        category: "Dentista",
        distanceKm: 1.3,
        reviewCount: 61,
        averageRating: 4.1,
      },
      {
        name: "Espaço Dental Premium",
        category: "Dentista",
        distanceKm: 2.4,
        reviewCount: 209,
        averageRating: 4.8,
      },
    ]);
  }
}
