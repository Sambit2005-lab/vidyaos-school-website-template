import { cn } from "../../lib/cn";
import { Card } from "./Card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: number;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, subtext, trend, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden group hover:border-golden-500/30 transition-all duration-300", className)}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-golden-500/5 to-transparent rounded-bl-full" />
      <div className="flex items-start justify-between relative">
        <div className="space-y-2">
          <p className="text-sm text-dark-200 font-medium">{label}</p>
          <p className="text-3xl font-bold text-dark-50 tracking-tight">{value}</p>
          {subtext && <p className="text-xs text-dark-300">{subtext}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-golden-500/10 text-golden-400 group-hover:bg-golden-500/20 transition-all">
            <Icon size={22} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className={cn("mt-3 flex items-center gap-1 text-xs font-medium", trend >= 0 ? "text-emerald-400" : "text-red-400")}>
          <span>{trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>
          <span className="text-dark-300">from last month</span>
        </div>
      )}
    </Card>
  );
}
