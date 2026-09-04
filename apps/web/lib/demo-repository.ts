import { buildAudit, type LocalPresenceAudit } from "@local-presence-ops/audit";
import {
  compareMonthOverMonth,
  type PerformanceMetric,
} from "@local-presence-ops/analytics";
import { RuleBasedContentProvider } from "@local-presence-ops/content";
import type { LocalPost } from "@local-presence-ops/content";
import type { Client, Location } from "@local-presence-ops/profiles";
import type { Review } from "@local-presence-ops/reviews";
import { generateMonthlyReport, type MonthlyReport } from "@local-presence-ops/reports";
import {
  MockCompetitiveDiscoveryProvider,
  type CompetitorSummary,
} from "@local-presence-ops/providers";

const CLIENT_ID = "d3f1c1e0-0000-4000-8000-000000000001";
const LOCATION_ID = "d3f1c1e0-0000-4000-8000-000000000002";

export const DEMO_CLIENT: Client = {
  id: CLIENT_ID,
  name: "Clínica Odonto Vale",
  slug: "clinica-odonto-vale",
  timezone: "America/Sao_Paulo",
  industry: "Dentistry",
  website: "https://odontovale.example.com",
  contactEmail: "contato@odontovale.example.com",
  createdAt: new Date("2025-01-10T00:00:00Z"),
};

export const DEMO_LOCATION: Location = {
  id: LOCATION_ID,
  clientId: CLIENT_ID,
  name: "Clínica Odonto Vale",
  address: "Rua das Flores, 100",
  city: "Vale Verde",
  region: "SP",
  country: "BR",
  phone: "+55 11 90000-0000",
  website: "https://odontovale.example.com",
  googleProfileUrl: "https://g.page/odontovale",
  primaryCategory: "Dentist",
  secondaryCategories: ["Cosmetic dentist", "Emergency dental service"],
  openingHours: null, // incomplete on purpose — matches the demo scenario
  bookingUrl: null,
  latitude: -23.5505,
  longitude: -46.6333,
  status: "active",
};

const now = new Date("2026-09-04T12:00:00Z");

function daysAgo(days: number): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

export const DEMO_REVIEWS: Review[] = [
  {
    id: "e0000000-0000-4000-8000-000000000001",
    locationId: LOCATION_ID,
    externalId: "g-1",
    author: "Marcos Silva",
    rating: 1,
    comment: "Esperei 40 minutos além do horário marcado e ninguém avisou.",
    createdAt: daysAgo(2),
    reply: null,
    replyStatus: "none",
    status: "new",
  },
  {
    id: "e0000000-0000-4000-8000-000000000002",
    locationId: LOCATION_ID,
    externalId: "g-2",
    author: "Fernanda Costa",
    rating: 5,
    comment: "Atendimento excelente, equipe muito atenciosa!",
    createdAt: daysAgo(4),
    reply: null,
    replyStatus: "none",
    status: "new",
  },
  {
    id: "e0000000-0000-4000-8000-000000000003",
    locationId: LOCATION_ID,
    externalId: "g-3",
    author: "Roberto Alves",
    rating: 3,
    comment: "Bom atendimento, mas achei o preço um pouco alto.",
    createdAt: daysAgo(9),
    reply: null,
    replyStatus: "none",
    status: "new",
  },
  {
    id: "e0000000-0000-4000-8000-000000000004",
    locationId: LOCATION_ID,
    externalId: "g-4",
    author: "Juliana Prado",
    rating: 5,
    comment: "Melhor clínica da região, recomendo muito.",
    createdAt: daysAgo(15),
    reply: "Muito obrigado pela confiança, Juliana!",
    replyStatus: "published",
    status: "replied",
  },
];

// Aggregate stats used by the audit and dashboard tiles reflect the full
// review history (67 reviews), while DEMO_REVIEWS above is a representative
// sample rendered on the Reviews page — the MVP does not require every
// historical review to be materialized to compute a deterministic score.
export const DEMO_AGGREGATES = {
  reviewCount: 67,
  averageRating: 4.5,
  unansweredReviews: 12,
  lastPostDaysAgo: 120,
};

const contentProvider = new RuleBasedContentProvider();

async function buildDemoPosts(): Promise<LocalPost[]> {
  const drafts = await Promise.all([
    contentProvider.draftPost({
      businessName: DEMO_CLIENT.name,
      type: "update",
      topic: "novo horário de atendimento aos sábados",
    }),
    contentProvider.draftPost({
      businessName: DEMO_CLIENT.name,
      type: "offer",
      topic: "avaliação gratuita para novos pacientes",
    }),
    contentProvider.draftPost({
      businessName: DEMO_CLIENT.name,
      type: "event",
      topic: "campanha de escovação para crianças",
    }),
    contentProvider.draftPost({
      businessName: DEMO_CLIENT.name,
      type: "update",
      topic: "chegada de novo equipamento de raio-x digital",
    }),
  ]);

  return drafts.map((draft, index) => ({
    id: `f0000000-0000-4000-8000-00000000000${index + 1}`,
    locationId: LOCATION_ID,
    type: index === 1 ? "offer" : index === 2 ? "event" : "update",
    title: draft.title,
    body: draft.body,
    cta: draft.cta,
    link: null,
    status: "draft",
    scheduledAt: null,
    publishedAt: null,
  }));
}

