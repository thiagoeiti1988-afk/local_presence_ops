import { describe, expect, it } from "vitest";
import { buildAudit } from "@local-presence-ops/audit";
import { listLeads, recordLead, buildLeadFromAudit } from "./leads-store";

describe("leads store", () => {
  it("records a lead and lists newest first", () => {
    recordLead({
      businessName: "Padaria Teste A",
      city: "Vale Verde",
      website: null,
      googleProfileUrl: null,
      score: 40,
    });
    recordLead({
      businessName: "Padaria Teste B",
      city: "Vale Verde",
      website: null,
      googleProfileUrl: null,
      score: 90,
    });

    const leads = listLeads();
    expect(leads[0]?.businessName).toBe("Padaria Teste B");
    expect(leads.some((l) => l.businessName === "Padaria Teste A")).toBe(true);
  });

  it("builds a lead from a computed audit", () => {
    const audit = buildAudit("lead-1", {
      businessName: "Clínica Teste",
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
    });

    const lead = buildLeadFromAudit(audit, {
      businessName: "Clínica Teste",
      city: "Vale Verde",
      website: null,
      googleProfileUrl: null,
    });

    expect(lead.score).toBe(audit.score);
    expect(lead.businessName).toBe("Clínica Teste");
    expect(listLeads()[0]?.id).toBe(lead.id);
  });
});
