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

/* ── The rail: ORBIT AND REVEAL ─────────────────────────────────────────────
   The signature move. The camera does not stand at a station — it CIRCLES the
   station's subject. Scroll sweeps an arc around the turntable showpiece,
   glides to the raised Challenger and sweeps around that, then the blown V8,
   the primer shell, the car on the rollers, a motor outside the office, and
   finally the finished car at the open door with the night behind it. Each
   section's copy rises as its orbit comes around.

   Every arc is a LIMITED arc, not a circle: the shop is dense on purpose, and
   each sweep is plotted on the clear side of its subject — angles chosen
   against the actual positions of the lifts, benches, carts and parked cars
   so the lens never clips a fender. Travels between arcs are cubic Béziers
   whose control points extend along the orbit tangents, so a glide leaves one
   circle the way it was already moving and lands on the next the same way. */

export type Orbit = {
  /** Subject centre on the floor. */
  cx: number;
  cz: number;
  /** Arc radius — clears the subject AND everything parked around it. */
  r: number;
  /** Eye height at the arc's ends; mid-orbit adds a gentle crane rise. */
  h: number;
  /** Height on the subject the lens holds — bonnet line, valve covers. */
  lookY: number;
  /** Sweep, radians. a0 → a1; sign of (a1 - a0) is the direction. */
  a0: number;
  a1: number;
};

const D = Math.PI / 180;

export const ORBITS: Orbit[] = [
  // 0 — THE TURNTABLE. The entry beat Matt called for: the finished Charger
  // revolving one way, the camera sweeping 150° around it the other, menus
  // rising as it comes around. Arc stays east of the copper camaro and north
  // of the hoist bay.
  { cx: -1.1, cz: -2.75, r: 4.3, h: 2.05, lookY: 0.95, a0: -55 * D, a1: 95 * D },
  // 1 — THE HOIST. 140° around the Challenger up on the posts, knee-to-chest
  // height looking up at the pans. East-to-south sweep — the turntable circle
  // owns the north and the drums own the west wall.
  { cx: -3.2, cz: -7.0, r: 4.4, h: 1.55, lookY: 1.85, a0: 75 * D, a1: 215 * D },
  // 2 — THE BLOWN V8. Tight 110° around the headers side of the stand. The
  // roll cab parks off the north-east of it, so the arc takes the west face.
  { cx: 3.3, cz: -17.1, r: 3.2, h: 1.5, lookY: 1.35, a0: -125 * D, a1: -15 * D },
  // 3 — THE PRIMER SHELL. 145° around the body on stands, bench side to open
  // floor. The rusted donor lives off the south-west corner — arc stops short.
  { cx: -4.3, cz: -30.4, r: 3.6, h: 1.75, lookY: 1.15, a0: -30 * D, a1: 115 * D },
  // 4 — THE DYNO. North-to-south down the WEST side of the rollers — the gold
  // convertible and the storage row block the east, and going west keeps the
  // gauge wall and the tuning neon in frame behind the car the whole sweep.
  { cx: 0.9, cz: -37.4, r: 3.8, h: 2.0, lookY: 1.05, a0: 0 * D, a1: -180 * D },
  // 5 — THE PULLED MOTOR. A close 160° around the engine stand outside the
  // office, gallery wall and corkboard swinging through the background.
  { cx: -5.3, cz: -41.7, r: 2.9, h: 1.65, lookY: 1.25, a0: -20 * D, a1: 140 * D },
  // 6 — THE COLLECTED CAR. The finale: 160° around the green Challenger nosed
  // at the open door, ending on the north side looking south — the car, the
  // doorway, the rain and the skyline stacked in one closing frame.
  { cx: -3.4, cz: -53.2, r: 4.1, h: 1.85, lookY: 1.0, a0: -130 * D, a1: 30 * D },
];

export const SEGMENTS = ORBITS.length - 1;

/** Smootherstep — zero first AND second derivative at both ends. */
export const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/* Phase layout: orbits are the hero, so they get the wider share of scroll.
   The page starts on orbit 0 and ends exactly as orbit 6 completes. */
const W_ORBIT = 1.4;
const W_TRAVEL = 1.0;
const TOTAL = ORBITS.length * W_ORBIT + (ORBITS.length - 1) * W_TRAVEL;

