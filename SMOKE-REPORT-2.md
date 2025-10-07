# Smoke Report 2

| Check | Result | Notes |
| --- | --- | --- |
| `pnpm -w build` | ✅ PASS | See `artifacts/build.after.log`. |
| `pnpm -w typecheck` | ✅ PASS | See `artifacts/typecheck.after.log`. |
| apps/airnub start | ✅ PASS | `next start -p 3101`; `/`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` healthy. |
| apps/speckit start | ✅ PASS | `next start -p 3102`; `/`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` healthy. |
| apps/adf start | ✅ PASS | `next start -p 3103`; `/`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` healthy. |
| `pnpm smoke` | ⚠️ SKIPPED | Command not defined in workspace. |
| Link checker | ⚠️ NOT RUN | Pending tooling. |
| PWA guard (`DISABLE_PWA=1`) | ✅ N/A | No PWA integrations present; build unaffected. |
| Env fallbacks | ✅ PASS | No missing env build crashes observed. |

## Logs
- `artifacts/airnub-start.log`
- `artifacts/speckit-start.log`
- `artifacts/adf-start.log`
- `artifacts/build.after.log`
- `artifacts/typecheck.after.log`

