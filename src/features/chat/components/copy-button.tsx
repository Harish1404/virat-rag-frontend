"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

const COPIED_RESET_MS = 2000;

export function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
    } catch (error) {
      logger.error("chat", "Copying the answer to the clipboard failed", error);
      toast.error("Could not copy. Please select the text and copy it manually.");
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
      aria-label={isCopied ? "Copied" : "Copy answer"}
      className="text-muted-foreground"
    >
      {isCopied ? <Check /> : <Copy />}
    </Button>
  );
}
