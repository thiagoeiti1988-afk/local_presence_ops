import { describe, expect, it } from "vitest";
import { MockBusinessProfileProvider } from "./mock-business-profile-provider.js";
import { GoogleBusinessProfileProvider } from "./google-business-profile-provider.js";
import type { Location } from "@local-presence-ops/profiles";

const LOCATION: Location = {
  id: "11111111-1111-1111-1111-111111111111",
  clientId: "22222222-2222-2222-2222-222222222222",
  name: "Clínica Odonto Vale",
  address: "Rua das Flores, 100",
  city: "Vale Verde",
  region: "SP",
  country: "BR",
  phone: "+55 11 90000-0000",
  website: "https://odontovale.example.com/",
  googleProfileUrl: "https://g.page/odontovale",
  primaryCategory: "Dentist",
  secondaryCategories: [],
  openingHours: null,
  bookingUrl: null,
  latitude: null,
  longitude: null,
  status: "active",
};

describe("MockBusinessProfileProvider", () => {
  it("returns a seeded location", async () => {
    const provider = new MockBusinessProfileProvider();
    provider.seedLocation(LOCATION);
    await expect(provider.getLocation(LOCATION.id)).resolves.toEqual(LOCATION);
  });

  it("throws for a location that was never seeded", async () => {
    const provider = new MockBusinessProfileProvider();
    await expect(provider.getLocation("missing")).rejects.toThrow();
  });
});

describe("GoogleBusinessProfileProvider", () => {
  it("can be constructed without any credentials", () => {
    expect(() => new GoogleBusinessProfileProvider()).not.toThrow();
  });

  it("throws NotImplemented for every method until real API access lands", async () => {
    const provider = new GoogleBusinessProfileProvider();
    await expect(provider.getLocation(LOCATION.id)).rejects.toThrow(
      /not implemented/,
    );
  });
});
