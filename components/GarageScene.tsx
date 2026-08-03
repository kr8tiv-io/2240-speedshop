"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, PerformanceMonitor, Text } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

/* ─────────────────────────────────────────────────────────────────────────────
   MIDNIGHT GARAGE — the scene.

   Decoration, never content. Everything a crawler or an answer engine needs is
   in the server-rendered HTML around this canvas (AI-SEO playbook §3: no AI
   crawler except Googlebot executes JS). The canvas is aria-hidden, pointer-
   events-none, absolutely positioned, and never inserted into layout — so it
   cannot shift a pixel or hold a byte of copy hostage.

   Built from THREE primitives only. No GLB fetches, no CDN textures, no HDRI —
   it renders identically on a shop laptop with the wifi unplugged.
   ────────────────────────────────────────────────────────────────────────── */

const TUNGSTEN = "#ffb066";
const NEON_BLOOM = "#e04545";
const BAY_BLACK = "#0b0b0d";
const STEEL = "#c7c9cc";

/** Cold Start ramp length, seconds (concept §3.1 — the breaker thunk). */
const INTRO = 2.0;

/* ── The Drift ──────────────────────────────────────────────────────────────
   One CatmullRomCurve3 through the bays for the camera, a second for the
   lookAt target. Scroll progress rides the curve; the shot never cuts. */
const CAM_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0.8, 2.05, 12.6),
    new THREE.Vector3(-0.4, 1.92, 8.6),
    new THREE.Vector3(-1.5, 1.74, 5.0),
    new THREE.Vector3(-1.2, 1.6, 1.6),
    new THREE.Vector3(0.7, 1.82, -1.4),
  ],
  false,
  "centripetal",
  0.5,
);

const LOOK_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-1.4, 1.85, 3.2),
    new THREE.Vector3(-2.1, 1.78, 0.6),
    new THREE.Vector3(-2.5, 1.72, -2.0),
    new THREE.Vector3(0.2, 2.05, -7.4),
    new THREE.Vector3(2.6, 2.95, -10.6),
  ],
  false,
  "centripetal",
  0.5,
);

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Cold Start: 0 → 1 over ~2s. Reduced motion arrives with the lights already on. */
function introAt(elapsed: number, reduced: boolean) {
  if (reduced) return 1;
  return easeOutCubic(THREE.MathUtils.clamp(elapsed / INTRO, 0, 1));
}

/* Flicker is punctuation (concept §2.4.3): two stutters on arrival, then hold.
   Stepped, not interpolated — real neon does not crossfade. */
const FLICKER_KEYS: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [2.02, 1],
  [2.15, 0.1],
  [2.27, 1],
  [2.4, 0.34],
  [2.52, 1],
];

function flickerAt(elapsed: number, reduced: boolean) {
  if (reduced) return 1;
  if (elapsed >= 2.52) return 1;
  for (let i = FLICKER_KEYS.length - 1; i >= 0; i--) {
    if (elapsed >= FLICKER_KEYS[i][0]) return FLICKER_KEYS[i][1];
  }
  return 0;
}

/* ── Camera rig ─────────────────────────────────────────────────────────── */

function CameraRig({ reduced }: { reduced: boolean }) {
  const target = useRef(0);
  const eased = useRef(0);
  const position = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const read = () => {
      // The drift resolves as the hero leaves — roughly 1.6 viewports of scroll.
      const span = Math.max(window.innerHeight * 1.6, 1);
      target.current = THREE.MathUtils.clamp(window.scrollY / span, 0, 1);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.1);
    const elapsed = state.clock.elapsedTime;

    if (reduced) {
      CAM_PATH.getPointAt(0.08, position);
      LOOK_PATH.getPointAt(0.08, lookAt);
      state.camera.position.copy(position);
      state.camera.lookAt(lookAt);
      return;
    }

    const previous = eased.current;
    // λ = 1.5 → the camera behaves like it weighs 400 lb. Fast scrolling still
    // renders as a heavy, cinematic dolly instead of a jump cut.
    eased.current = THREE.MathUtils.damp(eased.current, target.current, 1.5, step);
    const speed = Math.abs(eased.current - previous) / step;
    const idle = THREE.MathUtils.clamp(1 - speed * 9, 0, 1);

    CAM_PATH.getPointAt(eased.current, position);
    LOOK_PATH.getPointAt(eased.current, lookAt);

    // Gentle idle float when nobody is scrolling — the shop breathing.
    position.y += Math.sin(elapsed * 0.42) * 0.075 * idle;
    position.x += Math.cos(elapsed * 0.29) * 0.09 * idle;
    // Cold Start push-in: six inches of approach as the lights come up.
    position.z += (1 - introAt(elapsed, reduced)) * 0.55;

    state.camera.position.copy(position);
    state.camera.lookAt(lookAt);
  });

  return null;
}

