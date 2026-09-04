# Adding a second client

This MVP ships with one demo client ("Clínica Odonto Vale") hardcoded in
`apps/web/lib/demo-repository.ts` and `scripts/demo.ts`, because there is no
live Supabase project connected to this environment. Once a real Supabase
project is deployed (see [DEPLOYMENT.md](DEPLOYMENT.md)), adding a client
is a data operation, not a code change:

1. **Create the client row.**
   ```sql
   insert into clients (name, slug, timezone, industry, contact_email)
   values ('New Client Name', 'new-client-slug', 'America/Sao_Paulo', 'Industry', 'owner@example.com');
   ```
2. **Grant a user access to it.**
   ```sql
   insert into client_users (user_id, client_id, role)
   values ('<supabase-auth-user-id>', '<client-id-from-step-1>', 'owner');
   ```
   Without this row, RLS blocks every read/write for that user against that
   client — this is the actual isolation mechanism, not a formality.
3. **Create at least one location** under that `client_id` (see the
   `locations` table in `supabase/migrations/0001_init.sql` and the
   `Location` Zod schema in `packages/profiles`).
4. **Run an audit** — either through the `/audit` public form (manual
   observed data) or by calling `buildAudit` from `packages/audit` with real
   values, and store the result in the `audits` table.
5. **(Optional) enter performance metrics manually** into
   `performance_metrics` — one row per `(location_id, date)` — until Google
   API access exists (see [GOOGLE_API.md](GOOGLE_API.md)).

Until the app is wired to a real Supabase instance, adding a "second client"
in this codebase means adding a second demo dataset next to
`DEMO_CLIENT`/`DEMO_LOCATION` in `apps/web/lib/demo-repository.ts` — useful
for a sales demo, not a substitute for real onboarding.
