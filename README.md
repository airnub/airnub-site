# Airnub‑Site Monorepo

Monorepo for public‑facing sites using **one shared Supabase database** and a **single migrations directory**. Built with **Next.js (App Router) + TypeScript + Tailwind**, **PNPM workspaces + Turborepo**, and a **hybrid ISR/SSR** rendering model.

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

## Hybrid rendering policy

All layouts stay Server Components. Marketing and content routes use **Incremental Static Regeneration** with per-route refresh schedules, and we only opt into request-time rendering when a page truly requires `cookies()`/`headers()` access.

### Airnub revalidate schedule

| Route | Revalidate |
| --- | --- |
| `/` | 86,400s (24h) |
| `/products` | 86,400s |
| `/solutions` | 604,800s (7d) |
| `/services` | 86,400s |
| `/resources` | 21,600s (6h) |
| `/company` | 604,800s |
| `/contact` | 86,400s |
| `/trust` | static redirect |

### Speckit revalidate schedule

| Route | Revalidate |
| --- | --- |
| `/` | 86,400s |
| `/product` | 86,400s |
| `/how-it-works` | 604,800s |
| `/solutions` | 604,800s |
| `/solutions/ciso` | 604,800s |
| `/solutions/devsecops` | 604,800s |
| `/template` | 604,800s |
| `/pricing` | 3,600s |
| `/contact` | 86,400s |
| `/trust` | static redirect |

> Need true SSR? Set `export const dynamic = 'force-dynamic'` (and `fetchCache = 'force-no-store'` if you must read per-request data) **per route** instead of globally.

### Forms & Supabase

* Contact forms in both apps post to Server Actions (`submitLead`) that call `getServerClient(cookies)` from `@airnub/db`.
* Inserts happen on the server only; no Supabase client is shipped to the browser.
* Client Components belong under `components/client/`. The repo ships `scripts/assert-no-client.js`, which CI runs to prevent stray `"use client"` directives elsewhere.

JSON-LD, Metadata API, sitemaps, robots.txt, and OG image routes are part of every app’s surface.

---

## Runtime configuration

* **Internationalization:** The Airnub app uses [`next-intl`](https://next-intl.dev/) with path-based routing. Supported locales live in `apps/airnub/i18n/routing.ts` (default `en`, secondary `es`). Add translations in `apps/airnub/messages/<locale>.json` and they’ll be picked up automatically.
* **Maintenance gate:** Set `MAINTENANCE_MODE=true` in the environment to swap every page for the “coming soon” message while keeping APIs online. Update the copy via `apps/airnub/messages/*`.

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

Copy `.env.example` to `.env.local` (for each app if you maintain separate files) and update it with your Supabase project keys:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

(Use different keys per environment.)

## GitHub Codespaces

The repo ships with a `.devcontainer/` that provisions Node 24, pnpm, and the Supabase CLI. To spin up a Codespace with a fully local Supabase stack:

1. Create a Codespace from the repository (the first boot runs `pnpm install` automatically).
2. Copy environment files inside the Codespace:

   ```bash
   cp .env.example .env.local
   cp .env.example apps/airnub/.env.local
   cp .env.example apps/speckit/.env.local
   ```

3. Start the local Supabase services and capture the generated keys:

   ```bash
   supabase start
   supabase status --local
   ```

   Use the printed `anon` and `service_role` keys to update the `.env.local` files. Set `NEXT_PUBLIC_SUPABASE_URL` to the forwarded Codespace URL for port **54321** (for example, `https://<codespace-id>-54321.app.github.dev`) so that browser requests reach the local Supabase API. Keep the Postgres connection string values pointing at `127.0.0.1` for server-side access.

4. Forward the dev servers and Supabase ports:
   * 3000 → Airnub app (`apps/airnub`)
   * 3001 → Speckit app (`apps/speckit`)
   * 54321 → Supabase API
   * 54323 → Supabase Studio (optional, if you want the GUI)

5. In one terminal tab, run both apps concurrently:

   ```bash
   pnpm dev
   ```

   Turborepo starts `next dev` in parallel for both apps; accept the port prompt if Next.js asks to increment from 3000. If you prefer isolated processes, use `pnpm --filter ./apps/airnub dev` and `pnpm --filter ./apps/speckit dev` in separate terminals.

6. The Supabase containers continue running in the background once started; keep the Codespace alive while you work, and run `supabase stop` when you are finished to free resources.

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
    "db:reset:local": "supabase stop || true && supabase start && supabase db reset",
    "prepare": "husky"
  },
  "devDependencies": {
    "@commitlint/cli": "^20.0.0",
    "@commitlint/config-conventional": "^20.0.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "globby": "^14.1.0",
    "husky": "^9.1.7",
    "pa11y-ci": "^3.1.0",
    "turbo": "^2.0.0"
  }
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

## CI & commit rules

* **Conventional commits:** Husky installs a `commit-msg` hook (`pnpm prepare`) that runs `pnpm commitlint --edit $1`.
* **Semantic PR title:** `amannn/action-semantic-pull-request` enforces PR titles that follow Conventional Commits.
* **CI pipeline (`ci.yml`):** checkout → install → commitlint (PRs) → semantic title (PRs) → lint → typecheck → `node scripts/assert-no-client.js` → build (Turbo remote cache ready).
* **Additional workflows:** pa11y (`a11y.yml`), link checking (`links.yml`), and Supabase staging deploys (`db-migrate.yml`).

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
