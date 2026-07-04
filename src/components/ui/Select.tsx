import { cn } from "../../lib/cn";
import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn("w-full appearance-none rounded-lg border border-dark-400 bg-dark-700 px-4 py-2 pr-10 text-sm text-dark-50 focus:outline-none focus:ring-2 focus:ring-golden-500/50 focus:border-golden-500 transition-all duration-200", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 pointer-events-none" />
    </div>
  );
}
