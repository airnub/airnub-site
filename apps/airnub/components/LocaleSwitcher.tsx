"use client";

import { useTransition, type ChangeEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { defaultLocale, locales, type Locale } from "../i18n/routing";

const LANGUAGE_COOKIE_NAME = "NEXT_LOCALE";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function persistLocale(value: Locale) {
  if (typeof document !== "undefined") {
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
    document.documentElement.lang = value;
  }
}

function replaceLocale(pathname: string | null, nextLocale: Locale) {
  if (!pathname || pathname === "/") {
    return `/${nextLocale}`;
  }
  const segments = pathname.split("/");
  if (segments.length > 1) {
    segments[1] = nextLocale;
    const nextPath = segments.join("/");
    return nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  }
  return `/${nextLocale}`;
}

type LocaleSwitcherProps = {
  className?: string;
};

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const activeLocale = useLocale();
  const locale: Locale = locales.includes(activeLocale as Locale)
    ? (activeLocale as Locale)
    : defaultLocale;
  const t = useTranslations("common.locale");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    if (nextLocale === locale) {
      return;
    }

    startTransition(() => {
      const targetPath = replaceLocale(pathname, nextLocale);
      const query = searchParams?.toString();
      persistLocale(nextLocale);
      router.replace(query ? `${targetPath}?${query}` : targetPath);
    });
  };

  return (
    <div className={clsx("relative inline-flex", className)}>
      <label htmlFor="locale-switcher" className="sr-only">
        {t("label")}
      </label>
      <select
        id="locale-switcher"
        name="locale"
        className={clsx(
          "appearance-none rounded-full border border-slate-200 bg-white px-3 py-2 pr-8 text-sm font-medium text-slate-700 transition hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600",
          isPending && "opacity-75"
        )}
        value={locale}
        onChange={handleChange}
        aria-busy={isPending}
        disabled={isPending}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {t(`options.${code}`)}
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