async function buildDemoReviewDrafts(): Promise<Review[]> {
  const negative = DEMO_REVIEWS.find((r) => r.rating === 1);
  if (!negative) return DEMO_REVIEWS;

  const draft = await contentProvider.draftReviewReply(negative);
  return DEMO_REVIEWS.map((review) =>
    review.id === negative.id
      ? { ...review, reply: draft, replyStatus: "drafted" as const, status: "drafted" as const }
      : review,
  );
}

export const DEMO_PERFORMANCE_CURRENT: PerformanceMetric[] = [
  {
    locationId: LOCATION_ID,
    date: "2026-08-15",
    views: 420,
    searches: 260,
    calls: 18,
    websiteClicks: 34,
    directions: 22,
    bookings: 3,
  },
  {
    locationId: LOCATION_ID,
    date: "2026-08-30",
    views: 510,
    searches: 300,
    calls: 21,
    websiteClicks: 40,
    directions: 25,
    bookings: 4,
  },
];

export const DEMO_PERFORMANCE_PREVIOUS: PerformanceMetric[] = [
  {
    locationId: LOCATION_ID,
    date: "2026-07-15",
    views: 380,
    searches: 240,
    calls: 15,
    websiteClicks: 28,
    directions: 19,
    bookings: 2,
  },
  {
    locationId: LOCATION_ID,
    date: "2026-07-30",
    views: 400,
    searches: 250,
    calls: 16,
    websiteClicks: 30,
    directions: 20,
    bookings: 2,
  },
];

export function buildDemoAudit(): LocalPresenceAudit {
  return buildAudit(
    LOCATION_ID,
    {
      businessName: DEMO_LOCATION.name,
      category: DEMO_LOCATION.primaryCategory,
      address: DEMO_LOCATION.address,
      phone: DEMO_LOCATION.phone,
      website: DEMO_LOCATION.website,
      openingHoursComplete: false,
      description: null,
      services: null,
      bookingUrl: DEMO_LOCATION.bookingUrl,
      photoCount: 3,
      reviewCount: DEMO_AGGREGATES.reviewCount,
      averageRating: DEMO_AGGREGATES.averageRating,
      unansweredReviews: DEMO_AGGREGATES.unansweredReviews,
      latestPostDaysAgo: DEMO_AGGREGATES.lastPostDaysAgo,
    },
    now,
  );
}

export function buildDemoMonthlyReport(audit: LocalPresenceAudit): MonthlyReport {
  const performance = compareMonthOverMonth(
    DEMO_PERFORMANCE_CURRENT,
    DEMO_PERFORMANCE_PREVIOUS,
  );

  return generateMonthlyReport({
    locationId: LOCATION_ID,
    locationName: DEMO_LOCATION.name,
    periodStart: "2026-08-01",
    periodEnd: "2026-08-31",
    audit,
    previousScore: null,
    reviews: {
      totalThisMonth: DEMO_REVIEWS.length,
      averageRating: DEMO_AGGREGATES.averageRating,
      unansweredReviews: DEMO_AGGREGATES.unansweredReviews,
    },
    performance,
    completedActions: [
      "Respondeu 1 avaliação negativa após aprovação humana",
      "Publicou 4 posts em rascunho aguardando aprovação",
    ],
  });
}

const competitiveDiscoveryProvider = new MockCompetitiveDiscoveryProvider();

export interface DemoRepository {
  client: Client;
  location: Location;
  reviews: Review[];
  posts: LocalPost[];
  audit: LocalPresenceAudit;
  report: MonthlyReport;
  performance: ReturnType<typeof compareMonthOverMonth>;
  competitors: CompetitorSummary[];
}

let cached: DemoRepository | null = null;

export async function getDemoRepository(): Promise<DemoRepository> {
  if (cached) return cached;

  const [reviews, posts, competitors] = await Promise.all([
    buildDemoReviewDrafts(),
    buildDemoPosts(),
    competitiveDiscoveryProvider.findNearbyCompetitors(LOCATION_ID, 5),
  ]);
  const audit = buildDemoAudit();
  const report = buildDemoMonthlyReport(audit);
  const performance = compareMonthOverMonth(
    DEMO_PERFORMANCE_CURRENT,
    DEMO_PERFORMANCE_PREVIOUS,
  );

  cached = {
    client: DEMO_CLIENT,
    location: DEMO_LOCATION,
    reviews,
    posts,
    audit,
    report,
    performance,
    competitors,
  };
  return cached;
}
