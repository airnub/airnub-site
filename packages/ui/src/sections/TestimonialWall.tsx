import type { ReactNode } from "react";
import { Container } from "../Container";
import { Card, CardContent } from "../components/card";
import { cn } from "../lib/cn";

export type TestimonialWallItem = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: ReactNode;
};

export type TestimonialWallProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: TestimonialWallItem[];
  columnsClassName?: string;
  align?: "start" | "center";
  className?: string;
  inline?: boolean;
};

export function TestimonialWall({
  eyebrow,
  title,
  description,
  items,
  columnsClassName = "md:grid-cols-2",
  align = "start",
  className,
  inline = false,
}: TestimonialWallProps) {
  const grid = (
    <div className={cn("grid gap-6", columnsClassName, inline ? className : undefined)}>
      {items.map((item) => (
        <Card
          key={item.id}
          className="h-full border-none bg-[var(--brand-surface-subtle)] text-foreground shadow-none"
        >
          <CardContent className="flex h-full flex-col gap-6 pt-5">
            <div className="space-y-3">
              <p className="text-base text-muted-foreground">{item.quote}</p>
            </div>
            <div className="flex items-center gap-3">
              {item.avatar ? (
                <div className="h-10 w-10 overflow-hidden rounded-full bg-[var(--brand-surface-accent)] text-sm font-semibold text-foreground">
                  {item.avatar}
                </div>
              ) : null}
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">{item.author}</p>
                {item.role ? <p className="text-muted-foreground">{item.role}</p> : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (inline) {
    return grid;
  }

  return (
    <section className={className}>
      <Container className="space-y-12">
        {(eyebrow || title || description) && (
          <div
            className={cn(
              "space-y-4",
              align === "center" ? "text-center" : "text-left"
            )}
          >
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-wide text-primary/80">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
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
        {grid}
      </Container>
    </section>
  );
}
