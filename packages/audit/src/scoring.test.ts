import { describe, expect, it } from "vitest";
import { buildAudit } from "./build-audit.js";
import type { AuditInput } from "./types.js";

const COMPLETE_INPUT: AuditInput = {
  businessName: "Clínica Odonto Vale",
  category: "Dentist",
  address: "Rua das Flores, 100",
  phone: "+55 11 90000-0000",
  website: "https://odontovale.example.com",
  openingHoursComplete: true,
  description: "Full-service dental clinic.",
  services: ["Cleaning", "Whitening"],
  bookingUrl: "https://odontovale.example.com/book",
  photoCount: 15,
  reviewCount: 50,
  averageRating: 4.8,
  unansweredReviews: 0,
  latestPostDaysAgo: 5,
};

const EMPTY_INPUT: AuditInput = {
  businessName: null,
  category: null,
  address: null,
  phone: null,
  website: null,
  openingHoursComplete: null,
  description: null,
  services: null,
  bookingUrl: null,
  photoCount: null,
  reviewCount: null,
  averageRating: null,
  unansweredReviews: null,
  latestPostDaysAgo: null,
};

describe("buildAudit scoring", () => {
  it("scores a fully complete, healthy profile at 100", () => {
    const audit = buildAudit("loc-1", COMPLETE_INPUT);
    expect(audit.score).toBe(100);
    expect(audit.sections.profileCompleteness.score).toBe(100);
    expect(audit.sections.reputation.score).toBe(100);
  });

  it("scores a completely empty profile at 0", () => {
    const audit = buildAudit("loc-1", EMPTY_INPUT);
    expect(audit.score).toBe(0);
  });

  it("is deterministic: same input always yields the same score", () => {
    const first = buildAudit("loc-1", COMPLETE_INPUT).score;
    const second = buildAudit("loc-1", COMPLETE_INPUT).score;
    expect(first).toBe(second);
  });

  it("weights sections per the documented split (35/30/15/20)", () => {
    // Only reputation is healthy; every other section is empty.
    const input: AuditInput = {
      ...EMPTY_INPUT,
      reviewCount: 50,
      averageRating: 5,
      unansweredReviews: 0,
    };
    const audit = buildAudit("loc-1", input);
    // reputation contributes 100 * 0.30 = 30; everything else is 0.
    expect(audit.score).toBe(30);
  });

  it("flags unanswered reviews with high severity when above threshold", () => {
    const audit = buildAudit("loc-1", {
      ...COMPLETE_INPUT,
      unansweredReviews: 12,
    });
    const unanswered = audit.sections.reputation.items.find(
      (i) => i.key === "unansweredReviews",
    );
    expect(unanswered?.status).toBe("fail");
    expect(unanswered?.severity).toBe("high");
  });

  it("never returns a score outside [0, 100]", () => {
    const audit = buildAudit("loc-1", COMPLETE_INPUT);
    expect(audit.score).toBeGreaterThanOrEqual(0);
    expect(audit.score).toBeLessThanOrEqual(100);
  });
});