/* ── Shell: floor, walls, ceiling ───────────────────────────────────────── */

function Bay() {
  return (
    <group>
      {/* Sealed concrete, wet-looking under the work lights. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]}>
        <planeGeometry args={[44, 48]} />
        <MeshReflectorMaterial
          resolution={256}
          blur={[420, 140]}
          mixBlur={1}
          mixStrength={18}
          mirror={0}
          depthScale={1.1}
          minDepthThreshold={0.35}
          maxDepthThreshold={1.35}
          color="#2a2b31"
          metalness={0.15}
          roughness={0.72}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3.2, -11]}>
        <boxGeometry args={[19, 6.4, 0.3]} />
        <meshStandardMaterial color="#282a31" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Side walls */}
      {[-9.2, 9.2].map((x) => (
        <mesh key={x} position={[x, 3.2, 1]}>
          <boxGeometry args={[0.3, 6.4, 24.5]} />
          <meshStandardMaterial color="#232529" roughness={0.92} metalness={0.08} />
        </mesh>
      ))}

      {/* Ceiling — catches just enough tungsten to read as a lid, not a void. */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.4, 1]}>
        <planeGeometry args={[19, 24.5]} />
        <meshStandardMaterial color="#1a1b1f" roughness={1} metalness={0} />
      </mesh>

      {/* Floor stripe — bay line, the one piece of shop signage in paint. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.6, 0.012, -1.6]}>
        <planeGeometry args={[6.4, 0.09]} />
        <meshBasicMaterial color="#3a3126" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Corrugated steel cladding — ~100 ribs, one draw call. */
function Corrugation() {
  const ribs = useMemo(() => {
    const geometry = new THREE.BoxGeometry(0.13, 6.3, 0.13);
    const material = new THREE.MeshStandardMaterial({
      color: "#42454e",
      roughness: 0.62,
      metalness: 0.28,
    });

    const specs: { x: number; z: number; ry: number }[] = [];
    for (let x = -8.9; x <= 8.9; x += 0.64) specs.push({ x, z: -10.82, ry: 0 });
    for (let z = -10.3; z <= 12.4; z += 0.7) {
      specs.push({ x: -9.02, z, ry: Math.PI / 2 });
      specs.push({ x: 9.02, z, ry: Math.PI / 2 });
    }

    const mesh = new THREE.InstancedMesh(geometry, material, specs.length);
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const scale = new THREE.Vector3(1, 1, 1);
    const position = new THREE.Vector3();

    specs.forEach((spec, i) => {
      euler.set(0, spec.ry, 0);
      quaternion.setFromEuler(euler);
      position.set(spec.x, 3.16, spec.z);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    return mesh;
  }, []);

  useEffect(() => {
    return () => {
      ribs.geometry.dispose();
      (ribs.material as THREE.Material).dispose();
      ribs.dispose();
    };
  }, [ribs]);

  return <primitive object={ribs} />;
}

/* ── The hoist, and what is on it ───────────────────────────────────────── */

const DECK = 1.42;

function Vehicle() {
  return (
    <group position={[0, DECK, 0]}>
      {/* Frame rails */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[4.9, 0.16, 1.72]} />
        <meshStandardMaterial color="#2e3138" roughness={0.55} metalness={0.35} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[4.95, 0.78, 1.98]} />
        <meshStandardMaterial color="#3d424c" roughness={0.34} metalness={0.3} />
      </mesh>
      {/* Cab */}
      <mesh position={[-0.62, 1.24, 0]}>
        <boxGeometry args={[1.95, 0.76, 1.9]} />
        <meshStandardMaterial color="#3a3f49" roughness={0.32} metalness={0.3} />
      </mesh>
      {/* Roof cap */}
      <mesh position={[-0.62, 1.65, 0]}>
        <boxGeometry args={[1.8, 0.1, 1.82]} />
        <meshStandardMaterial color="#474d58" roughness={0.26} metalness={0.34} />
      </mesh>
      {/* Bed walls */}
      <mesh position={[1.42, 1.05, 0]}>
        <boxGeometry args={[2.2, 0.44, 1.94]} />
        <meshStandardMaterial color="#363b44" roughness={0.38} metalness={0.3} />
      </mesh>
      {/* Wheels, hanging free — it is on the lift, after all. */}
      {[
        [-1.72, 0.95],
        [-1.72, -0.95],
        [1.68, 0.95],
        [1.68, -0.95],
      ].map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 0.06, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.45, 0.45, 0.34, 18]} />
          <meshStandardMaterial color="#191a1e" roughness={0.95} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

function Hoist() {
  return (
    <group position={[-2.6, 0, -1.6]}>
      {[-1.62, 1.62].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.07, 0]}>
            <boxGeometry args={[0.95, 0.14, 1.2]} />
            <meshStandardMaterial color="#2b2d33" roughness={0.85} metalness={0.2} />
          </mesh>
          <mesh position={[0, 2.15, 0]}>
            <boxGeometry args={[0.34, 4.3, 0.34]} />
            <meshStandardMaterial color="#585c66" roughness={0.45} metalness={0.34} />
          </mesh>
          <mesh position={[0, 4.36, 0]}>
            <boxGeometry args={[0.46, 0.18, 0.46]} />
            <meshStandardMaterial color="#63676f" roughness={0.4} metalness={0.38} />
          </mesh>
        </group>
      ))}

      {/* Overhead tie bar */}
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[3.6, 0.2, 0.28]} />
        <meshStandardMaterial color="#53575f" roughness={0.45} metalness={0.36} />
      </mesh>

      {/* Swing arms under the rails */}
      {[
        [-1.35, 0.78],
        [-1.35, -0.78],
        [1.35, 0.78],
        [1.35, -0.78],
      ].map(([x, z]) => (
        <mesh key={`arm-${x}:${z}`} position={[x * 0.72, DECK - 0.08, z]}>
          <boxGeometry args={[1.15, 0.13, 0.2]} />
          <meshStandardMaterial color="#4e525b" roughness={0.45} metalness={0.34} />
        </mesh>
      ))}

      <Vehicle />
    </group>
  );
}

