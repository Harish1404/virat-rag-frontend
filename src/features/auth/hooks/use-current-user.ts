"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/get-me";

export const currentUserQueryKey = ["auth", "me"] as const;

// Loads the signed-in user's profile from the backend.
// It only runs once Clerk knows the user is signed in, so we never send a request without a token.
export function useCurrentUser() {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getMe,
    enabled: isLoaded && isSignedIn === true,
    staleTime: 5 * 60 * 1000,
    // A 401/403 will not fix itself by retrying.
    retry: false,
  });
}
