import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

// Shown when a list has nothing in it yet.
export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-4 py-8 text-center", className)}>
      <Icon className="size-5 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}
