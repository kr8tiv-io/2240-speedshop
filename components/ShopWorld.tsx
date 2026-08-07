"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
  type ComponentRef,
  type RefObject,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,

  useTexture,
} from "@react-three/drei";
import {
  Bloom,
  BrightnessContrast,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  HueSaturation,
  N8AO,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

import {
  DoorShaft,
  ExhaustHaze,
  GroundFog,
  InspectionLight,
  RainCurtain,
  SheetLightning,
} from "./shop/Effects";
import {
  DetailCull,
  VisibilityWatchdog,
  StationBundle,
  WarmScene,
  primeLoaders,
  setWorldTier,
} from "./shop/Loaders";
import {
  markWorldSkipped,
  noteMotion,
  reportBootProgress,
  subscribeBoot,
} from "./shop/boot";
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
  SEGMENTS,
  STREET,
  TUNGSTEN,
  buildInstances,
  disposeInstanced,
  flickerAt,
  influence,
  introAt,
  pathAt,
  railOf,
  CAM_START,
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
   the building is 40 real models out of the 105 licence-cleared .glb files in
   `public/models/`, plus the machines nobody publishes for free — two-post
   lifts, blown V8s, engine stands, a crane, jacks and a dyno — modelled from
   primitives in `shop/Hardware.tsx`.

   Scroll maps to a camera rail through seven stations:
     0 DOORWAY · 1 HOIST · 2 ENGINE ROOM · 3 FAB CORNER
     4 TUNING BAY · 5 OFFICE WALL · 6 ROLL-UP DOOR
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Render tiers. `full` is the desktop scene as designed. `lite` is the SAME
 * shop — every model, every station, the whole rail and the cold start — with
 * the passes a phone GPU pays double for stripped out: no planar reflection
 * (the floor is rendered twice for it), no AO/DoF/chromatic passes, a smaller
 * environment map, fewer dust points and a capped device-pixel ratio. Chosen
 * by `ShopWorldMount` from viewport and hardware, not by user agent.
 */
export type WorldTier = "full" | "lite";

/** Module-level so the effect is never rebuilt on a re-render. */
/* Halved. At the old strength the corrugated cladding — ~190 high-contrast
   vertical edges — fringed visibly red/blue and read as a glitch rather than a
   lens. Brightening the room made it worse, so the lens got quieter.

   No longer constant: the rig scales it with scroll speed (LENS STRESS). At
   rest it sits at this baseline; under hard travel the fringing opens up to
   ~5x and the frame reads like glass being pushed — then settles clean on
   arrival. The effect object holds this exact Vector2, so mutating it in
   place is the whole API. */
const CHROMATIC_BASE_X = 0.00016;
const CHROMATIC_BASE_Y = 0.00024;
const CHROMATIC_OFFSET = new THREE.Vector2(CHROMATIC_BASE_X, CHROMATIC_BASE_Y);

/* ── The photographs ────────────────────────────────────────────────────────
   The freestanding lightbox prints that used to stand in for cars are gone —
   there are real cars in the bays now. What survives is the office wall, which
   was never a stand-in: it is the reputation beat, and those are real builds.
   Five files instead of seven, ~1 MB lighter, and none of it blocks paint. */

/* Raw texture fetches bypass basePath like the models do — same prefix. */
const SHOP_BASE = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/shop`;

const WALL_PHOTO = {
  d100: `${SHOP_BASE}/car-d100-truck.jpg`,
  coupe: `${SHOP_BASE}/car-green-coupe.jpg`,
  muscle: `${SHOP_BASE}/car-black-muscle.jpg`,
  bluePickup: `${SHOP_BASE}/car-blue-pickup.jpg`,
  redPickup: `${SHOP_BASE}/car-red-pickup.jpg`,
  blackClassic: `${SHOP_BASE}/car-black-classic.jpg`,
  badge: `${SHOP_BASE}/badge-2240-sign.png`,
} as const;

type PhotoKey = keyof typeof WALL_PHOTO;

const ASPECT: Record<PhotoKey, number> = {
  d100: 900 / 1125,
  coupe: 977 / 710,
  muscle: 1536 / 2048,
  bluePickup: 1939 / 1177,
  redPickup: 1536 / 2048,
  blackClassic: 1536 / 2048,
  badge: 1060 / 860,
};

/* No module-scope preload: these are ~3 MB of photographs on the office wall at
   station 5, and pulling them at boot means they race the two bays the reader
   is actually looking at. They stream with their own station now. */

/* ── Shell ──────────────────────────────────────────────────────────────── */

function Shell({ tier }: { tier: WorldTier }) {
  return (
    <group>
      {/* Sealed concrete. Low mirror, heavy blur — wet-looking, not a skating
          rink. The reflector renders the whole scene a second time, which a
          phone GPU cannot afford: the lite floor is plain sealed concrete that
          takes its sheen from the environment map instead. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MID_Z]}>
        <planeGeometry args={[HALF_W * 2 + 1, LENGTH]} />
        {tier === "full" ? (
          <MeshReflectorMaterial
            /* Back up to 256 in the premium pass: with MSAA and the higher
               DPR the wet concrete is in frame constantly, and at 128 the
               reflected neon crawled with aliasing the blur could not hide.
               The second pass costs, but it is the single surface every
               station shows. */
            resolution={256}
            blur={[220, 70]}
            mixBlur={1}
            // 4, not 15. At 15 the floor multiplied every specular highlight it
            // caught — one hot chrome header printed a solid white bar across the
            // concrete. This wants wet-looking sheen, not a second light source,
            // and once the headers became real mirrors it had to come down again.
            mixStrength={4}
            mirror={0}
            depthScale={1.15}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#292c33"
            metalness={0.15}
            roughness={0.74}
          />
        ) : (
          <meshStandardMaterial
            color="#2c2f36"
            metalness={0.22}
            roughness={0.42}
            envMapIntensity={0.85}
          />
        )}
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

/**
 * Grime on the concrete.
 *
 * A `MeshReflectorMaterial` plane with one flat colour is the flattest thing in
 * any frame that shows the floor, and this scene shows the floor constantly. A
 * single transparent quad carrying a two-octave value noise breaks it into
 * patches — pale where the concrete has been ground back, dark where forty
 * years of oil has soaked in — plus a scatter of long directional smears in the
 * drive line. It writes no depth, blends normally over the reflection, and
 * costs one draw call.
 */
function FloorGrime() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uDark: { value: new THREE.Color("#08090b") },
          uPale: { value: new THREE.Color("#565c66") },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          varying float vFade;
          void main() {
            vUv = uv;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            // Let it go with the fog, or the far end of the shop keeps a
            // crisp pattern the haze has already swallowed.
            vFade = 1.0 - smoothstep(30.0, 90.0, -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          varying float vFade;
          uniform vec3 uDark;
          uniform vec3 uPale;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
              f.y);
          }

          void main() {
            // Two octaves is plenty; a third only shows up as sparkle.
            float n = noise(vUv * vec2(9.0, 42.0)) * 0.62
                    + noise(vUv * vec2(23.0, 104.0)) * 0.38;

            float dark = smoothstep(0.54, 0.92, n) * 0.56;
            float pale = smoothstep(0.5, 0.12, n) * 0.13;

            vec3 colour = mix(uDark, uPale, pale / max(pale + dark, 0.0001));
            float a = (dark + pale) * vFade;
            if (a < 0.004) discard;
            gl_FragColor = vec4(colour, a);
          }
        `,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.006, MID_Z]}
      renderOrder={1}
    >
      <planeGeometry args={[HALF_W * 2, LENGTH]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/**
 * What stops the cladding reading as a barcode.
 *
 * ~340 identical ribs at an identical pitch is a texture, not a building, and
 * the eye has nothing to land on anywhere along 68 metres of it. Real cladding
 * is interrupted constantly: girts band it horizontally, sheets butt at panel
 * seams, conduit and air line run down it, and everything above hand height
 * streaks rust. Adding those back costs five instanced draw calls and buys the
 * single biggest compositional improvement in the shell.
 */
function WallFurniture() {
  const parts = useMemo(() => {
    const wall = HALF_W - 0.04;

    /* Horizontal girts — the structural bands a steel building is actually
       hung on, and the thing that gives the wall a horizon. */
    const girtGeometry = new THREE.BoxGeometry(0.14, 0.2, LENGTH - 1);
    const girtMaterial = new THREE.MeshStandardMaterial({
      color: "#454a54",
      roughness: 0.66,
      metalness: 0.4,
    });
    const girtSpecs: InstanceSpec[] = [];
    for (const y of [1.95, 3.85, 5.75]) {
      girtSpecs.push({ position: [-wall, y, MID_Z] });
      girtSpecs.push({ position: [wall, y, MID_Z] });
    }
    const girts = buildInstances(girtGeometry, girtMaterial, girtSpecs);

    /* Panel seams — where one sheet of cladding butts the next. Wider and
       darker than a rib, so the barcode resolves into panels. */
    const seamGeometry = new THREE.BoxGeometry(0.2, CEIL - 0.3, 0.16);
    const seamMaterial = new THREE.MeshStandardMaterial({
      color: "#282c33",
      roughness: 0.84,
      metalness: 0.18,
    });
    const seamSpecs: InstanceSpec[] = [];
    for (let z = FRONT_Z - 3.4; z > DOOR_Z + 1; z -= 4.6) {
      seamSpecs.push({ position: [-wall, CEIL / 2, z] });
      seamSpecs.push({ position: [wall, CEIL / 2, z] });
    }
    const seams = buildInstances(seamGeometry, seamMaterial, seamSpecs);

    /* Conduit and the shop air line, dropping down the wall to junction boxes.
       Vertical runs at irregular spacing — the counter-rhythm to the ribs. */
    const pipeGeometry = new THREE.CylinderGeometry(0.045, 0.045, CEIL - 1.2, 6);
    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: "#5a5f68",
      roughness: 0.44,
      metalness: 0.72,
    });
    const boxGeometry = new THREE.BoxGeometry(0.18, 0.3, 0.22);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: "#3a3e46",
      roughness: 0.6,
      metalness: 0.44,
    });
    const pipeSpecs: InstanceSpec[] = [];
    const boxSpecs: InstanceSpec[] = [];
    const DROPS: Array<[number, number]> = [
      [-1, 4.2],
      [1, -2.6],
      [-1, -13.4],
      [1, -21.8],
      [-1, -28.2],
      [1, -35.6],
      [-1, -44.8],
      [1, -50.2],
    ];
    for (const [side, z] of DROPS) {
      pipeSpecs.push({ position: [side * (HALF_W - 0.16), CEIL / 2 + 0.3, z] });
      boxSpecs.push({ position: [side * (HALF_W - 0.2), 1.5, z] });
    }
    const pipes = buildInstances(pipeGeometry, pipeMaterial, pipeSpecs);
    const boxes = buildInstances(boxGeometry, boxMaterial, boxSpecs);

    /* Rust weeping out from under the girts. A vertical gradient plane, one
       draw call for the lot, and the only thing in the shell that is not a
       straight edge — which is precisely why it works. */
    const streakGeometry = new THREE.PlaneGeometry(1, 1);
    const streakMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color("#5a3220") } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix *
            instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform vec3 uColor;
        void main() {
          // Strong where it leaves the fixing, gone before it reaches the
          // floor, and feathered off both sides so it has no cut edges.
          float run = pow(1.0 - vUv.y, 1.7);
          float across = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
          gl_FragColor = vec4(uColor, run * across * 0.55);
        }
      `,
    });
    const streakSpecs: InstanceSpec[] = [];
    const STREAKS: Array<[number, number, number, number]> = [
      [-1, 6.0, 3.85, 1.5],
      [1, -0.8, 3.85, 1.1],
      [-1, -9.6, 5.75, 2.1],
      [1, -16.2, 3.85, 1.3],
      [-1, -23.5, 5.75, 1.8],
      [1, -30.9, 3.85, 1.6],
      [-1, -38.4, 5.75, 2.0],
      [1, -46.1, 3.85, 1.2],
      [-1, -52.6, 3.85, 1.5],
    ];
    for (const [side, z, top, drop] of STREAKS) {
      streakSpecs.push({
        position: [side * (HALF_W - 0.08), top - drop / 2, z],
        rotation: [0, side * -Math.PI / 2, 0],
        scale: [0.5, drop, 1],
      });
    }
    const streaks = buildInstances(streakGeometry, streakMaterial, streakSpecs);
    streaks.renderOrder = 1;

    return { girts, seams, pipes, boxes, streaks };
  }, []);

  useEffect(
    () => () => {
      disposeInstanced(parts.girts);
      disposeInstanced(parts.seams);
      disposeInstanced(parts.pipes);
      disposeInstanced(parts.boxes);
      disposeInstanced(parts.streaks);
    },
    [parts],
  );

  return (
    <group>
      <primitive object={parts.girts} />
      <primitive object={parts.seams} />
      <primitive object={parts.pipes} />
      <primitive object={parts.boxes} />
      <primitive object={parts.streaks} />
    </group>
  );
}

/**
 * Cable and air line slung under the roof, sagging between the trusses. Three
 * catenaries down the length of the building: they cross every frame that
 * includes the ceiling, they break the truss rhythm, and they cost three
 * tube geometries built once at module scope.
 */
function CeilingRuns() {
  const runs = useMemo(() => {
    const make = (x: number, y: number, sag: number, colour: string, radius: number) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 12; i++) {
        const t = i / 12;
        const z = FRONT_Z - 2 + t * (DOOR_Z + 2 - (FRONT_Z - 2));
        // Sag between every truss bay, not once across the whole span.
        const bay = Math.sin(t * Math.PI * 11);
        points.push(new THREE.Vector3(x + Math.sin(t * 6.2) * 0.12, y - Math.abs(bay) * sag, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 96, radius, 5, false);
      const material = new THREE.MeshStandardMaterial({
        color: colour,
        roughness: 0.82,
        metalness: 0.2,
      });
      return new THREE.Mesh(geometry, material);
    };

    return [
      make(-6.6, CEIL - 0.9, 0.26, "#15161a", 0.028),
      make(6.9, CEIL - 0.85, 0.2, "#15161a", 0.024),
      make(-0.4, CEIL - 0.7, 0.14, "#4d525b", 0.036),
    ];
  }, []);

  useEffect(
    () => () => {
      for (const mesh of runs) {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
    },
    [runs],
  );

  return (
    <group>
      {runs.map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}
    </group>
  );
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
  const anchor = useMemo(
    () => new THREE.Vector3(position[0], 1.4, position[2]),
    [position],
  );

  useFrame((state) => {
    const k = introAt(state.clock.elapsedTime - delay);
    if (disc.current) disc.current.emissiveIntensity = 2.9 * k;
    if (bulb.current) bulb.current.intensity = power * k;
    fadeGlow(beam.current, 0.095 * k);
    fadeGlow(pool.current, 0.27 * k);

    /* Fill-rate governor. The beam is a full-height double-sided cone and the
       pool is a wide additive disc; from the doorway ALL SEVEN of them stack up
       the length of the building and the frame ends up drawing the screen a
       dozen times over. Past ~30 m the fog has eaten them anyway, so they go
       away. Toggling `visible` on a MESH is free — unlike doing the same to a
       light, which changes the light count and forces every material in the
       scene to recompile. */
    const far = state.camera.position.distanceToSquared(anchor) > 30 * 30;
    if (beam.current) beam.current.visible = !far;
    if (pool.current) pool.current.visible = !far;
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

/**
 * A cool kicker set BEHIND the hero of a station, off to one side. This is the
 * oldest trick in automotive photography and the cheapest depth in the file: a
 * dark car in front of a dark wall is a silhouette-shaped hole until something
 * cold draws its top edge and its shoulder line away from the background. Warm
 * key in front, cool rim behind — that ratio is most of what "cinematic" means.
 */
function RimLight({
  position,
  power = 46,
  color = "#a8c4f2",
  distance = 15,
  delay = 0.4,
}: {
  position: [number, number, number];
  power?: number;
  color?: string;
  distance?: number;
  delay?: number;
}) {
  const light = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (light.current) {
      light.current.intensity = power * introAt(state.clock.elapsedTime - delay);
    }
  });
  return (
    <pointLight
      ref={light}
      color={color}
      intensity={0}
      distance={distance}
      decay={2}
      position={position}
    />
  );
}

function Ambience() {
  const ambient = useRef<THREE.AmbientLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);
  const street = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const k = introAt(state.clock.elapsedTime);
    // Restraint on purpose, and a notch tighter than it was. Legibility is
    // bought in the CSS layers in front of the canvas, NOT by flooding the
    // room: ambient and hemisphere this high flatten the shop into an evenly-
    // lit grey box. A wide key-to-fill ratio is what makes the frame read as a
    // photograph rather than a diagram, so the fill goes down and the bay
    // lights and rims below carry it.
    if (ambient.current) ambient.current.intensity = 0.2 * k;
    if (fill.current) fill.current.intensity = 0.44 * k;
    if (street.current) street.current.intensity = 46 * k;
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
      <ShopLight position={[-5.0, 5.1, -8.6]} delay={0.16} power={76} />
      <ShopLight position={[1.4, 5.1, -18.6]} delay={0.34} power={76} />
      <ShopLight position={[-5.6, 5.1, -26.8]} delay={0.52} power={86} />
      <ShopLight position={[-1.6, 5.1, -35.4]} delay={0.7} power={68} />
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

      {/* Four kickers, one per hero. Four and not seven on purpose — every
          extra point light is paid for by every lit fragment in a 68 m
          building, so they go where a vehicle or a hero machine actually needs
          separating and nowhere else. */}
      <RimLight position={[-7.6, 3.4, -11.6]} power={30} distance={17} delay={0.5} />
      <RimLight position={[7.4, 3.0, -21.6]} power={26} distance={16} delay={0.7} />
      <RimLight position={[-8.2, 2.9, -34.6]} power={24} distance={15} delay={0.9} />
      <RimLight position={[4.2, 3.2, -42.8]} power={28} distance={17} delay={1.1} />

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
    // Old neon never holds perfectly: every half minute or so one tube
    // stutters for a beat. Deterministic — two beating sines gate a fast
    // flicker, same trick as the lightning — so it costs no state and every
    // visit shows the same tired transformer.
    const gate = Math.sin(elapsed * 0.19 + 1.3) * Math.sin(elapsed * 0.057);
    const relapse =
      gate > 0.982 ? 0.3 + 0.7 * Math.abs(Math.sin(elapsed * 43)) : 1;
    const k = introAt(elapsed - 0.5) * flickerAt(elapsed) * relapse;
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
          map-anisotropy={8}
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
      {/* Corkboard the gallery hangs on — widened for the two extra prints */}
      <mesh position={[-(HALF_W - 0.14), 2.9, -43.6]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8.4, 4.2, 0.1]} />
        <meshStandardMaterial color="#2f251c" roughness={0.94} metalness={0.05} />
      </mesh>
      <mesh position={[-(HALF_W - 0.08), 2.9, -43.6]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8.6, 4.4, 0.04]} />
        <meshStandardMaterial color="#5e4126" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* X is 0.28 off the wall so the frames hang PROUD of the corkboard
          rather than inside it. Centrepiece is the shop's REAL badge — the
          laser-cut corten sign off the front of the building, redrawn clean. */}
      <WallFrame
        map={maps.badge}
        aspect={ASPECT.badge}
        height={1.9}
        position={[-(HALF_W - 0.28), 2.95, -43.4]}
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
      <WallFrame
        map={maps.redPickup}
        aspect={ASPECT.redPickup}
        height={1.05}
        position={[-(HALF_W - 0.28), 3.5, -47.1]}
        rotation={Math.PI / 2}
      />

      {/* Shop signage: a second badge board hung mid-shop on the right wall,
          where the rail passes it twice — the brand lives IN the room, not
          just over the office desk. */}
      <WallFrame
        map={maps.badge}
        aspect={ASPECT.badge}
        height={1.5}
        position={[HALF_W - 0.28, 3.55, -22.4]}
        rotation={-Math.PI / 2}
      />
      <WallFrame
        map={maps.blackClassic}
        aspect={ASPECT.blackClassic}
        height={1.1}
        position={[-(HALF_W - 0.28), 2.1, -47.1]}
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
      <WeldSparks />
    </group>
  );
}

const SPARK_COUNT = 42;

/**
 * The fountain of orange sparks under the arc. Deterministic per index — each
 * spark loops its own ballistic hop, staggered so the stream never pulses —
 * and driven by the same arrival influence as the arc, so the corner is quiet
 * until the reader is actually standing in it. One Points draw call.
 */
function WeldSparks() {
  const points = useRef<THREE.Points>(null);
  const seeds = useMemo(() => {
    const array: Array<{ vx: number; vy: number; vz: number; life: number; offset: number }> = [];
    for (let i = 0; i < SPARK_COUNT; i++) {
      const angle = (i / SPARK_COUNT) * Math.PI * 2;
      const kick = 0.6 + ((i * 37) % 17) / 17;
      array.push({
        vx: Math.cos(angle) * 0.9 * kick,
        vy: 1.4 + ((i * 13) % 11) / 9,
        vz: Math.sin(angle) * 0.9 * kick,
        life: 0.55 + ((i * 7) % 13) / 26,
        offset: ((i * 29) % 19) / 19,
      });
    }
    return array;
  }, []);
  const positions = useMemo(() => new Float32Array(SPARK_COUNT * 3), []);

  useFrame((state) => {
    if (!points.current) return;
    const arrival = influence(railOf(state.camera).t, 3);
    points.current.visible = arrival > 0.05;
    if (!points.current.visible) return;

    const elapsed = state.clock.elapsedTime;
    for (let i = 0; i < SPARK_COUNT; i++) {
      const s = seeds[i];
      const t = ((elapsed / s.life + s.offset) % 1) * s.life;
      positions[i * 3] = s.vx * t;
      positions[i * 3 + 1] = Math.max(s.vy * t - 4.9 * t * t, -1.1);
      positions[i * 3 + 2] = s.vz * t;
    }
    const attribute = points.current.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    attribute.needsUpdate = true;
    const material = points.current.material as THREE.PointsMaterial;
    material.opacity = 0.85 * arrival;
  });

  return (
    <points ref={points} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ffb257"
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
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

/* The yard across the lane. 91 Avenue is an industrial strip, not downtown:
   what stands behind the shop is low tilt-up warehouses with parapet caps,
   strip windows at office height, a lit loading door or two and junk on the
   roof — not a wall of towers. Close enough (26–36 m) to resolve as buildings
   through the door instead of punch-card silhouettes. */
const WAREHOUSES = [
  { x: -29, z: -87, w: 22, d: 12, h: 9, door: 0.3, windows: 2 },
  { x: -5, z: -93, w: 18, d: 14, h: 12.5, door: -0.28, windows: 3 },
  { x: 15, z: -85, w: 19, d: 11, h: 8, door: 0.22, windows: 2 },
  { x: 36, z: -91, w: 16, d: 12, h: 10.5, door: 0, windows: 2 },
] as const;

/* A second rank of taller blocks well behind, silhouette only. */
const FAR_BLOCKS = [
  { x: -46, z: -112, w: 15, h: 24 },
  { x: 6, z: -118, w: 18, h: 30 },
  { x: 46, z: -108, w: 13, h: 19 },
] as const;

/* Yard lights over the back lot — the reason the lot reads at all. */
const LOT_POLES: Array<[number, number]> = [
  [-11, -63],
  [3, -67],
  [15, -62],
];

function NightOutside() {
  const sky = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        fog: false,
        uniforms: {
          // A city night is never black: high overcast bounces every sodium
          // lamp in the district back down. Lighter than it was on purpose —
          // "out back it just looks like a square with holes" was mostly this.
          uTop: { value: new THREE.Color("#1b2440") },
          uHorizon: { value: new THREE.Color("#647399") },
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

  useEffect(() => () => sky.dispose(), [sky]);

  return (
    <group>
      {/* Sky */}
      <mesh position={[0, 26, -136]}>
        <planeGeometry args={[260, 120]} />
        <primitive object={sky} attach="material" />
      </mesh>

      {/* The warehouses across the lane — real buildings, not punch cards */}
      {WAREHOUSES.map((b) => (
        <group key={`${b.x}:${b.z}`} position={[b.x, 0, b.z]}>
          {/* Body and parapet cap */}
          <mesh position={[0, b.h / 2, 0]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color="#161b25" roughness={0.92} metalness={0.06} fog={false} />
          </mesh>
          <mesh position={[0, b.h + 0.22, 0]}>
            <boxGeometry args={[b.w + 0.5, 0.45, b.d + 0.5]} />
            <meshStandardMaterial color="#2c3442" roughness={0.85} metalness={0.1} fog={false} />
          </mesh>
          {/* Rooftop units */}
          <mesh position={[-b.w * 0.22, b.h + 0.85, -1]}>
            <boxGeometry args={[2.2, 1.3, 1.8]} />
            <meshStandardMaterial color="#232a36" roughness={0.9} metalness={0.12} fog={false} />
          </mesh>
          <mesh position={[b.w * 0.28, b.h + 0.6, 1.2]}>
            <boxGeometry args={[1.4, 0.85, 1.4]} />
            <meshStandardMaterial color="#1d232e" roughness={0.9} metalness={0.12} fog={false} />
          </mesh>
          {/* Office strip windows, lit warm, tone mapped — glow, not bloom */}
          {Array.from({ length: b.windows }, (_, i) => (
            <mesh
              key={i}
              position={[
                (i - (b.windows - 1) / 2) * (b.w / (b.windows + 0.4)),
                b.h * 0.42,
                b.d / 2 + 0.02,
              ]}
            >
              <planeGeometry args={[b.w / (b.windows + 1.6), 1.15]} />
              <meshStandardMaterial
                color="#241d12"
                emissive="#e3c18f"
                emissiveIntensity={0.85}
                roughness={0.4}
                fog={false}
              />
            </mesh>
          ))}
          {/* One lit loading door */}
          <mesh position={[b.door * b.w, 1.7, b.d / 2 + 0.02]}>
            <planeGeometry args={[2.9, 3.4]} />
            <meshStandardMaterial
              color="#131720"
              emissive="#9fb6dc"
              emissiveIntensity={0.55}
              roughness={0.5}
              fog={false}
            />
          </mesh>
        </group>
      ))}

      {/* Far rank — silhouettes only, holding the horizon */}
      {FAR_BLOCKS.map((t) => (
        <mesh key={`${t.x}:${t.z}`} position={[t.x, t.h / 2, t.z]}>
          <boxGeometry args={[t.w, t.h, 10]} />
          <meshStandardMaterial color="#0c101a" roughness={1} metalness={0} fog={false} />
        </mesh>
      ))}

      {/* Yard lights over the lot — warm pools the parked cars sit in */}
      {LOT_POLES.map(([x, z]) => (
        <LotLight key={`${x}:${z}`} position={[x, 0, z]} />
      ))}

      {/* Wet asphalt out back, a step lighter so the lot reads under its lamps */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -92]}>
        <planeGeometry args={[220, 70]} />
        <meshStandardMaterial color="#181d27" roughness={0.36} metalness={0.22} fog={false} />
      </mesh>

      {/* Stall lines painted on the lot */}
      {[-16, -11.6, -7.2, 6.4, 10.8, 15.2].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.004, -66]}>
          <planeGeometry args={[0.14, 5.6]} />
          <meshStandardMaterial color="#525a68" roughness={0.8} metalness={0.02} fog={false} />
        </mesh>
      ))}

      <Headlights offset={0} speed={2.6} />
      <Headlights offset={34} speed={-1.9} />
    </group>
  );
}

/** One sodium yard light: pole, hooded head, a real point light and a pool. */
function LotLight({ position }: { position: [number, number, number] }) {
  const lamp = useRef<THREE.PointLight>(null);
  const head = useRef<THREE.MeshStandardMaterial>(null);
  const pool = useRef<THREE.Mesh>(null);
  const poolMaterial = useRadialGlow("#ffc27a", 0.3, 2.2);

  useFrame((state) => {
    const k = introAt(state.clock.elapsedTime - 0.8);
    if (lamp.current) lamp.current.intensity = 60 * k;
    if (head.current) head.current.emissiveIntensity = 2.6 * k;
    fadeGlow(pool.current, 0.3 * k);
  });

  return (
    <group position={position}>
      <mesh position={[0, 3.3, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 6.6, 8]} />
        <meshStandardMaterial color="#2c3037" roughness={0.7} metalness={0.4} fog={false} />
      </mesh>
      <mesh position={[0, 6.6, 0.34]}>
        <boxGeometry args={[0.5, 0.22, 1.0]} />
        <meshStandardMaterial color="#33383f" roughness={0.6} metalness={0.42} fog={false} />
      </mesh>
      <mesh position={[0, 6.48, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 0.7]} />
        <meshStandardMaterial
          ref={head}
          color="#000000"
          emissive="#ffc98a"
          emissiveIntensity={0}
          side={THREE.DoubleSide}
          toneMapped={false}
          fog={false}
        />
      </mesh>
      <pointLight
        ref={lamp}
        color="#ffc27a"
        intensity={0}
        distance={26}
        decay={2}
        position={[0, 6.2, 0.5]}
      />
      <mesh ref={pool} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.5]}>
        <circleGeometry args={[5.2, 24]} />
        <primitive object={poolMaterial} attach="material" />
      </mesh>
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
      {/* Two sheets, not three. Each one is a 16x7 additive plane that fills a
          large slice of the frame at the door stations, and the third was worth
          almost nothing visually for a third of the haze bill. */}
      {[0, 1].map((i) => (
        <mesh key={i} position={[i * 2.2 - 1.6, 1.8 + i * 0.5, -i * 3.0]}>
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

/* Three long, THIN, bright emitters overhead. Shape is the whole trick: a fat
   soft panel smeared across a chrome pipe blows the pipe out into a glowing
   rod, whereas a strip lays one hard bright line down it with dark either side
   — which is what the eye has been trained by every photograph of a workshop to
   read as polish. Same emitters give bodywork its long highlight down the
   shoulder line, and they sit where the real ceiling fixtures are so the
   reflections agree with the room. */
const STRIPS: Array<[number, number]> = [
  [-5.1, -1],
  [0, -6],
  [5.1, -11],
];

function ShopEnvironment({ tier }: { tier: WorldTier }) {
  return (
    <Environment
      /* 256 on desktop: the env map is every reflection in the building —
         chrome, paint, glass — and at 128 the streaks in a clearcoat resolved
         as smeared blobs. One-time render cost; per-frame cost is identical. */
      resolution={tier === "lite" ? 64 : 256}
      frames={1}
      environmentIntensity={0.92}
    >
      {STRIPS.map(([x, z]) => (
        <Lightformer
          key={x}
          form="rect"
          intensity={3.7}
          color="#ffd7ac"
          scale={[0.5, 26, 1]}
          position={[x, 9, z]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      ))}

      {/* One soft box over the working side of the room — the key. Broad enough
          to wrap paint, dim enough not to compete with the strips in chrome. */}
      <Lightformer
        form="rect"
        intensity={1.5}
        color="#ffcb9a"
        scale={[5, 7, 1]}
        position={[-2.4, 8.2, -5]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Cold light from the open bay. This is the KICKER: it is the only thing
          in the map behind the vehicles, so it draws the cool edge that lifts a
          dark car off a dark wall. */}
      <Lightformer
        form="rect"
        intensity={2.6}
        color="#a2c0ee"
        scale={[11, 6, 1]}
        position={[0, 3, -19]}
      />
      {/* Neon bounce */}
      <Lightformer
        form="ring"
        intensity={1.2}
        color={NEON_BLOOM}
        scale={3.1}
        position={[9, 4, 2]}
      />
      {/* Wall fill, both sides. Deliberately LOWER than it was: metal needs
          somewhere dark to be or every surface reads at the same value, which
          is exactly what made the room look flat. */}
      <Lightformer
        form="rect"
        intensity={0.28}
        color="#6b5545"
        scale={[16, 6, 1]}
        position={[-12, 3, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Lightformer
        form="rect"
        intensity={0.28}
        color="#6b5545"
        scale={[16, 6, 1]}
        position={[12, 3, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* Floor bounce */}
      <Lightformer
        form="rect"
        intensity={0.24}
        color="#463b32"
        scale={[16, 16, 1]}
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
  const primed = useRef(false);
  const heroTarget = useRef(1);
  const heroValue = useRef(1);
  const heroWritten = useRef(-1);
  // The photograph holds until the opening bays have actually arrived. Over a
  // slow connection the canvas is up SECONDS before the trucks are — dissolving
  // the plate on mount showed phone readers an empty grey room. Transient
  // subscription, not the hook: the loading store updates DURING other
  // components' renders, and a hook here would setState mid-render.
  const loaded = useRef(false);
  useEffect(
    () =>
      subscribeBoot((s) => {
        loaded.current = s.ready;
      }),
    [],
  );
  const pointer = useRef(new THREE.Vector2());
  const parallax = useRef(new THREE.Vector2());
  const position = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());
  const roll = useRef(0);
  const lens = useRef(1);

  useEffect(() => {
    let span = 1;

    const read = () => {
      // NOT bare `window.scrollY`. On iOS Safari an overflow-clipped <body>
      // can end up as the actual scroll container, in which case scrollY pins
      // at 0 while body.scrollTop moves — which froze the whole camera rail on
      // real phones. Take the largest of the three; the wrong ones read 0.
      const y = Math.max(
        window.scrollY || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0,
      );
      target.current = THREE.MathUtils.clamp(y / span, 0, 1);
      // The moment this rig is running, the shop IS the hero: the still plate
      // dissolves outright and the reader opens on the cold-start animation,
      // full bleed. Machines that never mount the rig keep the photograph.
      heroTarget.current = 0;
    };

    const measure = () => {
      span = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      read();
    };

    measure();
    // Capture phase on document: catches the scroll event whichever element
    // turns out to be the real scroller (window, root, or body).
    document.addEventListener("scroll", read, { passive: true, capture: true });
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);

    return () => {
      document.removeEventListener("scroll", read, { capture: true });
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
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
    // Floor as well as cap. Two rAF callbacks can land on the same clock
    // reading (double-buffered frames, screenshot-driven headless), and a
    // zero step turns the speed terms below into 0/0 — one NaN in the lens
    // damp and the whole post chain renders black forever after.
    const step = THREE.MathUtils.clamp(delta, 1e-4, 0.1);
    const elapsed = state.clock.elapsedTime;
    const eye = position.current;
    const focus = lookAt.current;

    // The renderer is parked while the shop compiles, and the reader is free
    // to scroll the page in the meantime. The first frame therefore has to
    // START where the document already is — damping up from zero would fly the
    // camera through the whole building to catch up, which is a lovely shot
    // and completely wrong as an arrival.
    if (!primed.current) {
      primed.current = true;
      eased.current = target.current;
      previous.current = target.current;
    }

    // λ = 1.35. The camera behaves like it weighs 400 lb: flick the wheel and
    // it still arrives as a dolly move, never a jump cut.
    previous.current = eased.current;
    eased.current = THREE.MathUtils.damp(eased.current, target.current, 1.35, step);

    // THE FILM: orbit-and-reveal. pathAt sweeps the arc around the current
    // subject (or the glide between subjects), hands back eye + look, and
    // reports the station float everything else keys off. The old dolly is
    // gone — the orbit IS the move now.
    const s = pathAt(eased.current, eye, focus);
    const rail = railOf(state.camera);
    const t = s / SEGMENTS;
    rail.t = t;
    // FocusRig racks onto whatever the orbit is circling.
    rail.look.copy(focus);

    // Idle breath — the shop stays alive when the reader stops scrolling.
    const speed = Math.abs(eased.current - previous.current) / step;
    // Published for the quality controller — one write, no allocation.
    MOTION.speed = speed;
    // And for the streaming queue, which holds its work while the film moves.
    noteMotion(speed > 0.0015);
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

    // ARRIVAL ZOOM — the "push in on the item" beat. The lens tightens up to
    // 9% while the camera holds at a station and relaxes on the travel, so
    // every arrival reads as a deliberate rack-in on the hero rather than the
    // rail simply stopping. Rides the same influence bell as the props.
    const persp = state.camera as THREE.PerspectiveCamera;
    const base = (persp.userData.baseFov as number) ?? persp.fov;
    const bell = influence(t, Math.round(t * SEGMENTS));
    const zoomed = base * (1 - 0.09 * bell);
    if (Math.abs(persp.fov - zoomed) > 0.02) {
      persp.fov = zoomed;
      persp.updateProjectionMatrix();
    }

    // DUTCH ROLL — a degree and a half of lean, proportional to how hard the
    // reader is scrolling and heavily damped, so fast travel banks the frame
    // like a car taking a corner and every hold settles back to level.
    const signedSpeed = (eased.current - previous.current) / step;
    roll.current = THREE.MathUtils.damp(
      roll.current,
      THREE.MathUtils.clamp(-signedSpeed * 1.9, -0.026, 0.026),
      3,
      step,
    );
    state.camera.rotateZ(roll.current);

    // LENS STRESS — chromatic fringing opens with scroll speed and closes on
    // the hold. Damped separately from the roll so the two settle at
    // different rates, the way real glass and a real tripod would.
    const stress = THREE.MathUtils.clamp(Math.abs(signedSpeed) * 6, 0, 4);
    lens.current = THREE.MathUtils.damp(lens.current, 1 + stress, 4, step);
    // Insurance on top of the step floor: a non-finite value here paints
    // every pixel of the composer NaN-black, so it must never persist.
    if (!Number.isFinite(lens.current)) lens.current = 1;
    if (!Number.isFinite(roll.current)) roll.current = 0;
    CHROMATIC_OFFSET.set(
      CHROMATIC_BASE_X * lens.current,
      CHROMATIC_BASE_Y * lens.current,
    );

    // The boot channel owns "ready" now — it knows the difference between
    // downloaded and DRAWABLE, which the loading manager never did. The
    // elapsed-time floor is the last line of defence if it never reports.
    if (!loaded.current && elapsed > 14) loaded.current = true;

    // Hand the hero still its opacity. Untouched if this rig never mounts, so
    // reduced-motion and no-WebGL machines keep the photograph at 1.
    heroValue.current = THREE.MathUtils.damp(
      heroValue.current,
      loaded.current ? heroTarget.current : 1,
      6,
      step,
    );
    const rounded = Math.round(heroValue.current * 200) / 200;
    if (rounded !== heroWritten.current) {
      heroWritten.current = rounded;
      document.documentElement.style.setProperty("--hero-reveal", String(rounded));
    }
  });

  return null;
}

/**
 * Hold the HORIZONTAL field of view, not the vertical one.
 *
 * The seven stations were composed for a landscape frame at 40° vertical. A
 * phone held upright has a quarter of that aspect, so the same vertical FOV
 * crops the horizontal down to a keyhole — the hoist bay arrives as a slice of
 * one lift column. Solving the vertical FOV from a fixed ~52° horizontal keeps
 * each station's composition intact on any screen; the clamp stops a fisheye
 * on the very tallest viewports and reproduces the designed 40° on desktop.
 */
function PortraitLens() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    // Portrait phones get a WIDER horizontal field. The orbits frame a five
    // metre car from ~4 m out — about 60° of arc — so at the landscape 52°
    // a phone would crop nose and tail out of every sweep. 64° keeps the
    // whole car inside the frame on the closest orbit.
    const H_FOV = THREE.MathUtils.degToRad(aspect < 0.9 ? 64 : 52);
    const vertical = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(H_FOV / 2) / aspect));
    /* THE CLAMP WAS EATING THE SHOT.
       This lens holds a fixed HORIZONTAL field and solves the vertical from
       the aspect — that is the whole reason a five-metre car fits on a phone.
       A tall phone needs a very tall vertical field to hold 64° across: 107°
       at 390x844, 96° at 320x568. The old ceiling of 92° silently overrode it,
       which does not crop the top and bottom — it narrows the HORIZONTAL field
       to about 51°, and the nose and tail of the car go off the sides. Which is
       exactly what a 320-point screen was showing.
       The ceiling now sits above what any phone in portrait actually asks for,
       so the framing the orbits were composed for is the framing that ships. */
    const clamped = THREE.MathUtils.clamp(vertical, 40, 112);
    // The rig owns the live FOV (arrival zoom); this only re-derives the BASE
    // when the viewport changes shape.
    camera.userData.baseFov = clamped;
    camera.fov = clamped;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

/* ── Focus ──────────────────────────────────────────────────────────────── */

/**
 * Rack focus onto whatever the station is looking at.
 *
 * `DepthOfField` will happily take a fixed distance, but a station's subject
 * sits anywhere between two and thirteen metres out, so a fixed plane blurs
 * the hero half the time. Handing the effect a Vector3 we own and moving it
 * along the same LOOK curve the camera aims down means the thing the shot is
 * ABOUT is always the thing in focus — for one curve evaluation a frame.
 *
 * The effect reads `target` on every update and re-derives focus distance from
 * it, so mutating the vector in place is enough; nothing needs re-rendering
 * and nothing needs a ref across the composer boundary.
 */
/** The effect instance behind `<DepthOfField>`, without importing its package. */
type DofEffect = ComponentRef<typeof DepthOfField>;
/** The ambient-occlusion PASS — it has an `enabled` flag the composer honours. */
type AoPass = ComponentRef<typeof N8AO>;

/* How hard the reader is currently moving the film, written once a frame by
   the rig and read by the quality controller. A plain object, not state: this
   changes every frame and must never touch React. */
const MOTION = { speed: 0 };

/**
 * ADAPTIVE POST — spend the GPU where the eye is.
 *
 * Screen-space AO is the most expensive pass in the chain and the least
 * visible one under motion: at speed the frame is already a smear of tungsten
 * and the contact shadows under a jack stand are not what anyone is reading.
 * So it eases out as the travel builds and eases back in as the camera settles
 * — a ramp, not a switch, and the pass is only actually skipped once its
 * contribution has faded to nothing, so there is no pop at either end.
 *
 * Bloom, grain, grade and the rack focus stay on at all times: those ARE the
 * look, and they cost a fraction of what the AO does.
 */
function QualityRig({
  ao,
  onStruggle,
}: {
  ao: RefObject<AoPass | null>;
  /** Called when the machine has been under target for a sustained stretch. */
  onStruggle: (struggling: boolean) => void;
}) {
  const level = useRef(1);
  const average = useRef(1 / 60);
  const since = useRef(0);
  const struggling = useRef(false);

  useFrame((_, delta) => {
    const step = THREE.MathUtils.clamp(delta, 1e-4, 0.1);

    /* THE SECOND LEVER: sustained frame time.
       Motion is not the only reason to spend less. A machine that cannot hold
       the frame at rest will not hold it under a camera move either, and the
       concept's own rule is to degrade FEATURES, never frame rate. A slow
       exponential average — not a single frame — decides, and it has to hold
       for two seconds either way, so nothing flickers between settings while
       a bay is streaming in. */
    average.current += (step - average.current) * 0.05;
    const slow = average.current > 0.028; // worse than ~36 fps
    const fast = average.current < 0.019; // better than ~53 fps
    if ((slow && !struggling.current) || (fast && struggling.current)) {
      since.current += step;
      if (since.current > 2) {
        struggling.current = slow;
        since.current = 0;
        onStruggle(slow);
      }
    } else {
      since.current = 0;
    }

    const pass = ao.current as
      | (AoPass & { enabled?: boolean; configuration?: { intensity: number } })
      | null;
    if (!pass?.configuration) return;

    // Full AO under ~1.5% of the film per second; gone by ~6% — and gone
    // outright on a machine that is already behind.
    const want = struggling.current
      ? 0
      : THREE.MathUtils.clamp(1 - (MOTION.speed - 0.015) / 0.045, 0, 1);
    level.current = THREE.MathUtils.damp(level.current, want, want < level.current ? 9 : 3.5, step);
    if (!Number.isFinite(level.current)) level.current = 1;

    pass.configuration.intensity = 2.4 * level.current;
    pass.enabled = level.current > 0.03;
  });

  return null;
}

/* Any non-null Vector3 makes the wrapper allocate the effect its own target;
   the value never matters, because `FocusRig` overwrites it every frame. */
const ORIGIN = new THREE.Vector3();

function FocusRig({ effect }: { effect: RefObject<DofEffect | null> }) {
  const point = useRef(new THREE.Vector3());

  useFrame((state) => {
    const target = effect.current?.target;
    if (!target) return;

    // The rig parks the orbit subject on the rail every frame; focus tracks
    // it directly. Pulled a fifth of the way back toward the lens so the
    // plane cuts through the near face of the subject, not its centre.
    point.current.copy(railOf(state.camera).look);
    point.current.lerp(state.camera.position, 0.2);

    // Copy into the effect's OWN vector, not ours. Handing `target` a Vector3
    // as a prop looks like it should work and does not: r3f sees a value with
    // `.copy()` on the far side and copies INTO it once, so the effect keeps
    // its own vector and every later mutation of ours goes nowhere. That is
    // why the first cut of this rack focus left the whole shop soft and the
    // skyline sharp — focus was pinned to wherever the camera started.
    target.copy(point.current);
  });

  return null;
}

/* ── Scene graph ────────────────────────────────────────────────────────── */

function SceneContents({
  tier,
  onStruggle,
}: {
  tier: WorldTier;
  onStruggle: (struggling: boolean) => void;
}) {
  const dof = useRef<DofEffect | null>(null);
  const ao = useRef<AoPass | null>(null);
  const composer = useRef<ComponentRef<typeof EffectComposer> | null>(null);

  // `?perf` reaches the composer itself: a black frame is either a chain that
  // is not running or one whose last pass never reaches the screen, and there
  // is no way to tell those apart from the outside.
  useEffect(() => {
    if (typeof window === "undefined" || !window.location.search.includes("perf")) return;
    const shop = (window as unknown as { __shop?: Record<string, unknown> }).__shop;
    if (shop) shop.composer = composer;
  });
  const shell = useRef<THREE.Group>(null);
  const lite = tier === "lite";

  // Before any child mounts: the loader's decoders, and which tier the bays
  // are being built for. Both have to be set during render — an effect runs
  // after the first bay has already decided how much of itself to build.
  primeLoaders(useThree((state) => state.gl));
  setWorldTier(lite);

  return (
    <>
      <color attach="background" args={[BAY_BLACK]} />
      <fog attach="fog" args={[FOG_GREY, 22, 94]} />

      <CameraRig />
      <PortraitLens />
      <ShopEnvironment tier={tier} />
      <Ambience />

      {/* THE BUILDING — everything that is not a streaming bay, in one group
          so the warm-up has something finite to wait for. The bays grow for
          half a minute after this does; scoping the compile to the shell is
          what lets the door roll up in three seconds instead of seventy. */}
      <group ref={shell}>
        <Shell tier={tier} />
        <FloorGrime />
        <Corrugation />
        <WallFurniture />
        <Trusses />
        <CeilingRuns />
        <CeilingStrips />

        <WelderArc />
        <RollUpDoor />
        <NightOutside />

        {/* The weather and the work — every one a single draw call, all
            arrival-gated. Lightning and the cursor light are real point lights,
            which every lit fragment pays for, so they are desktop money. */}
        <RainCurtain />
        <DoorShaft />
        {/* Every one of these is a single draw call and a screen's worth of
            transparent fragments — cheap on a desktop GPU, and exactly the
            wrong thing to stack four deep on a phone. The rain through the
            open door and the shaft of light off it are the two that carry the
            picture; the exhaust wisp, the ground fog and the room haze are
            atmosphere the scene's own distance fog is already providing. */}
        {!lite && <ExhaustHaze position={[1.5, 0.38, -39.4]} />}
        {!lite && <GroundFog />}
        {!lite && <Haze />}
        {!lite && <SheetLightning />}
        {!lite && <InspectionLight />}

        <NeonSign />
        <TuningNeon />
        <Dust count={lite ? 90 : 460} />
      </group>

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

      {/* The photographs arrive with the bay they hang in. */}
      <StationBundle station={5}>
        <OfficeGallery />
      </StationBundle>

      {/* Shader warmup for everything that is NOT a station bundle — the shell,
          the weather, the neon. Asynchronous, behind the plate, and the last
          thing the door waits on. */}
      {/* No padding lights on a phone: the bays there carry no real lights to
          pad against, so the loop stays exactly as long as the building needs. */}
      <WarmScene target={shell} padLights={lite ? 0 : 10} />
      {/* Answers to none of the pacing mechanisms: whatever they hide, this
          puts back if they have not. A slow shop is a problem; an empty one
          is a broken site. */}
      <VisibilityWatchdog target={shell} />
      {lite && <DetailCull target={shell} />}

      <FocusRig effect={dof} />
      {!lite && <QualityRig ao={ao} onStruggle={onStruggle} />}

      {lite ? (
        /* The phone composer: bloom (the neon IS the brand) and the vignette,
           nothing else. AO, rack focus and the lens fringe are desktop money. */
        <EffectComposer ref={composer} multisampling={0} frameBufferType={THREE.HalfFloatType}>
          <Bloom
            mipmapBlur
            intensity={0.95}
            luminanceThreshold={1}
            luminanceSmoothing={0.11}
            radius={0.7}
          />
          {/* Film grain is the one desktop nicety a phone can afford — a
              single extra texture fetch in the pass that already runs. It
              also dithers the gradients a low-DPR canvas bands on. */}
          <Noise premultiply opacity={0.5} />
          <Vignette offset={0.42} darkness={0.38} />
        </EffectComposer>
      ) : (
        /* 4x MSAA on the desktop composer. The canvas itself runs with
           `antialias: false` because the composer owns the framebuffer — which
           meant every edge in the full-tier scene was raw and stair-stepped,
           and at ~200 hard vertical edges of cladding per frame that read as
           "soft and shimmery" rather than crisp. WebGL2 multisampled
           renderbuffers put real geometric AA back for one resolve per frame. */
        <EffectComposer multisampling={4} frameBufferType={THREE.HalfFloatType}>
          {/* GROUNDING. Nothing in this building casts a real shadow — a shadow
              map across a 68 m span would cost more than the model budget — so
              until now every object sat on a hand-painted blob and the corners,
              the undersides and the gaps between stacked things all read at the
              same value as open floor. Screen-space AO puts the contact back
              everywhere at once: under the sills, inside the wheel arches, where
              a drum meets concrete, in the rib shadows of the cladding. Half
              resolution and the cheapest quality tier, because it only has to be
              felt, not read. */}

          <N8AO
            ref={ao}
            halfRes
            quality="performance"
            aoSamples={6}
            denoiseSamples={2}
            denoiseRadius={6}
            aoRadius={1.4}
            distanceFalloff={0.8}
            intensity={2.4}
            color="#04050a"
          />
          {/* Threshold 1 — only true emissives (bulbs, neon, headlights) bloom. */}
          <Bloom
            mipmapBlur
            intensity={0.95}
            luminanceThreshold={1}
            luminanceSmoothing={0.11}
            radius={0.7}
          />
          {/* A real lens, shallow-ish and cheap. Focus rides the LOOK curve, so
              whatever the station is about is the thing that is sharp and the
              far end of the shop falls away — which is most of the difference
              between a render and a photograph. Quarter-resolution bokeh: at
              this blur radius nobody can tell, and it is the only reason the
              pass is affordable. */}

          <DepthOfField
            ref={dof}
            target={ORIGIN}
            focusDistance={7}
            focusRange={9}
            bokehScale={1.3}
            resolutionScale={0.25}
          />
          <ChromaticAberration
            offset={CHROMATIC_OFFSET}
            radialModulation={false}
            modulationOffset={0}
          />
          {/* The GRADE — the difference between "rendered" and "shot". A
              touch more saturation so the tungsten pools and the neon carry,
              and a gentle S-curve of contrast to sink the shadows. Kept
              subtle: the room's exposure was tuned by hand and the grade must
              flatter it, not fight it. */}
          <HueSaturation saturation={0.08} />
          <BrightnessContrast contrast={0.07} />
          {/* Film grain, premultiplied so it lives in the midtones and leaves
              the blacks black — the last percent of "shot on film". */}
          <Noise premultiply opacity={0.5} />
          {/* Shallow. The CSS layers in front of the canvas do their own falloff;
              a steep vignette here as well was double-darkening the corners. */}
          <Vignette offset={0.42} darkness={0.38} />
        </EffectComposer>
      )}
    </>
  );
}

/* ── Host ───────────────────────────────────────────────────────────────────
   Fixed, inset 0, pointer-events-none, aria-hidden, behind the page. It holds
   no layout, so it cannot shift a pixel; everything the reader can click sits
   in front of it. The scrim keeps body copy legible over the shop — lightened
   along with the scene, because a shop nobody can see is not a backdrop. */

export function ShopWorld({ tier = "full" }: { tier?: WorldTier }) {
  const [lit, setLit] = useState(false);
  const [awake, setAwake] = useState(true);
  /* THE RENDERER STARTS PARKED.
     A WebGL scene compiles itself on the first frame that draws it, and on this
     one that frame measured five seconds on a Radeon 740M — the single longest
     stall in the whole profile. So no frame is drawn at all until the shell has
     been compiled off the animation loop (`WarmScene`), which happens while the
     plate at the door is still up and the reader is watching a percentage. */
  const [warm, setWarm] = useState(false);
  /* Sharpness lives here, and it is chosen once.
     Full tier opens at native DPR, capped at 2 — a 4K panel at DPR 2 is already
     8M fragments per pass.
     Lite opens at exactly ONE device pixel per CSS pixel. A 390-point phone
     reports a ratio of three; at the old 1.25 the shop was pushing 640k
     fragments through bloom and a grain pass on a chip that also has a browser
     to run. At 1.0 it is 330k — and on a screen where the whole car is four
     inches wide, the sharpness difference is not visible and the frame rate
     is. */
  const [dpr, setDpr] = useState(() =>
    tier === "lite"
      ? 1
      : Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1.5 : 1.5, 2),
  );

  useEffect(() => {
    // Park the loop when the tab goes away, wake it when it comes back. Driven
    // by the event, not by a reading at mount: a page opened in a background
    // tab must still be running when the reader finally switches to it.
    const visibility = () => setAwake(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  useEffect(
    () =>
      subscribeBoot((s) => {
        if (s.warm) setWarm(true);
      }),
    [],
  );

  /* WHAT NOT TO DO WHEN THE MACHINE IS STRUGGLING: change the resolution.
     It is the obvious lever — fewer pixels, more frames — and on this post
     chain it is a trap. Every resize rebuilds the composer's targets AND
     re-translates its shaders, which on the Radeon test machine measured a
     TWENTY-FOUR SECOND stall: the cure was fifty times worse than the disease,
     and it fires exactly when the machine is already behind.
     So the struggle signal spends what is free instead — the AO pass switches
     off in `QualityRig`, which costs nothing to change and buys back the most
     expensive pass in the chain. Resolution is chosen once, at mount, and left
     alone. */
  const onStruggle = useCallback((_struggling: boolean) => {}, []);

  useEffect(() => {
    // The meter at the door. Downloads own the first 70% — everything past
    // that is compile, and compile is reported by the bays themselves.
    const manager = THREE.DefaultLoadingManager;
    reportBootProgress(0.06);
    manager.onProgress = (_url, loaded, total) => {
      reportBootProgress(0.06 + 0.64 * (loaded / Math.max(total, 1)));
    };
    return () => {
      manager.onProgress = () => {};
    };
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
        /* A FIFTH OF A PIXEL PER PIXEL, UNTIL IT IS WARM.
           The warm-up renders its first frames by hand, and those frames are
           where the post chain is built: the AO pass alone re-draws the whole
           building through a depth material, which is another fifty programs
           for Direct3D to translate. At full resolution that came to a single
           fifteen-second command buffer — past the Windows display watchdog,
           which resets the driver and drops the WebGL context.
           Shader translation does not care how many pixels it is asked to
           cover, so the warm frames are rendered at a fifth of the resolution
           and cost a fraction of the time. The moment the shop is warm the
           canvas snaps back to full sharpness, and the only thing that first
           real frame has left to do is allocate its buffers. */
        dpr={dpr}
        frameloop={awake && warm ? "always" : "never"}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 40, near: 0.1, far: 130, position: CAM_START.toArray() }}
        onCreated={({ gl, scene, camera }) => {
          // ACES rolls the highlights off, and every true emissive in the shop
          // (bulbs, neon, headlights) is `toneMapped={false}`, so exposure lifts
          // the ROOM without touching the light sources — the mood survives.
          gl.toneMappingExposure = 1.24;
          /* THE SINGLE BIGGEST WIN IN THE WHOLE PROFILE.
             three checks every program for link errors the first time it is
             used, and that check calls `getProgramInfoLog` and
             `getShaderInfoLog`. On Windows/ANGLE those calls block until D3D
             has finished translating and linking the shader — a V8 CPU profile
             of the old build put THIRTY-NINE SECONDS inside three's
             `onFirstUse`, which is where the twelve- to twenty-one-second
             frames came from. It is a development aid; a shipped build has no
             use for the logs, and turning it off leaves the compile to the
             driver's own parallel path. Kept on under `?perf` so a broken
             shader still says so out loud in development. */
          gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
          // `?perf` hands the renderer to the console so a profiling run can
          // read draw calls, triangles and program count without a dev build.
          if (window.location.search.includes("perf")) {
            console.log(
              `[shop] renderer created @${Math.round(performance.now())} ms · dpr ${gl.getPixelRatio()}`,
            );
            gl.info.autoReset = false;
            (window as unknown as { __shop?: unknown }).__shop = {
              gl,
              scene,
              camera,
              /** Per-frame draw calls and triangles, averaged over `frames`. */
              cost: (frames = 30) =>
                new Promise((resolve) => {
                  gl.info.reset();
                  let n = 0;
                  const tick = () => {
                    if (++n < frames) return requestAnimationFrame(tick);
                    resolve({
                      calls: Math.round(gl.info.render.calls / frames),
                      triangles: Math.round(gl.info.render.triangles / frames),
                      programs: gl.info.programs?.length ?? 0,
                      geometries: gl.info.memory.geometries,
                      textures: gl.info.memory.textures,
                    });
                  };
                  requestAnimationFrame(tick);
                }),
              parallelCompile: Boolean(
                gl.getContext().getExtension("KHR_parallel_shader_compile"),
              ),
            };
          }
          requestAnimationFrame(() => setLit(true));
        }}
      >
        {/* THE DPR MONITOR IS GONE, DELIBERATELY.
            A `PerformanceMonitor` sat here walking the device pixel ratio up
            and down with the frame rate, which is the textbook answer and, on
            this post chain, a doom loop: every DPR change rebuilds the
            composer's render targets and re-translates its shaders — measured
            at up to twenty-four seconds of frozen main thread on the Radeon
            test machine. It fired precisely when frames were already being
            missed, which made the frames worse, which fired it again.
            Resolution is now decided once from the tier and left alone; the
            quality that flexes at runtime is the AO pass, which costs nothing
            to switch. */}
        <SceneContents tier={tier} onStruggle={onStruggle} />
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
