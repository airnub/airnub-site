import { notFound } from "next/navigation";

export const locales = [
  "en-US",
  "en-GB",
  "ga",
  "fr",
  "es",
  "de",
  "pt",
  "it",
] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en-US";

export const localeNames: Record<Locale, string> = {
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  ga: "Gaeilge",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
};

export function assertLocale(locale: string): Locale {
  if ((locales as readonly string[]).includes(locale)) {
    return locale as Locale;
  }
  notFound();
}
