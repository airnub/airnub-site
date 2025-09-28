import Link from "next/link";
import { AirnubWordmark } from "@airnub/brand";
import { Header, type HeaderProps, type NavItem } from "./components/client/Header";
import { ThemeToggle } from "./components/client/ThemeToggle";
import type { ReactNode } from "react";

const defaultNavItems: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Trust", href: "/trust" },
  { label: "Company", href: "/company" },
  { label: "Contact", href: "/contact" },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.85 9.68.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.13-1.51-1.13-1.51-.92-.64.07-.63.07-.63 1.02.07 1.55 1.07 1.55 1.07.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.04a9.26 9.26 0 0 1 5 0c1.9-1.31 2.74-1.04 2.74-1.04.55 1.42.21 2.47.1 2.73.64.71 1.03 1.62 1.03 2.74 0 3.94-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
            className="hidden rounded-full border border-slate-200 p-2 text-slate-600 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:text-slate-200 dark:hover:text-white lg:inline-flex"
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
