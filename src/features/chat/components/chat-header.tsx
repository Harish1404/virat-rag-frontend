"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChatSidebar } from "./chat-sidebar";

// Top bar with the conversation title. Below the lg breakpoint (phones and
// portrait tablets) it also opens the sidebar as a slide-in drawer.
export function ChatHeader({ title }: { title: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 px-3 touch:h-14">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden touch:size-touch"
            aria-label="Open sidebar"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-drawer max-w-[85vw] gap-0 p-0">
          {/* Screen readers need a title for every dialog. */}
          <SheetTitle className="sr-only">Conversations</SheetTitle>
          <ChatSidebar onNavigate={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      {title && <h2 className="truncate text-sm font-medium text-foreground">{title}</h2>}
    </header>
  );
}
