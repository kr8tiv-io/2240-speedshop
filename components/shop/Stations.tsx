"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { M, Placed, Vehicle } from "./Loaders";
import {
  CherryPicker,
  Creeper,
  DrainPan,
  DynoRollers,
  EngineStand,
  FloorJack,
  HoseReel,
  JackStand,
  TwoPostLift,
  V8Engine,
  Workbench,
} from "./Hardware";
import { ContactShadow, FloorStain, useRadialGlow } from "./materials";
import {
  CEIL,
  CHROME,
  DARK_STEEL,
  GRIME,
  HALF_W,
  STEEL,
  TUNGSTEN,
  buildInstances,
  disposeInstanced,
  introAt,
  type InstanceSpec,
} from "./world";

/* ─────────────────────────────────────────────────────────────────────────────
   SEVEN BAYS OF A WORKING SHOP

   Composed against the SHOP LAYOUT REFERENCE in `public/models/CREDITS.md`:
   lift bays inside the doors, bench and parts storage down one side wall,
   welding pushed to a back corner, the engine build area out of the drive
   path, office in a front corner. Nothing is axis-aligned and nothing is
   evenly spaced — a real shop is a record of the last job, not a showroom.
   ────────────────────────────────────────────────────────────────────────── */

/* ── A drop light, which is the light a mechanic actually works by ─────────── */

function DropLight({
  position,
  cord = 1.5,
  power = 15,
  delay = 0.7,
}: {
  position: [number, number, number];
  cord?: number;
  power?: number;
  delay?: number;
}) {
  const bulb = useRef<THREE.PointLight>(null);
  const glass = useRef<THREE.MeshStandardMaterial>(null);
  // Kept deliberately weak: this pool sits inside a bay light's pool, and two
  // additive discs on a reflective floor blow the concrete out to white.
  const pool = useRadialGlow(TUNGSTEN, 0.11, 2.8);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const k = introAt(elapsed - delay);
    // Cheap hand lamp on a long cord: it buzzes, it never sits perfectly still.
    const buzz = 0.93 + 0.07 * Math.sin(elapsed * 17.3) * Math.sin(elapsed * 4.1);
    if (bulb.current) bulb.current.intensity = power * k * buzz;
    if (glass.current) glass.current.emissiveIntensity = 3.0 * k * buzz;
  });

  return (
    <group position={position}>
      <mesh position={[0, cord / 2, 0]}>
        <cylinderGeometry args={[0.009, 0.009, cord, 5]} />
        <meshStandardMaterial color="#141519" roughness={0.9} metalness={0.05} />
      </mesh>
      <Placed url={M.droplight} size={0.34} position={[0, 0, 0]} anchor="center" />
      <mesh position={[0, -0.07, 0]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial
          ref={glass}
          color="#000000"
          emissive={TUNGSTEN}
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={bulb}
        color={TUNGSTEN}
        intensity={0}
        distance={6}
        decay={2}
        position={[0, -0.1, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -position[1] + 0.016, 0]}>
        <circleGeometry args={[1.3, 20]} />
        <primitive object={pool} attach="material" />
      </mesh>
    </group>
  );
}

