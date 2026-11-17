import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DisclosureProps = {
  icon: LucideIcon;
  label: ReactNode;
  // Optional extra content at the right end of the header (e.g. a spinner).
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
};

// A collapsible box, closed by default. Used for tool calls and sources.
// <details> is a built-in HTML element that opens and closes on click or Enter,
// so it works with a keyboard and a TV remote without any React state.
export function Disclosure({ icon: Icon, label, trailing, children, className }: DisclosureProps) {
  return (
    <details className={cn("chat-disclosure group rounded-xl border bg-disclosure text-sm", className)}>
      <summary className="flex min-h-9 cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-muted-foreground transition-colors hover:text-foreground touch:min-h-touch">
        <ChevronRight className="size-4 shrink-0 transition-transform group-open:rotate-90" />
        <Icon className="size-3.5 shrink-0" />
        <span className="min-w-0 truncate">{label}</span>
        {trailing && <span className="ml-auto shrink-0">{trailing}</span>}
      </summary>
      <div className="border-t">{children}</div>
    </details>
  );
}
