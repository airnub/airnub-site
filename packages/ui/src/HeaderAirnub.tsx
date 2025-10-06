"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Header, type HeaderProps, type NavItem } from "./components/client/Header";
import { ThemeToggle } from "./components/client/ThemeToggle";
import { GithubIcon } from "./icons/GithubIcon";
import { Logo, useBrand } from "./brand";

const defaultNavItems: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Agentic Delivery Framework", href: "/adf" },
  { label: "Solutions", href: "/solutions" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Trust", href: "/trust" },
  { label: "Company", href: "/company" },
  { label: "Contact", href: "/contact" },
];

type HeaderAirnubProps = Omit<HeaderProps, "logo" | "navItems" | "rightSlot" | "homeAriaLabel"> & {
  homeAriaLabel?: string;
  navItems?: NavItem[];
  additionalRightSlot?: ReactNode;
  themeToggleLabel?: string;
  githubLabel?: string;
};

export function HeaderAirnub({
  homeAriaLabel,
  additionalRightSlot,
  navItems = defaultNavItems,
  themeToggleLabel = "Toggle theme",
  githubLabel,
  ...props
}: HeaderAirnubProps) {
  const brand = useBrand();
  const computedHomeAriaLabel = homeAriaLabel ?? `${brand.name} home`;
  const computedGithubLabel = githubLabel ?? `${brand.name} on GitHub`;
  const githubUrl = brand.social.github;

  return (
    <Header
      logo={<Logo className="h-6" alt={`${brand.name} logo`} />}
      navItems={navItems}
      homeAriaLabel={computedHomeAriaLabel}
      rightSlot={
        <div className="flex items-center gap-3">
          {githubUrl ? (
            <Link
              href={githubUrl}
              className="hidden rounded-full border border-border p-2 text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:inline-flex"
              aria-label={computedGithubLabel}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
          ) : null}
          <ThemeToggle className="inline-flex" label={themeToggleLabel} />
          {additionalRightSlot}
        </div>
      }
      {...props}
    />
  );
}
