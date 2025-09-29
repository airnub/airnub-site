import type { ReactNode } from "react";
import { Section } from "../Section";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/card";
import { cn } from "../lib/cn";

export type FeatureGridItem = {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
};

export type FeatureGridProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: FeatureGridItem[];
  columnsClassName?: string;
  align?: "start" | "center";
  className?: string;
};

export function FeatureGrid({
  eyebrow,
  title,
  description,
  items,
  columnsClassName = "md:grid-cols-2 lg:grid-cols-3",
  align = "start",
  className,
}: FeatureGridProps) {
  return (
    <Section
      className={className}
      contentClassName={cn(align === "center" ? "text-center" : "text-left")}
    >
      {(eyebrow || title || description) && (
        <div className="space-y-4">
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
      <div className={cn("grid gap-6", columnsClassName)}>
        {items.map((item) => (
          <Card key={item.id} className="h-full">
            <CardHeader className="h-full gap-3">
              {item.icon ? (
                <div className="text-primary" aria-hidden="true">
                  {item.icon}
                </div>
              ) : null}
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
}
