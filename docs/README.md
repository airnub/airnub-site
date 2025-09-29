# Airnub Documentation

This workspace hosts the Airnub engineering guides rendered with [Docusaurus](https://docusaurus.io/).

## Local development

```bash
pnpm install
pnpm --filter docs dev
```

## Build for production

```bash
pnpm --filter docs build
```

## Deploy to GitHub Pages

```bash
pnpm --filter docs deploy
```

The deployment command is wired to the shared GitHub Actions workflow and publishes the generated `docs/build` directory.
