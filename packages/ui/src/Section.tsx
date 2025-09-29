import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";
import { clsx } from "clsx";

import { Container } from "./Container";

type SectionOwnProps<T extends ElementType> = {
  as?: T;
  /**
   * Whether to wrap children in the shared Container component.
   * Defaults to true so sections stay aligned with the grid.
   */
  container?: boolean;
  /**
   * Applies the standard vertical stack spacing between direct children.
   * Disable when a section manages internal layout manually.
   */
  stack?: boolean;
  contentClassName?: string;
};

type SectionProps<T extends ElementType> = PropsWithChildren<
  SectionOwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className"> & {
      className?: string;
    }
>;

const sectionPaddingClass = "py-section-sm sm:py-section-md lg:py-section-lg";
const sectionStackClass = "space-y-section-sm sm:space-y-section-md lg:space-y-section-lg";

export function Section<T extends ElementType = "section">({
  as,
  container = true,
  stack = true,
  contentClassName,
  className,
  children,
  ...rest
}: SectionProps<T>) {
  const Component = (as ?? "section") as ElementType;
  const content = container ? (
    <Container className={clsx(stack && sectionStackClass, contentClassName)}>{children}</Container>
  ) : (
    <div className={clsx(stack && sectionStackClass, contentClassName)}>{children}</div>
  );

  return (
    <Component className={clsx(sectionPaddingClass, className)} {...(rest as ComponentPropsWithoutRef<T>)}>
      {content}
    </Component>
  );
}
