// One question from the user, shown on the right in a soft bubble.
export function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl bg-secondary px-4 py-2.5 text-[15px] leading-7 whitespace-pre-wrap break-words text-secondary-foreground">
        {content}
      </div>
    </div>
  );
}
