import { BookOpen, FileText, Table } from "lucide-react";
import { Disclosure } from "@/components/shared/disclosure";
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

  const label = `${sources.length} ${sources.length === 1 ? "source" : "sources"}`;

  return (
    <Disclosure icon={BookOpen} label={label} className="w-full sm:w-fit sm:max-w-full">
      <ul className="flex flex-col gap-1 p-2">
        {sources.map((source, index) => {
          const SourceIcon = source.chunk_type === "table" ? Table : FileText;
          const location = describeLocation(source);
          const score = formatScore(source.score);

          return (
            <li
              key={`${source.filename}-${source.page_number}-${source.table_id ?? index}`}
              // On narrow screens the details wrap under the file name instead of overflowing.
              className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg px-2 py-1.5 hover:bg-muted"
            >
              <SourceIcon className="size-4 shrink-0 text-brand" />
              <span className="min-w-0 flex-1 truncate font-medium">{source.filename}</span>
              {location && <span className="text-muted-foreground">{location}</span>}
              {score && <span className="text-xs text-muted-foreground sm:ml-auto sm:pl-3">{score}</span>}
            </li>
          );
        })}
      </ul>
    </Disclosure>
  );
}
