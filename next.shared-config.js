const path = require("node:path");

const DEFAULT_TRANSPILE_PACKAGES = ["@airnub/ui", "@airnub/brand", "@airnub/seo"];
const DEFAULT_OPTIMIZED_PACKAGES = ["@airnub/ui", "clsx"];

function extractHost(value) {
  if (!value) return undefined;

  try {
    return new URL(value).host;
  } catch (error) {
    if (typeof value === "string" && !value.includes("/")) {
      return value;
    }

    return undefined;
  }
}

function collectAllowedOrigins(overrideAllowedOrigins = []) {
  const allowedOrigins = new Set(
    Array.isArray(overrideAllowedOrigins)
      ? overrideAllowedOrigins.filter(Boolean)
      : overrideAllowedOrigins
        ? [overrideAllowedOrigins]
        : [],
  );

  const addOrigin = (origin) => {
    if (origin) {
      allowedOrigins.add(origin);
    }
  };

  const fromEnv = process.env.NEXT_SERVER_ACTIONS_ALLOWED_ORIGINS;
  if (fromEnv) {
    for (const value of fromEnv.split(/[\s,]+/)) {
      addOrigin(value.trim());
    }
  }

  for (const candidate of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
  ]) {
    addOrigin(extractHost(candidate));
  }

  const devPorts = new Set(
    [
      process.env.PORT,
      process.env.NEXT_PUBLIC_PORT,
      process.env.NEXT_DEV_SERVER_PORT,
      "3000",
    ].filter(Boolean),
  );

  if (process.env.NODE_ENV !== "production") {
    for (const port of devPorts) {
      addOrigin(`localhost:${port}`);
      addOrigin(`127.0.0.1:${port}`);
    }
  }

  const isCodespaces =
    process.env.CODESPACES === "true" || Boolean(process.env.CODESPACE_NAME);
  if (isCodespaces) {
    const port = process.env.PORT || "3000";
    const domain =
      process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || "app.github.dev";

    if (process.env.CODESPACE_NAME) {
      addOrigin(`${process.env.CODESPACE_NAME}-${port}.${domain}`);
    }

    addOrigin(`*.${domain}`);
  }

  return Array.from(allowedOrigins).filter(Boolean);
}

function resolveServerActionsConfig(override = undefined) {
  const allowedOrigins = collectAllowedOrigins(override?.allowedOrigins);

  const baseConfig = override ? { ...override } : {};

  if (allowedOrigins.length > 0) {
    baseConfig.allowedOrigins = Array.from(new Set(allowedOrigins));
  }

  return Object.keys(baseConfig).length > 0 ? baseConfig : undefined;
}

function defineMonorepoNextConfig(appDirectory, overrides = {}) {
  if (!appDirectory) {
    throw new Error("defineMonorepoNextConfig requires the caller's directory path");
  }

  const monorepoRoot = path.resolve(appDirectory, "../../");

  const {
    experimental: {
      optimizePackageImports = [],
      serverActions: overrideServerActions,
      ...experimentalRest
    } = {},
    eslint: eslintConfig = {},
    typescript: typescriptConfig = {},
    transpilePackages = [],
    ...rest
  } = overrides;

  const serverActions = resolveServerActionsConfig(overrideServerActions);

  return {
    outputFileTracingRoot: monorepoRoot,
    transpilePackages: Array.from(
      new Set([...DEFAULT_TRANSPILE_PACKAGES, ...transpilePackages])
    ),
    experimental: {
      optimizePackageImports: Array.from(
        new Set([...DEFAULT_OPTIMIZED_PACKAGES, ...optimizePackageImports])
      ),
      ...experimentalRest,
      ...(serverActions ? { serverActions } : {}),
    },
    eslint: {
      ignoreDuringBuilds: Boolean(process.env.CI),
      ...eslintConfig,
    },
    typescript: {
      ignoreBuildErrors: false,
      ...typescriptConfig,
    },
    ...rest,
  };
}

module.exports = { defineMonorepoNextConfig };
