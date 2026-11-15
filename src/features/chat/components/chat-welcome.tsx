import { Asterisk, CloudSun, IndianRupee, Trophy, type LucideIcon } from "lucide-react";
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
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-[12vh]">
      <div className="flex w-full max-w-2xl flex-col items-center gap-8">
        <h1 className="flex items-center gap-3 text-center font-heading text-3xl text-foreground sm:text-4xl">
          <Asterisk className="size-9 shrink-0 text-primary" strokeWidth={2.5} />
          How can I help you today?
        </h1>

        <ChatInput
          onSend={onSend}
          onStop={onStop}
          isStreaming={isStreaming}
          placeholder="Ask about Virat Kohli, the weather, or anything else…"
          autoFocus
        />

        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => onSend(suggestion.question)}
              disabled={isStreaming}
              className="flex items-center gap-2 rounded-xl border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
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
