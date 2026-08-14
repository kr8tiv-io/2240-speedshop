"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { railOf, stationAt, influence, introAt } from "./world";

/* ─────────────────────────────────────────────────────────────────────────────
   ATMOSPHERE — the weather and the work.

   Three additions from the "make it cinematic" pass, every one of them a
   single draw call, per the instancing-first advice on the three.js thread:
   exhaust haze coming off the dyno car, rain over the back lot, and sheet
   lightning behind the skyline. All of it is arrival-gated the same way the
   welder arc is — the effect spends nothing while the reader is elsewhere.
   ────────────────────────────────────────────────────────────────────────── */

/* ── Exhaust haze at the dyno (station 4) ───────────────────────────────────
   The rollers already spin up on arrival; this is the exhaust that says the
   engine is actually running. Soft grey puffs off the tailpipe, drifting up
   and back toward the extraction duct, dissolving as they rise. One Points
   call, CPU-stepped like the weld sparks — 64 particles is nothing. */

const PUFF_COUNT = 64;

export function ExhaustHaze({
  position,
  station = 4,
}: {
  /** Where the tailpipe is. */
  position: [number, number, number];
  station?: number;
}) {
  const points = useRef<THREE.Points>(null);
  const seeds = useMemo(() => {
    const array: Array<{
      vx: number;
      vy: number;
      vz: number;
      life: number;
      offset: number;
      drift: number;
    }> = [];
    for (let i = 0; i < PUFF_COUNT; i++) {
      array.push({
        vx: ((i * 31) % 13) / 13 - 0.5,
        vy: 0.55 + ((i * 17) % 11) / 22,
        vz: 0.25 + ((i * 23) % 7) / 14,
        life: 1.6 + ((i * 7) % 9) / 6,
        offset: ((i * 29) % 19) / 19,
        drift: ((i * 41) % 17) / 17 - 0.5,
      });
    }
    return array;
  }, []);
  const positions = useMemo(() => new Float32Array(PUFF_COUNT * 3), []);

  useFrame((state) => {
    if (!points.current) return;
    const arrival = influence(railOf(state.camera).t, station);
    points.current.visible = arrival > 0.05;
    if (!points.current.visible) return;

    const elapsed = state.clock.elapsedTime;
    for (let i = 0; i < PUFF_COUNT; i++) {
      const s = seeds[i];
      const t = ((elapsed / s.life + s.offset) % 1) * s.life;
      // A puff kicks out horizontally, slows, and rides its own buoyancy up.
      positions[i * 3] = s.vx * t * 0.4 + Math.sin(t * 2.1 + i) * 0.08 * t;
      positions[i * 3 + 1] = s.vy * t * t * 0.5;
      positions[i * 3 + 2] = s.vz * t + s.drift * t * 0.5;
    }
    const attribute = points.current.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    attribute.needsUpdate = true;
    const material = points.current.material as THREE.PointsMaterial;
    // Idles rich on arrival, leans out as the reader moves on.
    material.opacity = 0.16 * arrival * introAt(elapsed);
  });

  return (
    <points ref={points} position={position} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.34}
        color="#8d949f"
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Rain over the back lot (stations 5–6) ──────────────────────────────────
   The lot was always wet — asphalt at roughness 0.36, pools under the yard
   lights — but nothing said WHY. Four hundred streaks falling through the
   lamp cones close the loop. Fully GPU-resident: seeds live in attributes,
   the vertex shader loops each drop with uTime, so per frame the CPU pays
   one uniform write. One LineSegments call, gated off until the camera is
   in the back half of the building. */

const DROP_COUNT = 400;
const RAIN_TOP = 12;

export function RainCurtain() {
  const lines = useRef<THREE.LineSegments>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(DROP_COUNT * 2 * 3);
    const seed = new Float32Array(DROP_COUNT * 2 * 3); // x, phase, z (per vertex)
    const end = new Float32Array(DROP_COUNT * 2); // 0 head, 1 tail

    for (let i = 0; i < DROP_COUNT; i++) {
      const x = (((i * 37) % 100) / 100 - 0.5) * 46;
      const z = -60 - (((i * 53) % 100) / 100) * 26;
      const phase = ((i * 71) % 100) / 100;
      for (const v of [0, 1]) {
        const j = (i * 2 + v) * 3;
        seed[j] = x;
        seed[j + 1] = phase;
        seed[j + 2] = z;
        end[i * 2 + v] = v;
        // Static fallback positions; the shader owns the real ones.
        pos[j] = x;
        pos[j + 1] = 0;
        pos[j + 2] = z;
      }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
    geo.setAttribute("aEnd", new THREE.BufferAttribute(end, 1));
    // The drops live over the lot; cover it so culling never blinks them out.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 6, -73), 40);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aSeed;
        attribute float aEnd;
        uniform float uTime;
        varying float vFade;
        void main() {
          float speed = 9.0 + fract(aSeed.y * 7.31) * 4.0;
          float top = ${RAIN_TOP.toFixed(1)};
          float y = top - mod(aSeed.y * top + uTime * speed, top);
          // The tail trails 0.55 above the head — a streak, not a dot.
          y += aEnd * 0.55;
          // Wind shear: everything leans the same way, slightly.
          float lean = (top - y) * 0.06;
          vFade = (1.0 - aEnd * 0.85);
          gl_Position = projectionMatrix * modelViewMatrix *
            vec4(aSeed.x + lean, y, aSeed.z, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        varying float vFade;
        void main() {
          gl_FragColor = vec4(0.62, 0.71, 0.86, vFade * uOpacity);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    if (!lines.current) return;
    const at = stationAt(state.camera);
    // On from the office wall out — the door stations are where the lot is
    // actually in frame. Fades in over the last station and a half.
    const gate = THREE.MathUtils.clamp((at - 4.2) / 1.2, 0, 1);
    lines.current.visible = gate > 0.02;
    if (!lines.current.visible) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uOpacity.value = 0.34 * gate * introAt(state.clock.elapsedTime);
  });

  return (
    <lineSegments
      ref={lines}
      geometry={geometry}
      material={material}
      visible={false}
      frustumCulled={false}
    />
  );
}

/* ── Sheet lightning behind the skyline ─────────────────────────────────────
   Every so often the far blocks print against a flash. Deterministic — a
   product of offset sines thresholded hard, so it needs no state, survives
   resume, and two machines show the same storm. The flash is a real light:
   the warehouses, the parapets and the wet lot all catch it, which is what
   sells it as weather rather than a screen flash. */

export function SheetLightning() {
  const flash = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!flash.current) return;
    const t = state.clock.elapsedTime;
    // Rare, uneven, double-strobed: two beating sines gate a fast flicker.
    const gate = Math.sin(t * 0.31) * Math.sin(t * 0.113 + 1.7);
    const burst = gate > 0.985 ? 1 : 0;
    const stutter = 0.55 + 0.45 * Math.sin(t * 47.0);
    // Only spends when the night outside is actually in frame.
    const at = stationAt(state.camera);
    const inFrame = at > 4.0 ? 1 : 0;
    flash.current.intensity = 340 * burst * stutter * inFrame;
  });

  return (
    <pointLight
      ref={flash}
      color="#cdd9f4"
      intensity={0}
      distance={120}
      decay={1.6}
      position={[14, 26, -104]}
    />
  );
}

