"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns true when the device has a fine pointer (mouse / trackpad).
 * Returns false on touch-only screens (phones, tablets, TVs).
 *
 * Used to skip autoFocus on the welcome input so the on-screen keyboard
 * doesn't pop up immediately on touch devices (R13).
 *
 * Uses useSyncExternalStore so the value is read synchronously from the
 * browser's matchMedia API without a cascading setState in useEffect.
 */

// The media query never changes during the page's lifetime, so subscribe is a no-op.
function subscribe(_onStoreChange: () => void): () => void {
  return () => {};
}

function getSnapshot(): boolean {
  return window.matchMedia("(hover: hover)").matches;
}

// Server render: assume hover is available (desktop). The client corrects
// this if needed on hydration.
function getServerSnapshot(): boolean {
  return true;
}

export function useHasHover(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
