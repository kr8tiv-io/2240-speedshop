"use client";

import {
  Component,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { advance, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Clone } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { ContactShadow } from "./materials";
import { markShellWarm, markWorldReady, reportBootProgress, stillFor } from "./boot";
import { countLights, installLightPad, lightBudget, setStationLights } from "./lights";
import { stationAt } from "./world";

/* ─────────────────────────────────────────────────────────────────────────────
   THE MODEL LIBRARY

   `public/models/` holds 105 verified CC0 / CC-BY .glb files, ~140 MB of raw
   authoring assets. 71 of them dress this shop, and not one ships as authored:
   `scripts/compress-models.js` re-encodes every texture to KTX2/Basis and every
   non-vehicle mesh to EXT_meshopt, into `public/models-opt/` — which is the
   only model directory that is ever deployed.

     on the wire        67.2 MB  →  16.2 MB
     texture VRAM      ~520 MB   →  ~25 MB

   The VRAM number is the one that mattered. A 1024² RGBA texture with mips is
   5.5 MB on the GPU and every one of them had to be decoded and mip-generated
   on the main thread; the same texture as ETC1S is 0.7 MB, transcodes in a
   worker, and uploads as-is.

   Station 0 and 1 download before the door rolls up. Everything behind them
   streams one bay at a time while the reader is watching the cold start —
   fetched, parsed, SHADER-COMPILED off-frame, and only then handed to the
   renderer. Repeats are CLONES of a single load — one fetch per file, ever.
   ────────────────────────────────────────────────────────────────────────── */

/* Raw fetch strings bypass Next's basePath handling, so the subfolder-preview
   builds (BASEPATH=/2240) inject the prefix here at build time. Empty in every
   root-hosted build. */
const BASE = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models-opt/`;

export const M = {
  /* ── vehicles ── */
  challenger: `${BASE}car-muscle-challenger.glb`,
  coupeHoodUp: `${BASE}car-muscle-coupe-hoodup.glb`,
  charger: `${BASE}car-dodge-charger.glb`,
  camaro: `${BASE}car-camaro.glb`,
  primerShell: `${BASE}car-camaro-primer-shell.glb`,
  rustedShell: `${BASE}car-project-shell-rusted.glb`,
  coveredProject: `${BASE}car-covered-project.glb`,
  pickup: `${BASE}truck-pickup-classic.glb`,

  /* ── hero props (photoreal PBR, Poly Haven) ── */
  toolCart: `${BASE}prop-tool-cart-rolling.glb`,
  weldingCart: `${BASE}prop-welding-cart.glb`,
  tyre: `${BASE}prop-tyre-old.glb`,
  rim: `${BASE}prop-wheel-rim-rusted-a.glb`,
  barrel: `${BASE}prop-barrel-rusted-b.glb`,
  crate: `${BASE}prop-crate-wooden.glb`,
  rack: `${BASE}prop-rack-metal-worn.glb`,
  desk: `${BASE}prop-desk-metal-office.glb`,
  stool: `${BASE}prop-stool-metal-a.glb`,

  /* ── dressing (light-weight, Poly Pizza) ── */
  drum: `${BASE}prop-oil-drum.glb`,
  drumsRow: `${BASE}prop-oil-drums-row.glb`,
  extinguisher: `${BASE}prop-fire-extinguisher.glb`,
  droplight: `${BASE}prop-droplight-pendant.glb`,
  hookChain: `${BASE}prop-hoist-hook-chain.glb`,
  benchCluttered: `${BASE}prop-workbench-cluttered.glb`,
  benchAnvil: `${BASE}prop-workbench-anvil.glb`,
  benchGrinder: `${BASE}prop-workbench-grinder.glb`,
  partsCabinet: `${BASE}prop-parts-cabinet.glb`,
  shelving: `${BASE}prop-shelving-tall.glb`,
  battery: `${BASE}prop-car-battery.glb`,
  sparkPlug: `${BASE}prop-spark-plug.glb`,
  jumperCables: `${BASE}prop-jumper-cables.glb`,
  boxes: `${BASE}prop-cardboard-boxes.glb`,
  pallet: `${BASE}prop-pallet.glb`,
  ladder: `${BASE}prop-ladder.glb`,
  gasCan: `${BASE}prop-gas-can-red.glb`,
  compressor: `${BASE}prop-shop-machine.glb`,

  /* ── station 5/6 set dressing (all sub-600 KB — the two back bays read as
        under-furnished, and this is the cheapest way to fix a composition) ── */
  shelfWooden: `${BASE}prop-shelf-wooden.glb`,
  tyreStack: `${BASE}prop-tyre-stack.glb`,
  wheelStack: `${BASE}prop-wheel-stack-bare.glb`,
  palletJack: `${BASE}prop-pallet-jack.glb`,
  serviceRamp: `${BASE}prop-service-ramp.glb`,
  gasBottle: `${BASE}prop-gas-bottle-tall.glb`,
  tyreTruck: `${BASE}prop-tyre-truck.glb`,
  metalDoor: `${BASE}prop-metal-door.glb`,
  convertible: `${BASE}car-convertible-50s.glb`,
  prewarDonor: `${BASE}car-prewar-hotrod-donor.glb`,

  /* ── density pass (the wow round): the best remaining bytes-per-look in the
        105-file library — a real tool chest, a parts cart, a work light, air
        for the tyres, and the handful of hand tools a bench is dressed with ── */
  toolChest: `${BASE}prop-tool-chest-metal.glb`,
  storageCart: `${BASE}prop-storage-cart-industrial.glb`,
  toolboxMetal: `${BASE}prop-toolbox-metal.glb`,
  tirePump: `${BASE}prop-tire-pump.glb`,
  oilCan: `${BASE}prop-oil-can-small.glb`,
  barrelA: `${BASE}prop-barrel-rusted-a.glb`,
  barrelC: `${BASE}prop-barrel-rusted-c.glb`,
  drill: `${BASE}prop-drill.glb`,
  hammer: `${BASE}prop-hammer.glb`,
  pliers: `${BASE}prop-pliers.glb`,
  funnel: `${BASE}prop-funnel.glb`,
  propaneBottle: `${BASE}prop-gas-bottle-propane.glb`,

  /* ── busy pass (more of the library on the floor): a real bench vice for
        the fab wall, fuel cans and bare rubber for the corners — the small
        honest clutter that makes a bay read as mid-job ── */
  benchVice: `${BASE}prop-bench-vice.glb`,
  jerryCan: `${BASE}prop-jerry-can.glb`,
  gasTank: `${BASE}prop-gas-tank-yellow.glb`,
  wheelMag: `${BASE}prop-wheel-mag.glb`,
  tyreBare: `${BASE}prop-tyre-bare.glb`,

  /* ── detail pass (Matt: "more detail on the cars and the parts"): the
        heaviest photogrammetry pieces in the library, spent exactly where
        the orbits pass close — bench tops, walls beside arcs, hung light.
        These are the assets that read as REAL at half a metre. ── */
  pipesIndustrial: `${BASE}prop-pipes-industrial.glb`,
  lampCaged: `${BASE}prop-lamp-caged-hanging.glb`,
  powerBox: `${BASE}prop-power-box.glb`,
  metalJug: `${BASE}prop-metal-jug.glb`,
  lubricantSpray: `${BASE}prop-lubricant-spray.glb`,
  wrenchAdjustable: `${BASE}prop-wrench-adjustable.glb`,
  jerrycanGreen: `${BASE}prop-jerrycan-green.glb`,
  ammoBox: `${BASE}prop-ammo-box.glb`,
  stoolB: `${BASE}prop-stool-metal-b.glb`,
} as const;

/**
 * How a file wants to be finished.
 *
 *   paint — a car someone has finished: coloured base under a full clearcoat
 *   matte — a car nobody has finished: primer and rust, flat and thirsty
 *   prop  — everything else, graded to sit with the PBR set
 *
 * The paint/matte split does more for the room than any single lighting change:
 * a wet black coupe parked next to a dead-flat primer shell is instantly two
 * different objects, and the shop reads as a place where work is IN PROGRESS
 * rather than a showroom where every panel has the same finish.
 */
type Finish = "paint" | "matte" | "prop";

const PAINTED: ReadonlySet<string> = new Set<string>([
  M.challenger,
  M.coupeHoodUp,
  M.charger,
  M.camaro,
  M.pickup,
  M.convertible,
]);

const BARE: ReadonlySet<string> = new Set<string>([
  M.primerShell,
  M.rustedShell,
  M.prewarDonor,
]);

function finishOf(url: string): Finish {
  if (PAINTED.has(url)) return "paint";
  if (BARE.has(url)) return "matte";
  return "prop";
}

/* ── Decoders ───────────────────────────────────────────────────────────────
   MESHOPT, and nothing else. Geometry is decoded in wasm, roughly ten times
   cheaper than Draco — and decode cost lands inside a frame, which is the
   thing this whole pass exists to protect.

   KTX2/Basis was here and has been removed. GPU-native textures were the right
   answer on paper — a twentieth of the video memory, no main-thread decode —
   and they took the renderer process down with them: reproducibly, about a
   minute into every visit on the Radeon test machine, and never once with the
   same models as plain images. Eliminated a variable at a time (not the
   transcode target, not the worker count, not the mesh compression) the
   transcoder itself was what the driver could not survive. Textures ship as
   WebP on a per-slot size budget instead: most of the bytes saved, on a decode
   path twenty years old that cannot take a tab with it. */

/** Wire the loader's decoders. Idempotent; runs before any model loads. */
export function primeLoaders(_gl: THREE.WebGLRenderer) {
  /* Nothing needs the live renderer any more. Kept as the one seam where a
     decoder that does would be wired in. */
}

function extendLoader(loader: GLTFLoader) {
  loader.setMeshoptDecoder(MeshoptDecoder);
}
/* ── The stream ─────────────────────────────────────────────────────────────
   Stations mount in order, never more than one new bay in flight, and each one
   only opens the gate for the next once it is fully warm. That single rule is
   what keeps the network, the GLB parse, the texture transcode and — above all
   — the shader link out of the frames the reader is scrolling through.

   Plain module state with a subscription rather than context: a station
   unlocking must re-render exactly one component, not the scene graph. */

const STATION_COUNT = 7;
/** How many bays are up before the door rolls: the establishing shot and the hoist. */
const OPENING = 2;

let unlocked = OPENING;
const streamListeners = new Set<() => void>();

function subscribeStream(listener: () => void) {
  streamListeners.add(listener);
  return () => {
    streamListeners.delete(listener);
  };
}

function openGate(next: number) {
  if (next <= unlocked || unlocked >= STATION_COUNT) return;
  unlocked = Math.min(next, STATION_COUNT);
  for (const listener of streamListeners) listener();
}

/* The bays the opening shot cannot start without. Station 1 is deliberately
   NOT on this list: the hoist is a full orbit of scrolling away and it warms
   inside the first few seconds of the film, so making the reader wait at the
   door for it buys nothing but a longer wait. */
const PENDING = new Set<string>(["shell", "0"]);

function reportWarm(key: string) {
  if (PENDING.delete(key)) {
    reportBootProgress(0.75 + 0.125 * (2 - PENDING.size));
    if (PENDING.size === 0) markWorldReady();
  }
}

/* A background prefetch of the remaining bays lived here and has been removed
   on purpose. It raced the loader's own request for the same file: two
   in-flight requests for one URL, one of them cancelled, and the loser reading
   a truncated entry back out of the HTTP cache — which is how a perfectly
   valid `prop-bench-vice.glb` started failing to parse in production and
   nowhere else. The whole model set is 16 MB now; the bays can fetch their own
   files when their turn comes. */

/** Nothing may hold the door shut forever — a stalled fetch least of all. */
if (typeof window !== "undefined") {
  window.setTimeout(() => {
    PENDING.clear();
    markWorldReady();
    // And the rest of the shop must still arrive even if the chain broke.
    openGate(STATION_COUNT);
  }, 15000);
}

/* ── Load, grade, measure ───────────────────────────────────────────────── */

/* ── One program for the whole shop ─────────────────────────────────────────
   three compiles a separate shader for every distinct COMBINATION of features
   a material uses: a prop with a normal map and a prop without one are two
   programs, and on Windows each one is an HLSL translation that measured
   ~100 ms on the test machine. Thirty-five props dressed by four different
   artists produced thirty-five programs for what is, visually, one material.

   So every prop is given the full set of slots whether its author supplied
   them or not, filled with textures that change nothing: white multiplies to
   the same colour, flat blue is a normal pointing straight out. Identical
   feature set, identical program — one compile for the whole shop instead of
   one per file, and the pixels are bit-identical to what the author shipped. */

function neutral(r: number, g: number, b: number) {
  const texture = new THREE.DataTexture(new Uint8Array([r, g, b, 255]), 1, 1);
  texture.needsUpdate = true;
  return texture;
}

/** White: multiplies colour, roughness and metalness by exactly 1. */
const FILL_WHITE = neutral(255, 255, 255);
/** The normal that points straight out of the surface. */
const FILL_NORMAL = neutral(128, 128, 255);

function unify(material: THREE.MeshStandardMaterial) {
  if (!material.map) material.map = FILL_WHITE;
  if (!material.normalMap) material.normalMap = FILL_NORMAL;
  if (!material.roughnessMap) material.roughnessMap = FILL_WHITE;
  if (!material.metalnessMap) material.metalnessMap = FILL_WHITE;
  material.needsUpdate = true;
}

/**
 * The same treatment for the hand-built building.
 *
 * The shell is a hundred-odd primitives with inline materials — a colour here,
 * a roughness there — and each unique combination of slots was its own program
 * and its own ~150 ms of Direct3D translation. Handing them all the same four
 * neutral maps makes them one program without moving a pixel. Custom shader
 * materials (the reflector floor, the fog, the neon glows) are left alone:
 * their programs are hand-written and unifying them would break them.
 */
export function unifyTree(node: THREE.Object3D) {
  const combos = new Map<string, number>();
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const entry of list) {
      const material = entry as THREE.MeshStandardMaterial;
      const type = material?.type;
      if (type !== "MeshStandardMaterial" && type !== "MeshPhysicalMaterial") continue;
      unify(material);
      if (DEBUG) {
        const geometry = mesh.geometry;
        const combo = [
          type,
          `side${material.side}`,
          material.transparent ? "transparent" : "",
          material.alphaTest ? "alphaTest" : "",
          material.depthWrite ? "" : "noDepth",
          material.vertexColors ? "vcol" : "",
          material.toneMapped ? "" : "raw",
          material.emissive && material.emissive.getHex() !== 0 ? "emissive" : "",
          material.flatShading ? "flat" : "",
          geometry?.getAttribute?.("tangent") ? "tangent" : "",
          geometry?.getAttribute?.("uv1") ? "uv1" : "",
          (mesh as unknown as THREE.InstancedMesh).isInstancedMesh ? "instanced" : "",
        ]
          .filter(Boolean)
          .join("|");
        combos.set(combo, (combos.get(combo) ?? 0) + 1);
      }
    }
  });
  if (DEBUG && combos.size) {
    console.log(`[shop] material combos (${combos.size}):`);
    for (const [combo, n] of [...combos].sort((a, b) => b[1] - a[1])) {
      console.log(`   x${n}  ${combo}`);
    }
  }
}

const GRADED = new WeakSet<THREE.Object3D>();
/** old geometry → its re-creased replacement, or itself if it was left alone. */
const SMOOTHED = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
const GREY = new THREE.Color();

/**
 * Pull a flat authored colour toward the room. The darkening is weighted by
 * luminance, so a white toy body loses most of its brightness while a dark
 * tyre keeps its value — a flat multiply would crush the darks and leave the
 * whites still shouting.
 */
function tame(color: THREE.Color, darken: number, desaturate: number) {
  const luma = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
  GREY.setScalar(luma);
  color.lerp(GREY, desaturate);
  color.multiplyScalar(
    THREE.MathUtils.lerp(1, darken, THREE.MathUtils.clamp(luma, 0, 1)),
  );
}

function lumaOf(color: THREE.Color) {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
}

/* Vertices above this get left alone: photogrammetry props already ship correct
   smoothing, and re-deriving normals for a 200k-triangle tyre on the main
   thread would cost more than every other fix in this file put together. */
const CREASE_BUDGET = 80_000;

/**
 * SMOOTH THE FACETS.
 *
 * The stylized vehicles are the loudest defect in the whole scene: a Camaro
 * roof arrives as a fan of hard triangles because the exporter wrote one normal
 * per FACE. `computeVertexNormals` on its own would not fix it — a non-indexed
 * GLB has no shared vertices to average across — and welding everything would
 * go too far the other way and round off the windscreen frame and the panel
 * gaps along with the roof.
 *
 * `toCreasedNormals` is the right tool: average normals across any edge under
 * the crease angle, keep them hard above it. At 55° a roof, a bonnet and a
 * wheel arch go smooth while door shuts, glass frames and body lines stay as
 * crisp as the model author drew them.
 */
function smooth(mesh: THREE.Mesh, creaseAngle: number) {
  const geometry = mesh.geometry;
  if (!geometry?.isBufferGeometry) return;
  if (typeof window !== "undefined" && window.location.search.includes("nosmooth")) return;

  // Geometries are shared between meshes inside a file. Resolve through the
  // map rather than recomputing — and never dispose one that a sibling mesh is
  // still pointing at.
  const done = SMOOTHED.get(geometry);
  if (done) {
    mesh.geometry = done;
    return;
  }

  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  if (
    !position ||
    position.count > CREASE_BUDGET ||
    (geometry.morphAttributes && Object.keys(geometry.morphAttributes).length > 0) ||
    geometry.getAttribute("skinIndex") ||
    (normal && !isFlatShaded(geometry))
  ) {
    SMOOTHED.set(geometry, geometry);
    return;
  }

  try {
    const creased = toCreasedNormals(geometry, creaseAngle);
    SMOOTHED.set(geometry, creased);
    SMOOTHED.set(creased, creased);
    mesh.geometry = creased;
    geometry.dispose();
  } catch {
    // A malformed attribute set is not worth taking the scene down for.
    geometry.computeVertexNormals();
    SMOOTHED.set(geometry, geometry);
  }
}

/**
 * Does this geometry carry one normal per FACE?
 *
 * Sampled, not exhaustive — a couple of hundred triangles is plenty to tell a
 * faceted low-poly export from a properly smoothed one, and it keeps the check
 * off the critical path for the big props.
 */
function isFlatShaded(geometry: THREE.BufferGeometry) {
  const normal = geometry.getAttribute("normal");
  if (!normal) return true;
  const index = geometry.getIndex();
  const triangles = (index ? index.count : normal.count) / 3;
  if (triangles < 1) return false;

  const step = Math.max(1, Math.floor(triangles / 200));
  let sampled = 0;
  let flat = 0;

  for (let t = 0; t < triangles; t += step) {
    const a = index ? index.getX(t * 3) : t * 3;
    const b = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const c = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    sampled++;
    const same =
      Math.abs(normal.getX(a) - normal.getX(b)) < 1e-4 &&
      Math.abs(normal.getY(a) - normal.getY(b)) < 1e-4 &&
      Math.abs(normal.getZ(a) - normal.getZ(b)) < 1e-4 &&
      Math.abs(normal.getX(a) - normal.getX(c)) < 1e-4 &&
      Math.abs(normal.getY(a) - normal.getY(c)) < 1e-4 &&
      Math.abs(normal.getZ(a) - normal.getZ(c)) < 1e-4;
    if (same) flat++;
  }

  // A cube is legitimately all-flat and re-creasing it changes nothing, so the
  // bar is set where a curved surface would start losing the argument.
  return sampled > 0 && flat / sampled > 0.7;
}

/**
 * One pass over a freshly loaded file, applied to the SOURCE geometry and
 * materials so every clone inherits it for free.
 *
 * The honest problem flagged by whoever sourced these: the cars are stylized
 * flat-shaded low-poly and the best props are photogrammetry-grade PBR. The old
 * answer was to hide the difference — darken everything, roughen everything,
 * let silhouette carry the frame. That is why the shop read as flat and toy-
 * like: EVERY surface in it had the same matte response.
 *
 * The answer now is to differentiate instead. Bodywork becomes real car paint —
 * `MeshPhysicalMaterial` with a full clearcoat over a coloured base, which is
 * the actual physical difference between a painted panel and a plastic one.
 * Rubber goes near-black and dead matte. Bright trim keeps its bite. The props
 * are left alone because they were always right.
 */
function grade(scene: THREE.Object3D, finish: Finish) {
  if (GRADED.has(scene)) return;
  GRADED.add(scene);

  const isVehicle = finish !== "prop";

  // One physical material per source material, so a body panel shared by nine
  // meshes still compiles one program and issues one uniform upload.
  const swapped = new Map<THREE.Material, THREE.Material>();

  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const rebuilt: THREE.Material[] = [];
    let replaced = false;

    for (const entry of list) {
      const material = entry as THREE.MeshStandardMaterial;
      if (!material?.isMeshStandardMaterial) {
        rebuilt.push(entry);
        continue;
      }

      // Flat shading is a per-material override that beats any normals we
      // compute below, so it has to go first and it has to go everywhere.
      material.flatShading = false;

      if (!isVehicle) {
        if (material.map) {
          // Photogrammetry props already carry their own values.
          material.envMapIntensity = 1.05;
        } else {
          // Flat-colour dressing. Left alone, a rack of primary-colour barrels
          // reads as a toy shelf next to the PBR set.
          tame(material.color, 0.52, 0.38);
          material.roughness = THREE.MathUtils.clamp(material.roughness, 0.45, 0.85);
          material.metalness = Math.min(material.metalness, 0.35);
          material.envMapIntensity = 0.85;
        }
        unify(material);
        rebuilt.push(material);
        continue;
      }

      /* ── vehicles ── */
      const cached = swapped.get(material);
      if (cached) {
        rebuilt.push(cached);
        replaced = true;
        continue;
      }

      const luma = lumaOf(material.color);
      const name = material.name.toLowerCase();
      const isGlass =
        material.transparent ||
        material.opacity < 1 ||
        /glass|window|windscreen|windshield|screen/.test(name);
      const isRubber = luma < 0.045 || /tyre|tire|rubber|wheel/.test(name);

      if (isGlass) {
        // Dark, hard, reflective. Glass is the one place a low-poly car gets a
        // mirror for free, and it is what makes a windscreen read as glazed.
        material.color.setRGB(0.03, 0.033, 0.04);
        material.roughness = 0.08;
        material.metalness = 0.2;
        material.envMapIntensity = 1.5;
        unify(material);
        rebuilt.push(material);
        continue;
      }

      if (isRubber) {
        material.color.setRGB(0.018, 0.019, 0.022);
        material.roughness = 0.94;
        material.metalness = 0;
        material.envMapIntensity = 0.35;
        unify(material);
        rebuilt.push(material);
        continue;
      }

      // Bright, near-neutral surfaces are trim: bumpers, grilles, mirrors,
      // exhaust tips. Those are chrome, not paint.
      const chromeish =
        finish === "paint" &&
        luma > 0.62 &&
        material.color.getHSL({ h: 0, s: 0, l: 0 }).s < 0.14;
      const bare = finish === "matte";

      const paint = new THREE.MeshPhysicalMaterial({
        name: material.name,
        color: material.color.clone(),
        map: material.map,
        normalMap: material.normalMap,
        roughnessMap: material.roughnessMap,
        metalnessMap: material.metalnessMap,
        vertexColors: material.vertexColors,
        side: material.side,
        // Automotive paint is a DIELECTRIC. Pushing metalness up to fake
        // "metallic paint" eats the diffuse term, and in a dark garage that
        // turns a silver body into a black one — which is exactly what
        // happened on the first pass. A little flake, a coloured base, and let
        // the coat below do the shine.
        metalness: chromeish ? 1 : bare ? 0.06 : 0.14,
        roughness: chromeish ? 0.09 : bare ? 0.78 : 0.44,
        // The whole point. A coloured base under a near-mirror second layer is
        // what a painted panel physically IS; without it the same colour is
        // just a lump of tinted plastic, which is precisely how these bodies
        // have been reading. Primer and rust get almost none of it — a shell
        // that has not been painted yet must not be the shiniest thing in the
        // building, which is exactly what it became on the first pass.
        clearcoat: chromeish ? 0 : bare ? 0.08 : 1,
        // Hard. Once the bay lights were moved off the cars' centrelines the
        // blown circle in the middle of every bonnet went with them, and a
        // tight coat is what turns the overhead strips into the long clean
        // streak down a wing that says "this paint is three feet deep".
        clearcoatRoughness: 0.07,
        envMapIntensity: chromeish ? 1.35 : bare ? 0.6 : 1,
      });
      if (chromeish) {
        // nothing to tame — trim keeps its brightness
      } else if (bare) {
        tame(paint.color, 0.5, 0.42);
      } else {
        tame(paint.color, 0.6, 0.12);
      }

      unify(paint);
      swapped.set(material, paint);
      rebuilt.push(paint);
      replaced = true;
    }

    // Softer crease on bodywork than on dressing: a car is mostly one big
    // swept surface and wants to hold together across it.
    smooth(mesh, isVehicle ? THREE.MathUtils.degToRad(55) : THREE.MathUtils.degToRad(42));

    if (replaced) {
      mesh.material = Array.isArray(mesh.material) ? rebuilt : rebuilt[0];
    }
  });
}

const MEASURED = new WeakMap<THREE.Object3D, THREE.Box3>();

/**
 * Poly Haven ships real-world metres, Poly Pizza ships whatever the author had,
 * and the two sources do not agree on which way is forward either. Rather than
 * guess a scale and a yaw per file, measure the bounding box once and derive
 * both. Same call, both sources, no magic numbers to go stale if a model is
 * swapped for another of the 105.
 */
function measure(scene: THREE.Object3D): THREE.Box3 {
  const cached = MEASURED.get(scene);
  if (cached) return cached;

  const box = new THREE.Box3().setFromObject(scene);
  // An empty or non-finite box would divide by zero downstream.
  if (box.isEmpty() || !Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) {
    box.set(new THREE.Vector3(-0.5, 0, -0.5), new THREE.Vector3(0.5, 1, 0.5));
  }
  MEASURED.set(scene, box);
  return box;
}

/**
 * How to stand the model up before it is placed.
 *
 *   length — longest horizontal axis runs along Z, so every car in the library
 *            answers to the same yaw convention whichever way its author built it
 *   disc   — thinnest axis runs along X: a wheel or a rim standing on its tread
 *   flat   — thinnest axis runs along Y: the same wheel lying on the floor
 */
export type Orient = "none" | "length" | "disc" | "flat";

const ROT_X = new THREE.Euler(Math.PI / 2, 0, 0);
const ROT_Y = new THREE.Euler(0, Math.PI / 2, 0);
const ROT_Z = new THREE.Euler(0, 0, Math.PI / 2);
const ROT_NONE = new THREE.Euler(0, 0, 0);

function orientOf(box: THREE.Box3, orient: Orient): THREE.Euler {
  if (orient === "none") return ROT_NONE;
  const size = box.getSize(new THREE.Vector3());

  if (orient === "length") return size.x > size.z ? ROT_Y : ROT_NONE;

  const thin =
    size.x <= size.y && size.x <= size.z ? "x" : size.y <= size.z ? "y" : "z";

  if (orient === "disc") {
    // Thin axis to X: Rz sends +Y to ±X, Ry sends +Z to +X.
    return thin === "y" ? ROT_Z : thin === "z" ? ROT_Y : ROT_NONE;
  }
  // "flat" — thin axis to Y: Rz sends +X to +Y, Rx sends +Z to ∓Y.
  return thin === "x" ? ROT_Z : thin === "z" ? ROT_X : ROT_NONE;
}

function useShopModel(url: string) {
  const gltf = useLoader(GLTFLoader, url, extendLoader) as unknown as GLTF;
  if (DEBUG && !GRADED.has(gltf.scene)) {
    const t0 = performance.now();
    grade(gltf.scene, finishOf(url));
    const ms = performance.now() - t0;
    if (ms > 12) console.log(`[shop] grade ${url.split("/").pop()} ${Math.round(ms)} ms`);
  } else {
    grade(gltf.scene, finishOf(url));
  }
  return gltf.scene;
}

/* ── Placement ──────────────────────────────────────────────────────────── */

export type PlacedProps = {
  url: string;
  /** Real-world size in metres along `axis`, measured after `orient`. */
  size: number;
  /** Which bounding-box dimension `size` refers to. */
  axis?: "x" | "y" | "z" | "max" | "xz";
  position: [number, number, number];
  /** Yaw in radians, applied after `orient`. */
  yaw?: number;
  /** Pitch and roll, for things leaning or knocked over. */
  tilt?: [number, number];
  /** Sit the bounding box on the group origin, or centre it there. */
  anchor?: "floor" | "center";
  orient?: Orient;
  /** Contact-shadow radius in metres, or false for anything off the floor. */
  shadow?: number | false;
  shadowSpread?: [number, number];
  shadowOpacity?: number;
  /**
   * Repaint the BODYWORK of this one instance — the panels `grade` gave a
   * clearcoat — leaving glass, rubber, trim and every other instance of the
   * same file untouched. This is what lets two clones of one .glb read as two
   * different customers' cars instead of a copy-paste.
   */
  tint?: string;
};

/**
 * Swap the clearcoated paint materials on a freshly cloned subtree for tinted
 * copies. Runs on the CLONE's meshes, so the shared source materials — and
 * every other instance — are never touched. The clones are cached per call
 * site and disposed with it.
 */
function useTint(group: React.RefObject<THREE.Group | null>, tint?: string) {
  useLayoutEffect(() => {
    if (!tint) return;
    const swapped = new Map<THREE.Material, THREE.MeshPhysicalMaterial>();

    group.current?.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const rebuilt = list.map((entry) => {
        const material = entry as THREE.MeshPhysicalMaterial;
        // Clearcoat is how `grade` marks body paint; everything else keeps its
        // shared material.
        if (!material?.isMeshPhysicalMaterial || material.clearcoat < 0.5) return entry;
        let paint = swapped.get(entry);
        if (!paint) {
          paint = material.clone();
          paint.color.set(tint);
          // Gentler than the grade pass on authored paint: a repaint is chosen
          // to READ as a colour under tungsten, so it keeps more of its value.
          tame(paint.color, 0.78, 0.08);
          swapped.set(entry, paint);
        }
        return paint;
      });
      mesh.material = Array.isArray(mesh.material) ? rebuilt : rebuilt[0];
    });

    return () => {
      for (const material of swapped.values()) material.dispose();
    };
  }, [group, tint]);
}

/**
 * One model, stood up, fitted to a real size, sat on the floor and grounded
 * with a contact smudge. Every repeat of a file in this shop goes through here,
 * and `Clone` shares the loaded geometry and materials — so eight tyres cost
 * one fetch, one geometry upload and eight matrices.
 */
export function Placed({
  url,
  size,
  axis = "max",
  position,
  yaw = 0,
  tilt,
  anchor = "floor",
  orient = "none",
  shadow = false,
  shadowSpread = [1, 1],
  shadowOpacity = 0.5,
  tint,
}: PlacedProps) {
  const scene = useShopModel(url);
  const clone = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  useTint(clone, tint);

  /* A PLACED MODEL NEVER MOVES AGAIN.
     three recomputes a local matrix from position/quaternion/scale for every
     object in the graph, every frame. This scene carries three and a half
     thousand of them, and all but a handful — the turntable, the lift deck,
     the dyno drums, the fan — are bolted to the floor. Composing a matrix to
     discover that a tyre is exactly where it was last frame is pure tax, and
     on a throttled phone it is a real slice of the budget.
     Freezing is safe for exactly this subtree because its transforms are
     props, written once at mount. Anything that DOES animate lives outside
     `Placed` and keeps its own updates — and because three forces the update
     down through children, a frozen model riding an animated turntable still
     tracks it perfectly. */
  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    node.updateMatrixWorld(true);
    node.traverse((child) => {
      child.matrixAutoUpdate = false;
    });
    return () => {
      node.traverse((child) => {
        child.matrixAutoUpdate = true;
      });
    };
  }, [scene, size, axis, anchor, orient, position, yaw, tilt, tint]);

  const fit = useMemo(() => {
    const euler = orientOf(measure(scene), orient);
    // Transform the box by the same rotation the mesh will get, so the fit and
    // the ground offset are computed in the frame the model actually ends up in.
    const box = measure(scene)
      .clone()
      .applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(euler));
    const dims = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());

    const span =
      axis === "max"
        ? Math.max(dims.x, dims.y, dims.z)
        : axis === "xz"
          ? Math.max(dims.x, dims.z)
          : dims[axis];
    const scale = span > 1e-6 ? size / span : 1;

    return {
      euler,
      scale,
      offset: [
        -centre.x * scale,
        anchor === "floor" ? -box.min.y * scale : -centre.y * scale,
        -centre.z * scale,
      ] as [number, number, number],
    };
  }, [scene, size, axis, anchor, orient]);

  return (
    <group ref={root} position={position} rotation={[tilt?.[0] ?? 0, yaw, tilt?.[1] ?? 0]}>
      <group position={fit.offset} scale={fit.scale}>
        <group ref={clone} rotation={fit.euler}>
          <Clone object={scene} />
        </group>
      </group>
      {shadow !== false && (
        <ContactShadow
          radius={shadow}
          spread={shadowSpread}
          opacity={shadowOpacity}
          position={[0, 0.018 - position[1], 0]}
        />
      )}
    </group>
  );
}

/** A car: nose-to-tail down Z, sized by length, grounded with a long blob. */
export function Vehicle(props: Omit<PlacedProps, "orient">) {
  const { size, shadow, shadowSpread, shadowOpacity, ...rest } = props;
  return (
    <Placed
      {...rest}
      size={size}
      orient="length"
      shadow={shadow ?? size * 0.5}
      shadowSpread={shadowSpread ?? [0.4, 1]}
      shadowOpacity={shadowOpacity ?? 0.6}
    />
  );
}

/* ── Station streaming ──────────────────────────────────────────────────────

   THE FIX FOR THE 21-SECOND FRAME.

   A Chrome trace of the old build showed the render loop blocking the main
   thread for 12, 17, 18 and 21 seconds at a stretch — every one of them the
   frame in which a bay mounted. Nothing was wrong with the scene: the cost was
   `glLinkProgram`. A dozen fresh `MeshPhysicalMaterial`s, translated to HLSL
   and linked by ANGLE, INSIDE the frame that first draws them, because a
   material is not compiled until the renderer meets it in a render.

   So the renderer never meets one in a render any more. Each bay mounts
   HIDDEN, and `compileAsync` — which walks with `traverse`, not
   `traverseVisible`, so a hidden subtree is fair game — links every program
   through `KHR_parallel_shader_compile` on the driver's own threads. Textures
   get pushed up the same way. Only when the promise resolves does the group
   become visible, and by then there is nothing left for the frame to do but
   draw it.

   The same resolution opens the gate for the next bay, so the shop arrives as
   an orderly queue rather than a stampede. */

/* ── Tier ───────────────────────────────────────────────────────────────────
   The phone tier is not "the same shop with cheaper pixels" any more. Three
   things it does differently are decided here, because they are decisions
   about what gets BUILT, not about how it is drawn:

     draw span      how many bays exist in the frame at once
     bay lights     whether a droplight is a real light or just a glowing bulb
     light pad      how many slots the shader's light loop carries

   All three are per-fragment or per-object costs that a desktop GPU shrugs off
   and a phone cannot. */

let phoneTier = false;
export function setWorldTier(lite: boolean) {
  phoneTier = lite;
}

/** How far from a station the camera keeps it drawn, in station units. */
const DRAW_SPAN_FULL = 2.6;
/* Just over one station. The orbit the reader is on, and its neighbour coming
   into view — nothing else is submitted, matrixed, or culled. */
const DRAW_SPAN_LITE = 1.25;
const drawSpan = () => (phoneTier ? DRAW_SPAN_LITE : DRAW_SPAN_FULL);

/** `?perf` on the URL turns on the warm-up timings and the renderer handle. */
const DEBUG =
  typeof window !== "undefined" && window.location.search.includes("perf");

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/* ── Yield to the reader ────────────────────────────────────────────────────
   Warming a bay is the cheapest it will ever be, and it is still work: a few
   hundred milliseconds of shader translation that has to happen SOMEWHERE. The
   one place it must not happen is inside a scroll — that is the entire point
   of doing it early.

   So the rig reports whether the film is moving, and every batch of warm-up
   work waits for the reader to stop first. Readers stop constantly: the snap
   parks them on a station, they read a paragraph, they look at the picture.
   The shop fills itself in during those pauses. A bay that has been waiting
   too long goes ahead regardless — a reader who never stops still has to get
   a shop eventually. */

/** Resolves true if the reader actually stopped, false if patience ran out. */
async function untilIdle(patience = 15000) {
  const deadline = performance.now() + patience;
  while (stillFor() < 220) {
    if (performance.now() > deadline) return false;
    await wait(90);
  }
  return true;
}

function countRenderables(node: THREE.Object3D) {
  let n = 0;
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh || (child as THREE.Points).isPoints || (child as THREE.Line).isLine) n++;
  });
  return n;
}

/**
 * Wait for a subtree to stop growing, THEN compile it.
 *
 * Compiling too early is worse than not compiling at all: the first attempt at
 * this warmed the shell sixty milliseconds after mount, linked eighteen
 * programs, and then watched the first rendered frame link thirty-four more —
 * React had not finished committing the building yet. React 19 commits
 * concurrently and will happily yield mid-tree, so the only honest signal is
 * the subtree itself going quiet.
 */
async function warmSubtree(
  gl: THREE.WebGLRenderer,
  node: THREE.Object3D,
  camera: THREE.Camera,
  scene: THREE.Scene,
): Promise<void> {
  let previous = -1;
  for (let i = 0; i < 14; i++) {
    const count = countRenderables(node);
    if (count > 0 && count === previous) break;
    previous = count;
    // Short steps: this is a settle check, and every wasted tick here is a
    // bay arriving later than it needed to.
    await wait(70);
  }

  // Collapse the feature sets BEFORE compiling, or we compile the variety we
  // are about to throw away.
  unifyTree(node);
  await untilIdle();
  await warmUp(gl, node, camera, scene);
}

/**
 * Build the programs a subtree needs, off the animation loop.
 *
 * The first cut of this waited on `KHR_parallel_shader_compile` and then forced
 * every program's uniform locations, on the theory that linking was the
 * expensive part. A V8 CPU profile said otherwise: on Windows, ANGLE reports
 * the link complete and DEFERS the translation to Direct3D until the program is
 * first DRAWN with — so the wait bought nothing and the cost still landed on
 * the frame that drew the bay. What actually pays it is a draw, which is why
 * each bay is rendered once by hand in `firstUse` below. This is the cheap
 * half: create the programs so that manual frame has nothing left to allocate.
 */
async function warmUp(
  gl: THREE.WebGLRenderer,
  node: THREE.Object3D,
  camera: THREE.Camera,
  scene: THREE.Scene,
): Promise<void> {
  try {
    gl.compile(node, camera, node === scene ? undefined : scene);
  } catch {
    /* a material the renderer will not touch is not one we can warm */
  }
  await wait(0);
}

/**
 * Draw a subtree through the real composer, a few meshes at a time.
 *
 * `compile()` builds programs for the configuration it is given; the post chain
 * renders into an HDR buffer, which Direct3D treats as a different program for
 * every material it touches. So a bay that was only ever `compile()`d still
 * pays for its shaders the first frame the composer draws it — and on the phone
 * tier that landed as an eleven-second stall in the middle of a scroll, because
 * that is when a bay first becomes visible.
 *
 * Handing the meshes back in small batches, with a frame between each, pays the
 * same bill in slices small enough that nothing notices — and, crucially, it
 * happens while the bay is still two stations away from the camera.
 */
async function warmThroughComposer(node: THREE.Object3D, batch = 6) {
  const drawables: THREE.Object3D[] = [];
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh || (child as THREE.Points).isPoints || (child as THREE.Line).isLine) {
      drawables.push(child);
    }
  });
  if (drawables.length === 0) return;

  const was = drawables.map((object) => object.visible);
  const wasGroup = node.visible;
  for (const object of drawables) object.visible = false;
  node.visible = true;

  const step = () => {
    try {
      advance(performance.now());
    } catch {
      /* the loop is not running yet; the shell warm will cover this */
    }
  };

  let i = 0;
  while (i < drawables.length) {
    /* Wait for the reader to stop. If they never do — a long uninterrupted
       flick down the page — the bay still has to arrive, so the work goes
       ahead ONE mesh at a time instead of six, with a frame between each.
       Thin enough that a forced slice costs a frame, not a stutter. */
    const idle = await untilIdle();
    const size = idle ? batch : 1;
    for (let k = i; k < Math.min(i + size, drawables.length); k++) {
      drawables[k].visible = was[k];
    }
    i += size;
    step();
    await wait(idle ? 0 : 16);
  }

  for (let i = 0; i < drawables.length; i++) drawables[i].visible = was[i];
  node.visible = wasGroup;
}


export function StationBundle({
  station,
  children,
}: {
  station: number;
  children: ReactNode;
}) {
  const allowed = useSyncExternalStore(
    subscribeStream,
    () => station < unlocked,
    () => station < OPENING,
  );

  /* MOUNTING IS WORK TOO — and it was the last thing still landing mid-swipe.
     A bay is a couple of hundred objects, and React builds all of them in one
     commit: geometry, materials, matrices, the lot. Warming it was already
     paced and gated; CREATING it was not, so a bay unlocking while a thumb was
     moving cost seconds in a single block. The opening two bays go up
     immediately — nothing is on screen yet to disturb — and every bay after
     them waits for the reader to be still. */
  const [mounted, setMounted] = useState(station < OPENING);

  useEffect(() => {
    if (!allowed || mounted) return;
    let dead = false;
    void untilIdle(9000).then(() => {
      if (!dead) setMounted(true);
    });
    return () => {
      dead = true;
    };
  }, [allowed, mounted]);

  if (!allowed || !mounted) return null;
  return (
    <BayBoundary station={station}>
      <Suspense fallback={null}>
        <WarmStation station={station}>{children}</WarmStation>
      </Suspense>
    </BayBoundary>
  );
}

/**
 * ONE BAD MODEL MUST NOT TAKE THE SHOP WITH IT.
 *
 * A file that fails to parse throws out of the loader, through Suspense, and
 * — with nothing to catch it — unmounts the entire Canvas: renderer disposed,
 * context gone, a black page where a garage was. That is precisely what a
 * single unhappy .glb did here, five seconds into every load, and the symptom
 * (an empty page) looked nothing like the cause.
 *
 * A bay that cannot load is now a bay that is missing. The other six, the
 * building, and the film all carry on, and the gate still opens for the next
 * one so the stream never stalls behind it.
 */
class BayBoundary extends Component<
  { station: number; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn(`[shop] bay ${this.props.station} failed to load — carrying on`, error);
    // Do not strand the queue behind a bay that will never arrive.
    openGate(this.props.station + 2);
    reportWarm(String(this.props.station));
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/**
 * One bay: compiled off-frame, then drawn only while the camera is near it.
 *
 * Visibility is written from `useFrame` on a ref — never React state. A bay
 * going out of view must cost one boolean, not a re-render of the scene graph.
 */
/* ── Detail cull ────────────────────────────────────────────────────────────
   A bay is roughly two hundred separate objects and a phone was submitting
   five hundred draw calls a frame to render one of them properly. Most of that
   is clutter the frame cannot resolve: a wrench on a bench eight metres back
   is four pixels across on a 390-point screen, behind fog, and it costs the
   same call as the car it is standing next to.

   So each object is measured once, when its bay warms — where it is, and how
   big — and after that a single divide per object decides whether it is worth
   drawing: projected size below about two pixels and it sits the frame out.
   The subject of the orbit is always metres wide and metres away, so it never
   qualifies; the clutter around it drops out exactly as the camera pulls back
   from it and returns as the camera comes in. */

type Cullable = { object: THREE.Object3D; centre: THREE.Vector3; radius: number };

/** Projected radius, as a fraction of the distance. ~2 px on a 390 screen. */
const CULL_RATIO = 0.006;

/**
 * Build the cull index WITHOUT eating a frame.
 *
 * Measuring an object means computing its geometry's bounding sphere, which
 * walks every vertex it has. Doing that for the whole building in one go —
 * inside a frame callback, which is where the first version did it — is a
 * seven-second stall: the single worst frame left in the mobile profile, and
 * it fired the moment the cull switched on.
 *
 * So it is built a slice at a time, off the animation loop, and the cull
 * simply does not run until the index is ready.
 */
async function collectCullables(
  node: THREE.Object3D,
  onDone: (list: Cullable[]) => void,
) {
  const meshes: THREE.Mesh[] = [];
  node.updateMatrixWorld(true);
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) meshes.push(mesh);
  });

  const list: Cullable[] = [];
  const scale = new THREE.Vector3();
  for (let i = 0; i < meshes.length; i++) {
    const mesh = meshes[i];
    if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
    const sphere = mesh.geometry.boundingSphere;
    if (sphere) {
      const centre = sphere.center.clone().applyMatrix4(mesh.matrixWorld);
      // Uniform-ish scale is a fair assumption for placed props; take the
      // largest axis so nothing is culled for being thin.
      scale.setFromMatrixScale(mesh.matrixWorld);
      const radius = sphere.radius * Math.max(scale.x, scale.y, scale.z);
      if (radius > 0) list.push({ object: mesh, centre, radius });
    }
    // A slice per tick: forty objects is well under a frame even on a phone.
    if (i % 40 === 39) await wait(0);
  }
  onDone(list);
}

/**
 * The same cull, for the building itself.
 *
 * The bays are only half the draw calls: the shell is hand-built from
 * primitives — girts, conduit, brackets, bolts, ceiling runs, the yard outside
 * — and the far half of a sixty-eight metre shop contributes a few hundred
 * calls' worth of objects that land on one or two pixels each. Same rule, same
 * measurement, applied once the shell has stopped growing.
 */
export function DetailCull({ target }: { target: React.RefObject<THREE.Object3D | null> }) {
  const items = useRef<Cullable[] | null>(null);
  const building = useRef(false);
  const tick = useRef(0);
  const ready = useRef(false);

  useEffect(() => {
    // Late enough that the shell has finished mounting; the warm-up gate has
    // already waited for exactly that.
    const timer = window.setTimeout(() => {
      ready.current = true;
    }, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useFrame((state) => {
    if (!phoneTier || !ready.current) return;
    const node = target.current;
    if (!node) return;
    if (++tick.current % 3 !== 0) return;
    if (!items.current) {
      if (!building.current) {
        building.current = true;
        void collectCullables(node, (list) => {
          items.current = list;
        });
      }
      return;
    }
    const eye = state.camera.position;
    for (const item of items.current) {
      const distance = item.centre.distanceTo(eye);
      item.object.visible = item.radius / Math.max(distance, 0.001) > CULL_RATIO;
    }
  });

  return null;
}

function WarmStation({ station, children }: { station: number; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const warm = useRef(false);
  const lights = useRef(0);
  const drawn = useRef(false);
  const cullables = useRef<Cullable[] | null>(null);
  const building = useRef(false);
  const cullTick = useRef(0);
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const node = group.current;
    // A subtree that suspends again — a late texture, a second model — has its
    // effects torn down and re-run by React. The work is already done.
    if (!node || warm.current) return;
    let dead = false;

    const finish = async () => {
      if (dead) return;
      await firstUse();
      if (dead) return;
      warm.current = true;
      reportWarm(String(station));
      /* Two bays in flight on a phone, one on a desktop.
         The phone's warm is cheap — a bay compiles in a couple of hundred
         milliseconds through the lite composer — so the queue is bound by
         downloads, and running one at a time left the last bay still arriving
         forty-five seconds in, which is exactly when a reader is scrolling
         past it. The desktop stays strictly sequential: there each bay is
         seconds of shader translation, and two at once is a stall. */
      openGate(station + (phoneTier ? 3 : 2));
    };

    /* THE LAST HIDDEN COST: first USE, as opposed to first compile.
       `compile()` builds the programs a bay needs to be drawn — but the
       ambient-occlusion pass draws the building a second time through its own
       depth material, and those programs do not exist until a frame actually
       renders the bay. Waiting for the reader to arrive means paying for them
       inside the frame they arrive on.
       So one frame is rendered here, by hand, in a timer: the bay is switched
       on with frustum culling disabled so nothing can skip it, the frame is
       advanced, and everything is put back. Off the animation loop, before the
       camera is anywhere near, and invisible — the bay is drawn to a part of
       the frame that is not on screen. */
    /* A bay used to be drawn once into a private render target here, to force
       the driver to build its programs before the reader arrived. It has been
       removed: by the time a bay streams in, the render loop is LIVE, and
       reaching in to swap the render target and draw a frame from outside that
       loop — while the post-processing composer holds its own state — killed
       the renderer process about thirty-five seconds into every visit. The
       shell's warm-up (which runs with the loop parked, where this is safe)
       already builds almost every program a bay needs; what is left compiles on
       arrival in single figures. Correctness beats the last few milliseconds. */
    const firstUse = async () => {
      const node = group.current;
      if (!node) return;
      // Pay the bay's shaders through the composer now, in slices, while the
      // camera is still two stations away — rather than in one lump on the
      // frame the reader scrolls into it.
      await warmThroughComposer(node);
      const near = Math.abs(stationAt(camera) - station) < drawSpan();
      node.visible = near;
      drawn.current = near;
      setStationLights(String(station), near ? lights.current : 0);
    };


    /* ON A PHONE, A DROPLIGHT IS A GLOWING BULB AND NOTHING MORE.
       Every real point light in the scene is another iteration of the shader's
       light loop, run for every lit fragment on the screen — the one cost that
       scales with both the size of the scene AND the size of the display.
       The bays carry nine between them; the bulb geometry, its emissive glow
       and the pool of light painted on the concrete are all still there, so
       what goes missing is a metre of falloff on a lamp the phone frame is
       showing at the size of a thumbnail. */
    if (phoneTier) {
      node.traverse((child) => {
        if ((child as THREE.PointLight).isPointLight) child.visible = false;
      });
      lights.current = 0;
    } else {
      // How many point lights this bay brings. The pad hands back the same
      // number of its own the instant these come on, so the count the shaders
      // were compiled against never moves. See `shop/lights.ts`.
      lights.current = countLights(node);
    }


    const started = performance.now();
    warmSubtree(gl, node, camera, scene).then(() => {
      if (DEBUG) {
        console.log(
          `[shop] station ${station} warm in ${Math.round(performance.now() - started)} ms` +
            ` · lights ${lights.current} · programs ${gl.info.programs?.length ?? 0}` +
            ` · pad ${lightBudget()}`,
        );
      }
      finish();
    });
    // A driver that never reports back cannot be allowed to stall the queue.
    const failsafe = window.setTimeout(finish, 9000);

    return () => {
      dead = true;
      window.clearTimeout(failsafe);
    };
  }, [gl, camera, scene, station]);

  useEffect(
    () => () => {
      // Unmounting a bay takes its lights with it — hand the slots back.
      setStationLights(String(station), 0);
    },
    [station],
  );

  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    const show =
      warm.current && Math.abs(stationAt(state.camera) - station) < drawSpan();

    // The detail cull, on the phone tier, every third frame — the camera is
    // damped and heavy, so nothing can cross two pixels of apparent size in
    // the fiftieth of a second between passes.
    if (phoneTier && show && warm.current && ++cullTick.current % 3 === 0) {
      if (!cullables.current && !building.current) {
        building.current = true;
        void collectCullables(node, (list) => {
          cullables.current = list;
        });
      }
      const list = cullables.current;
      if (list) {
        const eye = state.camera.position;
        for (const item of list) {
          const distance = item.centre.distanceTo(eye);
          item.object.visible = item.radius / Math.max(distance, 0.001) > CULL_RATIO;
        }
      }
    }

    if (show === drawn.current) return;
    drawn.current = show;
    node.visible = show;
    // Same frame, same call stack: the pad compensates before anything is
    // drawn, so the renderer never sees a different number of lights than the
    // one it compiled against.
    setStationLights(String(station), show ? lights.current : 0);
  });

  return (
    <group ref={group} visible={false}>
      {children}
    </group>
  );
}

/**
 * The same warm-then-show treatment for anything outside a station bundle —
 * the shell, the weather, the neon. Reports itself to the boot channel, so the
 * plate at the door holds until the room it is hiding is genuinely ready.
 */
/* Measured with every bay on screen at once, on the build of 2026-08-04:
   stations 1 (3), 4 (2), 6 (2), 2 (1) and 3 (1) — nine point lights across the
   seven bays. Ten, because a bay that gains a lamp costs one recompile of the
   whole building, and a spare costs one dead iteration of the light loop. The
   warning under `?perf` fires if a bay ever pushes past it. */
export function WarmScene({
  target,
  padLights = 10,
}: {
  /** The building itself — everything that is NOT a streaming bay. */
  target: React.RefObject<THREE.Object3D | null>;
  padLights?: number;
}) {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);

  // Before the first compile, not after: the pad has to be part of the light
  // count the very first program is built against.
  installLightPad(scene, padLights, (total) => {
    if (DEBUG) console.warn(`[shop] light pad grew to ${total} — raise padLights`);
  });

  useEffect(() => {
    let dead = false;
    const finish = () => {
      if (dead) return;
      // Frames may start now: everything mounted is linked and uploaded.
      markShellWarm();
      reportWarm("shell");
    };

    /* THE PASSES COMPILE TOO — and `gl.compile` cannot reach them.
       Screen-space AO renders the building again through a depth material, and
       every effect in the chain (bokeh, blur, luminance, the merged effect
       shader) is a program of its own. None of them exist until a frame has
       actually gone through the composer, which is why the first frame after
       the shell was warmed still cost nine seconds.
       So the frames are stepped by hand, here, with the renderer still parked
       and the plate still up: three manual advances and the entire pipeline —
       geometry, depth variants, post chain, render targets — is built. What
       the reader sees when the door rolls up is the fourth frame, not the
       first. */
    const warmShell = async () => {
      const mark = (label: string, from: number) => {
        if (DEBUG) console.log(`[shop]   ${label} ${Math.round(performance.now() - from)} ms`);
        return performance.now();
      };
      let t = performance.now();
      await warmSubtree(gl, target.current ?? scene, camera, scene);
      t = mark("settle+compile", t);
      // Cheap first: the whole building drawn to a postage stamp, which pays
      // most of the driver's translation bill without submitting a frame's
      // worth of work in one go.
      /* No oven pass for the shell: measured, its programs are not the ones
         the composer ends up using (a scene rendered straight to a plain
         target is a different configuration to one rendered through an HDR
         post chain), so it was two seconds spent building programs that were
         then built again. The bays still use it — theirs mostly hit programs
         the shell has already paid for. */

      /* AND THE SAME AGAIN, THROUGH THE COMPOSER.
         Drawing to a plain render target is not the configuration the shop
         actually ships in: the post chain renders into an HDR buffer through
         its own passes, and Direct3D treats that as a different program for
         every material it touches. So the first composed frame was linking
         thirty-odd programs of its own — fifteen seconds in one command
         buffer, straight past the watchdog.
         The answer is the same shape as the oven: the building is hidden, the
         composer is advanced on an almost-empty scene to build its own passes,
         and then the meshes are handed back four at a time with a frame
         between each. Fifteen seconds of work, in fifteen submissions. */
      const drawables: THREE.Object3D[] = [];
      const mirrors: THREE.Object3D[] = [];
      (target.current ?? scene).traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!(mesh.isMesh || (child as THREE.Points).isPoints || (child as THREE.Line).isLine)) return;
        /* The wet-concrete floor renders the ENTIRE shop a second time, every
           frame, into its own buffer — at its own resolution, which the warm
           pass's low DPR does nothing to shrink. Left in the queue it turned a
           warm-up of forty cheap frames into forty expensive ones. It goes
           last, so it costs exactly one. Identified by its own defines rather
           than by class name, which a minified build does not keep. */
        const material = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as
          | THREE.Material
          | undefined;
        const defines = (material as { defines?: Record<string, unknown> } | undefined)?.defines;
        if (defines && ("USE_BLUR" in defines || "USE_DEPTH" in defines)) mirrors.push(child);
        else drawables.push(child);
      });
      drawables.push(...mirrors);
      const wasVisible = drawables.map((object) => object.visible);
      for (const object of drawables) object.visible = false;

      const step = () => {
        try {
          advance(performance.now());
        } catch {
          /* the loop is not running; nothing to warm */
        }
      };

      step();
      await wait(0);
      /* Sixteen at a time, not four: at a fifth of the resolution the frame
         itself is nothing and the only thing being paced is the handful of
         programs each batch introduces. Four meshes per frame meant a hundred
         and fifty frames of overhead for the same work. */
      /* Six. Small enough that no single submission can carry more than a
         handful of first-time programs — which is what the Windows display
         watchdog resets a driver for, taking the WebGL context with it. */
      const BATCH = 6;
      let i = 0;
      while (i < drawables.length) {
        /* The reader can start scrolling immediately — the plate is a beat
           over a page that already works, and nothing locks it. Their scroll
           outranks this warm-up: each slice waits for them to stop, and if
           they never stop (a long thumb-flick down the whole film) the work
           still has to happen, so it goes ahead ONE mesh per frame instead of
           six. A forced slice then costs a frame, not a stutter. */
        const idle = await untilIdle(9000);
        const size = idle ? BATCH : 1;
        for (let k = i; k < Math.min(i + size, drawables.length); k++) {
          drawables[k].visible = wasVisible[k];
        }
        i += size;
        const batchStart = performance.now();
        step();
        if (DEBUG) {
          const ms = performance.now() - batchStart;
          if (ms > 250) {
            console.log(
              `[shop]     batch ${i / BATCH} ${Math.round(ms)} ms · programs ${gl.info.programs?.length ?? 0}`,
            );
          }
        }
        await wait(0);
      }
      for (let i = 0; i < drawables.length; i++) drawables[i].visible = wasVisible[i];
      step();
      t = mark("composer warm", t);
    };
    const started = performance.now();
    const start = window.setTimeout(() => {
      warmShell().then(() => {
        if (DEBUG) {
          console.log(
            `[shop] shell warm in ${Math.round(performance.now() - started)} ms` +
              ` · programs ${gl.info.programs?.length ?? 0} · pad ${lightBudget()}`,
          );
        }
        finish();
      });
    }, 60);
    const failsafe = window.setTimeout(finish, 9000);
    return () => {
      dead = true;
      window.clearTimeout(start);
      window.clearTimeout(failsafe);
    };
  }, [gl, camera, scene]);

  return null;
}
