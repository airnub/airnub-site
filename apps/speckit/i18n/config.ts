export const supportedLanguages = ["en-US", "en-GB", "fr", "es", "de", "pt", "it", "ga"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: SupportedLanguage = "en-US";

// Reuse the same cookie as the Airnub app so that locale selection persists
// across both surfaces.
export const languageCookieName = "NEXT_LOCALE";
