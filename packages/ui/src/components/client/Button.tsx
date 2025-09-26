"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    asChild?: boolean;
  }
>;

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-sky-600 text-white hover:bg-sky-500 focus-visible:outline-sky-500",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-800",
  ghost:
    "bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-300 dark:text-white dark:hover:bg-white/10",
};

export function Button({ variant = "primary", asChild = false, className, children, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const componentProps = asChild ? props : { type: props.type ?? "button", ...props };
  return (
    <Component
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variantStyles[variant],
        className
      )}
      {...componentProps}
    >
      {children}
    </Component>
  );
}
