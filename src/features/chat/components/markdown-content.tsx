import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Tailwind classes for each Markdown element, so answers look tidy
// without a separate stylesheet. remark-gfm adds tables, task lists and strikethrough.
const markdownComponents: Components = {
  p: ({ children }) => <p className="my-3 leading-7 first:mt-0 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="mt-6 mb-3 text-xl font-semibold">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-5 mb-2 text-lg font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-4 mb-2 text-base font-semibold">{children}</h3>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-6">{children}</ol>,
  li: ({ children }) => <li className="leading-7 marker:text-muted-foreground">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 hover:opacity-80"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-border pl-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-border" />,
  // Inline code. Code inside a <pre> block gets its look reset by the pre styles below.
  code: ({ children }) => (
    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.875em]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-xl border bg-muted/60 p-4 text-sm leading-6 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-xl border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b bg-muted/60 px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-b px-3 py-2 align-top">{children}</td>,
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="text-[15px] break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
