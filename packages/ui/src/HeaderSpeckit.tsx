import Link from "next/link";
import { SpeckitWordmark } from "@airnub/brand";
import { Header, type HeaderProps, type NavItem } from "./components/client/Header";
import type { ReactNode } from "react";

const navItems: NavItem[] = [
  { label: "Product", href: "/product" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Solutions", href: "/solutions" },
  { label: "Docs", href: "https://docs.speckit.dev", external: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Trust", href: "https://trust.airnub.io", external: true },
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

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.5 14.09 9h5.66l-4.58 3.32L16.66 18 12 14.89 7.34 18l1.49-5.68L4.25 9h5.66L12 3.5Z" />
    </svg>
  );
}

type HeaderSpeckitProps = Omit<HeaderProps, "logo" | "navItems" | "rightSlot" | "homeAriaLabel"> & {
  homeAriaLabel?: string;
  additionalRightSlot?: ReactNode;
  githubHref?: string;
  starHref?: string;
  starLabel?: string;
};

export function HeaderSpeckit({
  homeAriaLabel = "Speckit home",
  additionalRightSlot,
  githubHref = "https://github.com/airnub/speckit",
  starHref = "https://github.com/airnub/speckit",
  starLabel = "Star project",
  ...props
}: HeaderSpeckitProps) {
  return (
    <Header
      logo={<SpeckitWordmark className="h-6" />}
      navItems={navItems}
      homeAriaLabel={homeAriaLabel}
      rightSlot={
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={githubHref}
            className="rounded-full border border-white/10 p-2 text-slate-100 transition hover:text-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            aria-label="Speckit on GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon className="h-4 w-4" />
          </Link>
          <Link
            href={starHref}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-speckit-indigo to-speckit-violet px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
            target="_blank"
            rel="noreferrer"
          >
            <StarIcon className="h-4 w-4" /> {starLabel}
          </Link>
          {additionalRightSlot}
        </div>
      }
      {...props}
    />
  );
}
