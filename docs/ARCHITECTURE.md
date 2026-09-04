# Architecture

## Why a monorepo of small packages

Each domain concern — audit scoring, review workflow, content drafting,
analytics, reporting — is a package with no dependency on the Next.js app.
`apps/web` is a thin rendering/orchestration layer over these packages: it
never contains business logic that isn't trivially re-testable outside a
browser. This is also what keeps `pnpm typecheck`/`pnpm test` fast — most
packages have no dependency on Next.js at all.

## Dependency direction

```
config  →  (used by everything)
profiles, reviews, analytics  →  no dependency on each other
audit  →  config
content  →  config, reviews
reports  →  audit, analytics
providers  →  profiles, reviews, content
apps/web  →  all of the above
```

Nothing in `packages/` imports from `apps/web`. `packages/providers`'
future-ports (`ReasoningProvider`, `PolicyProvider`, `ResearchProvider`) are
interfaces only — no package or app imports them, by design, since this MVP
does not integrate with Core AI.

## Providers, not vendor lock-in

Every external integration point is behind an interface:

- `BusinessProfileProvider` — Mock, Manual, and a Google skeleton that
  throws until real API access lands (see
  [GOOGLE_API.md](GOOGLE_API.md)).
- `ContentProvider` — Mock, RuleBased (default), and an optional OpenAI
  implementation that only activates when `OPENAI_API_KEY` is set (see
  [CONTENT.md](CONTENT.md)).
- `CompetitiveDiscoveryProvider` — Mock only for now ("Farol", a future
  feature, not wired into any page yet).

This is what "vendor-portable" means in practice here: swapping Google for
another maps provider, or OpenAI for another LLM, touches one file per
provider, never the domain packages.

## The web app

Next.js App Router, server components by default. Data comes from
`apps/web/lib/demo-repository.ts` — a fully in-memory, deterministic demo
dataset (the "Clínica Odonto Vale" scenario) used because this environment
has no live Supabase project attached. The Supabase schema and RLS policies
are written and tested (`supabase/migrations/`), but wiring the app to a
real Supabase instance is left for whoever deploys it — see
[DEPLOYMENT.md](DEPLOYMENT.md) for exactly what that involves.

## Testing strategy

Business logic is tested at the package level with Vitest — no browser, no
database. The one exception is `supabase/migrations/0001_init.sql`, which is
tested by parsing the SQL text and asserting RLS is enabled with a
tenant-scoped policy on every table, since there is no live Postgres to run
migrations against in CI for this MVP.
