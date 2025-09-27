import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer, Header } from "@airnub/ui";
import { SpeckitWordmark } from "@airnub/brand";
import { GithubIcon, StarIcon } from "../components/icons";
import { JsonLd } from "../components/JsonLd";
import { SPECKIT_BASE_URL, SPECKIT_NAV_ITEMS, SPECKIT_ROUTES } from "../lib/routes";
import { buildSpeckitSoftwareJsonLd } from "../lib/jsonld";

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Overview", href: SPECKIT_ROUTES.home },
      { label: "How it works", href: SPECKIT_ROUTES.howItWorks },
      { label: "Integrations", href: `${SPECKIT_ROUTES.product}#integrations` },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "https://docs.speckit.dev", external: true },
      { label: "API reference", href: "https://docs.speckit.dev/api", external: true },
      { label: "Community", href: "https://github.com/airnub/speckit/discussions", external: true },
    ],
  },
  {
    heading: "Open Source",
    links: [
      { label: "Repo", href: "https://github.com/airnub/speckit", external: true },
      { label: "Templates", href: "https://github.com/airnub/speckit-templates", external: true },
      { label: "Issues", href: "https://github.com/airnub/speckit/issues", external: true },
      { label: "License", href: "https://github.com/airnub/speckit/blob/main/LICENSE", external: true },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Trust Center", href: "https://trust.airnub.io", external: true },
      { label: "Status", href: "https://status.airnub.io", external: true },
      { label: "security.txt", href: "https://trust.airnub.io/.well-known/security.txt", external: true },
    ],
  },
];

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <head>
        <JsonLd data={jsonLd} />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Header
          logo={<SpeckitWordmark className="h-6" />}
          navItems={SPECKIT_NAV_ITEMS}
          homeAriaLabel="Speckit home"
          rightSlot={
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="https://github.com/airnub/speckit"
                className="rounded-full border border-white/10 p-2 text-slate-100 transition hover:text-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                aria-label="Speckit on GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/airnub/speckit"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-speckit-indigo to-speckit-violet px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                target="_blank"
                rel="noreferrer"
              >
                <StarIcon className="h-4 w-4" /> Star project
              </Link>
            </div>
          }
        />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer
          logo={<SpeckitWordmark className="h-6" />}
          columns={footerColumns}
          copyright={`© ${new Date().getFullYear()} Airnub. All rights reserved.`}
          bottomSlot={
            <div className="flex items-center gap-3 text-slate-400">
              <Link href="mailto:speckit@airnub.io">speckit@airnub.io</Link>
              <span aria-hidden="true">•</span>
              <Link href={SPECKIT_ROUTES.pricing}>Pricing</Link>
            </div>
          }
        />
      </body>
    </html>
  );
}
