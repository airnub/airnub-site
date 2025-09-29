export type SocialHandles =
  Partial<
    Record<
      | "github"
      | "x"
      | "twitter"
      | "linkedin"
      | "youtube"
      | "facebook"
      | "instagram"
      | "threads"
      | "tiktok"
      | "discord"
      | "slack"
      | "dribbble"
      | "medium"
      | "rss"
      | "bluesky"
      | "twitch"
      | "reddit"
      | "productHunt"
      | "angelList"
      | "glassdoor"
      | "mastodon"
      | "snapchat"
      | "pinterest"
      | "wechat"
      | "telegram",
      string
    >
  > &
  Record<string, string | undefined>;

export interface BrandConfig {
  name: string;
  domain: string;
  description?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  logos: {
    light?: string;
    dark?: string;
    mark?: string;
  };
  favicon?: string;
  og?: string;
  social: SocialHandles;
}

export const brand: BrandConfig = {
  name: "Airnub",
  domain: "airnub.io",
  description: "Airnub builds trusted infrastructure for modern product teams.",
  colors: {
    primary: "#38bdf8",
    secondary: "#0f172a",
    accent: "#1d4ed8",
    background: "#ffffff",
    foreground: "#0f172a",
  },
  logos: {
    light: "/brand/logo.svg",
    dark: "/brand/logo-dark.svg",
    mark: "/brand/logo-mark.svg",
  },
  favicon: "/brand/favicon.svg",
  og: "/brand/og.png",
  social: {
    github: "https://github.com/airnub",
    x: "https://x.com/airnub",
    linkedin: "https://www.linkedin.com/company/airnub",
  },
};

export interface ResolveBrandConfigOptions {
  /**
   * Optional environment variables. Defaults to `process.env` when available.
   */
  env?: Record<string, string | undefined>;
  /**
   * Additional overrides applied after environment variables.
   */
  overrides?: Partial<BrandConfig>;
}

function toCamelCase(value: string): string {
  const segments = value
    .split(/[_\s-]+/)
    .map((segment) => segment.toLowerCase())
    .filter(Boolean);

  if (segments.length === 0) {
    return value.toLowerCase();
  }

  return [
    segments[0],
    ...segments.slice(1).map((segment) => segment[0]?.toUpperCase() + segment.slice(1)),
  ].join("");
}

export function resolveBrandConfig(options: ResolveBrandConfigOptions = {}): BrandConfig {
  const env: Record<string, string | undefined> =
    options.env ?? (typeof process !== "undefined" ? process.env : {});

  const base: BrandConfig = {
    ...brand,
    ...(options.overrides ?? {}),
    colors: {
      ...brand.colors,
      ...(options.overrides?.colors ?? {}),
    },
    logos: {
      ...brand.logos,
      ...(options.overrides?.logos ?? {}),
    },
    social: {
      ...brand.social,
      ...(options.overrides?.social ?? {}),
    },
  };

  const resolved: BrandConfig = {
    ...base,
    name: env.BRAND_NAME ?? base.name,
    domain: env.BRAND_DOMAIN ?? base.domain,
    description: env.BRAND_DESCRIPTION ?? base.description,
    favicon: env.BRAND_FAVICON ?? base.favicon,
    og: env.BRAND_OG ?? base.og,
    colors: {
      ...base.colors,
      primary: env.BRAND_COLOR_PRIMARY ?? base.colors.primary,
      secondary: env.BRAND_COLOR_SECONDARY ?? base.colors.secondary,
      accent: env.BRAND_COLOR_ACCENT ?? base.colors.accent,
      background: env.BRAND_COLOR_BACKGROUND ?? base.colors.background,
      foreground: env.BRAND_COLOR_FOREGROUND ?? base.colors.foreground,
    },
    logos: {
      ...base.logos,
      light: env.BRAND_LOGO_LIGHT ?? base.logos.light,
      dark: env.BRAND_LOGO_DARK ?? base.logos.dark,
      mark: env.BRAND_LOGO_MARK ?? base.logos.mark,
    },
    social: {
      ...base.social,
    },
  };

  for (const [envKey, value] of Object.entries(env)) {
    if (!envKey.startsWith("BRAND_SOCIAL_")) {
      continue;
    }

    if (value === undefined) {
      continue;
    }

    const socialKey = toCamelCase(envKey.replace("BRAND_SOCIAL_", ""));
    resolved.social[socialKey] = value;
  }

  return resolved;
}

export const resolvedBrandConfig = resolveBrandConfig();
