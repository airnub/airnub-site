import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import "./globals.css";
import {
  BrandProvider,
  ThemeProvider,
  ThemeToggle,
  type FooterColumn,
  type NavItem,
  GithubIcon,
  fontSans,
  fontMono,
  SiteShell,
} from "@airnub/ui";
import { JsonLd } from "../components/JsonLd";
import { buildSpeckitSoftwareJsonLd } from "../lib/jsonld";
import { SPECKIT_BASE_URL } from "../lib/routes";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { getCurrentLanguage } from "../lib/language";
import { getSpeckitMessages } from "../i18n/messages";
import { supportedLanguages } from "../i18n/config";
import speckitBrand from "../brand.config";
import { buildBrandMetadata } from "@airnub/brand";

const jsonLd = buildSpeckitSoftwareJsonLd();

function formatTemplate(template: string, values: Record<string, string | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = values[key];
    return value ?? match;
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const layoutMessages = getSpeckitMessages(language).layout;
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
  const messages = getSpeckitMessages(language);
  const layoutMessages = messages.layout;
  const footerMessages = layoutMessages.footer;
  const languageOptions = supportedLanguages.map((code) => ({
    value: code,
    label: layoutMessages.locale.options[code] ?? code,
  }));
  const navItems: NavItem[] = [
    { label: layoutMessages.nav.product, href: "/product" },
    { label: layoutMessages.nav.howItWorks, href: "/how-it-works" },
    { label: layoutMessages.nav.solutions, href: "/solutions" },
    { label: layoutMessages.nav.docs, href: "https://docs.speckit.dev", external: true },
    { label: layoutMessages.nav.pricing, href: "/pricing" },
    { label: layoutMessages.nav.trust, href: "https://trust.airnub.io", external: true },
    { label: layoutMessages.nav.contact, href: "/contact" },
  ];

  const footerColumns: FooterColumn[] = [
    {
      heading: footerMessages.columns.product.heading,
      links: [
        { label: footerMessages.columns.product.overview, href: "/" },
        { label: footerMessages.columns.product.howItWorks, href: "/how-it-works" },
        { label: footerMessages.columns.product.integrations, href: "/product#integrations" },
      ],
    },
    {
      heading: footerMessages.columns.resources.heading,
      links: [
        { label: footerMessages.columns.resources.docs, href: "https://docs.speckit.dev", external: true },
        { label: footerMessages.columns.resources.apiReference, href: "https://docs.speckit.dev/api", external: true },
        { label: footerMessages.columns.resources.community, href: "https://github.com/airnub/speckit/discussions", external: true },
      ],
    },
    {
      heading: footerMessages.columns.openSource.heading,
      links: [
        { label: footerMessages.columns.openSource.repo, href: "https://github.com/airnub/speckit", external: true },
        { label: footerMessages.columns.openSource.templates, href: "https://github.com/airnub/speckit-templates", external: true },
        { label: footerMessages.columns.openSource.issues, href: "https://github.com/airnub/speckit/issues", external: true },
        { label: footerMessages.columns.openSource.license, href: "https://github.com/airnub/speckit/blob/main/LICENSE", external: true },
      ],
    },
    {
      heading: footerMessages.columns.trust.heading,
      links: [
        { label: footerMessages.columns.trust.trustCenter, href: "https://trust.airnub.io", external: true },
        { label: footerMessages.columns.trust.status, href: "https://status.airnub.io", external: true },
        { label: footerMessages.columns.trust.securityTxt, href: "https://trust.airnub.io/.well-known/security.txt", external: true },
      ],
    },
  ];

  const year = new Date().getFullYear();
  const githubUrl = speckitBrand.social.github ?? "https://github.com";
  const contactEmail =
    speckitBrand.contact.product ??
    speckitBrand.contact.general ??
    speckitBrand.contact.support;
  const footerContactLabel = contactEmail
    ? formatTemplate(footerMessages.contact.label, {
        contactEmail,
        email: contactEmail,
        productEmail: contactEmail,
      })
    : footerMessages.contact.label;
  const footerBottomLinks = [
    ...(contactEmail ? [{ label: footerContactLabel, href: `mailto:${contactEmail}` }] : []),
    { label: footerMessages.contact.pricing, href: "/pricing" },
  ];

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
        <BrandProvider value={speckitBrand}>
          <ThemeProvider>
            <SiteShell
              skipToContentLabel={layoutMessages.skipToContent}
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
            </SiteShell>
          </ThemeProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
