import "../globals.css";
import { FooterAirnub, HeaderAirnub, ThemeProvider, ToastProvider } from "@airnub/ui";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { buildAirnubOrganizationJsonLd } from "../../lib/jsonld";
import { AIRNUB_BASE_URL } from "../../lib/routes";
import { localeHref } from "../../lib/locale";
import { assertLocale, locales, type Locale } from "../../i18n/routing";
import { MaintenanceGate } from "./maintenance/MaintenanceGate";
import { isMaintenanceModeEnabled } from "../../lib/runtime-flags";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";

const jsonLd = buildAirnubOrganizationJsonLd();

const localeToOg: Record<Locale, string> = {
  "en-US": "en_US",
  "en-GB": "en_GB",
  ga: "ga_IE",
  fr: "fr_FR",
  es: "es_ES",
  de: "de_DE",
  pt: "pt_PT",
  it: "it_IT",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "layout.metadata" });

  return {
    metadataBase: new URL(AIRNUB_BASE_URL),
    title: {
      default: t("titleDefault"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    openGraph: {
      title: "Airnub",
      description: t("ogDescription"),
      url: AIRNUB_BASE_URL,
      siteName: "Airnub",
      locale: localeToOg[locale],
      type: "website",
      images: [
        {
          url: "/api/og",
          width: 1200,
          height: 630,
          alt: t("titleDefault"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Airnub",
      description: t("twitterDescription"),
      images: [`${AIRNUB_BASE_URL}/api/og`],
    },
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((code) => [code, `/${code}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const messages = await getMessages();
  const common = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const withLocale = (path: string) => localeHref(locale, path);
  const navItems = [
    { label: nav("products"), href: withLocale("/products") },
    { label: nav("solutions"), href: withLocale("/solutions") },
    { label: nav("services"), href: withLocale("/services") },
    { label: nav("resources"), href: withLocale("/resources") },
    { label: nav("trust"), href: withLocale("/trust") },
    { label: nav("company"), href: withLocale("/company") },
    { label: nav("contact"), href: withLocale("/contact") },
  ];

  const maintenanceEnabled = await isMaintenanceModeEnabled();
  const maintenanceCopy = {
    title: common("maintenance.title"),
    description: common("maintenance.description"),
    cta: common("maintenance.cta"),
  };

  return (
    <html
      lang={locale}
      className="font-sans antialiased"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <ToastProvider>
              <a href="#content" className="skip-link">
                {common("skipToContent")}
              </a>
              <HeaderAirnub
                navItems={navItems}
                homeHref={`/${locale}`}
                homeAriaLabel="Airnub home"
                githubLabel={common("githubLabel")}
                themeToggleLabel={common("theme.toggle")}
                additionalRightSlot={<LocaleSwitcher />}
              />
              <main id="content" className="flex-1">
                <MaintenanceGate
                  enabled={maintenanceEnabled}
                  title={maintenanceCopy.title}
                  description={maintenanceCopy.description}
                  cta={maintenanceCopy.cta}
                >
                  {children}
                </MaintenanceGate>
              </main>
              <FooterAirnub pathPrefix={`/${locale}`} />
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
