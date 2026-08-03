"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  PerformanceMonitor,
  useTexture,
} from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";

import { StationBundle } from "./shop/Loaders";
import {
  StationDoor,
  StationDoorway,
  StationEngineRoom,
  StationFabCorner,
  StationHoist,
  StationOffice,
  StationTuningBay,
} from "./shop/Stations";
import { fadeGlow, useConeGlow, useRadialGlow } from "./shop/materials";
import {
  ARC_BLUE,
  BAY_BLACK,
  CEIL,
  DOOR_H,
  DOOR_HALF,
  DOOR_Z,
  FOG_GREY,
  FRONT_Z,
  HALF_W,
  LENGTH,
  MID_Z,
  NEON_BLOOM,
  STATIONS,
  STREET,
  TUNGSTEN,
  buildInstances,
  disposeInstanced,
  flickerAt,
  influence,
  introAt,
  railOf,
  stationEase,
  CAM_CURVE,
  LOOK_CURVE,
  type InstanceSpec,
} from "./shop/world";

/* ─────────────────────────────────────────────────────────────────────────────
   THE SHOP — one continuous building, fixed behind the whole document.

   Decoration, never content. Every word a reader or an answer engine needs is
   in the server-rendered HTML in front of this canvas (AI-SEO playbook §3: no
   AI crawler except Googlebot executes JS). The host is fixed, aria-hidden,
   pointer-events-none and sits behind the page at z-index -10 — it holds no
   copy, takes no clicks and cannot shift a pixel of layout.

   The building, the light and the weather are built from THREE primitives and a
   procedural Lightformer environment: no HDRI, no CDN, no preset. What is IN
   the building is 35 real models out of the 105 licence-cleared .glb files in
   `public/models/`, plus the machines nobody publishes for free — a two-post
   lift, a blown V8, an engine stand, a crane, jacks and a dyno — modelled from
   primitives in `shop/Hardware.tsx`.

   Scroll maps to a camera rail through seven stations:
     0 DOORWAY · 1 HOIST · 2 ENGINE ROOM · 3 FAB CORNER
     4 TUNING BAY · 5 OFFICE WALL · 6 ROLL-UP DOOR
   ────────────────────────────────────────────────────────────────────────── */

/** Module-level so the effect is never rebuilt on a re-render. */
/* Halved. At the old strength the corrugated cladding — ~190 high-contrast
   vertical edges — fringed visibly red/blue and read as a glitch rather than a
   lens. Brightening the room made it worse, so the lens got quieter. */
const CHROMATIC_OFFSET = new THREE.Vector2(0.00016, 0.00024);

/* ── The photographs ────────────────────────────────────────────────────────
   The freestanding lightbox prints that used to stand in for cars are gone —
   there are real cars in the bays now. What survives is the office wall, which
   was never a stand-in: it is the reputation beat, and those are real builds.
   Five files instead of seven, ~1 MB lighter, and none of it blocks paint. */

const WALL_PHOTO = {
  d100: "/shop/car-d100.jpg",
  coupe: "/shop/car-green-coupe.jpg",
  muscle: "/shop/car-black-muscle.jpg",
  bluePickup: "/shop/car-blue-pickup.jpg",
  badge: "/shop/shop-storefront-sign.jpg",
} as const;

type PhotoKey = keyof typeof WALL_PHOTO;

const ASPECT: Record<PhotoKey, number> = {
  d100: 1440 / 1795,
  coupe: 977 / 710,
  muscle: 1536 / 2048,
  bluePickup: 1939 / 1177,
  badge: 1536 / 2048,
};

useTexture.preload(Object.values(WALL_PHOTO) as string[]);

/* ── Shell ──────────────────────────────────────────────────────────────── */

