-- Local Presence Ops — initial schema
--
-- Every tenant-scoped table carries client_id directly (denormalized from
-- location_id on purpose) so that a single RLS policy per table can check
-- tenant membership without a join. See docs/SECURITY.md and
-- docs/DATA_MODEL.md for the reasoning.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null,
  industry text not null,
  website text,
  contact_email text not null,
  created_at timestamptz not null default now()
);

-- Maps an authenticated Supabase user to the client(s) they may access.
-- This table is what every other RLS policy in this file joins against.
create table if not exists client_users (
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid not null references clients (id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (user_id, client_id)
);

alter table clients enable row level security;
alter table client_users enable row level security;

create policy clients_select_own on clients
  for select
  using (
    id in (select client_id from client_users where user_id = auth.uid())
  );

create policy client_users_select_own on client_users
  for select
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- locations
-- ---------------------------------------------------------------------------
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,

  name text not null,
  address text not null,
  city text not null,
  region text not null,
  country char(2) not null,

  phone text,
  website text,
  google_profile_url text,

  primary_category text not null,
  secondary_categories text[] not null default '{}',

  opening_hours jsonb,

  booking_url text,

  status text not null default 'onboarding'
    check (status in ('active', 'onboarding', 'paused', 'archived')),

  created_at timestamptz not null default now()
);

create index if not exists locations_client_id_idx on locations (client_id);

alter table locations enable row level security;

create policy locations_tenant_isolation on locations
  for all
  using (client_id in (select client_id from client_users where user_id = auth.uid()))
  with check (client_id in (select client_id from client_users where user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  location_id uuid not null references locations (id) on delete cascade,
  external_id text,

  author text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text,

  created_at timestamptz not null default now(),

  reply text,
  reply_status text not null default 'none'
    check (reply_status in ('none', 'drafted', 'approved', 'published')),

  status text not null default 'new'
    check (status in ('new', 'drafted', 'approved', 'replied', 'escalated'))
);

create index if not exists reviews_client_id_idx on reviews (client_id);
create index if not exists reviews_location_id_idx on reviews (location_id);

alter table reviews enable row level security;

create policy reviews_tenant_isolation on reviews
  for all
  using (client_id in (select client_id from client_users where user_id = auth.uid()))
  with check (client_id in (select client_id from client_users where user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- local_posts
-- ---------------------------------------------------------------------------
create table if not exists local_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  location_id uuid not null references locations (id) on delete cascade,

  type text not null check (type in ('update', 'offer', 'event')),

  title text not null,
  body text not null,
  cta text,
  link text,

  status text not null default 'draft'
    check (status in ('draft', 'approved', 'published')),

  scheduled_at timestamptz,
  published_at timestamptz
);

create index if not exists local_posts_client_id_idx on local_posts (client_id);
create index if not exists local_posts_location_id_idx on local_posts (location_id);

alter table local_posts enable row level security;

create policy local_posts_tenant_isolation on local_posts
  for all
  using (client_id in (select client_id from client_users where user_id = auth.uid()))
  with check (client_id in (select client_id from client_users where user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- performance_metrics
-- ---------------------------------------------------------------------------
create table if not exists performance_metrics (
  client_id uuid not null references clients (id) on delete cascade,
  location_id uuid not null references locations (id) on delete cascade,
  date date not null,

  views integer not null default 0,
  searches integer not null default 0,
  calls integer not null default 0,
  website_clicks integer not null default 0,
  directions integer not null default 0,
  bookings integer not null default 0,

  primary key (location_id, date)
);

create index if not exists performance_metrics_client_id_idx on performance_metrics (client_id);

alter table performance_metrics enable row level security;

create policy performance_metrics_tenant_isolation on performance_metrics
  for all
  using (client_id in (select client_id from client_users where user_id = auth.uid()))
  with check (client_id in (select client_id from client_users where user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- audits — a stored snapshot of each LocalPresenceAudit run
-- ---------------------------------------------------------------------------
create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  location_id uuid not null references locations (id) on delete cascade,

  generated_at timestamptz not null default now(),
  score smallint not null check (score between 0 and 100),
  sections jsonb not null
);

create index if not exists audits_client_id_idx on audits (client_id);
create index if not exists audits_location_id_idx on audits (location_id);

alter table audits enable row level security;

create policy audits_tenant_isolation on audits
  for all
  using (client_id in (select client_id from client_users where user_id = auth.uid()))
  with check (client_id in (select client_id from client_users where user_id = auth.uid()));
