import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Footer, Header } from "@airnub/ui";
import type { ReactNode } from "react";
import { AirnubWordmark } from "@airnub/brand";
import { GithubIcon } from "../components/icons";
import { AIRNUB_BASE_URL, AIRNUB_NAV_ITEMS } from "../lib/routes";
import { buildAirnubOrganizationJsonLd } from "../lib/jsonld";

const footerColumns = [
  {
    heading: "Products",
    links: [{ label: "Speckit", href: "https://speckit.airnub.io", external: true }],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "https://docs.speckit.dev", external: true },
      { label: "Blog", href: "/resources#blog" },
      { label: "Changelog", href: "/resources#changelog" },
    ],
  },
  {
    heading: "Open Source",
    links: [
      { label: "GitHub org", href: "https://github.com/airnub", external: true },
      { label: "Speckit", href: "https://github.com/airnub/speckit", external: true },
      { label: "Infrastructure templates", href: "https://github.com/airnub/landing-zones", external: true },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Trust Center", href: "https://trust.airnub.io", external: true },
      { label: "VDP", href: "https://trust.airnub.io/vdp", external: true },
      { label: "security.txt", href: "https://trust.airnub.io/.well-known/security.txt", external: true },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Careers", href: "/company#careers" },
      { label: "Press", href: "/company#press" },
      { label: "Legal", href: "/company#legal" },
    ],
  },
];

const jsonLd = buildAirnubOrganizationJsonLd();

export const metadata: Metadata = {
  metadataBase: new URL(AIRNUB_BASE_URL),
  title: {
    default: "Airnub — Governed developer platforms",
    template: "%s | Airnub",
  },
  description: "Airnub builds governed, enterprise-ready developer platforms that connect compliance, delivery, and trust.",
  openGraph: {
    title: "Airnub",
    description: "Airnub builds governed, enterprise-ready developer platforms.",
    url: AIRNUB_BASE_URL,
    siteName: "Airnub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Airnub — Governed developer platforms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Airnub",
    description: "Airnub builds governed, enterprise-ready developer platforms.",
    images: [`${AIRNUB_BASE_URL}/api/og`],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Header
          logo={<AirnubWordmark className="h-6" />}
          navItems={AIRNUB_NAV_ITEMS}
          homeAriaLabel="Airnub home"
          rightSlot={
            <Link
              href="https://github.com/airnub"
              className="hidden rounded-full border border-slate-200 p-2 text-slate-600 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 lg:inline-flex"
              aria-label="Airnub on GitHub"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
          }
        />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer
          logo={<AirnubWordmark className="h-6" />}
          columns={footerColumns}
          copyright={`© ${new Date().getFullYear()} Airnub. All rights reserved.`}
          bottomSlot={
            <div className="flex items-center gap-3">
              <Link href="/company#privacy">Privacy</Link>
              <Link href="/company#terms">Terms</Link>
              <Link href="mailto:hello@airnub.io">hello@airnub.io</Link>
            </div>
          }
        />
      </body>
    </html>
  );
}
