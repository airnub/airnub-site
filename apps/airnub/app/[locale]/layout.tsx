import "../globals.css";
import {
  BrandProvider,
  ThemeProvider,
  ThemeToggle,
  ToastProvider,
  GithubIcon,
  type FooterColumn,
  Analytics,
  SkipLink,
} from "@airnub/ui";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { buildAirnubOrganizationJsonLd } from "../../lib/jsonld";
import { AIRNUB_BASE_URL } from "../../lib/routes";
import { localeHref } from "../../lib/locale";
import { assertLocale, locales, type Locale } from "../../i18n/routing";
import { MaintenanceGate } from "./maintenance/MaintenanceGate";
import { isMaintenanceModeEnabled } from "../../lib/runtime-flags";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { ActiveSiteShell } from "../../components/ActiveSiteShell";
import {
  airnubNavigation,
  buildBrandMetadata,
  resolveMicrositeHref,
  resolvedBrandConfig as airnubBrand,
  type BrandContacts,
} from "@airnub/brand";

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

  const translateLabel = (key: string, values?: Record<string, string>) => {
    const [namespace, ...segments] = key.split(".");
    if (!namespace || segments.length === 0) {
      throw new Error(`Invalid navigation label key: ${key}`);
    }
    const path = segments.join(".");
    if (namespace === "nav") {
      return nav(path, values);
    }
    if (namespace === "footer") {
      return footer(path, values);
    }
    throw new Error(`Unknown navigation namespace "${namespace}" for key "${key}"`);
  };

  const localizeHref = (href: string, external?: boolean) =>
    external || !href.startsWith("/") ? href : withLocale(href);

  const findContactValue = (keys: ReadonlyArray<keyof BrandContacts>) => {
    for (const key of keys) {
      const value = airnubBrand.contact[key];
      if (value) {
        return value;
      }
    }
    return undefined;
  };

  const navItems = airnubNavigation.header.map((item) => {
    const resolvedHref = resolveMicrositeHref(item.href);
    return {
      label: translateLabel(item.labelKey),
      href: localizeHref(resolvedHref, item.external),
      external: item.external,
    };
  });

  const footerColumns: FooterColumn[] = airnubNavigation.footer.groups.map((group) => ({
    heading: translateLabel(group.headingKey),
    links: group.links.map((link) => ({
      label: translateLabel(link.labelKey),
      href: localizeHref(resolveMicrositeHref(link.href), link.external),
      external: link.external,
    })),
  }));

  const footerBottomLinks = airnubNavigation.footer.ctas
    .map((cta) => {
      let href = cta.href;
      let translationValues: Record<string, string> | undefined;

      if (cta.contact) {
        const contactValue = findContactValue(cta.contact.keys);
        if (!contactValue) {
          return null;
        }

        const hrefType = cta.contact.hrefType ?? "mailto";
        if (hrefType === "mailto") {
          href = `mailto:${contactValue}`;
        } else if (hrefType === "tel") {
          href = `tel:${contactValue}`;
        }

        const paramKeys = cta.contact.translationParamKeys;
        if (paramKeys && paramKeys.length > 0) {
          translationValues = Object.fromEntries(paramKeys.map((paramKey) => [paramKey, contactValue]));
        } else {
          translationValues = { email: contactValue };
        }
      }

      if (!href) {
        return null;
      }

      return {
        label: translateLabel(cta.labelKey, translationValues),
        href: localizeHref(href, cta.external),
        external: cta.external,
      };
    })
    .filter((link): link is { label: string; href: string; external: boolean | undefined } => Boolean(link));

  const salesEmail = findContactValue(["sales", "support", "general"]);

  const maintenanceEnabled = await isMaintenanceModeEnabled();
  const maintenanceCopy = {
    title: common("maintenance.title"),
    description: common("maintenance.description"),
    cta: salesEmail ? common("maintenance.cta", { email: salesEmail }) : common("maintenance.cta"),
    ctaHref: salesEmail ? `mailto:${salesEmail}` : undefined,
  };

  const year = new Date().getFullYear();
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
        <SkipLink />
        <Analytics
          provider={(process.env.NEXT_PUBLIC_ANALYTICS ?? undefined) as any}
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          gaId={process.env.NEXT_PUBLIC_GA4_ID}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <BrandProvider value={airnubBrand}>
            <ThemeProvider>
              <ToastProvider>
                <ActiveSiteShell
                  navItems={navItems}
                  homeHref={`/${locale}`}
                  homeAriaLabel={`${airnubBrand.name} home`}
                  headerRightSlot={
                    <div className="flex items-center gap-3">
                      {airnubBrand.social.github ? (
                        <Link
                          href={airnubBrand.social.github}
                          className="hidden rounded-full border border-border p-2 text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:inline-flex"
                          aria-label={common("githubLabel")}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <GithubIcon className="h-4 w-4" />
                        </Link>
                      ) : null}
                      <ThemeToggle className="inline-flex" label={common("theme.toggle")} />
                      <Suspense fallback={null}>
                        <LocaleSwitcher />
                      </Suspense>
                    </div>
                  }
                  footerColumns={footerColumns}
                  footerDescription={footer("description")}
                  footerBottomLinks={footerBottomLinks}
                  footerCopyright={`© ${year} ${airnubBrand.name}. All rights reserved.`}
                >
                  <MaintenanceGate
                    enabled={maintenanceEnabled}
                    title={maintenanceCopy.title}
                    description={maintenanceCopy.description}
                    cta={maintenanceCopy.cta}
                    ctaHref={maintenanceCopy.ctaHref}
                  >
                    {children}
                  </MaintenanceGate>
                </ActiveSiteShell>
              </ToastProvider>
            </ThemeProvider>
          </BrandProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
