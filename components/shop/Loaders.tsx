"use client";

import { Suspense, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Clone, useGLTF } from "@react-three/drei";

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
} as const;

/** Poly Pizza vehicles are stylized; they get graded down to match the PBR set. */
const VEHICLES: ReadonlySet<string> = new Set<string>([
  M.challenger,
  M.coupeHoodUp,
  M.charger,
  M.camaro,
  M.primerShell,
  M.rustedShell,
  M.pickup,
]);

/** Everything the doorway and the hoist need — the only bundle that preloads. */
const STATION_ONE = [
  M.challenger,
  M.pickup,
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

/**
 * One pass over a freshly loaded file, applied to the SOURCE materials so every
 * clone inherits it for free.
 *
 * The honest problem flagged by whoever sourced these: the cars are stylized
 * flat-shaded low-poly and the best props are photogrammetry-grade PBR. Side by
 * side in daylight that reads as two art packs. The fix is to commit to the
 * night garage — darken and roughen the toy paint, push everything through the
 * same environment intensity, and let pooled tungsten and silhouette carry the
 * frame instead of surface detail.
 */
function grade(scene: THREE.Object3D, isVehicle: boolean) {
  if (GRADED.has(scene)) return;
  GRADED.add(scene);

  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const entry of list) {
      const material = entry as THREE.MeshStandardMaterial;
      if (!material?.isMeshStandardMaterial) continue;

      if (isVehicle) {
        // Knock the plastic out of it: darker paint, a little specular life,
        // and less of the environment than the real PBR props take.
        tame(material.color, 0.32, 0.3);
        material.roughness = 0.5;
        material.metalness = 0.3;
        material.envMapIntensity = 0.6;
      } else if (material.map) {
        // Photogrammetry props already carry their own values — leave them be.
        material.envMapIntensity = 1.0;
      } else {
        // Flat-colour Poly Pizza dressing. Left alone, a rack of primary-colour
        // barrels reads as a toy shelf next to the PBR set; taming it is what
        // lets the two sources share a bay.
        tame(material.color, 0.5, 0.42);
        material.roughness = Math.max(material.roughness, 0.6);
        material.envMapIntensity = 0.75;
      }
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
  grade(gltf.scene, VEHICLES.has(url));
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
};

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
}: PlacedProps) {
  const scene = useShopModel(url);

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
        <group rotation={fit.euler}>
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
