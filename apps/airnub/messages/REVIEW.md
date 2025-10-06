# Airnub Messages Review Checklist

- [ ] Confirm updates were proofread by a native or fluent speaker for each locale touched.
- [ ] Verify placeholders (e.g. `{variable}`) and punctuation remain intact.
- [ ] Ensure new keys were added to every locale and deprecated keys were removed.
- [ ] Run `pnpm i18n:sync --strict` to validate shared/app parity before committing.
