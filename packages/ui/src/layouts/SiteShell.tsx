import Link from "next/link";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import { Header, type HeaderProps, type NavItem } from "../components/client/Header";
import { Footer, type FooterColumn } from "../Footer";
import { Logo } from "../brand";

export type SiteShellProps = {
  children: ReactNode;
  skipToContentLabel: string;
  navItems: NavItem[];
  headerLogo?: ReactNode;
  homeHref?: string;
  homeAriaLabel?: string;
  headerRightSlot?: ReactNode;
  headerCta?: HeaderProps["cta"];
  headerClassName?: string;
  mainClassName?: string;
  footerLogo?: ReactNode;
  footerColumns: FooterColumn[];
  footerDescription?: string;
  footerBottomLinks?: { label: string; href: string; external?: boolean }[];
  footerBottomSlot?: ReactNode;
  footerCopyright: string;
};

export function SiteShell({
  children,
  skipToContentLabel,
  navItems,
  headerLogo,
  homeHref = "/",
  homeAriaLabel = "Home",
  headerRightSlot,
  headerCta,
  headerClassName,
  mainClassName,
  footerLogo,
  footerColumns,
  footerDescription,
  footerBottomLinks = [],
  footerBottomSlot,
  footerCopyright,
}: SiteShellProps) {
  const resolvedHeaderLogo = headerLogo ?? <Logo className="h-6" />;
  const resolvedFooterLogo = footerLogo ?? <Logo className="h-6" />;

  const bottomSlot =
    footerBottomSlot ??
    (footerBottomLinks.length > 0 ? (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground">
        {footerBottomLinks.map((link, index) => (
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
    ) : null);

  return (
    <>
      <a href="#content" className="skip-link">
        {skipToContentLabel}
      </a>
      <Header
        logo={resolvedHeaderLogo}
        navItems={navItems}
        homeHref={homeHref}
        homeAriaLabel={homeAriaLabel}
        rightSlot={headerRightSlot}
        cta={headerCta}
        className={headerClassName}
      />
      <main id="content" className={clsx("flex-1", mainClassName)}>
        {children}
      </main>
      <Footer
        logo={resolvedFooterLogo}
        columns={footerColumns}
        description={footerDescription}
        bottomSlot={bottomSlot}
        copyright={footerCopyright}
      />
    </>
  );
}
