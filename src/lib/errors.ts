// A single error class for every failed backend call.
// Having one type means the UI can always read .status and .message.
export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// Turns any error into a sentence that is safe to show a user.
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return "Cannot reach the server. Check that the backend is running.";
    if (error.status === 404) return "We could not find what you asked for.";
    if (error.status >= 500) return "The server had a problem. Please try again.";
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
