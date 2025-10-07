# Build Failure Report

## pnpm -w build
- **apps/adf**: `next build` fails because TypeScript cannot resolve `next-intl/server` when compiling `app/[locale]/(marketing)/page.tsx`.

## pnpm -w typecheck
- **TS2307** (`apps/adf/app/[locale]/(marketing)/page.tsx`, `quickstart/page.tsx`, `layout.tsx`, `app/i18n/request.ts`, `components/LocaleSwitcher.tsx`, `middleware.ts`): Module resolution fails for `next-intl`, `next-intl/server`, and `next-intl/middleware`.
- **TS7031** (`apps/adf/app/i18n/request.ts`): `requestLocale` binding implicitly has an `any` type because `next-intl` types are missing.
