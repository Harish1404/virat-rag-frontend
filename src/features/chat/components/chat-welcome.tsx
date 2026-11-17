"use client";

import { CloudSun, IndianRupee, Trophy, type LucideIcon } from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { useHasHover } from "../hooks/use-has-hover";
import { ChatInput } from "./chat-input";

type Suggestion = { icon: LucideIcon; label: string; question: string };

// One example per backend route: documents (RAG), weather tool, currency tool.
const SUGGESTIONS: Suggestion[] = [
  { icon: Trophy, label: "Kohli's centuries", question: "How many international centuries has Virat Kohli scored?" },
  { icon: CloudSun, label: "Weather in Chennai", question: "What's the weather in Chennai right now?" },
  { icon: IndianRupee, label: "Convert ₹5000", question: "Convert 5000 rupees to US dollars" },
];

type ChatWelcomeProps = {
  onSend: (question: string) => void;
  onStop: () => void;
  isStreaming: boolean;
};

// The start screen of a new chat: a greeting, a centred message box and example questions.
export function ChatWelcome({ onSend, onStop, isStreaming }: ChatWelcomeProps) {
  // Only focus the box automatically on mouse devices; on phones and TVs
  // focusing it would pop up the on-screen keyboard straight away.
  const hasHover = useHasHover();

  return (
    // overflow-y-auto + my-auto on the inner block: centred when there is room,
    // scrollable from the top when there isn't (short landscape phones, open keyboard).
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="mx-auto my-auto flex w-full max-w-chat flex-col items-center gap-6 sm:gap-8">
        <h1 className="flex items-center gap-2 text-center font-heading text-2xl text-foreground sm:gap-3 sm:text-3xl lg:text-4xl">
          <BrandMark className="size-7 sm:size-9" />
          How can I help you today?
        </h1>

        <ChatInput
          onSend={onSend}
          onStop={onStop}
          isStreaming={isStreaming}
          placeholder="Ask about Virat Kohli, the weather, or anything else…"
          autoFocus={hasHover}
        />

        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => onSend(suggestion.question)}
              disabled={isStreaming}
              className="flex min-h-9 items-center gap-2 rounded-xl border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 touch:min-h-touch"
            >
              <suggestion.icon className="size-4" />
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
