"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

const ICON_SIZE = "h-4 w-4";

function SunIcon() {
  return (
    <svg className={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v-2m0 19v-2m7.778-7.778h2m-19 0h2M18.364 5.636l1.414-1.414M4.222 19.778l1.414-1.414m0-12.728L4.222 4.222m15.556 15.556-1.414-1.414M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1 1 11.21 3 7.5 7.5 0 0 0 21 12.79Z"
      />
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg className={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9H4V6Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 18h19" />
    </svg>
  );
}

type Theme = "light" | "dark" | "system";

const themes: Theme[] = ["light", "dark", "system"];

const themeIcons: Record<Theme, ReactNode> = {
  light: <SunIcon />,
  dark: <MoonIcon />,
  system: <LaptopIcon />,
};

type ThemeToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export function ThemeToggle({ label = "Toggle theme", className, ...props }: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeTheme = useMemo<Theme>(() => {
    if (!mounted) {
      return "system";
    }
    if (theme === "system") {
      return "system";
    }
    return (resolvedTheme ?? "light") as Theme;
  }, [mounted, theme, resolvedTheme]);

  const handleToggle = () => {
    const currentIndex = themes.indexOf((theme as Theme) ?? "system");
    const safeIndex = currentIndex >= 0 ? currentIndex : themes.indexOf("system");
    const nextTheme = themes[(safeIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:text-slate-200 dark:hover:text-white",
        className
      )}
      onClick={handleToggle}
      aria-label={label}
      {...props}
    >
      <span aria-hidden="true">{themeIcons[activeTheme]}</span>
    </button>
  );
}
