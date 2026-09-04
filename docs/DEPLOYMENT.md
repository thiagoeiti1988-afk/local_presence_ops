# Deployment

## Current state: demo mode, no live Supabase project

This repository was built in an environment with no Supabase project
attached. `apps/web` runs entirely on an in-memory, deterministic demo
dataset (`apps/web/lib/demo-repository.ts`) so that `pnpm build`, `pnpm dev`,
and the dashboard/report pages all work with zero external configuration.
The Supabase schema and RLS policies are written and tested
(`supabase/migrations/`, `supabase/migrations/0001_init.test.ts`), but no
code in `apps/web` talks to a real Postgres instance yet — see
[ARCHITECTURE.md](ARCHITECTURE.md).

## Deploying for real

1. **Create a Supabase project.** Run
   `supabase/migrations/0001_init.sql` against it (via the Supabase CLI:
   `supabase db push`, or paste it into the SQL editor).
2. **Set environment variables** (Vercel project settings, or `.env.local`
   for local dev) from `.env.example`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`. Set `USE_DEMO_DATA=false` — see
   `packages/config/src/env.ts#hasSupabaseConfig`.
3. **Implement a Supabase-backed data source.** `apps/web/lib/demo-repository.ts`
   is the one file that needs a real counterpart — read/write against the
   tables in `supabase/migrations/0001_init.sql` instead of the in-memory
   arrays. `packages/providers`' `ManualBusinessProfileProvider` already
   expects a `ManualDataStore` interface (`getLocation`, `getReviews`,
   `saveReply`, `getPerformance`, `savePost`, `saveLocation`) — implement
   that against Supabase and pass it in, rather than writing bespoke query
   code inside the app.
4. **Deploy `apps/web` to Vercel** (`vercel --prod`, or connect the repo).
   `next.config.mjs`'s `transpilePackages` list must include every
   `@local-presence-ops/*` package the app imports — already the case as
   shipped.
5. **(Optional) Google/OpenAI credentials** — see
   [GOOGLE_API.md](GOOGLE_API.md) and [CONTENT.md](CONTENT.md). Neither is
   required for the app to run.

## CI

`.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile`, `lint`,
`typecheck`, `test`, `build` on every push/PR. It does not run against a
live Supabase instance — the RLS tests validate the migration SQL's shape,
not behavior against a running Postgres (see
[ARCHITECTURE.md](ARCHITECTURE.md)'s testing strategy section for why).
