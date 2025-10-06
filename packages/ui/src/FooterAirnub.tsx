"use client";

import Link from "next/link";
import { Footer, type FooterProps, type FooterColumn } from "./Footer";
import type { ReactNode } from "react";
import { Logo, useBrand } from "./brand";

type FooterAirnubProps = Omit<FooterProps, "logo" | "columns" | "bottomSlot" | "copyright"> & {
  bottomSlot?: ReactNode;
  columns?: FooterColumn[];
  bottomLinks?: { label: string; href: string; external?: boolean }[];
  copyrightPrefix?: string;
  pathPrefix?: string;
};

export function FooterAirnub({
  bottomSlot,
  columns = [],
  bottomLinks = [],
  copyrightPrefix,
  pathPrefix = "",
  description,
  ...props
}: FooterAirnubProps) {
  const brand = useBrand();
  const year = new Date().getFullYear();
  const withPrefix = (href: string) =>
    href.startsWith("/") ? `${pathPrefix}${href}`.replace(/\/+/g, "/") : href;
  const resolvedColumns = columns.map((column) => ({
    ...column,
    links: column.links.map((link) => ({
      ...link,
      href: withPrefix(link.href),
    })),
  }));
  const resolvedBottomLinks = bottomLinks.map((link) => ({
    ...link,
    href: withPrefix(link.href),
  }));
  const resolvedDescription = description ?? brand.description;
  const resolvedCopyrightPrefix = copyrightPrefix ?? brand.name;
  return (
    <Footer
      logo={<Logo className="h-6" alt={`${brand.name} logo`} />}
      columns={resolvedColumns}
      description={resolvedDescription}
      bottomSlot={
        bottomSlot ?? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground">
            {resolvedBottomLinks.map((link, index) => (
              <div key={`${link.href}-${link.label}`} className="flex items-center gap-3">
                {index > 0 ? <span aria-hidden="true">•</span> : null}
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        )
      }
      copyright={`© ${year} ${resolvedCopyrightPrefix}. All rights reserved.`}
      {...props}
    />
  );
}
