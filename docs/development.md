# Local Development

## Prerequisites

- Node.js 24.x (see the `package.json` engines field)
- [pnpm](https://pnpm.io/) 10+
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Install dependencies

```bash
pnpm install
```

## Running the apps

Start the Supabase stack (see [Supabase Guide](./supabase.md)), then run the development servers:

```bash
pnpm dev
```

Turborepo launches both apps in parallel (`apps/airnub` on port 3000 and `apps/speckit` on 3001). Use `pnpm --filter ./apps/airnub dev` or `pnpm --filter ./apps/speckit dev` for individual processes.

## Useful scripts

The root `package.json` exposes the following Turbo-powered scripts:

```json
{
  "dev": "turbo run dev --parallel --cache=local:r,remote:r",
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
  "db:env:local": "node scripts/sync-supabase-env.mjs",
  "db:reset:local": "supabase stop || true && supabase start && supabase db reset"
}
```

Remote caching is available once `TURBO_TEAM` and `TURBO_TOKEN` are configured in the repository secrets.

## GitHub Codespaces workflow

The `.devcontainer` sets up Node 24, pnpm, and the Supabase CLI. When a Codespace starts:

1. Copy the example environment file into each location:

   ```bash
   cp .env.example .env.local
   cp .env.example apps/airnub/.env.local
   cp .env.example apps/speckit/.env.local
   ```

2. The post-start hooks run `supabase start` and `pnpm db:env:local` so Docker services boot and environment files receive current credentials.
3. If the Supabase stack stops, rerun `supabase start` followed by `pnpm db:env:local`.
4. Forward ports 3000 (Airnub), 3001 (Speckit), 54321 (Supabase API), and optionally 54323 (Supabase Studio).
5. Keep the Codespace running while Supabase containers are needed; stop them with `supabase stop` when done.
