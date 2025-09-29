import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import "@airnub/ui/styles.css";
import "./globals.css";
import {
  Footer,
  Header,
  ThemeProvider,
  ThemeToggle,
  type FooterColumn,
  type NavItem,
  GithubIcon,
  fontSans,
  fontMono,
} from "@airnub/ui";
import { SpeckitWordmark } from "@airnub/brand";
import { JsonLd } from "../components/JsonLd";
import { buildSpeckitSoftwareJsonLd } from "../lib/jsonld";
import { SPECKIT_BASE_URL } from "../lib/routes";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { getCurrentLanguage } from "../lib/language";
import { getSpeckitMessages } from "../i18n/messages";
import { supportedLanguages } from "../i18n/config";

const jsonLd = buildSpeckitSoftwareJsonLd();

export async function generateMetadata(): Promise<Metadata> {
  const language = await getCurrentLanguage();
  const layoutMessages = getSpeckitMessages(language).layout;
  const metadataMessages = layoutMessages.metadata;

  return {
    metadataBase: new URL(SPECKIT_BASE_URL),
    title: {
      default: metadataMessages.titleDefault,
      template: metadataMessages.titleTemplate,
    },
    description: metadataMessages.description,
    openGraph: {
      title: metadataMessages.siteName,
      description: metadataMessages.ogDescription,
      url: SPECKIT_BASE_URL,
      siteName: metadataMessages.siteName,
      locale: metadataMessages.openGraphLocale,
      type: "website",
      images: [
        {
          url: "/api/og",
          width: 1200,
          height: 630,
          alt: metadataMessages.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataMessages.siteName,
      description: metadataMessages.twitterDescription,
      images: [`${SPECKIT_BASE_URL}/api/og`],
    },
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: "/",
    },
  };
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
        <ThemeProvider>
          <a href="#content" className="skip-link">
            {layoutMessages.skipToContent}
          </a>
          <Header
            logo={<SpeckitWordmark className="h-6" />}
            navItems={navItems}
            homeHref="/"
            homeAriaLabel="Speckit home"
            rightSlot={
              <div className="flex items-center gap-3">
                <Link
                  href="https://github.com/airnub/speckit"
                  className="hidden rounded-full border border-border p-2 text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:inline-flex"
                  aria-label={layoutMessages.githubLabel}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubIcon className="h-4 w-4" />
                </Link>
                <ThemeToggle className="inline-flex" label={layoutMessages.themeToggle} />
                <LanguageSwitcher
                  initialLanguage={language}
                  label={layoutMessages.languageLabel}
                  options={languageOptions}
                />
              </div>
            }
          />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer
            logo={<SpeckitWordmark className="h-6" />}
            columns={footerColumns}
            description={footerMessages.description}
            bottomSlot={
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground">
                <Link href="mailto:speckit@airnub.io">{footerMessages.contact.label}</Link>
                <span aria-hidden="true">•</span>
                <Link href="/pricing">{footerMessages.contact.pricing}</Link>
              </div>
            }
            copyright={`© ${year} Airnub. All rights reserved.`}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
