-- facility_intakes: managed compliance service onboarding (POST /api/intake).

create table if not exists public.facility_intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  email text not null,
  company text not null,
  contact_name text not null,
  state text not null,
  industry text not null,
  payload jsonb not null
);

create index if not exists facility_intakes_email_idx on public.facility_intakes (email);
create index if not exists facility_intakes_created_at_idx on public.facility_intakes (created_at desc);

alter table public.facility_intakes enable row level security;

drop policy if exists "Allow anon insert facility_intakes" on public.facility_intakes;
create policy "Allow anon insert facility_intakes"
on public.facility_intakes
for insert
to anon
with check (true);

drop policy if exists "Disallow public reads facility_intakes" on public.facility_intakes;
create policy "Disallow public reads facility_intakes"
on public.facility_intakes
for select
to anon
using (false);
