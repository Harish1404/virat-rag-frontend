"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthSessionBridge } from "@/features/auth/components/auth-session-bridge";

export function Providers({ children }: { children: ReactNode }) {
  // useState makes sure the QueryClient is created once per browser tab,
  // not again on every render.
  const [queryClient] = useState(() => new QueryClient());

  return (
    // ThemeProvider adds the "dark" class to <html>, which switches the colour tokens in globals.css.
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {/* Placed before the page so the token getter is registered before any request. */}
        <AuthSessionBridge />
        {children}
        <Toaster position="top-center" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
