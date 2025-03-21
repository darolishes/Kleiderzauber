import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        brand:
          "bg-[#7c3aed] text-white shadow hover:bg-[#6d28d9] dark:bg-[#8b5cf6] dark:hover:bg-[#7c3aed]",
        "brand-secondary":
          "bg-[#a78bfa] text-white shadow hover:bg-[#8b5cf6] dark:bg-[#c4b5fd] dark:text-[#1e1b4b] dark:hover:bg-[#a78bfa]",
        "brand-outline":
          "border-2 border-[#7c3aed] bg-transparent text-[#7c3aed] hover:bg-[#7c3aed]/10 dark:border-[#a78bfa] dark:text-[#a78bfa] dark:hover:bg-[#a78bfa]/10",
        "brand-ghost":
          "text-[#7c3aed] hover:bg-[#7c3aed]/10 dark:text-[#a78bfa] dark:hover:bg-[#a78bfa]/10",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        xl: "h-12 rounded-md px-10 text-base",
      },
      animation: {
        none: "",
        wiggle: "hover:animate-wiggle",
        pulse: "animate-pulse",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, animation, rounded, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, animation, rounded, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
