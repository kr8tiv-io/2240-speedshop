"use client";

import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { ContactShadow } from "./materials";
import {
  ALLOY,
  CAST_IRON,
  CHROME,
  DARK_STEEL,
  ENAMEL_COAT,
  ENGINE_ORANGE,
  GRIME,
  LIFT_RED,
  RUBBER,
  SAFETY,
  STEEL,
  TOOL_RED,
  influence,
  railOf,
} from "./world";

/* ─────────────────────────────────────────────────────────────────────────────
   HARDWARE BUILT FROM PRIMITIVES

   Four things the brief needs do not exist as a licence-clean download
   anywhere — the asset audit in `public/models/CREDITS.md` documents the search
   that came up empty. A two-post lift, an automotive V8, an engine stand and a
   cherry picker, a floor jack and a set of dyno rollers are therefore modelled
   here, to the real clearances in that same file: lift columns 3.5 m apart,
   pads at 1.75 m, 12 ft of headroom.

   These are the hero details, so they get the detail: curved chrome header
   tubes swept along CatmullRom curves, plug wires off the distributor cap, a
   blower belt, knurled dyno drums. Everything shares the material presets in
   `world.ts` so the hand-built steel and the photogrammetry props read as one
   room.
   ────────────────────────────────────────────────────────────────────────── */

type Vec3 = [number, number, number];

/**
 * Swept tubes — header pipes, plug wires, hydraulic lines, extraction ducting —
 * are the expensive geometry in this file and every one of them is a constant
 * shape. They are built on first use, keyed, and shared by every instance: the
 * second V8 in the shop reuses the first one's eight header pipes rather than
 * uploading another 25k vertices. Nothing here is ever rebuilt in a frame.
 */
const TUBES = new Map<string, THREE.TubeGeometry>();

function tubeGeo(key: string, points: Vec3[], radius: number, segments = 28) {
  const cached = TUBES.get(key);
  if (cached) return cached;
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const geometry = new THREE.TubeGeometry(curve, segments, radius, 8, false);
  TUBES.set(key, geometry);
  return geometry;
}

/* ── Castor ─────────────────────────────────────────────────────────────── */

function Caster({ position, radius = 0.06 }: { position: Vec3; radius?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, radius + 0.09, 0]}>
        <boxGeometry args={[0.09, 0.14, 0.09]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, radius, 0]}>
        <cylinderGeometry args={[radius, radius, 0.05, 12]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
    </group>
  );
}

/* ═══ TWO-POST LIFT ═════════════════════════════════════════════════════════
   Real clearances from the layout research: 132–139 in across the columns
   (3.35–3.53 m), 12 ft minimum ceiling, columns 10–12 ft back from the door.
   Pads land at `deck`; a car set on them hangs its wheels in mid-air, which is
   the whole point of the shot. */

