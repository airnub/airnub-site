import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";

export type FooterColumn = {
  heading: string;
  links: { label: string; href: string; external?: boolean; description?: string }[];
};

export type FooterProps = {
  logo: ReactNode;
  columns: FooterColumn[];
  copyright: string;
  description?: string;
  bottomSlot?: ReactNode;
};

export function Footer({ logo, columns, copyright, bottomSlot, description }: FooterProps) {
  return (
    <footer className="border-t border-border bg-background py-12 text-sm text-muted-foreground">
      <Container>
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 text-foreground">{logo}</div>
            {description ? (
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {column.heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                    >
                      <span className="font-medium">{link.label}</span>
                      {link.description ? (
                        <span className="block text-xs text-muted-foreground">{link.description}</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>{copyright}</p>
          {bottomSlot}
        </div>
      </Container>
    </footer>
  );
}
