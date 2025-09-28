"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "next-intl";
import { localeHref } from "../lib/locale";

type LocaleLinkProps = ComponentProps<typeof Link>;

export function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  const locale = useLocale();
  const localizedHref = typeof href === "string" ? localeHref(locale, href) : href;

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}
