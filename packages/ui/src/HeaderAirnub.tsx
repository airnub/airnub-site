import Link from "next/link";
import { AirnubWordmark } from "@airnub/brand";
import type { ReactNode } from "react";
import { Header, type HeaderProps, type NavItem } from "./components/client/Header";
import { ThemeToggle } from "./components/client/ThemeToggle";
import { GithubIcon } from "./icons/GithubIcon";

const defaultNavItems: NavItem[] = [
  { label: "Products", href: "/products" },
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
  homeAriaLabel = "Airnub home",
  additionalRightSlot,
  navItems = defaultNavItems,
  themeToggleLabel = "Toggle theme",
  githubLabel = "Airnub on GitHub",
  ...props
}: HeaderAirnubProps) {
  return (
    <Header
      logo={<AirnubWordmark className="h-6" />}
      navItems={navItems}
      homeAriaLabel={homeAriaLabel}
      rightSlot={
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/airnub"
            className="hidden rounded-full border border-border p-2 text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:inline-flex"
            aria-label={githubLabel}
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon className="h-4 w-4" />
          </Link>
          <ThemeToggle className="inline-flex" label={themeToggleLabel} />
          {additionalRightSlot}
        </div>
      }
      {...props}
    />
  );
}
