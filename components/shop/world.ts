import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────────
   THE SHOP — shared geometry of the building, the camera rail and the Cold
   Start timing. Pure maths and constants: no JSX, no DOM, no fetch, so both
   `ShopWorld` and every station dressing module can import it without a cycle.
   ────────────────────────────────────────────────────────────────────────── */

/* ── Palette ────────────────────────────────────────────────────────────── */

export const TUNGSTEN = "#ffb066";
export const NEON_BLOOM = "#e04545";
export const BAY_BLACK = "#0b0b0d";
/* Haze, not sludge. The building is 68 deep and the camera lives inside it, so
   fog is doing heavy lifting on every frame — too dark and too near, and the far
   half of the shop turns to mud instead of distance. */
export const FOG_GREY = "#191c25";
export const ARC_BLUE = "#cfe4ff";
export const STREET = "#7d9ccc";

/* ── Building envelope ──────────────────────────────────────────────────── */

export const HALF_W = 9;
export const CEIL = 7.2;
export const FRONT_Z = 10;
export const DOOR_Z = -58;
export const LENGTH = FRONT_Z - DOOR_Z;
export const MID_Z = (FRONT_Z + DOOR_Z) / 2;
export const DOOR_HALF = 5.5;
export const DOOR_H = 5;

/* ── The rail ───────────────────────────────────────────────────────────────
   Seven stations, two CatmullRom curves (eye and target). `getPoint` is used
   rather than `getPointAt` precisely because it is NOT arc-length
   parameterised: knot i lands exactly on t = i / 6, so a station is a real
   address on the curve and the per-segment easing can hold there. */

export type Station = {
  /** Where the camera stands. */
  cam: [number, number, number];
  /** What it is looking at. */
  look: [number, number, number];
  /** Slow creep toward the target while holding — used where the shot pushes in. */
  dolly: number;
};

export const STATIONS: Station[] = [
  // 0 — DOORWAY / COLD START. Wide, high, straight down the length of the shop.
  { cam: [0.9, 2.65, 7.4], look: [-0.4, 2.15, -12.0], dolly: 0 },
  // 1 — THE HOIST. Swung ~43° off axis and dropped to knee height.
  { cam: [2.2, 1.12, -1.6], look: [-3.2, 1.95, -7.2], dolly: 0 },
  // 2 — THE ENGINE ROOM. Bumper height, sliding past the stand.
  { cam: [-1.3, 0.86, -12.8], look: [3.9, 1.05, -18.4], dolly: 0 },
  // 3 — THE FAB CORNER. Standing height, arc flash on arrival.
  { cam: [1.9, 1.95, -23.0], look: [-5.6, 1.55, -27.8], dolly: 0 },
  // 4 — THE TUNING BAY. Looking down into the rollers.
  { cam: [-2.5, 2.5, -32.2], look: [2.2, 1.35, -37.9], dolly: 0 },
  // 5 — THE OFFICE WALL. Slow push into the gallery.
  { cam: [-1.4, 2.15, -38.2], look: [-8.6, 2.9, -43.4], dolly: 1.5 },
  // 6 — THE ROLL-UP DOOR. Far enough back that the opening reads as a door,
  // with the night framed inside it rather than filling the lens.
  { cam: [0.6, 2.4, -45.8], look: [0.1, 2.62, -58.5], dolly: 0.9 },
];

export const SEGMENTS = STATIONS.length - 1;

export const CAM_CURVE = new THREE.CatmullRomCurve3(
  STATIONS.map((s) => new THREE.Vector3(...s.cam)),
  false,
  "centripetal",
  0.5,
);

export const LOOK_CURVE = new THREE.CatmullRomCurve3(
  STATIONS.map((s) => new THREE.Vector3(...s.look)),
  false,
  "centripetal",
  0.5,
);

/** Smootherstep — zero first AND second derivative at both ends. */
export const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/**
 * Sections should read as ARRIVALS. Raw scroll is eased per segment instead of
 * swept linearly, so the camera accelerates out of one station, covers the
 * ground between fast, and settles into the next.
 */
export function stationEase(progress: number) {
  const scaled = THREE.MathUtils.clamp(progress, 0, 1) * SEGMENTS;
  const index = Math.min(Math.floor(scaled), SEGMENTS - 1);
  return (index + smootherstep(scaled - index)) / SEGMENTS;
}

