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
    "bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-ring",
  secondary:
    "bg-muted text-foreground hover:bg-muted/80 focus-visible:outline-ring",
  ghost:
    "bg-transparent text-foreground hover:bg-muted focus-visible:outline-ring",
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
