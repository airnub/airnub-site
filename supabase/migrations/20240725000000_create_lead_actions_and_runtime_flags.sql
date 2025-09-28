create table if not exists public.lead_actions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.contact_leads (id) on delete cascade,
  status text not null check (status in ('new','replied','ignored','handoff')),
  assignee text,
  note text,
  created_at timestamptz not null default now(),
  created_by text
);

create index if not exists idx_lead_actions_lead_id_created_at on public.lead_actions (lead_id, created_at desc);

alter table public.lead_actions enable row level security;

create policy "lead_actions_select_service" on public.lead_actions
  for select to service_role using (true);

create policy "lead_actions_insert_service" on public.lead_actions
  for insert to service_role with check (true);

create table if not exists public.runtime_flags (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.runtime_flags enable row level security;

create policy "runtime_flags_select_service" on public.runtime_flags
  for select to service_role using (true);

create policy "runtime_flags_upsert_service" on public.runtime_flags
  for insert to service_role with check (true);

create policy "runtime_flags_update_service" on public.runtime_flags
  for update to service_role using (true) with check (true);
