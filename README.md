# Airnub-Site Monorepo

Marketing sites for Airnub and Speckit that share a Supabase backend, a component library, and Turborepo-powered tooling. Both apps run on the Next.js App Router with incremental static regeneration by default.

## What's inside

- **Airnub marketing site** (`apps/airnub`) — [airnub.io](https://airnub.io)
- **Speckit microsite** (`apps/speckit`) — [speckit.airnub.io](https://speckit.airnub.io)
- Shared packages under `packages/` for UI, brand assets, SEO helpers, and Supabase access

See [Architecture & Rendering](./docs/architecture.md) for the full layout and rendering guidelines.

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

## Additional documentation

- [Architecture & Rendering](./docs/architecture.md)
- [Supabase Guide](./docs/supabase.md)
- [Local Development](./docs/development.md)
- [CI & Contribution Workflow](./docs/ci.md)
- [Remote Operations](./docs/remote-operations.md)

## Contributing

Follow Conventional Commits (`feat:`, `fix:`, `docs:` …) and keep secrets out of the repository. See the [CI & Contribution Workflow](./docs/ci.md) for enforcement details.

## License

Licensed under the terms described in [`LICENSE`](./LICENSE) unless noted otherwise by an individual package or app.
