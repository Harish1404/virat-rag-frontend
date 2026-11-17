"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

// How close (in px) to the bottom still counts as "at the bottom".
const STICK_TO_BOTTOM_THRESHOLD = 80;

type ChatMessageListProps = {
  messages: ChatMessage[];
  onRetry: (assistantId: string) => void;
};

export function ChatMessageList({ messages, onRetry }: ChatMessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Remembers whether the user is reading at the bottom. A ref (not state)
  // because changing it should not re-render the list.
  const isAtBottomRef = useRef(true);
  const previousCountRef = useRef(messages.length);

  function handleScroll() {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    isAtBottomRef.current = distanceFromBottom < STICK_TO_BOTTOM_THRESHOLD;
  }

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // A new message (the user just asked something) always jumps to the bottom.
    const isNewMessage = messages.length > previousCountRef.current;
    previousCountRef.current = messages.length;

    // While an answer streams in, only follow it if the user hasn't scrolled up to read.
    if (!isNewMessage && !isAtBottomRef.current) return;

    // "auto" jumps instantly. Smooth scrolling on every streamed word causes jank on slower devices.
    container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
    isAtBottomRef.current = true;
  }, [messages]);

  return (
    <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-chat flex-col gap-6 px-3 py-6 sm:gap-8 sm:px-4 sm:py-8">
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
      </div>
    </div>
  );
}
