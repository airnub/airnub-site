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
        "relative overflow-hidden border-b border-border bg-muted py-16 text-foreground",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15)_0,_rgba(248,250,252,0)_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15)_0,_rgba(15,23,42,0)_55%)]"
        aria-hidden="true"
      />
      <Container className="max-w-4xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400/80">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        {description ? <p className="mt-6 text-lg text-muted-foreground">{description}</p> : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
      </Container>
    </section>
  );
}
