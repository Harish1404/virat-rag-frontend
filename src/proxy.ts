import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Pages anyone can open. Everything else needs a signed-in user.
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// Next.js 16 calls middleware "proxy" (src/proxy.ts). It runs before each page loads.
// Signed-out visitors to a protected page are redirected to /sign-in.
// This only improves the experience: the Python backend still checks every token itself.
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on every page, but skip Next.js internals and static files (images, fonts, css...).
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
