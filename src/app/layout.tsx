import type { Metadata, Viewport } from "next";
import { Figtree, Geist_Mono, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const robotoSlabHeading = Roboto_Slab({ subsets: ["latin"], variable: "--font-heading" });

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Chat",
  description: "Ask questions about Virat Kohli, the weather, or anything else.",
};

export const viewport: Viewport = {
  // "cover" lets the page use the whole screen on phones with notches and gesture bars;
  // the composer then adds env(safe-area-inset-bottom) padding so nothing hides under them.
  viewportFit: "cover",
  // Colours the mobile browser's address bar. Meta tags can't read CSS variables, so these
  // repeat the --background values from styles/light.css and styles/dark.css.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1E1D" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes changes the class on <html> before React loads, so React
    // would warn that the HTML differs. suppressHydrationWarning silences that one warning.
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        geistMono.variable,
        figtree.variable,
        robotoSlabHeading.variable,
      )}
    >
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
