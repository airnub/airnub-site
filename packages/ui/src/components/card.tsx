import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border bg-card text-card-foreground shadow-card p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
