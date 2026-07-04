import { cn } from "../../lib/cn";
import type { ReactNode, HTMLAttributes } from "react";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}
interface SectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}
interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}
interface CellProps extends HTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  colSpan?: number;
}

export function Table({ className, children }: TableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-dark-500", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Thead({ className, children }: SectionProps) {
  return <thead className={cn("bg-dark-700 border-b border-dark-500", className)}>{children}</thead>;
}

export function Tbody({ className, children }: SectionProps) {
  return <tbody className={cn("divide-y divide-dark-500", className)}>{children}</tbody>;
}

export function Tr({ className, children }: RowProps) {
  return <tr className={cn("hover:bg-dark-700/50 transition-colors", className)}>{children}</tr>;
}

export function Th({ className, children }: CellProps) {
  return <th className={cn("px-4 py-3 text-left text-xs font-medium text-dark-200 uppercase tracking-wider", className)}>{children}</th>;
}

export function Td({ className, children }: CellProps) {
  return <td className={cn("px-4 py-3 text-sm text-dark-100 whitespace-nowrap", className)}>{children}</td>;
}
