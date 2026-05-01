"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          {
            "btn-primary":     variant === "primary",
            "btn-secondary":   variant === "secondary",
            "btn-ghost":       variant === "ghost",
            "btn-destructive": variant === "destructive",
            // legacy: "outline" mapped to secondary
            "btn-secondary text-sm": variant === ("outline" as string),
          },
          size === "sm" && "text-xs",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