/* ── Set dressing ───────────────────────────────────────────────────────── */

function Workbench() {
  return (
    <group position={[3.8, 0, -10.1]}>
      <mesh position={[0, 0.94, 0]}>
        <boxGeometry args={[4.3, 0.11, 0.88]} />
        <meshStandardMaterial color="#5a5e67" roughness={0.42} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[4.1, 0.07, 0.74]} />
        <meshStandardMaterial color="#33353c" roughness={0.8} metalness={0.15} />
      </mesh>
      {[
        [-2.02, 0.36],
        [-2.02, -0.36],
        [2.02, 0.36],
        [2.02, -0.36],
      ].map(([x, z]) => (
        <mesh key={`leg-${x}:${z}`} position={[x, 0.47, z]}>
          <boxGeometry args={[0.1, 0.94, 0.1]} />
          <meshStandardMaterial color="#3b3d44" roughness={0.7} metalness={0.25} />
        </mesh>
      ))}
      {/* Pegboard */}
      <mesh position={[0, 1.95, -0.44]}>
        <boxGeometry args={[4.3, 1.7, 0.07]} />
        <meshStandardMaterial color="#2f3138" roughness={0.9} metalness={0.08} />
      </mesh>
      {/* Hung tools — silhouettes, nothing more */}
      {[-1.5, -0.9, -0.25, 0.5, 1.3, 1.85].map((x, i) => (
        <mesh key={`tool-${x}`} position={[x, 1.95 - (i % 2) * 0.18, -0.36]}>
          <boxGeometry args={[0.07, 0.5 + (i % 3) * 0.16, 0.05]} />
          <meshStandardMaterial color="#767b85" roughness={0.32} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Toolbox() {
  const drawers = [0, 1, 2, 3, 4];
  return (
    <group position={[6.9, 0, -10.05]}>
      {/* Roll cab */}
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[1.55, 1.12, 0.66]} />
        <meshStandardMaterial color="#7a2b2b" roughness={0.42} metalness={0.25} />
      </mesh>
      {drawers.map((i) => (
        <mesh key={`d-${i}`} position={[0, 0.2 + i * 0.2, 0.34]}>
          <boxGeometry args={[1.42, 0.035, 0.03]} />
          <meshStandardMaterial color="#b9bdc5" roughness={0.28} metalness={0.45} />
        </mesh>
      ))}
      {/* Worktop */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[1.65, 0.06, 0.72]} />
        <meshStandardMaterial color="#5a5e67" roughness={0.35} metalness={0.35} />
      </mesh>
      {/* Top chest */}
      <mesh position={[0, 1.5, -0.02]}>
        <boxGeometry args={[1.5, 0.64, 0.6]} />
        <meshStandardMaterial color="#7a2b2b" roughness={0.42} metalness={0.25} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={`td-${i}`} position={[0, 1.28 + i * 0.19, 0.29]}>
          <boxGeometry args={[1.38, 0.03, 0.03]} />
          <meshStandardMaterial color="#b9bdc5" roughness={0.28} metalness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function TireStack({ position, count = 4 }: { position: [number, number, number]; count?: number }) {
  return (
    <group position={position}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[0, 0.2 + i * 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.43, 0.17, 8, 20]} />
          <meshStandardMaterial color="#1d1e22" roughness={0.96} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Light pools ────────────────────────────────────────────────────────── */

function ShopLight({
  position,
  delay,
  reduced,
}: {
  position: [number, number, number];
  delay: number;
  reduced: boolean;
}) {
  const disc = useRef<THREE.MeshStandardMaterial>(null);
  const bulb = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const k = introAt(state.clock.elapsedTime - delay, reduced);
    if (disc.current) disc.current.emissiveIntensity = 2.7 * k;
    if (bulb.current) bulb.current.intensity = 95 * k;
  });

  return (
    <group position={position}>
      {/* Drop rod */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 2, 6]} />
        <meshStandardMaterial color="#3a3c43" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Shade */}
      <mesh>
        <coneGeometry args={[0.56, 0.44, 20, 1, true]} />
        <meshStandardMaterial color="#5b5f68" side={THREE.DoubleSide} roughness={0.42} metalness={0.32} />
      </mesh>
      {/* Emissive face — the only thing bloom is allowed to see up here */}
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.48, 20]} />
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
        distance={18}
        decay={2}
        position={[0, -0.35, 0]}
      />
    </group>
  );
}

