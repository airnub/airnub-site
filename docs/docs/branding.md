---
id: branding
title: Branding, Theming & Rebranding
sidebar_position: 0
---

# Branding, Theming & Rebranding

The Airnub monorepo uses a central brand pack so both marketing apps stay in sync and forks can apply a new identity without touching application code.

## Goals

- **Single source of truth** for logos, colors, navigation, and metadata
- **Shared UI chrome** (headers, footers, cards) powered by `@airnub/ui`
- **No per-app overrides**—every app imports the same runtime tokens
- **Fork-friendly** so swapping assets + environment variables triggers a full rebrand

## Overview

| Piece | Location | Purpose |
| --- | --- | --- |
| Editable assets | `.brand/public/brand/` | Drop-in SVG/PNG source files committed by each fork |
| Brand package | `packages/brand/` | Exposes config, CSS tokens, OG template, navigation |
| Runtime tokens | `packages/brand/runtime/` | Generated CSS + JSON consumed at build/runtime |
| Shared UI | `packages/ui/` | Header, footer, cards, and other brand-aware components |
| Apps | `apps/airnub`, `apps/speckit` | Import tokens and shared chrome automatically |

## Rebrand checklist

1. Replace the assets inside `.brand/public/brand/`:
   - `logo.svg`
   - `logo-dark.svg`
   - `logo-mark.svg`
   - `favicon.svg`
   - `og.png`
2. (Optional) Export environment overrides so metadata and colors update along with the imagery:
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
   - Any `BRAND_SOCIAL_*` or `BRAND_CONTACT_*` variable is camel-cased into the runtime JSON (for example `BRAND_SOCIAL_PRODUCT_HUNT` → `productHunt`).
   - Leave variables unset to fall back to the defaults defined in [`packages/brand/src/brand.config.ts`](../../packages/brand/src/brand.config.ts).
3. Regenerate the runtime artifacts:
   ```bash
   pnpm brand:sync
   ```
4. Build or start your apps (`pnpm -w build`, `pnpm dev`). Both apps import the refreshed tokens and assets automatically.

## How the sync script works

```mermaid
flowchart LR
  A[.brand/public/brand/*] -- pnpm brand:sync --> B[packages/brand/public/brand/*]
  A -- pnpm brand:sync --> C[apps/*/public/brand/*]
  B -- tokens.json/css --> D[@airnub/brand runtime/*]
  D --> E[apps import tokens.css + OG template]
  D --> F[@airnub/ui consumes navigation]
```

- `packages/brand/runtime/brand.config.json` stores the resolved metadata (including env overrides).
- `packages/brand/runtime/tokens.css` exposes CSS variables for both apps.
- `packages/brand/runtime/tokens-speckit.css` contains Speckit-specific tweaks that components import as needed.
- `packages/brand/runtime/navigation.json` keeps header/footer navigation consistent.

## Where the apps hook in

- `apps/*/app/layout.tsx` imports `@airnub/brand/runtime/tokens.css`.
- `apps/*/app/opengraph-image.tsx` re-exports `@airnub/brand/og/template`.
- `apps/*/app/icon.tsx` loads `/brand/favicon.svg`.
- `@airnub/ui` components load navigation data from the runtime JSON.

Because every app reads from the same runtime outputs, you should **not** keep brand assets or duplicated CSS in app directories (except the generated `public/brand/` copies that the sync script writes).

## Forking guidelines

- Commit your new assets under `.brand/public/brand/` so downstream forks inherit your defaults.
- Run `pnpm brand:sync` during CI/CD before building apps to guarantee runtime files are fresh.
- Avoid hard-coding colors or image paths in new components—prefer the CSS variables and public URLs produced by the brand package.
- If one fork needs a different theme per app, export different `BRAND_*` env vars per deployment target.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Logos did not update | Confirm you replaced files in `.brand/public/brand/` **and** ran `pnpm brand:sync`. Check that your build pipeline runs the sync before Next.js compiles. |
| Colors still default | Ensure the `BRAND_COLOR_*` env vars are available at build time (not just runtime). Remove stale caches in `.next/` if developing locally. |
| OG image stale | Make sure `app/opengraph-image.tsx` re-exports the template from `@airnub/brand/og/template`. Delete `.next/cache` when testing locally. |
| Unexpected navigation links | Update `airnubNavigation` / `speckitNavigation` in [`packages/brand/src/index.ts`](../../packages/brand/src/index.ts) and re-run the sync. |

For more detail, refer back to the root [`README.md`](../../README.md#-branding--rebranding) or the package-level [`README`](../../packages/brand/README.md).
