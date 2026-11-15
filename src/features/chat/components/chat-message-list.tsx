"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

type ChatMessageListProps = {
  messages: ChatMessage[];
  onRetry: (assistantId: string) => void;
};

export function ChatMessageList({ messages, onRetry }: ChatMessageListProps) {
  // An empty div at the end of the list; we scroll it into view when messages change.
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
        {messages.map((message) => {
          if (message.role === "user") {
            return <UserMessage key={message.id} content={message.content} />;
          }
          return (
            <AssistantMessage
              key={message.id}
              message={message}
              onRetry={() => onRetry(message.id)}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
