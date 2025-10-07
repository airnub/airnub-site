"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import { Container } from "../../Container";

export type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  description?: string;
};

export type HeaderProps = {
  logo: ReactNode;
  navItems: NavItem[];
  rightSlot?: ReactNode;
  homeHref?: string;
  homeAriaLabel?: string;
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
  activeHref?: string;
  isNavItemActive?: (item: NavItem) => boolean;
};

export function Header({
  logo,
  navItems,
  rightSlot,
  homeHref = "/",
  homeAriaLabel = "Home",
  cta,
  className,
  activeHref,
  isNavItemActive,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  const resolveIsActive = (item: NavItem) => {
    if (typeof isNavItemActive === "function") {
      return isNavItemActive(item);
    }

    if (activeHref) {
      return item.href === activeHref;
    }

    return false;
  };

  return (
    <header className={clsx("sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur", className)}>
      <Container className="flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link href={homeHref} aria-label={homeAriaLabel} className="flex items-center gap-2 text-foreground">
            {logo}
          </Link>
          <nav className="hidden lg:flex" aria-label="Primary">
            <ul className="flex items-center gap-6 text-sm font-medium">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      resolveIsActive(item) && "bg-muted text-foreground"
                    )}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    aria-current={resolveIsActive(item) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {rightSlot}
          {cta ? (
            <Link
              href={cta.href}
              className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:inline-flex"
            >
              {cta.label}
            </Link>
          ) : null}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-2 text-muted-foreground transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span className="sr-only">Toggle navigation</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </Container>
      <nav
        id="mobile-nav"
        hidden={!open}
        className="border-t border-border bg-background lg:hidden"
        aria-label="Primary navigation"
      >
        <Container>
          <ul className="flex flex-col gap-1 py-4 text-base font-medium">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "block rounded-xl px-3 py-2 text-muted-foreground transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    resolveIsActive(item) && "bg-muted text-foreground"
                  )}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  aria-current={resolveIsActive(item) ? "page" : undefined}
                >
                  <span className={clsx("block text-base font-semibold", resolveIsActive(item) && "text-foreground")}>{
                    item.label
                  }</span>
                  {item.description ? (
                    <span className="block text-sm text-muted-foreground">{item.description}</span>
                  ) : null}
                </Link>
              </li>
            ))}
            {cta ? (
              <li>
                <Link
                  href={cta.href}
                  className="mt-2 inline-flex w-full justify-center rounded-full bg-foreground px-4 py-2 text-center text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {cta.label}
                </Link>
              </li>
            ) : null}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
