/**
 * Module-level registry linking DOM image wrappers to WebGL planes.
 * GLImage components register their wrapper element + texture url here;
 * GLImagesLayer (the one shared canvas in the root layout) subscribes and
 * mirrors each entry with a shader plane. No React context — registration
 * must never re-render the page tree.
 */
export type GLImageEntry = {
  id: number;
  el: HTMLElement;
  src: string;
  /** Extra cover zoom (crops baked-in letterbox bars on two source files). */
  zoom: number;
  /** Called by the layer when its plane is live (hide the DOM img) or gone. */
  onActive: (active: boolean) => void;
};

let nextId = 1;
const entries = new Map<number, GLImageEntry>();
const listeners = new Set<() => void>();
// Stable snapshot for useSyncExternalStore — rebuilt only on change.
let snapshot: GLImageEntry[] = [];

function notify() {
  snapshot = [...entries.values()];
  for (const fn of listeners) fn();
}

export function registerImage(entry: Omit<GLImageEntry, "id">): number {
  const id = nextId++;
  entries.set(id, { ...entry, id });
  notify();
  return id;
}

export function unregisterImage(id: number) {
  entries.delete(id);
  notify();
}

export function subscribeImages(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getImageEntries(): GLImageEntry[] {
  return snapshot;
}

export function getEmptyEntries(): GLImageEntry[] {
  return snapshot;
}
