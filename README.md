# Local Presence Ops

MVP for auditing and operating small businesses' Google Business Profiles:
score their presence, draft review replies and posts, track performance, and
generate a monthly report. Built to test one hypothesis — will small
businesses pay monthly for this — not to be a full SEO platform.

Out of scope on purpose: full SEO tooling, billing, ranking promises,
aggressive scraping, a hard dependency on the Google Business Profile API,
and any integration with Core AI. See each doc below for why.

## Stack

TypeScript, Node.js, pnpm workspaces, Next.js (App Router), Supabase/Postgres
(schema + RLS only in this MVP — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)),
Zod, Vitest. Playwright is reserved for critical flows only and is not wired
in yet (YAGNI — nothing critical enough exists in the MVP to justify it).

## Layout

```
apps/web/          Next.js dashboard + public /audit lead magnet
packages/audit/     LocalPresenceAudit model + deterministic scoring
packages/profiles/  Client + Location models, multi-tenant validation
packages/reviews/   Review model, classification, approval workflow
packages/content/   LocalPost model + ContentProvider implementations
packages/analytics/ PerformanceMetric model + aggregation
packages/reports/   Monthly report generation + HTML rendering
packages/providers/ BusinessProfileProvider (Mock/Manual/Google skeleton),
                     CompetitiveDiscoveryProvider, future Core AI ports
packages/config/    Shared constants, env schema, URL sanitization
supabase/           SQL migrations with row-level security
docs/               Architecture, data model, and operational docs
workflows/          Example n8n workflows (illustrative, not required)
scripts/demo.ts     Runs the full demo scenario end to end
```

## Getting started

```bash
pnpm install
cp .env.example .env.local   # optional — demo mode works with no env vars
pnpm demo                    # runs the full scenario in the terminal
pnpm dev                     # http://localhost:3000/dashboard
```

## Definition of Done commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Documentation

- [docs/USER_GUIDE.md](docs/USER_GUIDE.md) — how to use the dashboard, day to day
- [docs/GLOSSARY.md](docs/GLOSSARY.md) — every term used in the product, defined
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/AUDIT_SCORE.md](docs/AUDIT_SCORE.md)
- [docs/DATA_MODEL.md](docs/DATA_MODEL.md)
- [docs/REVIEWS.md](docs/REVIEWS.md)
- [docs/CONTENT.md](docs/CONTENT.md)
- [docs/GOOGLE_API.md](docs/GOOGLE_API.md)
- [docs/WHATSAPP.md](docs/WHATSAPP.md) — follow-up channel: manual wa.me today, Meta Cloud API skeleton for later
- [docs/SECURITY.md](docs/SECURITY.md)
- [docs/ADDING_CLIENT.md](docs/ADDING_CLIENT.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [docs/VALIDATION_PLAN.md](docs/VALIDATION_PLAN.md)
