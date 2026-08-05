import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────────
   THE LIGHT BUDGET — why the shop used to stall for twenty seconds.

   three bakes the number of lights into every shader it compiles: the point
   count is part of the program's cache key. Add one point light to a scene and
   every material in it needs a NEW program — recompiled, and on Windows
   re-translated to HLSL by ANGLE, which is the slowest step in the whole
   pipeline. Seventy materials at roughly seventy milliseconds each is the five
   seconds a Chrome trace showed sitting inside a single animation frame.

   This shop streams its bays, and half a dozen of them arrive carrying a
   droplight. So every bay that arrived recompiled the entire building.

   The fix is to make the count a CONSTANT. A pool of padding lights — zero
   intensity, zero reach, no visual contribution whatsoever — sits in the scene
   from the first frame, and every time a real station light appears, one
   padding light steps out to make room. The total the shader sees never
   changes, so nothing is ever recompiled again.

   Cost of the padding: each light in the count is a loop iteration in the
   fragment shader whether it lights anything or not. That is why the budget is
   sized to what the shop actually ends up using rather than a round number —
   it is the steady state the scene was always going to reach, just reached at
   the start instead of one stall at a time.
   ────────────────────────────────────────────────────────────────────────── */

/** Padding lights created up front. Grown, loudly, if a bay ever exceeds it. */
let budget = 0;
const pool: THREE.PointLight[] = [];
const active = new Map<string, number>();
let host: THREE.Scene | null = null;
let onGrow: ((total: number) => void) | null = null;

function sync() {
  let used = 0;
  for (const count of active.values()) used += count;
  if (used > budget) {
    // Should not happen — but a silent recompile storm is worse than a resize.
    grow(used);
  }
  const need = Math.max(0, budget - used);
  for (let i = 0; i < pool.length; i++) pool[i].visible = i < need;
}

function grow(to: number) {
  if (!host) return;
  for (let i = budget; i < to; i++) {
    const light = new THREE.PointLight(0xffffff, 0, 0.001, 2);
    light.userData.pad = true;
    light.position.set(0, -50 - i, 0);
    host.add(light);
    pool.push(light);
  }
  const first = budget === 0;
  budget = to;
  // Only shout when a bay outgrew the measured budget — the initial install is
  // not news, an unplanned resize is (it costs one recompile of the building).
  if (!first) onGrow?.(budget);
}

/**
 * Put the pad in the scene before anything is compiled.
 *
 * `size` is the number of point lights the seven bays contribute between them
 * once the whole shop has streamed in — measured, not guessed, and logged back
 * under `?perf` so it can be re-measured whenever a bay is re-dressed.
 */
export function installLightPad(scene: THREE.Scene, size: number, notify?: (total: number) => void) {
  if (host === scene) return;
  host = scene;
  onGrow = notify ?? null;
  grow(size);
}

/** A bay's lights arrived or left; the pad takes up the slack in the same frame. */
export function setStationLights(key: string, count: number) {
  if (active.get(key) === count) return;
  if (count === 0) active.delete(key);
  else active.set(key, count);
  sync();
}

/** How many point lights a freshly warmed subtree brings with it. */
export function countLights(node: THREE.Object3D) {
  let n = 0;
  node.traverse((child) => {
    if ((child as THREE.PointLight).isPointLight && !child.userData.pad) n++;
  });
  return n;
}

export function lightBudget() {
  return budget;
}

export function disposeLightPad() {
  for (const light of pool) light.removeFromParent();
  pool.length = 0;
  active.clear();
  budget = 0;
  host = null;
}
