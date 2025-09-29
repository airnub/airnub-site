import type { ReactNode } from "react";
import { clsx } from "clsx";

export type FormMessageProps = {
  children: ReactNode;
  variant?: "info" | "success" | "error";
  id?: string;
  className?: string;
};

const variantClasses: Record<NonNullable<FormMessageProps["variant"]>, string> = {
  info: "bg-muted text-muted-foreground",
  success: "bg-success/10 text-success",
  error: "bg-destructive/10 text-destructive",
};

export function FormMessage({ children, variant = "info", id, className }: FormMessageProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      id={id}
      className={clsx(
        "rounded-2xl px-4 py-3 text-sm font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
