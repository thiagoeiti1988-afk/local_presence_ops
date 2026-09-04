/**
 * Runs the full demo scenario end to end and prints the result to stdout.
 * This is the "create client -> audit -> score -> review drafts -> posts ->
 * report" flow from the Definition of Done, standalone from the Next.js app
 * (which renders the same kind of data for the dashboard/report pages).
 */
import { buildAudit } from "@local-presence-ops/audit";
import {
  compareMonthOverMonth,
  type PerformanceMetric,
} from "@local-presence-ops/analytics";
import { RuleBasedContentProvider } from "@local-presence-ops/content";
import { classifyReview } from "@local-presence-ops/reviews";
import type { Review } from "@local-presence-ops/reviews";
import { generateMonthlyReport } from "@local-presence-ops/reports";
import type { Client, Location } from "@local-presence-ops/profiles";

const client: Client = {
  id: "d3f1c1e0-0000-4000-8000-000000000001",
  name: "Clínica Odonto Vale",
  slug: "clinica-odonto-vale",
  timezone: "America/Sao_Paulo",
  industry: "Dentistry",
  website: "https://odontovale.example.com",
  contactEmail: "contato@odontovale.example.com",
  createdAt: new Date("2025-01-10T00:00:00Z"),
};

const location: Location = {
  id: "d3f1c1e0-0000-4000-8000-000000000002",
  clientId: client.id,
  name: client.name,
  address: "Rua das Flores, 100",
  city: "Vale Verde",
  region: "SP",
  country: "BR",
  phone: "+55 11 90000-0000",
  website: client.website,
  googleProfileUrl: "https://g.page/odontovale",
  primaryCategory: "Dentist",
  secondaryCategories: ["Cosmetic dentist"],
  openingHours: null,
  bookingUrl: null,
  status: "active",
};

const AGGREGATES = {
  averageRating: 4.5,
  reviewCount: 67,
  unansweredReviews: 12,
  lastPostDaysAgo: 120,
};

function heading(title: string) {
  console.log(`\n=== ${title} ===`);
}

async function main() {
  heading("1. Client created");
  console.log(client);

  heading("2. Audit input");
  const auditInput = {
    businessName: location.name,
    category: location.primaryCategory,
    address: location.address,
    phone: location.phone,
    website: location.website,
    openingHoursComplete: false,
    description: null,
    services: null,
    bookingUrl: location.bookingUrl,
    photoCount: 3,
    reviewCount: AGGREGATES.reviewCount,
    averageRating: AGGREGATES.averageRating,
    unansweredReviews: AGGREGATES.unansweredReviews,
    latestPostDaysAgo: AGGREGATES.lastPostDaysAgo,
  };
  console.log(auditInput);

  heading("3. Local Presence Score");
  const audit = buildAudit(location.id, auditInput);
  console.log(`Score: ${audit.score}/100`);
  for (const section of Object.values(audit.sections)) {
    console.log(
      `  ${section.section}: ${section.score}/100 (weight ${Math.round(section.weight * 100)}%)`,
    );
  }

  heading("4. Review drafts (negative review requires human approval)");
  const negativeReview: Review = {
    id: "e0000000-0000-4000-8000-000000000001",
    locationId: location.id,
    externalId: "g-1",
    author: "Marcos Silva",
    rating: 1,
    comment: "Esperei 40 minutos além do horário marcado e ninguém avisou.",
    createdAt: new Date(),
    reply: null,
    replyStatus: "none",
    status: "new",
  };
  const contentProvider = new RuleBasedContentProvider();
  console.log(`Sentiment: ${classifyReview(negativeReview.rating)}`);
  const draft = await contentProvider.draftReviewReply(negativeReview);
  console.log(`Draft reply: "${draft}"`);
  console.log("Status: drafted — awaiting human approval before publish.");

  heading("5. Post drafts (4)");
  const posts = await Promise.all([
    contentProvider.draftPost({
      businessName: client.name,
      type: "update",
      topic: "novo horário de atendimento aos sábados",
    }),
    contentProvider.draftPost({
      businessName: client.name,
      type: "offer",
      topic: "avaliação gratuita para novos pacientes",
    }),
    contentProvider.draftPost({
      businessName: client.name,
      type: "event",
      topic: "campanha de escovação para crianças",
    }),
    contentProvider.draftPost({
      businessName: client.name,
      type: "update",
      topic: "chegada de novo equipamento de raio-x digital",
    }),
  ]);
  posts.forEach((post, i) => console.log(`  [${i + 1}] ${post.title}`));

  heading("6. Monthly report");
  const currentMonth: PerformanceMetric[] = [
    {
      locationId: location.id,
      date: "2026-08-30",
      views: 510,
      searches: 300,
      calls: 21,
      websiteClicks: 40,
      directions: 25,
      bookings: 4,
    },
  ];
  const previousMonth: PerformanceMetric[] = [
    {
      locationId: location.id,
      date: "2026-07-30",
      views: 400,
      searches: 250,
      calls: 16,
      websiteClicks: 30,
      directions: 20,
      bookings: 2,
    },
  ];
  const performance = compareMonthOverMonth(currentMonth, previousMonth);
  const report = generateMonthlyReport({
    locationId: location.id,
    locationName: location.name,
    periodStart: "2026-08-01",
    periodEnd: "2026-08-31",
    audit,
    previousScore: null,
    reviews: {
      totalThisMonth: 1,
      averageRating: AGGREGATES.averageRating,
      unansweredReviews: AGGREGATES.unansweredReviews,
    },
    performance,
    completedActions: ["Drafted a reply for 1 negative review (pending approval)"],
  });
  console.log(report.summary);
  console.log(`Open issues: ${report.openIssues.length}`);
  console.log(`Recommendations: ${report.recommendations.length}`);

  heading("Done");
  console.log("Run `pnpm dev` and open /dashboard to see this rendered.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
