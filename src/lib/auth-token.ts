// A tiny bridge between Clerk (which lives in React) and the API client (plain functions).
//
// api-client.ts cannot call React hooks, so AuthSessionBridge registers Clerk's
// getToken function here once, and the API client asks this module for a token.
// The token is never stored: Clerk returns a fresh (auto-refreshed) one every time.

type TokenGetter = () => Promise<string | null>;
type UnauthorizedHandler = () => Promise<void>;

let tokenGetter: TokenGetter | null = null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setAuthTokenGetter(getter: TokenGetter | null) {
  tokenGetter = getter;
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

// Returns the current session token, or null when signed out.
export async function getAuthToken(): Promise<string | null> {
  if (!tokenGetter) return null;
  return tokenGetter();
}

// Called by the API client when the backend answers 401 Unauthorized.
export async function handleUnauthorized(): Promise<void> {
  if (unauthorizedHandler) await unauthorizedHandler();
}
