import { cn } from "../../lib/cn";
import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-dark-500 bg-dark-800 p-6 shadow-lg", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return <div className={cn("mb-4", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return <h3 className={cn("text-lg font-semibold text-dark-50", className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }: CardProps) {
  return <p className={cn("text-sm text-dark-200", className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }: CardProps) {
  return <div className={cn("", className)} {...props}>{children}</div>;
}