function Shell() {
  return (
    <group>
      {/* Sealed concrete. Low mirror, heavy blur — wet-looking, not a skating rink. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MID_Z]}>
        <planeGeometry args={[HALF_W * 2 + 1, LENGTH]} />
        <MeshReflectorMaterial
          resolution={256}
          blur={[380, 110]}
          mixBlur={1}
          // 7, not 15. At 15 the floor multiplied every specular highlight it
          // caught — one hot chrome header printed a solid white bar across the
          // concrete. This wants wet-looking sheen, not a second light source.
          mixStrength={6}
          mirror={0}
          depthScale={1.15}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#292c33"
          metalness={0.15}
          roughness={0.74}
        />
      </mesh>

      {/* Side walls */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (HALF_W + 0.2), CEIL / 2, MID_Z]}>
          <boxGeometry args={[0.4, CEIL, LENGTH]} />
          <meshStandardMaterial color="#2b2f36" roughness={0.92} metalness={0.08} />
        </mesh>
      ))}

      {/* Ceiling — catches just enough tungsten to read as a lid, not a void. */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CEIL, MID_Z]}>
        <planeGeometry args={[HALF_W * 2 + 0.4, LENGTH]} />
        <meshStandardMaterial color="#1f2229" roughness={1} metalness={0} />
      </mesh>

      {/* Grimy band at hand height down both walls, as the layout notes call for */}
      {[-1, 1].map((side) => (
        <mesh
          key={`band-${side}`}
          position={[side * (HALF_W - 0.01), 1.05, MID_Z]}
          rotation={[0, -side * (Math.PI / 2), 0]}
        >
          <planeGeometry args={[LENGTH, 1.5]} />
          {/* Only a shade under the wall. At a wider gap its top edge cut a hard
              horizontal line clean across the frame at bumper-height camera
              stations, which read as a rendering seam, not as grime. */}
          <meshStandardMaterial color="#25282f" roughness={0.98} metalness={0.04} />
        </mesh>
      ))}

      {/* Front wall, behind the establishing shot */}
      <mesh position={[0, CEIL / 2, FRONT_Z]}>
        <boxGeometry args={[HALF_W * 2 + 0.4, CEIL, 0.4]} />
        <meshStandardMaterial color="#272a32" roughness={0.94} metalness={0.08} />
      </mesh>

      {/* Far wall — two piers and a header framing the roll-up door */}
      {[-1, 1].map((side) => (
        <mesh
          key={`pier-${side}`}
          position={[side * ((HALF_W + 0.2 + DOOR_HALF) / 2), CEIL / 2, DOOR_Z]}
        >
          <boxGeometry args={[HALF_W + 0.2 - DOOR_HALF, CEIL, 0.5]} />
          <meshStandardMaterial color="#272a32" roughness={0.92} metalness={0.09} />
        </mesh>
      ))}
      <mesh position={[0, (DOOR_H + CEIL) / 2, DOOR_Z]}>
        <boxGeometry args={[DOOR_HALF * 2, CEIL - DOOR_H, 0.5]} />
        <meshStandardMaterial color="#272a32" roughness={0.92} metalness={0.09} />
      </mesh>

      {/* Bay lines in yellow shop paint — the only signage laid in paint.
          Lit, not `meshBasicMaterial`: unlit paint holds the same value in a
          dark corner as under a bay light, so at grazing angles the lines read
          as constant-brightness scan lines ruled across the floor rather than
          as paint. A standard material lets them fall off into the dark. */}
      {[-7.2, -19.5, -30.5, -44].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, z]}>
          <planeGeometry args={[13, 0.09]} />
          <meshStandardMaterial color="#7d6a41" roughness={0.92} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Corrugated cladding down both walls — ~340 ribs, one draw call.
 *
 * Pitch matters more than anything else here. At the original 0.72 m spacing
 * with a 0.13 m rib the wall read as a PICKET FENCE — wide dark gaps between
 * bright slats — and once the room was brought up to a legible exposure that
 * barcode became the loudest thing in several frames. Real cladding is a fine,
 * shallow, low-contrast ripple: tighter pitch, shallower relief, and a colour
 * only a step off the wall behind it, so it reads as surface, not as structure.
 */
function Corrugation() {
  const ribs = useMemo(() => {
    const geometry = new THREE.BoxGeometry(0.1, CEIL - 0.2, 0.06);
    const material = new THREE.MeshStandardMaterial({
      color: "#363a43",
      roughness: 0.74,
      metalness: 0.24,
    });

    const specs: InstanceSpec[] = [];
    for (let z = FRONT_Z - 0.6; z > DOOR_Z; z -= 0.4) {
      specs.push({ position: [-(HALF_W - 0.02), CEIL / 2, z], rotation: [0, Math.PI / 2, 0] });
      specs.push({ position: [HALF_W - 0.02, CEIL / 2, z], rotation: [0, Math.PI / 2, 0] });
    }
    return buildInstances(geometry, material, specs);
  }, []);

  useEffect(() => () => disposeInstanced(ribs), [ribs]);

  return <primitive object={ribs} />;
}

/** Roof structure — open web trusses every 5.5 units. */
function Trusses() {
  const beams = useMemo(() => {
    const geometry = new THREE.BoxGeometry(HALF_W * 2, 0.3, 0.22);
    const material = new THREE.MeshStandardMaterial({
      color: "#3d414a",
      roughness: 0.68,
      metalness: 0.28,
    });

    const specs: InstanceSpec[] = [];
    for (let z = FRONT_Z - 2; z > DOOR_Z + 1; z -= 5.5) {
      specs.push({ position: [0, CEIL - 0.45, z] });
    }
    return buildInstances(geometry, material, specs);
  }, []);

  useEffect(() => () => disposeInstanced(beams), [beams]);

  return <primitive object={beams} />;
}

/**
 * Strip fixtures on chain down the long axis, ~4 m apart, per the lighting
 * research. They are pure emissive — no light attached — so the room reads as
 * properly lit and bloom does the rest, without adding eighteen point lights to
 * every shader in the scene.
 */
function CeilingStrips() {
  const strips = useMemo(() => {
    const geometry = new THREE.BoxGeometry(0.16, 0.09, 2.5);
    const material = new THREE.MeshStandardMaterial({
      color: "#0a0a0c",
      emissive: "#ffcf9e",
      emissiveIntensity: 1.35,
      toneMapped: false,
    });

    const specs: InstanceSpec[] = [];
    let flip = false;
    for (let z = FRONT_Z - 4; z > DOOR_Z + 3; z -= 4.2) {
      specs.push({ position: [flip ? -4.6 : 4.6, CEIL - 1.05, z] });
      flip = !flip;
    }
    return buildInstances(geometry, material, specs);
  }, []);

  const housings = useMemo(() => {
    const geometry = new THREE.BoxGeometry(0.34, 0.12, 2.7);
    const material = new THREE.MeshStandardMaterial({
      color: "#3d4048",
      roughness: 0.52,
      metalness: 0.42,
    });

    const specs: InstanceSpec[] = [];
    let flip = false;
    for (let z = FRONT_Z - 4; z > DOOR_Z + 3; z -= 4.2) {
      specs.push({ position: [flip ? -4.6 : 4.6, CEIL - 0.96, z] });
      flip = !flip;
    }
    return buildInstances(geometry, material, specs);
  }, []);

  useEffect(() => {
    return () => {
      disposeInstanced(strips);
      disposeInstanced(housings);
    };
  }, [strips, housings]);

  return (
    <group>
      <primitive object={housings} />
      <primitive object={strips} />
    </group>
  );
}