/* Inside an orbit the station float advances i → i + ORBIT_SPAN; the travel
   carries it the rest of the way to i + 1. Reveals key off this: a section
   rises once its orbit is genuinely underway. */
export const ORBIT_SPAN = 0.35;

function orbitEye(o: Orbit, a: number, lift: number, out: THREE.Vector3) {
  return out.set(o.cx + o.r * Math.sin(a), o.h + lift, o.cz + o.r * Math.cos(a));
}

/** Unit tangent of the sweep at angle `a`, respecting sweep direction. */
function orbitTangent(o: Orbit, a: number, out: THREE.Vector3) {
  const sign = Math.sign(o.a1 - o.a0) || 1;
  return out.set(sign * Math.cos(a), 0, sign * -Math.sin(a));
}

type Travel = {
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  p2: THREE.Vector3;
  p3: THREE.Vector3;
};

/* Control points once, at module scope — pathAt runs every frame. */
const TRAVELS: Travel[] = ORBITS.slice(0, -1).map((from, i) => {
  const to = ORBITS[i + 1];
  const p0 = orbitEye(from, from.a1, 0, new THREE.Vector3());
  const p3 = orbitEye(to, to.a0, 0, new THREE.Vector3());
  const reach = p0.distanceTo(p3) * 0.35;
  const t0 = orbitTangent(from, from.a1, new THREE.Vector3());
  const t3 = orbitTangent(to, to.a0, new THREE.Vector3());
  return {
    p0,
    p1: p0.clone().addScaledVector(t0, reach),
    p2: p3.clone().addScaledVector(t3, -reach),
    p3,
  };
});

const BEZ = new THREE.Vector3();

function bezier(tr: Travel, v: number, out: THREE.Vector3) {
  const u = 1 - v;
  out.copy(tr.p0).multiplyScalar(u * u * u);
  out.addScaledVector(tr.p1, 3 * u * u * v);
  out.addScaledVector(tr.p2, 3 * u * v * v);
  out.addScaledVector(tr.p3, v * v * v);
  return out;
}

/**
 * The whole camera film, one function: scroll progress in, eye + look out,
 * station float returned. Orbits sweep with smootherstep (the camera glides
 * into a sweep, carries it, and settles), travels ease the same way, so every
 * phase joint arrives at zero velocity — a beat of stillness between moves,
 * which is what makes the sweeps read as intentional shots.
 */
export function pathAt(
  progress: number,
  eye: THREE.Vector3,
  look: THREE.Vector3,
): number {
  const scaled = THREE.MathUtils.clamp(progress, 0, 1) * TOTAL;
  const cycle = W_ORBIT + W_TRAVEL;
  const index = Math.min(Math.floor(scaled / cycle), ORBITS.length - 1);
  const local = scaled - index * cycle;
  const o = ORBITS[index];

  if (local <= W_ORBIT || index === ORBITS.length - 1) {
    // ON THE ARC.
    const u = smootherstep(THREE.MathUtils.clamp(local / W_ORBIT, 0, 1));
    const a = THREE.MathUtils.lerp(o.a0, o.a1, u);
    // The crane breathes: up a touch through the middle of the sweep.
    orbitEye(o, a, Math.sin(u * Math.PI) * 0.3, eye);
    look.set(o.cx, o.lookY, o.cz);
    return index + u * ORBIT_SPAN;
  }

  // GLIDING TO THE NEXT ONE.
  const next = ORBITS[index + 1];
  const v = smootherstep((local - W_ORBIT) / W_TRAVEL);
  bezier(TRAVELS[index], v, eye);
  // The lens hands off mid-glide: it lets one subject go and finds the next.
  look.set(
    THREE.MathUtils.lerp(o.cx, next.cx, v),
    THREE.MathUtils.lerp(o.lookY, next.lookY, v),
    THREE.MathUtils.lerp(o.cz, next.cz, v),
  );
  return index + ORBIT_SPAN + v * (1 - ORBIT_SPAN);
}

/** Where the camera opens: the top of orbit 0, before the cold-start settle. */
export const CAM_START = orbitEye(
  ORBITS[0],
  ORBITS[0].a0,
  0,
  new THREE.Vector3(),
);

