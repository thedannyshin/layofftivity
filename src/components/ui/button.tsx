import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-[15px] font-bold cursor-pointer border-2 border-transparent transition-[box-shadow,transform,background-color] duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft disabled:pointer-events-none disabled:border-transparent disabled:bg-muted disabled:text-[var(--lo-green-faint)] disabled:shadow-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-primary text-primary-foreground shadow-[4px_4px_0_var(--lo-dark-green)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[var(--lo-elevation-press)]",
        accent:
          "border-foreground bg-accent text-accent-foreground shadow-[4px_4px_0_var(--lo-dark-green)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[var(--lo-elevation-press)]",
        soft: "bg-primary-soft text-foreground hover:bg-[var(--lo-hatch-green)]",
        quiet: "bg-secondary text-foreground hover:bg-primary-soft",
        destructive: "bg-destructive text-destructive-foreground",
        outline:
          "border-dashed border-primary bg-card text-foreground hover:bg-secondary",
        secondary: "bg-secondary text-foreground hover:bg-primary-soft",
        ghost: "border-transparent bg-transparent text-primary hover:text-foreground",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-5 text-[13px]",
        lg: "h-14 px-8 text-[17px]",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
