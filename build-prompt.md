# Airnub‑Site — Build Agent Prompt (Full)

> **Copy‑paste this entire document into your coding agent.** It defines the role, deliverables, constraints, plan, and exact files/commands needed to build the Airnub corporate site (**airnub.io**) and the Speckit product microsite (**speckit.airnub.io**) inside a single monorepo with a **shared Supabase database** and **Turborepo** caching/CI.

---

## 0) Role & Objective

You are a senior full‑stack engineer. Implement a production‑ready web monorepo called **`airnub-site`** using **Next.js (App Router) + TypeScript + Tailwind**, **PNPM workspaces + Turborepo**, and a **single Supabase project** shared by all apps.

**Primary outcomes**

1. Ship **two sites** from one repo with shared packages:

   * **Company:** `apps/airnub` → [https://airnub.io](https://airnub.io)
   * **Speckit microsite:** `apps/speckit` → [https://speckit.airnub.io](https://speckit.airnub.io)
2. Use **one Supabase database** with central migrations & generated types.
3. Bake in **SEO** (Metadata API, sitemaps, robots, OG, JSON‑LD), **Accessibility** (WCAG 2.2 AA), and **Performance** (Core Web Vitals budgets).
4. Use **Turborepo** for pipelines and enable **remote cache** via CI env vars.

**Non‑goals**

* No third‑party trackers by default. No secrets hardcoded. Avoid storing plaintext IPs.
* Don’t implement an admin UI; only public marketing sites + lead capture.

---

## 1) Repository Layout (Create/Ensure)

```
airnub-site/
├─ apps/
│  ├─ airnub/                  # company site (airnub.io)
│  │  ├─ app/
│  │  ├─ components/
│  │  ├─ lib/
│  │  ├─ public/
│  │  └─ package.json
│  └─ speckit/                 # product microsite (speckit.airnub.io)
│     ├─ app/
│     ├─ components/
│     ├─ lib/
│     ├─ public/
│     └─ package.json
├─ packages/
│  ├─ ui/                      # shared Tailwind components (header/footer, buttons, cards)
│  ├─ brand/                   # logos, wordmarks, OG templates
│  ├─ seo/                     # JSON‑LD builders, OG helpers
│  └─ db/                      # shared Supabase client + generated types
│     ├─ src/client.ts
│     ├─ src/types.ts          # generated via CLI
│     └─ package.json
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/              # timestamped SQL migration files
│  └─ seed.sql                 # optional
├─ .github/workflows/
│  ├─ ci.yml                   # lint/typecheck/build (Turbo)
│  ├─ a11y.yml                 # pa11y‑ci on key routes
│  ├─ links.yml                # broken link checker
│  └─ db-migrate.yml           # gated migrations (staging → prod)
├─ turbo.json                  # Turborepo pipelines & caching
├─ pnpm-workspace.yaml
├─ package.json                # root scripts use turbo
├─ README.md                   # quickstart + commands
└─ AGENTS.md                   # roles, milestones, acceptance criteria
```

**pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Root package.json**

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
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

**turbo.json (root)**

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

**Per‑app package.json scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "a11y": "pa11y-ci || echo 'skip'",
    "links": "echo 'implement link check'",
    "sbom": "echo 'generate sbom'"
  }
}
```

---

## 2) Domains & Hosting (informational)

* **airnub.io** → hosts `apps/airnub` (corporate site)
* **speckit.airnub.io** → hosts `apps/speckit` (product microsite)
* **docs.speckit.dev** → GitHub Pages (Docusaurus, CNAME in docs repo)
* **trust.airnub.io** → Trust Center (separate site; link from both apps)

The user will configure DNS in AWS Route 53.

---

## 3) Shared Supabase — Schema, RLS, Types

All websites share **one** Supabase project and **one** migration history under `/supabase/migrations`.

**Create base table (migration SQL)**

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

-- Option A: allow insert from anon for public forms
create policy "leads_insert_anon" on public.contact_leads
  for insert to anon with check (true);

-- Reads restricted to service_role (server)
create policy "leads_read_service" on public.contact_leads
  for select to service_role using (true);

create index if not exists idx_contact_leads_created_at on public.contact_leads (created_at desc);
```

