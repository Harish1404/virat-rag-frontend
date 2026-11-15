"use client";

import { Asterisk, MessageSquare, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConversations } from "../hooks/conversations-context";
import { ThemeToggle } from "./theme-toggle";

type ChatSidebarProps = {
  // Called after the user picks something, so the mobile drawer can close itself.
  onNavigate?: () => void;
};

// New chat button, the Recents list, and the theme switch.
export function ChatSidebar({ onNavigate }: ChatSidebarProps) {
  const { conversations, activeConversation, selectConversation, startNewChat, deleteConversation } =
    useConversations();

  function handleNewChat() {
    startNewChat();
    onNavigate?.();
  }

  function handleSelect(id: string) {
    selectConversation(id);
    onNavigate?.();
  }

  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Asterisk className="size-5 text-primary" strokeWidth={2.5} />
        <span className="font-heading text-lg">Kohli RAG</span>
      </div>

      <div className="px-2 py-2">
        <Button variant="ghost" onClick={handleNewChat} className="w-full justify-start gap-2 px-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Plus className="size-3.5" />
          </span>
          New chat
        </Button>
      </div>

      <p className="px-4 pt-3 pb-1 text-xs font-medium text-muted-foreground">Recents</p>

      <nav className="flex-1 overflow-y-auto px-2" aria-label="Recent conversations">
        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No chats yet"
            description="Your conversations appear here until you refresh."
          />
        ) : (
          <ul className="flex flex-col gap-0.5">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversation?.id;
              return (
                <li key={conversation.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => handleSelect(conversation.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "w-full truncate rounded-lg py-1.5 pr-8 pl-2 text-left text-sm transition-colors hover:bg-sidebar-accent",
                      isActive && "bg-sidebar-accent font-medium",
                    )}
                  >
                    {conversation.title}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => deleteConversation(conversation.id)}
                    aria-label={`Delete chat: ${conversation.title}`}
                    className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Trash2 />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <div className="flex items-center justify-between border-t border-sidebar-border px-3 py-3">
        <span className="text-xs text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
}
