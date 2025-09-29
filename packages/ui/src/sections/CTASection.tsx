import type { ReactNode } from "react";
import { Section } from "../Section";
import { Card, CardContent } from "../components/card";
import { cn } from "../lib/cn";

export type CTASectionItem = {
  id: string;
  title: string;
  description?: string;
};

export type CTASectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  items?: CTASectionItem[];
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  tone?: "surface" | "subtle";
  align?: "start" | "center";
  className?: string;
};

const bulletStyles = [
  { backgroundColor: "var(--brand-primary)" },
  { backgroundColor: "var(--brand-accent)" },
  { backgroundColor: "color-mix(in srgb, var(--brand-foreground) 70%, transparent)" },
];

export function CTASection({
  eyebrow,
  title,
  description,
  items,
  actions,
  aside,
  children,
  tone = "surface",
  align = "start",
  className,
}: CTASectionProps) {
  return (
    <Section className={className} stack={false}>
      <Card
        className={cn(
          "overflow-hidden border border-border",
          tone === "subtle" ? "bg-[var(--brand-surface-subtle)] text-foreground" : undefined
        )}
      >
        <CardContent className="grid gap-12 pt-6 lg:grid-cols-[2fr,3fr] lg:items-start">
          <div className="space-y-6">
            <div
              className={cn(
                "space-y-4",
                align === "center" ? "text-center" : "text-left"
              )}
            >
              {eyebrow ? (
                <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                  {eyebrow}
                </p>
              ) : null}
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
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
            </div>
            {children}
            {items && items.length > 0 ? (
              <ul className="space-y-3 text-sm text-muted-foreground">
                {items.map((item, index) => (
                  <li key={item.id} className="flex gap-3">
                    <span
                      className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full"
                      style={bulletStyles[index % bulletStyles.length]}
                      aria-hidden="true"
                    />
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      {item.description ? (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
            {actions ? <div className="flex flex-wrap gap-4">{actions}</div> : null}
          </div>
          {aside}
        </CardContent>
      </Card>
    </Section>
  );
}
