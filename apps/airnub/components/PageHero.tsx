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
    <section className={clsx("border-b border-slate-200 bg-white py-16 text-slate-900", className)}>
      <Container className="max-w-4xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {description ? <p className="mt-6 text-lg text-slate-600">{description}</p> : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
      </Container>
    </section>
  );
}
