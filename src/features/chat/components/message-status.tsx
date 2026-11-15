import { Loader2 } from "lucide-react";
import type { AnswerPhase } from "../types";

const PHASE_LABELS: Record<AnswerPhase, string> = {
  routing: "Understanding your question…",
  searching: "Searching documents…",
  "using-tool": "Using a tool…",
  thinking: "Thinking…",
  writing: "Writing…",
};

type MessageStatusProps = {
  phase: AnswerPhase;
  toolName?: string;
};

// The small "thinking" indicator shown before the answer text starts arriving.
export function MessageStatus({ phase, toolName }: MessageStatusProps) {
  const label = phase === "using-tool" && toolName ? `Using ${toolName}…` : PHASE_LABELS[phase];

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
      <Loader2 className="size-4 animate-spin text-primary" />
      <span className="animate-pulse">{label}</span>
    </div>
  );
}