/* ── Light ──────────────────────────────────────────────────────────────────
   Warm pools in darkness, but no longer a cave: the shop was reading as a black
   rectangle behind the copy, so ambient, environment and fixture power are all
   up, the concrete and the cladding are a stop lighter, and a hemisphere fill
   keeps the corners from crushing. Silhouette still wins over surface detail —
   that is what holds the stylized vehicles and the PBR props together. */

function ShopLight({
  position,
  delay = 0,
  power = 64,
  drop = 1.9,
  spread = 3.1,
}: {
  position: [number, number, number];
  delay?: number;
  power?: number;
  drop?: number;
  /** Radius of the visible beam at the floor. Narrow it where the camera rail
      passes close, or the reader ends up standing inside the cone. */
  spread?: number;
}) {
  const disc = useRef<THREE.MeshStandardMaterial>(null);
  const bulb = useRef<THREE.PointLight>(null);
  const beam = useRef<THREE.Mesh>(null);
  const pool = useRef<THREE.Mesh>(null);

  const beamMaterial = useConeGlow(TUNGSTEN, 0.095);
  const poolMaterial = useRadialGlow(TUNGSTEN, 0.27, 2.6);

  const height = position[1];

  useFrame((state) => {
    const k = introAt(state.clock.elapsedTime - delay);
    if (disc.current) disc.current.emissiveIntensity = 2.9 * k;
    if (bulb.current) bulb.current.intensity = power * k;
    fadeGlow(beam.current, 0.095 * k);
    fadeGlow(pool.current, 0.27 * k);
  });

  return (
    <group>
      <group position={position}>
        {/* Drop rod */}
        <mesh position={[0, drop / 2, 0]}>
          <cylinderGeometry args={[0.022, 0.022, drop, 6]} />
          <meshStandardMaterial color="#3a3c43" roughness={0.6} metalness={0.32} />
        </mesh>
        {/* Shade */}
        <mesh>
          <coneGeometry args={[0.56, 0.44, 18, 1, true]} />
          <meshStandardMaterial
            color="#5a5e67"
            side={THREE.DoubleSide}
            roughness={0.42}
            metalness={0.36}
          />
        </mesh>
        {/* Emissive face — the only thing bloom is allowed to see up here */}
        <mesh position={[0, -0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.47, 18]} />
          <meshStandardMaterial
            ref={disc}
            color="#000000"
            emissive={TUNGSTEN}
            emissiveIntensity={0}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <pointLight
          ref={bulb}
          color={TUNGSTEN}
          intensity={0}
          distance={19}
          decay={2}
          position={[0, -0.3, 0]}
        />
        {/* The beam itself, as the dust would show it */}
        <mesh ref={beam} position={[0, -height / 2 - 0.2, 0]}>
          <coneGeometry args={[spread, height, 22, 1, true]} />
          <primitive object={beamMaterial} attach="material" />
        </mesh>
      </group>

      {/* Pool on the concrete, so the floor reads as lit rather than tinted */}
      <mesh
        ref={pool}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position[0], 0.014, position[2]]}
      >
        <circleGeometry args={[spread * 1.4, 28]} />
        <primitive object={poolMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function Ambience() {
  const ambient = useRef<THREE.AmbientLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);
  const street = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const k = introAt(state.clock.elapsedTime);
    // Restraint on purpose. Legibility is bought in the CSS layers in front of
    // the canvas, NOT by flooding the room: ambient and hemisphere this high
    // flatten the shop into an evenly-lit grey box and the whole "warm pools in
    // darkness" read is gone. Keep the fill low and let the bay lights below do
    // the work — contrast is what makes it look like a photograph.
    if (ambient.current) ambient.current.intensity = 0.26 * k;
    if (fill.current) fill.current.intensity = 0.58 * k;
    if (street.current) street.current.intensity = 42 * k;
  });

  return (
    <>
      <ambientLight ref={ambient} color="#5c6478" intensity={0} />
      {/* Warm off the floor, cool off the roof — one light, no shadow cost. */}
      <hemisphereLight
        ref={fill}
        color="#93a1bd"
        groundColor="#40342a"
        intensity={0}
      />

      {/* Up ~30% against the lowered ambient — same net brightness on the
          benches and bodywork, but it now ARRIVES as pools instead of wash. */}
      <ShopLight position={[0.4, 5.2, 1.6]} delay={0} power={80} spread={3.4} />
      <ShopLight position={[-3.2, 5.1, -7.0]} delay={0.16} power={100} />
      <ShopLight position={[3.6, 5.1, -17.2]} delay={0.34} power={88} />
      <ShopLight position={[-5.6, 5.1, -26.8]} delay={0.52} power={86} />
      <ShopLight position={[1.2, 5.1, -36.8]} delay={0.7} power={86} />
      {/* Hung close to the office wall — this one is a wall wash, not a bay
          light, so the gallery is actually readable when the camera arrives. */}
      <ShopLight
        position={[-7.4, 4.8, -43.4]}
        delay={0.88}
        power={34}
        drop={1.5}
        spread={1.5}
      />
      <ShopLight position={[2.8, 5.1, -47.6]} delay={1.02} power={78} />

      {/* Sodium spill from the street, just inside the open bay */}
      <pointLight
        ref={street}
        color={STREET}
        intensity={0}
        distance={30}
        decay={2}
        position={[0, 3.4, -55]}
      />
    </>
  );
}

