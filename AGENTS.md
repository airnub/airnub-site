# AGENTS.md — Airnub‑Site Monorepo (Shared DB)

## Roles
- **Monorepo Lead Agent** — workspaces, shared packages, CI.
- **DB/Migrations Agent** — owns schema, RLS, migrations, types.
- **Airnub App Agent** — builds apps/airnub pages and integrates @airnub/db.
- **Speckit App Agent** — builds apps/speckit pages and integrates @airnub/db.
- **Content Agent** — copy for Home/Products/Solutions/Services and Speckit pages.
- **Trust Agent** — Trust Center links, VDP/security.txt coordination.
- **QA Agent** — a11y, links, metadata, CWV smoke, DB CI checks.

## Guardrails
1. **DB**: All schema changes via migration files under `supabase/migrations/`. No direct prod edits.
2. **RLS**: Public tables allow only the minimum required (insert‑only for forms). Reads restricted to service role.
3. **Types**: Regenerate after schema changes; apps must compile against `@airnub/db` types.
4. **Apps**: Every route defines `generateMetadata`; sitemaps, robots, JSON‑LD present; headers/footers link to GitHub + Trust.
5. **A11y/CWV**: WCAG 2.2 AA; LCP ≤ 2.5s, INP < 200ms, CLS < 0.1.

## Milestone 1 — Monorepo & packages
- Init PNPM workspaces; scaffold apps + packages.
- Add `packages/db` with client + placeholder `types.ts`.
- Add `supabase/config.toml`.
**Acceptance**: `pnpm i && pnpm build` passes for both apps.

## Milestone 2 — Supabase local & base schema
- `supabase start`; create `contact_leads` + RLS policies; `pnpm db:diff -m "create_contact_leads"`.
- `pnpm db:types` to generate types.
**Acceptance**: Migration file created; types compile in both apps.

## Milestone 3 — Pages & forms
- Build required pages in both apps; implement `submitLead` server actions using `@airnub/db`.
**Acceptance**: Lead inserts succeed from both apps; `source` is correct.

## Milestone 4 — CI (apps + DB)
- Add app CI; add `db-migrate.yml` for staging on merge; prod gated.
**Acceptance**: CI green; staging migrations apply automatically on merge.

## Milestone 5 — Launch
- Configure DNS; deploy both apps; verify Search Console; submit sitemaps.
**Acceptance**: Sites live; Trust links resolve; basic CWV telemetry enabled.
