import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { FooterSpeckit, HeaderSpeckit, ThemeProvider, type FooterColumn, type NavItem } from "@airnub/ui";
import { JsonLd } from "../components/JsonLd";
import { buildSpeckitSoftwareJsonLd } from "../lib/jsonld";
import { SPECKIT_BASE_URL } from "../lib/routes";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { getCurrentLanguage } from "../lib/language";
import { getSpeckitMessages } from "../i18n/messages";

const jsonLd = buildSpeckitSoftwareJsonLd();

export const metadata: Metadata = {
  metadataBase: new URL(SPECKIT_BASE_URL),
  title: {
    default: "Speckit — Governed release workflows",
    template: "%s | Speckit",
  },
  description: "Speckit eliminates vibe-coding by turning compliance and platform controls into auditable, automated workflows.",
  openGraph: {
    title: "Speckit",
    description: "Governed release workflows with evidence automation.",
    url: SPECKIT_BASE_URL,
    siteName: "Speckit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Speckit — Governed release workflows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speckit",
    description: "Governed release workflows with evidence automation.",
    images: [`${SPECKIT_BASE_URL}/api/og`],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const language = await getCurrentLanguage();
  const messages = getSpeckitMessages(language);
  const layoutMessages = messages.layout;
  const footerMessages = layoutMessages.footer;
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

  return (
    <html
      lang={language}
      className="font-sans antialiased"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <JsonLd data={jsonLd} />
      </head>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <a href="#content" className="skip-link">
            {layoutMessages.skipToContent}
          </a>
          <HeaderSpeckit
            navItems={navItems}
            themeToggleLabel={layoutMessages.themeToggle}
            githubLabel={layoutMessages.githubLabel}
            additionalRightSlot={
              <LanguageSwitcher
                initialLanguage={language}
                label={layoutMessages.languageLabel}
              />
            }
          />
          <main id="content" className="flex-1">
            {children}
          </main>
          <FooterSpeckit
            columns={footerColumns}
            contactLabel={footerMessages.contact.label}
            pricingLabel={footerMessages.contact.pricing}
            pricingHref="/pricing"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
