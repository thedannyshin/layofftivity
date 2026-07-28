import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-[15px] font-bold cursor-pointer border-0 transition-[transform,background-color] duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft disabled:pointer-events-none disabled:bg-muted disabled:text-[var(--lo-green-faint)] disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98]",
        soft: "bg-primary-soft text-foreground hover:bg-[var(--lo-hatch-green)]",
        quiet: "bg-secondary text-foreground hover:bg-primary-soft",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "bg-secondary text-foreground hover:bg-primary-soft",
        secondary: "bg-secondary text-foreground hover:bg-primary-soft",
        ghost: "bg-transparent text-primary hover:text-foreground",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-5 text-[13px]",
        lg: "h-14 px-8 text-[17px]",
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