function SwingArm({
  side,
  end,
  deck,
  span,
}: {
  side: number;
  end: number;
  deck: number;
  span: number;
}) {
  const dx = side * 0.94 - side * span;
  const dz = end * 1.24;
  const length = Math.hypot(dx, dz);
  // Ry(θ) sends local +X to (cosθ, 0, −sinθ); solve for the arm direction.
  const angle = Math.atan2(-dz, dx);

  return (
    <group position={[side * span, deck - 0.13, 0]} rotation={[0, angle, 0]}>
      {/* Pivot boss */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.095, 0.095, 0.2, 12]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      {/* Inner arm */}
      <mesh position={[length * 0.3, 0, 0]}>
        <boxGeometry args={[length * 0.62, 0.14, 0.22]} />
        <meshPhysicalMaterial {...LIFT_RED} {...ENAMEL_COAT} />
      </mesh>
      {/* Telescoping outer section, drawn out to reach the pinch weld */}
      <mesh position={[length * 0.75, 0, 0]}>
        <boxGeometry args={[length * 0.5, 0.11, 0.16]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* Pad stack — screw pad wound UP to the rocker, then the rubber puck the
          sill actually sits on. The screw is tall on purpose: a car's rocker
          panel rides well above its tyres' contact patch, and a short pad left
          daylight between arm and sill — the whole car read as levitating. */}
      <mesh position={[length, 0.155, 0]}>
        <cylinderGeometry args={[0.05, 0.046, 0.3, 12]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[length, 0.33, 0]}>
        <cylinderGeometry args={[0.115, 0.11, 0.055, 16]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
    </group>
  );
}

/** The block that rides the column — split out so a moving lift can carry it. */
function Carriage({ side, deck, span }: { side: number; deck: number; span: number }) {
  return (
    <group position={[side * span, 0, 0]}>
      <mesh position={[-side * 0.14, deck - 0.1, 0]}>
        <boxGeometry args={[0.28, 0.7, 0.56]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[-side * 0.22, deck - 0.1, 0]}>
        <boxGeometry args={[0.06, 0.5, 0.44]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
    </group>
  );
}

function LiftColumn({ side, deck, span }: { side: number; deck: number; span: number }) {
  return (
    <group position={[side * span, 0, 0]}>
      {/* Base plate, anchor bolts and a scuffed safety stripe */}
      <mesh position={[0, 0.055, 0]}>
        <boxGeometry args={[1.05, 0.11, 1.6]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[0, 0.115, 0]}>
        <boxGeometry args={[0.92, 0.012, 1.44]} />
        <meshPhysicalMaterial {...SAFETY} {...ENAMEL_COAT} />
      </mesh>
      {[-0.42, 0.42].map((x) =>
        [-0.62, 0.62].map((z) => (
          <mesh key={`${x}:${z}`} position={[x, 0.14, z]}>
            <cylinderGeometry args={[0.028, 0.028, 0.07, 8]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
        )),
      )}

      {/* Column, and the darker channel the carriage rides in */}
      <mesh position={[0, 2.36, 0]}>
        <boxGeometry args={[0.34, 4.5, 0.46]} />
        <meshPhysicalMaterial {...LIFT_RED} {...ENAMEL_COAT} />
      </mesh>
      <mesh position={[-side * 0.18, 2.36, 0]}>
        <boxGeometry args={[0.05, 4.3, 0.3]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      {/* Lock ladder — the notches a lift drops onto once it is up */}
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[-side * 0.2, 0.85 + i * 0.32, 0.19]}>
          <boxGeometry args={[0.05, 0.06, 0.06]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
      ))}

      {/* Cap and the equalizer cable running down inside the column */}
      <mesh position={[0, 4.66, 0]}>
        <boxGeometry args={[0.4, 0.16, 0.52]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[0, 2.9, 0.2]}>
        <cylinderGeometry args={[0.014, 0.014, 3.4, 6]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
    </group>
  );
}

export function TwoPostLift({
  position,
  yaw = 0,
  deck = 1.78,
  span = 1.76,
  travel,
  children,
}: {
  position: Vec3;
  yaw?: number;
  deck?: number;
  span?: number;
  /** Cycle the carriage between two heights — the shop is WORKING, not posed.
      A raised-cosine loop: rise, apex, settle, floor, again. Metres and
      seconds. */
  travel?: { min: number; max: number; period?: number };
  /** Whatever is up in the air — normally a car. */
  children?: ReactNode;
}) {
  const moving = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!travel || !moving.current) return;
    const period = travel.period ?? 34;
    // Phase-shifted by position so two animated lifts never move in sync.
    const phase = (state.clock.elapsedTime + position[0] * 3.1) / period;
    const height =
      travel.min +
      (travel.max - travel.min) * (0.5 - 0.5 * Math.cos(phase * Math.PI * 2));
    moving.current.position.y = height - deck;
  });
  // Hydraulic line looping between the two column bases, as it always does.
  const hose = tubeGeo(
    `lift-hose:${span}`,
    [
      [-span + 0.2, 0.16, 0.5],
      [-span * 0.5, 0.06, 0.72],
      [0, 0.05, 0.78],
      [span * 0.5, 0.06, 0.72],
      [span - 0.2, 0.16, 0.5],
    ],
    0.024,
  );

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <LiftColumn side={-1} deck={deck} span={span} />
      <LiftColumn side={1} deck={deck} span={span} />

      {/* Everything that rides the columns — carriages, arms, the vehicle —
          moves as one body when `travel` is set. */}
      <group ref={moving}>
        <Carriage side={-1} deck={deck} span={span} />
        <Carriage side={1} deck={deck} span={span} />

        <SwingArm side={-1} end={-1} deck={deck} span={span} />
        <SwingArm side={-1} end={1} deck={deck} span={span} />
        <SwingArm side={1} end={-1} deck={deck} span={span} />
        <SwingArm side={1} end={1} deck={deck} span={span} />

        <group position={[0, deck - 0.04, 0]}>{children}</group>
      </group>

      {/* Overhead assembly: beam, cable trough and the shut-off bar */}
      <mesh position={[0, 4.82, 0]}>
        <boxGeometry args={[span * 2 + 0.44, 0.28, 0.38]} />
        <meshPhysicalMaterial {...LIFT_RED} {...ENAMEL_COAT} />
      </mesh>
      <mesh position={[0, 4.62, 0]}>
        <boxGeometry args={[span * 2 - 0.1, 0.1, 0.16]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[0, 4.42, 0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, span * 2 - 0.2, 8]} />
        <meshPhysicalMaterial {...SAFETY} {...ENAMEL_COAT} />
      </mesh>

      {/* Power unit and its little green pilot lamp */}
      <group position={[-span - 0.28, 0, 0]}>
        <mesh position={[0, 1.42, 0]}>
          <boxGeometry args={[0.3, 0.78, 0.44]} />
          <meshStandardMaterial {...DARK_STEEL} />
        </mesh>
        <mesh position={[0, 1.86, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.34, 12]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[-0.16, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.022, 8]} />
          <meshStandardMaterial
            color="#04120b"
            emissive="#39e07a"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>

      <mesh geometry={hose}>
        <meshStandardMaterial color="#1a1b1f" roughness={0.86} metalness={0.1} />
      </mesh>

      {/* A raised car still darkens the floor — just softer and wider. */}
      <ContactShadow
        radius={2.6}
        spread={[0.72, 1]}
        opacity={0.38}
        power={1.2}
        position={[0, 0.014, 0]}
      />
    </group>
  );
}

