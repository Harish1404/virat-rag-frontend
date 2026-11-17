import { Suspense, type ReactNode } from "react";
import { BrandMark } from "@/components/shared/brand-mark";

// Placeholder shown while Clerk's form loads. Roughly the size of the real card.
function AuthFormSkeleton() {
  return (
    <div
      aria-label="Loading sign-in form"
      className="h-96 w-full max-w-sm animate-pulse rounded-xl border border-border bg-card"
    />
  );
}

// Centered frame shared by the sign-in and sign-up pages.
// Clerk's form keeps its own width; we only centre it and add the brand above it.
export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-10 sm:py-16">
      <div className="flex items-center gap-2 text-foreground">
        <BrandMark className="size-6 tv:size-8" />
        <span className="font-heading text-xl tv:text-3xl">Kohli RAG</span>
      </div>

      {/* Clerk's forms read the current URL. With cacheComponents on, Next.js needs that
          inside <Suspense> so the rest of the page can still be prerendered. */}
      <Suspense fallback={<AuthFormSkeleton />}>{children}</Suspense>
    </main>
  );
}
