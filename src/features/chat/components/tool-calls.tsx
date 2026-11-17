import { Loader2, Wrench } from "lucide-react";
import { Disclosure } from "@/components/shared/disclosure";
import type { ToolCall } from "../types";
import { codeBlockClass } from "./markdown-content";

function formatToolInput(input: unknown): string {
  if (typeof input === "string") return input;
  return JSON.stringify(input, null, 2);
}

// Lists the tools the assistant used. Each one can be expanded to see its input and output.
export function ToolCalls({ tools }: { tools: ToolCall[] }) {
  if (tools.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {tools.map((toolCall, index) => (
        <Disclosure
          key={`${toolCall.tool}-${index}`}
          icon={Wrench}
          label={<span className="font-mono text-xs">{toolCall.tool}</span>}
          trailing={
            toolCall.output === null ? (
              <Loader2 className="size-3.5 animate-spin" aria-label="Running" />
            ) : undefined
          }
        >
          <div className="space-y-2 px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground">Input</p>
            <pre className={codeBlockClass}>{formatToolInput(toolCall.input)}</pre>
            {toolCall.output !== null && (
              <>
                <p className="text-xs font-medium text-muted-foreground">Output</p>
                <pre className={`${codeBlockClass} whitespace-pre-wrap`}>{toolCall.output}</pre>
              </>
            )}
          </div>
        </Disclosure>
      ))}
    </div>
  );
}
