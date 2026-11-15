import type { AssistantMessage, StreamEvent } from "../types";

// Returns a new assistant message with one stream event applied.
// Kept as a plain function (no React) so it is easy to read and test.
export function applyStreamEvent(
  message: AssistantMessage,
  event: StreamEvent,
): AssistantMessage {
  switch (event.type) {
    case "route":
      return { ...message, route: event.route, routeReason: event.reason, phase: "thinking" };

    case "retrieval_start":
      return { ...message, phase: "searching" };

    case "retrieval_end":
      return { ...message, phase: "thinking" };

    case "tool_start":
      return {
        ...message,
        phase: "using-tool",
        tools: [...message.tools, { tool: event.tool, input: event.input, output: null }],
      };

    case "tool_end": {
      // Fill in the output of the most recent unfinished call to this tool.
      const tools = [...message.tools];
      for (let index = tools.length - 1; index >= 0; index--) {
        if (tools[index].tool === event.tool && tools[index].output === null) {
          tools[index] = { ...tools[index], output: event.output };
          break;
        }
      }
      return { ...message, tools, phase: "thinking" };
    }

    case "model":
      return { ...message, model: event.model };

    case "token":
      return { ...message, content: message.content + event.content, phase: "writing" };

    case "sources":
      return { ...message, sources: event.sources };

    case "done":
      return { ...message, status: "done" };

    case "error":
      return { ...message, status: "error", error: event.message };
  }
}
