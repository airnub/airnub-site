# Brand Pack Quickstart

This guide walks you through the minimal set of steps required to restyle the marketing sites with a new brand pack.

## 1. Adjust the shared `theme.css`

Both apps import the shared theme layer from `@airnub/ui/styles.css`. That file serves as our canonical `theme.css` and is responsible for exposing CSS custom properties (`--background`, `--primary`, and so on) that the component library consumes.

1. Open [`packages/ui/styles.css`](../ui/styles.css).
2. Update the CSS variables or Tailwind utility layers you need (for example, adjust `--radius` or override semantic colors).
3. Keep the variables mapped to the brand token fallbacks (for example, `var(--brand-primary)`) so deployments that rely on environment overrides continue to work.
4. Commit the changes so downstream forks pick up your new `theme.css` definition.

If you need to tweak spacing or layout primitives, edit [`packages/brand/runtime/layout.css`](./runtime/layout.css); it is imported by `styles.css` alongside the tokens and behaves like an extended `theme.css` layer.

## 2. Swap brand assets

The editable source assets live in [`.brand/public/brand/`](../../.brand/public/brand/). Replace the contents of that folder with your logo set:

- `logo.svg`
- `logo-dark.svg`
- `logo-mark.svg`
- `favicon.svg`
- `og.png`

Keep filenames consistent—`pnpm brand:sync` expects those exact names.

## 3. Edit navigation definitions

Update [`packages/brand/src/navigation.ts`](./src/navigation.ts) if the information architecture changes. Both apps read the strongly typed navigation trees defined there, so adjusting a link in this file automatically updates the shared headers and footers.

- Update the Airnub tree exported as `airnubNavigation`.
- Update the Speckit tree exported as `speckitNavigation`.
- Preserve the shape (`title`, `href`, `children`) so the apps stay type-safe.

## 4. Apply environment overrides (optional)

Set environment variables before running the sync if you need to override colors, metadata, or social links at build time:

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

Any `BRAND_SOCIAL_*` or `BRAND_CONTACT_*` variable is camel-cased in the generated config (for example, `BRAND_SOCIAL_PRODUCT_HUNT` becomes `productHunt`).

## 5. Run the sync

Execute the sync script from the repository root:

```bash
pnpm brand:sync
```

The script copies `.brand/public/brand/` into `packages/brand/public/brand/` and each app’s `public/brand/` directory, then regenerates:

- [`packages/brand/runtime/brand.config.json`](./runtime/brand.config.json)
- [`packages/brand/runtime/tokens.css`](./runtime/tokens.css)
- [`packages/brand/runtime/tokens-speckit.css`](./runtime/tokens-speckit.css)
- [`packages/brand/runtime/navigation.json`](./runtime/navigation.json)

## 6. Verify the updates

1. Run `pnpm validate:ui` to ensure no inline colors or rogue `dark:` classes slipped into the UI components.
2. Start the apps (`pnpm dev`) or build them (`pnpm -w build`) to confirm the new assets, metadata, and navigation render correctly.

That’s it—your updated `theme.css`, assets, and navigation will now flow through both marketing sites.
