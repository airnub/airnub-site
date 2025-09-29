import type { ReactNode } from "react";
import { Container } from "../Container";
import { cn } from "../lib/cn";

export type HeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "start" | "center";
  variant?: "subtle" | "gradient" | "plain";
  className?: string;
};

const variantClassNames: Record<NonNullable<HeroProps["variant"]>, string> = {
  subtle: "relative overflow-hidden border-b border-border bg-[var(--brand-surface-subtle)] text-foreground",
  gradient:
    "relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--brand-primary)_14%,transparent)_0,_transparent_55%)] text-foreground",
  plain: "relative overflow-hidden border-b border-border bg-background text-foreground",
};

export function Hero({
  eyebrow,
  title,
  description,
  actions,
  align = "start",
  variant = "subtle",
  className,
}: HeroProps) {
  return (
    <section className={cn(variantClassNames[variant], className)}>
      <Container
        className={cn(
          "max-w-4xl py-16",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "mt-4 text-4xl font-semibold tracking-tight sm:text-5xl",
            align === "center" ? "mx-auto" : undefined
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className={cn("mt-6 text-lg text-muted-foreground", align === "center" ? "mx-auto max-w-3xl" : undefined)}>
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className={cn("mt-8 flex flex-wrap gap-4", align === "center" ? "justify-center" : "justify-start")}>
            {actions}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