/* ── Neon ───────────────────────────────────────────────────────────────────
   Seven-segment tube layout built from capsules rather than fetched type, so
   the sign is guaranteed to light regardless of network. */

const SEG_W = 0.74;
const SEG_V = 0.7;
const Y_TOP = 0.76;
const Y_MID = 0.38;

type Segment = { x: number; y: number; length: number; horizontal: boolean };

const SEGMENT_MAP: Record<string, Segment> = {
  a: { x: 0, y: Y_TOP, length: SEG_W, horizontal: true },
  b: { x: SEG_W / 2, y: Y_MID, length: SEG_V, horizontal: false },
  c: { x: SEG_W / 2, y: -Y_MID, length: SEG_V, horizontal: false },
  d: { x: 0, y: -Y_TOP, length: SEG_W, horizontal: true },
  e: { x: -SEG_W / 2, y: -Y_MID, length: SEG_V, horizontal: false },
  f: { x: -SEG_W / 2, y: Y_MID, length: SEG_V, horizontal: false },
  g: { x: 0, y: 0, length: SEG_W, horizontal: true },
};

const GLYPHS: Record<string, string[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "2": ["a", "b", "g", "e", "d"],
  "4": ["f", "g", "b", "c"],
};

const SIGN = "2240";
const DIGIT_PITCH = 1.06;
const TUBE_RADIUS = 0.055;

const TUBES = SIGN.split("").flatMap((glyph, index) => {
  const offset = (index - (SIGN.length - 1) / 2) * DIGIT_PITCH;
  return (GLYPHS[glyph] ?? []).map((key) => {
    const seg = SEGMENT_MAP[key];
    return {
      id: `${index}-${key}`,
      position: [offset + seg.x, seg.y, 0] as [number, number, number],
      rotation: [0, 0, seg.horizontal ? Math.PI / 2 : 0] as [number, number, number],
      length: seg.length,
    };
  });
});

/** The signature sign — angled off the right wall so it reads from the doorway. */
function NeonSign() {
  const tubes = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const glow = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const k = introAt(elapsed - 0.5) * flickerAt(elapsed);
    for (const material of tubes.current) {
      if (material) material.emissiveIntensity = 3.5 * k;
    }
    if (glow.current) glow.current.intensity = 24 * k;
  });

  return (
    <group position={[HALF_W - 0.35, 4.5, -10.5]} rotation={[0, -Math.PI / 2 + 0.62, 0]}>
      {/* Rust first, neon second (concept §2.3) */}
      <mesh position={[0, 0, -0.14]}>
        <boxGeometry args={[4.6, 2.5, 0.1]} />
        <meshStandardMaterial color="#6b4b31" roughness={0.86} metalness={0.26} />
      </mesh>
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[4.32, 2.24, 0.03]} />
        <meshStandardMaterial color="#2a231d" roughness={0.95} metalness={0.1} />
      </mesh>

      {TUBES.map((tube, i) => (
        <mesh key={tube.id} position={tube.position} rotation={tube.rotation}>
          <capsuleGeometry
            args={[TUBE_RADIUS, Math.max(tube.length - TUBE_RADIUS * 2, 0.05), 4, 10]}
          />
          <meshStandardMaterial
            ref={(material) => {
              tubes.current[i] = material;
            }}
            color="#2a0c0c"
            emissive={NEON_BLOOM}
            emissiveIntensity={0}
            roughness={0.35}
            metalness={0}
            toneMapped={false}
          />
        </mesh>
      ))}

      <pointLight
        ref={glow}
        color={NEON_BLOOM}
        intensity={0}
        distance={14}
        decay={2}
        position={[0, 0, 1.2]}
      />
    </group>
  );
}

const TUNING_BARS: Array<{
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
}> = [
  { position: [0, 0.52, 0], rotation: [0, 0, Math.PI / 2], length: 3.2 },
  { position: [0, -0.52, 0], rotation: [0, 0, Math.PI / 2], length: 3.2 },
  { position: [-1.6, 0, 0], rotation: [0, 0, 0], length: 1.04 },
  { position: [1.6, 0, 0], rotation: [0, 0, 0], length: 1.04 },
];

/** Second neon — a bare tube rectangle over the tuning bay gauges. */
function TuningNeon() {
  const rails = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const glow = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    // Breathes a little harder as the reader arrives in the bay.
    const lift = 0.72 + 0.4 * influence(railOf(state.camera).t, 4);
    const k = introAt(elapsed - 1.1) * lift;
    for (const material of rails.current) {
      if (material) material.emissiveIntensity = 3.1 * k;
    }
    if (glow.current) glow.current.intensity = 18 * k;
  });

  return (
    <group position={[HALF_W - 0.4, 3.5, -36.6]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[3.6, 1.4, 0.08]} />
        <meshStandardMaterial color="#63462d" roughness={0.88} metalness={0.24} />
      </mesh>
      {TUNING_BARS.map((bar, i) => (
        <mesh key={i} position={bar.position} rotation={bar.rotation}>
          <capsuleGeometry args={[0.045, bar.length, 4, 8]} />
          <meshStandardMaterial
            ref={(material) => {
              rails.current[i] = material;
            }}
            color="#2a0c0c"
            emissive={NEON_BLOOM}
            emissiveIntensity={0}
            roughness={0.35}
            metalness={0}
            toneMapped={false}
          />
        </mesh>
      ))}
      <pointLight
        ref={glow}
        color={NEON_BLOOM}
        intensity={0}
        distance={12}
        decay={2}
        position={[0, 0, 1]}
      />
    </group>
  );
}

