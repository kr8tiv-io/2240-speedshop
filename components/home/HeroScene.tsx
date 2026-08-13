"use client";

import { Component, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import { Effect, EffectAttribute, ToneMappingMode } from "postprocessing";
import {
  addDissolve,
  chainCompile,
  cloudFragment,
  cloudVertex,
  dissolveUniforms,
  fitDistance,
  fitStage,
  gridGhostMaterial,
  sampleSurface,
  scanHeight,
  type DissolveUniforms,
} from "@/lib/stage";

/**
 * "Three cars, one lamp" — the WebGL film on the site, AFTER HOURS version.
 *
 * Three acts, three vehicles, three rooms. Each act CUTS: the outgoing car
 * dissolves upward into its own surface points and blows away, the stage sits
 * empty for a beat, the camera cuts to a new arc, and the next car
 * precipitates back out of the air — a lattice of points falling into place
 * from the floor up while a hot dissolve front sweeps the bodywork in behind
 * them. Same lamp-lit language throughout; a different machine, a different
 * mood and a different camera every time.
 *
 *   ACT I    2015 Dodge Challenger      one lamp, tungsten, oxblood candy
 *   ACT II   1972 coupe, hood up        second lamp down in the engine bay
 *   ACT III  pre-war hot-rod donor      moonlight through the bay door
 *
 * Everything is driven from OUTSIDE by a single scrubbed float `shot.film`
 * (0 → 3). The Director below derives the act, the reveal, and the camera
 * time from it, so the cut ALWAYS lands on the frame where the stage is
 * empty — there is no state machine to fall out of sync.
 */

export type Shot = {
  /** 0 → 3. One unit per act. The whole film in one number. */
  film: number;
  flare: number;
  lamp: number;
  warm: number;
  cool: number;
  tail: number;
};

/* ── The three acts ─────────────────────────────────────────────────────── */

type Role =
  | "paint"
  /** Stripped and sprayed in etch primer — a panel mid-job. */
  | "primer"
  /** Original paint, tinted and polished but keeping its own texture map. */
  | "worn"
  | "lamp"
  | "lens"
  | "glass"
  | "rubber"
  | "chrome"
  | "trim";

type Act = {
  url: string;
  /** Stage metres, nose to tail. */
  length: number;
  /** Candy base coat for this act's bodywork. */
  paint: string;
  /** Multiplier on the car's own lamp emissives — a big round pickup
      headlight blooms far harder than a Challenger's slot, at the same
      intensity, and two blown discs is not a shot. */
  lampBoost: number;
  /** [position, lookAt] per camera keyframe — four per act. */
  keys: Array<[THREE.Vector3, THREE.Vector3]>;
  /** The room: where the lamp hangs and what colour it burns. */
  room: {
    lamp: [number, number, number];
    lampColor: string;
    lampPower: number;
    cone: [number, number];
    coneAlpha: number;
    /** The act's second light — bay-door moon, inspection lamp, whatever. */
    accent: [number, number, number];
    accentColor: string;
    accentPower: number;
    fog: [number, number];
  };
  /** Colour of the incoming point cloud, the lattice, and the dissolve edge. */
  spark: string;
  hot: string;
  /** Grid cell size in metres. Bigger cells on the bigger body so the lattice
      reads at the same density in frame across all three acts. */
  gridCell: number;
  /** Material name → role. Falls back to `role()` heuristics. */
  roleOf: (name: string, mat: THREE.MeshStandardMaterial) => Role;
};

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** The two Grzybek bodies name their materials (Body, Headlights, Windows…),
    so the roles fall straight out of the names. */
function byName(name: string): Role | null {
  if (name.includes("headlight") || name.includes("sidelight")) return "lamp";
  if (
    name.includes("tailight") ||
    name.includes("taillight") ||
    name.includes("brakelight")
  )
    return "lens";
  if (name.includes("window") || name.includes("glass")) return "glass";
  if (name.includes("tire") || name.includes("tyre")) return "rubber";
  return null;
}


const ACTS: Act[] = [
  {
    // ACT I — the finished car. The original shot, untouched: it is the one
    // Matt keeps scrolling back to.
    url: "/models/hero/challenger.glb",
    length: 4.7,
    paint: "#571c1c",
    lampBoost: 1,
    keys: [
      [v3(5.1, 1.15, 1.7), v3(0, 0.7, 0)],
      [v3(2.6, 0.68, 5.0), v3(0, 0.62, 0.7)],
      [v3(-5.8, 1.3, -5.3), v3(0, 0.62, -0.4)],
      [v3(2.2, 3.1, 7.6), v3(0.4, 1.2, 0.2)],
    ],
    room: {
      lamp: [1.15, 3.55, 1.35],
      lampColor: "#ffb066",
      lampPower: 16,
      cone: [1.55, 3.65],
      coneAlpha: 0.16,
      accent: [-7, 3.4, -5],
      accentColor: "#7189b8",
      accentPower: 0.85,
      // Fog starts BEYOND the car. At 9 it was eating the body on every phone
      // (measured camera distance there is 12-17m), which is why the cars read
      // as murky on small screens. Still far enough in to hide the floor
      // plane's edge at ~25m.
      fog: [18, 30],
    },
    spark: "#ffb066",
    hot: "#fff0d6",
    gridCell: 0.15,
    roleOf: (name) => byName(name) ?? (name.includes("body") || name === "middle" ? "paint" : "trim"),
  },
  {
    // ACT II — the same shop, one bay over: hood up, motor open, the lamp
    // pulled right down into the engine bay.
    url: "/models/hero/coupe-hoodup.glb",
    length: 4.9,
    paint: "#5a2f10",
    lampBoost: 0.85,
    keys: [
      [v3(4.9, 0.72, 3.9), v3(0, 0.8, 0.5)],
      [v3(2.3, 2.5, 3.0), v3(0, 1.0, 1.0)],
      [v3(-1.4, 3.5, 3.6), v3(0, 0.95, 0.7)],
      [v3(-6.4, 1.45, 4.4), v3(0, 0.78, 0)],
    ],
    room: {
      lamp: [0.2, 2.35, 1.9],
      lampColor: "#ffc07a",
      lampPower: 22,
      cone: [1.15, 2.35],
      coneAlpha: 0.2,
      accent: [4.5, 1.6, 4.5],
      accentColor: "#6f86b4",
      accentPower: 0.6,
      fog: [18, 30],
    },
    spark: "#ffc98a",
    hot: "#fff6e6",
    gridCell: 0.155,
    // Hood up, mid-restoration: the two body materials take the copper candy,
    // the near-blacks stay rubber, and every remaining panel reads as PRIMER —
    // which is what a car on a hoist actually looks like.
    roleOf: (name, mat) => {
      const named = byName(name);
      if (named) return named;
      if (name === "body" || name === "details 6.001") return "paint";
      /* Threshold 0.03 -> 0.012. This model ships its ENTIRE under-hood —
         open hood inner, engine bay, interior through the glass — as
         near-black materials, and at 0.03 all of it classified as "rubber"
         and took the #050505 base: from the top-down dolly that painted a
         car-sized solid black slab across most of the frame, unfixable by
         any amount of light because the albedo was the floor. At 0.012 only
         the true blacks (tyres) stay rubber; the rest reads as dark primer,
         which is what an engine bay mid-restoration actually is. */
      return mat.color.r * 0.3 + mat.color.g * 0.6 + mat.color.b * 0.1 < 0.012 ? "rubber" : "primer";
    },
  },
  {
    // ACT III — the driver. Back bay, moonlight through the door, one bare
    // bulb a long way off, and a late-60s Charger sitting in it in old paint.
    url: "/models/hero/charger.glb",
    length: 4.95,
    // Lifted from #2e4a4a: a near-black teal on a moonlit night scene with a
    // camera on the unlit side is a silhouette, not a car.
    paint: "#3d6663",
    lampBoost: 0.6,
    keys: [
      // Low and forward: a pickup is a face, and the arc walks around it —
      // corner, down past the arch, along the bed, then a crane away.
      [v3(5.2, 1.55, 4.8), v3(0, 1.0, 0.2)],
      [v3(2.1, 0.52, 6.0), v3(0, 0.9, 0.5)],
      [v3(-5.4, 1.1, 3.6), v3(0, 0.95, 0)],
      [v3(-3.6, 3.3, -5.4), v3(0, 1.0, -0.2)],
    ],
    room: {
      lamp: [0.3, 3.8, -0.8],
      lampColor: "#ff9a44",
      lampPower: 24,
      cone: [2.0, 4.0],
      coneAlpha: 0.13,
      // The moon comes from the camera side in this act, not from behind it:
      // every keyframe here works the car's front three-quarter, and a rim
      // light on the far side leaves the whole shot in shadow.
      accent: [6.5, 3.2, 6.0],
      accentColor: "#9db4dd",
      accentPower: 2.0,
      fog: [20, 34],
    },
    spark: "#9fb6e0",
    hot: "#e8f0ff",
    gridCell: 0.165,
    // The Charger names its materials plainly: red_chasis is the body,
    // roof_black the vinyl top, metalic the brightwork, red_light the lenses.
    roleOf: (name) => {
      const named = byName(name);
      if (named) return named;
      if (name === "red_chasis") return "paint";
      if (name === "red_light") return "lens";
      if (name === "metalic") return "chrome";
      // `grey` is the inner fender and wheel-well structure. Left as trim it
      // caught the new front-quarter moon and read as a pale bowl under each
      // arch — the one thing in the shot that looked like a modelling error.
      if (name === "roof_black" || name === "really_black" || name === "grey") return "rubber";
      return "trim";
    },
  },
];

/* Draco is OFF and meshopt is ON: the three heroes are packed with gltfpack,
   whose decoder is ~25 kB and already bundled inside drei — so there is no
   250 kB /draco/ decoder fetch on the critical path at all. All three are
   preloaded here, at module scope, which is what puts them behind the
   preloader's real percentage instead of stalling a scroll mid-film. */
const DRACO = false;
for (const act of ACTS) useGLTF.preload(act.url, DRACO);

const EMBER = new THREE.Color("#ffd9ad");
const TUNGSTEN = new THREE.Color("#ffb066");

/* ── The Director: one scrubbed float in, the whole film out ────────────── */

/**
 * `film` 0→3 is the only thing the page tweens. Everything the scene needs is
 * derived here, once per frame, before anything else runs (priority −10):
 *
 *   act     which vehicle is on stage
 *   local   0→1 progress through that act
 *   reveal  0→1 the matrix assembly — zero at BOTH ends of an act, which is
 *           exactly why the cut is invisible
 *   t       0→3 camera time along that act's four keyframes
 *
 * The final act never dissolves out: the film ends on a lit car, not on an
 * empty room.
 */
const stage = { act: 0, local: 0, reveal: 0, t: 0, cut: false };

/* Published for the verification script (scripts/film-shots.js): which act is
   up, how far the reveal has assembled, and each act's fitted radius. Reading
   the real numbers off the running page is the only way to prove "the whole
   car is in frame" instead of squinting at a dark screenshot. */
declare global {
  interface Window {
    __film?: {
      stage: typeof stage;
      half: THREE.Vector3[];
      centreY: number[];
      camera: [number, number, number];
      /** Live draw cost, so the verification script reports it as a number. */
      calls: number;
      triangles: number;
      /** Largest |NDC| over the car's 8 corners. < 1 = fully in frame. */
      edge: number;
      /** Live scene graph, for probes that need visibility rather than framing. */
      three: { scene: THREE.Scene; camera: THREE.Camera; gl: THREE.WebGLRenderer };
    };
  }
}

function smoothstep(a: number, b: number, x: number) {
  const k = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return k * k * (3 - 2 * k);
}

function Director({ shot }: { shot: Shot }) {
  useFrame(() => {
    const film = THREE.MathUtils.clamp(shot.film, 0, ACTS.length);
    const act = Math.min(ACTS.length - 1, Math.floor(film));
    const local = THREE.MathUtils.clamp(film - act, 0, 1);
    const last = act === ACTS.length - 1;
    stage.cut = act !== stage.act;
    stage.act = act;
    stage.local = local;
    /* The empty-stage window between acts is now WIDE on purpose: the car is
       fully gone from 0.90 of one act to 0.10 of the next, and that gap is
       where the written interlude plays. Car, then a page of writing, then the
       next car — rather than car after car after car. */
    stage.reveal = smoothstep(0.1, 0.26, local) * (last ? 1 : 1 - smoothstep(0.78, 0.9, local));
    stage.t = THREE.MathUtils.clamp((local - 0.22) / 0.58, 0, 1) * 3;
  }, -10);
  return null;
}

/* Published by each act's fit so the camera rig can guarantee framing. */
const HALF = ACTS.map(() => new THREE.Vector3(1, 0.7, 2.35));
const CENTRE_Y = [0.7, 0.7, 0.7];

/* ── Streak sprites: the "expensive lens" whisper ───────────────────────── */

let streakTexture: THREE.CanvasTexture | null = null;
function getStreakTexture() {
  if (streakTexture) return streakTexture;
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  g.addColorStop(0, "rgba(255,196,140,0)");
  g.addColorStop(0.42, "rgba(255,205,150,0.5)");
  g.addColorStop(0.5, "rgba(255,238,214,1)");
  g.addColorStop(0.58, "rgba(255,205,150,0.5)");
  g.addColorStop(1, "rgba(255,196,140,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 64);
  const v = ctx.createLinearGradient(0, 0, 0, 64);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(0.5, "rgba(0,0,0,1)");
  v.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, 256, 64);
  streakTexture = new THREE.CanvasTexture(c);
  return streakTexture;
}

function Streak({
  position,
  scale,
  getOpacity,
}: {
  position: THREE.Vector3 | [number, number, number];
  scale: [number, number];
  getOpacity: () => number;
}) {
  const mat = useRef<THREE.SpriteMaterial>(null);
  const texture = useMemo(getStreakTexture, []);
  useFrame(() => {
    if (mat.current) mat.current.opacity = getOpacity();
  });
  return (
    <sprite position={position} scale={[scale[0], scale[1], 1]}>
      <spriteMaterial
        ref={mat}
        map={texture}
        color="#ffd9ad"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  );
}

/* If a GLB request 502s or is cut off, useGLTF's promise rejects and the
   suspended act THROWS on retry — without a boundary that unmounts the entire
   app tree and bricks the page behind the preloader. With it, the film simply
   plays that act without its car: void, floor, lamp, copy. */
class ActBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* Soft elliptical falloff for the contact shadow — one 128px canvas, shared
   by all three acts. */
let groundTexture: THREE.CanvasTexture | null = null;
function getGroundTexture() {
  if (groundTexture) return groundTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,0.86)");
  g.addColorStop(0.42, "rgba(255,255,255,0.44)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  groundTexture = new THREE.CanvasTexture(c);
  return groundTexture;
}

/* ── The scan sheet: the plane the build front rides on ─────────────────── */

/**
 * A single additive quad that sits exactly at the build height and fades out
 * toward its own edges. Without it the grid front reads as an accident of the
 * shader; with it there is visibly a scanner passing through the car, and the
 * light it throws on the floor sells the whole idea for one draw call.
 */
function ScanSheet({
  half,
  diss,
  color,
}: {
  half: THREE.Vector3;
  diss: DissolveUniforms;
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color).multiplyScalar(1.15) }, uAlpha: { value: 0 } }),
    [color],
  );

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const d = diss.uDiss.value;
    // Present only while something is actually being built.
    const live = Math.min(1, Math.max(0, Math.sin(Math.PI * THREE.MathUtils.clamp(d, 0, 1))));
    uniforms.uAlpha.value = live * 0.3;
    m.visible = live > 0.02;
    m.position.y = scanHeight(d, diss.uDissH.value);
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} renderOrder={4} visible={false}>
      <planeGeometry args={[half.x * 3.4, half.z * 2.7]} />
      <shaderMaterial
        args={[
          {
            uniforms,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            vertexShader: /* glsl */ `
              varying vec2 vUvS;
              void main() {
                vUvS = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              }
            `,
            fragmentShader: /* glsl */ `
              uniform vec3 uColor;
              uniform float uAlpha;
              varying vec2 vUvS;
              void main() {
                vec2 d = abs( vUvS - 0.5 ) * 2.0;
                float falloff = ( 1.0 - smoothstep( 0.35, 1.0, d.x ) ) * ( 1.0 - smoothstep( 0.35, 1.0, d.y ) );
                gl_FragColor = vec4( uColor, uAlpha * falloff );
              }
            `,
          },
        ]}
      />
    </mesh>
  );
}

