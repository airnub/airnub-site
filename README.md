# Airnub-Site Monorepo

Marketing sites for Airnub and Speckit that share a Supabase backend, a component library, and Turborepo-powered tooling. Both apps run on the Next.js App Router with incremental static regeneration by default.

## What's inside

- **Airnub marketing site** (`apps/airnub`) — [airnub.io](https://airnub.io)
- **Speckit microsite** (`apps/speckit`) — [speckit.airnub.io](https://speckit.airnub.io)
- Shared packages under `packages/` for UI, brand assets, SEO helpers, and Supabase access

See [Architecture & Rendering](https://airnub.github.io/airnub-site/docs/architecture) (also available at [`docs/docs/architecture.md`](docs/docs/architecture.md)) for the full layout and rendering guidelines.

## Prerequisites

- Node.js 24.x
- [pnpm](https://pnpm.io/) 10+
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Quick start

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env.local` (and to each app if you maintain app-specific files).
3. Start the local Supabase stack and sync credentials:
   ```bash
   supabase start
   pnpm db:env:local
   ```
4. Run the development servers:
   ```bash
   pnpm dev
   ```

`pnpm dev` launches both apps in parallel. Use `pnpm --filter ./apps/airnub dev` or `pnpm --filter ./apps/speckit dev` to run a single app.

## Brand assets & overrides

Canonical brand assets live in [`.brand/public/brand/`](.brand/public/brand/), while the shared TypeScript config stays in [`packages/brand/src/brand.config.ts`](packages/brand/src/brand.config.ts). Running the sync script copies the assets into each app's `public/brand/` directory and regenerates runtime-friendly files in [`packages/brand/runtime/`](packages/brand/runtime/).

After editing anything under `.brand/` (images or supporting files), run:

```bash
pnpm brand:sync
```

This command will:

- Copy `.brand/public/brand/` into `packages/brand/public/brand/` and both apps' `public/brand/` folders so `/brand/*` requests resolve everywhere.
- Regenerate `packages/brand/runtime/brand.config.json` and `packages/brand/runtime/tokens.css` so runtime code and CSS can safely consume the shared brand tokens without bundling TypeScript.

If you need to tweak metadata (name, colors, social links, etc.), you can either edit [`packages/brand/src/brand.config.ts`](packages/brand/src/brand.config.ts) directly or provide environment overrides before running the sync script. Supported variables include:

- `BRAND_NAME`, `BRAND_DOMAIN`, `BRAND_DESCRIPTION`
- `BRAND_COLOR_PRIMARY`, `BRAND_COLOR_SECONDARY`, `BRAND_COLOR_ACCENT`, `BRAND_COLOR_BACKGROUND`, `BRAND_COLOR_FOREGROUND`
- `BRAND_LOGO_LIGHT`, `BRAND_LOGO_DARK`, `BRAND_LOGO_MARK`
- `BRAND_FAVICON`, `BRAND_OG`
- `BRAND_SOCIAL_*` (e.g., `BRAND_SOCIAL_GITHUB`, `BRAND_SOCIAL_LINKEDIN`, `BRAND_SOCIAL_PRODUCT_HUNT`)

After updating any of these values, re-run `pnpm brand:sync` so the runtime outputs stay fresh.

## Additional documentation

- [Architecture & Rendering](https://airnub.github.io/airnub-site/docs/architecture) ([local](docs/docs/architecture.md))
- [Supabase Guide](https://airnub.github.io/airnub-site/docs/supabase) ([local](docs/docs/supabase.md))
- [Local Development](https://airnub.github.io/airnub-site/docs/development) ([local](docs/docs/development.md))
- [CI & Contribution Workflow](https://airnub.github.io/airnub-site/docs/ci) ([local](docs/docs/ci.md))
- [Remote Operations](https://airnub.github.io/airnub-site/docs/remote-operations) ([local](docs/docs/remote-operations.md))

## Contributing

Follow Conventional Commits (`feat:`, `fix:`, `docs:` …) and keep secrets out of the repository. See the [CI & Contribution Workflow](./docs/ci.md) for enforcement details.

## License

Licensed under the terms described in [`LICENSE`](./LICENSE) unless noted otherwise by an individual package or app.
