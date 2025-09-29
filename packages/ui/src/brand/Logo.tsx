"use client";

import { useEffect, useMemo, useState, type ImgHTMLAttributes } from "react";
import { useTheme } from "next-themes";
import { clsx } from "clsx";
import { useBrand } from "./BrandProvider";

export interface LogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  lightSrc?: string;
  darkSrc?: string;
}

export function Logo({ lightSrc, darkSrc, alt, className, ...props }: LogoProps) {
  const brand = useBrand();
  const { resolvedTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = useMemo(() => {
    if (!mounted) {
      return undefined;
    }

    return resolvedTheme ?? theme ?? systemTheme ?? undefined;
  }, [mounted, resolvedTheme, theme, systemTheme]);

  const resolvedLight = lightSrc ?? brand.logos.light ?? brand.logos.dark;
  const resolvedDark = darkSrc ?? brand.logos.dark ?? brand.logos.light;

  const src = activeTheme === "dark" ? resolvedDark : resolvedLight;

  if (!src) {
    return <span className={clsx("font-semibold tracking-tight text-foreground", className)}>{brand.name}</span>;
  }

  return (
    <img
      src={src}
      alt={alt ?? `${brand.name} logo`}
      className={clsx("h-6 w-auto", className)}
      {...props}
    />
  );
}
