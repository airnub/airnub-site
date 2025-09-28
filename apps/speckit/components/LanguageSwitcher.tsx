"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { languageCookieName, supportedLanguages, type SupportedLanguage } from "../i18n/config";

const STORAGE_KEY = "speckit.language";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

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

type LanguageSwitcherProps = {
  className?: string;
  initialLanguage: SupportedLanguage;
  label: string;
};

function persistLanguage(value: SupportedLanguage) {
  if (typeof document !== "undefined") {
    document.cookie = `${languageCookieName}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;
    document.documentElement.lang = value;
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, value);
  }
}

export function LanguageSwitcher({ className, initialLanguage, label }: LanguageSwitcherProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (saved && supportedLanguages.includes(saved) && saved !== initialLanguage) {
      setLanguage(saved);
      persistLanguage(saved);
      router.refresh();
    }
  }, [initialLanguage, router]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as SupportedLanguage;
    if (next === language) {
      return;
    }
    setLanguage(next);
    persistLanguage(next);
    router.refresh();
  };

  const options = useMemo(() => supportedLanguages.map((code) => ({ code, label: LANGUAGE_LABELS[code] })), []);

  return (
    <div className={clsx("relative inline-flex", className)}>
      <label htmlFor="speckit-language-switcher" className="sr-only">
        {label}
      </label>
      <select
        id="speckit-language-switcher"
        name="language"
        value={language}
        onChange={handleChange}
        className="appearance-none rounded-full border border-slate-200 bg-white px-3 py-2 pr-8 text-sm font-medium text-slate-700 transition hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
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
