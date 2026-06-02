import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
  size?: "default" | "sm";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          "disabled:opacity-50 disabled:pointer-events-none",
          size === "sm" ? "h-9 px-3" : "h-10 px-4",
          variant === "ghost"
            ? "bg-transparent hover:bg-accent hover:text-accent-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
