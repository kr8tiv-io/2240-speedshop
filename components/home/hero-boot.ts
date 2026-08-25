"use client";

import { useSyncExternalStore } from "react";

export type HeroBootSnapshot = Readonly<{
  progress: number;
  sceneReady: boolean;
  failed: boolean;
}>;

const INITIAL_SNAPSHOT: HeroBootSnapshot = Object.freeze({
  progress: 0,
  sceneReady: false,
  failed: false,
});

let snapshot = INITIAL_SNAPSHOT;
let resetGeneration = 0;
const listeners = new Set<() => void>();

export function getHeroBootSnapshot() {
  return snapshot;
}

export function subscribeHeroBoot(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Test/tuning provenance: changes only when a new runtime boot is declared. */
export function getHeroBootGeneration() {
  return resetGeneration;
}

function emit() {
  for (const listener of listeners) listener();
}

/** Reset before a newly selected renderer profile is allowed to mount. */
export function resetHeroBoot() {
  resetGeneration += 1;
  if (snapshot === INITIAL_SNAPSHOT) return;
  snapshot = INITIAL_SNAPSHOT;
  emit();
}

/**
 * Loading progress, readiness, and failure are monotonic for one runtime.
 * A media-profile change explicitly resets the store before mounting another.
 */
export function publishHeroBoot(update: Partial<HeroBootSnapshot>) {
  const next: HeroBootSnapshot = Object.freeze({
    progress:
      update.progress === undefined
        ? snapshot.progress
        : Math.max(snapshot.progress, Math.min(100, Math.max(0, update.progress))),
    sceneReady: snapshot.sceneReady || update.sceneReady === true,
    failed: snapshot.failed || update.failed === true,
  });
  if (
    next.progress === snapshot.progress &&
    next.sceneReady === snapshot.sceneReady &&
    next.failed === snapshot.failed
  ) {
    return;
  }
  snapshot = next;
  emit();
}

export function useHeroBootSnapshot() {
  return useSyncExternalStore(subscribeHeroBoot, getHeroBootSnapshot, () => INITIAL_SNAPSHOT);
}

/** Safari 13 and older expose only the legacy MediaQueryList listener API. */
export function addMediaQueryChangeListener(
  query: MediaQueryList,
  listener: (event: MediaQueryListEvent) => void,
) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }
  query.addListener(listener);
  return () => query.removeListener(listener);
}
