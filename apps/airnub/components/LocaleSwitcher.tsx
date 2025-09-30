"use client";

import { useTransition, type ChangeEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { defaultLocale, locales, type Locale } from "../i18n/routing";

const LANGUAGE_COOKIE_NAME = "NEXT_LOCALE";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const COOKIE_DOMAIN =
  process.env.NEXT_PUBLIC_LOCALE_COOKIE_DOMAIN ??
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN ??
  ".airnub.io";

function persistLocale(value: Locale) {
  if (typeof document !== "undefined") {
    const cookieAttributes = [
      `${LANGUAGE_COOKIE_NAME}=${value}`,
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
    <div
      className={clsx(
        "relative inline-flex items-center overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:right-0 before:w-8 before:bg-card before:content-['']",
        className
      )}
    >
      <label htmlFor="locale-switcher" className="sr-only">
        {t("label")}
      </label>
      <select
        id="locale-switcher"
        name="locale"
        className={clsx(
          "relative z-10 appearance-none [-moz-appearance:none] [-webkit-appearance:none] bg-none rounded-full border border-border bg-card px-3 py-2 pr-8 text-sm font-medium text-foreground transition hover:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          isPending && "opacity-75"
        )}
        value={locale}
        onChange={handleChange}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          backgroundImage: "none",
        }}
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
        className="pointer-events-none absolute right-2 top-1/2 z-20 -translate-y-1/2 text-muted-foreground"
        style={{ width: "0.75rem", height: "0.75rem" }}
        viewBox="0 0 12 8"
      >
        <path d="M1.41.59 6 5.17l4.59-4.58L12 2l-6 6-6-6z" fill="currentColor" />
      </svg>
    </div>
  );
}
