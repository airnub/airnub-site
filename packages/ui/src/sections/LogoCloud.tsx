import type { ReactNode } from "react";
import { Container } from "../Container";
import { Card, CardContent } from "../components/card";
import { cn } from "../lib/cn";

export type LogoCloudItem = {
  id: string;
  name: string;
  logo: ReactNode;
};

export type LogoCloudProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: LogoCloudItem[];
  align?: "start" | "center";
  className?: string;
};

export function LogoCloud({
  eyebrow,
  title,
  description,
  items,
  align = "center",
  className,
}: LogoCloudProps) {
  return (
    <section className={className}>
      <Container
        className={cn(
          "space-y-8",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        {(eyebrow || title || description) && (
          <div className="space-y-4">
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-3xl font-semibold text-foreground">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                className={cn(
                  "text-base text-muted-foreground",
                  align === "center" ? "mx-auto max-w-3xl" : undefined
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {items.map((item) => (
            <Card key={item.id} className="h-16 w-40 border-dashed bg-background shadow-none">
              <CardContent className="flex h-full items-center justify-center p-4 text-muted-foreground">
                <span className="sr-only">{item.name}</span>
                <div aria-hidden="true" className="flex items-center justify-center text-foreground/90">
                  {item.logo}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