/* ── The sodium shaft through the roll-up door ──────────────────────────────
   The award-site beat: one big volumetric slab of street light falling in
   through the opening, with smoke actually MOVING through it. A single quad
   and a two-octave value noise in the fragment shader — the noise scrolls
   slowly upward and toward the shop, so the shaft reads as air, not as a
   gradient. Fades by view angle so it vanishes when seen edge-on. */

export function DoorShaft() {
  const mesh = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uColor: { value: new THREE.Color("#8fa7d4") },
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
          uniform float uTime;
          uniform float uOpacity;
          uniform vec3 uColor;

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
            // Slow drift: up a little, into the shop more — the night leaking in.
            vec2 flow = vUv * vec2(3.0, 2.2) + vec2(uTime * 0.05, uTime * 0.11);
            float n = noise(flow) * 0.62 + noise(flow * 2.7) * 0.38;
            // Brightest at the opening (top of the quad), gone at the floor.
            float fall = pow(vUv.y, 1.6);
            // Feathered sides so the slab has no cut edges.
            float across = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
            float a = fall * across * (0.35 + 0.65 * n) * uOpacity;
            gl_FragColor = vec4(uColor * a, a);
          }
        `,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    if (!mesh.current) return;
    const at = stationAt(state.camera);
    // The shaft belongs to the door shot; it starts breathing in from the
    // office wall and is full strength on arrival.
    const gate = THREE.MathUtils.clamp((at - 4.4) / 1.3, 0, 1);
    mesh.current.visible = gate > 0.02;
    if (!mesh.current.visible) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uOpacity.value =
      0.34 * gate * introAt(state.clock.elapsedTime);
  });

  return (
    // Leaning into the shop: top edge at the door header, foot inside on the
    // concrete — the geometry of light falling through a tall opening.
    <mesh
      ref={mesh}
      position={[0, 2.6, -55.4]}
      rotation={[0.42, 0, 0]}
      visible={false}
    >
      <planeGeometry args={[10.4, 6.4]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* ── Ground fog ─────────────────────────────────────────────────────────────
   Six wide, low quads drifting slowly across the drive line, each carrying
   the same value noise masked to a soft ellipse. Instanced — one draw call
   for all of them, per the instancing-first advice — and so faint that they
   read as cold air moving over concrete rather than as an effect. */

const WISP_COUNT = 6;

export function GroundFog() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: WISP_COUNT }, (_, i) => ({
        x: ((i * 37) % 13) - 6,
        z: -6 - i * 8.6 - ((i * 19) % 5),
        drift: 0.14 + ((i * 7) % 5) / 30,
        phase: (i * 977) % 63,
        width: 7 + ((i * 11) % 6),
      })),
    [],
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uColor: { value: new THREE.Color("#4e5c74") },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix *
              vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uOpacity;
          uniform vec3 uColor;

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
            float d = length((vUv - 0.5) * vec2(2.0, 2.6));
            float mask = smoothstep(1.0, 0.35, d);
            float n = noise(vUv * vec2(5.0, 3.0) + vec2(uTime * 0.06, 0.0));
            float a = mask * (0.3 + 0.7 * n) * uOpacity;
            gl_FragColor = vec4(uColor * a, a);
          }
        `,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    if (!mesh.current) return;
    const elapsed = state.clock.elapsedTime;
    material.uniforms.uTime.value = elapsed;
    material.uniforms.uOpacity.value = 0.05 * introAt(elapsed);

    for (let i = 0; i < WISP_COUNT; i++) {
      const s = seeds[i];
      const x = s.x + Math.sin(elapsed * s.drift + s.phase) * 3.2;
      const z = s.z + Math.cos(elapsed * s.drift * 0.7 + s.phase) * 1.8;
      matrix.makeRotationX(-Math.PI / 2);
      matrix.setPosition(x, 0.14 + 0.05 * Math.sin(elapsed * 0.2 + i), z);
      mesh.current.setMatrixAt(i, matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, WISP_COUNT]}
      frustumCulled={false}
    >
      <planeGeometry args={[9, 4.2]} />
      <primitive object={material} attach="material" />
    </instancedMesh>
  );
}