/* ── The office wall ────────────────────────────────────────────────────────
   A framed print hung flat on the corkboard — the only photographs left in the
   building, and the only ones that were ever meant to be here. */

function WallFrame({
  map,
  aspect,
  height,
  position,
  rotation = 0,
}: {
  map: THREE.Texture;
  aspect: number;
  height: number;
  position: [number, number, number];
  rotation?: number;
}) {
  const width = height * aspect;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[width + 0.14, height + 0.14, 0.06]} />
        <meshStandardMaterial color="#5f4a3e" roughness={0.7} metalness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={map}
          map-colorSpace={THREE.SRGBColorSpace}
          map-anisotropy={4}
          emissiveMap={map}
          emissive="#ffffff"
          emissiveIntensity={0.07}
          roughness={0.62}
          metalness={0.04}
        />
      </mesh>
    </group>
  );
}

/**
 * The gallery, behind one Suspense boundary and one texture hook. Nothing here
 * blocks the first frame: the shop paints, the prints arrive.
 */
function OfficeGallery() {
  const maps = useTexture(WALL_PHOTO);

  return (
    <group>
      {/* Corkboard the gallery hangs on */}
      <mesh position={[-(HALF_W - 0.14), 2.9, -43.4]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[7.2, 4.2, 0.1]} />
        <meshStandardMaterial color="#2f251c" roughness={0.94} metalness={0.05} />
      </mesh>
      <mesh position={[-(HALF_W - 0.08), 2.9, -43.4]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[7.4, 4.4, 0.04]} />
        <meshStandardMaterial color="#5e4126" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* X is 0.28 off the wall so the frames hang PROUD of the corkboard
          rather than inside it. */}
      <WallFrame
        map={maps.badge}
        aspect={ASPECT.badge}
        height={2.3}
        position={[-(HALF_W - 0.28), 3.05, -43.4]}
        rotation={Math.PI / 2}
      />
      <WallFrame
        map={maps.d100}
        aspect={ASPECT.d100}
        height={1.15}
        position={[-(HALF_W - 0.28), 3.5, -41.1]}
        rotation={Math.PI / 2}
      />
      <WallFrame
        map={maps.coupe}
        aspect={ASPECT.coupe}
        height={0.9}
        position={[-(HALF_W - 0.28), 2.15, -41.1]}
        rotation={Math.PI / 2}
      />
      <WallFrame
        map={maps.bluePickup}
        aspect={ASPECT.bluePickup}
        height={0.86}
        position={[-(HALF_W - 0.28), 3.55, -45.7]}
        rotation={Math.PI / 2}
      />
      <WallFrame
        map={maps.muscle}
        aspect={ASPECT.muscle}
        height={1.2}
        position={[-(HALF_W - 0.28), 2.2, -45.6]}
        rotation={Math.PI / 2}
      />
    </group>
  );
}

/* ── The arc at the fab bench ───────────────────────────────────────────── */

/** One brief bright beat on arrival: an arc struck at the welding cart. */
function WelderArc() {
  const light = useRef<THREE.PointLight>(null);
  const flare = useRef<THREE.Mesh>(null);
  const material = useRadialGlow(ARC_BLUE, 0.44, 1.9);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const arrival = influence(railOf(state.camera).t, 3);
    // Stutter, not a strobe — two beating frequencies read as a struck arc.
    const stutter = Math.max(
      0,
      0.45 + 0.55 * Math.sin(elapsed * 41) * Math.sin(elapsed * 9.3),
    );
    const k = arrival * stutter * introAt(elapsed);

    if (light.current) light.current.intensity = 74 * k;
    if (flare.current) {
      flare.current.visible = k > 0.02;
      const s = 0.6 + k * 1.4;
      flare.current.scale.set(s, s, s);
    }
    fadeGlow(flare.current, 0.44 * k);
  });

  return (
    <group position={[-6.4, 1.16, -25.4]}>
      <pointLight ref={light} color={ARC_BLUE} intensity={0} distance={12} decay={2} />
      <mesh ref={flare} visible={false}>
        <planeGeometry args={[2.4, 2.4]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}

/* ── Station 6 — the roll-up door and the night behind it ───────────────── */

function RollUpDoor() {
  return (
    <group>
      {/* The curtain, rolled up above the opening */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[0, DOOR_H + 0.16 + i * 0.15, DOOR_Z + 0.42]}>
          <boxGeometry args={[DOOR_HALF * 2 - 0.3, 0.12, 0.44 - i * 0.05]} />
          <meshStandardMaterial color="#43474f" roughness={0.6} metalness={0.34} />
        </mesh>
      ))}
      {/* Guide rails */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (DOOR_HALF - 0.1), DOOR_H / 2, DOOR_Z + 0.42]}>
          <boxGeometry args={[0.18, DOOR_H, 0.3]} />
          <meshStandardMaterial color="#43474f" roughness={0.58} metalness={0.36} />
        </mesh>
      ))}
    </group>
  );
}

