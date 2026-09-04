import { describe, expect, it } from "vitest";
import { assertSingleTenant, locationSchema } from "./location.js";

const CLIENT_A = "11111111-1111-1111-1111-111111111111";
const CLIENT_B = "22222222-2222-2222-2222-222222222222";

function baseLocation(overrides: Record<string, unknown> = {}) {
  return {
    id: "33333333-3333-3333-3333-333333333333",
    clientId: CLIENT_A,
    name: "Clínica Odonto Vale",
    address: "Rua das Flores, 100",
    city: "Vale Verde",
    region: "SP",
    country: "BR",
    phone: "+55 11 90000-0000",
    website: "https://odontovale.example.com",
    googleProfileUrl: "https://g.page/odontovale",
    primaryCategory: "Dentist",
    secondaryCategories: ["Cosmetic dentist"],
    openingHours: null,
    bookingUrl: null,
    status: "active",
    ...overrides,
  };
}

describe("locationSchema", () => {
  it("accepts a well-formed location", () => {
    const result = locationSchema.parse(baseLocation());
    expect(result.city).toBe("Vale Verde");
    expect(result.website).toBe("https://odontovale.example.com/");
  });

  it("requires a two-letter country code", () => {
    expect(() => locationSchema.parse(baseLocation({ country: "Brazil" }))).toThrow();
  });

  it("strips an unsafe website URL down to null instead of throwing", () => {
    const result = locationSchema.parse(
      baseLocation({ website: "javascript:alert(1)" }),
    );
    expect(result.website).toBeNull();
  });

  it("defaults status to onboarding when omitted", () => {
    const { status: _status, ...withoutStatus } = baseLocation();
    const result = locationSchema.parse(withoutStatus);
    expect(result.status).toBe("onboarding");
  });

  it("rejects a missing required field", () => {
    const { name: _name, ...withoutName } = baseLocation();
    expect(() => locationSchema.parse(withoutName)).toThrow();
  });
});

describe("assertSingleTenant", () => {
  it("passes when every record belongs to the expected client", () => {
    const records = [
      { clientId: CLIENT_A, id: "1" },
      { clientId: CLIENT_A, id: "2" },
    ];
    expect(() => assertSingleTenant(records, CLIENT_A)).not.toThrow();
  });

  it("throws when a record from another tenant leaks in", () => {
    const records = [
      { clientId: CLIENT_A, id: "1" },
      { clientId: CLIENT_B, id: "2" },
    ];
    expect(() => assertSingleTenant(records, CLIENT_A)).toThrow(
      /Tenant isolation violation/,
    );
  });
});
