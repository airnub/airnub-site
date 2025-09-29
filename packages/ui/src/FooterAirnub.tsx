import Link from "next/link";
import { AirnubWordmark } from "@airnub/brand";
import { Footer, type FooterProps, type FooterColumn } from "./Footer";
import type { ReactNode } from "react";

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
  copyrightPrefix = "Airnub",
  pathPrefix = "",
  description,
  ...props
}: FooterAirnubProps) {
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
  return (
    <Footer
      logo={<AirnubWordmark className="h-6" />}
      columns={resolvedColumns}
      description={description}
      bottomSlot={
        bottomSlot ?? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-slate-500 dark:text-slate-400">
            {resolvedBottomLinks.map((link, index) => (
              <div key={`${link.href}-${link.label}`} className="flex items-center gap-3">
                {index > 0 ? <span aria-hidden="true">•</span> : null}
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        )
      }
      copyright={`© ${year} ${copyrightPrefix}. All rights reserved.`}
      {...props}
    />
  );
}
