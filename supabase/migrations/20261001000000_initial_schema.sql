-- Bhaye Mindoro: initial schema
-- Transportation reference data (municipalities, routes, fares, terminals, sources)
-- plus anonymous fare-concern reports.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.transport_mode as enum ('van', 'jeep', 'bus', 'tricycle', 'ferry');

create type public.fare_source_type as enum (
  'LGU',
  'ordinance',
  'operator',
  'terminal',
  'field_verification'
);

create type public.report_type as enum ('overcharging', 'incorrect_info', 'other');

create type public.report_status as enum ('pending', 'reviewing', 'resolved', 'dismissed');

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.municipalities (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  province text not null check (length(trim(province)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, province)
);

create table public.fare_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  source_type public.fare_source_type not null,
  -- Ordinance number, document title, URL, or field-verification note.
  reference text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.terminals (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  municipality_id uuid not null references public.municipalities (id) on delete restrict,
  address text,
  -- Nullable: only store verified coordinates.
  latitude numeric(9, 6) check (latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude between -180 and 180),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((latitude is null) = (longitude is null))
);

create table public.routes (
  id uuid primary key default gen_random_uuid(),
  origin_municipality_id uuid not null references public.municipalities (id) on delete restrict,
  destination_municipality_id uuid not null references public.municipalities (id) on delete restrict,
  mode public.transport_mode not null,
  -- Estimated travel time in minutes. Nullable until verified.
  estimated_travel_time integer check (estimated_travel_time > 0),
  terminal_id uuid references public.terminals (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fares (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes (id) on delete cascade,
  regular_fare numeric(10, 2) not null check (regular_fare >= 0),
  -- Optional override, only when the official source publishes its own
  -- discounted fare. When null, the app computes the 20% statutory discount
  -- from regular_fare.
  discounted_fare numeric(10, 2) check (discounted_fare >= 0 and discounted_fare <= regular_fare),
  currency char(3) not null default 'PHP',
  source_id uuid not null references public.fare_sources (id) on delete restrict,
  effective_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tricycle_fares (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid not null references public.municipalities (id) on delete restrict,
  origin text not null check (length(trim(origin)) > 0),
  destination text not null check (length(trim(destination)) > 0),
  regular_fare numeric(10, 2) not null check (regular_fare >= 0),
  -- Special (student/senior/PWD) fare as published by the LGU, if any.
  special_fare numeric(10, 2) check (special_fare >= 0 and special_fare <= regular_fare),
  night_fare numeric(10, 2) check (night_fare >= 0),
  ordinance_number text,
  source_id uuid not null references public.fare_sources (id) on delete restrict,
  effective_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  report_type public.report_type not null,
  municipality_id uuid references public.municipalities (id) on delete set null,
  route_id uuid references public.routes (id) on delete set null,
  description text check (length(description) <= 2000),
  reported_fare numeric(10, 2) check (reported_fare >= 0 and reported_fare <= 100000),
  expected_fare numeric(10, 2) check (expected_fare >= 0 and expected_fare <= 100000),
  created_at timestamptz not null default now(),
  status public.report_status not null default 'pending'
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index terminals_municipality_id_idx on public.terminals (municipality_id);
create index routes_origin_destination_idx
  on public.routes (origin_municipality_id, destination_municipality_id);
create index routes_terminal_id_idx on public.routes (terminal_id);
create index fares_route_id_idx on public.fares (route_id);
create index fares_source_id_idx on public.fares (source_id);
create index tricycle_fares_municipality_id_idx on public.tricycle_fares (municipality_id);
create index tricycle_fares_source_id_idx on public.tricycle_fares (source_id);
create index reports_municipality_id_idx on public.reports (municipality_id);
create index reports_route_id_idx on public.reports (route_id);
create index reports_status_idx on public.reports (status);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create trigger municipalities_set_updated_at before update on public.municipalities
  for each row execute function public.set_updated_at();
create trigger fare_sources_set_updated_at before update on public.fare_sources
  for each row execute function public.set_updated_at();
create trigger terminals_set_updated_at before update on public.terminals
  for each row execute function public.set_updated_at();
create trigger routes_set_updated_at before update on public.routes
  for each row execute function public.set_updated_at();
create trigger fares_set_updated_at before update on public.fares
  for each row execute function public.set_updated_at();
create trigger tricycle_fares_set_updated_at before update on public.tricycle_fares
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Public (anon) clients may READ transportation data and may only INSERT
-- reports. Reports are never readable by public clients. Data management is
-- done with the service role (which bypasses RLS) until admin auth exists.

alter table public.municipalities enable row level security;
alter table public.fare_sources enable row level security;
alter table public.terminals enable row level security;
alter table public.routes enable row level security;
alter table public.fares enable row level security;
alter table public.tricycle_fares enable row level security;
alter table public.reports enable row level security;

-- Defense in depth: public roles get no write privileges on reference data.
revoke insert, update, delete, truncate on
  public.municipalities,
  public.fare_sources,
  public.terminals,
  public.routes,
  public.fares,
  public.tricycle_fares
from anon, authenticated;

-- Reports: insert only. No select/update/delete for public roles.
revoke select, update, delete, truncate on public.reports from anon, authenticated;
grant insert on public.reports to anon, authenticated;

create policy "Public can read municipalities"
  on public.municipalities for select
  to anon, authenticated
  using (true);

create policy "Public can read fare sources"
  on public.fare_sources for select
  to anon, authenticated
  using (true);

create policy "Public can read terminals"
  on public.terminals for select
  to anon, authenticated
  using (true);

create policy "Public can read active routes"
  on public.routes for select
  to anon, authenticated
  using (active);

create policy "Public can read fares of active routes"
  on public.fares for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.routes r
      where r.id = fares.route_id and r.active
    )
  );

create policy "Public can read tricycle fares"
  on public.tricycle_fares for select
  to anon, authenticated
  using (true);

create policy "Anyone can submit a pending report"
  on public.reports for insert
  to anon, authenticated
  with check (status = 'pending');