/* ═══ TURNTABLE ═════════════════════════════════════════════════════════════
   The showroom beat: a finished car revolving slowly on a display base. The
   oldest trick in the car business, and the single cheapest piece of ongoing
   motion in the shop — one rotation a frame, no lights, no shader work. */

export function Turntable({
  position,
  speed = 0.14,
  children,
}: {
  position: Vec3;
  /** Radians per second. Showroom slow — a full lap every ~45 s. */
  speed?: number;
  children?: ReactNode;
}) {
  const disc = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (disc.current) disc.current.rotation.y += Math.min(delta, 0.1) * speed;
  });

  return (
    <group position={position}>
      {/* Static plinth ring with a safety stripe kerb */}
      <mesh position={[0, 0.055, 0]}>
        <cylinderGeometry args={[2.8, 2.9, 0.11, 40]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[0, 0.112, 0]}>
        <cylinderGeometry args={[2.82, 2.82, 0.012, 40]} />
        <meshPhysicalMaterial {...SAFETY} {...ENAMEL_COAT} />
      </mesh>
      {/* The revolving deck and whatever is parked on it */}
      <group ref={disc} position={[0, 0.13, 0]}>
        <mesh>
          <cylinderGeometry args={[2.62, 2.62, 0.06, 40]} />
          <meshPhysicalMaterial
            color="#23262c"
            roughness={0.3}
            metalness={0.42}
            {...ENAMEL_COAT}
          />
        </mesh>
        <group position={[0, 0.03, 0]}>{children}</group>
      </group>
      <ContactShadow radius={3.1} opacity={0.4} />
    </group>
  );
}

/* ═══ CEILING FAN ═══════════════════════════════════════════════════════════
   Industrial drum fan hung off the trusses, always turning. Nothing sells a
   big quiet building like slow air movement overhead. */

export function CeilingFan({
  position,
  speed = 3.2,
}: {
  position: Vec3;
  speed?: number;
}) {
  const rotor = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rotor.current) rotor.current.rotation.y += Math.min(delta, 0.1) * speed;
  });

  return (
    <group position={position}>
      {/* Drop rod and motor can */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.68, 6]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.15, 0.18, 0.24, 14]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <group ref={rotor} position={[0, -0.12, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <mesh position={[0.64, 0, 0]} rotation={[0, 0, 0.15]}>
              <boxGeometry args={[1.04, 0.014, 0.24]} />
              <meshStandardMaterial color="#4a4f58" roughness={0.5} metalness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ═══ THE V8 ════════════════════════════════════════════════════════════════
   Crank along Z, banks at ~41° either side, front of the engine at +Z. Block
   in cast iron, covers in painted orange, everything the light should catch —
   headers, carb hat, blower case, pulleys — in polished metal. */

const HEADER_PIPES: THREE.TubeGeometry[] = [];
const PLUG_WIRES: THREE.TubeGeometry[] = [];

for (const side of [-1, 1]) {
  for (let i = 0; i < 4; i++) {
    const z0 = -0.27 + i * 0.18;
    // Out of the port, down past the block, then back and UP — the swept,
    // staggered run is what makes a header read as a header and not a pipe.
    HEADER_PIPES.push(
      tubeGeo(
        `header:${side}:${i}`,
        [
          [side * 0.4, 0.62, z0],
          [side * 0.6, 0.55, z0],
          [side * 0.78, 0.38, z0 - 0.07],
          [side * 0.87, 0.18, z0 - 0.28],
          [side * 0.89, 0.13, -0.46 - i * 0.05],
          [side * 0.91, 0.25, -0.78 - i * 0.09],
        ],
        0.033,
        30,
      ),
    );
    PLUG_WIRES.push(
      tubeGeo(
        `wire:${side}:${i}`,
        [
          [side * 0.03, 1.02, -0.34],
          [side * 0.16, 1.0 - i * 0.03, -0.3 + i * 0.05],
          [side * 0.32, 0.82 - i * 0.02, z0 - 0.02],
          [side * 0.38, 0.66, z0],
        ],
        0.012,
        16,
      ),
    );
  }
}

/**
 * Eight polished pipes.
 *
 * These are the piece of hardware the whole engine shot hangs on, and for a
 * long time they were the worst thing in the building: at a wide roughness they
 * mirrored the whole overhead emitter down their length, cleared the bloom
 * threshold everywhere at once, and read as eight glowing NEON TUBES. Nothing
 * about them is emissive and nothing about them ever was — the fix is entirely
 * in the lobe. `CHROME` is now a true mirror, so each pipe catches one hard
 * strip-light streak with dark room either side of it, which is what chrome
 * looks like.
 */
function ZoomieHeaders() {
  const pipes = HEADER_PIPES;

  return (
    <group>
      {pipes.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshStandardMaterial {...CHROME} />
        </mesh>
      ))}
      {/* Flared tips. Heat-blued and sooted where the gas actually leaves —
          darker and rougher than the pipe, which is what sells the pipe. */}
      {[-1, 1].map((side) =>
        [0, 1, 2, 3].map((i) => (
          <mesh
            key={`${side}:${i}`}
            position={[side * 0.91, 0.26, -0.79 - i * 0.09]}
            rotation={[-Math.PI / 2 + 0.34, 0, 0]}
          >
            <cylinderGeometry args={[0.052, 0.036, 0.1, 12, 1, true]} />
            <meshStandardMaterial
              color="#41505f"
              roughness={0.34}
              metalness={0.95}
              side={THREE.DoubleSide}
            />
          </mesh>
        )),
      )}
    </group>
  );
}

