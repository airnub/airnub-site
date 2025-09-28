import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { FooterSpeckit, HeaderSpeckit } from "@airnub/ui";
import { JsonLd } from "../components/JsonLd";
import { buildSpeckitSoftwareJsonLd } from "../lib/jsonld";
import { SPECKIT_BASE_URL } from "../lib/routes";

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
    <html lang="en" className="font-sans antialiased dark" suppressHydrationWarning>
      <head>
        <JsonLd data={jsonLd} />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <HeaderSpeckit />
        <main id="content" className="flex-1">
          {children}
        </main>
        <FooterSpeckit />
      </body>
    </html>
  );
}
