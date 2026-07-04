import { cn } from "../../lib/cn";
import type { ReactNode, HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "golden";

const variants: Record<BadgeVariant, string> = {
  default: "bg-dark-500 text-dark-50",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  golden: "bg-golden-500/10 text-golden-400 border-golden-500/20",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({ className, variant = "default", children }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
}
