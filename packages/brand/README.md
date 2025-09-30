# @airnub/brand — Central Brand Pack

This package is the single source of truth for logos, colors, navigation, and metadata that the Airnub and Speckit apps share.

- Assets originate from [`.brand/public/brand/`](../../.brand/public/brand/)
- Runtime outputs live under [`packages/brand/runtime/`](./runtime/)
- UI chrome consumes the tokens via [`packages/ui/`](../ui/)

Running `pnpm brand:sync` copies the source assets into this package, pushes them into each app, and regenerates the runtime files described below.

## How the sync pipeline works

```
.brand/public/brand/*      # editable assets committed by each fork
          │
          ├─ pnpm brand:sync → packages/brand/public/brand/*
          │                     packages/brand/runtime/brand.config.json
          │                     packages/brand/runtime/tokens.css
          │                     packages/brand/runtime/tokens-speckit.css
          │                     packages/brand/runtime/navigation.json
          └─ pnpm brand:sync → apps/airnub/public/brand/*
                                apps/speckit/public/brand/*
```

- `brand.config.json` — resolved metadata + colors (includes environment overrides)
- `tokens.css` — CSS variables consumed by both apps
- `tokens-speckit.css` — Speckit-specific overrides loaded where needed
- `navigation.json` — generated navigation snapshot for tooling (apps read TypeScript definitions at runtime)

## Rebranding in three steps

1. Swap the assets inside `.brand/public/brand/`:
   - `logo.svg`
   - `logo-dark.svg`
   - `logo-mark.svg`
   - `favicon.svg`
   - `og.png`
2. (Optional) Set environment variables before running the sync so metadata and colors follow suit:
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
   Any `BRAND_SOCIAL_*` or `BRAND_CONTACT_*` variable is camel-cased into the final JSON (`BRAND_SOCIAL_PRODUCT_HUNT` → `productHunt`).
3. Run the sync:
   ```bash
   pnpm brand:sync
   ```

Both apps will now pick up the new assets and tokens without touching their own `public/` folders. Build or start dev servers as normal (`pnpm -w build`, `pnpm dev`).

## Consuming the brand package

- Apps import CSS variables from `@airnub/brand/runtime/tokens.css`
- Speckit can opt into `@airnub/brand/runtime/tokens-speckit.css` for its accent tweaks
- `buildBrandMetadata` from [`src/metadata.ts`](./src/metadata.ts) centralises default icons, favicons, and Open Graph metadata for Next.js layouts
- The `/api/og` routes in each app read the PNG path exported by `@airnub/brand/server` (`ogTemplate`) and stream the static image defined in this package
- `airnubNavigation` / `speckitNavigation` in [`src/navigation.ts`](./src/navigation.ts) provide the TypeScript definitions the apps adapt into their headers and footers

If you need to override values programmatically, use `resolveBrandConfig` from [`src/brand.config.ts`](./src/brand.config.ts).

## Guardrails for forks

- Keep every brand asset in `.brand/public/brand/`
- Avoid hard-coding hex colors; consume the CSS custom properties instead
- Regenerate runtime files by running `pnpm brand:sync` in CI before building apps
- Commit regenerated assets when they change so downstream forks have the latest baseline

Need more context? The root [`README.md`](../../README.md#-branding--rebranding) and [`docs/docs/branding.md`](../../docs/docs/branding.md) walk through the full pipeline with diagrams and troubleshooting tips.
