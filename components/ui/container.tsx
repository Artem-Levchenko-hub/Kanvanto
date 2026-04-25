import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide";
}

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-[1280px]",
        size === "wide" && "max-w-[1440px]",
        className
      )}
      {...props}
    />
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: "default" | "lg";
}

export function Section({ className, size = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        size === "default" && "py-16 lg:py-24",
        size === "lg" && "py-24 lg:py-32",
        className
      )}
      {...props}
    />
  );
}

export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-label uppercase tracking-[0.2em] text-chrome font-semibold",
        className
      )}
      {...props}
    />
  );
}
