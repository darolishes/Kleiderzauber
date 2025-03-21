import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "",
        brand:
          "border-[#7c3aed] focus-visible:ring-[#7c3aed] dark:border-[#a78bfa] dark:focus-visible:ring-[#a78bfa]",
        filled: "bg-muted/50 border-transparent focus-visible:bg-transparent",
        "brand-filled":
          "bg-[#7c3aed]/10 border-transparent focus-visible:bg-transparent focus-visible:border-[#7c3aed] dark:bg-[#a78bfa]/10 dark:focus-visible:border-[#a78bfa]",
      },
      inputSize: {
        default: "h-9",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4",
        xl: "h-12 px-4 text-base",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      rounded: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, rounded, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant, inputSize, rounded, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
