"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { M, Placed, Vehicle } from "./Loaders";
import {
  CeilingFan,
  CherryPicker,
  Creeper,
  DrainPan,
  DynoRollers,
  EngineStand,
  FloorJack,
  HoseReel,
  JackStand,
  Turntable,
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
  const disc = useRef<THREE.Mesh>(null);
  // Kept deliberately weak: this pool sits inside a bay light's pool, and two
  // additive discs on a reflective floor blow the concrete out to white.
  const pool = useRadialGlow(TUNGSTEN, 0.11, 2.8);
  const anchor = useMemo(
    () => new THREE.Vector3(position[0], 1, position[2]),
    [position],
  );

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const k = introAt(elapsed - delay);
    // Cheap hand lamp on a long cord: it buzzes, it never sits perfectly still.
    const buzz = 0.93 + 0.07 * Math.sin(elapsed * 17.3) * Math.sin(elapsed * 4.1);
    if (bulb.current) bulb.current.intensity = power * k * buzz;
    if (glass.current) glass.current.emissiveIntensity = 3.0 * k * buzz;
    // Same fill-rate governor as the bay lights: an additive disc on the
    // concrete is invisible from twenty metres away and is not worth drawing.
    if (disc.current) {
      disc.current.visible =
        state.camera.position.distanceToSquared(anchor) < 22 * 22;
    }
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
      <mesh
        ref={disc}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -position[1] + 0.016, 0]}
      >
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
          <meshStandardMaterial color="#6f5d38" roughness={0.9} metalness={0.02} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`z${s}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (s * depth) / 2]}>
          <planeGeometry args={[width, 0.08]} />
          <meshStandardMaterial color="#6f5d38" roughness={0.9} metalness={0.02} />
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

      {/* THE FIRST THING ANYONE SEES: a finished build, gleaming, revolving on
          the showroom turntable square in the establishing frame. The landing
          sells the dream result; the rust lives deeper in the scroll where
          "before" belongs. */}
      {/* Half a metre deeper and further left than it was: the station-1 hold
          now pushes toward this spot, and the old position put the revolving
          car's swing circle inside the camera's dolly line. */}
      <Turntable position={[-1.1, 0, -2.75]} speed={0.13}>
        <Vehicle url={M.charger} size={5.0} position={[0, 0, 0]} shadow={false} />
      </Turntable>

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

      {/* Copper custom parked at the left wall — a second finished car in the
          establishing frame, so the first thing the reader sees is a shop with
          MORE than one build worth looking at. */}
      <Vehicle
        url={M.camaro}
        size={4.75}
        position={[-6.7, 0, -1.3]}
        yaw={-0.16}
        tint="#6b3b1e"
      />

      {/* Fresh crate motor on a pallet by the right wall, waiting on its car —
          the first engine in the scroll shows up before the first section does. */}
      <Placed url={M.pallet} size={1.2} position={[7.5, 0, 2.5]} yaw={-0.24} shadow={0.62} />
      <V8Engine position={[7.5, 0.15, 2.5]} yaw={-1.15} scale={0.92} headers={false} />
      <Placed
        url={M.jerryCan}
        size={0.42}
        axis="y"
        position={[6.6, 0, 3.4]}
        yaw={0.8}
        shadow={0.22}
      />
      <Placed
        url={M.jerrycanGreen}
        size={0.5}
        axis="y"
        position={[7.3, 0, 5.5]}
        yaw={-0.5}
        shadow={0.26}
      />
      <Placed
        url={M.wheelMag}
        size={0.62}
        orient="disc"
        position={[-5.5, 0, 3.6]}
        yaw={0.5}
        tilt={[0, 0.24]}
        shadow={0.3}
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

      {/* Deep steel blue, not grey: the hero car reads as a customer's paint
          job under the drop light, clearly separated from the red lift. */}
      <TwoPostLift position={[-3.2, 0, -7.0]} yaw={0.14} deck={1.78}>
        <Vehicle
          url={M.challenger}
          size={5.0}
          position={[0, 0, 0]}
          shadow={false}
          tint="#3f6cb0"
        />
      </TwoPostLift>

      {/* Second bay, second hoist — a hood-up coupe mid-service. Two lifts is
          what makes the room read as a working shop rather than one
          photogenic bay. (The boxy cab-over that used to ride here read as
          low-poly at this distance — the coupe with its hood up carries real
          engine-bay detail AND makes mechanical sense on a moving lift.) */}
      <BayOutline centre={[4.1, -9.8]} width={4.4} depth={6.2} yaw={-0.12} />
      {/* This one is WORKING: it rides slowly between knee and chest height
          on a half-minute cycle — the single strongest life sign in the
          establishing shot. */}
      <TwoPostLift
        position={[4.1, 0, -9.8]}
        yaw={-0.12}
        deck={1.26}
        travel={{ min: 0.42, max: 1.62, period: 36 }}
      >
        <Vehicle
          url={M.coupeHoodUp}
          size={5.0}
          position={[0, 0, 0]}
          shadow={false}
          tint="#3d4653"
        />
      </TwoPostLift>
      <Placed
        url={M.wheelStack}
        size={0.92}
        axis="y"
        position={[6.7, 0, -7.4]}
        yaw={0.6}
        shadow={0.5}
      />
      <Placed
        url={M.tirePump}
        size={0.9}
        axis="y"
        position={[6.2, 0, -12.1]}
        yaw={-0.6}
        shadow={0.4}
      />
      <Placed
        url={M.oilCan}
        size={0.26}
        axis="y"
        position={[-4.0, 0, -6.6]}
        yaw={1.1}
        shadow={0.18}
      />
      <Placed
        url={M.funnel}
        size={0.16}
        axis="y"
        position={[-3.7, 0, -6.3]}
        yaw={0.3}
      />
      <FloorJack position={[2.2, 0, -11.9]} yaw={0.7} />
      <DropLight position={[4.3, 2.7, -9.2]} cord={2.1} power={11} delay={0.85} />

      {/* The coupe's motor, already out and on a stand at the right wall —
          the hoist bay tells the whole story: car up, engine out, job live. */}
      <EngineStand position={[7.3, 0, -8.9]} yaw={-1.9} blower={false} />
      {/* Breaker box on the wall behind the bay — photogrammetry piece the
          orbit's east sweep passes straight by. */}
      <Placed
        url={M.powerBox}
        size={0.95}
        axis="y"
        anchor="center"
        position={[HALF_W - 0.28, 1.5, -4.9]}
        yaw={-Math.PI / 2}
      />
      <Placed
        url={M.jerryCan}
        size={0.42}
        axis="y"
        position={[-4.4, 0, -9.2]}
        yaw={-0.6}
        shadow={0.22}
      />

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
      <DropLight position={[-2.5, 2.6, -6.2]} cord={2.2} power={14} />

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
      <DropLight position={[4.3, 2.6, -15.4]} cord={2.4} power={10} delay={0.9} />

      {/* A second build on a second stand behind the hero — an engine ROOM has
          a queue, not a single motor. Bare four-barrel, headers off. */}
      <EngineStand position={[2.7, 0, -19.9]} yaw={-0.72} blower={false} />
      {/* And a short block strapped to a pallet, fresh back from the machine
          shop. LEFT of the rail on purpose: the first placement sat almost on
          the station-2 sight line, filled the foreground and hid the hero
          stand behind its own valve covers. */}
      <Placed url={M.pallet} size={1.2} position={[-3.3, 0, -16.4]} yaw={0.9} shadow={0.62} />
      <V8Engine position={[-3.3, 0.15, -16.4]} yaw={0.35} scale={0.88} headers={false} />

      {/* Crane mid-lift, a bare motor hanging off the chain, reaching over the
          coupe's empty bay. Parked on the far side of the bay so its boom does
          not swing through the fab-corner shot at the next station. */}
      <CherryPicker position={[6.6, 0, -18.3]} yaw={3.38} boomTilt={0.2}>
        <Placed url={M.hookChain} size={1.05} axis="y" position={[0, -0.55, 0]} anchor="center" />
        <V8Engine position={[0, -2.05, 0]} yaw={0.5} headers={false} scale={0.95} />
      </CherryPicker>

      {/* The car the motor came out of */}
      <Vehicle url={M.coupeHoodUp} size={5.0} position={[5.6, 0, -21.7]} yaw={0.34} />

      {/* Finished custom waiting for pickup, nosed at the left wall under the
          cool rim light — gold over the dark cladding. */}
      <Vehicle
        url={M.camaro}
        size={4.75}
        position={[-6.2, 0, -14.6]}
        yaw={1.32}
        tint="#8a6a24"
      />

      {/* Second customer car queued behind it down the left wall — plum over
          black, nose angled at the cladding the way cars actually get parked
          when the shop is full. */}
      <Vehicle
        url={M.charger}
        size={5.25}
        position={[-6.2, 0, -19.1]}
        yaw={1.18}
        tint="#46325e"
      />

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
        url={M.metalJug}
        size={0.34}
        axis="y"
        position={[HALF_W - 0.66, 0.955, -13.95]}
        yaw={-0.7}
      />
      {/* Industrial pipe run against the wall past the bench — the big
          photogrammetry backdrop for the travel toward the fab corner. */}
      <Placed
        url={M.pipesIndustrial}
        size={2.6}
        position={[HALF_W - 0.5, 0, -21.6]}
        yaw={-Math.PI / 2}
        shadow={1.1}
        shadowSpread={[0.4, 1]}
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

      {/* The BIG chest — every real shop has one wall of drawers someone is
          proud of — and the hand tools left out on the clean bench. */}
      <Placed
        url={M.toolChest}
        size={1.5}
        axis="y"
        position={[HALF_W - 0.85, 0, -17.6]}
        yaw={-Math.PI / 2 + 0.04}
        shadow={0.75}
      />
      <Placed url={M.drill} size={0.24} position={[HALF_W - 0.66, 0.955, -15.9]} yaw={2.1} />
      <Placed url={M.hammer} size={0.28} position={[HALF_W - 0.88, 0.955, -15.1]} yaw={-0.7} />
      <Placed url={M.pliers} size={0.2} position={[HALF_W - 0.6, 0.955, -14.9]} yaw={0.9} />

      {/* Air overhead */}
      <CeilingFan position={[0.2, CEIL - 0.85, -15.2]} />

      {/* Drums, a crate and a pallet of boxes filling the dead floor */}
      <Placed url={M.barrel} size={0.9} axis="y" position={[7.7, 0, -13.0]} yaw={0.5} shadow={0.4} />
      <Placed url={M.barrel} size={0.9} axis="y" position={[7.2, 0, -12.3]} yaw={-1.1} shadow={0.4} />
      <Placed
        url={M.gasTank}
        size={0.6}
        axis="y"
        position={[6.8, 0, -13.4]}
        yaw={0.9}
        shadow={0.3}
      />
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

/**
 * A hand-hung tool wall.
 *
 * The previous version was 22 identical bars on a three-value length cycle at a
 * constant pitch — read at a glance it was a comb, not a tool wall. Fewer tools
 * that each read individually beat more tools that read as a texture, so the
 * count comes down, the spacing is irregular, and the population is mixed:
 * flat-stock spanners in polished steel, round-shanked drivers with dark
 * handles, and a couple of hooks left empty. Two instanced draw calls total.
 */
const SPANNERS: Array<[number, number, number]> = [
  // [z along the wall, hung length, hook-line height]
  [-25.05, 0.62, 2.44],
  [-25.42, 0.5, 2.44],
  [-25.72, 0.72, 2.46],
  [-26.34, 0.44, 2.42],
  [-26.62, 0.56, 2.44],
  [-27.35, 0.66, 2.45],
  [-27.66, 0.38, 2.41],
  [-28.35, 0.58, 2.44],
  [-28.68, 0.48, 2.43],
  [-29.2, 0.7, 2.46],
  [-25.28, 0.34, 1.72],
  [-25.9, 0.42, 1.74],
  [-26.5, 0.3, 1.7],
  [-27.2, 0.46, 1.75],
  [-28.1, 0.36, 1.72],
  [-28.95, 0.4, 1.73],
];

const DRIVERS: Array<[number, number]> = [
  [-25.6, 0.3],
  [-25.82, 0.26],
  [-26.04, 0.33],
  [-26.9, 0.28],
  [-27.12, 0.31],
  [-27.9, 0.25],
  [-29.05, 0.29],
  [-29.28, 0.34],
];

function ToolWall() {
  const parts = useMemo(() => {
    /* Tools HANG. The unit box is centred on its origin, so the centre has to
       be solved from a fixed TOP or every tool ends up at a different height
       and the wall reads as spilled pick-up-sticks. */
    const flat = buildInstances(
      new THREE.BoxGeometry(0.055, 1, 0.045),
      new THREE.MeshStandardMaterial({ color: "#8b919b", roughness: 0.3, metalness: 0.9 }),
      SPANNERS.map(([z, length, top], i) => ({
        position: [-(HALF_W - 0.42), top - length / 2, z],
        rotation: [0, Math.PI / 2, Math.sin(i * 2.4) * 0.055],
        scale: [1 + (i % 4) * 0.28, length, 1],
      })),
    );

    const round = buildInstances(
      new THREE.CylinderGeometry(0.017, 0.022, 1, 6),
      new THREE.MeshStandardMaterial({ color: "#5e4a2c", roughness: 0.62, metalness: 0.18 }),
      DRIVERS.map(([z, length], i) => ({
        position: [-(HALF_W - 0.4), 1.74 - length / 2, z],
        rotation: [0, 0, Math.cos(i * 1.9) * 0.06],
        scale: [1, length, 1],
      })),
    );

    return { flat, round };
  }, []);

  useEffect(
    () => () => {
      disposeInstanced(parts.flat);
      disposeInstanced(parts.round);
    },
    [parts],
  );

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
      {/* Shadow-board outlines behind the two empty hooks — the detail that
          says a person owns this wall. */}
      {[-26.15, -28.6].map((z) => (
        <mesh key={z} position={[-(HALF_W - 0.32), 2.16, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.09, 0.6]} />
          <meshStandardMaterial color="#241a11" roughness={0.95} metalness={0} />
        </mesh>
      ))}
      <primitive object={parts.flat} />
      <primitive object={parts.round} />
    </group>
  );
}

export function StationFabCorner() {
  return (
    <group>
      <Workbench position={[-(HALF_W - 0.62), 0, -27.2]} yaw={Math.PI / 2} length={4.4} />
      <ToolWall />

      {/* The vice bolted to the bench end — the one tool that defines a fab
          bench, straight out of the PBR library. */}
      <Placed
        url={M.benchVice}
        size={0.44}
        position={[-(HALF_W - 0.66), 0.955, -25.5]}
        yaw={Math.PI / 2 + 0.35}
      />
      {/* Bench-top spend where the primer-shell orbit passes closest: a spray
          can, a real adjustable wrench, an ammo box of fittings under the
          light, and a caged work lamp hung over the wall. */}
      <Placed
        url={M.lubricantSpray}
        size={0.26}
        axis="y"
        position={[-(HALF_W - 0.7), 0.955, -26.5]}
        yaw={1.9}
      />
      <Placed
        url={M.wrenchAdjustable}
        size={0.42}
        position={[-(HALF_W - 0.72), 0.955, -28.2]}
        yaw={1.15}
      />
      <Placed
        url={M.ammoBox}
        size={0.55}
        position={[-(HALF_W - 1.0), 0, -24.5]}
        yaw={0.4}
        shadow={0.32}
      />
      <Placed
        url={M.lampCaged}
        size={1.0}
        axis="y"
        anchor="center"
        position={[-(HALF_W - 1.4), 3.1, -27.9]}
      />

      {/* Fourth hoist, right wall, mid-shop: a steel-blue custom at chest
          height, visible deep in the engine-room frame and again on the travel
          to the tuning bay. Four lifts is a shop with a waiting list. */}
      <TwoPostLift position={[6.5, 0, -26.0]} yaw={-0.08} deck={1.35}>
        <Vehicle
          url={M.charger}
          size={5.25}
          position={[0, 0, 0]}
          shadow={false}
          tint="#24455e"
        />
      </TwoPostLift>
      <FloorJack position={[4.6, 0, -24.2]} yaw={1.8} />

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

      {/* The prewar donor waiting its turn — "before" belongs HERE, deep in
          the build-process beat, never in the first frame. */}
      <Vehicle url={M.prewarDonor} size={4.5} position={[-6.4, 0, -21.8]} yaw={-0.2} />

      {/* The welding cart, bottles chained upright, parked at the arc */}
      <Placed
        url={M.weldingCart}
        size={1.4}
        axis="y"
        position={[-6.6, 0, -24.9]}
        yaw={0.72}
        shadow={0.7}
      />
      <Placed
        url={M.propaneBottle}
        size={0.72}
        axis="y"
        position={[-5.8, 0, -24.0]}
        yaw={-0.4}
        shadow={0.26}
      />

      {/* A drop light hung over the shell and the body man's toolbox on the
          floor beside it — the light a panel actually gets worked under. */}
      <DropLight position={[-3.6, 2.7, -29.6]} cord={2.2} power={12} delay={1.0} />
      <Placed
        url={M.toolboxMetal}
        size={0.6}
        axis="y"
        position={[-2.7, 0, -28.7]}
        yaw={0.7}
        shadow={0.4}
      />
      <Placed
        url={M.barrelC}
        size={0.86}
        axis="y"
        position={[-7.7, 0, -31.4]}
        yaw={0.9}
        shadow={0.4}
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

      {/* Bare tyre off the donor, leaning where it was rolled */}
      <Placed
        url={M.tyreBare}
        size={0.7}
        orient="disc"
        position={[-7.5, 0, -32.6]}
        yaw={0.6}
        tilt={[0, 0.26]}
        shadow={0.32}
      />

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
      {/* Strapped down on the rollers, sitting in the valley between the
          drums. The Challenger body, not the camaro: its tail is a clean
          fastback with real lamps, so the station-4 orbit's close pass over
          the rear reads as bodywork — the camaro's low-poly ducktail plus the
          old duct route was the "something bolted to the back" artifact. */}
      <Vehicle
        url={M.challenger}
        size={5.0}
        position={[0.9, 0.25, -37.4]}
        yaw={0.02}
        shadow={false}
        tint="#8f2222"
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
        {/* CRT in a bezel, tilted back on the desk. The old version was a bare
            bright-green plane floating over the desk — it read as a glowing
            box, not a monitor. A housing behind it and a dim amber phosphor
            through tone mapping make it furniture instead of a light source. */}
        <group position={[0, 1.22, -0.17]} rotation={[-0.24, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.16, 0.74, 0.34]} />
            <meshStandardMaterial color="#2c2e35" roughness={0.62} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.175]}>
            <planeGeometry args={[1.0, 0.6]} />
            <meshStandardMaterial
              color="#0d0b06"
              emissive="#d8a86a"
              emissiveIntensity={0.5}
              roughness={0.3}
              metalness={0.05}
            />
          </mesh>
        </group>
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
      <Placed
        url={M.stoolB}
        size={0.74}
        axis="y"
        position={[-5.7, 0, -36.5]}
        yaw={1.6}
        shadow={0.34}
      />
      <Placed url={M.gasCan} size={0.36} axis="y" position={[-6.4, 0, -35.4]} yaw={0.9} shadow={0.24} />
      <Placed url={M.boxes} size={0.95} position={[6.6, 0, -33.0]} yaw={0.35} shadow={0.5} />
      <Placed
        url={M.storageCart}
        size={1.05}
        axis="y"
        position={[5.4, 0, -34.6]}
        yaw={0.7}
        shadow={0.6}
      />
      <Placed
        url={M.barrelA}
        size={0.9}
        axis="y"
        position={[-7.8, 0, -31.9]}
        yaw={-0.6}
        shadow={0.4}
      />

      <DropLight position={[4.4, 3.0, -40.4]} cord={2.4} power={9} delay={1.1} />

      {/* Next in line for the rollers: the gold '50s drop-top parked past the
          dyno, deep in the station-4 frame. A tuning bay with a QUEUE. */}
      <Vehicle
        url={M.convertible}
        size={4.9}
        position={[5.7, 0, -38.7]}
        yaw={0.5}
        tint="#7c6136"
      />
      <Placed
        url={M.gasTank}
        size={0.6}
        axis="y"
        position={[-6.8, 0, -34.5]}
        yaw={-0.4}
        shadow={0.3}
      />
      <Placed
        url={M.wheelMag}
        size={0.62}
        orient="disc"
        position={[3.5, 0, -34.9]}
        yaw={-0.3}
        tilt={[0, -0.22]}
        shadow={0.3}
      />

      <FloorStain radius={2.2} position={[0.9, 0.013, -40.6]} spread={[1, 0.5]} opacity={0.26} />
    </group>
  );
}

/**
 * Fifteen gauges on the board, two draw calls.
 *
 * The bezels used to be the emitter — an emissive, un-tone-mapped torus, which
 * is to say fifteen small neon rings hung on a wall. A gauge bezel is chromed
 * steel. Only the DIAL is lit, it is lit dimly, and it goes through tone
 * mapping like every other surface, so it glows the way an instrument glows
 * instead of the way a sign does.
 */
function GaugeCluster() {
  const parts = useMemo(() => {
    const specs: InstanceSpec[] = [];
    const faceSpecs: InstanceSpec[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const s = 1 - row * 0.12;
        const y = 1.5 + row * 0.62;
        const z = -34.4 - col * 0.62;
        specs.push({
          position: [HALF_W - 0.36, y, z],
          rotation: [0, Math.PI / 2, 0],
          scale: [s, s, 1],
        });
        faceSpecs.push({
          position: [HALF_W - 0.38, y, z],
          rotation: [0, -Math.PI / 2, 0],
          scale: [s, s, 1],
        });
      }
    }

    const bezels = buildInstances(
      new THREE.TorusGeometry(0.2, 0.03, 6, 18),
      new THREE.MeshStandardMaterial({ ...CHROME }),
      specs,
    );
    const faces = buildInstances(
      new THREE.CircleGeometry(0.19, 20),
      new THREE.MeshStandardMaterial({
        color: "#0b0c10",
        emissive: TUNGSTEN,
        emissiveIntensity: 0.5,
        roughness: 0.42,
        metalness: 0.1,
      }),
      faceSpecs,
    );
    return { bezels, faces };
  }, []);

  useEffect(
    () => () => {
      disposeInstanced(parts.bezels);
      disposeInstanced(parts.faces);
    },
    [parts],
  );

  return (
    <group>
      <primitive object={parts.faces} />
      <primitive object={parts.bezels} />
    </group>
  );
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

      {/* ── The bay was reading as an empty grey floor with a gallery stuck to
             one wall. Everything below is there to give the frame a foreground,
             a middle and a far edge, and to keep the eye moving down the room
             instead of stopping dead at the corkboard. ── */}

      {/* Foreground left: the stack that always lives outside the office door */}
      <Placed
        url={M.tyreStack}
        size={1.15}
        axis="y"
        position={[-6.9, 0, -40.6]}
        yaw={0.35}
        shadow={0.62}
      />

      {/* A customer's motor on a stand outside the office — pulled, tagged and
          waiting on parts. Low enough to sit under the gallery sightline while
          giving the office shot a foreground. */}
      <EngineStand position={[-5.3, 0, -41.7]} yaw={1.05} blower={false} />
      <Placed
        url={M.palletJack}
        size={1.45}
        position={[-4.4, 0, -39.2]}
        yaw={1.05}
        shadow={0.6}
        shadowSpread={[0.4, 1]}
      />

      {/* A door into the office, so the wall reads as a room rather than a
          panel with pictures on it. */}
      <Placed
        url={M.metalDoor}
        size={2.05}
        axis="y"
        position={[-(HALF_W - 0.24), 0, -37.6]}
        yaw={Math.PI / 2}
      />

      {/* Shelf of customer parts above the desk end */}
      <Placed
        url={M.shelfWooden}
        size={1.7}
        position={[-(HALF_W - 0.62), 0, -50.9]}
        yaw={Math.PI / 2 + 0.04}
        shadow={0.72}
        shadowSpread={[0.42, 1]}
      />
      <Placed url={M.boxes} size={0.6} position={[-8.0, 0.86, -50.6]} yaw={-0.5} shadow={false} />

      {/* Right of frame: wheels and a drum keep the far side from going empty */}
      <Placed
        url={M.wheelStack}
        size={0.92}
        axis="y"
        position={[1.6, 0, -40.4]}
        yaw={0.4}
        shadow={0.5}
      />
      <Placed url={M.drum} size={0.88} axis="y" position={[7.6, 0, -40.9]} yaw={0.9} shadow={0.42} />
      <Placed url={M.barrel} size={0.9} axis="y" position={[7.1, 0, -42.0]} yaw={-0.4} shadow={0.4} />

      <CeilingFan position={[-0.4, CEIL - 0.85, -42.6]} speed={2.6} />

      {/* Roll cab abandoned mid-room, catching the wall wash. Nudged off the
          engine-stand orbit: the old spot sat exactly on the camera's arc. */}
      <Placed
        url={M.toolCart}
        size={0.95}
        axis="y"
        position={[-1.9, 0, -44.3]}
        yaw={-0.7}
        shadow={0.52}
      />
      <Placed url={M.stool} size={0.74} axis="y" position={[-2.2, 0, -41.2]} yaw={1.2} shadow={0.34} />

      <FloorStain radius={1.7} position={[-4.2, 0.013, -42.6]} spread={[0.9, 1]} opacity={0.24} />
      <FloorStain radius={1.1} position={[-6.6, 0.013, -46.8]} opacity={0.2} />

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
      {/* Finished and collected, nosed at the night — off to one side so the
          opening still reads as a door with the city framed inside it. (The
          turntable moved to the doorway: the showpiece now OPENS the site.) */}
      <Vehicle
        url={M.challenger}
        size={5.1}
        position={[-3.4, 0, -53.2]}
        yaw={0.24}
        tint="#1f4d33"
      />

      <Placed
        url={M.drumsRow}
        size={2.1}
        position={[7.0, 0, -54.6]}
        yaw={-0.5}
        shadow={1.0}
        shadowSpread={[1, 0.5]}
      />
      {/* Third hoist by the door: the '50s convertible at waist height,
          mid-restoration — the last thing the reader passes on the way out. */}
      <TwoPostLift position={[6.1, 0, -50.4]} yaw={0.16} deck={1.5}>
        <Vehicle url={M.convertible} size={4.9} position={[0, 0, 0]} shadow={false} />
      </TwoPostLift>
      <JackStand position={[4.3, 0, -48.6]} height={0.5} yaw={0.4} />

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

      {/* ── The door shot was carrying one car and a row of drums across twelve
             metres of floor. These fill the flanks and, more usefully, give the
             opening something to be SEEN PAST: a silhouette out on the apron
             and stock leaning in the near corner is what turns a bright
             rectangle into a doorway. ── */}

      {/* Classic pickup parked out on the wet apron, lit only by the street */}
      <Vehicle
        url={M.pickup}
        size={5.3}
        position={[9.6, 0, -66.5]}
        yaw={1.42}
        tint="#2e4661"
      />

      {/* Customers' classics on the back lot — clones of cars the reader has
          already paid the download for, repainted so the lot reads as three
          different customers and not a copy-paste. */}
      <Vehicle
        url={M.charger}
        size={5.25}
        position={[-10.4, 0, -64.8]}
        yaw={-0.94}
        tint="#274a2c"
      />
      <Vehicle
        url={M.pickup}
        size={5.15}
        position={[-3.6, 0, -68.9]}
        yaw={-1.22}
        tint="#5c3a24"
      />
      <Vehicle
        url={M.camaro}
        size={4.75}
        position={[3.8, 0, -71.5]}
        yaw={1.88}
        tint="#5a2330"
      />
      <Vehicle
        url={M.convertible}
        size={4.9}
        position={[12.8, 0, -63.2]}
        yaw={0.68}
        tint="#b09a5c"
      />
      <Vehicle
        url={M.pickup}
        size={5.15}
        position={[-16.2, 0, -64.8]}
        yaw={-1.08}
        tint="#7a2020"
      />
      <Vehicle
        url={M.challenger}
        size={5.1}
        position={[18.8, 0, -67.6]}
        yaw={-1.35}
        tint="#8a7440"
      />
      <Vehicle
        url={M.charger}
        size={5.25}
        position={[-22.6, 0, -66.6]}
        yaw={-0.85}
        tint="#44464e"
      />

      {/* Ramps and a truck tyre stacked where the last job left them */}
      <Placed
        url={M.serviceRamp}
        size={0.9}
        position={[-6.6, 0, -49.4]}
        yaw={0.28}
        shadow={0.44}
        shadowSpread={[0.6, 1]}
      />
      <Placed
        url={M.serviceRamp}
        size={0.9}
        position={[-6.1, 0, -50.3]}
        yaw={0.62}
        shadow={0.44}
        shadowSpread={[0.6, 1]}
      />
      <Placed
        url={M.tyreTruck}
        size={0.98}
        orient="disc"
        position={[7.1, 0, -49.2]}
        yaw={0.24}
        tilt={[0, 0.18]}
        shadow={0.4}
      />

      {/* Gas bottles chained by the wall and bar stock leaning next to them */}
      <Placed
        url={M.gasBottle}
        size={1.32}
        axis="y"
        position={[8.1, 0, -46.8]}
        yaw={0.5}
        shadow={0.3}
      />
      <Placed
        url={M.gasBottle}
        size={1.32}
        axis="y"
        position={[8.3, 0, -47.6]}
        yaw={-0.7}
        shadow={0.3}
      />
      {/* Worn parts rack against the wall — customers' bits staged by the door */}
      <Placed
        url={M.rack}
        size={2.05}
        axis="y"
        position={[-8.1, 0, -46.6]}
        yaw={Math.PI / 2 - 0.06}
        shadow={0.9}
        shadowSpread={[0.45, 1]}
      />
      <Placed url={M.pallet} size={1.2} position={[-7.2, 0, -55.0]} yaw={-0.5} shadow={0.62} />
      <Placed url={M.boxes} size={0.9} position={[-7.2, 0.14, -55.0]} yaw={0.8} shadow={false} />

      {/* Kerb line at the threshold */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -56.4]}>
        <planeGeometry args={[11, 0.14]} />
        <meshStandardMaterial color="#6f5d38" roughness={0.9} metalness={0.02} />
      </mesh>

      <FloorStain radius={2.4} position={[-1.9, 0.013, -52.4]} spread={[0.55, 1]} opacity={0.22} />
    </group>
  );
}
