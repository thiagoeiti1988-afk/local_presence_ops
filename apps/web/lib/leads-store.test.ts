import { describe, expect, it } from "vitest";
import { buildAudit } from "@local-presence-ops/audit";
import {
  listLeads,
  recordLead,
  buildLeadFromAudit,
  markFollowUpSent,
  setLeadStatus,
} from "./leads-store";

describe("leads store", () => {
  it("records a lead and lists newest first", () => {
    recordLead({
      businessName: "Padaria Teste A",
      city: "Vale Verde",
      website: null,
      googleProfileUrl: null,
      phone: null,
      score: 40,
    });
    recordLead({
      businessName: "Padaria Teste B",
      city: "Vale Verde",
      website: null,
      googleProfileUrl: null,
      phone: null,
      score: 90,
    });

    const leads = listLeads();
    expect(leads[0]?.businessName).toBe("Padaria Teste B");
    expect(leads.some((l) => l.businessName === "Padaria Teste A")).toBe(true);
  });

  it("defaults a new lead to status 'new' with no follow-ups sent", () => {
    const lead = recordLead({
      businessName: "Padaria Teste C",
      city: "Vale Verde",
      website: null,
      googleProfileUrl: null,
      phone: null,
      score: 50,
    });
    expect(lead.status).toBe("new");
    expect(lead.sentFollowUps).toEqual([]);
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
      phone: "+55 11 90000-0000",
    });

    expect(lead.score).toBe(audit.score);
    expect(lead.businessName).toBe("Clínica Teste");
    expect(lead.phone).toBe("+55 11 90000-0000");
    expect(listLeads()[0]?.id).toBe(lead.id);
  });

  it("marks a follow-up step as sent", () => {
    const lead = recordLead({
      businessName: "Padaria Teste D",
      city: "Vale Verde",
      website: null,
      googleProfileUrl: null,
      phone: null,
      score: 60,
    });
    const updated = markFollowUpSent(lead.id, 0);
    expect(updated?.sentFollowUps).toEqual([0]);
  });

  it("updates a lead's status", () => {
    const lead = recordLead({
      businessName: "Padaria Teste E",
      city: "Vale Verde",
      website: null,
      googleProfileUrl: null,
      phone: null,
      score: 60,
    });
    const updated = setLeadStatus(lead.id, "contacted");
    expect(updated?.status).toBe("contacted");
  });
});
