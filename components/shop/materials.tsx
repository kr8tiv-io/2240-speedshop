"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────────
   Procedural light and shadow materials.

   Additive, depth-write off, no texture fetch and no document access, so they
   are safe in a module that must never touch the DOM during render. The shadow
   blob is the odd one out — normal blending, black — because a garage full of
   models that do not cast real shadows would float. Fake contact shadows are
   the cheapest honest grounding there is.
   ────────────────────────────────────────────────────────────────────────── */

export const GLOW_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function makeRadialGlow(color: string, opacity: number, power: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uPower: { value: power },
    },
    vertexShader: GLOW_VERT,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uPower;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float a = pow(max(1.0 - d, 0.0), uPower) * uOpacity;
        gl_FragColor = vec4(uColor * a, a);
      }
    `,
  });
}

/** Volumetric cone under a hanging fixture: bright at the shade, gone by the floor. */
export function makeConeGlow(color: string, opacity: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    vertexShader: GLOW_VERT,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        float a = pow(vUv.y, 2.1) * uOpacity;
        gl_FragColor = vec4(uColor * a, a);
      }
    `,
  });
}

/** A soft dark ellipse — what a car, a drum or a bench does to the concrete. */
export function makeShadowBlob(opacity: number, power: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uOpacity: { value: opacity },
      uPower: { value: power },
    },
    vertexShader: GLOW_VERT,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform float uOpacity;
      uniform float uPower;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float a = pow(max(1.0 - d, 0.0), uPower) * uOpacity;
        gl_FragColor = vec4(0.0, 0.0, 0.0, a);
      }
    `,
  });
}

export function useRadialGlow(color: string, opacity: number, power: number) {
  const material = useMemo(
    () => makeRadialGlow(color, opacity, power),
    [color, opacity, power],
  );
  useEffect(() => () => material.dispose(), [material]);
  return material;
}

export function useConeGlow(color: string, opacity: number) {
  const material = useMemo(() => makeConeGlow(color, opacity), [color, opacity]);
  useEffect(() => () => material.dispose(), [material]);
  return material;
}

export function useShadowBlob(opacity: number, power: number) {
  const material = useMemo(() => makeShadowBlob(opacity, power), [opacity, power]);
  useEffect(() => () => material.dispose(), [material]);
  return material;
}

/** Fade a glow mesh from inside a frame loop, through its object ref. */
export function fadeGlow(mesh: THREE.Mesh | null, value: number) {
  const material = mesh?.material as THREE.ShaderMaterial | undefined;
  const uniform = material?.uniforms?.uOpacity;
  if (uniform) uniform.value = value;
}

/* ── Contact shadow ─────────────────────────────────────────────────────── */

export type ContactShadowProps = {
  /** Half-length of the blob along local X, before `spread`. */
  radius: number;
  position?: [number, number, number];
  /** [x, z] multipliers — a car wants a long, narrow ellipse. */
  spread?: [number, number];
  rotation?: number;
  opacity?: number;
  power?: number;
};

/**
 * A grounding smudge on the concrete. Nothing in this scene casts a real
 * shadow — a shadow map across a 68-unit building would cost more than the
 * whole model budget — so contact is faked where the eye actually checks for
 * it: directly under the wheels, the feet and the base plates.
 */
export function ContactShadow({
  radius,
  position = [0, 0.018, 0],
  spread = [1, 1],
  rotation = 0,
  opacity = 0.55,
  power = 1.8,
}: ContactShadowProps) {
  const material = useShadowBlob(opacity, power);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, rotation]}
      position={position}
      scale={[spread[0], spread[1], 1]}
      renderOrder={2}
    >
      <circleGeometry args={[radius, 28]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/** Oil stain / tyre smear on the floor. Same blob, flatter falloff. */
export function FloorStain({
  radius,
  position,
  spread = [1, 1],
  rotation = 0,
  opacity = 0.4,
}: ContactShadowProps) {
  return (
    <ContactShadow
      radius={radius}
      position={position}
      spread={spread}
      rotation={rotation}
      opacity={opacity}
      power={1.1}
    />
  );
}
