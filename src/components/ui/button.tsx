import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-[15px] font-bold cursor-pointer transition-[transform,background-color,opacity] duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Single primary action — green fill. */
        default:
          "border-0 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:bg-muted disabled:text-[var(--lo-green-faint)]",
        accent:
          "border-0 bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98] disabled:bg-muted disabled:text-[var(--lo-green-faint)]",
        /** Secondary filled action — white card, not green. */
        soft: "border-0 bg-card text-foreground hover:bg-card/90 active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground",
        /** Tertiary / cancel — outlined, transparent. */
        quiet:
          "border border-muted-foreground/35 bg-transparent text-foreground hover:bg-card active:bg-card active:scale-[0.98] disabled:opacity-50 disabled:bg-transparent",
        destructive: "border-0 bg-destructive text-destructive-foreground",
        outline:
          "border border-muted-foreground/35 bg-transparent text-foreground hover:bg-card active:bg-card active:scale-[0.98] disabled:opacity-50",
        secondary:
          "border-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98] disabled:opacity-50",
        ghost: "border-0 bg-transparent text-primary hover:text-foreground disabled:opacity-50",
        link: "border-0 bg-transparent text-primary underline-offset-4 hover:underline disabled:opacity-50",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-5 text-[13px]",
        lg: "h-14 min-h-14 px-8 text-[17px]",
        icon: "h-11 w-11 rounded-xl",
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
