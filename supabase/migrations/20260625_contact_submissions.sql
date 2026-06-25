-- contact_submissions: public contact form inserts via anon key (POST /api/contact).

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  company text null,
  phone text null,
  message text not null,
  source text not null default 'home'
);

alter table public.contact_submissions enable row level security;

drop policy if exists "Allow anon insert contact_submissions" on public.contact_submissions;
create policy "Allow anon insert contact_submissions"
on public.contact_submissions
for insert
to anon
with check (true);

drop policy if exists "Disallow public reads contact_submissions" on public.contact_submissions;
create policy "Disallow public reads contact_submissions"
on public.contact_submissions
for select
to anon
using (false);