function PlugWires() {
  return (
    <group>
      {PLUG_WIRES.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshStandardMaterial color="#6d1512" roughness={0.62} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function CylinderBank({ side }: { side: number }) {
  return (
    <group position={[side * 0.22, 0.72, 0]} rotation={[0, 0, -side * 0.72]}>
      {/* Head */}
      <mesh>
        <boxGeometry args={[0.36, 0.2, 0.72]} />
        <meshStandardMaterial {...CAST_IRON} />
      </mesh>
      {/* Valve cover */}
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.64]} />
        <meshPhysicalMaterial {...ENGINE_ORANGE} {...ENAMEL_COAT} />
      </mesh>
      {/* Hold-down bolts */}
      {[-0.22, -0.07, 0.07, 0.22].map((z) => (
        <mesh key={z} position={[0, 0.25, z]}>
          <cylinderGeometry args={[0.018, 0.018, 0.03, 6]} />
          <meshStandardMaterial {...CHROME} />
        </mesh>
      ))}
      {/* Breather cap */}
      <mesh position={[0, 0.29, 0.22]}>
        <cylinderGeometry args={[0.05, 0.055, 0.08, 12]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
    </group>
  );
}

export function V8Engine({
  position = [0, 0, 0],
  yaw = 0,
  tilt = 0,
  scale = 1,
  blower = false,
  headers = true,
}: {
  position?: Vec3;
  yaw?: number;
  tilt?: number;
  scale?: number;
  /** Roots blower and scoop instead of a four-barrel and an air cleaner. */
  blower?: boolean;
  headers?: boolean;
}) {
  return (
    <group position={position} rotation={[tilt, yaw, 0]} scale={scale}>
      {/* Oil pan and sump */}
      <mesh position={[0, 0.12, -0.02]}>
        <boxGeometry args={[0.5, 0.24, 0.66]} />
        <meshStandardMaterial {...CAST_IRON} />
      </mesh>
      <mesh position={[0, 0.05, 0.18]}>
        <boxGeometry args={[0.42, 0.12, 0.24]} />
        <meshStandardMaterial {...CAST_IRON} />
      </mesh>

      {/* Block */}
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[0.58, 0.44, 0.76]} />
        <meshStandardMaterial {...CAST_IRON} />
      </mesh>
      {/* Freeze plugs down the side, because a bare block is never smooth */}
      {[-0.24, 0, 0.24].map((z) =>
        [-1, 1].map((side) => (
          <mesh
            key={`${side}:${z}`}
            position={[side * 0.295, 0.44, z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.05, 0.05, 0.012, 10]} />
            <meshStandardMaterial {...STEEL} />
          </mesh>
        )),
      )}

      {/* Bell housing face — what bolts to the stand or the gearbox */}
      <mesh position={[0, 0.5, -0.41]}>
        <boxGeometry args={[0.54, 0.54, 0.08]} />
        <meshStandardMaterial {...CAST_IRON} />
      </mesh>

      <CylinderBank side={-1} />
      <CylinderBank side={1} />

      {/* Intake valley */}
      <mesh position={[0, 0.86, 0]}>
        <boxGeometry args={[0.44, 0.2, 0.66]} />
        <meshStandardMaterial {...ALLOY} />
      </mesh>

      {blower ? (
        <group>
          {/* Case */}
          <mesh position={[0, 1.08, 0]}>
            <boxGeometry args={[0.38, 0.26, 0.64]} />
            <meshStandardMaterial {...ALLOY} />
          </mesh>
          {[-0.2, 0, 0.2].map((z) => (
            <mesh key={z} position={[0, 1.22, z]}>
              <boxGeometry args={[0.4, 0.03, 0.08]} />
              <meshStandardMaterial {...CHROME} />
            </mesh>
          ))}
          {/* Snout and drive */}
          <mesh position={[0, 1.05, 0.4]}>
            <boxGeometry args={[0.2, 0.18, 0.18]} />
            <meshStandardMaterial {...ALLOY} />
          </mesh>
          <mesh position={[0, 1.05, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.06, 18]} />
            <meshStandardMaterial color="#5c616a" roughness={0.4} metalness={0.78} />
          </mesh>
          <mesh position={[0, 0.36, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.06, 18]} />
            <meshStandardMaterial color="#5c616a" roughness={0.4} metalness={0.78} />
          </mesh>
          {/* Cog belt between the two */}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.15, 0.71, 0.5]}>
              <boxGeometry args={[0.02, 0.7, 0.075]} />
              <meshStandardMaterial color="#17181c" roughness={0.85} metalness={0.05} />
            </mesh>
          ))}
          {/* Scoop */}
          <mesh position={[0, 1.32, -0.02]}>
            <boxGeometry args={[0.44, 0.16, 0.5]} />
            <meshStandardMaterial {...ALLOY} />
          </mesh>
          <mesh position={[0, 1.36, 0.24]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.44, 0.16, 0.2]} />
            <meshStandardMaterial {...ALLOY} />
          </mesh>
          <mesh position={[0, 1.4, 0.31]} rotation={[0.5, 0, 0]}>
            <planeGeometry args={[0.38, 0.14]} />
            <meshStandardMaterial color="#0a0a0c" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ) : (
        <group>
          {/* Four-barrel and a chrome air cleaner */}
          <mesh position={[0, 1.0, 0]}>
            <boxGeometry args={[0.24, 0.06, 0.24]} />
            <meshStandardMaterial {...ALLOY} />
          </mesh>
          <mesh position={[0, 1.09, 0]}>
            <boxGeometry args={[0.2, 0.16, 0.2]} />
            <meshStandardMaterial color="#8a8f98" roughness={0.34} metalness={0.72} />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.08, 24]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
          <mesh position={[0, 1.25, 0]}>
            <cylinderGeometry args={[0.25, 0.22, 0.03, 24]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
          <mesh position={[0, 1.29, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.05, 8]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
        </group>
      )}

      {/* Distributor at the back, cap on top, wires off it */}
      <mesh position={[0, 0.9, -0.34]}>
        <cylinderGeometry args={[0.065, 0.075, 0.24, 12]} />
        <meshStandardMaterial {...ALLOY} />
      </mesh>
      <mesh position={[0, 1.03, -0.34]}>
        <cylinderGeometry args={[0.085, 0.08, 0.08, 12]} />
        <meshStandardMaterial color="#1c1d21" roughness={0.7} metalness={0.1} />
      </mesh>
      <PlugWires />

      {/* Front dress. Deliberately NOT chrome: three polished discs facing the
          camera under a bay light read as three blown-out coins, not a pulley
          stack. Darker steel with a hub keeps the shape and loses the glare. */}
      <mesh position={[0, 0.36, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.07, 18]} />
        <meshStandardMaterial color="#4a4e56" roughness={0.44} metalness={0.72} />
      </mesh>
      <mesh position={[0, 0.36, 0.47]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[0, 0.68, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.14, 16]} />
        <meshStandardMaterial color="#5a5f68" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0.33, 0.8, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.2, 14]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>

      {headers && <ZoomieHeaders />}
    </group>
  );
}

