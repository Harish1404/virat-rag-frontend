import { Asterisk } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  // "avatar" = small round badge next to answers, "inline" = plain logo icon.
  variant?: "avatar" | "inline";
  className?: string;
};

// The app's asterisk logo, used in the sidebar, the welcome screen and beside answers.
export function BrandMark({ variant = "inline", className }: BrandMarkProps) {
  if (variant === "avatar") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand",
          className,
        )}
      >
        <Asterisk className="size-4" />
      </span>
    );
  }

  return (
    <Asterisk aria-hidden="true" strokeWidth={2.5} className={cn("shrink-0 text-brand", className)} />
  );
}
