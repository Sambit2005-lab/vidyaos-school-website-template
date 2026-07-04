import { cn } from "../../lib/cn";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  className?: string;
  name: string;
  size?: AvatarSize;
}

const sizes: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ className, name, size = "md" }: AvatarProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className={cn("rounded-full bg-gradient-to-br from-golden-500 to-golden-700 flex items-center justify-center font-bold text-white", sizes[size], className)}>
      {initials}
    </div>
  );
}
