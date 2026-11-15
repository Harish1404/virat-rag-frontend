"use client";

import { ArrowUp, Square } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  onSend: (question: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
};

// The message box. Enter sends, Shift+Enter adds a new line.
export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  placeholder = "Reply…",
  autoFocus = false,
  className,
}: ChatInputProps) {
  const [question, setQuestion] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const isEmpty = question.trim().length === 0;

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    if (isStreaming) return;

    if (isEmpty) {
      setValidationError("Please type a question first.");
      return;
    }

    onSend(question);
    setQuestion("");
    setValidationError(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // isComposing is true while typing with an IME (e.g. Tamil or Japanese input);
    // Enter then confirms the characters instead of sending.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="rounded-3xl border bg-card p-3 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-1 focus-within:ring-ring/40">
        <Textarea
          value={question}
          onChange={(event) => {
            setQuestion(event.target.value);
            if (validationError) setValidationError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={1}
          aria-label="Your question"
          aria-invalid={validationError !== null}
          className="max-h-60 min-h-12 resize-none border-0 bg-transparent px-2 py-1.5 text-[15px] shadow-none focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent"
        />
        <div className="flex items-center justify-between gap-2 pt-1">
          <p className="px-2 text-xs text-destructive" aria-live="polite">
            {validationError}
          </p>
          {isStreaming ? (
            <Button type="button" size="icon" onClick={onStop} aria-label="Stop answering" className="rounded-xl">
              <Square className="fill-current" />
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={isEmpty} aria-label="Send question" className="rounded-xl">
              <ArrowUp />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
