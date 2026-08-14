/* ─────────────────────────────────────────────────────────────────────────────
   THE BOOT CHANNEL — what the plate at the door is allowed to know.

   The preloader is a two-kilobyte piece of the page bundle and must stay that
   way: it cannot import three, drei, or anything that drags the 3D chunk into
   first paint. So the world writes its boot state HERE — a plain module with
   no dependencies — and the plate reads it.

   Three signals, in the order they happen:

     progress   0 → 1 across the opening download (the shell's textures and the
                first two bays), reported by the loading manager.
     warm       each compiled batch — the shell, station 0, station 1. Shader
                linking is the single most expensive thing that happens on this
                page, and it happens BEHIND the plate on purpose.
     ready      every one of the above is done: the door can roll up.

   Nothing past station 1 is on this path. The rest of the shop streams in
   behind the reader while the cold start plays, one bay at a time.
   ────────────────────────────────────────────────────────────────────────── */

export type BootState = {
  /** 0 → 1, what the meter shows. */
  progress: number;
  /** The shell's programs are linked: the renderer may start drawing frames. */
  warm: boolean;
  /** The opening bays are downloaded, compiled and on screen. */
  ready: boolean;
  /** A world was never started (no WebGL, reduced motion, weak machine). */
  skipped: boolean;
};

const state: BootState = { progress: 0, warm: false, ready: false, skipped: false };
const listeners = new Set<(s: BootState) => void>();

function emit() {
  for (const listener of listeners) listener(state);
}

export function subscribeBoot(listener: (s: BootState) => void) {
  listeners.add(listener);
  listener(state);
  return () => {
    listeners.delete(listener);
  };
}

export function getBoot(): BootState {
  return state;
}

/** Monotonic: the meter never walks backwards, however the batches register. */
export function reportBootProgress(value: number) {
  const next = Math.max(state.progress, Math.min(1, value));
  if (next === state.progress) return;
  state.progress = next;
  emit();
}

/**
 * The building's own programs are linked.
 *
 * Until this fires the renderer is parked (`frameloop="never"`): the very first
 * frame a WebGL scene draws is the frame that compiles it, and on this scene
 * that frame measured FIVE SECONDS. So no frame is drawn until the compiling is
 * already done, off the animation loop, behind the plate at the door.
 */
export function markShellWarm() {
  if (state.warm) return;
  state.warm = true;
  emit();
}

export function markWorldReady() {
  if (state.ready) return;
  state.ready = true;
  state.progress = 1;
  emit();
}

/* ── Is the reader moving? ──────────────────────────────────────────────────
   Lives here, in the module with no dependencies, because BOTH sides need it:
   the scroll layer (which knows about wheels and fingers, and must not import
   three) writes it, and the world's streaming queue reads it to decide whether
   now is a decent moment to compile a shader. Before the canvas is even
   running, the scroll layer is the only one who knows. */

let movedAt = 0;

export function noteMotion(moving: boolean) {
  if (moving) movedAt = performance.now();
}

export function stillFor() {
  return performance.now() - movedAt;
}

/** No world on this machine — the plate should lift immediately. */
export function markWorldSkipped() {
  if (state.skipped) return;
  state.skipped = true;
  emit();
}