/* ═══ ENGINE STAND ══════════════════════════════════════════════════════════ */

export function EngineStand({
  position,
  yaw = 0,
  blower = true,
}: {
  position: Vec3;
  yaw?: number;
  blower?: boolean;
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* Splayed base */}
      {[-0.44, 0.44].map((x) => (
        <mesh key={x} position={[x, 0.14, 0.16]}>
          <boxGeometry args={[0.13, 0.1, 1.3]} />
          <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, -0.42]}>
        <boxGeometry args={[1.0, 0.1, 0.13]} />
        <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
      </mesh>
      <Caster position={[-0.44, 0, 0.74]} />
      <Caster position={[0.44, 0, 0.74]} />
      <Caster position={[-0.44, 0, -0.42]} />
      <Caster position={[0.44, 0, -0.42]} />

      {/* Mast and the rotating head */}
      <mesh position={[0, 0.72, -0.42]}>
        <boxGeometry args={[0.16, 1.15, 0.16]} />
        <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
      </mesh>
      <mesh position={[0, 1.24, -0.22]}>
        <boxGeometry args={[0.16, 0.16, 0.5]} />
        <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
      </mesh>
      <mesh position={[0, 1.24, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      {/* Four mounting arms out to the bellhousing bolt circle */}
      {[0, 1, 2, 3].map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.2, 1.24 + Math.sin(a) * 0.2, 0.12]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[0.4, 0.06, 0.06]} />
            <meshStandardMaterial {...STEEL} />
          </mesh>
        );
      })}
      {/* Crank handle */}
      <mesh position={[0.3, 1.24, -0.06]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.3, 8]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      <mesh position={[0.3, 1.06, -0.06]}>
        <cylinderGeometry args={[0.022, 0.022, 0.14, 8]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>

      {/* The motor, hung off the head plate at crank height */}
      <V8Engine position={[0, 0.74, 0.5]} blower={blower} />

      <ContactShadow radius={1.15} spread={[0.85, 1]} opacity={0.5} />
    </group>
  );
}

