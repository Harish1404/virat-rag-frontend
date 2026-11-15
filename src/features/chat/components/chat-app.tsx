"use client";

import { ConversationsProvider, useConversations } from "../hooks/conversations-context";
import { useChatStream } from "../hooks/use-chat-stream";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWelcome } from "./chat-welcome";

// The page layout: sidebar on the left, the conversation on the right.
function ChatLayout() {
  const { activeConversation } = useConversations();
  const { messages, isStreaming, sendMessage, retry, stop } = useChatStream();

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border md:block">
        <ChatSidebar />
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader title={activeConversation?.title ?? ""} />

        {hasMessages ? (
          <>
            <ChatMessageList messages={messages} onRetry={retry} />
            <div className="mx-auto w-full max-w-3xl px-4 pb-4">
              <ChatInput onSend={sendMessage} onStop={stop} isStreaming={isStreaming} />
              <p className="pt-2 text-center text-xs text-muted-foreground">
                Answers can be wrong. Check the sources.
              </p>
            </div>
          </>
        ) : (
          <ChatWelcome onSend={sendMessage} onStop={stop} isStreaming={isStreaming} />
        )}
      </main>
    </div>
  );
}

export function ChatApp() {
  return (
    <ConversationsProvider>
      <ChatLayout />
    </ConversationsProvider>
  );
}