/** How present station `index` is at curve position `t` — 1 on the knot, 0 away. */
export function influence(t: number, index: number) {
  const distance = Math.abs(t * SEGMENTS - index);
  const w = THREE.MathUtils.clamp(1 - distance * 2.3, 0, 1);
  return w * w * (3 - 2 * w);
}

/* Where the camera sits on the rail, parked on the camera itself. Set by the
   rig each frame, read by the props that react to arrivals — no context, no
   re-render, and no shared mutable module state. */
export type Rail = { t: number };

export function railOf(camera: THREE.Camera): Rail {
  const data = camera.userData as { rail?: Rail };
  if (!data.rail) data.rail = { t: 0 };
  return data.rail;
}

/** Station index the camera is currently nearest, as a float. */
export function stationAt(camera: THREE.Camera) {
  return railOf(camera).t * SEGMENTS;
}

/* ── Cold Start (concept §3.1 — the breaker thunk) ──────────────────────── */

export const INTRO = 2.2;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const introAt = (elapsed: number) =>
  easeOutCubic(THREE.MathUtils.clamp(elapsed / INTRO, 0, 1));

/* Flicker is punctuation: two stutters on strike, then hold. Stepped, not
   interpolated — real neon does not crossfade. */
const FLICKER_KEYS: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [2.16, 1],
  [2.29, 0.08],
  [2.41, 1],
  [2.54, 0.32],
  [2.66, 1],
];

export function flickerAt(elapsed: number) {
  if (elapsed >= 2.66) return 1;
  for (let i = FLICKER_KEYS.length - 1; i >= 0; i--) {
    if (elapsed >= FLICKER_KEYS[i][0]) return FLICKER_KEYS[i][1];
  }
  return 0;
}

/* ── Instancing helper ──────────────────────────────────────────────────── */

export type InstanceSpec = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

export function buildInstances(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  specs: InstanceSpec[],
) {
  const mesh = new THREE.InstancedMesh(geometry, material, specs.length);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();

  specs.forEach((spec, i) => {
    const [rx, ry, rz] = spec.rotation ?? [0, 0, 0];
    euler.set(rx, ry, rz);
    quaternion.setFromEuler(euler);
    position.set(...spec.position);
    const [sx, sy, sz] = spec.scale ?? [1, 1, 1];
    scale.set(sx, sy, sz);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(i, matrix);
  });

  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
}

export function disposeInstanced(mesh: THREE.InstancedMesh) {
  mesh.geometry.dispose();
  (mesh.material as THREE.Material).dispose();
  mesh.dispose();
}

/* ── Shop material presets ──────────────────────────────────────────────────
   Every primitive-built machine in the shop draws from this small set so the
   hand-built hardware and the downloaded PBR props read as one room rather
   than two art packs. Spread onto `<meshStandardMaterial {...STEEL} />`. */

export const STEEL = { color: "#6b707a", roughness: 0.36, metalness: 0.7 } as const;
export const DARK_STEEL = { color: "#3c3f47", roughness: 0.52, metalness: 0.58 } as const;
/* Polished, but NOT mirror-white: at 0.11 roughness a header pipe under a bay
   light clips to pure white and the tube shape disappears into a flare. The
   same failure came back when the environment was brightened — a chrome tube
   mirrors the overhead Lightformer bar along its whole length, so it blew out
   into a solid glowing rod AND drove the floor reflection white underneath it.
   0.34/0.82 keeps enough diffuse to hold the round of the pipe. */
export const CHROME = { color: "#a7acb5", roughness: 0.34, metalness: 0.82 } as const;
export const ALLOY = { color: "#83888f", roughness: 0.34, metalness: 0.7 } as const;
export const CAST_IRON = { color: "#3a3c41", roughness: 0.79, metalness: 0.42 } as const;
export const RUBBER = { color: "#141519", roughness: 0.95, metalness: 0.02 } as const;
export const LIFT_RED = { color: "#75281f", roughness: 0.46, metalness: 0.32 } as const;
export const TOOL_RED = { color: "#8a2f24", roughness: 0.42, metalness: 0.3 } as const;
export const SAFETY = { color: "#a8781f", roughness: 0.6, metalness: 0.2 } as const;
export const GRIME = { color: "#26282e", roughness: 0.88, metalness: 0.12 } as const;
export const ENGINE_ORANGE = {
  color: "#a8481a",
  roughness: 0.44,
  metalness: 0.28,
} as const;
