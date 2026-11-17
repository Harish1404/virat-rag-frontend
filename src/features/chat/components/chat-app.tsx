"use client";

import { ConversationsProvider, useConversations } from "../hooks/conversations-context";
import { useChatStream } from "../hooks/use-chat-stream";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWelcome } from "./chat-welcome";

// The page layout: sidebar on the left (large screens only), the conversation on the right.
function ChatLayout() {
  const { activeConversation } = useConversations();
  const { messages, isStreaming, sendMessage, retry, stop } = useChatStream();

  const hasMessages = messages.length > 0;

  return (
    // tv: padding keeps everything inside the area TVs don't crop ("overscan").
    <div className="flex h-dvh w-full overflow-hidden bg-background tv:px-[5vw] tv:py-[5vh]">
      <aside className="hidden w-sidebar shrink-0 border-r border-sidebar-border lg:block">
        <ChatSidebar />
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader title={activeConversation?.title ?? ""} />

        {hasMessages ? (
          <>
            <ChatMessageList messages={messages} onRetry={retry} />
            {/* The gradient fades messages out as they scroll under the composer.
                env(safe-area-inset-bottom) keeps the box above the phone's gesture bar. */}
            <div className="relative px-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4">
              <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent" />
              <div className="mx-auto w-full max-w-chat">
                <ChatInput onSend={sendMessage} onStop={stop} isStreaming={isStreaming} />
                <p className="pt-2 text-center text-xs text-muted-foreground">
                  Answers can be wrong. Check the sources.
                </p>
              </div>
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
