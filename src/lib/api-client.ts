import { getAuthToken, handleUnauthorized } from "@/lib/auth-token";
import { API_BASE_URL } from "@/lib/constants";
import { ApiError } from "@/lib/errors";
import { logger } from "@/lib/logger";

// Adds "Authorization: Bearer <token>" when the user is signed in.
// Without a token the request still goes out, and the backend answers 401.
async function withAuthHeader(options?: RequestInit): Promise<RequestInit> {
  const token = await getAuthToken();
  if (!token) return options ?? {};

  const headers = new Headers(options?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return { ...options, headers };
}

// FastAPI sends errors as { "detail": "..." }. This reads that message safely.
function readErrorDetail(body: unknown): string | null {
  if (typeof body === "object" && body !== null && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
  }
  return null;
}

// Sends the request and turns every failure into an ApiError.
// Both apiClient and apiStream use this, so error handling lives in one place.
async function sendRequest(path: string, options?: RequestInit): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;
  const method = options?.method ?? "GET";

  logger.debug("api", `${method} ${path}`);

  let response: Response;

  // 1. Network failure (server down, no internet)
  try {
    response = await fetch(url, await withAuthHeader(options));
  } catch (error) {
    // An abort is the user pressing "Stop", not a network problem.
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    logger.error("api", `Network error on ${method} ${path}`, error);
    throw new ApiError("Network error", 0, error);
  }

  // 2. Server answered with an error status (4xx / 5xx)
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message = readErrorDetail(body) ?? `Request failed with status ${response.status}`;
    logger.error("api", `${method} ${path} failed (${response.status})`, body);

    // 401 = the session is missing or expired. Let the auth bridge decide whether
    // to send the user back to the sign-in page.
    if (response.status === 401) await handleUnauthorized();

    throw new ApiError(message, response.status, body);
  }

  return response;
}

// For normal JSON endpoints.
export async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await sendRequest(path, options);
  return (await response.json()) as T;
}

// For streaming endpoints: returns the raw body so the caller can read it piece by piece.
export async function apiStream(
  path: string,
  options?: RequestInit,
): Promise<ReadableStream<Uint8Array>> {
  const response = await sendRequest(path, options);

  if (!response.body) {
    throw new ApiError("The server sent an empty response.", response.status);
  }

  return response.body;
}
