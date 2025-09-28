"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { clsx } from "clsx";

const SUPPORTED_LANGUAGES = [
  "en-US",
  "en-GB",
  "fr",
  "es",
  "de",
  "pt",
  "it",
  "ga",
] as const;

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  ga: "Gaeilge",
};

const STORAGE_KEY = "speckit.language";

export function LanguageSwitcher({ className }: { className?: string }) {
  const [language, setLanguage] = useState<SupportedLanguage>("en-US");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && SUPPORTED_LANGUAGES.includes(saved as SupportedLanguage)) {
      setLanguage(saved as SupportedLanguage);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as SupportedLanguage);
  };

  return (
    <div className={clsx("relative inline-flex", className)}>
      <label htmlFor="speckit-language-switcher" className="sr-only">
        Language
      </label>
      <select
        id="speckit-language-switcher"
        name="language"
        value={language}
        onChange={handleChange}
        className="appearance-none rounded-full border border-slate-200 bg-white px-3 py-2 pr-8 text-sm font-medium text-slate-700 transition hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
      >
        {SUPPORTED_LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_LABELS[code]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500 dark:text-slate-400"
        viewBox="0 0 12 8"
      >
        <path d="M1.41.59 6 5.17l4.59-4.58L12 2l-6 6-6-6z" fill="currentColor" />
      </svg>
    </div>
  );
}
