"use client";

import { UserButton } from "@clerk/nextjs";
import { getErrorMessage } from "@/lib/errors";
import { useCurrentUser } from "../hooks/use-current-user";
import type { CurrentUser } from "../types";

function getDisplayName(user: CurrentUser): string {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return fullName || user.email || "Signed in";
}

// Shows who is signed in (from our backend's /me) plus Clerk's account button,
// which opens "Manage account" and "Sign out".
export function UserMenu() {
  const { data: user, isPending, isError, error, refetch } = useCurrentUser();

  return (
    <div className="flex min-w-0 items-center gap-3">
      {/* Clerk's avatar button. Its menu contains Sign out. */}
      <UserButton />

      <div className="min-w-0 flex-1">
        {isPending && (
          <div className="flex flex-col gap-1" aria-label="Loading your profile">
            <span className="h-3 w-24 animate-pulse rounded bg-sidebar-accent" />
            <span className="h-3 w-32 animate-pulse rounded bg-sidebar-accent" />
          </div>
        )}

        {isError && (
          <button
            type="button"
            onClick={() => refetch()}
            className="truncate text-left text-xs text-destructive hover:underline touch:min-h-touch"
            title={getErrorMessage(error)}
          >
            Couldn&apos;t load profile · Retry
          </button>
        )}

        {user && (
          <>
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {getDisplayName(user)}
            </p>
            {user.email && (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
