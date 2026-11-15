"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { ErrorMessage } from "@/components/shared/error-message";
import { logger } from "@/lib/logger";

// Safety net: shown if any part of the page crashes unexpectedly.
export default function PageError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    logger.error("app", "The page crashed", error);
  }, [error]);

  return (
    <div className="flex h-dvh items-center justify-center bg-background p-4">
      <ErrorMessage
        className="max-w-md"
        message="Something went wrong on this page."
        onRetry={retry}
      />
    </div>
  );
}
