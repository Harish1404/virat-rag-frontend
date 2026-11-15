import { Asterisk } from "lucide-react";
import { ErrorMessage } from "@/components/shared/error-message";
import type { AssistantMessage as AssistantMessageType } from "../types";
import { CopyButton } from "./copy-button";
import { MarkdownContent } from "./markdown-content";
import { MessageMeta } from "./message-meta";
import { MessageSources } from "./message-sources";
import { MessageStatus } from "./message-status";
import { ToolCalls } from "./tool-calls";

type AssistantMessageProps = {
  message: AssistantMessageType;
  onRetry: () => void;
};

// One answer from the assistant: left-aligned, no bubble, Markdown text,
// with the tools it used above and the sources it read below.
export function AssistantMessage({ message, onRetry }: AssistantMessageProps) {
  const isStreaming = message.status === "streaming";
  const hasText = message.content.length > 0;
  const runningTool = message.tools.findLast((toolCall) => toolCall.output === null);

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Asterisk className="size-4" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <MessageMeta route={message.route} routeReason={message.routeReason} model={message.model} />

        <ToolCalls tools={message.tools} />

        {hasText && <MarkdownContent content={message.content} />}

        {/* Show the thinking indicator until the first words arrive. */}
        {isStreaming && !hasText && (
          <MessageStatus phase={message.phase} toolName={runningTool?.tool} />
        )}

        {message.status === "error" && (
          <ErrorMessage message={message.error ?? "Something went wrong."} onRetry={onRetry} />
        )}

        <MessageSources sources={message.sources} />

        {message.status === "done" && hasText && (
          <div className="-ml-2">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  );
}
