// One question from the user, shown on the right in a soft bubble.
export function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-bubble rounded-2xl bg-bubble-user px-4 py-2.5 text-message whitespace-pre-wrap break-words text-bubble-user-foreground">
        {content}
      </div>
    </div>
  );
}
