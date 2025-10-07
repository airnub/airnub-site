import "../globals.css";
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { clsx } from "clsx";
import {
  BrandProvider,
  ThemeProvider,
  ThemeToggle,
  ToastProvider,
  GithubIcon,
  fontMono,
  fontSans,
  type FooterColumn,
  type NavItem,
  Analytics,
  SkipLink,
} from "@airnub/ui";
import { buildBrandMetadata } from "@airnub/brand";
import { JsonLd } from "../../components/JsonLd";
import { buildAdfSoftwareJsonLd } from "../../lib/jsonld";
import { ADF_BASE_URL } from "../../lib/routes";
import adfBrand from "../../brand.config";
import { ActiveSiteShell } from "../../components/ActiveSiteShell";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { assertLocale, localeNames, locales, type Locale } from "../i18n/routing";
import type { AdfMessages, LayoutMessages } from "@adf/messages/types";

const jsonLd = buildAdfSoftwareJsonLd();
const TRUST_CENTER_URL = "https://trust.airnub.io";
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

function resolveDocsUrl() {
  return process.env.NEXT_PUBLIC_DOCS_URL ?? "https://airnub.github.io/agentic-delivery-framework/";
}

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
  const hero = await getTranslations({ locale, namespace: "home.hero" });
  const heroTitle = hero("title");
  const heroDescription = hero("description");
  const ogPath = adfBrand.og ?? "/opengraph-image";
  const ogUrl = new URL(ogPath, ADF_BASE_URL).toString();

  return buildBrandMetadata({
    brand: adfBrand,
    baseUrl: ADF_BASE_URL,
    overrides: {
      title: {
        default: heroTitle,
        template: `%s · ${adfBrand.name}`,
      },
      description: heroDescription,
      openGraph: {
        description: heroDescription,
        locale: localeToOg[locale],
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: `${adfBrand.name} Open Graph image`,
          },
        ],
      },
      twitter: {
        description: heroDescription,
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

  const docsUrl = resolveDocsUrl();
  const messages = (await getMessages()) as unknown as AdfMessages;
  const layoutMessages = messages.layout as LayoutMessages;

  const withLocale = (path: string) => {
    if (!path || path === "/") {
      return `/${locale}`;
    }
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${normalized}`;
  };

  const navItems: NavItem[] = layoutMessages.nav.items.map((item) => {
    const href = item.href ?? (item.id === "docs" ? docsUrl : undefined);

    if (!href) {
      throw new Error(`Missing href for navigation item: ${item.id}`);
    }

    const external = item.external ?? href.startsWith("http");
    return {
      label: item.label,
      href: external ? href : withLocale(href),
      external,
    };
  });

  const footerColumns: FooterColumn[] = layoutMessages.footer.columns.map((column) => ({
    heading: column.heading,
    links: column.links.map((link) => {
      const href = link.href ?? (link.id === "docs" ? docsUrl : TRUST_CENTER_URL);
      const external = link.external ?? link.id !== "quickstart";
      const description =
        "description" in link && typeof link.description === "string" ? link.description : undefined;

      return {
        label: link.label,
        href: external ? href : withLocale(href),
        external,
        ...(description !== undefined ? { description } : {}),
      };
    }),
  }));

  const footerBottomLinks = layoutMessages.footer.bottomLinks.map((link) => {
    const href = link.href ?? (link.id === "docs" ? docsUrl : TRUST_CENTER_URL);
    const external = link.external ?? link.id !== "quickstart";
    return {
      label: link.label,
      href: external ? href : withLocale(href),
      external,
    };
  });

  const localeSwitcher = layoutMessages.localeSwitcher ?? {
    label: "Language",
    options: {},
  };
  const providedOptions = (localeSwitcher.options as Partial<Record<Locale, string>>) ?? {};
  const optionLabels = Object.fromEntries(
    locales.map((code) => [code, providedOptions[code] ?? localeNames[code]]),
  ) as Record<Locale, string>;

  const year = new Date().getFullYear();
  const githubUrl = adfBrand.social.github;
  return (
    <html
      lang={locale}
      className={clsx(fontSans.variable, fontMono.variable, "font-sans antialiased")}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <JsonLd data={jsonLd} />
      </head>
      <body className="flex min-h-screen flex-col">
        <SkipLink />
        <Analytics
          provider={(process.env.NEXT_PUBLIC_ANALYTICS ?? undefined) as any}
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          gaId={process.env.NEXT_PUBLIC_GA4_ID}
        />
        <NextIntlClientProvider
          locale={locale}
          messages={messages as unknown as AbstractIntlMessages}
        >
          <BrandProvider value={adfBrand}>
            <ThemeProvider>
              <ToastProvider>
                <ActiveSiteShell
                  navItems={navItems}
                  homeHref={withLocale("/")}
                  homeAriaLabel={`${adfBrand.name} home`}
                  headerRightSlot={
                    <div className="flex items-center gap-3">
                      {githubUrl ? (
                        <Link
                          href={githubUrl}
                          className="hidden rounded-full border border-border p-2 text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:inline-flex"
                          aria-label={layoutMessages.githubLabel}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <GithubIcon className="h-4 w-4" />
                        </Link>
                      ) : null}
                      <ThemeToggle className="inline-flex" label={layoutMessages.themeToggle} />
                      <Suspense fallback={null}>
                        <LocaleSwitcher
                          label={localeSwitcher.label ?? "Language"}
                          options={optionLabels}
                        />
                      </Suspense>
                    </div>
                  }
                  footerColumns={footerColumns}
                  footerDescription={layoutMessages.footer.description}
                  footerBottomLinks={footerBottomLinks}
                  footerCopyright={`© ${year} ${adfBrand.name}. All rights reserved.`}
                >
                  {children}
                </ActiveSiteShell>
              </ToastProvider>
            </ThemeProvider>
          </BrandProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
