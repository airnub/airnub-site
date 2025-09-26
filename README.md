# Airnub‑Site Monorepo

Monorepo for public‑facing sites using **one shared Supabase database** and a **single migrations directory**.

## Apps
- **Airnub company site** — https://airnub.io (apps/airnub)
- **Speckit microsite** — https://speckit.airnub.io (apps/speckit)

## Packages
- **@airnub/ui** — shared UI
- **@airnub/brand** — assets
- **@airnub/seo** — JSON‑LD & OG helpers
- **@airnub/db** — shared Supabase client + types

## Supabase
- Migrations live in `/supabase/migrations/` (single source of truth)
- Local dev: `supabase start` → edit schema → `pnpm db:diff -m "change"`
- Types: `pnpm db:types` → writes to `packages/db/src/types.ts`
- Remote apply: `pnpm db:link:staging && pnpm db:push` (CI handles staging/prod)

## Getting started
```bash
pnpm i
pnpm dev
# or: pnpm --filter ./apps/airnub dev
#     pnpm --filter ./apps/speckit dev
```

## Environment
Create `.env.local` in each app with the **same** Supabase project keys:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
(Use different keys per environment.)

## CI
- App CI: lint, typecheck, build; pa11y‑ci; link checker
- DB CI: `db-migrate.yml` pushes migrations to staging on merge; prod requires approval

## Trust
- Trust Center: https://trust.airnub.io (VDP + `/.well-known/security.txt`)
