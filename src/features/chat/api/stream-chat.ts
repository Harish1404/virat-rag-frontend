import { apiStream } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import type { StreamEvent } from "../types";

const KNOWN_EVENT_TYPES = [
  "route",
  "retrieval_start",
  "retrieval_end",
  "tool_start",
  "tool_end",
  "model",
  "token",
  "sources",
  "done",
  "error",
];

// Turns one SSE block ("data: {...}") into an event, or null if it is not one we understand.
function parseEventBlock(block: string): StreamEvent | null {
  const dataLines = block
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice("data:".length).trim());

  if (dataLines.length === 0) return null;

  try {
    const parsed: unknown = JSON.parse(dataLines.join("\n"));
    const type =
      typeof parsed === "object" && parsed !== null && "type" in parsed ? parsed.type : null;

    if (typeof type === "string" && KNOWN_EVENT_TYPES.includes(type)) {
      return parsed as StreamEvent;
    }
    logger.warn("chat", "Received an unknown stream event", parsed);
    return null;
  } catch (error) {
    logger.warn("chat", "Could not parse a stream event", { block, error });
    return null;
  }
}

// Sends a question and yields each event as soon as it arrives.
// "async function*" is an async generator: the caller loops over it with "for await".
export async function* streamChat(
  prompt: string,
  signal: AbortSignal,
): AsyncGenerator<StreamEvent> {
  const body = await apiStream("/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    // Network chunks do not line up with events, so collect text until
    // we see the blank line ("\n\n") that ends each SSE event.
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      const event = parseEventBlock(block);
      if (event) yield event;

      boundary = buffer.indexOf("\n\n");
    }
  }

  // Whatever is left after the stream closes may still be one last event.
  const lastEvent = parseEventBlock(buffer);
  if (lastEvent) yield lastEvent;
}
