# Airnub‑Site Monorepo

Monorepo for public‑facing sites using **one shared Supabase database** and a **single migrations directory**. Built with **Next.js (App Router) + TypeScript + Tailwind**, **PNPM workspaces + Turborepo**, and **SSR‑first** rendering.

---

## Apps

* **Airnub company site** — [https://airnub.io](https://airnub.io) (`apps/airnub`)
* **Speckit microsite** — [https://speckit.airnub.io](https://speckit.airnub.io) (`apps/speckit`)

## Packages

* **`@airnub/ui`** — shared UI (headers/footers, buttons, cards)
* **`@airnub/brand`** — brand assets (logos, OG templates)
* **`@airnub/seo`** — JSON‑LD & Open Graph helpers
* **`@airnub/db`** — shared Supabase client + generated DB types

---

## Repository layout

```
airnub-site/
├─ apps/
│  ├─ airnub/
│  └─ speckit/
├─ packages/
│  ├─ ui/
│  ├─ brand/
│  ├─ seo/
│  └─ db/
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/
│  └─ seed.sql (optional)
├─ .github/workflows/
│  ├─ ci.yml
│  ├─ a11y.yml
│  ├─ links.yml
│  └─ db-migrate.yml
├─ turbo.json
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md
```

---

## SSR‑first policy

Render everything on the **server** unless absolutely unavoidable.

Add this at each app root layout (or top segment layout):

```ts
export const dynamic = "force-dynamic";   // disable static optimization
export const revalidate = 0;               // no ISR by default
export const fetchCache = "force-no-store"; // server fetch = no-store
```

Use **Server Actions** for forms; avoid client data fetching. Only small UI widgets should be Client Components (`"use client"`), and never call Supabase from the client.

---

## Supabase

* **Migrations:** live in `/supabase/migrations/` (single source of truth)
* **Local dev:** `supabase start` → edit schema → `pnpm db:diff -m "change"`
* **Types:** `pnpm db:types` → writes to `packages/db/src/types.ts`
* **Remote apply:** `pnpm db:link:staging && pnpm db:push` (CI handles staging/prod)

### Shared schema (lead capture)

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

> Prefer **server‑action only** inserts for stricter control: remove the anon insert policy and call with the service role from the server.

### Local ports quick‑fix (avoid clashes)

If you run multiple local Supabase projects, set unique ports in **`supabase/config.toml`**:

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

Restart:

```bash
supabase stop && supabase start
```

---

## Environment

Create `.env.local` in each app with the **same** Supabase project keys:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

(Use different keys per environment.)

---

## Getting started

```bash
pnpm i
pnpm dev
# or: pnpm --filter ./apps/airnub dev
#     pnpm --filter ./apps/speckit dev
```

---

## Scripts & Turborepo

Root `package.json` (scripts use Turbo):

```json
{
  "name": "airnub-site",
  "private": true,
  "packageManager": "pnpm@9",
  "scripts": {
    "dev": "turbo run dev --parallel --no-cache",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "a11y": "turbo run a11y",
    "links": "turbo run links",
    "sbom": "turbo run sbom",
    "db:types": "supabase gen types typescript --local --schema public > packages/db/src/types.ts",
    "db:link:staging": "supabase link --project-ref $SUPABASE_STAGING_REF",
    "db:link:prod": "supabase link --project-ref $SUPABASE_PROD_REF",
    "db:push": "supabase db push",
    "db:diff": "supabase db diff --use-mig-dir supabase/migrations",
    "db:reset:local": "supabase stop || true && supabase start && supabase db reset"
  },
  "devDependencies": { "turbo": "^2.0.0" }
}
```

`turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["pnpm-lock.yaml"],
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**", "!.next/cache/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "outputs": [] },
    "typecheck": { "outputs": [] },
    "a11y": { "outputs": [] },
    "links": { "outputs": [] },
    "sbom": { "outputs": ["sbom-*.json"] }
  }
}
```

**Remote cache:** add GitHub secrets `TURBO_TEAM` and `TURBO_TOKEN` (from Vercel → Turborepo) to enable cross‑env caching.

---

## SEO, Accessibility & Performance

* **SEO:** per‑route `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`, dynamic OG images, JSON‑LD (`Organization` on Airnub, `ItemList` on `/products`, `SoftwareApplication` on Speckit).
* **A11y:** WCAG 2.2 AA; skip link; keyboard nav; visible focus; color contrast.
* **CWV budgets:** LCP ≤ 2.5s, INP < 200ms, CLS < 0.1. Avoid layout shift and unnecessary hydration.

---

## CI

* **App CI:** lint, typecheck, build (Turbo); pa11y‑ci; link checker
* **DB CI:** `db-migrate.yml` pushes migrations to **staging** on merge; **prod** requires manual approval

---

## Trust

* **Trust Center:** [https://trust.airnub.io](https://trust.airnub.io) (VDP + `/.well-known/security.txt`)
* Link clearly from headers/footers of both apps.

---

## Contributing

* Conventional Commits (`feat:`, `fix:`, `docs:`…)
* No secrets in the repo; use `.env`/secrets. Prefer server‑action‑only Supabase writes.

---

## License

* See individual package/app licenses or the root LICENSE if present.