/**
 * How present station `index` is at rail position `t` — with a PLATEAU: full
 * strength across the whole of the station's orbit (the dyno keeps spinning
 * and the arc keeps striking for the entire sweep), decaying through the
 * travel to the next subject.
 */
export function influence(t: number, index: number) {
  const distance = Math.abs(t * SEGMENTS - index);
  const w = THREE.MathUtils.clamp(1 - Math.max(0, distance - ORBIT_SPAN) * 2.6, 0, 1);
  return w * w * (3 - 2 * w);
}

/* Where the camera sits on the rail, parked on the camera itself. Set by the
   rig each frame, read by the props that react to arrivals — no context, no
   re-render, and no shared mutable module state. `look` is the point the
   current orbit is circling, for the focus rack. */
export type Rail = { t: number; look: THREE.Vector3 };

export function railOf(camera: THREE.Camera): Rail {
  const data = camera.userData as { rail?: Rail };
  if (!data.rail) data.rail = { t: 0, look: new THREE.Vector3() };
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

/* Scuffed, not showroom: a shop tool has been dropped on concrete. High
   metalness with a mid roughness gives a broad soft highlight that still moves
   across the surface as the camera travels. */
export const STEEL = { color: "#7b818c", roughness: 0.4, metalness: 0.82 } as const;
export const DARK_STEEL = { color: "#43474f", roughness: 0.55, metalness: 0.78 } as const;
/* REAL chrome. Roughness — not colour, not emissive — is what decides whether a
   pipe reads as chrome or as a neon tube. A wide lobe (the old 0.34) smears the
   whole overhead strip down the length of the tube, every texel clears the
   bloom threshold, and a header turns into a glowing white rod. A mirror lobe
   puts ONE hard streak on the pipe and leaves the rest of it reflecting the
   dark room, which is exactly what the eye reads as polish. Fully metallic, so
   there is no diffuse term left to wash the shape out either.

   Not a true mirror either: at 0.05 the GGX peak from a work lamp a metre away
   is thousands of times the room's exposure, so every pipe clips to white and
   we are back where we started by a different road. 0.11 keeps the streak hard
   and keeps its peak inside the frame. */
export const CHROME = { color: "#b9bec7", roughness: 0.15, metalness: 1 } as const;
/* Cast and bead-blasted aluminium — bright, but scattered enough to read matte
   next to the chrome beside it. */
export const ALLOY = { color: "#82888f", roughness: 0.38, metalness: 0.86 } as const;
export const CAST_IRON = { color: "#34363b", roughness: 0.84, metalness: 0.22 } as const;
export const RUBBER = { color: "#0d0e11", roughness: 0.94, metalness: 0 } as const;
/* Painted machinery is a DIELECTRIC coat over steel, not bare metal. The old
   0.3 metalness was stealing the diffuse and leaving the lift columns muddy;
   at zero the enamel holds its colour and the clearcoat presets below add the
   wet sheen on the hero pieces. */
export const LIFT_RED = { color: "#83291c", roughness: 0.36, metalness: 0.04 } as const;
export const TOOL_RED = { color: "#963320", roughness: 0.34, metalness: 0.04 } as const;
export const SAFETY = { color: "#b8871f", roughness: 0.48, metalness: 0.05 } as const;
export const GRIME = { color: "#212329", roughness: 0.93, metalness: 0.08 } as const;
export const ENGINE_ORANGE = {
  color: "#b74d18",
  roughness: 0.32,
  metalness: 0.06,
} as const;

/* ── Clearcoat presets — meshPhysicalMaterial ONLY ──────────────────────────
   Clearcoat is the single thing that separates "painted metal" from "plastic":
   a second, near-mirror specular layer sitting on top of a coloured base. It
   costs one extra BRDF lobe and it is the cheapest realism in the file. */

/** Shop equipment enamel: hard-wearing, semi-gloss, a bit orange-peeled. */
export const ENAMEL_COAT = { clearcoat: 0.65, clearcoatRoughness: 0.24 } as const;
/** Bodywork: deep, wet, show-quality. */
export const PAINT_COAT = { clearcoat: 1, clearcoatRoughness: 0.05 } as const;
