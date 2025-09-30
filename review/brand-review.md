# Brand & Shared UI Review
_Generated: 2025-09-30T22:22:36.260Z_

## Addressed
- Central brand assets directory exists: `.brand/public/brand`.
- Brand assets are synced to `packages/brand/public/brand`.
- Root script `brand:sync` is present.
- Brand config file is present: packages/brand/src/brand.config.ts

## Outstanding
- [airnub] Missing import of brand tokens in `app/layout` (expected `@airnub/brand/runtime/tokens*.css`).
- [airnub] Shared site chrome not detected (expect imports from `@airnub/ui` and usage of <SiteHeader/> + <SiteFooter/>).
- [airnub] Missing `app/icon.tsx` route for favicon generation.
- [airnub] Missing `app/opengraph-image.tsx` route for OG images.
- [airnub] Tailwind not clearly wired to brand preset or CSS variables.
- [airnub] Found images outside `public/brand`: public/logos/cloudyard.svg, public/logos/forge.svg, public/logos/northbeam.svg.
- [speckit] Missing import of brand tokens in `app/layout` (expected `@airnub/brand/runtime/tokens*.css`).
- [speckit] Shared site chrome not detected (expect imports from `@airnub/ui` and usage of <SiteHeader/> + <SiteFooter/>).
- [speckit] Missing `app/icon.tsx` route for favicon generation.
- [speckit] Missing `app/opengraph-image.tsx` route for OG images.
- [speckit] Tailwind not clearly wired to brand preset or CSS variables.
- CI does not run `pnpm brand:sync` before build.

## App: airnub
- Tokens import: [31mNO[39m 
- Shared header/footer: [31mNO[39m (imports: —)
- Local header/footer files: —
- Icon route: NO
- OG route: NO; uses brand template: NO
- Tailwind brand preset/CSS vars: NO (apps/airnub/tailwind.config.ts)
- Hard-coded color hits: 0
- Stray images: public/logos/cloudyard.svg, public/logos/forge.svg, public/logos/northbeam.svg
- Asset drift → missing in app: [—]; extra in app: [—]

## App: speckit
- Tokens import: [31mNO[39m 
- Shared header/footer: [31mNO[39m (imports: @airnub/ui)
- Local header/footer files: —
- Icon route: NO
- OG route: NO; uses brand template: NO
- Tailwind brand preset/CSS vars: NO (apps/speckit/tailwind.config.ts)
- Hard-coded color hits: 0
- Stray images: —
- Asset drift → missing in app: [—]; extra in app: [—]
