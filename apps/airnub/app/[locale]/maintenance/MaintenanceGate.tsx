import type { ReactNode } from "react";
import { Container } from "@airnub/ui";

export type MaintenanceGateProps = {
  enabled: boolean;
  title: string;
  description: string;
  cta: string;
  children: ReactNode;
};

export function MaintenanceGate({ enabled, title, description, cta, children }: MaintenanceGateProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[60vh] items-center bg-gradient-to-b from-muted via-background to-background text-foreground">
      <Container className="max-w-3xl py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400/70">Airnub</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        <a
          href="mailto:hello@airnub.io"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {cta}
        </a>
      </Container>
    </div>
  );
}