/* ── The inspection light (desktop interaction) ─────────────────────────────
   The cursor already drifts the camera; this gives it a beam. A weak cool
   light rides the pointer a few metres ahead of the lens, so moving the mouse
   sweeps a subtle inspection glow across whatever the reader is examining.
   Deliberately faint — it must never fight the tungsten art direction. */

export function InspectionLight() {
  const light = useRef<THREE.PointLight>(null);
  const pointer = useRef(new THREE.Vector2());
  const spot = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());

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
    if (!light.current) return;
    const camera = state.camera;
    camera.getWorldDirection(forward.current);
    right.current.crossVectors(forward.current, camera.up).normalize();

    spot.current
      .copy(camera.position)
      .addScaledVector(forward.current, 4.2)
      .addScaledVector(right.current, pointer.current.x * 2.4);
    spot.current.y = Math.max(spot.current.y - pointer.current.y * 1.6, 0.4);

    const step = Math.min(delta, 0.1);
    light.current.position.x = THREE.MathUtils.damp(
      light.current.position.x, spot.current.x, 4, step);
    light.current.position.y = THREE.MathUtils.damp(
      light.current.position.y, spot.current.y, 4, step);
    light.current.position.z = THREE.MathUtils.damp(
      light.current.position.z, spot.current.z, 4, step);
    light.current.intensity = 5.5 * introAt(state.clock.elapsedTime);
  });

  return (
    <pointLight
      ref={light}
      color="#9db8e8"
      intensity={0}
      distance={7}
      decay={2}
    />
  );
}
