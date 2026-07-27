import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "pressable inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border-2 border-border text-[15px] font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-soft disabled:bg-secondary disabled:text-muted-foreground disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-drawn",
        accent: "bg-accent text-accent-foreground shadow-drawn",
        soft: "bg-sprout text-foreground",
        quiet: "bg-card text-foreground hover:bg-background",
        destructive: "bg-destructive text-destructive-foreground shadow-drawn",
        outline: "border-dashed border-primary bg-card text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "border-transparent bg-transparent text-primary hover:text-foreground",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-12 px-6 py-3",
        sm: "min-h-10 px-5 text-[14px]",
        lg: "min-h-[54px] px-8 text-[17px]",
        icon: "h-11 w-11 p-0",
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
