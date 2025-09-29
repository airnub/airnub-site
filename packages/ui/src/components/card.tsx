import * as React from "react";
import { cn } from "../lib/cn";

const baseCardClassName = "bg-card text-card-foreground border border-border rounded-2xl shadow-sm";
const baseHeaderClassName = "flex flex-col gap-2 p-5";
const baseContentClassName = "p-5 pt-0";
const baseTitleClassName = "text-lg font-semibold leading-tight tracking-tight text-foreground";
const baseDescriptionClassName = "text-sm text-muted-foreground";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(baseCardClassName, className)} {...props} />;
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(baseHeaderClassName, className)} {...props} />;
  }
);
CardHeader.displayName = "CardHeader";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(baseContentClassName, className)} {...props} />;
  }
);
CardContent.displayName = "CardContent";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn(baseTitleClassName, className)} {...props} />
    );
  }
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <p ref={ref} className={cn(baseDescriptionClassName, className)} {...props} />;
});
CardDescription.displayName = "CardDescription";
