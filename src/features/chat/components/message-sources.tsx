import { BookOpen, ChevronRight, FileText, Table } from "lucide-react";
import type { Source } from "../types";

// Builds a short location label such as "page 4 · table 2".
function describeLocation(source: Source): string {
  const parts: string[] = [];
  if (source.page_number !== null) parts.push(`page ${source.page_number}`);
  if (source.chunk_type === "table" && source.table_index !== undefined) {
    parts.push(`table ${source.table_index + 1}`);
  }
  return parts.join(" · ");
}

// The vector search score is a similarity between 0 and 1; show it as a percentage.
function formatScore(score: number | null): string | null {
  if (score === null) return null;
  return `${Math.round(score * 100)}% match`;
}

// The documents an answer was based on. Collapsed by default so the answer stays in focus.
export function MessageSources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <details className="group w-fit max-w-full rounded-xl border bg-card text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground">
        <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
        <BookOpen className="size-3.5" />
        {sources.length} {sources.length === 1 ? "source" : "sources"}
      </summary>
      <ul className="flex flex-col gap-1 border-t p-2">
        {sources.map((source, index) => {
          const SourceIcon = source.chunk_type === "table" ? Table : FileText;
          const location = describeLocation(source);
          const score = formatScore(source.score);

          return (
            <li
              key={`${source.filename}-${source.page_number}-${source.table_id ?? index}`}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
            >
              <SourceIcon className="size-4 shrink-0 text-primary" />
              <span className="truncate font-medium">{source.filename}</span>
              {location && <span className="shrink-0 text-muted-foreground">{location}</span>}
              {score && (
                <span className="ml-auto shrink-0 pl-3 text-xs text-muted-foreground">
                  {score}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
