"use client";

import { Suspense, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Clone, useGLTF } from "@react-three/drei";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { ContactShadow } from "./materials";
import { stationAt } from "./world";

/* ─────────────────────────────────────────────────────────────────────────────
   THE MODEL LIBRARY

   `public/models/` holds 105 verified CC0 / CC-BY .glb files, ~140 MB. Loading
   all of them would be indefensible, so 35 do all the work — chosen for what
   they contribute per byte, not for coverage.

     station 0–1   9 files   9.7 MB   preloaded (the establishing + hero shot)
     station 2    10 files   5.1 MB
     station 3     7 files   6.1 MB
     station 4     3 files   0.3 MB
     station 5     4 files   5.8 MB
     station 6     2 files   0.7 MB
                  ────────────────────
                  35 files  ~27.7 MB   (budget: 35 MB)

   Nothing past station 1 is fetched until the camera is within ~1.4 stations
   of it, so first paint downloads the doorway and the hoist and nothing else.
   Repeats are CLONES of a single load — one fetch per file, ever.
   ────────────────────────────────────────────────────────────────────────── */

const BASE = "/models/";

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
  pipesStock: `${BASE}prop-pipes-stock.glb`,
  tyreTruck: `${BASE}prop-tyre-truck.glb`,
  metalDoor: `${BASE}prop-metal-door.glb`,
  flatnose: `${BASE}truck-old-flatnose.glb`,
  convertible: `${BASE}car-convertible-50s.glb`,
  prewarDonor: `${BASE}car-prewar-hotrod-donor.glb`,

  /* ── density pass (the wow round): the best remaining bytes-per-look in the
        105-file library — a real tool chest, a parts cart, a work light, air
        for the tyres, and the handful of hand tools a bench is dressed with ── */
  toolChest: `${BASE}prop-tool-chest-metal.glb`,
  storageCart: `${BASE}prop-storage-cart-industrial.glb`,
  searchlight: `${BASE}prop-searchlight-portable.glb`,
  tirePump: `${BASE}prop-tire-pump.glb`,
  oilCan: `${BASE}prop-oil-can-small.glb`,
  barrelA: `${BASE}prop-barrel-rusted-a.glb`,
  barrelC: `${BASE}prop-barrel-rusted-c.glb`,
  drill: `${BASE}prop-drill.glb`,
  hammer: `${BASE}prop-hammer.glb`,
  pliers: `${BASE}prop-pliers.glb`,
  funnel: `${BASE}prop-funnel.glb`,
  propaneBottle: `${BASE}prop-gas-bottle-propane.glb`,
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
  M.flatnose,
  M.prewarDonor,
]);

function finishOf(url: string): Finish {
  if (PAINTED.has(url)) return "paint";
  if (BARE.has(url)) return "matte";
  return "prop";
}

/** Everything the doorway and the hoist need — the only bundle that preloads.
    The flatnose is here because it now rides the second hoist in station 1;
    at 289 KB it is the cheapest truck in the library. */
const STATION_ONE = [
  M.challenger,
  M.pickup,
  M.flatnose,
  M.toolCart,
  M.tyre,
  M.rim,
  M.drum,
  M.extinguisher,
  M.droplight,
  M.pallet,
];

for (const url of STATION_ONE) useGLTF.preload(url, false);

/* ── Load, grade, measure ───────────────────────────────────────────────── */

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
        material.needsUpdate = true;
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
        material.needsUpdate = true;
        rebuilt.push(material);
        continue;
      }

      if (isRubber) {
        material.color.setRGB(0.018, 0.019, 0.022);
        material.roughness = 0.94;
        material.metalness = 0;
        material.envMapIntensity = 0.35;
        material.needsUpdate = true;
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
  const gltf = useGLTF(url, false);
  grade(gltf.scene, finishOf(url));
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
  useTint(clone, tint);

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
    <group position={position} rotation={[tilt?.[0] ?? 0, yaw, tilt?.[1] ?? 0]}>
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

/* ── Lazy station bundles ───────────────────────────────────────────────── */

/**
 * Nothing past the hoist is fetched until the reader is heading for it. The
 * gate arms once and stays armed — a reader who scrolls back up should not
 * trigger a second round of network — and everything inside sits behind a
 * Suspense boundary with a null fallback, so the shop paints on frame one and
 * the dressing arrives as it arrives.
 */
export function StationBundle({
  station,
  span = 1.45,
  children,
}: {
  station: number;
  span?: number;
  children: ReactNode;
}) {
  const [armed, setArmed] = useState(station <= 1);

  useFrame((state) => {
    if (armed) return;
    if (Math.abs(stationAt(state.camera) - station) < span) setArmed(true);
  });

  if (!armed) return null;
  return <Suspense fallback={null}>{children}</Suspense>;
}