/* ═══ CHERRY PICKER ═════════════════════════════════════════════════════════
   Legs forward along +Z, boom reaching out over whatever is being pulled. */

export function CherryPicker({
  position,
  yaw = 0,
  boomTilt = 0.22,
  children,
}: {
  position: Vec3;
  yaw?: number;
  boomTilt?: number;
  /** Hung off the boom tip — a chain, a hook, a motor. */
  children?: ReactNode;
}) {
  const reach = 2.35;
  const tipY = 2.05 + Math.sin(boomTilt) * reach;
  const tipZ = -0.12 + Math.cos(boomTilt) * reach;

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* Legs */}
      {[-0.56, 0.56].map((x) => (
        <mesh key={x} position={[x, 0.15, 1.0]}>
          <boxGeometry args={[0.14, 0.16, 2.4]} />
          <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
        </mesh>
      ))}
      <mesh position={[0, 0.15, -0.12]}>
        <boxGeometry args={[1.26, 0.16, 0.36]} />
        <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
      </mesh>
      <Caster position={[-0.56, 0, 2.06]} radius={0.08} />
      <Caster position={[0.56, 0, 2.06]} radius={0.08} />
      <Caster position={[-0.56, 0, -0.16]} radius={0.08} />
      <Caster position={[0.56, 0, -0.16]} radius={0.08} />

      {/* Mast */}
      <mesh position={[0, 1.1, -0.12]}>
        <boxGeometry args={[0.22, 1.9, 0.22]} />
        <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
      </mesh>
      <mesh position={[0, 2.05, -0.12]}>
        <boxGeometry args={[0.3, 0.16, 0.3]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>

      {/* Boom */}
      <group position={[0, 2.05, -0.12]} rotation={[-boomTilt, 0, 0]}>
        <mesh position={[0, 0, reach / 2]}>
          <boxGeometry args={[0.17, 0.17, reach]} />
          <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
        </mesh>
        <mesh position={[0, 0, reach * 0.78]}>
          <boxGeometry args={[0.13, 0.13, reach * 0.5]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[0, -0.06, reach]}>
          <boxGeometry args={[0.14, 0.2, 0.14]} />
          <meshStandardMaterial {...DARK_STEEL} />
        </mesh>
      </group>

      {/* Hydraulic ram from the mast foot up into the boom */}
      <mesh position={[0, 0.85, 0.42]} rotation={[-0.72, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.85, 12]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[0, 1.4, 0.85]} rotation={[-0.72, 0, 0]}>
        <cylinderGeometry args={[0.036, 0.036, 0.6, 10]} />
        <meshStandardMaterial {...CHROME} />
      </mesh>
      {/* Pump handle */}
      <mesh position={[0.42, 1.05, 0.1]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.022, 0.022, 0.9, 8]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>

      <group position={[0, tipY, tipZ]}>{children}</group>

      <ContactShadow
        radius={1.5}
        spread={[0.8, 1]}
        opacity={0.42}
        position={[0, 0.016, 0.9]}
      />
    </group>
  );
}

/* ═══ FLOOR JACK · JACK STANDS · CREEPER ════════════════════════════════════ */

