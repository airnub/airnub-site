import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import "./globals.css";
import {
  BrandProvider,
  ThemeProvider,
  ThemeToggle,
  ToastProvider,
  type FooterColumn,
  type NavItem,
  GithubIcon,
  fontSans,
  fontMono,
  Analytics,
  SkipLink,
} from "@airnub/ui";
import { JsonLd } from "../components/JsonLd";
import { buildSpeckitSoftwareJsonLd } from "../lib/jsonld";
import { SPECKIT_BASE_URL } from "../lib/routes";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { ActiveSiteShell } from "../components/ActiveSiteShell";
import { getCurrentLanguage } from "../lib/language";
import { getSpeckitMessages } from "../i18n/messages";
import { supportedLanguages } from "../i18n/config";
import speckitBrand from "../brand.config";
import { buildBrandMetadata, speckitNavigation } from "@airnub/brand";

const jsonLd = buildSpeckitSoftwareJsonLd();

function formatTemplate(template: string, values: Record<string, string | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = values[key];
    return value ?? match;
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const layoutMessages = (await getSpeckitMessages(language)).layout;
  const metadataMessages = layoutMessages.metadata;
  const ogPath = speckitBrand.og ?? "/brand/og.png";
  const ogUrl = new URL(ogPath, SPECKIT_BASE_URL).toString();

  return buildBrandMetadata({
    brand: speckitBrand,
    baseUrl: SPECKIT_BASE_URL,
    overrides: {
      title: {
        default: metadataMessages.titleDefault,
        template: metadataMessages.titleTemplate,
      },
      description: metadataMessages.description,
      openGraph: {
        description: metadataMessages.ogDescription,
        locale: metadataMessages.openGraphLocale,
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: metadataMessages.ogImageAlt,
          },
        ],
      },
      twitter: {
        description: metadataMessages.twitterDescription,
        images: [ogUrl],
      },
      alternates: {
        canonical: "/",
      },
    },
  });
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const language = await getCurrentLanguage();
  const messages = await getSpeckitMessages(language);
  const layoutMessages = messages.layout;
  const footerMessages = layoutMessages.footer;
  const languageOptions = supportedLanguages.map((code) => ({
    value: code,
    label: layoutMessages.locale.options[code] ?? code,
  }));
  const getLayoutValue = (key: string): string => {
    const segments = key.split(".");
    const namespace = segments.shift();
    if (namespace !== "layout") {
      throw new Error(`Invalid layout message key: ${key}`);
    }
    let current: unknown = layoutMessages;
    for (const segment of segments) {
      if (current && typeof current === "object") {
        current = (current as Record<string, unknown>)[segment];
      } else {
        current = undefined;
        break;
      }
    }
    if (typeof current !== "string") {
      throw new Error(`Missing layout message for key: ${key}`);
    }
    return current;
  };

  const findContactValue = (keys: ReadonlyArray<keyof typeof speckitBrand.contact>) => {
    for (const key of keys) {
      const value = speckitBrand.contact[key];
      if (value) {
        return value;
      }
    }
    return undefined;
  };

  const navItems: NavItem[] = speckitNavigation.header.map((item) => ({
    label: getLayoutValue(item.labelKey),
    href: item.href,
    external: item.external,
  }));

  const footerColumns: FooterColumn[] = speckitNavigation.footer.groups.map((group) => ({
    heading: getLayoutValue(group.headingKey),
    links: group.links.map((link) => ({
      label: getLayoutValue(link.labelKey),
      href: link.href,
      external: link.external,
    })),
  }));

  const footerBottomLinks = speckitNavigation.footer.ctas
    .map((cta) => {
      let href = cta.href;
      let label = getLayoutValue(cta.labelKey);

      if (cta.contact) {
        const contactValue = findContactValue(cta.contact.keys as ReadonlyArray<keyof typeof speckitBrand.contact>);
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
        const params =
          paramKeys && paramKeys.length > 0
            ? Object.fromEntries(paramKeys.map((paramKey) => [paramKey, contactValue]))
            : { email: contactValue };
        label = formatTemplate(label, params);
      }

      if (!href) {
        return null;
      }

      return {
        label,
        href,
        ...(typeof cta.external === "boolean" ? { external: cta.external } : {}),
      };
    })
    .filter((link): link is { label: string; href: string; external?: boolean } => Boolean(link));

  const year = new Date().getFullYear();
  const githubUrl = speckitBrand.social.github ?? "https://github.com";
  return (
    <html
      lang={language}
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
        <BrandProvider value={speckitBrand}>
          <ThemeProvider>
            <ToastProvider>
              <ActiveSiteShell
                navItems={navItems}
                homeHref="/"
                homeAriaLabel={`${speckitBrand.name} home`}
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
                  <LanguageSwitcher
                    initialLanguage={language}
                    label={layoutMessages.languageLabel}
                    options={languageOptions}
                  />
                </div>
              }
              footerColumns={footerColumns}
              footerDescription={footerMessages.description}
              footerBottomLinks={footerBottomLinks}
              footerCopyright={`© ${year} ${speckitBrand.name}. All rights reserved.`}
            >
              {children}
            </ActiveSiteShell>
            </ToastProvider>
          </ThemeProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
