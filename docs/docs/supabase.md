---
id: supabase
title: Supabase Guide
sidebar_position: 3
---
The monorepo uses a single Supabase project for both sites. Migrations, types, and helpers are shared through `@airnub/db`.

## Migrations & schema

- Author schema changes through files in `supabase/migrations/`. Avoid editing production directly.
- Generate new migrations with `pnpm db:diff -m "descriptive_message"` after updating the local database.
- Regenerate TypeScript types with `pnpm db:types`; the command writes to `packages/db/src/types.ts`.

### Shared lead capture table

```sql
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

-- Option A (public forms): anon inserts allowed
create policy "leads_insert_anon" on public.contact_leads
  for insert to anon with check (true);

-- Reads restricted to service_role only
create policy "leads_read_service" on public.contact_leads
  for select to service_role using (true);

create index if not exists idx_contact_leads_created_at on public.contact_leads (created_at desc);
```

Prefer server-action-only inserts for stricter control: omit the anon policy and call with the service role from the server.

## Local development

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and run `supabase start` from the repo root.
2. Sync environment files with `pnpm db:env:local`. The script reads `supabase status` and updates `.env.local`, `apps/airnub/.env.local`, and `apps/speckit/.env.local` without overwriting other values.
3. When credentials rotate (for example after `supabase stop && supabase start`), rerun `pnpm db:env:local`.
4. Link to remote projects when needed:
   - `pnpm db:link:staging && pnpm db:push`
   - `pnpm db:link:prod` (production is gated through CI)

## Environment variables

Copy `.env.example` to `.env.local` and to each app (if you keep separate files), then fill in the Supabase project keys:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_GRAPHQL_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

`pnpm db:env:local` also records the GraphQL endpoint, Studio/Mailpit URLs, and S3 credentials. Codespaces runs it automatically after startup.

## Port management

If you maintain multiple local Supabase projects, customize the ports in `supabase/config.toml` to avoid clashes:

```toml
project_id = "airnub-site-local"

[api]     # default 54321
port = 55421

[db]      # default 54322
port = 55422
shadow_port = 55420  # default 54320

[studio]  # default 54323
port = 55423

[inbucket]        # defaults 54324/54325/54326
port = 55424
smtp_port = 55425
pop3_port = 55426

[analytics]       # optional; defaults 54327/54328
port = 55427
vector_port = 55428
```

Restart the stack after changing ports:

```bash
supabase stop && supabase start
```
