"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { setAuthTokenGetter, setUnauthorizedHandler } from "@/lib/auth-token";
import { logger } from "@/lib/logger";

// Renders nothing. It connects Clerk's session to the rest of the app:
//   1. Gives the API client a way to get the current session token.
//   2. Decides what to do when the backend answers 401.
//   3. Clears cached server data when the user signs out or switches account,
//      so one user's data is never shown to another.
export function AuthSessionBridge() {
  const { isLoaded, userId, getToken } = useAuth();
  const { redirectToSignIn } = useClerk();
  const queryClient = useQueryClient();

  // Remembers the previous user so we can notice sign-out / account switches.
  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  // 1 + 2: register the token getter and the 401 handler with the plain API client.
  useEffect(() => {
    setAuthTokenGetter(() => getToken());

    setUnauthorizedHandler(async () => {
      try {
        // Ask Clerk for a brand-new token. If the session really ended, this returns null.
        const freshToken = await getToken({ skipCache: true });
        if (!freshToken) {
          await redirectToSignIn();
          return;
        }
        // Clerk still has a valid session, so the 401 is a backend/config problem.
        // We don't redirect here, because that could loop; the error message is shown instead.
        logger.warn("auth", "Backend rejected a token that Clerk still considers valid");
      } catch (error) {
        logger.error("auth", "Could not refresh the session", error);
        await redirectToSignIn();
      }
    });

    return () => {
      setAuthTokenGetter(null);
      setUnauthorizedHandler(null);
    };
  }, [getToken, redirectToSignIn]);

  // 3: react to sign-out, session expiry and account switching.
  useEffect(() => {
    if (!isLoaded) return;

    const previousUserId = previousUserIdRef.current;
    const currentUserId = userId ?? null;
    previousUserIdRef.current = currentUserId;

    // First load: nothing to compare yet.
    if (previousUserId === undefined || previousUserId === currentUserId) return;

    logger.info("auth", "Signed-in user changed; clearing cached data");
    queryClient.clear();

    // The session ended (signed out here or in another tab, expired, or revoked).
    if (previousUserId && !currentUserId) {
      void redirectToSignIn();
    }
  }, [isLoaded, userId, queryClient, redirectToSignIn]);

  return null;
}