export function FloorJack({ position, yaw = 0 }: { position: Vec3; yaw?: number }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* Chassis */}
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.14, 0]}>
          <boxGeometry args={[0.05, 0.16, 1.0]} />
          <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
        </mesh>
      ))}
      <mesh position={[0, 0.1, -0.1]}>
        <boxGeometry args={[0.26, 0.1, 0.7]} />
        <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
      </mesh>
      {/* Ram housing */}
      <mesh position={[0, 0.24, -0.24]} rotation={[0.16, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.34, 12]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      {/* Lift arm and saddle */}
      <mesh position={[0, 0.28, 0.22]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.2, 0.09, 0.66]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[0, 0.4, 0.5]}>
        <cylinderGeometry args={[0.09, 0.075, 0.06, 14]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.62, -0.62]} rotation={[0.86, 0, 0]}>
        <cylinderGeometry args={[0.026, 0.026, 1.25, 10]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[0, 1.02, -0.94]} rotation={[0.86, 0, 0]}>
        <cylinderGeometry args={[0.034, 0.034, 0.22, 10]} />
        <meshStandardMaterial {...RUBBER} />
      </mesh>
      {/* Wheels */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.17, 0.07, 0.4]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 12]} />
            <meshStandardMaterial {...RUBBER} />
          </mesh>
          <Caster position={[s * 0.15, 0, -0.4]} radius={0.055} />
        </group>
      ))}
      <ContactShadow radius={0.7} spread={[0.55, 1]} opacity={0.5} />
    </group>
  );
}

export function JackStand({
  position,
  height = 0.46,
  yaw = 0,
}: {
  position: Vec3;
  height?: number;
  yaw?: number;
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {[0, 1, 2, 3].map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.11, height * 0.34, Math.sin(a) * 0.11]}
            rotation={[Math.sin(a) * 0.34, 0, -Math.cos(a) * 0.34]}
          >
            <boxGeometry args={[0.05, height * 0.78, 0.05]} />
            <meshPhysicalMaterial {...SAFETY} {...ENAMEL_COAT} />
          </mesh>
        );
      })}
      <mesh position={[0, height * 0.62, 0]}>
        <boxGeometry args={[0.062, height * 0.9, 0.062]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      {/* Saddle */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, height + 0.03, s * 0.05]} rotation={[s * 0.5, 0, 0]}>
          <boxGeometry args={[0.13, 0.07, 0.05]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
      ))}
      <ContactShadow radius={0.3} opacity={0.45} />
    </group>
  );
}

export function Creeper({ position, yaw = 0 }: { position: Vec3; yaw?: number }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.44, 0.05, 1.15]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh position={[0, 0.145, 0.02]}>
        <boxGeometry args={[0.4, 0.05, 1.0]} />
        <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
      </mesh>
      <mesh position={[0, 0.2, -0.44]} rotation={[0.42, 0, 0]}>
        <boxGeometry args={[0.34, 0.06, 0.28]} />
        <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
      </mesh>
      {[-1, 1].map((s) =>
        [-0.46, 0, 0.46].map((z) => (
          <mesh key={`${s}:${z}`} position={[s * 0.19, 0.045, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 10]} />
            <meshStandardMaterial {...RUBBER} />
          </mesh>
        )),
      )}
      <ContactShadow radius={0.72} spread={[0.42, 1]} opacity={0.42} />
    </group>
  );
}

/** A drain pan with a slick of old oil sitting in it. */
export function DrainPan({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.36, 0.33, 0.12, 20]} />
        <meshStandardMaterial color="#1f2126" roughness={0.72} metalness={0.28} />
      </mesh>
      <mesh position={[0, 0.105, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.01, 20]} />
        <meshStandardMaterial color="#0a0906" roughness={0.14} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ═══ DYNO ══════════════════════════════════════════════════════════════════
   Paired knurled drums set in a pit, guard rails around it and a corrugated
   extraction duct running from the tailpipe up into the roof. */

