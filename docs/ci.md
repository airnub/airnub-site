# CI & Contribution Workflow

## Conventional commits

Husky installs a `commit-msg` hook (`pnpm prepare`) that runs `pnpm commitlint --edit $1` to enforce Conventional Commit messages.

## Pull request requirements

The repository uses `amannn/action-semantic-pull-request` to ensure PR titles follow the Conventional Commits specification.

## Pipeline overview

The primary workflow (`.github/workflows/ci.yml`) runs the following steps:

1. Checkout and install dependencies
2. Commit message linting (for pull requests)
3. Semantic PR title check
4. `turbo run lint`
5. `turbo run typecheck`
6. `node scripts/assert-no-client.js`
7. `turbo run build` (remote cache ready)

Additional workflows cover accessibility (`a11y.yml`), link checking (`links.yml`), and Supabase staging deploys (`db-migrate.yml`).

## Trust & security

- Keep secrets out of the repository—use environment variables and secret stores.
- Prefer server-action-only Supabase writes for tighter control.
