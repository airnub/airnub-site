import type { HTMLAttributes, PropsWithChildren } from "react";
import { clsx } from "clsx";

type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={clsx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}
