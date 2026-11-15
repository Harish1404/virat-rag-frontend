"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ChatMessage, Conversation } from "../types";

// Conversations live only in memory: they are kept while the tab is open
// and cleared on refresh (the backend does not store chat history).

type ConversationsContextValue = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  selectConversation: (id: string) => void;
  startNewChat: () => void;
  deleteConversation: (id: string) => void;
  // Creates a conversation when none is open, and returns the id to write into.
  ensureConversation: (firstQuestion: string) => string;
  // Changes the messages of one conversation using an updater function.
  updateMessages: (
    conversationId: string,
    update: (messages: ChatMessage[]) => ChatMessage[],
  ) => void;
};

const ConversationsContext = createContext<ConversationsContextValue | null>(null);

const TITLE_MAX_LENGTH = 48;

function makeTitle(question: string): string {
  const singleLine = question.replace(/\s+/g, " ").trim();
  if (singleLine.length <= TITLE_MAX_LENGTH) return singleLine;
  return `${singleLine.slice(0, TITLE_MAX_LENGTH)}…`;
}

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? null;

  function ensureConversation(firstQuestion: string): string {
    if (activeConversation) return activeConversation.id;

    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: makeTitle(firstQuestion),
      messages: [],
    };
    // The newest conversation goes to the top of Recents.
    setConversations((previous) => [newConversation, ...previous]);
    setActiveId(newConversation.id);
    return newConversation.id;
  }

  function updateMessages(
    conversationId: string,
    update: (messages: ChatMessage[]) => ChatMessage[],
  ) {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, messages: update(conversation.messages) }
          : conversation,
      ),
    );
  }

  function deleteConversation(id: string) {
    setConversations((previous) => previous.filter((conversation) => conversation.id !== id));
    if (id === activeId) setActiveId(null);
  }

  const value: ConversationsContextValue = {
    conversations,
    activeConversation,
    selectConversation: setActiveId,
    startNewChat: () => setActiveId(null),
    deleteConversation,
    ensureConversation,
    updateMessages,
  };

  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}

export function useConversations(): ConversationsContextValue {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error("useConversations must be used inside <ConversationsProvider>");
  }
  return context;
}
