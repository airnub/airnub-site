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
        "relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
        className
      )}
    >
      <div className="absolute inset-0 opacity-20 dark:opacity-40" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.2),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.4),_transparent_45%)]" />
      </div>
      <Container className="relative max-w-4xl text-slate-900 dark:text-slate-100">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">{description}</p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
      </Container>
    </section>
  );
}
