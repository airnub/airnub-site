import type { ReactNode } from "react";
import { Container } from "@airnub/ui";
import { clsx } from "clsx";

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden border-b border-border bg-gradient-to-br from-muted via-background to-muted py-16 text-foreground",
        className
      )}
    >
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_hsl(var(--primary)/0.18),_transparent_45%)]" />
      </div>
      <Container className="relative max-w-4xl text-foreground">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-6 text-lg text-muted-foreground">{description}</p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
      </Container>
    </section>
  );
}
