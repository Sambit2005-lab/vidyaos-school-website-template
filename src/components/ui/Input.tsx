import { cn } from "../../lib/cn";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn("w-full rounded-lg border border-dark-400 bg-dark-700 px-4 py-2 text-sm text-dark-50 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-golden-500/50 focus:border-golden-500 transition-all duration-200", className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
