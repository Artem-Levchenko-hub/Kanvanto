import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border border-graphite-500 bg-graphite-700 text-graphite-100",
        accent: "border border-red-primary/30 bg-red-tint text-red-primary",
        chrome: "border border-chrome/30 bg-graphite-800 text-chrome",
        success: "border border-success/30 bg-success/10 text-success",
        warning: "border border-warning/30 bg-warning/10 text-warning",
        error: "border border-error/30 bg-error/10 text-error",
        outline: "border border-chrome/40 bg-transparent text-graphite-100",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