> If you prefer **server‑action only** inserts, remove the anon policy and call Supabase with the service role from a server action/Edge Function. Never expose the service role on the client.

**Types generation**

```bash
pnpm db:types
# writes to packages/db/src/types.ts
```

**packages/db**

`packages/db/package.json`

```json
{ "name": "@airnub/db", "version": "0.1.0", "main": "src/index.ts", "type": "module", "dependencies": { "@supabase/supabase-js": "^2.45.0" } }
```

`packages/db/src/client.ts`

```ts
import { createBrowserClient, createServerClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function getBrowserClient(url = process.env.NEXT_PUBLIC_SUPABASE_URL!, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!) {
  return createBrowserClient<Database>(url, anon);
}
export function getServerClient(cookies: () => any, url = process.env.NEXT_PUBLIC_SUPABASE_URL!, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!) {
  return createServerClient<Database>(url, anon, { cookies });
}
export type { Database } from "./types";
```

**Apps usage**

`apps/airnub/lib/supabase.ts`

```ts
import { getBrowserClient } from "@airnub/db";
export const supabase = getBrowserClient();
```

Server action example (Airnub; set `source: 'speckit'` in the Speckit app):

```ts
"use server";
import { cookies } from "next/headers";
import { getServerClient } from "@airnub/db";

export async function submitLead(input: { full_name?: string; email: string; company?: string; message?: string }) {
  const db = getServerClient(cookies);
  const { error } = await db.from("contact_leads").insert({ ...input, source: "airnub", consent: false });
  if (error) throw new Error(error.message);
}
```