const TOWERS = [
  { x: -34, z: -104, w: 13, h: 30 },
  { x: -18, z: -96, w: 10, h: 22 },
  { x: -4, z: -112, w: 15, h: 42 },
  { x: 12, z: -98, w: 11, h: 26 },
  { x: 28, z: -108, w: 14, h: 35 },
  { x: 44, z: -95, w: 10, h: 19 },
] as const;

function NightOutside() {
  const sky = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new THREE.Color("#121829") },
          uHorizon: { value: new THREE.Color("#46536e") },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          uniform vec3 uTop;
          uniform vec3 uHorizon;
          void main() {
            // The towers only occupy the lower ~2/3 of this plane. Holding the
            // brighter horizon colour up through that band is what lets them
            // read as SILHOUETTES — at the old 0.0 start they were the same
            // value as the sky behind them and only their windows were visible,
            // so the skyline looked like confetti floating in the dark.
            gl_FragColor = vec4(mix(uHorizon, uTop, smoothstep(0.3, 1.0, vUv.y)), 1.0);
          }
        `,
      }),
    [],
  );

  /* Lit windows on a unit plane. The mesh scale carries the tower's real size
     into the shader, so the window grid is a fixed number of METRES rather than
     a fixed number of cells — every tower gets the same window, whatever its
     size — and the whole thing fades with distance so the skyline sits back
     behind the haze instead of shouting through the door. */
  const windows = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        fog: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color("#e8c489") } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          varying vec2 vScale;
          varying float vDepth;
          void main() {
            vUv = uv;
            vScale = vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz));
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vDepth = -mv.z;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          varying vec2 vScale;
          varying float vDepth;
          uniform vec3 uColor;
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
          }
          void main() {
            // Finer than life-size on purpose: at ~100 units out, metre-scale
            // panes render as fat chunks and the towers read as Lego. Halving
            // the cell doubles the count and it resolves into a skyline.
            vec2 grid = max(floor(vScale / vec2(0.5, 0.72)), vec2(3.0));
            vec2 cell = floor(vUv * grid);
            vec2 f = fract(vUv * grid);
            float lit = step(0.78, hash(cell));
            float pane =
              step(0.22, f.x) * step(f.x, 0.78) *
              step(0.26, f.y) * step(f.y, 0.74);
            float atten = 1.0 - smoothstep(45.0, 120.0, vDepth);
            float a = lit * pane * 0.72 * atten;
            gl_FragColor = vec4(uColor * a, a);
          }
        `,
      }),
    [],
  );

  useEffect(
    () => () => {
      sky.dispose();
      windows.dispose();
    },
    [sky, windows],
  );

  return (
    <group>
      {/* Sky */}
      <mesh position={[0, 26, -136]}>
        <planeGeometry args={[260, 120]} />
        <primitive object={sky} attach="material" />
      </mesh>

      {/* Skyline */}
      {TOWERS.map((t) => (
        <group key={`${t.x}:${t.z}`}>
          <mesh position={[t.x, t.h / 2, t.z]}>
            <boxGeometry args={[t.w, t.h, 9]} />
            {/* `fog={false}` is load-bearing. These towers stand 95–112 units
                out, past the fog far plane, so with fog on they resolved to
                FLAT FOG COLOUR — which is lighter than the night sky behind
                them. The silhouette inverted: pale slabs with dark gaps, and
                the lit windows read as confetti floating in front of nothing.
                Out of the fog they are solid black cut-outs again. */}
            <meshStandardMaterial color="#080b11" roughness={1} metalness={0} fog={false} />
          </mesh>
          <mesh
            position={[t.x, t.h / 2, t.z + 4.55]}
            scale={[t.w * 0.88, t.h * 0.9, 1]}
          >
            <planeGeometry args={[1, 1]} />
            <primitive object={windows} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Wet asphalt out front */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -92]}>
        <planeGeometry args={[220, 70]} />
        <meshStandardMaterial color="#101319" roughness={0.42} metalness={0.2} fog={false} />
      </mesh>

      <Headlights offset={0} speed={2.6} />
      <Headlights offset={34} speed={-1.9} />
    </group>
  );
}

/** Traffic on the road outside — two lamps and a smear of glow, nothing more. */
function Headlights({ offset, speed }: { offset: number; speed: number }) {
  const rig = useRef<THREE.Group>(null);
  const glow = useRadialGlow("#fff2d8", 0.55, 2);

  useFrame((state) => {
    if (!rig.current) return;
    const span = 80;
    const travel = (((state.clock.elapsedTime * speed + offset) % span) + span) % span;
    rig.current.position.x = travel - span / 2;
  });

  return (
    <group ref={rig} position={[0, 0.62, -66]}>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <sphereGeometry args={[0.11, 8, 8]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#fff2d8"
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.05, 0.2]}>
        <planeGeometry args={[4.2, 2.2]} />
        <primitive object={glow} attach="material" />
      </mesh>
    </group>
  );
}

