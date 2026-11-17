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
      <div className="rounded-composer border border-composer-border bg-composer p-2 shadow-soft transition-shadow focus-within:shadow-raised focus-within:ring-1 focus-within:ring-ring sm:p-3">
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
          enterKeyHint="send"
          aria-label="Your question"
          aria-invalid={validationError !== null}
          // text-base (16px) on phones stops iOS Safari from zooming in when the box is focused.
          // max-h uses dvh so a long question never hides the whole screen behind the keyboard.
          className="max-h-[40dvh] min-h-12 resize-none border-0 bg-transparent px-2 py-1.5 text-base shadow-none focus-visible:ring-0 aria-invalid:ring-0 md:text-message dark:bg-transparent"
        />
        <div className="flex items-center justify-between gap-2 pt-1">
          <p className="px-2 text-xs text-destructive" aria-live="polite">
            {validationError}
          </p>
          {isStreaming ? (
            <Button
              type="button"
              size="icon"
              onClick={onStop}
              aria-label="Stop answering"
              className="rounded-xl touch:size-touch"
            >
              <Square className="fill-current" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={isEmpty}
              aria-label="Send question"
              className="rounded-xl touch:size-touch"
            >
              <ArrowUp />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
