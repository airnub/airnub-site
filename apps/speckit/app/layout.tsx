import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer, Header } from "@airnub/ui";
import { SpeckitWordmark } from "@airnub/brand";
import { GithubIcon, StarIcon } from "../components/icons";
import { softwareApplicationJsonLd } from "@airnub/seo";
import { JsonLd } from "../components/JsonLd";

const navItems = [
  { label: "Product", href: "/product" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Solutions", href: "/solutions" },
  { label: "Docs", href: "https://docs.speckit.dev", external: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Trust", href: "https://trust.airnub.io", external: true },
];

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Integrations", href: "/product#integrations" },
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

const jsonLd = softwareApplicationJsonLd({
  name: "Speckit",
  url: "https://speckit.airnub.io",
  applicationCategory: "DevSecOps Application",
  description: "End vibe-coding. Ship secure, auditable releases with governed workflows and continuous evidence.",
  softwareHelp: "https://docs.speckit.dev",
  sameAs: ["https://github.com/airnub/speckit", "https://airnub.io"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://speckit.airnub.io"),
  title: {
    default: "Speckit — Governed release workflows",
    template: "%s | Speckit",
  },
  description: "Speckit eliminates vibe-coding by turning compliance and platform controls into auditable, automated workflows.",
  openGraph: {
    title: "Speckit",
    description: "Governed release workflows with evidence automation.",
    url: "https://speckit.airnub.io",
    siteName: "Speckit",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Speckit",
    description: "Governed release workflows with evidence automation.",
  },
  icons: {
    icon: "/favicon.ico",
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
          navItems={navItems}
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
              <Link href="/pricing">Pricing</Link>
            </div>
          }
        />
      </body>
    </html>
  );
}
