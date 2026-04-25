import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-base ease-standard disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background hover:bg-graphite-100 active:bg-graphite-50 shadow-e-1",
        secondary:
          "bg-card text-foreground border border-border hover:bg-graphite-700 hover:border-chrome/40 shadow-e-1",
        ghost:
          "text-graphite-100 hover:bg-graphite-700 hover:text-foreground",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-graphite-700 hover:border-chrome",
        link: "text-red-primary underline-offset-4 hover:underline",
        destructive:
          "bg-red-primary text-white hover:bg-red-hover",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        default: "h-11 px-5 py-2",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
