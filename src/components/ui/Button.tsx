import { cn } from "../../lib/cn";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "default" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "default" | "lg";

const variants: Record<ButtonVariant, string> = {
  default: "bg-golden-500 text-dark-900 hover:bg-golden-400 shadow-golden-500/20 shadow-lg",
  outline: "border border-dark-400 text-dark-50 hover:bg-dark-600",
  ghost: "text-dark-200 hover:text-dark-50 hover:bg-dark-700",
  danger: "bg-red-600 text-white hover:bg-red-500",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  default: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({ className, variant = "default", size = "default", children, ...props }: ButtonProps) {
  return (
    <button
      className={cn("inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-golden-500/50 disabled:opacity-50 disabled:pointer-events-none", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