/* ── One act: the car, its lattice, its point cloud, its dissolve ───────── */

function ActStage({
  index,
  act,
  rich,
  shot,
}: {
  index: number;
  act: Act;
  rich: boolean;
  shot: Shot;
}) {
  const { scene } = useGLTF(act.url, DRACO);
  const group = useRef<THREE.Group>(null);
  const pool = useRef<THREE.MeshBasicMaterial>(null);
  const headlights = useRef<THREE.MeshStandardMaterial[]>([]);
  const taillights = useRef<THREE.MeshStandardMaterial[]>([]);
  const flakeU = useRef({ value: 0 }).current;

  /* THE UNIFORMS LIVE IN REFS, NOT IN THE MEMO — and this is not a style
     choice. React re-invokes a useMemo factory (StrictMode does it on every
     mount), so a uniform object created inside it can be a DIFFERENT object
     from the one the materials closed over: the frame loop then dutifully
     animates an orphan while the shader reads a uniform stuck at zero, and
     every car renders as a black cutout with no error anywhere. One stable
     object per act, created once, is the whole fix. */
  // boost 2.3 pushes the edge colour past luminance 1, which is what makes
  // the dissolve front the fourth thing in this scene that blooms. The grid
  // colour is boosted too so the lattice itself crosses the bloom threshold —
  // on black, a grid that does not glow is just a wireframe.
  // Edge gain 2.3 -> 1.8: under real tone mapping (see the composer) the old
  // boost pushed the dissolve front so far past the bloom knee that the sweep
  // strobed on slower machines — "the lights are flashing a lot".
  const diss = useRef<DissolveUniforms>(
    dissolveUniforms(act.hot, 1, 1.15, 1.8, {
      cell: act.gridCell,
      color: act.spark,
      // Restrained on purpose. Additive lines over a bloom pass with a
      // luminance-1 threshold compound fast: at the first tuning the whole
      // car came out as one white blob and the lattice stopped reading AS a
      // lattice. It has to glow and still be legible as a grid.
      gain: 1.0,
      boost: 1.15,
    }),
  ).current;
  const cloudU = useRef({
    uReveal: { value: 0 },
    // gl_PointSize is divided by view-space depth in METRES, so this is a
    // pixels-times-metres constant, not a model-space one.
    uSize: { value: 42 },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(act.spark) },
    uHot: { value: new THREE.Color(act.hot) },
  }).current;

  useEffect(() => {
    flakeU.value = rich ? 1 : 0;
  }, [rich, flakeU]);

  const built = useMemo(() => {
    const build = fitStage(scene, act.length);
    const fit = build.fit;
    HALF[index].copy(fit.half);
    CENTRE_Y[index] = fit.height / 2;

    diss.uDissH.value = Math.max(fit.height, 0.001);
    const lights: THREE.MeshStandardMaterial[] = [];
    const brakes: THREE.MeshStandardMaterial[] = [];
    const headMeshes: THREE.Mesh[] = [];
    const swapped = new Map<THREE.Material, THREE.Material>();
    // Synchronous — `mobile` settles one render late (matchMedia in a parent
    // effect) and this memo must never re-run against already-swapped
    // materials. Candy paint is a compile-time choice, made once, here.
    const phone = window.matchMedia("(max-width: 767px)").matches;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      const rebuilt = list.map((entry) => {
        const source = entry as THREE.MeshStandardMaterial;
        if (!source?.isMeshStandardMaterial) return entry;
        const cached = swapped.get(entry);
        if (cached) {
          if ((cached as THREE.MeshStandardMaterial).userData.head) headMeshes.push(mesh);
          return cached;
        }

        const name = source.name.toLowerCase();
        const role = act.roleOf(name, source);
        let next: THREE.Material;

        switch (role) {
          case "lamp": {
            // The bloom sources on the car. Dark housing, hot filament.
            const lamp = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#141210"),
              emissive: EMBER.clone(),
              emissiveIntensity: 1.3,
              roughness: 0.35,
            });
            lamp.userData.head = true;
            lights.push(lamp);
            headMeshes.push(mesh);
            next = lamp;
            break;
          }
          case "lens": {
            // Lenses rest OFF — the last chapter's light state wakes them.
            const lens = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#1a0b0b"),
              emissive: new THREE.Color("#ff2a22"),
              emissiveIntensity: 0,
              roughness: 0.25,
              metalness: 0.1,
            });
            brakes.push(lens);
            next = lens;
            break;
          }
          case "paint": {
            // Speed-red lives HERE — the car's paint, nowhere else. A deep
            // base under a hard clearcoat; the Lightformer rig's long rect
            // strips are what draw the streak down the body line.
            const paint = new THREE.MeshPhysicalMaterial({
              name: source.name,
              color: new THREE.Color(act.paint),
              metalness: 0.2,
              roughness: 0.38,
              clearcoat: 1,
              clearcoatRoughness: 0.1,
              envMapIntensity: 1.4,
            });
            if (!phone) addCandy(paint, flakeU);
            next = paint;
            break;
          }
          case "primer":
            // Etch primer: flat, chalky, no clearcoat. The finish of a panel
            // that has been stripped and not yet sprayed.
            next = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#4a4b4e"),
              roughness: 0.86,
              metalness: 0.12,
              envMapIntensity: 0.75,
            });
            break;
          case "worn": {
            // Original paint. The source material carries the model's own
            // texture atlas, so it is kept and TINTED toward the act's colour
            // rather than replaced — patina reads as history, a respray
            // reads as a render.
            const body = source.clone();
            body.color.lerp(new THREE.Color(act.paint), 0.55);
            body.roughness = 0.44;
            body.metalness = 0.24;
            body.envMapIntensity = 1.35;
            next = body;
            break;
          }
          case "glass":
            // Roughness up from 0.06 and env down from 1.4: once the ceiling
            // became a run of bright strips instead of one soft panel, a
            // near-mirror rear window caught a whole strip at once and turned
            // into a blown white slab. Glass on a night shot should catch a
            // sliver, not a plate.
            next = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#07080a"),
              metalness: 0.25,
              roughness: 0.16,
              envMapIntensity: 0.85,
            });
            break;
          case "rubber":
            // #050505 -> #101214: at 0.02 albedo NO light can lift a surface
            // off pure black, and any large panel misclassified as rubber
            // became an unfixable slab. 0.07 albedo still reads as black tyre
            // under the lamp; it just responds to light like a real one.
            next = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#101214"),
              roughness: 0.92,
              metalness: 0,
            });
            break;
          case "chrome":
            // Brushed, not mirrored. At 0.24 roughness the Charger's brake
            // discs turned into two blown-white coins under the act III moon.
            next = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#63676e"),
              roughness: 0.44,
              metalness: 0.74,
              envMapIntensity: 0.8,
            });
            break;
          default: {
            const trim = source.clone();
            trim.flatShading = false;
            trim.color.multiplyScalar(0.55);
            trim.roughness = THREE.MathUtils.clamp(trim.roughness, 0.4, 0.9);
            trim.metalness = Math.min(trim.metalness, 0.6);
            next = trim;
            break;
          }
        }

        addDissolve(next, diss, `2240-${role}`);
        next.userData.role = role;
        next.needsUpdate = true;
        swapped.set(entry, next);
        return next;
      });

      mesh.material = Array.isArray(mesh.material) ? rebuilt : rebuilt[0];
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      // COLOR_0 is baked ambient occlusion — the Blender pass writes it, and
      // three multiplies base colour by it for free. That is the entire
      // contact-shadow budget: no AO map, no second UV set, no extra request,
      // and it survives the phone. Its presence also MARKS an asset as refined.
      const refined = mesh.geometry.getAttribute("color") != null;
      if (refined) {
        // Gate on the attribute existing: vertexColors against a missing
        // COLOR_0 reads undefined and the mesh renders black.
        for (const m of rebuilt) {
          m.vertexColors = true;
          m.needsUpdate = true;
        }
      }

      // NO RUNTIME WELD. Bodywork used to be welded and re-normalled here so
      // panels read as panels rather than as facets, but the weld is
      // indiscriminate: it smooths every shared edge, so a door shut line and
      // a bumper seam went soft along with the quarter panel. Blender's pass
      // (scripts/blender-refine.py) now merges doubles and shades smooth by
      // 40 degrees, which keeps a crease a crease, and every model this scene
      // loads goes through it — see ACTS, all three are /models/hero/*.
      //
      // Gating this on `refined` instead would be wrong: gltfpack prunes
      // COLOR_0 wherever the bake came out uniformly unoccluded (41 of the
      // Challenger's 49 primitives), so a pruned trim piece would look
      // unrefined and get re-welded even though Blender had already smoothed
      // it correctly.
    });

    // The car never moves — only the camera does. Freeze the whole subtree's
    // world matrices so three stops re-walking it every frame (real CPU on a
    // throttled phone, and there are three of these mounted).
    scene.updateMatrixWorld(true);
    scene.traverse((child) => {
      child.matrixAutoUpdate = false;
    });

    /* MEASURE THE CAR THAT IS ACTUALLY THERE.
       HALF/CENTRE_Y came from fitStage's own fit box, and the Rig then framed
       the shot against those numbers — so if the fit box understates the model,
       the rig is satisfied by a camera that is far too close and NOTHING
       reports a problem: `edge` is computed from the same understated box, so
       it happily returns 0.89 for a car overflowing the viewport. Act II is
       exactly that case. On the dark build it read as a black screen with a
       few faint edge traces, because a car pressed against the lens on a night
       stage is a featureless wall, and it survived every beat screenshot
       because framing was asserted against the fit box rather than the mesh.

       `scene` here is the GLTF root AFTER fitStage has positioned and scaled
       it, and before the ghost/cloud are added — so this box is the bodywork
       and nothing else. Measuring it is both the honest number and the one the
       camera should be solving against. */
    const tmpBox = new THREE.Box3();
    const realBox = new THREE.Box3().setFromObject(scene);
    if (!realBox.isEmpty()) {
      const size = realBox.getSize(new THREE.Vector3());
      const centre = realBox.getCenter(new THREE.Vector3());
      HALF[index].set(size.x / 2, size.y / 2, size.z / 2);
      CENTRE_Y[index] = centre.y;
    }

    const headCenters = [...new Set(headMeshes)].map((m) =>
      tmpBox.setFromObject(m).getCenter(new THREE.Vector3()),
    );

    headlights.current = lights;
    taillights.current = brakes;

    /* THE GRID GHOST — a second draw of the car's own geometry as lines,
       sharing the build front with the surface shader. This is the effect the
       film is named after: ahead of the front the car exists only as a
       lattice, at the front the lattice is white-hot, behind it the solid has
       taken over. One material, one extra draw call, no extra geometry. */
    const ghostMaterial = gridGhostMaterial(diss, phone ? 0.5 : 0.62);
    const ghost = new THREE.Group();
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh || !mesh.geometry) return;
      const line = new THREE.Mesh(mesh.geometry, ghostMaterial);
      line.matrixAutoUpdate = false;
      line.matrix.copy(mesh.matrixWorld);
      line.frustumCulled = false;
      line.renderOrder = 5;
      ghost.add(line);
    });

    // The matrix reveal itself. Points are area-weighted over the SURFACE, so
    // all three cars carry the same density no matter their poly count — the
    // 3.4k-vert body and the 47k-vert body dissolve identically.
    const cloud = sampleSurface(build, phone ? 7000 : 24000, 2240 + index * 7);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(cloud.target, 3));
    geometry.setAttribute("aStart", new THREE.BufferAttribute(cloud.start, 3));
    geometry.setAttribute("aDelay", new THREE.BufferAttribute(cloud.delay, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(cloud.seed, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);

    cloudU.uSize.value = phone ? 30 : 42;
    const cloudMaterial = new THREE.ShaderMaterial({
      vertexShader: cloudVertex,
      fragmentShader: cloudFragment,
      uniforms: cloudU,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      fit,
      geometry,
      cloudMaterial,
      headCenters,
      ghost,
      ghostMaterial,
      // Every material carrying the dissolve chain, so the frame loop can
      // drive the uniforms THROUGH the materials (userData.__dissU) rather
      // than trusting that its own `diss` ref is the object the shaders
      // compiled against — see the orphan-uniform note in lib/stage.ts.
      dissMats: [...new Set(swapped.values())],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- materials must be swapped exactly once per loaded scene; flakeU is a stable ref value
  }, [scene]);

  useEffect(
    () => () => {
      built.geometry.dispose();
      built.cloudMaterial.dispose();
      built.ghostMaterial.dispose();
    },
    [built],
  );

  useFrame((state) => {
    const on = stage.act === index;
    const reveal = on ? stage.reveal : 0;
    const g = group.current;
    if (g) g.visible = reveal > 0.002;
    diss.uDiss.value = reveal;
    /* Belt to the ref's braces: drive the uniforms the MATERIALS point at.
       If the object a shader compiled against ever diverges from `diss`
       (recreated ref, double mount, cached GLTF rebuilt), the ref write above
       animates an orphan and the discard in the dissolve keeps the whole car
       off screen with no error — the invisible-act bug. Writing through
       userData reaches whichever object is actually live in each shader. */
    for (const m of built.dissMats) {
      const du = m.userData.__dissU as DissolveUniforms | undefined;
      if (du && du !== diss) {
        du.uDiss.value = reveal;
        du.uDissH.value = diss.uDissH.value;
      }
    }
    cloudU.uReveal.value = reveal;
    cloudU.uTime.value = state.clock.elapsedTime;
    if (!on) return;

    // The contact shadow arrives with the car, not before it.
    if (pool.current) pool.current.opacity = reveal * 0.72;

    const intensity = (1.3 + shot.flare * 9) * act.lampBoost;
    for (const mat of headlights.current) mat.emissiveIntensity = intensity;
    for (const mat of taillights.current) mat.emissiveIntensity = shot.tail * 2.4;
  });

  const ss = 1 / built.fit.scale;

  return (
    <group ref={group} visible={false}>
      <group position={built.fit.offset} scale={built.fit.scale}>
        <group rotation={[0, built.fit.rotY, 0]}>
          <primitive object={scene} />
          {/* the lattice the car is built out of */}
          <primitive object={built.ghost} />
          <points
            geometry={built.geometry}
            material={built.cloudMaterial}
            frustumCulled={false}
            renderOrder={6}
          />
          {rich &&
            built.headCenters.map((p, i) => (
              <Streak
                key={i}
                position={p}
                scale={[1.5 * ss, 0.11 * ss]}
                getOpacity={() => (0.1 + shot.flare * 0.5) * stage.reveal}
              />
            ))}
        </group>
      </group>
      <ScanSheet half={built.fit.half} diss={diss} color={act.spark} />
      {/* THE CONTACT SHADOW. The white sibling has always had one; the dark
          build never did, and on a polished floor under one lamp the car read
          as hovering a few centimetres off it. A radial-gradient plane costs
          one draw and no per-frame work, and it is the cheapest realism in the
          scene — the eye reads contact before it reads paint. It fades in with
          the reveal so it is not a shadow of a car that has not arrived. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} renderOrder={3}>
        <planeGeometry args={[built.fit.half.x * 3.6, built.fit.half.z * 2.6]} />
        <meshBasicMaterial
          ref={pool}
          map={getGroundTexture()}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.NormalBlending}
          color="#000000"
        />
      </mesh>
    </group>
  );
}

/** Couture paint: fresnel candy hue-mix plus optional metallic flake. */
function addCandy(paint: THREE.MeshPhysicalMaterial, flake: { value: number }) {
  chainCompile(paint, "candy-paint", (s) => {
      s.uniforms.uFlake = flake;
      s.vertexShader = s.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vCandyW;")
        .replace(
          "#include <worldpos_vertex>",
          "#include <worldpos_vertex>\nvCandyW = ( modelMatrix * vec4( position, 1.0 ) ).xyz;",
        );
      s.fragmentShader = s.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform float uFlake;\nvarying vec3 vCandyW;")
        .replace(
          "#include <normal_fragment_begin>",
          `#include <normal_fragment_begin>
          if ( uFlake > 0.5 ) {
            vec3 fp = floor( vCandyW * 330.0 );
            vec3 fh = fract( sin( vec3(
              dot( fp, vec3( 127.1, 311.7, 74.7 ) ),
              dot( fp, vec3( 269.5, 183.3, 246.1 ) ),
              dot( fp, vec3( 113.5, 271.9, 124.6 ) ) ) ) * 43758.5453 );
            normal = normalize( normal + ( fh - 0.5 ) * 0.15 );
          }`,
        )
        .replace(
          "vec4 diffuseColor = vec4( diffuse, opacity );",
          `float candyFres = pow( 1.0 - clamp( dot( normalize( vNormal ), normalize( vViewPosition ) ), 0.0, 1.0 ), 2.2 );
          vec3 candyBase = mix( diffuse * vec3( 1.42, 1.12, 1.0 ), diffuse * vec3( 0.52, 0.36, 0.44 ), candyFres );
          vec4 diffuseColor = vec4( candyBase, opacity );`,
      );
  });
}

/* ── The work lamp: housing, tube, analytical volumetric cone ───────────── */

const coneShader = {
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying float vY;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldPos = wp.xyz;
      vY = uv.y;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uMul;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying float vY;
    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float fresnel = pow(abs(dot(viewDir, normalize(vNormal))), 1.6);
      float vertical = smoothstep(0.0, 0.25, vY) * pow(vY, 1.15);
      float breathe = 0.92 + 0.08 * sin(uTime * 2.1) * sin(uTime * 0.63);
      float a = fresnel * vertical * breathe * uMul;
      gl_FragColor = vec4(uColor, a);
    }
  `,
};

const LAMP_WARM = new THREE.Color("#ff9a44");
const lampScratch = new THREE.Color();
const lampTargetColor = new THREE.Color();
const lampPos = new THREE.Vector3(...ACTS[0].room.lamp);
const lampTargetPos = new THREE.Vector3();

/**
 * One lamp for the whole film — it MOVES between acts rather than being three
 * lamps. Position, colour, throw and cone geometry all damp toward the
 * current act's room, so a cut still reads as the same shop, one bay over.
 */
function WorkLamp({ shot, rich }: { shot: Shot; rich: boolean }) {
  const rig = useRef<THREE.Group>(null);
  const cone = useRef<THREE.Mesh>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ffc58a") },
      uTime: { value: 0 },
      uMul: { value: 0.16 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const room = ACTS[stage.act].room;
    const damp = 1 - Math.exp(-delta * (stage.cut ? 60 : 4));
    lampTargetPos.set(...room.lamp);
    lampPos.lerp(lampTargetPos, damp);
    if (rig.current) rig.current.position.copy(lampPos);

    uniforms.uTime.value = state.clock.elapsedTime;
    // Chapter light states: `lamp` is the master dimmer, `warm` swings the
    // lamp warmer and tighter. All uniform writes — no recompiles, no React.
    const level = (0.3 + 0.7 * shot.lamp) * (0.15 + 0.85 * stage.reveal);
    uniforms.uMul.value = room.coneAlpha * level * (1 + 0.5 * shot.warm);
    lampTargetColor.set(room.lampColor);
    if (light.current) {
      light.current.intensity = room.lampPower * level * (1 + 0.4 * shot.warm);
      light.current.color.lerp(lampScratch.copy(lampTargetColor).lerp(LAMP_WARM, shot.warm), damp);
    }
    if (bulb.current) {
      bulb.current.emissiveIntensity =
        5.2 * (0.25 + 0.75 * shot.lamp) * (1 + 0.25 * shot.warm) * (0.2 + 0.8 * stage.reveal);
    }
    if (cone.current) {
      // Unit cone geometry, scaled per act: a wider, shallower shaft in the
      // back bay; a tight pool right down in the engine bay.
      const tight = 1 - 0.16 * shot.warm;
      const [radius, height] = room.cone;
      const s = cone.current.scale;
      s.x += (radius * tight - s.x) * damp;
      s.z += (radius * tight - s.z) * damp;
      s.y += (height - s.y) * damp;
      cone.current.position.y = -s.y / 2;
    }
  });

  return (
    <group ref={rig} position={ACTS[0].room.lamp}>
      {/* cord */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 2.4, 6]} />
        <meshStandardMaterial color="#0c0c0d" roughness={0.9} />
      </mesh>
      {/* shade */}
      <mesh position={[0, 0.09, 0]}>
        <coneGeometry args={[0.24, 0.2, 24, 1, true]} />
        <meshStandardMaterial color="#141414" roughness={0.5} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* the tube — the room's own bloom source */}
      <mesh>
        <sphereGeometry args={[0.055, 16, 12]} />
        <meshStandardMaterial
          ref={bulb}
          color="#1a1712"
          emissive={EMBER}
          emissiveIntensity={5.2}
          toneMapped={false}
        />
      </mesh>
      {rich && (
        <Streak position={[0, 0, 0]} scale={[1.35, 0.1]} getOpacity={() => 0.16 * (0.3 + 0.7 * shot.lamp)} />
      )}
      <pointLight ref={light} color={TUNGSTEN} intensity={16} distance={12} decay={2} />
      {/* analytical volumetric cone — unit geometry, scaled per act */}
      <mesh ref={cone} position={[0, -1.82, 0]}>
        <coneGeometry args={[1, 1, 40, 24, true]} />
        <shaderMaterial
          args={[
            {
              vertexShader: coneShader.vertexShader,
              fragmentShader: coneShader.fragmentShader,
              uniforms,
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
              side: THREE.DoubleSide,
            },
          ]}
        />
      </mesh>
    </group>
  );
}

/* ── The act's second light: moon through the bay door, or an inspection
      lamp down in the engine bay. Same fixture, three jobs. ─────────────── */

const accentPos = new THREE.Vector3(...ACTS[0].room.accent);
const accentTargetPos = new THREE.Vector3();
const accentColor = new THREE.Color(ACTS[0].room.accentColor);
const accentTargetColor = new THREE.Color();

function AccentLight({ shot }: { shot: Shot }) {
  const ref = useRef<THREE.DirectionalLight>(null);
  useFrame((_, delta) => {
    const room = ACTS[stage.act].room;
    const damp = 1 - Math.exp(-delta * (stage.cut ? 60 : 4));
    accentTargetPos.set(...room.accent);
    accentPos.lerp(accentTargetPos, damp);
    accentTargetColor.set(room.accentColor);
    accentColor.lerp(accentTargetColor, damp);
    const l = ref.current;
    if (!l) return;
    l.position.copy(accentPos);
    l.color.copy(accentColor);
    l.intensity = room.accentPower * (0.25 + 0.75 * shot.cool) * stage.reveal;
  });
  return <directionalLight ref={ref} position={ACTS[0].room.accent} color="#7189b8" intensity={0} />;
}

/* ── Scene mood: env intensity breathes with the chapters; background and
      fog track the page's section tone (window.__tone). ─────────────────── */

const moodCurrent = new THREE.Color("#0a0a0b");
const moodTarget = new THREE.Color("#0a0a0b");

function SceneMood({ shot }: { shot: Shot }) {
  const scene = useThree((s) => s.scene);
  useFrame((_, delta) => {
    scene.environmentIntensity =
      (1 + 0.3 * shot.warm + 0.12 * shot.cool - 0.45 * (1 - shot.lamp)) * (0.25 + 0.75 * stage.reveal);
    const tone = window.__tone;
    if (tone) moodTarget.set(tone);
    moodCurrent.lerp(moodTarget, 0.05);
    if (scene.background instanceof THREE.Color) scene.background.copy(moodCurrent);
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      fog.color.copy(moodCurrent);
      const room = ACTS[stage.act].room;
      const damp = 1 - Math.exp(-delta * 3);
      fog.near += (room.fog[0] - fog.near) * damp;
      fog.far += (room.fog[1] - fog.far) * damp;
    }
  });
  return null;
}

/* ── Atmosphere: two depths of dust drifting through the cone ───────────── */

let dustTexture: THREE.CanvasTexture | null = null;
function getDustTexture() {
  if (dustTexture) return dustTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  dustTexture = new THREE.CanvasTexture(c);
  return dustTexture;
}

function Dust({
  count,
  size = 0.02,
  opacity = 0.5,
  slow = 1,
  spread = 1,
}: {
  count: number;
  size?: number;
  opacity?: number;
  slow?: number;
  spread?: number;
}) {
  const points = useRef<THREE.Points>(null);
  const velocity = useRef(0);
  const sprite = useMemo(getDustTexture, []);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const h = Math.random();
      const r = (1 - h) * 1.7 * spread * Math.sqrt(Math.random());
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = 0.15 + h * 3.4;
      positions[i * 3 + 2] = 0.6 + Math.sin(a) * r;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, seeds };
  }, [count, spread]);

  useFrame((state, delta) => {
    const mesh = points.current;
    if (!mesh) return;
    const scrollVel = (window.__lenisVelocity ?? 0) * 0.15;
    velocity.current = velocity.current * 0.92 + scrollVel * 0.08;

    const attr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    const drift = delta * slow;
    for (let i = 0; i < count; i++) {
      const seed = seeds[i];
      const x = attr.getX(i);
      const z = attr.getZ(i);
      let y = attr.getY(i);
      const cx = Math.sin(y * 1.6 + t * 0.22 + seed) * Math.cos(z * 1.1 + seed);
      const cz = -Math.cos(y * 1.3 + t * 0.18 + seed) * Math.sin(x * 0.9);
      const cy = Math.sin(x * 1.2 + t * 0.15) * Math.cos(z * 1.4 + seed) * 0.4;
      y += (cy * 0.045 - 0.05 - 0.02 * Math.sin(seed)) * drift - velocity.current * delta * 0.05;
      if (y < 0.12) y = 2.6 + Math.random() * 0.8;
      attr.setY(i, y);
      attr.setX(i, x + cx * drift * 0.05);
      attr.setZ(i, z + cz * drift * 0.05);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffd9ad"
        size={size}
        map={sprite}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Polished-concrete floor ────────────────────────────────────────────── */

function Floor({ resolution }: { resolution: number }) {
  if (resolution === 0) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[30, 48]} />
        <meshStandardMaterial color="#08080a" roughness={0.3} metalness={0.2} envMapIntensity={1} />
      </mesh>
    );
  }
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={resolution}
        mixBlur={1}
        mixStrength={55}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0a0a"
        metalness={0.5}
        mirror={0}
      />
    </mesh>
  );
}

/* ── Studio rig ─────────────────────────────────────────────────────────── */

/**
 * The studio rig — and the single biggest lever on whether the paint looks
 * photographed or rendered.
 *
 * A car body is a mirror. What sells it is not the light LEVEL, it is what
 * there is to reflect: a real shop ceiling is a run of strip lights with dark
 * gaps between them, and that alternation is what draws the long highlight
 * down a flank and breaks it into segments the way every car photograph does.
 * Three big soft panels give a smooth, plasticky sheen; a LADDER of strips
 * gives chrome and clearcoat something to bite on.
 *
 * All of it is procedural — baked once at frames={1}, zero bytes downloaded.
 * The obvious alternative was the HDRI the reference site ships, but a 1–2 MB
 * environment map on a 320px phone buys a reflection nobody can see at that
 * size; this buys most of the same read for nothing.
 */
function StudioRig({ mobile }: { mobile: boolean }) {
  // A phone reflects this into ~40 visible pixels of body side; the extra
  // strips are desktop detail and cost env-map render time to bake.
  const strips = mobile ? 3 : 7;
  return (
    <Environment resolution={mobile ? 128 : 256} frames={1}>
      {/* the ceiling run: strip, gap, strip — the segmented highlight */}
      {Array.from({ length: strips }, (_, i) => {
        const t = i / (strips - 1);
        return (
          <Lightformer
            key={i}
            intensity={i % 2 === 0 ? 3.4 : 1.8}
            color={i % 2 === 0 ? "#ffcf9e" : "#ffe3c4"}
            rotation-x={Math.PI / 2}
            position={[0, 5 + (i % 2) * 0.35, -7 + t * 14]}
            scale={[1.25, 2.4, 1]}
          />
        );
      })}
      {/* long cool side highlight, camera side — the body-line streak */}
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#8fa3bd"
        rotation-y={-Math.PI / 2}
        position={[9, 1.4, 0]}
        scale={[9, 0.8, 1]}
      />
      {/* a second, dimmer side strip low down: catches the rocker and the
          wheel lips, which is where a real shop's floor bounce lands */}
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#ffb066"
        rotation-y={-Math.PI / 2}
        position={[7.5, 0.35, 1.5]}
        scale={[6, 0.35, 1]}
      />
      <Lightformer
        form="circle"
        intensity={1.2}
        color="#ffb066"
        rotation-y={Math.PI / 2}
        position={[-8, 2, -2]}
        scale={[3, 3, 1]}
      />
      {/* dark card opposite the key: without something BLACK to reflect, a
          clearcoat has no contrast and reads as flat plastic */}
      <Lightformer
        form="rect"
        intensity={0.05}
        color="#05050a"
        rotation-y={Math.PI / 2}
        position={[-6.5, 2.4, 3]}
        scale={[7, 4, 1]}
      />
    </Environment>
  );
}

/* ── Film pass: grain + scroll-velocity chromatic aberration ────────────── */

const filmFrag = /* glsl */ `
  uniform float uShift;
  uniform float uTime;
  uniform float uGrain;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 dir = normalize(uv - 0.5 + vec2(0.0001));
    float r = texture2D(inputBuffer, uv + dir * uShift).r;
    float b = texture2D(inputBuffer, uv - dir * uShift).b;
    vec3 col = vec3(r, inputColor.g, b);
    float g = fract(sin(dot(uv + fract(uTime), vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * uGrain;
    outputColor = vec4(col, inputColor.a);
  }
`;

class FilmEffectImpl extends Effect {
  constructor(grain: number) {
    super("FilmEffect", filmFrag, {
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map<string, THREE.Uniform>([
        ["uShift", new THREE.Uniform(0)],
        ["uTime", new THREE.Uniform(0)],
        ["uGrain", new THREE.Uniform(grain)],
      ]),
    });
  }
}

function FilmPass({ mobile }: { mobile: boolean }) {
  const effect = useMemo(() => new FilmEffectImpl(mobile ? 0.035 : 0.042), [mobile]);
  useFrame((state) => {
    const uShift = effect.uniforms.get("uShift")!;
    const target = Math.min(Math.abs(window.__lenisVelocity ?? 0) * 0.00028, 0.002);
    uShift.value += (target - uShift.value) * 0.12;
    effect.uniforms.get("uTime")!.value = state.clock.elapsedTime;
  });
  return <primitive object={effect} dispose={null} />;
}

/* ── Camera rig ─────────────────────────────────────────────────────────── */

const desired = new THREE.Vector3();
const desiredLook = new THREE.Vector3();
const currentLook = new THREE.Vector3(0, 0.7, 0);
const fitPoint = new THREE.Vector3();
const fitOffset = new THREE.Vector3();
const probe = new THREE.Vector3();
const lookAim = new THREE.Vector3();

/**
 * PHONE FRAMING: give the car the top of the frame and the copy the bottom.
 *
 * A portrait phone cannot hold a 5 m car AND a paragraph in the same band, and
 * centring both put the type straight on the bodywork — which fought the whole
 * point of making the cars stand out. Aiming the camera BELOW the car lifts it
 * into the upper part of the frame and leaves a clean lower third for the
 * copy. Expressed as a fraction of the VISIBLE height at the current distance,
 * not a world offset, so it shifts by the same proportion of the screen at
 * every act, aspect and camera distance.
 */
function phoneLookDrop(camera: THREE.PerspectiveCamera, centre: THREE.Vector3) {
  const dist = camera.position.distanceTo(centre);
  const visibleH = 2 * dist * Math.tan((camera.fov * Math.PI) / 360);
  return visibleH * 0.19;
}

/**
 * How close the car comes to the edge of the frame, as the largest |NDC| over
 * its eight box corners: below 1 the whole car is inside, above 1 it is being
 * cropped. Published on window.__film so the verification script asserts
 * framing exactly rather than guessing from pixels — on a dark scene with a
 * lit floor, "count the non-background pixels" says the whole frame is
 * subject and proves nothing.
 */
function cornerEdge(camera: THREE.PerspectiveCamera, half: THREE.Vector3, centre: THREE.Vector3) {
  camera.updateMatrixWorld();
  let worst = 0;
  for (let i = 0; i < 8; i++) {
    probe
      .set(i & 1 ? half.x : -half.x, i & 2 ? half.y : -half.y, i & 4 ? half.z : -half.z)
      .add(centre)
      .project(camera);
    worst = Math.max(worst, Math.abs(probe.x), Math.abs(probe.y));
  }
  return worst;
}

/**
 * Compile every shader in the film BEFORE the preloader lifts.
 *
 * MEASURED: on every run, at every width, on both builds, the first scroll
 * froze for 3.1–3.3 SECONDS at about y=450 — one stall, always in the same
 * place, always the moment act I first reveals. That is GLSL compilation. The
 * materials here are not stock: each one is patched through onBeforeCompile
 * with the dissolve/grid chain, so nothing is warm from a cache, and three
 * compiles a program the first time it has to DRAW with it — which is the
 * first frame the visitor scrolls, the worst possible moment.
 *
 * compileAsync walks the graph and builds the programs up front. Two details
 * matter. Acts II and III sit with `visible = false` until their turn, and
 * three only compiles what it would render, so everything is forced visible
 * for the pass and restored afterwards — otherwise two thirds of the stall
 * just moves to the act transitions (which is where the remaining 300–600 ms
 * stalls were coming from). And it must be awaited before the loader hands
 * off, which is the whole point: the client said plainly that if it needs time
 * at the start, take the time.
 */
function ScenePrimer({ onReady }: { onReady?: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    let cancelled = false;

    const prime = async () => {
      /* Wait for all three acts to exist first. Compiling on the frame after
         mount only warmed the empty stage — the cars are built inside a memo
         that runs once the GLTF resolves, so the pass has to hold until their
         meshes are actually in the graph or it compiles nothing that matters.
         Measured: without this the first-scroll freeze only fell 3.3 s -> 2.6 s. */
      const built = () =>
        scene.children.filter((c) => {
          let n = 0;
          c.traverse((o) => {
            if ((o as THREE.Mesh).isMesh) n++;
          });
          return n > 20;
        }).length;
      for (let i = 0; i < 240 && built() < ACTS.length; i++) {
        await new Promise((r) => requestAnimationFrame(r));
        if (cancelled) return;
      }

      const hidden: THREE.Object3D[] = [];
      scene.traverse((o) => {
        if (!o.visible) {
          hidden.push(o);
          o.visible = true;
        }
      });
      try {
        await gl.compileAsync(scene, camera);
        /* AND DRAW ONE FRAME. compileAsync builds the PROGRAMS; it does not
           upload the geometry. Vertex and index buffers go to the GPU the
           first time a mesh is actually drawn, and until first scroll no car
           is drawn at all (they sit at reveal 0), so three uploaded three
           cars' worth of buffers during the opening scroll. Compiling alone
           only moved the freeze 3.3 s -> 2.6 s; the rest was upload. This
           frame costs nothing visually — the loader veil is still over the
           canvas — and it warms every buffer and texture at once. */
        gl.render(scene, camera);
      } catch {
        // A compile failure must not strand the page behind the loader —
        // the film still plays, it just pays the stall it used to pay.
      }
      for (const o of hidden) o.visible = false;
      if (!cancelled) onReady?.();
    };

    // One frame of grace so the act groups have mounted and been fitted.
    const id = requestAnimationFrame(() => void prime());
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [gl, scene, camera, onReady]);

  return null;
}

function Rig({ mobile }: { mobile: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const pointer = useThree((s) => s.pointer);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const armed = useRef(false);

  useFrame((_, delta) => {
    const keys = ACTS[stage.act].keys;
    const t = THREE.MathUtils.clamp(stage.t, 0, keys.length - 1);
    const seg = Math.min(Math.floor(t), keys.length - 2);
    const local = t - seg;

    desired.lerpVectors(keys[seg][0], keys[seg + 1][0], local);
    desiredLook.lerpVectors(keys[seg][1], keys[seg + 1][1], local);

    // Small pointer parallax so the frame never sits dead.
    desired.x += pointer.x * 0.18;
    desired.y += pointer.y * 0.1;

    // A cut is a cut: on the frame the act changes the stage is empty, so the
    // camera teleports rather than swinging through the void.
    if (stage.cut || !armed.current) {
      armed.current = true;
      camera.position.copy(desired);
      currentLook.copy(desiredLook);
    } else {
      const damp = 1 - Math.exp(-delta * 7);
      camera.position.lerp(desired, damp);
      currentLook.lerp(desiredLook, damp);
    }

    /* THE FRAMING GUARANTEE. Rather than three hand-tuned phone constants,
       solve for the distance that provably contains this act's eight box
       corners at the live FOV and aspect, and push the camera out to it if it
       sits closer. Applied to the DAMPED position, not the target: clamping
       the target still lets the eased camera cut the corner and clip the nose
       mid-move, which is exactly the frame a phone screenshots. Whole car, in
       frame, every viewport, all three models, every frame. */
    fitPoint.set(0, CENTRE_Y[stage.act], 0);
    const need = fitDistance(
      HALF[stage.act],
      fitPoint,
      camera.position,
      camera.fov,
      camera.aspect,
      mobile ? 1.03 : 1.05,
    );
    fitOffset.copy(camera.position).sub(fitPoint);
    const d = fitOffset.length();
    if (d < need) {
      fitOffset.multiplyScalar(need / Math.max(d, 0.001));
      camera.position.copy(fitPoint).add(fitOffset);
    }
    lookAim.copy(currentLook);
    if (mobile) lookAim.y -= phoneLookDrop(camera, fitPoint);
    camera.lookAt(lookAim);

    /* The analytic step above assumes the camera looks at the box centre, and
       these keyframes deliberately do not — they aim past the nose, down the
       flank, over the roof. So finish the job against the REAL projection:
       measure the worst corner and push out proportionally. Projected size
       falls off as 1/distance, which makes e/target a Newton step that lands
       inside tolerance in two passes. */
    // A portrait phone is the binding case: the car's LENGTH has to fit the
    // frame's WIDTH, so it can never fill much of a tall frame — which makes
    // every per cent of margin worth having. 0.96 keeps a hair of air at the
    // widest corner and nothing more.
    const target = mobile ? 0.96 : 0.95;
    for (let i = 0; i < 3; i++) {
      const edge = cornerEdge(camera, HALF[stage.act], fitPoint);
      if (edge <= target) break;
      fitOffset
        .copy(camera.position)
        .sub(fitPoint)
        .multiplyScalar(Math.min(2.5, edge / target));
      camera.position.copy(fitPoint).add(fitOffset);
      // Re-aim with the SAME phone drop, or the corner check would verify a
      // framing the renderer never uses.
      lookAim.copy(currentLook);
      if (mobile) lookAim.y -= phoneLookDrop(camera, fitPoint);
      camera.lookAt(lookAim);
    }

    window.__film = {
      stage,
      half: HALF,
      centreY: CENTRE_Y,
      camera: [camera.position.x, camera.position.y, camera.position.z],
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      edge: cornerEdge(camera, HALF[stage.act], fitPoint),
      /* The scene graph itself. `edge` proves the car is FRAMED, which is not
         the same claim as the car being VISIBLE — act II shipped for weeks with
         a perfect edge score and nothing on screen, and no beat screenshot
         caught it because the assertion could not express the difference.
         Handing out the live objects lets a probe read visibility, materials
         and light intensities instead of inferring them. R3F 9 no longer
         exposes its store on the canvas element, so this is the only handle. */
      three: { scene, camera, gl },
    };
  });

  return null;
}

/* ── The canvas ─────────────────────────────────────────────────────────── */

const DESKTOP_LEVELS = [
  { dpr: 1, refl: 0, dust: 160 },
  { dpr: 1.1, refl: 256, dust: 160 },
  { dpr: 1.25, refl: 384, dust: 320 },
  { dpr: 1.5, refl: 512, dust: 320 },
];
const MOBILE_LEVELS = [
  { dpr: 0.85, refl: 0, dust: 0 },
  { dpr: 1, refl: 0, dust: 0 },
  { dpr: 1.15, refl: 0, dust: 0 },
  { dpr: 1.3, refl: 0, dust: 0 },
];

const MOBILE_FOV = 42;

export function HeroScene({
  shot,
  mobile,
  active = true,
  onReady,
}: {
  shot: Shot;
  mobile: boolean;
  active?: boolean;
  /** Fires once every shader is compiled — the preloader waits on this. */
  onReady?: () => void;
}) {
  /* Fixed for the session — see the note where PerformanceMonitor used to be.
     Tier 2, not 3, everywhere: the client's machine stuttered on tier 3 and
     tier 2 keeps everything the art direction needs ("rich" gates at >= 2),
     trading a 512 reflection buffer for 384 — a difference that shows on a
     profiler and not on a screen. */
  const quality = 2;
  const levels = mobile ? MOBILE_LEVELS : DESKTOP_LEVELS;
  const level = levels[quality];
  /* Resolved once and never again — see the note on <Canvas dpr>. Capped
     below the device ratio because a 3x phone screen at full ratio is nine
     times the fragments for a difference nobody can see at arm's length. */
  const fixedDpr = useRef(
    // 1.15 cap everywhere: dropping the desktop cap from 1.25 cuts ~17% of
    // every fragment in every pass, and at these viewing sizes the difference
    // is invisible next to the smoothness it buys on a slower machine.
    Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, 1.15),
  ).current;
  // "Rich" gates the couture extras — flake sparkle, streak sprites, near
  // motes, the densest point clouds: desktop AND the top two levels only.
  const rich = !mobile && quality >= 2;

  return (
    <Canvas
      /* FIXED dpr, chosen once. It used to come from the quality tier, and a
         dpr change reallocates the drawing buffer: the canvas is destroyed at
         one resolution and rebuilt at another, which the eye reads as a flash
         and a sudden softness. Measured at 390px, the backing store dropped
         507x1097 -> 331x717 mid-scroll — that IS the "pulsating", and no
         amount of hysteresis hides a resolution change this large.
         Quality still adapts, but only through things that cost frames without
         touching the buffer: reflection resolution and dust counts below. */
      dpr={fixedDpr}
      frameloop={active ? "always" : "never"}
      camera={{ fov: mobile ? MOBILE_FOV : 32, near: 0.1, far: 60, position: [5.1, 1.15, 1.7] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      className="!absolute !inset-0"
      aria-hidden="true"
    >
      {/* QUALITY ONLY EVER GOES DOWN, AND ONLY ONCE.
          Each tier carries a different dpr, and changing dpr reallocates the
          drawing buffer — the canvas is destroyed at one resolution and
          recreated at another, which reads as a flash and a softness pop. A
          monitor that can both decline AND incline will therefore oscillate
          around whatever framerate the device happens to hover at: measured on
          a 390px run, the backing store went 507x1097 -> 331x717 mid-scroll,
          and that is the "pulsating". Climbing back up buys a little sharpness
          and costs another visible pop, so it is gone. Descending is kept —
          a phone that genuinely cannot hold the framerate still needs relief —
          but `settled` makes it a one-way door. */}
      {/* THE TIER IS CHOSEN ONCE AND FROZEN. No PerformanceMonitor.
          Three separate problems all came out of adapting quality mid-scroll,
          and none of them are fixable by tuning the thresholds:

          1. Every tier carries a different dpr, and changing dpr reallocates
             the drawing buffer — measured at 390px as 507x1097 -> 331x717
             mid-scroll. That is the "pulsating".
          2. The bounds could not hold. drei's monitor divides FRAME COUNT by
             the window duration rather than counting intervals, so a healthy
             60 Hz display reports ~64 fps — above the old upper bound of 58 —
             and `onIncline` fired forever, alternating with declines.
          3. Worse, the EffectComposer's render targets are only resized from
             `useThree().size`, which is in CSS pixels and does NOT change when
             dpr does. So after a tier change the composer kept shading at the
             ORIGINAL resolution and merely blitted the result down: the drop
             saved no fragment work, the framerate never recovered, the monitor
             kept declining, and after four flip-flops it slammed to the lowest
             tier for the rest of the session.

          Every tier change is also discontinuous by construction — Floor swaps
          material class and Dust re-randomises its positions when `count`
          changes — so there is no smooth version of this. A fixed tier is both
          steadier and, given (3), usually faster. */}
      <Director shot={shot} />
      <ScenePrimer onReady={onReady} />
      <color attach="background" args={["#0a0a0b"]} />
      <fog attach="fog" args={["#0a0a0b", 9, 22]} />

      {/* Ambient lifted 0.22 -> 0.4 and warmed a step. "Edge highlight only,
          large areas genuinely dark" was the brief, but it had a failure mode
          nobody drew: act II's raised HOOD is a car-sized flat panel whose
          camera side faces AWAY from every light in the rig, and at 0.22 of a
          dark blue it rendered as a pure black slab covering most of the
          frame — indistinguishable from the missing-model bug. A night shot
          still needs its unlit planes to READ as planes; this is the level
          where they do and the shadows still feel like night. */}
      <ambientLight color="#39404c" intensity={0.4} />
      <spotLight
        position={[0.4, 5.2, -7.6]}
        color="#ffb066"
        intensity={250}
        angle={0.42}
        penumbra={1}
        decay={2}
        distance={0}
      />
      {/* 0.35 -> 0.55: the cool fill is what reaches the planes the lamp
          cannot — see the ambient note above. */}
      <directionalLight position={[-5, 2.2, 4.5]} color="#516078" intensity={0.55} />
      {/* And a second fill from the OPPOSITE quarter, high and behind camera
          for the top-down beats: the act II hood faces almost straight up at
          the dolly's top, and both existing lights sit in front of it. */}
      <directionalLight position={[4.5, 6.5, 5.5]} color="#4a5566" intensity={0.4} />

      {ACTS.map((act, i) => (
        <ActBoundary key={act.url}>
          <ActStage index={i} act={act} rich={rich} shot={shot} />
        </ActBoundary>
      ))}

      <WorkLamp shot={shot} rich={rich} />
      {!mobile && <AccentLight shot={shot} />}
      <SceneMood shot={shot} />
      {level.dust > 0 && <Dust count={level.dust} />}
      {rich && level.dust > 0 && (
        <Dust count={Math.round(level.dust / 4)} size={0.058} opacity={0.26} slow={0.45} spread={1.18} />
      )}
      <Floor resolution={mobile ? 0 : level.refl} />
      <StudioRig mobile={mobile} />

      {/* MSAA on desktop. The renderer runs antialias:false (the composer owns
          the buffer, so the canvas setting does nothing) and multisampling was
          0 — meaning every silhouette was hard-aliased. On a dark car against
          flat white that stair-stepped edge is the single loudest "cheap
          WebGL" tell on the page, louder than any material. 4x on desktop
          only; phones stay at 0 where the extra buffer is not affordable and
          the DPR already hides most of it. */}
      {/* MSAA OFF, everywhere, permanently. At multisampling 2 the composer's
          MSAA resolve left a large axis-aligned region of the frame entirely
          unresolved — a hard-edged slab of raw background covering most of
          act II, found by bisection after four wrong theories (it survived
          hiding every object in the scene, because it was never scene
          content). 4x had shipped without visible artefacts but at real cost;
          0 is both artefact-free and the cheapest option on the client's
          hardware, and at dpr 1.15 under grain + bloom the silhouettes hold
          without it. Bloom mips 8 -> 6: levels past 6 only widen a glow the
          grade reads as haze. */}
      <EffectComposer multisampling={0}>
        {[
          <Bloom
            key="bloom"
            mipmapBlur
            intensity={0.85}
            luminanceThreshold={1}
            luminanceSmoothing={0.08}
            radius={0.72}
            levels={mobile ? 5 : 6}
          />,
          ...(mobile
            ? []
            : [
                <FilmPass key="film" mobile={mobile} />,
                <Vignette key="vignette" offset={0.28} darkness={0.62} />,
              ]),
          /* The composer DISABLES the renderer's own tone mapping and expects
             the chain to do it — and the chain never did. Confirmed live:
             gl.toneMapping read 0 on both builds. Every HDR value has been
             clipping straight to white, which is why highlights blow into
             hard slabs and why every bright transient reads as a FLASH.
             ACES rolls the top end off — same energy, no clipping. */
          <ToneMapping key="tone" mode={ToneMappingMode.ACES_FILMIC} />,
        ]}
      </EffectComposer>

      <Rig mobile={mobile} />
    </Canvas>
  );
}

export default HeroScene;