/* ── The neon ───────────────────────────────────────────────────────────── */

/* Seven-segment tube layout. Built from capsules rather than fetched type so
   the sign is guaranteed to light regardless of network — the wall lettering
   underneath uses drei/troika text, which is allowed to fail quietly. */
const SEG_W = 0.74;
const SEG_V = 0.7;
const Y_TOP = 0.76;
const Y_MID = 0.38;

type Segment = { x: number; y: number; length: number; horizontal: boolean };

const SEGMENTS: Record<string, Segment> = {
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

const TUBES = SIGN.split("").flatMap((glyph, index) => {
  const offset = (index - (SIGN.length - 1) / 2) * DIGIT_PITCH;
  return (GLYPHS[glyph] ?? []).map((key) => {
    const seg = SEGMENTS[key];
    return {
      id: `${index}-${key}`,
      position: [offset + seg.x, seg.y, 0] as [number, number, number],
      rotation: [0, 0, seg.horizontal ? Math.PI / 2 : 0] as [number, number, number],
      length: seg.length,
    };
  });
});

const TUBE_RADIUS = 0.055;

function NeonSign({ reduced }: { reduced: boolean }) {
  const tubes = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const glow = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const k = introAt(elapsed - 0.5, reduced) * flickerAt(elapsed, reduced);
    for (const material of tubes.current) {
      if (material) material.emissiveIntensity = 3.6 * k;
    }
    if (glow.current) glow.current.intensity = 24 * k;
  });

  return (
    <group position={[2.6, 3.55, -10.66]}>
      {/* Rusted steel backing plate — rust first, neon second (concept §2.3) */}
      <mesh position={[0, -0.05, -0.14]}>
        <boxGeometry args={[4.5, 2.75, 0.1]} />
        <meshStandardMaterial color="#6b4a30" roughness={0.85} metalness={0.25} />
      </mesh>
      <mesh position={[0, -0.05, -0.08]}>
        <boxGeometry args={[4.24, 2.5, 0.03]} />
        <meshStandardMaterial color="#2a211b" roughness={0.95} metalness={0.1} />
      </mesh>

      {TUBES.map((tube, i) => (
        <mesh key={tube.id} position={tube.position} rotation={tube.rotation}>
          <capsuleGeometry args={[TUBE_RADIUS, Math.max(tube.length - TUBE_RADIUS * 2, 0.05), 4, 12]} />
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

      <Suspense fallback={null}>
        <Text
          position={[0, -1.02, 0.02]}
          fontSize={0.19}
          letterSpacing={0.3}
          anchorX="center"
          anchorY="middle"
        >
          CLASSICS AND CUSTOMS
          <meshStandardMaterial
            color="#050505"
            emissive={STEEL}
            emissiveIntensity={1.15}
            toneMapped={false}
          />
        </Text>
      </Suspense>

      <pointLight ref={glow} color={NEON_BLOOM} intensity={0} distance={11} decay={2} position={[0, 0, 1.1]} />
    </group>
  );
}

/* ── Atmosphere ─────────────────────────────────────────────────────────── */

function Dust({ count = 150 }: { count?: number }) {
  const cloud = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = THREE.MathUtils.randFloatSpread(13);
      array[i * 3 + 1] = THREE.MathUtils.randFloat(0.4, 4.6);
      array[i * 3 + 2] = THREE.MathUtils.randFloat(-9.5, 8);
    }
    return array;
  }, [count]);

  useFrame((state, delta) => {
    if (!cloud.current) return;
    cloud.current.rotation.y += Math.min(delta, 0.1) * 0.01;
    cloud.current.position.y = Math.sin(state.clock.elapsedTime * 0.11) * 0.16;
  });

  return (
    <points ref={cloud} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color={TUNGSTEN}
        sizeAttenuation
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  );
}