/** Cold haze rolling in through the open bay. */
function Haze() {
  const sheets = useRef<THREE.Group>(null);
  const material = useRadialGlow("#8ea9d6", 0.17, 1.4);

  useFrame((state) => {
    if (!sheets.current) return;
    const elapsed = state.clock.elapsedTime;
    sheets.current.position.z = -50 + Math.sin(elapsed * 0.07) * 2.4;
    sheets.current.position.x = Math.sin(elapsed * 0.05) * 1.6;
  });

  return (
    <group ref={sheets}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 1.6 - 1.6, 1.7 + i * 0.4, -i * 2.4]}>
          <planeGeometry args={[16, 7]} />
          <primitive object={material} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* ── Dust ───────────────────────────────────────────────────────────────── */

function Dust({ count = 460 }: { count?: number }) {
  const cloud = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = THREE.MathUtils.randFloatSpread(15);
      array[i * 3 + 1] = THREE.MathUtils.randFloat(0.3, 5.2);
      array[i * 3 + 2] = THREE.MathUtils.randFloat(DOOR_Z + 2, FRONT_Z - 2);
    }
    return array;
  }, [count]);

  useFrame((state) => {
    if (!cloud.current) return;
    const elapsed = state.clock.elapsedTime;
    cloud.current.position.y = Math.sin(elapsed * 0.13) * 0.22;
    cloud.current.position.x = Math.cos(elapsed * 0.09) * 0.3;
  });

  return (
    <points ref={cloud} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.026}
        color={TUNGSTEN}
        sizeAttenuation
        transparent
        opacity={0.36}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Reflections without a single network request ───────────────────────────
   drei `Environment` with Lightformer children builds the cube map in-engine.
   No `preset`, no `files` — both of those fetch from a CDN and would break the
   scene on a shop laptop with no wifi. This map is also what unifies the two
   art styles in the model library: every surface in the building, stylized or
   photogrammetric, takes its reflections from the same six emitters. */

