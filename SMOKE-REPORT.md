# Airnub Site — Smoke Report

## Summary
- Build: FAIL
- Typecheck: FAIL
- Apps detected: [airnub ✓] [speckit ✓] [adf ✓]

## Per-app Checks
### apps/airnub
- Boot: FAIL (http://localhost:3101)

### apps/speckit
- Boot: FAIL (http://localhost:3102)

### apps/adf
- Boot: FAIL (http://localhost:3103)

## Cross-cutting
- Internal link check: SKIPPED
- i18n: PASS

## Outstanding (prioritised)
1) [P1] Build failed — Resolve build failures reported by pnpm -w build.
2) [P1] Typecheck failed — Resolve TypeScript errors reported by pnpm -w typecheck.
3) [P1] airnub failed to start — next start did not respond on port 3101.
4) [P1] speckit failed to start — next start did not respond on port 3102.
5) [P1] adf failed to start — next start did not respond on port 3103.
