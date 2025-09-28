import type { ReactNode } from "react";
import { clsx } from "clsx";

export type FormMessageProps = {
  children: ReactNode;
  variant?: "info" | "success" | "error";
  id?: string;
  className?: string;
};

const variantClasses: Record<NonNullable<FormMessageProps["variant"]>, string> = {
  info: "bg-slate-100 text-slate-700 dark:bg-slate-900/70 dark:text-slate-300",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100",
  error: "bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-100",
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
