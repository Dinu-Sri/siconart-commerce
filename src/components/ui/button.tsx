import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-surface text-foreground ring-1 ring-border hover:bg-surface-subtle",
        ghost: "text-foreground hover:bg-surface-subtle"
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4",
        lg: "h-12 px-7"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const composed = cn(buttonVariants({ variant, size, className }));

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      className: cn((props.children.props as { className?: string }).className, composed)
    } as { className: string });
  }

  return <button className={composed} {...props} />;
}