**Env variables** (each app’s `.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 4) Pages, IA, and Navigation

### apps/airnub (company)

Routes: `/`, `/products`, `/solutions`, `/services`, `/resources`, `/company`, `/contact`, `/trust` (redirect → [https://trust.airnub.io](https://trust.airnub.io))

Header: Products · Solutions · Services · Resources · Trust · Company · Contact (right: GitHub org icon → [https://github.com/airnub](https://github.com/airnub))

Footer columns: Products (Speckit) · Resources (Docs/Blog/Changelog) · Open Source (org + key repos) · Trust (Trust Center, VDP, security.txt) · Company · Legal

### apps/speckit (product)

Routes: `/`, `/product`, `/how-it-works`, `/solutions/ciso`, `/solutions/devsecops`, `/template`, `/pricing`, `/contact`, `/trust` (redirect)

Header: Product · How it works · Solutions · Docs (→ [https://docs.speckit.dev](https://docs.speckit.dev)) · Pricing · Trust (→ [https://trust.airnub.io](https://trust.airnub.io)) (right: GitHub repo icon + optional **Star** button)

Footer columns: Product · Resources · Open Source (repo, template, issues, license) · Trust

**Metadata & SEO (both apps)**

* Use **Next.js Metadata API** in `app/layout.tsx`.
* Add `app/sitemap.ts` and `app/robots.ts`.
* Add dynamic OG image route: `app/api/og/route.ts`.
* Add JSON‑LD:

  * **Airnub:** `Organization` on root; `ItemList` of products on `/products` (Speckit entry linking to `https://speckit.airnub.io`).
  * **Speckit:** `SoftwareApplication` with `softwareHelp` → `https://docs.speckit.dev`.

**Accessibility & Performance**

* Include **Skip to content** link at top, keyboard‑navigable menus (Disclosure pattern), visible focus states, WCAG 2.2 AA contrast.
* Core Web Vitals budgets: **LCP ≤ 2.5s, INP < 200ms, CLS < 0.1**.

---

## 5) CI/CD

**ci.yml** (Turbo + remote cache placeholder)

```yaml
name: ci
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm i -w
      - name: Turbo remote cache
        env:
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
        run: echo "Turbo cache configured"
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm build
```

**a11y.yml** (pa11y‑ci)

```yaml
name: a11y
on: [pull_request]
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm i -w
      - name: Run pa11y-ci (targets defined per app)
        run: pnpm a11y
```

**links.yml** (placeholder)

```yaml
name: links
on: [pull_request]
jobs:
  links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "TODO: add link checker"
```

**db-migrate.yml** (staging auto, prod gated)

```yaml
name: db-migrate
on:
  push:
    branches: [main]
    paths: ["supabase/migrations/**"]
  workflow_dispatch:

jobs:
  migrate-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm i -w
      - name: Link staging
        run: supabase link --project-ref ${{ secrets.SUPABASE_STAGING_REF }}
      - name: Push migrations (staging)
        run: supabase db push --password ${{ secrets.SUPABASE_DB_PASSWORD_STAGING }}

  migrate-prod:
    needs: migrate-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm i -w
      - name: Link prod
        run: supabase link --project-ref ${{ secrets.SUPABASE_PROD_REF }}
      - name: Push migrations (prod)
        run: supabase db push --password ${{ secrets.SUPABASE_DB_PASSWORD_PROD }}
```

**Remote cache setup**

* Add **`TURBO_TEAM`** and **`TURBO_TOKEN`** secrets (Vercel Turborepo). Same values in CI and hosting provider for cross‑env cache.

---

## 6) Implementation Order (Do in this sequence)

1. **Workspace & Turbo**: root `package.json`, `pnpm-workspace.yaml`, `turbo.json`.
2. **Apps & packages**: scaffold `apps/airnub`, `apps/speckit`, and `packages/ui|brand|seo|db`.
3. **Supabase local**: `supabase start` → create `contact_leads` + policies → `pnpm db:diff -m "create_contact_leads"` → `pnpm db:types`.
4. **Headers/Footers**: shared components from `@airnub/ui` with GitHub/Trust links.
5. **Pages**: build required pages & routes in both apps; add Metadata API; OG routes; sitemaps/robots; JSON‑LD.
6. **Lead forms**: server‑action insert to `contact_leads` with source flag.
7. **CI**: add `ci.yml`, `a11y.yml`, `links.yml`, `db-migrate.yml` and verify green checks.
8. **Deploy**: user will connect domains in AWS; ensure canonical URLs and sitemaps submit cleanly.

---

## 7) Definition of Done (Acceptance)

* Both apps build & run; shared UI/SEO/DB packages work.
* Supabase migrations present; types generated; forms insert leads with correct `source`.
* Metadata, OG, sitemaps, robots, JSON‑LD implemented; a11y checks pass.
* CI pipelines green; staging DB auto‑migrates; prod gated.
* No secrets committed; env documented in READMEs.

---

## 8) Commands Cheat‑Sheet

```bash
# install & run
pnpm i
pnpm dev                      # dev all apps via Turbo
pnpm --filter ./apps/airnub dev
pnpm --filter ./apps/speckit dev

# supabase
supabase start                # local stack
pnpm db:diff -m "change"      # create migration from local changes
pnpm db:types                 # generate types to packages/db/src/types.ts

# build & test
pnpm build
pnpm lint && pnpm typecheck
pnpm a11y && pnpm links
```

---

## 9) Security/Privacy Notes

* Public forms: collect only necessary fields; mark consent and avoid storing IP or hash it with a salt stored server‑side.
* RLS denies reads to `anon`; only `service_role` can select leads.
* `security.txt` and VDP live on **[https://trust.airnub.io](https://trust.airnub.io)**; link clearly from headers/footers.

---

## 10) Copy seeds (you may reuse)

* **Airnub home strapline:** “Airnub builds governed, enterprise‑ready developer platforms.”
* **Speckit hero:** “End vibe‑coding. Ship secure, auditable releases.”
* **Outcomes (Speckit):** Governed spec loop → policy gates → evidence (SBOM, attestations, RTM).

---

## 11) Troubleshooting

* If Supabase env vars are missing, stub the form and log a console warning; do not crash.
* If a domain isn’t live yet, use relative links or placeholders; do not block the build.

---

**Deliver all code changes as PRs with Conventional Commits.** Ensure each PR includes a short checklist of affected apps, migrations, and CI updates.
