"use client";

import { SiteShell, type SiteShellProps } from "@airnub/ui";
import { usePathname } from "next/navigation";

export type ActiveSiteShellProps = SiteShellProps;

export function ActiveSiteShell(props: ActiveSiteShellProps) {
  const pathname = usePathname();
  const activeHref = props.headerActiveHref ?? pathname;

  return <SiteShell {...props} headerActiveHref={activeHref} />;
}
