// One logger for the whole app, so every log line looks the same
// and debug noise is automatically hidden in production.
const isDev = process.env.NODE_ENV === "development";

function format(scope: string, message: string): string {
  return `[${scope}] ${message}`;
}

export const logger = {
  // Detailed steps. Only visible while developing.
  debug(scope: string, message: string, data?: unknown) {
    if (isDev) console.debug(format(scope, message), data ?? "");
  },
  // Important normal events (answer received, conversation created).
  info(scope: string, message: string, data?: unknown) {
    if (isDev) console.info(format(scope, message), data ?? "");
  },
  // Something odd happened but the app still works.
  warn(scope: string, message: string, data?: unknown) {
    console.warn(format(scope, message), data ?? "");
  },
  // Something failed. Always logged.
  error(scope: string, message: string, error?: unknown) {
    console.error(format(scope, message), error ?? "");
  },
};
