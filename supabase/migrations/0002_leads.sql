-- Leads captured from the public /audit lead magnet.
--
-- Unlike every table in 0001_init.sql, a lead does not belong to a client
-- yet — it's a prospect, not a tenant — so it carries no client_id and its
-- RLS model is different: any authenticated staff member may read/write,
-- rather than the client_users tenant-isolation policy used elsewhere. See
-- docs/DATA_MODEL.md.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),

  business_name text not null,
  city text not null,
  website text,
  google_profile_url text,

  score smallint not null check (score between 0 and 100),

  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);

alter table leads enable row level security;

-- Any authenticated user (staff) can read and create leads — there is no
-- per-client isolation to enforce here, since a lead has no client yet.
create policy leads_staff_access on leads
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
