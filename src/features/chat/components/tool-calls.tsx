import { ChevronRight, Loader2, Wrench } from "lucide-react";
import type { ToolCall } from "../types";

function formatToolInput(input: unknown): string {
  if (typeof input === "string") return input;
  return JSON.stringify(input, null, 2);
}

// Lists the tools the assistant used. Each one can be expanded to see its input and output.
// <details> is a built-in HTML element that opens and closes on click, no state needed.
export function ToolCalls({ tools }: { tools: ToolCall[] }) {
  if (tools.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {tools.map((toolCall, index) => (
        <details
          key={`${toolCall.tool}-${index}`}
          className="group rounded-xl border bg-card text-sm"
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground">
            <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
            <Wrench className="size-3.5" />
            <span className="font-mono text-xs">{toolCall.tool}</span>
            {toolCall.output === null && <Loader2 className="ml-auto size-3.5 animate-spin" />}
          </summary>
          <div className="space-y-2 border-t px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground">Input</p>
            <pre className="overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs">
              {formatToolInput(toolCall.input)}
            </pre>
            {toolCall.output !== null && (
              <>
                <p className="text-xs font-medium text-muted-foreground">Output</p>
                <pre className="overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs whitespace-pre-wrap">
                  {toolCall.output}
                </pre>
              </>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
