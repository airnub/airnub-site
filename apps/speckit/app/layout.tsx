import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { FooterSpeckit, HeaderSpeckit } from "@airnub/ui";
import { softwareApplicationJsonLd } from "@airnub/seo";
import { JsonLd } from "../components/JsonLd";

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
    images: ["https://speckit.airnub.io/api/og"],
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
        <HeaderSpeckit />
        <main id="content" className="flex-1">
          {children}
        </main>
        <FooterSpeckit />
      </body>
    </html>
  );
}
