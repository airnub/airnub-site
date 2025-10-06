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
  GithubIcon,
  fontMono,
  fontSans,
  type FooterColumn,
  type NavItem,
} from "@airnub/ui";
import { buildBrandMetadata } from "@airnub/brand";
import { JsonLd } from "../components/JsonLd";
import { buildAdfSoftwareJsonLd } from "../lib/jsonld";
import { ADF_BASE_URL } from "../lib/routes";
import adfBrand from "../brand.config";
import { ActiveSiteShell } from "../components/ActiveSiteShell";
import { getAdfMessages } from "../messages";

const jsonLd = buildAdfSoftwareJsonLd();

function resolveDocsUrl() {
  return process.env.NEXT_PUBLIC_DOCS_URL ?? "https://airnub.github.io/agentic-delivery-framework/";
}

const TRUST_CENTER_URL = "https://trust.airnub.io";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getAdfMessages();
  const hero = messages.home.hero;
  const ogPath = adfBrand.og ?? "/opengraph-image";
  const ogUrl = new URL(ogPath, ADF_BASE_URL).toString();

  return buildBrandMetadata({
    brand: adfBrand,
    baseUrl: ADF_BASE_URL,
    overrides: {
      title: {
        default: hero.title,
        template: `%s · ${adfBrand.name}`,
      },
      description: hero.description,
      openGraph: {
        description: hero.description,
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: `${adfBrand.name} Open Graph image`,
          },
        ],
      },
      twitter: {
        description: hero.description,
        images: [ogUrl],
      },
      alternates: {
        canonical: "/",
      },
    },
  });
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const messages = await getAdfMessages();
  const layoutMessages = messages.layout;
  const docsUrl = resolveDocsUrl();

  const navItems: NavItem[] = layoutMessages.nav.items.map((item) => {
    const href = item.href ?? (item.id === "docs" ? docsUrl : undefined);

    if (!href) {
      throw new Error(`Missing href for navigation item: ${item.id}`);
    }

    return {
      label: item.label,
      href,
      external: item.external,
    };
  });

  const footerColumns: FooterColumn[] = layoutMessages.footer.columns.map((column) => ({
    heading: column.heading,
    links: column.links.map((link) => {
      const description =
        "description" in link && typeof link.description === "string"
          ? link.description
          : undefined;

      return {
        label: link.label,
        href: link.href ?? (link.id === "docs" ? docsUrl : TRUST_CENTER_URL),
        external: link.external ?? link.id !== "quickstart",
        ...(description !== undefined ? { description } : {}),
      };
    }),
  }));

  const footerBottomLinks = layoutMessages.footer.bottomLinks.map((link) => ({
    label: link.label,
    href: link.href ?? (link.id === "docs" ? docsUrl : TRUST_CENTER_URL),
    external: link.external ?? link.id !== "quickstart",
  }));

  const year = new Date().getFullYear();
  const githubUrl = adfBrand.social.github;

  return (
    <html
      lang="en"
      className={clsx(fontSans.variable, fontMono.variable, "font-sans antialiased")}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <JsonLd data={jsonLd} />
      </head>
      <body className="flex min-h-screen flex-col">
        <BrandProvider value={adfBrand}>
          <ThemeProvider>
            <ToastProvider>
              <ActiveSiteShell
                skipToContentLabel={layoutMessages.skipToContent}
                navItems={navItems}
                homeHref="/"
                homeAriaLabel={`${adfBrand.name} home`}
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
                  </div>
                }
                footerColumns={footerColumns}
                footerDescription={layoutMessages.footer.description}
                footerBottomLinks={footerBottomLinks}
                footerCopyright={`© ${year} ${adfBrand.name}. All rights reserved.`}
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
