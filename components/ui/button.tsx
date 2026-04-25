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
          "bg-red-primary text-white hover:bg-red-hover active:bg-red-pressed shadow-[0_0_0_1px_rgba(220,38,38,0.5)] hover:shadow-glow-red",
        secondary:
          "bg-graphite-700 text-graphite-50 border border-graphite-500 hover:bg-graphite-600 hover:border-chrome/30",
        ghost:
          "text-graphite-100 hover:bg-graphite-700 hover:text-graphite-50",
        outline:
          "border border-chrome/30 bg-transparent text-graphite-100 hover:bg-graphite-700 hover:border-chrome/60",
        link: "text-red-primary underline-offset-4 hover:underline",
        destructive:
          "bg-error-dark text-white hover:bg-error",
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
