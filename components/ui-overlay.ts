"use client";

import { useSyncExternalStore } from "react";

export type UIOverlay = "menu" | null;

let current: UIOverlay = null;
const listeners = new Set<() => void>();

export function getUIOverlay(): UIOverlay {
  return current;
}

export function subscribeUIOverlay(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setUIOverlay(next: UIOverlay) {
  if (current === next) return;
  current = next;
  if (typeof document !== "undefined") {
    if (next) document.documentElement.setAttribute("data-ui-overlay", next);
    else document.documentElement.removeAttribute("data-ui-overlay");
  }
  for (const listener of listeners) listener();
}

export function useUIOverlay() {
  return useSyncExternalStore(subscribeUIOverlay, getUIOverlay, () => null);
}
