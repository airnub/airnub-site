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
  bottomSlot?: ReactNode;
};

export function Footer({ logo, columns, copyright, bottomSlot }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <Container>
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">{logo}</div>
            <p className="mt-4 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Governing the developer platform lifecycle with trust, automation, and continuous evidence.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {column.heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:hover:text-white"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                    >
                      <span className="font-medium">{link.label}</span>
                      {link.description ? (
                        <span className="block text-xs text-slate-400 dark:text-slate-500">{link.description}</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex-row">
          <p>{copyright}</p>
          {bottomSlot}
        </div>
      </Container>
    </footer>
  );
}
