import { z } from "zod";
import type {
  CompetitiveDiscoveryProvider,
  CompetitorSummary,
} from "./competitive-discovery-provider.js";

export interface CompetitiveDiscoveryLocation {
  latitude: number;
  longitude: number;
  primaryCategory: string;
}

export type LocationLookup = (
  locationId: string,
) => Promise<CompetitiveDiscoveryLocation | null>;

const placesResponseSchema = z.object({
  status: z.string(),
  error_message: z.string().optional(),
  results: z
    .array(
      z.object({
        name: z.string(),
        rating: z.number().nullable().optional(),
        user_ratings_total: z.number().nullable().optional(),
        types: z.array(z.string()).optional(),
        geometry: z.object({
          location: z.object({ lat: z.number(), lng: z.number() }),
        }),
      }),
    )
    .optional(),
});

const EARTH_RADIUS_KM = 6371;
const MAX_RESULTS = 10;
// Google's Nearby Search (Legacy) caps the radius parameter at 50 km.
const MAX_RADIUS_METERS = 50_000;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversineDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinLng * sinLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

function humanizeType(type: string | undefined, fallback: string): string {
  if (!type) return fallback;
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Real implementation ("Farol") backed by the Google Places API's Nearby
 * Search endpoint — unlike GoogleBusinessProfileProvider, this needs no
 * manual Google access request, only an API key with Places API enabled and
 * billing configured on the Google Cloud project (see docs/COMPETITIVE.md).
 *
 * Requires the location's coordinates (`latitude`/`longitude` on
 * `Location`, see packages/profiles) — `locationLookup` resolves those from
 * wherever the caller stores them (Supabase once connected; the demo
 * repository in the meantime). A location with no coordinates on file
 * rejects rather than silently returning no results, so a missing
 * geocode isn't mistaken for "no competitors nearby".
 */
export class GooglePlacesCompetitiveDiscoveryProvider
  implements CompetitiveDiscoveryProvider
{
  constructor(
    private readonly apiKey: string,
    private readonly locationLookup: LocationLookup,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async findNearbyCompetitors(
    locationId: string,
    radiusKm: number,
  ): Promise<CompetitorSummary[]> {
    const location = await this.locationLookup(locationId);
    if (!location) {
      throw new Error(
        `GooglePlacesCompetitiveDiscoveryProvider: location ${locationId} not found.`,
      );
    }

    const radiusMeters = Math.min(
      Math.max(1, Math.round(radiusKm * 1000)),
      MAX_RADIUS_METERS,
    );
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    );
    url.searchParams.set(
      "location",
      `${location.latitude},${location.longitude}`,
    );
    url.searchParams.set("radius", String(radiusMeters));
    url.searchParams.set("keyword", location.primaryCategory);
    url.searchParams.set("key", this.apiKey);

    const response = await this.fetchImpl(url.toString());
    if (!response.ok) {
      throw new Error(
        `GooglePlacesCompetitiveDiscoveryProvider: request failed with HTTP ${response.status}.`,
      );
    }

    const parsed = placesResponseSchema.safeParse(await response.json());
    if (!parsed.success) {
      throw new Error(
        "GooglePlacesCompetitiveDiscoveryProvider: unexpected response shape from the Places API.",
      );
    }

    const { status, error_message: errorMessage, results = [] } = parsed.data;
    if (status !== "OK" && status !== "ZERO_RESULTS") {
      throw new Error(
        `GooglePlacesCompetitiveDiscoveryProvider: Places API returned ${status}${
          errorMessage ? ` — ${errorMessage}` : ""
        }.`,
      );
    }

    const origin = { lat: location.latitude, lng: location.longitude };
    return results.slice(0, MAX_RESULTS).map((result) => ({
      name: result.name,
      category: humanizeType(result.types?.[0], location.primaryCategory),
      distanceKm:
        Math.round(haversineDistanceKm(origin, result.geometry.location) * 10) /
        10,
      reviewCount: result.user_ratings_total ?? null,
      averageRating: result.rating ?? null,
    }));
  }
}
