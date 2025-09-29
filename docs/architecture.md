# Architecture & Rendering

This monorepo hosts two Next.js App Router sites that share a Supabase backend and a set of UI packages. The apps are deployed with incremental static regeneration (ISR) wherever possible and only opt into fully dynamic rendering on a per-route basis.

## Apps

- **Airnub marketing site** (`apps/airnub`) — production at [airnub.io](https://airnub.io)
- **Speckit microsite** (`apps/speckit`) — production at [speckit.airnub.io](https://speckit.airnub.io)

## Shared packages

- `@airnub/ui` — shared UI primitives and layout components
- `@airnub/brand` — brand assets, logos, and OG templates
- `@airnub/seo` — helpers for JSON-LD and Open Graph metadata
- `@airnub/db` — Supabase client helpers and generated database types

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

## Rendering guidelines

All layouts stay Server Components. Marketing and content routes use **incremental static regeneration** with route-specific refresh cadences. Opt into request-time rendering only when a page genuinely needs `cookies()` or `headers()`.

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

> Need true SSR? Set `export const dynamic = 'force-dynamic'` (and `fetchCache = 'force-no-store'` if you must read per-request data) on the specific route instead of globally.

## Forms & Supabase usage

- Contact forms post to Server Actions (`submitLead`) that call `getServerClient(cookies)` from `@airnub/db`.
- Inserts happen only on the server; no Supabase client is shipped to the browser.
- Client Components belong under `components/client/`. CI runs `scripts/assert-no-client.js` to prevent stray `"use client"` directives elsewhere.

## Metadata, SEO, and accessibility

- Each route implements `generateMetadata`, and both apps expose `app/sitemap.ts`, `app/robots.ts`, and dynamic OG images.
- JSON-LD covers `Organization` for Airnub, `ItemList` for `/products`, and `SoftwareApplication` across Speckit pages.
- Accessibility targets WCAG 2.2 AA with a skip link, keyboard navigation, visible focus states, and maintained contrast ratios.
- Core Web Vitals budgets: LCP ≤ 2.5s, INP < 200ms, CLS < 0.1.

## Trust center

- Trust Center lives at [trust.airnub.io](https://trust.airnub.io) with the vulnerability disclosure program and `/.well-known/security.txt`.
- Link prominently from the shared headers and footers in both apps.
