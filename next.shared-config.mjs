import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_TRANSPILE_PACKAGES = ["@airnub/ui", "@airnub/brand", "@airnub/seo"];
const DEFAULT_OPTIMIZED_PACKAGES = ["@airnub/ui", "clsx"];

export function defineMonorepoNextConfig(importMeta, overrides = {}) {
  const __filename = fileURLToPath(importMeta.url);
  const __dirname = path.dirname(__filename);
  const monorepoRoot = path.join(__dirname, "../../");

  const {
    experimental: {
      optimizePackageImports = [],
      ...experimentalRest
    } = {},
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