export function DynoRollers({
  position,
  spin = true,
}: {
  position: Vec3;
  spin?: boolean;
}) {
  // One ref per drum. The spin CANNOT live on a shared parent: rotating the
  // parent about X swings the drums' offsets around the pit centre instead of
  // turning each drum on its own axle.
  const drums = useRef<Array<THREE.Group | null>>([]);

  useFrame((state, delta) => {
    if (!spin) return;
    // Spin up as the reader arrives in the bay, coast when they leave.
    const rate = 0.5 + 8 * influence(railOf(state.camera).t, 4);
    const step = Math.min(delta, 0.1) * rate;
    for (const drum of drums.current) {
      // rotation.z already lays the cylinder on its side, so X is the axle.
      if (drum) drum.rotation.x += step;
    }
  });

  const duct = tubeGeo(
    "dyno-duct",
    [
      [0.9, 0.4, -2.5],
      [1.7, 0.7, -2.9],
      [2.4, 1.7, -3.0],
      [2.7, 3.2, -2.6],
      [2.6, 4.7, -2.0],
    ],
    0.11,
    26,
  );

  return (
    <group position={position}>
      {/* Pit — long down the drive line, because the car sits nose-to-tail in it */}
      <mesh position={[0, -0.17, 0]}>
        <boxGeometry args={[3.3, 0.36, 5.4]} />
        <meshStandardMaterial color="#0d0e12" roughness={0.94} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.3, 5.4]} />
        <meshStandardMaterial color="#101116" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Two pairs of knurled rollers, one pair per axle. A wheel drops into the
          valley between the drums of a pair — that is what holds the car on. */}
      <group position={[0, 0.06, 0]}>
        {[-1.825, -0.925, 0.925, 1.825].map((z, i) => (
          <group
            key={z}
            ref={(group) => {
              drums.current[i] = group;
            }}
            position={[0, 0, z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <mesh>
              <cylinderGeometry args={[0.36, 0.36, 2.5, 22]} />
              <meshStandardMaterial color="#4e535c" roughness={0.3} metalness={0.8} />
            </mesh>
            {[-1.1, -0.6, 0, 0.6, 1.1].map((y) => (
              <mesh key={y} position={[0, y, 0]}>
                <torusGeometry args={[0.366, 0.012, 5, 18]} />
                <meshStandardMaterial color="#6e747e" roughness={0.26} metalness={0.86} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Guard rail down both sides of the pit */}
      {[-1.95, 1.95].map((x) =>
        [-2.5, 0, 2.5].map((z) => (
          <mesh key={`${x}:${z}`} position={[x, 0.5, z]}>
            <cylinderGeometry args={[0.045, 0.045, 1.0, 8]} />
            <meshPhysicalMaterial {...SAFETY} {...ENAMEL_COAT} />
          </mesh>
        )),
      )}
      {[-1.95, 1.95].map((x) => (
        <mesh key={x} position={[x, 0.96, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 5.2, 8]} />
          <meshPhysicalMaterial {...SAFETY} {...ENAMEL_COAT} />
        </mesh>
      ))}

      {/* Floor anchors and the tie-down straps holding the car to them */}
      {[-1, 1].map((s) =>
        [-1, 1].map((e) => (
          <group key={`${s}:${e}`}>
            <mesh position={[s * 1.5, 0.05, e * 2.5]}>
              <boxGeometry args={[0.18, 0.08, 0.18]} />
              <meshStandardMaterial {...DARK_STEEL} />
            </mesh>
            <mesh
              position={[s * 1.28, 0.34, e * 2.1]}
              rotation={[e * 0.66, 0, s * 0.42]}
            >
              <boxGeometry args={[0.05, 0.95, 0.012]} />
              <meshStandardMaterial color="#7c2b22" roughness={0.9} metalness={0.05} />
            </mesh>
          </group>
        )),
      )}

      {/* Extraction duct off the tailpipe, up into the roof */}
      <mesh geometry={duct}>
        <meshStandardMaterial color="#3a3d44" roughness={0.72} metalness={0.3} />
      </mesh>
    </group>
  );
}

/* ═══ SHOP FURNITURE ════════════════════════════════════════════════════════ */

/** Hose reel on the ceiling with the line dangling — one per bay, per the layout notes. */
export function HoseReel({ position }: { position: Vec3 }) {
  const hose = tubeGeo(
    "hose-reel",
    [
      [0, -0.3, 0],
      [0.18, -1.1, 0.1],
      [0.05, -2.0, -0.15],
      [-0.2, -2.7, 0.05],
    ],
    0.02,
    18,
  );

  return (
    <group position={position}>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.34, 0.32, 0.1]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.24, 16]} />
        <meshPhysicalMaterial {...TOOL_RED} {...ENAMEL_COAT} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.28, 12]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <mesh geometry={hose}>
        <meshStandardMaterial color="#1a1b1f" roughness={0.88} metalness={0.06} />
      </mesh>
    </group>
  );
}

/** Steel workbench with a top, a shelf and a leg frame. Dressed by the caller. */
export function Workbench({
  position,
  yaw = 0,
  length = 2.6,
  depth = 0.78,
  height = 0.92,
}: {
  position: Vec3;
  yaw?: number;
  length?: number;
  depth?: number;
  height?: number;
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[length, 0.07, depth]} />
        <meshStandardMaterial color="#6a6f78" roughness={0.44} metalness={0.55} />
      </mesh>
      <mesh position={[0, height - 0.06, 0]}>
        <boxGeometry args={[length - 0.1, 0.06, depth - 0.08]} />
        <meshStandardMaterial {...GRIME} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[length - 0.16, 0.05, depth - 0.14]} />
        <meshStandardMaterial {...GRIME} />
      </mesh>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}:${sz}`}
            position={[sx * (length / 2 - 0.1), height / 2, sz * (depth / 2 - 0.09)]}
          >
            <boxGeometry args={[0.07, height, 0.07]} />
            <meshStandardMaterial {...DARK_STEEL} />
          </mesh>
        )),
      )}
      <ContactShadow
        radius={length * 0.55}
        spread={[1, depth / length]}
        opacity={0.42}
      />
    </group>
  );
}
