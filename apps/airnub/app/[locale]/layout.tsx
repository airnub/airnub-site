import "../globals.css";
import { FooterAirnub, HeaderAirnub, ThemeProvider, ToastProvider } from "@airnub/ui";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { buildAirnubOrganizationJsonLd } from "../../lib/jsonld";
import { AIRNUB_BASE_URL } from "../../lib/routes";
import { localeHref } from "../../lib/locale";
import { assertLocale, locales } from "../../i18n/routing";
import { MaintenanceGate } from "./maintenance/MaintenanceGate";

const jsonLd = buildAirnubOrganizationJsonLd();

const localeToOg = {
  en: "en_US",
  es: "es_ES",
} as const;

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

  const maintenanceEnabled = process.env.MAINTENANCE_MODE === "true";
  const maintenanceCopy = {
    title: common("maintenance.title"),
    description: common("maintenance.description"),
    cta: common("maintenance.cta"),
  };

  return (
    <html lang={locale} className="font-sans antialiased" suppressHydrationWarning>
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
