import { notFound } from "next/navigation";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

export function assertLocale(locale: string): Locale {
  if ((locales as readonly string[]).includes(locale)) {
    return locale as Locale;
  }
  notFound();
}
