import { FileSearch, MessageCircle, Wrench, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Route } from "../types";

const ROUTE_DETAILS: Record<Route, { label: string; icon: LucideIcon }> = {
  RAG: { label: "Documents", icon: FileSearch },
  TOOL: { label: "Tool", icon: Wrench },
  DIRECT: { label: "General", icon: MessageCircle },
};

type MessageMetaProps = {
  route: Route | null;
  routeReason: string | null;
  model: string | null;
};

// Shows how the backend answered: which route it picked and which model replied.
export function MessageMeta({ route, routeReason, model }: MessageMetaProps) {
  if (!route && !model) return null;

  const routeDetails = route ? ROUTE_DETAILS[route] : null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {routeDetails && (
        // The title attribute shows the router's reason as a hover tooltip.
        <Badge variant="secondary" title={routeReason ?? undefined} className="gap-1">
          <routeDetails.icon className="size-3" />
          {routeDetails.label}
        </Badge>
      )}
      {model && <span className="font-mono">{model}</span>}
    </div>
  );
}
