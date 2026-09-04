import { describe, expect, it, vi } from "vitest";
import { GooglePlacesCompetitiveDiscoveryProvider } from "./google-places-competitive-discovery-provider.js";

const LOCATION = {
  latitude: -23.5505,
  longitude: -46.6333,
  primaryCategory: "Dentist",
};

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("GooglePlacesCompetitiveDiscoveryProvider", () => {
  it("maps a successful Places API response into CompetitorSummary[]", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        status: "OK",
        results: [
          {
            name: "Clínica Sorriso Feliz",
            rating: 4.6,
            user_ratings_total: 120,
            types: ["dentist", "health"],
            geometry: { location: { lat: -23.555, lng: -46.635 } },
          },
        ],
      }),
    );

    const provider = new GooglePlacesCompetitiveDiscoveryProvider(
      "test-key",
      () => Promise.resolve(LOCATION),
      fetchImpl,
    );

    const results = await provider.findNearbyCompetitors("loc-1", 5);

    expect(results).toHaveLength(1);
    const [competitor] = results;
    expect(competitor).toMatchObject({
      name: "Clínica Sorriso Feliz",
      category: "Dentist",
      reviewCount: 120,
      averageRating: 4.6,
    });
    expect(competitor!.distanceKm).toBeGreaterThan(0);
    expect(competitor!.distanceKm).toBeLessThan(2);

    const requestedUrl = new URL(fetchImpl.mock.calls.at(0)?.[0] as string);
    expect(requestedUrl.searchParams.get("location")).toBe(
      `${LOCATION.latitude},${LOCATION.longitude}`,
    );
    expect(requestedUrl.searchParams.get("radius")).toBe("5000");
    expect(requestedUrl.searchParams.get("key")).toBe("test-key");
  });

  it("clamps the requested radius to the API's 50km maximum", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({ status: "ZERO_RESULTS" }));
    const provider = new GooglePlacesCompetitiveDiscoveryProvider(
      "test-key",
      () => Promise.resolve(LOCATION),
      fetchImpl,
    );

    await provider.findNearbyCompetitors("loc-1", 500);

    const requestedUrl = new URL(fetchImpl.mock.calls.at(0)?.[0] as string);
    expect(requestedUrl.searchParams.get("radius")).toBe("50000");
  });

  it("returns an empty list on ZERO_RESULTS rather than throwing", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({ status: "ZERO_RESULTS" }));
    const provider = new GooglePlacesCompetitiveDiscoveryProvider(
      "test-key",
      () => Promise.resolve(LOCATION),
      fetchImpl,
    );

    await expect(provider.findNearbyCompetitors("loc-1", 5)).resolves.toEqual(
      [],
    );
  });

  it("rejects when the location has no coordinates on file", async () => {
    const provider = new GooglePlacesCompetitiveDiscoveryProvider(
      "test-key",
      () => Promise.resolve(null),
      vi.fn(),
    );

    await expect(provider.findNearbyCompetitors("loc-1", 5)).rejects.toThrow(
      /not found/,
    );
  });

  it("rejects when the Places API returns an error status", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        status: "REQUEST_DENIED",
        error_message: "The provided API key is invalid.",
      }),
    );
    const provider = new GooglePlacesCompetitiveDiscoveryProvider(
      "test-key",
      () => Promise.resolve(LOCATION),
      fetchImpl,
    );

    await expect(provider.findNearbyCompetitors("loc-1", 5)).rejects.toThrow(
      /REQUEST_DENIED/,
    );
  });

  it("rejects on a non-OK HTTP response", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({}, false, 500));
    const provider = new GooglePlacesCompetitiveDiscoveryProvider(
      "test-key",
      () => Promise.resolve(LOCATION),
      fetchImpl,
    );

    await expect(provider.findNearbyCompetitors("loc-1", 5)).rejects.toThrow(
      /HTTP 500/,
    );
  });

  it("rejects on a malformed response shape", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(jsonResponse({ unexpected: true }));
    const provider = new GooglePlacesCompetitiveDiscoveryProvider(
      "test-key",
      () => Promise.resolve(LOCATION),
      fetchImpl,
    );

    await expect(provider.findNearbyCompetitors("loc-1", 5)).rejects.toThrow(
      /unexpected response shape/,
    );
  });
});