/** Faded bay outline in yellow shop paint. */
function BayOutline({
  centre,
  width,
  depth,
  yaw = 0,
}: {
  centre: [number, number];
  width: number;
  depth: number;
  yaw?: number;
}) {
  return (
    <group position={[centre[0], 0.011, centre[1]]} rotation={[0, yaw, 0]}>
      {[-1, 1].map((s) => (
        <mesh key={`x${s}`} rotation={[-Math.PI / 2, 0, 0]} position={[(s * width) / 2, 0, 0]}>
          <planeGeometry args={[0.08, depth]} />
          <meshBasicMaterial color="#3f3524" toneMapped={false} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`z${s}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (s * depth) / 2]}>
          <planeGeometry args={[width, 0.08]} />
          <meshBasicMaterial color="#3f3524" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══ 0 — THE DOORWAY ═══════════════════════════════════════════════════════
   The establishing shot: the length of the shop, a truck just inside the door
   and enough on the floor either side to say the place is used. */

export function StationDoorway() {
  return (
    <group>
      {/* Front roll-up, closed behind the reader */}
      <group position={[0, 0, 9.78]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[0, 0.35 + i * 0.56, 0]}>
            <boxGeometry args={[10.4, 0.52, 0.09]} />
            <meshStandardMaterial color="#33363d" roughness={0.66} metalness={0.3} />
          </mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 5.34, 2.6, 0.06]}>
            <boxGeometry args={[0.22, 5.2, 0.26]} />
            <meshStandardMaterial {...DARK_STEEL} />
          </mesh>
        ))}
      </group>

      <BayOutline centre={[4.9, 2.6]} width={3.1} depth={6.2} yaw={-0.6} />

      {/* Customer's truck, nosed in and waiting. Held back from the doorway
          camera — parked any closer it becomes a pale wedge across the corner
          of the establishing shot instead of a truck in a bay. */}
      <Vehicle url={M.pickup} size={5.15} position={[5.3, 0, 0.1]} yaw={-0.52} />

      {/* Drums by the wall, one knocked out of line */}
      <Placed url={M.drum} size={0.88} axis="y" position={[7.9, 0, 5.9]} yaw={0.4} shadow={0.42} />
      <Placed url={M.drum} size={0.88} axis="y" position={[8.2, 0, 4.9]} yaw={-0.9} shadow={0.42} />
      <Placed
        url={M.drum}
        size={0.88}
        axis="y"
        position={[7.3, 0.32, 5.0]}
        yaw={1.7}
        tilt={[Math.PI / 2, 0.2]}
        shadow={0.44}
        shadowSpread={[1, 0.5]}
      />

      {/* Extinguisher on its bracket by the door */}
      <mesh position={[HALF_W - 0.16, 1.05, 6.4]}>
        <boxGeometry args={[0.16, 0.3, 0.24]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>
      <Placed
        url={M.extinguisher}
        size={0.56}
        axis="y"
        position={[HALF_W - 0.36, 0.92, 6.4]}
        yaw={-Math.PI / 2}
      />

      {/* Pallet of parts against the left wall */}
      <Placed url={M.pallet} size={1.2} position={[-7.4, 0, 4.6]} yaw={0.22} shadow={0.62} />

      {/* A wheel and a tyre left where they were rolled */}
      <Placed
        url={M.tyre}
        size={0.66}
        orient="flat"
        position={[-6.3, 0, 1.4]}
        yaw={0.7}
        shadow={0.34}
      />
      <Placed
        url={M.rim}
        size={0.44}
        orient="disc"
        position={[-8.3, 0, 0.2]}
        yaw={0.1}
        tilt={[0, 0.2]}
        shadow={0.26}
      />

      <HoseReel position={[-3.4, CEIL - 1.5, 2.0]} />
      <HoseReel position={[3.6, CEIL - 1.5, -2.6]} />

      <FloorStain radius={1.5} position={[2.2, 0.013, 1.2]} spread={[1, 0.7]} opacity={0.3} />
      <FloorStain radius={0.9} position={[-1.6, 0.013, -1.8]} opacity={0.26} />
    </group>
  );
}

/* ═══ 1 — THE HOIST ═════════════════════════════════════════════════════════
   The signature shot. A Challenger up on the pads at 1.78 m with its wheels
   in the air, the job spread out underneath it, and one hot drop light. */

export function StationHoist() {
  return (
    <group>
      <BayOutline centre={[-3.2, -7.0]} width={4.6} depth={6.4} yaw={0.14} />

      <TwoPostLift position={[-3.2, 0, -7.0]} yaw={0.14} deck={1.78}>
        <Vehicle url={M.challenger} size={5.0} position={[0, 0, 0]} shadow={false} />
      </TwoPostLift>

      {/* The job, underneath */}
      <Creeper position={[-4.3, 0, -5.6]} yaw={0.62} />
      <FloorJack position={[-2.1, 0, -8.7]} yaw={-0.5} />
      <DrainPan position={[-3.5, 0, -7.6]} />
      <JackStand position={[-4.9, 0, -8.4]} height={0.5} yaw={0.3} />
      <JackStand position={[-1.6, 0, -5.4]} height={0.5} yaw={-0.8} />

      {/* Roll cab parked at the driver's front fender, where it lives mid-job */}
      <Placed
        url={M.toolCart}
        size={0.95}
        axis="y"
        position={[-1.15, 0, -5.3]}
        yaw={0.95}
        shadow={0.52}
      />

      {/* Wheels off and stacked, rims leaning on the post */}
      <Placed
        url={M.rim}
        size={0.46}
        orient="disc"
        position={[-1.1, 0, -8.5]}
        yaw={0.5}
        tilt={[0, -0.26]}
        shadow={0.28}
      />
      <Placed
        url={M.rim}
        size={0.46}
        orient="disc"
        position={[-0.86, 0, -8.66]}
        yaw={0.42}
        tilt={[0, -0.3]}
        shadow={0.28}
      />
      {[0, 1, 2].map((i) => (
        <Placed
          key={i}
          url={M.tyre}
          size={0.68}
          orient="flat"
          position={[-6.1, i * 0.235, -5.0]}
          yaw={i * 1.1}
          shadow={i === 0 ? 0.4 : false}
        />
      ))}
      <Placed
        url={M.tyre}
        size={0.68}
        orient="flat"
        position={[-6.5, 0, -8.9]}
        yaw={0.3}
        shadow={0.4}
      />

      {/* One drop light hung off the overhead bar, glowing hot under the car */}
      <DropLight position={[-2.5, 2.6, -6.2]} cord={2.2} power={18} />

      <Placed url={M.drum} size={0.88} axis="y" position={[-7.8, 0, -3.2]} yaw={0.7} shadow={0.42} />

      <FloorStain radius={2.0} position={[-3.2, 0.013, -7.0]} spread={[0.8, 1]} opacity={0.32} />
      <FloorStain radius={0.8} position={[-5.0, 0.013, -9.4]} opacity={0.24} />
    </group>
  );
}

/* ═══ 2 — THE ENGINE ROOM ═══════════════════════════════════════════════════
   Out of the drive path on the right, per the layout notes: a blown V8 on a
   rotating stand, a crane mid-lift with a second motor swinging off the chain,
   a coupe with its hood up, and a bench with the small parts on it. */

export function StationEngineRoom() {
  return (
    <group>
      {/* Hero: blown small block on a rotating stand, turned side-on to the
          rail. Nose-on you get three pulleys and a black block; side-on you get
          the valve cover, the scoop and the whole sweep of the headers. */}
      <EngineStand position={[3.3, 0, -17.1]} yaw={1.18} blower />
      <DropLight position={[3.5, 2.5, -16.4]} cord={2.3} power={16} delay={0.9} />

      {/* Crane mid-lift, a bare motor hanging off the chain, reaching over the
          coupe's empty bay. Parked on the far side of the bay so its boom does
          not swing through the fab-corner shot at the next station. */}
      <CherryPicker position={[6.6, 0, -18.3]} yaw={3.38} boomTilt={0.2}>
        <Placed url={M.hookChain} size={1.05} axis="y" position={[0, -0.55, 0]} anchor="center" />
        <V8Engine position={[0, -2.05, 0]} yaw={0.5} headers={false} scale={0.95} />
      </CherryPicker>

      {/* The car the motor came out of */}
      <Vehicle url={M.coupeHoodUp} size={5.0} position={[5.6, 0, -21.7]} yaw={0.34} />

      {/* Clean assembly bench down the wall, with the small stuff on it */}
      <Workbench position={[HALF_W - 0.62, 0, -15.4]} yaw={-Math.PI / 2} length={3.4} />
      <Placed
        url={M.sparkPlug}
        size={0.1}
        axis="y"
        position={[HALF_W - 0.72, 0.955, -14.5]}
        yaw={0.4}
      />
      <Placed
        url={M.sparkPlug}
        size={0.1}
        axis="y"
        position={[HALF_W - 0.62, 0.955, -14.66]}
        yaw={-0.9}
      />
      <Placed
        url={M.sparkPlug}
        size={0.1}
        axis="y"
        position={[HALF_W - 0.86, 0.955, -14.72]}
        yaw={1.9}
        tilt={[Math.PI / 2, 0]}
      />
      <Placed
        url={M.battery}
        size={0.28}
        axis="y"
        position={[HALF_W - 0.7, 0.955, -16.3]}
        yaw={0.2}
      />
      <Placed
        url={M.jumperCables}
        size={0.6}
        position={[HALF_W - 0.78, 0.98, -17.0]}
        yaw={0.8}
      />

      {/* Cluttered second bench and the parts cabinet behind it */}
      <Placed
        url={M.benchCluttered}
        size={2.1}
        position={[HALF_W - 0.9, 0, -19.9]}
        yaw={-Math.PI / 2}
        shadow={1.1}
        shadowSpread={[0.45, 1]}
      />
      <Placed
        url={M.partsCabinet}
        size={1.95}
        axis="y"
        position={[HALF_W - 0.55, 0, -12.9]}
        yaw={-Math.PI / 2 + 0.06}
        shadow={0.8}
      />

      {/* Second roll cab, wheeled over to the stand */}
      <Placed
        url={M.toolCart}
        size={0.95}
        axis="y"
        position={[4.9, 0, -14.9]}
        yaw={-0.35}
        shadow={0.52}
      />

      {/* Drums, a crate and a pallet of boxes filling the dead floor */}
      <Placed url={M.barrel} size={0.9} axis="y" position={[7.7, 0, -13.0]} yaw={0.5} shadow={0.4} />
      <Placed url={M.barrel} size={0.9} axis="y" position={[7.2, 0, -12.3]} yaw={-1.1} shadow={0.4} />
      <Placed url={M.crate} size={0.78} position={[1.2, 0, -14.4]} yaw={0.42} shadow={0.5} />
      <Placed url={M.crate} size={0.66} position={[1.45, 0.62, -14.2]} yaw={-0.2} shadow={false} />
      <Placed url={M.pallet} size={1.2} position={[7.4, 0, -22.6]} yaw={-0.3} shadow={0.62} />
      <Placed url={M.boxes} size={0.95} position={[7.4, 0.14, -22.6]} yaw={0.5} shadow={false} />

      <FloorStain radius={1.6} position={[3.3, 0.013, -17.4]} opacity={0.3} />
      <FloorStain radius={1.2} position={[5.4, 0.013, -20.9]} spread={[0.7, 1]} opacity={0.24} />
    </group>
  );
}

/* ═══ 3 — THE FAB CORNER ════════════════════════════════════════════════════
   Pushed to the back corner behind the bays, where welding belongs. Bottles
   chained upright, a tool wall, steel stock and a body in primer on stands. */

function ToolWall() {
  const hung = useMemo(() => {
    const geometry = new THREE.BoxGeometry(0.06, 1, 0.05);
    const material = new THREE.MeshStandardMaterial({
      color: "#4b4f58",
      roughness: 0.42,
      metalness: 0.5,
    });
    const specs: InstanceSpec[] = [];
    /* Tools HANG. The unit box is centred on its origin, so scaling it and
       placing the centre on a tier line left every tool at a different height
       and the wall read as scattered pick-up-sticks; solving for the centre
       from a fixed TOP puts them all on a common hook line per row, which is
       what makes a pegboard legible at a glance. Tilt stays inside ±2°: enough
       to look hung by hand, not enough to look spilled. */
    const TIER_TOP = [2.42, 1.98, 1.56];
    for (let i = 0; i < 22; i++) {
      const length = 0.42 + (i % 3) * 0.1;
      const top = TIER_TOP[i % 3];
      specs.push({
        position: [
          -(HALF_W - 0.42),
          top - length / 2,
          -25.2 - Math.floor(i / 2) * 0.36 - (i % 2) * 0.15,
        ],
        rotation: [0, Math.PI / 2, ((i % 3) - 1) * 0.035],
        scale: [1, length, 1],
      });
    }
    return buildInstances(geometry, material, specs);
  }, []);

  useEffect(() => () => disposeInstanced(hung), [hung]);

  return (
    <group>
      {/* Masonite pegboard, not another grey panel. Against a grey wall the old
          near-wall-coloured board vanished and the hung tools read as sticks
          floating in mid-air; a warm brown board gives them something to hang
          ON and the whole corner resolves into a tool wall at a glance. */}
      <mesh position={[-(HALF_W - 0.36), 2.05, -27.2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5.2, 2.1, 0.06]} />
        <meshStandardMaterial color="#4a3625" roughness={0.88} metalness={0.06} />
      </mesh>
      <primitive object={hung} />
    </group>
  );
}

export function StationFabCorner() {
  return (
    <group>
      <Workbench position={[-(HALF_W - 0.62), 0, -27.2]} yaw={Math.PI / 2} length={4.4} />
      <ToolWall />

      {/* Kenney's anvil and grinder benches, at the end of the run */}
      <Placed
        url={M.benchAnvil}
        size={1.5}
        position={[-(HALF_W - 0.9), 0, -30.4]}
        yaw={Math.PI / 2 + 0.05}
        shadow={0.85}
      />
      <Placed
        url={M.benchGrinder}
        size={1.5}
        position={[-(HALF_W - 0.9), 0, -32.1]}
        yaw={Math.PI / 2 - 0.04}
        shadow={0.85}
      />

      {/* The welding cart, bottles chained upright, parked at the arc */}
      <Placed
        url={M.weldingCart}
        size={1.4}
        axis="y"
        position={[-6.6, 0, -24.9]}
        yaw={0.72}
        shadow={0.7}
      />

      {/* Body in primer, up on four stands with its wheels off */}
      <Vehicle
        url={M.primerShell}
        size={4.7}
        position={[-4.3, 0.5, -30.4]}
        yaw={0.3}
        shadow={2.3}
        shadowSpread={[0.4, 1]}
        shadowOpacity={0.4}
      />
      {[
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ].map(([sx, sz]) => (
        <JackStand
          key={`${sx}:${sz}`}
          position={[-4.3 + sx * 0.72 - sz * 0.4, 0, -30.4 + sz * 1.5 + sx * 0.22]}
          height={0.52}
        />
      ))}

      {/* The rusted donor shell, back in the dark */}
      <Vehicle url={M.rustedShell} size={4.4} position={[-6.9, 0, -34.6]} yaw={-0.42} />

      {/* Steel stock leaning in the corner */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[-8.3 + i * 0.13, 1.5, -33.0 - i * 0.11]}
          rotation={[0.15, 0, 0.05 + i * 0.012]}
        >
          <boxGeometry args={[0.07, 3, 0.07]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
      ))}

      <Placed
        url={M.ladder}
        size={2.5}
        axis="y"
        position={[-8.2, 0, -25.6]}
        yaw={0.1}
        tilt={[0, 0.14]}
        shadow={0.4}
      />
      <Placed url={M.crate} size={0.82} position={[-2.4, 0, -26.3]} yaw={-0.5} shadow={0.52} />
      <Placed url={M.crate} size={0.7} position={[-2.1, 0, -25.5]} yaw={0.9} shadow={0.46} />
      <Placed url={M.stool} size={0.74} axis="y" position={[-5.9, 0, -27.6]} yaw={0.6} shadow={0.34} />

      <FloorStain radius={1.3} position={[-6.6, 0.013, -25.4]} opacity={0.28} />
      <FloorStain radius={1.8} position={[-4.6, 0.013, -30.8]} spread={[0.7, 1]} opacity={0.24} />
    </group>
  );
}

/* ═══ 4 — THE TUNING BAY ════════════════════════════════════════════════════ */

export function StationTuningBay() {
  return (
    <group>
      <DynoRollers position={[0.9, 0, -37.4]} />
      {/* Strapped down on the rollers, sitting in the valley between the drums */}
      <Vehicle
        url={M.camaro}
        size={4.75}
        position={[0.9, 0.25, -37.4]}
        yaw={0.02}
        shadow={false}
      />

      {/* Gauge board on the wall */}
      <mesh position={[HALF_W - 0.3, 2.1, -35.6]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4, 2.5, 0.08]} />
        <meshStandardMaterial color="#24262c" roughness={0.88} metalness={0.12} />
      </mesh>
      <GaugeCluster />

      {/* Operator's desk */}
      <group position={[-4.9, 0, -35.4]} rotation={[0, 0.55, 0]}>
        <mesh position={[0, 0.86, 0]}>
          <boxGeometry args={[1.7, 0.08, 0.8]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <boxGeometry args={[1.5, 0.8, 0.7]} />
          <meshStandardMaterial {...GRIME} />
        </mesh>
        <mesh position={[0, 1.24, -0.2]} rotation={[-0.24, 0, 0]}>
          <planeGeometry args={[1.1, 0.66]} />
          <meshStandardMaterial
            color="#04120b"
            emissive="#2ee07a"
            emissiveIntensity={0.28}
            toneMapped={false}
          />
        </mesh>
        <ContactShadow radius={1.0} spread={[1, 0.55]} opacity={0.4} />
      </group>

      {/* Compressor in the back corner, where a loud thing goes */}
      <Placed
        url={M.compressor}
        size={1.15}
        position={[-7.4, 0, -33.6]}
        yaw={0.7}
        shadow={0.6}
      />
      <Placed url={M.stool} size={0.74} axis="y" position={[-4.0, 0, -34.2]} yaw={-0.4} shadow={0.34} />
      <Placed url={M.gasCan} size={0.36} axis="y" position={[-6.4, 0, -35.4]} yaw={0.9} shadow={0.24} />
      <Placed url={M.boxes} size={0.95} position={[6.6, 0, -33.0]} yaw={0.35} shadow={0.5} />

      <DropLight position={[3.9, 3.0, -39.4]} cord={2.4} power={13} delay={1.1} />

      <FloorStain radius={2.2} position={[0.9, 0.013, -40.6]} spread={[1, 0.5]} opacity={0.26} />
    </group>
  );
}

/** Fifteen gauges on the board, one draw call. */
function GaugeCluster() {
  const gauges = useMemo(() => {
    const geometry = new THREE.TorusGeometry(0.2, 0.03, 6, 18);
    const material = new THREE.MeshStandardMaterial({
      color: "#0a0a0c",
      emissive: TUNGSTEN,
      emissiveIntensity: 1.05,
      roughness: 0.4,
      metalness: 0.3,
      toneMapped: false,
    });
    const specs: InstanceSpec[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        specs.push({
          position: [HALF_W - 0.36, 1.5 + row * 0.62, -34.4 - col * 0.62],
          rotation: [0, Math.PI / 2, 0],
          scale: [1 - row * 0.12, 1 - row * 0.12, 1],
        });
      }
    }
    return buildInstances(geometry, material, specs);
  }, []);

  useEffect(() => () => disposeInstanced(gauges), [gauges]);
  return <primitive object={gauges} />;
}

/* ═══ 5 — THE OFFICE WALL ═══════════════════════════════════════════════════
   The reputation beat. The framed photographs and the laser-cut badge stay
   exactly where they are — this only builds the room around them so the wall
   reads as a corner someone works in, not a gallery. */

export function StationOffice() {
  return (
    <group>
      {/* Desk, chair, paperwork */}
      <Placed
        url={M.desk}
        size={1.65}
        position={[-6.7, 0, -46.4]}
        yaw={0.52}
        shadow={0.85}
        shadowSpread={[1, 0.7]}
      />
      <Placed url={M.stool} size={0.74} axis="y" position={[-5.6, 0, -45.5]} yaw={-0.5} shadow={0.34} />
      <Placed url={M.boxes} size={0.55} position={[-6.9, 0.78, -46.7]} yaw={0.3} shadow={false} />

      {/* Tall racks of customers' parts down the dead wall */}
      <Placed
        url={M.rack}
        size={2.05}
        axis="y"
        position={[-(HALF_W - 0.6), 0, -40.3]}
        yaw={Math.PI / 2}
        shadow={0.9}
        shadowSpread={[0.45, 1]}
      />
      <Placed
        url={M.shelving}
        size={2.0}
        axis="y"
        position={[-(HALF_W - 0.55), 0, -48.0]}
        yaw={Math.PI / 2 + 0.05}
        shadow={0.7}
      />
      <Placed
        url={M.shelving}
        size={2.0}
        axis="y"
        position={[-(HALF_W - 0.55), 0, -49.6]}
        yaw={Math.PI / 2 - 0.03}
        shadow={0.7}
      />
      <Placed url={M.boxes} size={0.8} position={[-7.9, 0, -46.2]} yaw={0.7} shadow={0.44} />
      <Placed url={M.crate} size={0.8} position={[-7.7, 0, -43.0]} yaw={-0.4} shadow={0.52} />

      {/* Filing cabinet */}
      <group position={[-8.2, 0, -39.6]}>
        <mesh position={[0, 0.66, 0]}>
          <boxGeometry args={[0.7, 1.32, 1.1]} />
          <meshStandardMaterial color="#33353c" roughness={0.72} metalness={0.24} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.36, 0.32 + i * 0.42, 0]}>
            <boxGeometry args={[0.03, 0.04, 0.9]} />
            <meshStandardMaterial {...CHROME} />
          </mesh>
        ))}
        <ContactShadow radius={0.7} spread={[0.65, 1]} opacity={0.42} />
      </group>

      {/* The project nobody has got back to, under a cover in the far bay */}
      <Vehicle
        url={M.coveredProject}
        size={4.8}
        position={[5.0, 0, -44.6]}
        yaw={0.18}
        shadowOpacity={0.5}
      />
    </group>
  );
}

/* ═══ 6 — THE ROLL-UP DOOR ══════════════════════════════════════════════════ */

export function StationDoor() {
  return (
    <group>
      {/* Finished, pointed at the night — off to one side so the opening still
          reads as a door with the city framed inside it. */}
      <Vehicle url={M.charger} size={5.25} position={[-3.4, 0, -53.2]} yaw={0.24} />

      <Placed
        url={M.drumsRow}
        size={2.1}
        position={[5.6, 0, -53.4]}
        yaw={-0.5}
        shadow={1.0}
        shadowSpread={[1, 0.5]}
      />
      <Placed url={M.drum} size={0.88} axis="y" position={[6.6, 0, -50.8]} yaw={0.3} shadow={0.42} />
      <Placed
        url={M.tyre}
        size={0.68}
        orient="disc"
        position={[4.3, 0, -55.6]}
        yaw={0.4}
        tilt={[0, 0.22]}
        shadow={0.3}
      />
      <Placed
        url={M.tyre}
        size={0.68}
        orient="flat"
        position={[-5.9, 0, -54.6]}
        yaw={1.1}
        shadow={0.4}
      />
      <Placed
        url={M.extinguisher}
        size={0.56}
        axis="y"
        position={[-(HALF_W - 0.4), 0.92, -50.4]}
        yaw={Math.PI / 2}
      />
      <mesh position={[-(HALF_W - 0.18), 1.05, -50.4]}>
        <boxGeometry args={[0.16, 0.3, 0.24]} />
        <meshStandardMaterial {...DARK_STEEL} />
      </mesh>

      {/* Kerb line at the threshold */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -56.4]}>
        <planeGeometry args={[11, 0.14]} />
        <meshBasicMaterial color="#3f3524" toneMapped={false} />
      </mesh>

      <FloorStain radius={2.4} position={[-1.9, 0.013, -52.4]} spread={[0.55, 1]} opacity={0.22} />
    </group>
  );
}
