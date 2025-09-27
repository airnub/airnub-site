import type { Metadata } from "next";
import "./globals.css";
import { FooterAirnub, HeaderAirnub } from "@airnub/ui";
import type { ReactNode } from "react";
import { buildAirnubOrganizationJsonLd } from "../lib/jsonld";
import { AIRNUB_BASE_URL } from "../lib/routes";

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
        <HeaderAirnub />
        <main id="content" className="flex-1">
          {children}
        </main>
        <FooterAirnub />
      </body>
    </html>
  );
}
