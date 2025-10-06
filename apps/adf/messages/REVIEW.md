# ADF Messages Review Checklist

- [ ] Capture reviewer initials and date inside this checklist when locales change.
- [ ] Make sure policy, compliance, and security terminology aligns with the latest ADF glossary.
- [ ] Check that fallback text in `packages/i18n/shared` stays synchronized with app overrides.
- [ ] Execute `pnpm i18n:sync --strict` before opening a PR.