function ShopEnvironment() {
  return (
    <Environment resolution={64} frames={1} environmentIntensity={1.15}>
      {/* Overhead tungsten run */}
      <Lightformer
        form="rect"
        intensity={2.1}
        color="#ffd2a0"
        scale={[2.2, 14, 1]}
        position={[0, 9, -4]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      {/* Cold light from the open bay */}
      <Lightformer
        form="rect"
        intensity={1.25}
        color="#8fa9d2"
        scale={[9, 5, 1]}
        position={[0, 2.5, -14]}
      />
      {/* Neon bounce */}
      <Lightformer
        form="ring"
        intensity={1.35}
        color={NEON_BLOOM}
        scale={2.6}
        position={[9, 4, 2]}
      />
      {/* Dim wall fill, both sides — keeps metal from going flat black */}
      <Lightformer
        form="rect"
        intensity={0.46}
        color="#6b5545"
        scale={[14, 6, 1]}
        position={[-11, 3, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Lightformer
        form="rect"
        intensity={0.46}
        color="#6b5545"
        scale={[14, 6, 1]}
        position={[11, 3, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* Floor bounce */}
      <Lightformer
        form="rect"
        intensity={0.34}
        color="#4a4038"
        scale={[14, 14, 1]}
        position={[0, -6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </Environment>
  );
}

/* ── Camera rig ─────────────────────────────────────────────────────────── */

function CameraRig() {
  const target = useRef(0);
  const eased = useRef(0);
  const previous = useRef(0);
  const heroTarget = useRef(1);
  const heroValue = useRef(1);
  const heroWritten = useRef(-1);
  const pointer = useRef(new THREE.Vector2());
  const parallax = useRef(new THREE.Vector2());
  const position = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());

  useEffect(() => {
    let span = 1;

    const read = () => {
      const y = window.scrollY;
      target.current = THREE.MathUtils.clamp(y / span, 0, 1);
      // The still fades out as the reader leaves the hero, revealing the shop.
      const vh = Math.max(window.innerHeight, 1);
      heroTarget.current = 1 - THREE.MathUtils.clamp((y - vh * 0.12) / (vh * 0.72), 0, 1);
    };

    const measure = () => {
      span = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      read();
    };

    measure();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", measure);
      observer.disconnect();
      document.documentElement.style.removeProperty("--hero-reveal");
    };
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.set(
        (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1,
        (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.1);
    const elapsed = state.clock.elapsedTime;
    const eye = position.current;
    const focus = lookAt.current;

    // λ = 1.35. The camera behaves like it weighs 400 lb: flick the wheel and
    // it still arrives as a dolly move, never a jump cut.
    previous.current = eased.current;
    eased.current = THREE.MathUtils.damp(eased.current, target.current, 1.35, step);

    const t = stationEase(eased.current);
    railOf(state.camera).t = t;

    CAM_CURVE.getPoint(t, eye);
    LOOK_CURVE.getPoint(t, focus);

    // Stations that push in do it here, on the hold, not on the travel.
    let dolly = 0;
    for (let i = 0; i < STATIONS.length; i++) {
      if (STATIONS[i].dolly !== 0) dolly += STATIONS[i].dolly * influence(t, i);
    }
    if (dolly !== 0) {
      forward.current.copy(focus).sub(eye).normalize();
      eye.addScaledVector(forward.current, dolly * (0.5 - 0.5 * Math.cos(elapsed * 0.2)));
    }

    // Idle breath — the shop stays alive when the reader stops scrolling.
    const speed = Math.abs(eased.current - previous.current) / step;
    const idle = THREE.MathUtils.clamp(1 - speed * 14, 0, 1);
    eye.y += Math.sin(elapsed * 0.37) * 0.07 * idle;
    eye.x += Math.cos(elapsed * 0.23) * 0.09 * idle;

    // Mouse parallax, heavily damped so it drifts rather than tracks.
    const drift = parallax.current;
    drift.x = THREE.MathUtils.damp(drift.x, pointer.current.x, 1.8, step);
    drift.y = THREE.MathUtils.damp(drift.y, pointer.current.y, 1.8, step);
    eye.x += drift.x * 0.3;
    eye.y -= drift.y * 0.18;
    focus.x += drift.x * 0.14;
    focus.y -= drift.y * 0.08;

    // Cold Start: the camera settles forward as the breakers come in.
    eye.z += (1 - introAt(elapsed)) * 1.1;

    state.camera.position.copy(eye);
    state.camera.lookAt(focus);

    // Hand the hero still its opacity. Untouched if this rig never mounts, so
    // phones, reduced-motion and no-WebGL machines keep the photograph at 1.
    heroValue.current = THREE.MathUtils.damp(heroValue.current, heroTarget.current, 6, step);
    const rounded = Math.round(heroValue.current * 200) / 200;
    if (rounded !== heroWritten.current) {
      heroWritten.current = rounded;
      document.documentElement.style.setProperty("--hero-reveal", String(rounded));
    }
  });

  return null;
}

/* ── Scene graph ────────────────────────────────────────────────────────── */

function SceneContents() {
  return (
    <>
      <color attach="background" args={[BAY_BLACK]} />
      <fog attach="fog" args={[FOG_GREY, 22, 94]} />

      <CameraRig />
      <ShopEnvironment />
      <Ambience />

      <Shell />
      <Corrugation />
      <Trusses />
      <CeilingStrips />

      <WelderArc />
      <RollUpDoor />
      <NightOutside />

      <NeonSign />
      <TuningNeon />
      <Dust />
      <Haze />

      {/* Everything in the bays. Stations 0 and 1 are up on first paint; the
          rest fetch when the camera is within ~1.4 stations of them, so the
          reader never pays for a bay they have not scrolled to. */}
      <StationBundle station={0}>
        <StationDoorway />
      </StationBundle>
      <StationBundle station={1}>
        <StationHoist />
      </StationBundle>
      <StationBundle station={2}>
        <StationEngineRoom />
      </StationBundle>
      <StationBundle station={3}>
        <StationFabCorner />
      </StationBundle>
      <StationBundle station={4}>
        <StationTuningBay />
      </StationBundle>
      <StationBundle station={5}>
        <StationOffice />
      </StationBundle>
      <StationBundle station={6}>
        <StationDoor />
      </StationBundle>

      {/* The photographs arrive when they arrive; the shop never waits. */}
      <Suspense fallback={null}>
        <OfficeGallery />
      </Suspense>

      <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
        {/* Threshold 1 — only true emissives (bulbs, neon, headlights) bloom. */}
        <Bloom
          mipmapBlur
          intensity={1.15}
          luminanceThreshold={1}
          luminanceSmoothing={0.24}
          radius={0.82}
        />
        <ChromaticAberration
          offset={CHROMATIC_OFFSET}
          radialModulation={false}
          modulationOffset={0}
        />
        {/* Shallow. The CSS layers in front of the canvas do their own falloff;
            a steep vignette here as well was double-darkening the corners. */}
        <Vignette offset={0.42} darkness={0.38} />
      </EffectComposer>
    </>
  );
}

/* ── Host ───────────────────────────────────────────────────────────────────
   Fixed, inset 0, pointer-events-none, aria-hidden, behind the page. It holds
   no layout, so it cannot shift a pixel; everything the reader can click sits
   in front of it. The scrim keeps body copy legible over the shop — lightened
   along with the scene, because a shop nobody can see is not a backdrop. */

export function ShopWorld() {
  const [lit, setLit] = useState(false);
  const [awake, setAwake] = useState(true);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    // Park the loop when the tab goes away, wake it when it comes back. Driven
    // by the event, not by a reading at mount: a page opened in a background
    // tab must still be running when the reader finally switches to it.
    const visibility = () => setAwake(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-[1600ms] ease-out ${
        lit ? "opacity-100" : "opacity-0"
      }`}
    >
      <Canvas
        dpr={dpr}
        frameloop={awake ? "always" : "never"}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 40, near: 0.1, far: 130, position: STATIONS[0].cam }}
        onCreated={({ gl }) => {
          // ACES rolls the highlights off, and every true emissive in the shop
          // (bulbs, neon, headlights) is `toneMapped={false}`, so exposure lifts
          // the ROOM without touching the light sources — the mood survives.
          gl.toneMappingExposure = 1.24;
          requestAnimationFrame(() => setLit(true));
        }}
      >
        {/* Degrade features, never frame rate (concept §2.4.4). */}
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.75)}
          onFallback={() => setDpr(1)}
        />
        <SceneContents />
      </Canvas>

      {/* Legibility scrim — the shop is a backdrop, the copy is the product.
          Deliberately light: FOUR layers used to stack between the reader and
          the scene (this wash, this gradient, `.world-veil`, and the in-canvas
          Vignette pass), which multiplied out to roughly 4% of scene luminance
          in the corners. The copy gets its contrast from `.scrim` plates that
          sit directly behind the words instead. */}
      <div className="absolute inset-0 bg-bay-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_40%,transparent_0%,rgba(11,11,13,0.08)_70%,rgba(11,11,13,0.3)_100%)]" />
    </div>
  );
}

export default ShopWorld;
