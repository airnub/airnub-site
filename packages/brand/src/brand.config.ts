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
    light: "/brand/airnub-wordmark-light.svg",
    dark: "/brand/airnub-wordmark-dark.svg",
    mark: "/brand/airnub-mark.svg",
  },
  social: {
    github: "https://github.com/airnub",
    x: "https://x.com/airnub",
    linkedin: "https://www.linkedin.com/company/airnub",
  },
};
