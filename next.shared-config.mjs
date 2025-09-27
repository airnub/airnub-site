import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_TRANSPILE_PACKAGES = ["@airnub/ui", "@airnub/brand", "@airnub/seo"];
const DEFAULT_OPTIMIZED_PACKAGES = ["@airnub/ui", "clsx"];

const isDevRuntime = process.env.NODE_ENV !== "production";

export function defineMonorepoNextConfig(importMeta, overrides = {}) {
  const __filename = fileURLToPath(importMeta.url);
  const __dirname = path.dirname(__filename);
  const monorepoRoot = path.join(__dirname, "../../");

  const {
    experimental: experimentalOverrides = {},
    eslint: eslintConfig = {},
    typescript: typescriptConfig = {},
    transpilePackages = [],
    webpack: webpackOverride,
    ...rest
  } = overrides;

  const {
    optimizePackageImports = [],
    ...experimentalRest
  } = experimentalOverrides;

  const mergedOptimizeImports = Array.from(
    new Set([...DEFAULT_OPTIMIZED_PACKAGES, ...optimizePackageImports])
  );

  return {
    outputFileTracingRoot: monorepoRoot,
    transpilePackages: Array.from(
      new Set([...DEFAULT_TRANSPILE_PACKAGES, ...transpilePackages])
    ),
    experimental: {
      ...(!isDevRuntime && mergedOptimizeImports.length
        ? { optimizePackageImports: mergedOptimizeImports }
        : {}),
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
    webpack: (config, options) => {
      const nextConfig =
        typeof webpackOverride === "function"
          ? webpackOverride(config, options) ?? config
          : config;

      if (nextConfig?.optimization) {
        if (options.dev) {
          if ("sideEffects" in nextConfig.optimization) {
            delete nextConfig.optimization.sideEffects;
          }
        } else {
          nextConfig.optimization.sideEffects = true;
        }
      }

      return nextConfig;
    },
    ...rest,
  };
}
