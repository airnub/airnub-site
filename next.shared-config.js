const path = require("node:path");

const DEFAULT_TRANSPILE_PACKAGES = ["@airnub/ui", "@airnub/brand", "@airnub/seo"];
const DEFAULT_OPTIMIZED_PACKAGES = ["@airnub/ui", "clsx"];

function defineMonorepoNextConfig(appDirectory, overrides = {}) {
  if (!appDirectory) {
    throw new Error("defineMonorepoNextConfig requires the caller's directory path");
  }

  const monorepoRoot = path.resolve(appDirectory, "../../");

  const {
    experimental: { optimizePackageImports = [], ...experimentalRest } = {},
    eslint: eslintConfig = {},
    typescript: typescriptConfig = {},
    transpilePackages = [],
    ...rest
  } = overrides;

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
