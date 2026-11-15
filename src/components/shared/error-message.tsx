import { CircleAlert, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
  className?: string;
};

// A friendly error box with an optional Retry button. Used anywhere a request fails.
export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm",
        className,
      )}
    >
      <CircleAlert className="size-4 shrink-0 text-destructive" />
      <p className="flex-1 text-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCw />
          Retry
        </Button>
      )}
    </div>
  );
}
