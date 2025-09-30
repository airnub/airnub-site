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

## 🎨 Branding & Rebranding

Both marketing apps share a single brand pack so forks only have to update one place.

- **Source of truth (editable assets):** [`.brand/public/brand/`](.brand/public/brand/)
- **Runtime package:** [`packages/brand/`](packages/brand/) (ships config, CSS tokens, OG template, and navigation JSON)
- **Shared UI chrome:** [`packages/ui/`](packages/ui/) (headers, footers, cards, etc.)

### Quick rebrand checklist

1. Replace the assets in `.brand/public/brand/` with your own:
   - `logo.svg` (light/primary lockup)
   - `logo-dark.svg` (dark theme lockup)
   - `logo-mark.svg` (square mark)
   - `favicon.svg`
   - `og.png` (Open Graph / social background)
2. (Optional) Configure environment overrides for metadata and colors before building:
   ```bash
   export BRAND_NAME="YourCo"
   export BRAND_DOMAIN="yourco.example"
   export BRAND_DESCRIPTION="Your product tagline"
   export BRAND_COLOR_PRIMARY="#2563eb"
   export BRAND_COLOR_SECONDARY="#0f172a"
   export BRAND_COLOR_ACCENT="#1d4ed8"
   export BRAND_COLOR_BACKGROUND="#ffffff"
   export BRAND_COLOR_FOREGROUND="#111827"
   export BRAND_LOGO_LIGHT="/brand/logo.svg"
   export BRAND_LOGO_DARK="/brand/logo-dark.svg"
   export BRAND_LOGO_MARK="/brand/logo-mark.svg"
   export BRAND_FAVICON="/brand/favicon.svg"
   export BRAND_OG="/brand/og.png"
   export BRAND_SOCIAL_GITHUB="https://github.com/yourco"
   export BRAND_CONTACT_SUPPORT="support@yourco.example"
   ```
   Any `BRAND_SOCIAL_*` or `BRAND_CONTACT_*` variable is camel-cased into the runtime config (for example `BRAND_SOCIAL_PRODUCT_HUNT` → `productHunt`).
3. Run the sync script so both apps pick up the new pack and regenerated runtime files:
   ```bash
   pnpm brand:sync
   ```
4. Build or start your apps as usual (`pnpm -w build` or `pnpm dev`). No per-app asset edits are required.

The sync script copies `.brand/public/brand/` into `packages/brand/public/brand/` and each app's `public/brand/` directory, then regenerates:

- [`packages/brand/runtime/brand.config.json`](packages/brand/runtime/brand.config.json)
- [`packages/brand/runtime/tokens.css`](packages/brand/runtime/tokens.css)
- [`packages/brand/runtime/tokens-speckit.css`](packages/brand/runtime/tokens-speckit.css)
- [`packages/brand/runtime/navigation.json`](packages/brand/runtime/navigation.json)

Apps import the CSS tokens in `app/layout.tsx` and delegate their Open Graph image + favicons to `@airnub/brand`, so rebrands propagate automatically.

Forks that want to diverge from the default brand can commit their own `.brand/public/brand/` assets, set the appropriate `BRAND_*` environment variables in CI/deploy, and run `pnpm brand:sync` during the build pipeline.

## Additional documentation

- [Architecture & Rendering](https://airnub.github.io/airnub-site/docs/architecture) ([local](docs/docs/architecture.md))
- [Branding & Rebranding](https://airnub.github.io/airnub-site/docs/branding) ([local](docs/docs/branding.md))
- [Supabase Guide](https://airnub.github.io/airnub-site/docs/supabase) ([local](docs/docs/supabase.md))
- [Local Development](https://airnub.github.io/airnub-site/docs/development) ([local](docs/docs/development.md))
- [CI & Contribution Workflow](https://airnub.github.io/airnub-site/docs/ci) ([local](docs/docs/ci.md))
- [Remote Operations](https://airnub.github.io/airnub-site/docs/remote-operations) ([local](docs/docs/remote-operations.md))

## Contributing

Follow Conventional Commits (`feat:`, `fix:`, `docs:` …) and keep secrets out of the repository. See the [CI & Contribution Workflow](./docs/ci.md) for enforcement details.

## License

Licensed under the terms described in [`LICENSE`](./LICENSE) unless noted otherwise by an individual package or app.
