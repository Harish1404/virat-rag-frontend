"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { streamChat } from "../api/stream-chat";
import type { AssistantMessage, ChatMessage } from "../types";
import { applyStreamEvent } from "./apply-stream-event";
import { useConversations } from "./conversations-context";

function createAssistantMessage(question: string): AssistantMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    question,
    content: "",
    status: "streaming",
    phase: "routing",
    route: null,
    routeReason: null,
    model: null,
    tools: [],
    sources: [],
    error: null,
  };
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

// Sends questions to the backend and streams each answer into the active conversation.
// The answer arrives as many small events, so this hook (not TanStack Query's
// useMutation, which only handles one final result) updates the message piece by piece.
export function useChatStream() {
  const { activeConversation, ensureConversation, updateMessages } = useConversations();
  const [isStreaming, setIsStreaming] = useState(false);

  // An AbortController lets us cancel a running fetch when the user presses "Stop".
  // useRef keeps it between renders without causing a re-render.
  const abortControllerRef = useRef<AbortController | null>(null);

  async function runStream(conversationId: string, assistantId: string, question: string) {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsStreaming(true);

    function updateAssistant(change: (message: AssistantMessage) => AssistantMessage) {
      updateMessages(conversationId, (messages: ChatMessage[]) =>
        messages.map((message) =>
          message.id === assistantId && message.role === "assistant" ? change(message) : message,
        ),
      );
    }

    try {
      for await (const event of streamChat(question, controller.signal)) {
        updateAssistant((message) => applyStreamEvent(message, event));

        if (event.type === "error") {
          logger.error("chat", `Backend reported an error: ${event.message}`);
          toast.error(event.message);
        }
      }

      // The stream closed without "done" or "error": the connection was cut.
      updateAssistant((message) =>
        message.status === "streaming"
          ? { ...message, status: "error", error: "The answer stopped unexpectedly." }
          : message,
      );
      logger.info("chat", "Answer stream finished");
    } catch (error) {
      if (isAbortError(error)) {
        logger.info("chat", "Answer stopped by the user");
        updateAssistant((message) => ({ ...message, status: "done" }));
        return;
      }

      const friendlyMessage = getErrorMessage(error);
      logger.error("chat", "Sending the question failed", error);
      toast.error(friendlyMessage);
      updateAssistant((message) => ({ ...message, status: "error", error: friendlyMessage }));
    } finally {
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }

  async function sendMessage(question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isStreaming) return;

    const conversationId = ensureConversation(trimmedQuestion);
    const assistantMessage = createAssistantMessage(trimmedQuestion);

    updateMessages(conversationId, (messages) => [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: trimmedQuestion },
      assistantMessage,
    ]);

    await runStream(conversationId, assistantMessage.id, trimmedQuestion);
  }

  // Asks the same question again, reusing the failed answer's spot in the list.
  async function retry(assistantId: string) {
    if (!activeConversation || isStreaming) return;

    const failedMessage = activeConversation.messages.find(
      (message) => message.id === assistantId && message.role === "assistant",
    );
    if (!failedMessage || failedMessage.role !== "assistant") return;

    const freshMessage = { ...createAssistantMessage(failedMessage.question), id: assistantId };
    updateMessages(activeConversation.id, (messages) =>
      messages.map((message) => (message.id === assistantId ? freshMessage : message)),
    );

    await runStream(activeConversation.id, assistantId, failedMessage.question);
  }

  function stop() {
    abortControllerRef.current?.abort();
  }

  return {
    messages: activeConversation?.messages ?? [],
    isStreaming,
    sendMessage,
    retry,
    stop,
  };
}
