"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { languageCookieName, type SupportedLanguage } from "../i18n/config";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const COOKIE_DOMAIN =
  process.env.NEXT_PUBLIC_LOCALE_COOKIE_DOMAIN ??
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN ??
  ".airnub.io";

type LanguageSwitcherProps = {
  className?: string;
  initialLanguage: SupportedLanguage;
  label: string;
  options: { value: SupportedLanguage; label: string }[];
};

function persistLanguage(value: SupportedLanguage) {
  if (typeof document !== "undefined") {
    const cookieAttributes = [
      `${languageCookieName}=${value}`,
      "path=/",
      `max-age=${COOKIE_MAX_AGE_SECONDS}`,
      "SameSite=Lax",
    ];

    if (COOKIE_DOMAIN) {
      cookieAttributes.splice(1, 0, `domain=${COOKIE_DOMAIN}`);
    }

    document.cookie = cookieAttributes.join("; ");
    document.documentElement.lang = value;
  }
}

export function LanguageSwitcher({ className, initialLanguage, label, options }: LanguageSwitcherProps) {
  const router = useRouter();
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as SupportedLanguage;
    if (next === language) {
      return;
    }
    setLanguage(next);
    persistLanguage(next);
    router.refresh();
  };

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
        className="appearance-none rounded-full border border-border bg-card px-3 py-2 pr-8 text-sm font-medium text-foreground transition hover:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground"
        viewBox="0 0 12 8"
      >
        <path d="M1.41.59 6 5.17l4.59-4.58L12 2l-6 6-6-6z" fill="currentColor" />
      </svg>
    </div>
  );
}
