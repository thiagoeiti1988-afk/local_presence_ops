# Data model

Full schema: `supabase/migrations/0001_init.sql`. Zod schemas (the
application-layer mirror, with extra validation like URL sanitization):
`packages/profiles`, `packages/reviews`, `packages/content`,
`packages/analytics`.

## Entities

- **Client** — a business/tenant. `id, name, slug, timezone, industry,
  website, contactEmail, createdAt`.
- **Location** — one physical/service location under a client. Carries
  `clientId`. `name, address, city, region, country, phone, website,
  googleProfileUrl, primaryCategory, secondaryCategories[], openingHours,
  bookingUrl, status`.
- **Review** — `clientId, locationId, externalId, author, rating, comment,
  createdAt, reply, replyStatus, status`. `status` moves through the
  workflow described in [REVIEWS.md](REVIEWS.md).
- **LocalPost** — `clientId, locationId, type (update|offer|event), title,
  body, cta, link, status (draft|approved|published), scheduledAt,
  publishedAt`.
- **PerformanceMetric** — one row per `(locationId, date)`:
  `views, searches, calls, websiteClicks, directions, bookings`. Entered
  manually until the Google API is available (see
  [GOOGLE_API.md](GOOGLE_API.md)).
- **Audit** (stored snapshot of a `LocalPresenceAudit` run) —
  `clientId, locationId, generatedAt, score, sections (jsonb)`.
- **Lead** — a prospect captured from the public `/audit` form:
  `businessName, city, website, googleProfileUrl, phone, score, createdAt,
  status, sentFollowUps`. No `clientId` — a lead isn't a tenant yet, so
  it's the one table that skips the tenant-isolation RLS pattern (see
  `0002_leads.sql`). `status` (`new/contacted/qualified/lost`) and
  `sentFollowUps` (which of the T+0/T+24h/T+72h steps a human confirmed
  sending) drive the follow-up queue in `packages/followup` — see
  [WHATSAPP.md](WHATSAPP.md). The web app's demo implementation
  (`apps/web/lib/leads-store.ts`) keeps this in memory only — see
  docs/DEPLOYMENT.md for wiring it to real Supabase.

## Multi-tenancy

Every tenant-scoped table carries `client_id` directly — denormalized from
`location_id` on purpose, so a single RLS policy per table can check tenant
membership without a join (see [SECURITY.md](SECURITY.md)). The application
layer has a second, independent guard:
`packages/profiles/src/location.ts#assertSingleTenant` throws if a list of
records mixes more than one `clientId` — a defense against an application
bug leaking data across tenants even before RLS would catch it at the
database layer.

## Why `client_id` is redundant with `location_id`

A `review` or `local_post` could theoretically derive its `client_id` by
joining through `location_id -> locations.client_id`. It doesn't, because
the spec for this MVP requires isolation to be enforceable per-table without
a join, and because a bug that reassigns a location to a different client
should not silently reassign every review/post/metric under it — those stay
attached to the client they were created under unless explicitly migrated.
