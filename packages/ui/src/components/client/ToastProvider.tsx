"use client";

import * as Toast from "@radix-ui/react-toast";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { PropsWithChildren, ReactNode } from "react";
import { clsx } from "clsx";

type ToastVariant = "success" | "error" | "info";

type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: ReactNode;
  closeLabel?: string;
};

type ToastContextValue = {
  notify: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;

function toastClassNames(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-50";
    case "error":
      return "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-50";
    default:
      return "border-border bg-card text-card-foreground";
  }
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<Array<ToastOptions & { id: number }>>([]);

  const notify = useCallback((options: ToastOptions) => {
    toastId += 1;
    setItems((prev) => [...prev, { id: toastId, variant: "info", ...options }]);
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      <Toast.Provider duration={6000} swipeDirection="right">
        {children}
        {items.map(({ id, title, description, variant = "info", action, closeLabel }) => (
          <Toast.Root
            key={id}
            open
            onOpenChange={(open) => {
              if (!open) {
                setItems((prev) => prev.filter((item) => item.id !== id));
              }
            }}
            className={clsx(
              "relative flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur transition data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:opacity-90 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:opacity-0",
              toastClassNames(variant)
            )}
          >
            <div className="flex-1">
              <Toast.Title className="text-sm font-semibold">{title}</Toast.Title>
              {description ? <Toast.Description className="mt-1 text-sm opacity-80">{description}</Toast.Description> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
            <Toast.Close
              className="absolute right-3 top-3 text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label={closeLabel ?? "Dismiss notification"}
            >
              ×
            </Toast.Close>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-3" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
