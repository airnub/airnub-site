import "../globals.css";
import { BrandProvider, FooterAirnub, HeaderAirnub, ThemeProvider, ToastProvider, type FooterColumn } from "@airnub/ui";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import { buildAirnubOrganizationJsonLd } from "../../lib/jsonld";
import { AIRNUB_BASE_URL } from "../../lib/routes";
import { localeHref } from "../../lib/locale";
import { assertLocale, locales, type Locale } from "../../i18n/routing";
import { MaintenanceGate } from "./maintenance/MaintenanceGate";
import { isMaintenanceModeEnabled } from "../../lib/runtime-flags";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { brand as airnubBrand, buildBrandMetadata } from "@airnub/brand";

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = assertLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "layout.metadata" });
  const ogPath = airnubBrand.og ?? "/brand/og.png";
  const ogUrl = new URL(ogPath, AIRNUB_BASE_URL).toString();

  return buildBrandMetadata({
    brand: airnubBrand,
    baseUrl: AIRNUB_BASE_URL,
    overrides: {
      title: {
        default: t("titleDefault"),
        template: t("titleTemplate"),
      },
      description: t("description"),
      openGraph: {
        description: t("ogDescription"),
        locale: localeToOg[locale],
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: t("titleDefault"),
          },
        ],
      },
      twitter: {
        description: t("twitterDescription"),
        images: [ogUrl],
      },
      alternates: {
        canonical: `/${locale}`,
        languages: Object.fromEntries(locales.map((code) => [code, `/${code}`])),
      },
    },
  });
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
  setRequestLocale(locale);
  const messages = await getMessages();
  const common = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const footer = await getTranslations({ locale, namespace: "footer" });

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

  const footerColumns: FooterColumn[] = [
    {
      heading: footer("columns.products.heading"),
      links: [
        { label: footer("columns.products.links.speckit"), href: "https://speckit.airnub.io", external: true },
      ],
    },
    {
      heading: footer("columns.resources.heading"),
      links: [
        { label: footer("columns.resources.links.docs"), href: "https://docs.speckit.dev", external: true },
        { label: footer("columns.resources.links.blog"), href: "/resources#blog" },
        { label: footer("columns.resources.links.changelog"), href: "/resources#changelog" },
      ],
    },
    {
      heading: footer("columns.openSource.heading"),
      links: [
        { label: footer("columns.openSource.links.org"), href: "https://github.com/airnub", external: true },
        { label: footer("columns.openSource.links.speckit"), href: "https://github.com/airnub/speckit", external: true },
        { label: footer("columns.openSource.links.templates"), href: "https://github.com/airnub/landing-zones", external: true },
      ],
    },
    {
      heading: footer("columns.trust.heading"),
      links: [
        { label: footer("columns.trust.links.trustCenter"), href: "https://trust.airnub.io", external: true },
        { label: footer("columns.trust.links.vdp"), href: "https://trust.airnub.io/vdp", external: true },
        { label: footer("columns.trust.links.securityTxt"), href: "https://trust.airnub.io/.well-known/security.txt", external: true },
      ],
    },
    {
      heading: footer("columns.company.heading"),
      links: [
        { label: footer("columns.company.links.about"), href: "/company" },
        { label: footer("columns.company.links.careers"), href: "/company#careers" },
        { label: footer("columns.company.links.press"), href: "/company#press" },
        { label: footer("columns.company.links.legal"), href: "/company#legal" },
      ],
    },
  ];

  const footerBottomLinks = [
    { label: footer("bottom.privacy"), href: "/company#privacy" },
    { label: footer("bottom.terms"), href: "/company#terms" },
    { label: footer("bottom.email"), href: "mailto:hello@airnub.io" },
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
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <BrandProvider value={airnubBrand}>
            <ThemeProvider>
              <ToastProvider>
                <a href="#content" className="skip-link">
                  {common("skipToContent")}
                </a>
                <HeaderAirnub
                  navItems={navItems}
                  homeHref={`/${locale}`}
                  homeAriaLabel={`${airnubBrand.name} home`}
                  githubLabel={common("githubLabel")}
                  themeToggleLabel={common("theme.toggle")}
                  additionalRightSlot={
                    <Suspense fallback={null}>
                      <LocaleSwitcher />
                    </Suspense>
                  }
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
                <FooterAirnub
                  pathPrefix={`/${locale}`}
                  columns={footerColumns}
                  bottomLinks={footerBottomLinks}
                  description={footer("description")}
                />
              </ToastProvider>
            </ThemeProvider>
          </BrandProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
