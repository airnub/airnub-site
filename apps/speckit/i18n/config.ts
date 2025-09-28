export const supportedLanguages = ["en-US", "en-GB", "fr", "es", "de", "pt", "it", "ga"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: SupportedLanguage = "en-US";

export const languageCookieName = "speckit-language";
