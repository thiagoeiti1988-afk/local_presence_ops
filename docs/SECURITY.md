# Security

## Multi-tenancy: RLS + application-layer guard

Every tenant-scoped table carries `client_id` and has row-level security
enabled with a policy scoped to `client_users` membership (see
`supabase/migrations/0001_init.sql`, tested in
`supabase/migrations/0001_init.test.ts`). The application layer has a second,
independent check — `assertSingleTenant` in `packages/profiles` — so a
programming mistake that mixes tenants in a query result is caught even
before RLS would matter (e.g. when code runs with the service-role key,
which bypasses RLS by design).

## Input validation

Every entity has a Zod schema (`packages/profiles`, `packages/reviews`,
`packages/content`, `packages/analytics`) validated at the boundary — the
public `/audit` form, any future API route. Numbers, enums, string lengths,
and URL shape are all checked before anything is stored or scored.

## URL sanitization

`packages/config/src/url.ts#sanitizeUrl` allows only `http:`/`https:` and
rejects `javascript:`, `data:`, `vbscript:`, `file:`. Every URL field in
`Location` and `LocalPost` (`website`, `googleProfileUrl`, `bookingUrl`,
`link`) runs through it via a Zod `.transform()` — an unsafe URL becomes
`null` rather than throwing, so a bad value doesn't reject an otherwise-valid
record, but it also never reaches storage or rendering unsanitized.

## Rate limiting and CSRF

Not implemented as middleware in this MVP — there is no API route yet that
needs it (the one public write path, `/audit`, uses a Next.js Server Action,
which Next.js already protects against cross-site invocation via its
built-in same-origin check on the action's encrypted reference). If/when a
plain HTTP API route is added for external callers (e.g. the n8n examples in
`workflows/`), add rate limiting at that point — see
`docs/VALIDATION_PLAN.md` for why this isn't pulled forward speculatively.

## Secrets

- Never commit `.env`/`.env.local` — only `.env.example` (no real values) is
  tracked.
- Google and OpenAI credentials are optional; the app must run with none of
  them configured (see [GOOGLE_API.md](GOOGLE_API.md),
  [CONTENT.md](CONTENT.md)).
- **A client's Google password is never stored, ever.** The only supported
  path to a client's Google Business Profile is either manual entry
  (`ManualBusinessProfileProvider`) or, in the future, OAuth (see
  [GOOGLE_API.md](GOOGLE_API.md)) — never a shared login.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. It must only ever be used
  server-side (Server Components, Server Actions, or a server-only API
  route) — never sent to the browser. `NEXT_PUBLIC_*` variables are, by
  Next.js convention, the only ones safe to expose client-side.

## Logs

Do not log `comment`/`reply` free-text fields at a level that reaches a
shared log aggregator without review — they are end-customer-authored text
and can contain PII a client typed into a review. `console.log`/`error`
output during development is fine; a production log pipeline should redact
or omit free-text review/reply bodies.
