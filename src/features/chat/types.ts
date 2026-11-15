// ---------- Backend stream events (POST /llm, Server-Sent Events) ----------

// Which path the backend chose for a question.
export type Route = "RAG" | "TOOL" | "DIRECT";

// One document chunk the RAG answer was based on.
export type Source = {
  filename: string;
  page_number: number | null;
  chunk_type: "text" | "table";
  score: number | null;
  table_id?: string;
  table_index?: number;
};

// Every event the backend can send. The "type" field tells them apart,
// so TypeScript knows which other fields exist after checking it.
export type StreamEvent =
  | { type: "route"; route: Route; reason: string }
  | { type: "retrieval_start"; query: string }
  | { type: "retrieval_end"; results: number }
  | { type: "tool_start"; tool: string; input: unknown }
  | { type: "tool_end"; tool: string; output: string }
  | { type: "model"; model: string }
  | { type: "token"; content: string }
  | { type: "sources"; sources: Source[] }
  | { type: "done" }
  | { type: "error"; message: string };

// ---------- UI state ----------

// What the assistant is busy with right now; drives the status line.
export type AnswerPhase = "routing" | "searching" | "using-tool" | "thinking" | "writing";

export type ToolCall = {
  tool: string;
  input: unknown;
  output: string | null; // null while the tool is still running
};

export type UserMessage = {
  id: string;
  role: "user";
  content: string;
};

export type AssistantMessage = {
  id: string;
  role: "assistant";
  question: string; // kept so the answer can be retried
  content: string;
  status: "streaming" | "done" | "error";
  phase: AnswerPhase;
  route: Route | null;
  routeReason: string | null;
  model: string | null;
  tools: ToolCall[];
  sources: Source[];
  error: string | null;
};

export type ChatMessage = UserMessage | AssistantMessage;

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
};