function Ambience({ reduced }: { reduced: boolean }) {
  const ambient = useRef<THREE.AmbientLight>(null);

  useFrame((state) => {
    const k = introAt(state.clock.elapsedTime, reduced);
    if (ambient.current) ambient.current.intensity = 0.16 * k;
  });

  return (
    <>
      <ambientLight ref={ambient} color="#5c6575" intensity={0} />
      <ShopLight position={[-2.6, 4.6, -1.6]} delay={0} reduced={reduced} />
      <ShopLight position={[3.6, 4.6, -7.6]} delay={0.32} reduced={reduced} />
      <ShopLight position={[-0.4, 4.6, 4.8]} delay={0.64} reduced={reduced} />
    </>
  );
}

/* ── Scene graph ────────────────────────────────────────────────────────── */

function SceneContents({ reduced }: { reduced: boolean }) {
  return (
    <>
      <color attach="background" args={[BAY_BLACK]} />
      <fog attach="fog" args={[BAY_BLACK, 7, 33]} />

      <CameraRig reduced={reduced} />
      <Ambience reduced={reduced} />

      <Bay />
      <Corrugation />
      <Hoist />
      <Workbench />
      <Toolbox />
      <TireStack position={[7.6, 0, -5.4]} />
      <TireStack position={[-7.4, 0, -6.6]} count={3} />
      <NeonSign reduced={reduced} />
      <Dust />

      {/* Bloom only — high threshold so nothing but true emissives glow. */}
      <EffectComposer multisampling={2} frameBufferType={THREE.HalfFloatType}>
        <Bloom mipmapBlur intensity={1.3} luminanceThreshold={1} luminanceSmoothing={0.25} radius={0.78} />
      </EffectComposer>
    </>
  );
}

/* ── Client gate ────────────────────────────────────────────────────────── */

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext("webgl2") ?? canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

type Gate = { status: "idle" | "run" | "skip"; reduced: boolean };

/**
 * Next 16 forbids `next/dynamic` with `ssr: false` inside a Server Component,
 * so the client boundary owns the client-only mount instead: this component
 * server-renders to `null` and only builds a WebGL context after it has checked
 * viewport, GPU and motion preference. The hero still underneath is what
 * crawlers, phones and no-WebGL machines get — and nothing ever shifts layout.
 */
export function GarageScene() {
  const [gate, setGate] = useState<Gate>({ status: "idle", reduced: false });
  const [lit, setLit] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    // Phones get the static cinematic (concept §5) — first-class, not fallback.
    setGate({ status: wide && cores > 2 && hasWebGL() ? "run" : "skip", reduced });
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!element || gate.status !== "run") return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [gate.status]);

  if (gate.status !== "run") return null;

  return (
    <div
      ref={host}
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
        lit ? "opacity-100" : "opacity-0"
      }`}
    >
      <Canvas
        dpr={dpr}
        frameloop={onScreen ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 40, near: 0.1, far: 64, position: [0.8, 2.05, 12.6] }}
        onCreated={() => requestAnimationFrame(() => setLit(true))}
      >
        {/* Degrade features, never frame rate (concept §2.4.4). */}
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.75)}
          onFallback={() => setDpr(1)}
        />
        <SceneContents reduced={gate.reduced} />
      </Canvas>
    </div>
  );
}

export default GarageScene;
