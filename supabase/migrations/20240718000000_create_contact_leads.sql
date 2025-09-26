create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text,
  email text not null check (position('@' in email) > 1),
  company text,
  message text,
  source text check (source in ('airnub','speckit')) default 'airnub',
  consent boolean default false,
  user_agent text,
  ip_hash text
);

alter table public.contact_leads enable row level security;

create policy "leads_insert_anon" on public.contact_leads
  for insert to anon with check (true);

create policy "leads_read_service" on public.contact_leads
  for select to service_role using (true);

create index if not exists idx_contact_leads_created_at on public.contact_leads (created_at desc);
