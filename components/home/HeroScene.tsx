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
 * "Three cars, bay door open" — the WebGL film on the site, DAYLIGHT version.
 *
 * Three acts, three vehicles, three white rooms. Each act CUTS: the outgoing
 * car dissolves upward into its own surface points and blows away, the cyc
 * sits empty for a beat, the camera cuts to a new arc, and the next car
 * precipitates back out of the air — a lattice of graphite points falling
 * into place from the floor up while a RED dissolve front sweeps the bodywork
 * in behind them. On white the reveal reads as ink resolving onto paper; the
 * dark sibling reads as light. Same film, opposite physics.
 *
 *   ACT I    2015 Dodge Challenger      speed red, full white box
 *   ACT II   1972 coupe, hood up        copper over primer, harder key
 *   ACT III  1960s pickup               patina teal, cool overcast rim
 *
 * Everything is driven from OUTSIDE by a single scrubbed float `shot.film`
 * (0 → 3). The Director derives act, reveal and camera time from it, so the
 * cut ALWAYS lands on the frame where the stage is empty.
 */

export type Shot = {
  /** 0 → 3. One unit per act. The whole film in one number. */
  film: number;
  flare: number;
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
  /** Body colour — on white this is the darkest, richest thing in frame. */
  paint: string;
  /** Multiplier on the car's own tail-lens emissives (the bloom sources). */
  lampBoost: number;
  /** [position, lookAt] per camera keyframe — four per act. */
  keys: Array<[THREE.Vector3, THREE.Vector3]>;
  /** The room: how the white box is lit for this act. */
  room: {
    ambient: number;
    key: [number, number, number];
    keyPower: number;
    keyAngle: number;
    keyColor: string;
    fill: [number, number, number];
    fillPower: number;
    fillColor: string;
    /** Paper tone: cyc + fog colour for this act. */
    paper: string;
    fog: [number, number];
  };
  /** Colour of the incoming point cloud, and of the dissolve edge. */
  spark: string;
  hot: string;
  /** Drafting-ink colour of the lattice the car is built out of. */
  grid: string;
  /** Grid cell size in metres. */
  gridCell: number;
  roleOf: (name: string, mat: THREE.MeshStandardMaterial) => Role;
};

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

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
    // ACT I — the finished car, in the white box.
    url: "/models/hero/challenger.glb",
    length: 4.7,
    paint: "#7a1717",
    lampBoost: 1,
    keys: [
      [v3(5.1, 1.15, 1.7), v3(0, 0.7, 0)],
      [v3(2.6, 0.68, 5.0), v3(0, 0.62, 0.7)],
      [v3(-5.8, 1.3, -5.3), v3(0, 0.62, -0.4)],
      [v3(2.2, 3.1, 7.6), v3(0.4, 1.2, 0.2)],
    ],
    room: {
      ambient: 0.36,
      key: [2.6, 6.4, 3.4],
      keyPower: 200,
      keyAngle: 0.55,
      keyColor: "#ffffff",
      fill: [-5, 2.2, 4.5],
      fillPower: 0.5,
      fillColor: "#eef1f5",
      paper: "#fafaf8",
      // Fog starts BEYOND the car. It was at 11 while the measured phone
      // camera sits 15-17m out, so every small screen was blending the body
      // ~30-48% into the paper before any material even mattered — the single
      // biggest reason the cars read as washed out. It still has to hide the
      // 50x50 floor plane's edge at ~25m, hence 19-32 rather than infinity.
      fog: [19, 32],
    },
    spark: "#3a3d42",
    hot: "#c8321f",
    grid: "#2f4a7a",
    gridCell: 0.15,
    roleOf: (name) => byName(name) ?? (name.includes("body") || name === "middle" ? "paint" : "trim"),
  },
  {
    // ACT II — hood up. Harder, warmer key raking across bare primer.
    url: "/models/hero/coupe-hoodup.glb",
    length: 4.9,
    paint: "#8a4210",
    lampBoost: 0.85,
    keys: [
      [v3(4.9, 0.72, 3.9), v3(0, 0.8, 0.5)],
      [v3(2.3, 2.5, 3.0), v3(0, 1.0, 1.0)],
      [v3(-1.4, 3.5, 3.6), v3(0, 0.95, 0.7)],
      [v3(-6.4, 1.45, 4.4), v3(0, 0.78, 0)],
    ],
    room: {
      ambient: 0.30,
      key: [1.4, 5.6, 2.2],
      keyPower: 245,
      keyAngle: 0.42,
      keyColor: "#fff2df",
      fill: [-4.5, 2.6, 5.0],
      fillPower: 0.34,
      fillColor: "#f2ece1",
      paper: "#f6f4ef",
      fog: [19, 32],
    },
    spark: "#4a3a2c",
    hot: "#c8321f",
    grid: "#33507f",
    gridCell: 0.155,
    roleOf: (name, mat) => {
      const named = byName(name);
      if (named) return named;
      if (name === "body" || name === "details 6.001") return "paint";
      return mat.color.r * 0.3 + mat.color.g * 0.6 + mat.color.b * 0.1 < 0.03 ? "rubber" : "primer";
    },
  },
  {
    // ACT III — the driver. Flat overcast off the open bay door, cooler paper.
    url: "/models/hero/charger.glb",
    length: 4.95,
    paint: "#1d4a48",
    lampBoost: 0.5,
    keys: [
      [v3(5.2, 1.55, 4.8), v3(0, 1.0, 0.2)],
      [v3(2.1, 0.52, 6.0), v3(0, 0.9, 0.5)],
      [v3(-5.4, 1.1, 3.6), v3(0, 0.95, 0)],
      [v3(-3.6, 3.3, -5.4), v3(0, 1.0, -0.2)],
    ],
    room: {
      ambient: 0.42,
      key: [-2.2, 6.0, 4.4],
      keyPower: 175,
      keyAngle: 0.66,
      keyColor: "#f2f7fc",
      fill: [5.5, 2.4, -4.0],
      fillPower: 0.85,
      fillColor: "#dce6f2",
      paper: "#f4f6f7",
      fog: [20, 34],
    },
    spark: "#2f3a3e",
    hot: "#c8321f",
    grid: "#2c5a56",
    gridCell: 0.165,
    // The Charger names its materials plainly: red_chasis is the body,
    // roof_black the vinyl top, metalic the brightwork, red_light the lenses.
    // The body keeps its own map and gets tinted — patina, not a respray.
    roleOf: (name) => {
      const named = byName(name);
      if (named) return named;
      // Painted, not tinted: this body carries no texture to preserve, and
      // lerping its stock red 60% toward teal produced a muddy mauve that
      // read as neither.
      if (name === "red_chasis") return "paint";
      if (name === "red_light") return "lens";
      if (name === "metalic") return "chrome";
      // `grey` is the inner fender and wheel-well structure — left as trim it
      // reads as a pale bowl under each arch.
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

const BRAKE_RED = new THREE.Color("#ff2222");

/* ── The Director: one scrubbed float in, the whole film out ────────────── */

const stage = { act: 0, local: 0, reveal: 0, t: 0, cut: false };

/* Published for the verification script (scripts/film-shots.js): which act is
   up, how far the reveal has assembled, and each act's fitted box. Reading the
   real numbers off the running page is the only way to prove "the whole car is
   in frame" instead of squinting at a screenshot. */
declare global {
  interface Window {
    __film?: {
      stage: typeof stage;
      half: THREE.Vector3[];
      centreY: number[];
      camera: [number, number, number];
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

/* If a GLB request 502s or is cut off, useGLTF's promise rejects and the
   suspended act THROWS on retry — without a boundary that unmounts the entire
   app tree and bricks the page behind the preloader. With it, the film simply
   plays that act without its car: cyc, floor, beam, copy. */
class ActBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* ── One act: the car, its AO pool, its point cloud, its dissolve ───────── */

let aoTexture: THREE.CanvasTexture | null = null;
function getAoTexture() {
  if (aoTexture) return aoTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  /* THE CONTACT SHADOW does more separation work on a white cyc than any
     light does — it is what makes the car read as SITTING on something
     instead of floating in front of it. Tightened (density now holds out to
     0.4 of the radius rather than bleeding straight from the centre) and
     deepened from 0.55 to 0.78. */
  const g = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
  g.addColorStop(0, "rgba(8,8,10,0.78)");
  g.addColorStop(0.4, "rgba(8,8,10,0.52)");
  g.addColorStop(0.72, "rgba(8,8,10,0.18)");
  g.addColorStop(1, "rgba(8,8,10,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  aoTexture = new THREE.CanvasTexture(c);
  return aoTexture;
}

/**
 * The scan sheet: one quad sitting exactly at the build height, fading out
 * toward its own edges. Without it the grid front reads as an accident of the
 * shader; with it there is visibly a scanner passing through the car. Drawn
 * as ink rather than light — on paper an additive sheet is invisible.
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
    () => ({ uColor: { value: new THREE.Color(color) }, uAlpha: { value: 0 } }),
    [color],
  );

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const d = diss.uDiss.value;
    const live = Math.min(1, Math.max(0, Math.sin(Math.PI * THREE.MathUtils.clamp(d, 0, 1))));
    uniforms.uAlpha.value = live * 0.22;
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

function ActStage({
  index,
  act,
  flake,
  shot,
}: {
  index: number;
  act: Act;
  flake: boolean;
  shot: Shot;
}) {
  const { scene } = useGLTF(act.url, DRACO);
  const group = useRef<THREE.Group>(null);
  const pool = useRef<THREE.MeshBasicMaterial>(null);
  const taillights = useRef<THREE.MeshStandardMaterial[]>([]);

  /* THE UNIFORMS LIVE IN REFS, NOT IN THE MEMO — and this is not a style
     choice. React re-invokes a useMemo factory (StrictMode does it on every
     mount), so a uniform object created inside it can be a DIFFERENT object
     from the one the materials closed over: the frame loop then dutifully
     animates an orphan while the shader reads a uniform stuck at zero, and
     every car renders as a flat cutout with no error anywhere. One stable
     object per act, created once, is the whole fix. */
  // No boost on paper: the edge is a MIX toward brand red, so it bites into
  // the white instead of adding to it — adding anything to paper is white.
  // No boost on paper: the edge is a MIX toward brand red, so it bites into
  // the white instead of adding to it. The lattice is drafting ink for the
  // same reason — on a white cyc the grid has to be DARKER than the sheet,
  // which is the exact inverse of the dark build and the whole reason the two
  // versions read as one idea in two lights.
  const diss = useRef<DissolveUniforms>(
    dissolveUniforms(act.hot, 1, 1.1, 1, {
      cell: act.gridCell,
      color: act.grid,
      gain: 0.9,
    }),
  ).current;
  const flakeU = useRef({ value: 0 }).current;
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
    flakeU.value = flake ? 0.055 : 0;
  }, [flake, flakeU]);

  const built = useMemo(() => {
    const build = fitStage(scene, act.length);
    const fit = build.fit;
    HALF[index].copy(fit.half);
    CENTRE_Y[index] = fit.height / 2;
    diss.uDissH.value = Math.max(fit.height, 0.001);

    const brakes: THREE.MeshStandardMaterial[] = [];
    const swapped = new Map<THREE.Material, THREE.Material>();
    // Synchronous — the mobile flag settles one render late and this memo must
    // never re-run against already-swapped materials.
    const phone = window.matchMedia("(max-width: 767px)").matches;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      const rebuilt = list.map((entry) => {
        const source = entry as THREE.MeshStandardMaterial;
        if (!source?.isMeshStandardMaterial) return entry;
        const cached = swapped.get(entry);
        if (cached) return cached;

        const name = source.name.toLowerCase();
        const role = act.roleOf(name, source);
        let next: THREE.Material;

        switch (role) {
          case "lamp":
            // Daylight: headlights are OFF — clear silvery lenses that catch
            // the light-box like glass jewellery. No emissive here.
            next = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#c9ccd0"),
              metalness: 0.65,
              roughness: 0.12,
              envMapIntensity: 1.5,
            });
            break;
          case "lens": {
            // THE bloom sources: red lenses burning against white. Only these
            // cross the luminance-1 threshold, so only these ever bloom.
            const lens = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#2a0808"),
              emissive: BRAKE_RED.clone(),
              emissiveIntensity: 1.25,
              roughness: 0.25,
              metalness: 0.1,
            });
            brakes.push(lens);
            next = lens;
            break;
          }
          case "paint": {
            // The paint carries the WHOLE frame — the darkest, richest object
            // on white, under a hard clearcoat, with a fresnel candy shift.
            /* envMapIntensity 1.7 → 0.95. In a white light-box the environment
               IS white, so a high env intensity was washing every panel toward
               the background — the body was literally reflecting the thing it
               needed to stand out from. Lower env + lower roughness keeps the
               specular HIGHLIGHTS (which read as gloss) while letting the base
               colour hold its own value. */
            /* clearcoatRoughness 0.06 → 0.17. The env drop above fixed the
               diffuse wash but left the clearcoat a razor mirror, so the hood
               and the flat of the bumper still caught a whole Lightformer
               strip at once and clipped. Spreading the coat keeps the gloss
               reading as gloss and turns a blown slab back into a highlight. */
            const paint = new THREE.MeshPhysicalMaterial({
              name: source.name,
              color: new THREE.Color(act.paint),
              metalness: 0.22,
              roughness: 0.3,
              clearcoat: 1,
              clearcoatRoughness: 0.17,
              envMapIntensity: 0.8,
            });
            // Measured at ~5 fps of mobile scroll at 4x throttle: phones ship
            // the stock physical paint.
            if (!phone) addCandy(paint, flakeU);
            next = paint;
            break;
          }
          case "primer":
            next = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#b9b6ae"),
              roughness: 0.88,
              metalness: 0.08,
              envMapIntensity: 0.9,
            });
            break;
          case "worn": {
            const body = source.clone();
            body.color.lerp(new THREE.Color(act.paint), 0.6);
            body.roughness = 0.44;
            body.metalness = 0.2;
            // 1.5 → 0.95, same reason as chrome and glass: in a white
            // light-box a high env intensity reflects the background the car
            // is supposed to stand out from.
            body.envMapIntensity = 0.95;
            next = body;
            break;
          }
          case "glass":
            // Dark glass stays dark — the contrast anchor against the cyc.
            // It did not, though: at roughness 0.05 and env 1.6 this was a
            // mirror, and the only thing there is to mirror in a white
            // light-box is white. The comment was right and the numbers were
            // fighting it. Rougher and much less env keeps a sharp sliver of
            // highlight and lets the near-black base actually read.
            next = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#101215"),
              metalness: 0.25,
              roughness: 0.14,
              envMapIntensity: 0.8,
            });
            break;
          case "rubber":
            next = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#0c0c0c"),
              roughness: 0.95,
              metalness: 0,
            });
            break;
          case "chrome":
            // THIS is what was blowing the front end out. A canvas-only
            // capture (no DOM) at act III showed the Charger's bumper, grille
            // surround and rockers clipped to pure white while the roof still
            // held its colour — chrome, not paint, was the wash.
            //
            // The old comment already knew ("a mirror finish on a white cyc
            // reflects white and the part disappears") and then set a near-
            // white base at env 1.5, which is precisely that mirror. Real
            // chrome on a white sweep photographs DARK with bright edges,
            // because what it mirrors is the floor and the shadow side, not
            // the sky. So: darker base, rougher, and env well under 1.
            // Second pass: 0.85 was not enough. A metal has no diffuse term at
            // all — every photon it shows comes from the environment — and the
            // front bumper happens to face the two bright side strips that sit
            // behind the camera, so it mirrored them into one blown bar. Env
            // down to 0.5 and a darker base keeps the strip as a bright EDGE
            // on the bumper's crown instead of flooding its whole face.
            next = new THREE.MeshStandardMaterial({
              name: source.name,
              color: new THREE.Color("#616770"),
              roughness: 0.42,
              metalness: 0.9,
              envMapIntensity: 0.5,
            });
            break;
          default: {
            const trim = source.clone();
            trim.flatShading = false;
            trim.color.multiplyScalar(0.85);
            trim.roughness = THREE.MathUtils.clamp(trim.roughness, 0.4, 0.9);
            trim.metalness = Math.min(trim.metalness, 0.6);
            next = trim;
            break;
          }
        }

        addDissolve(next, diss, `2240w-${role}`);
        next.userData.role = role;
        next.needsUpdate = true;
        swapped.set(entry, next);
        return next;
      });

      mesh.material = Array.isArray(mesh.material) ? rebuilt : rebuilt[0];
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      // COLOR_0 is baked ambient occlusion — the Blender pass writes it, and
      // three multiplies base colour by it for free. On a white cyc this is
      // the single biggest thing making the car read as an object rather than
      // a decal: the wheel wells, grille and shut lines get real contact
      // darkening without a shadow map, an AO texture or a second UV set.
      if (mesh.geometry.getAttribute("color") != null) {
        // Gate on the attribute existing: vertexColors against a missing
        // COLOR_0 reads undefined and the mesh renders black.
        for (const m of rebuilt) {
          m.vertexColors = true;
          m.needsUpdate = true;
        }
      }

      // NO RUNTIME WELD. Bodywork used to be welded and re-normalled here
      // because these bodies ship flat-shaded and on a white cyc, where the
      // car is carried entirely by its highlights, faceting is the first thing
      // the eye finds. But the weld is indiscriminate — it smooths every
      // shared edge, so a door shut line went soft along with the quarter
      // panel. Blender's pass (scripts/blender-refine.py) now merges doubles
      // and shades smooth by 40 degrees, which keeps a crease a crease, and
      // every model this scene loads goes through it.
    });

    // The car never moves — only the camera does. Freeze the whole subtree's
    // world matrices so three stops re-walking it every frame.
    scene.updateMatrixWorld(true);
    scene.traverse((child) => {
      child.matrixAutoUpdate = false;
    });

    /* MEASURE THE CAR THAT IS ACTUALLY THERE.
       HALF/CENTRE_Y came from fitStage's own fit box, and the Rig frames the
       shot against those numbers — so an understated fit box yields a camera
       that is too close while NOTHING reports it, because `edge` is computed
       from the same understated box. On the dark sibling that returned a
       comfortable 0.89 for an act rendering as a black wall. Taking the box
       from the real geometry makes the assertion able to fail, which is the
       whole point of having it. Measured here rather than at the top of the
       memo because the world matrices have only just been baked, and before
       the ghost and cloud are added so this is bodywork and nothing else. */
    const realBox = new THREE.Box3().setFromObject(scene);
    if (!realBox.isEmpty()) {
      const rSize = realBox.getSize(new THREE.Vector3());
      const rCentre = realBox.getCenter(new THREE.Vector3());
      HALF[index].set(rSize.x / 2, rSize.y / 2, rSize.z / 2);
      CENTRE_Y[index] = rCentre.y;
    }

    taillights.current = brakes;

    /* THE GRID GHOST — a second draw of the car's own geometry as lines,
       sharing the build front with the surface shader: ahead of the front the
       car exists only as a drafting lattice, at the front the lattice is at
       full ink, behind it the solid has taken over. NORMAL blending here, not
       additive: on paper the grid must darken. */
    const ghostMaterial = gridGhostMaterial(diss, phone ? 0.7 : 0.95);
    ghostMaterial.blending = THREE.NormalBlending;
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

    // The matrix reveal. Points are area-weighted over the SURFACE, so all
    // three cars carry the same density no matter their poly count.
    const cloud = sampleSurface(build, phone ? 7000 : 24000, 2240 + index * 7);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(cloud.target, 3));
    geometry.setAttribute("aStart", new THREE.BufferAttribute(cloud.start, 3));
    geometry.setAttribute("aDelay", new THREE.BufferAttribute(cloud.delay, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(cloud.seed, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);

    cloudU.uSize.value = phone ? 26 : 36;
    // NORMAL blending, not additive: on paper the incoming cloud has to read
    // as ink landing, and anything additive on a white cyc is invisible.
    const cloudMaterial = new THREE.ShaderMaterial({
      vertexShader: cloudVertex,
      fragmentShader: cloudFragment,
      uniforms: cloudU,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    return {
      fit,
      geometry,
      cloudMaterial,
      ghost,
      ghostMaterial,
      // Every material carrying the dissolve chain, so the frame loop can
      // drive the uniforms THROUGH the materials (userData.__dissU) rather
      // than trusting that its own `diss` ref is the object the shaders
      // compiled against — see the orphan-uniform note in lib/stage.ts.
      dissMats: [...new Set(swapped.values())],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- materials must be swapped exactly once per loaded scene; the uniform refs are stable
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
       If the object a shader compiled against ever diverges from `diss`, the
       ref write above animates an orphan and the discard in the dissolve
       keeps the whole car off screen with no error — the invisible-act bug
       found on the dark build. Writing through userData reaches whichever
       object is actually live in each shader. */
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

    // First-scroll brake-light pulse — the daylight version's signature.
    const intensity = (1.25 + shot.flare * 8) * act.lampBoost;
    for (const mat of taillights.current) mat.emissiveIntensity = intensity;
    // The AO pool fades in with the car, or it floats over an empty floor.
    if (pool.current) pool.current.opacity = reveal;
  });

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
        </group>
      </group>
      <ScanSheet half={built.fit.half} diss={diss} color={act.grid} />
      {/* the AO pool — on white, this shadow is what grounds the car */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[built.fit.half.x * 3.2, built.fit.half.z * 2.5]} />
        <meshBasicMaterial
          ref={pool}
          map={getAoTexture()}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Couture paint: fresnel candy hue-mix plus optional metallic flake. */
function addCandy(paint: THREE.MeshPhysicalMaterial, flake: { value: number }) {
  chainCompile(paint, "couture-paint", (shader) => {
    shader.uniforms.uFlake = flake;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWorldPosCF;")
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvWorldPosCF = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform float uFlake;\nvarying vec3 vWorldPosCF;",
      )
      .replace(
        "#include <normal_fragment_maps>",
        /* glsl */ `#include <normal_fragment_maps>
    // flake sparkle: hash-perturbed normal, fixed in the paint (world space)
    if ( uFlake > 0.001 ) {
      vec3 fseed = floor( vWorldPosCF * 520.0 );
      vec3 fn = vec3(
        fract( sin( dot( fseed, vec3( 12.9898, 78.233, 45.164 ) ) ) * 43758.5453 ),
        fract( sin( dot( fseed, vec3( 93.9898, 67.345, 24.123 ) ) ) * 28001.8384 ),
        fract( sin( dot( fseed, vec3( 43.332, 11.135, 53.155 ) ) ) * 34561.2345 )
      ) * 2.0 - 1.0;
      normal = normalize( normal + fn * uFlake );
    }
    // two-tone candy: face-on lift, oxblood roll-off at grazing angles
    {
      float facingCF = saturate( dot( normalize( vViewPosition ), normal ) );
      float fresCF = pow( 1.0 - facingCF, 1.8 );
      diffuseColor.rgb = mix(
        diffuseColor.rgb * ( 1.0 + 0.06 * facingCF ),
        vec3( 0.022, 0.004, 0.006 ),
        fresCF * 0.95
      );
    }`,
      );
  });
}

/* ── The skylight: an analytical near-white beam, no fixture ────────────── */

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
      float breathe = 0.94 + 0.06 * sin(uTime * 2.1) * sin(uTime * 0.63);
      // Barely there: the beam only reads where it crosses the car and the
      // floor reflections — against the white cyc it disappears, as it should.
      float a = fresnel * vertical * breathe * uMul;
      gl_FragColor = vec4(uColor, a);
    }
  `,
};

function Skylight() {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#fff8ec") },
      uTime: { value: 0 },
      uMul: { value: 0.09 },
    }),
    [],
  );
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMul.value = 0.09 * stage.reveal;
  });

  return (
    <group position={[1.15, 3.85, 1.35]} rotation={[0, 0, -0.14]}>
      <pointLight color="#fff4e2" intensity={7} distance={10} decay={2} />
      <mesh position={[0, -2.05, 0]}>
        <coneGeometry args={[2.3, 4.4, 40, 24, true]} />
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

/* ── Dust inside the beam: bright specks, two depths on desktop ─────────── */

let dustSprite: THREE.CanvasTexture | null = null;
function getDustSprite() {
  if (dustSprite) return dustSprite;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  dustSprite = new THREE.CanvasTexture(c);
  return dustSprite;
}

function Dust({
  count,
  size = 0.02,
  opacity = 0.34,
  spread = 1,
  soft = false,
}: {
  count: number;
  size?: number;
  opacity?: number;
  spread?: number;
  soft?: boolean;
}) {
  const points = useRef<THREE.Points>(null);
  const velocity = useRef(0);
  const sprite = useMemo(() => (soft ? getDustSprite() : null), [soft]);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const h = Math.random();
      const r = (1 - h) * 1.45 * spread * Math.sqrt(Math.random());
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = 1.15 + Math.cos(a) * r;
      positions[i * 3 + 1] = 0.15 + h * 3.3;
      positions[i * 3 + 2] = 1.35 + Math.sin(a) * r;
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
    for (let i = 0; i < count; i++) {
      const seed = seeds[i];
      const x = attr.getX(i);
      const z = attr.getZ(i);
      let y = attr.getY(i);
      const cx = Math.sin(y * 1.6 + t * 0.22 + seed) * Math.cos(z * 1.1 + seed);
      const cz = -Math.cos(y * 1.3 + t * 0.18 + seed) * Math.sin(x * 0.9);
      const cy = Math.sin(x * 1.2 + t * 0.15) * Math.cos(z * 1.4 + seed) * 0.4;
      y += (cy * 0.045 - 0.05 - 0.02 * Math.sin(seed)) * delta - velocity.current * delta * 0.05;
      if (y < 0.12) y = 2.6 + Math.random() * 0.8;
      attr.setY(i, y);
      attr.setX(i, x + cx * delta * 0.05);
      attr.setZ(i, z + cz * delta * 0.05);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        map={sprite ?? undefined}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Act moods: the white box re-lit per act, damped across the cut ─────── */

const keyPos = new THREE.Vector3(...ACTS[0].room.key);
const fillPos = new THREE.Vector3(...ACTS[0].room.fill);
const scratchPos = new THREE.Vector3();
const scratchColor = new THREE.Color();
const paperCurrent = new THREE.Color(ACTS[0].room.paper);
const paperTarget = new THREE.Color();

function Mood() {
  const amb = useRef<THREE.AmbientLight>(null);
  const key = useRef<THREE.SpotLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const scene = useThree((s) => s.scene);

  useFrame((_, delta) => {
    const room = ACTS[stage.act].room;
    const damp = 1 - Math.exp(-delta * (stage.cut ? 60 : 4));
    // The room comes up WITH the car: an empty cyc is a blank page, and the
    // reveal should feel like the lights finding the subject.
    const level = 0.35 + 0.65 * stage.reveal;

    if (amb.current) amb.current.intensity = room.ambient * level;
    if (key.current) {
      keyPos.lerp(scratchPos.set(...room.key), damp);
      key.current.position.copy(keyPos);
      key.current.intensity = room.keyPower * level;
      key.current.angle += (room.keyAngle - key.current.angle) * damp;
      key.current.color.lerp(scratchColor.set(room.keyColor), damp);
    }
    if (fill.current) {
      fillPos.lerp(scratchPos.set(...room.fill), damp);
      fill.current.position.copy(fillPos);
      fill.current.intensity = room.fillPower * level;
      fill.current.color.lerp(scratchColor.set(room.fillColor), damp);
    }
    // The kicker rides the reveal like everything else — an edge light on a
    // car that has not arrived is a light on nothing.
    if (rim.current) rim.current.intensity = 2.4 * level;

    // Paper tone: the cyc and the fog are one surface with the page, and it
    // shifts a little per act so the three rooms are not the same white.
    paperTarget.set(room.paper);
    paperCurrent.lerp(paperTarget, 0.05);
    if (scene.background instanceof THREE.Color) scene.background.copy(paperCurrent);
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      fog.color.copy(paperCurrent);
      fog.near += (room.fog[0] - fog.near) * damp;
      fog.far += (room.fog[1] - fog.far) * damp;
    }
    scene.environmentIntensity = 0.5 + 0.5 * stage.reveal;
  });

  return (
    <>
      <ambientLight ref={amb} color="#ffffff" intensity={0.55} />
      <spotLight
        ref={key}
        position={ACTS[0].room.key}
        color="#ffffff"
        intensity={150}
        angle={0.55}
        penumbra={1}
        decay={2}
        distance={0}
      />
      <directionalLight
        ref={fill}
        position={ACTS[0].room.fill}
        color="#eef1f5"
        intensity={0.5}
      />
      {/* THE KICKER — the edge light this scene never had.
          Placed behind and above, opposite the key, it lays a hot specular
          line along the roof, the shoulder and the crown of each fender. On a
          white cyc that line does NOT separate the car from the background
          (nothing bright can) — what it does is separate the car's top
          surfaces from its own flanks, which is the read that makes studio
          car photography look expensive rather than flat. Slightly warm so it
          does not go grey against the cool fill. */}
      <directionalLight ref={rim} position={[-4.5, 6.2, -6.5]} color="#fff6ea" intensity={0} />
    </>
  );
}

/* ── Glossy white studio floor ──────────────────────────────────────────── */

function Floor({ resolution }: { resolution: number }) {
  if (resolution === 0) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[30, 48]} />
        <meshStandardMaterial color="#f6f6f4" roughness={0.32} metalness={0} envMapIntensity={0.8} />
      </mesh>
    );
  }
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      {/* mixStrength 12 → 30. A real reflection under the car is the classic
          premium-product-on-white move: it doubles the car's visual mass and
          anchors it to the floor, where a near-invisible reflection left it
          hovering. Tighter blur so the reflection keeps the body's shape
          rather than smearing into a haze. */}
      <MeshReflectorMaterial
        blur={[200, 70]}
        resolution={resolution}
        mixBlur={0.9}
        mixStrength={30}
        roughness={0.92}
        depthScale={1.1}
        minDepthThreshold={0.3}
        maxDepthThreshold={1.3}
        color="#eeeeec"
        metalness={0}
        mirror={0}
      />
    </mesh>
  );
}

/* ── Studio rig: Lightformer light-box baked once (frames=1 ≈ free) ─────── */

function StudioRig({ mobile }: { mobile: boolean }) {
  return (
    <Environment resolution={mobile ? 128 : 256} frames={1}>
      <Lightformer
        intensity={2.6}
        color="#ffffff"
        rotation-x={Math.PI / 2}
        position={[0, 6, 0]}
        scale={[10, 10, 1]}
      />
      {/* THE CEILING RUN — the single biggest lever on whether the paint looks
          photographed or rendered. A car body is a mirror; what sells it is
          not the light LEVEL but what there is to reflect. A real studio
          ceiling is strips with gaps, and that alternation is what breaks the
          long highlight down a flank into segments the way every car
          photograph does. One broad panel gives a smooth plastic sheen.
          Procedural, baked once at frames={1}, zero bytes downloaded — the
          alternative was a 1–2 MB HDRI that a 320px phone cannot resolve. */}
      {Array.from({ length: 7 }, (_, i) => (
        <Lightformer
          key={i}
          intensity={i % 2 === 0 ? 4.5 : 2.4}
          color="#ffffff"
          rotation-x={Math.PI / 2}
          position={[0, 5 + (i % 2) * 0.3, -7 + (i / 6) * 14]}
          scale={[1.3, 2.4, 1]}
        />
      ))}
      {/* A dark card opposite the key. On a white cyc everything reflects
          white, so a clearcoat has no contrast to work with and the panel
          reads flat — this is what gives the red its depth. */}
      <Lightformer
        form="rect"
        intensity={0.04}
        color="#141414"
        rotation-y={Math.PI / 2}
        position={[-7, 2.2, 2.5]}
        scale={[6, 3.4, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2}
        color="#f6f7f9"
        rotation-y={-Math.PI / 2}
        position={[9, 1.4, 0]}
        scale={[9, 0.9, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.4}
        color="#ffffff"
        rotation-y={Math.PI / 2}
        position={[-9, 1.6, 0]}
        scale={[8, 0.8, 1]}
      />
      <Lightformer
        form="circle"
        intensity={1}
        color="#ffffff"
        rotation-x={-Math.PI / 2}
        position={[0, -1, 0]}
        scale={[12, 12, 1]}
      />
    </Environment>
  );
}

/* ── Film pass: grain, scroll-velocity CA, edge-focus falloff ───────────── */

const filmFrag = /* glsl */ `
  uniform float uShift;
  uniform float uTime;
  uniform float uGrain;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 dir = normalize(uv - 0.5 + vec2(0.0001));
    float r = texture2D(inputBuffer, uv + dir * uShift).r;
    float b = texture2D(inputBuffer, uv - dir * uShift).b;
    vec3 col = vec3(r, inputColor.g, b);
    float edge = smoothstep(0.38, 0.92, length(uv - 0.5));
    if (edge > 0.004) {
      vec2 o = texelSize * (1.0 + edge * 5.5);
      vec3 blur = (
        texture2D(inputBuffer, uv + vec2(o.x, o.y)).rgb +
        texture2D(inputBuffer, uv + vec2(-o.x, o.y)).rgb +
        texture2D(inputBuffer, uv + vec2(o.x, -o.y)).rgb +
        texture2D(inputBuffer, uv + vec2(-o.x, -o.y)).rgb
      ) * 0.25;
      col = mix(col, blur, edge * 0.8);
    }
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
  const effect = useMemo(() => new FilmEffectImpl(mobile ? 0.025 : 0.028), [mobile]);
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
 * framing exactly rather than guessing from pixels.
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
       mid-move, which is exactly the frame a phone screenshots. */
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
      /* The live scene graph. `edge` proves the car is FRAMED, which is a
         different claim from the car being VISIBLE — the dark sibling shipped
         an entire act with a perfect edge score and nothing on screen. */
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
     Tier 2 everywhere: the client's machine stuttered on tier 3, and tier 2
     keeps everything the art direction needs ("rich" gates at >= 2). */
  const quality = 2;
  const levels = mobile ? MOBILE_LEVELS : DESKTOP_LEVELS;
  const level = levels[quality];
  /* Resolved once and never again — see the note on <Canvas dpr>. Capped below
     the device ratio because a 3x phone screen at full ratio is nine times the
     fragments for a difference nobody can see at arm's length. */
  const fixedDpr = useRef(
    // 1.15 cap everywhere: dropping the desktop cap from 1.25 cuts ~17% of
    // every fragment in every pass, invisible next to the smoothness it buys.
    Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, 1.15),
  ).current;
  const rich = !mobile && quality >= 2;

  return (
    <Canvas
      /* FIXED dpr, chosen once. It used to come from the quality tier, and a
         dpr change reallocates the drawing buffer: the canvas is destroyed at
         one resolution and rebuilt at another, which the eye reads as a flash
         and a sudden softness. Measured at 390px the backing store dropped
         507x1097 -> 331x717 mid-scroll — that IS the "pulsating", and no
         amount of hysteresis hides a resolution change that large.
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
          drawing buffer — a visible flash and softness pop. A monitor that can
          both decline AND incline oscillates around whatever framerate the
          device hovers at: measured on a 390px run the backing store went
          507x1097 -> 331x717 mid-scroll, which is the "pulsating". Climbing
          back buys a little sharpness and costs another pop, so it is gone;
          descending stays, but `settled` makes it a one-way door. */}
      {/* THE TIER IS CHOSEN ONCE AND FROZEN. No PerformanceMonitor.
          Three separate problems all came out of adapting quality mid-scroll:
          (1) every tier carries a different dpr, and changing dpr reallocates
          the drawing buffer — measured at 390px as 507x1097 -> 331x717
          mid-scroll, which is the "pulsating"; (2) drei's monitor divides
          FRAME COUNT by window duration instead of counting intervals, so a
          healthy 60 Hz display reads ~64 fps, above the old upper bound of 58,
          and inclines fired forever against declines; (3) the EffectComposer
          resizes only from useThree().size, which is in CSS pixels and does
          NOT change with dpr — so after a tier change it kept shading at the
          original resolution and merely blitted down, the drop saved no work,
          the framerate never recovered, and four flip-flops later it slammed
          to the lowest tier for the session. Tier changes are discontinuous
          anyway (Floor swaps material class, Dust re-randomises on count), so
          there is no smooth version of this. */}
      <Director shot={shot} />
      <ScenePrimer onReady={onReady} />
      {/* The infinite white cyc: background and fog share the page's paper
          white, so the floor fades seamlessly into the DOM. */}
      <color attach="background" args={[ACTS[0].room.paper]} />
      <fog attach="fog" args={[ACTS[0].room.paper, 11, 26]} />

      <Mood />

      {ACTS.map((act, i) => (
        <ActBoundary key={act.url}>
          <ActStage index={i} act={act} flake={rich} shot={shot} />
        </ActBoundary>
      ))}

      <Skylight />
      {level.dust > 0 && (
        <>
          <Dust count={level.dust} />
          {rich && <Dust count={Math.round(level.dust * 0.3)} size={0.075} opacity={0.15} spread={1.35} soft />}
        </>
      )}
      <Floor resolution={mobile ? 0 : level.refl} />
      <StudioRig mobile={mobile} />

      {/* Mobile keeps ONLY Bloom (the scene's identity — the red lenses) and a
          shorter mip chain; the fixed CSS overlays already carry grain and
          iris there, so FilmPass and Vignette are desktop-only. */}
      {/* MSAA on desktop. The renderer runs antialias:false (the composer owns
          the buffer, so the canvas setting does nothing) and multisampling was
          0 — meaning every silhouette was hard-aliased. On a dark car against
          flat white that stair-stepped edge is the single loudest "cheap
          WebGL" tell on the page, louder than any material. 4x on desktop
          only; phones stay at 0 where the extra buffer is not affordable and
          the DPR already hides most of it. */}
      {/* MSAA OFF — at multisampling 2 the composer's resolve left a large
          axis-aligned region of the frame unresolved on the dark sibling (a
          hard slab of raw background over most of an act). 0 is artefact-free
          and cheapest; at dpr 1.15 under grain + bloom the edges hold. */}
      <EffectComposer multisampling={0}>
        {[
          <Bloom
            key="bloom"
            mipmapBlur
            intensity={0.55}
            luminanceThreshold={1}
            luminanceSmoothing={0.08}
            radius={0.7}
            levels={mobile ? 5 : 6}
          />,
          ...(mobile
            ? []
            : [
                <FilmPass key="film" mobile={mobile} />,
                <Vignette key="vignette" offset={0.2} darkness={0.26} />,
              ]),
          /* The composer DISABLES the renderer's own tone mapping and expects
             the chain to do it — and the chain never did. Confirmed live:
             gl.toneMapping read 0. Every HDR value has been clipping straight
             to white, which on a white build is exactly "the cars are too
             white in certain places" — the hood and bumper highlights were
             not bright, they were CLIPPED. ACES rolls the top end off: same
             light, actual gradation where there used to be a white slab. */
          <ToneMapping key="tone" mode={ToneMappingMode.ACES_FILMIC} />,
        ]}
      </EffectComposer>

      <Rig mobile={mobile} />
    </Canvas>
  );
}

export default HeroScene;
