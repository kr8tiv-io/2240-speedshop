"use client";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import gsap from "gsap";
import {
  getImageEntries,
  subscribeImages,
  type GLImageEntry,
} from "./registry";

/**
 * The ONE shared transparent canvas for the whole site (root layout).
 * Every GLImage on the page is mirrored by a plane positioned in px space
 * (perspective camera at z=600 with fov derived from viewport height, so
 * 1 world unit = 1 css px). Effects, per the elevation research doc:
 *  - ping-pong FBO flowmap: the cursor leaves a liquid trail that displaces
 *    the image and drives RGB shift (recipe 1A + 1C)
 *  - scroll-velocity vertex bend + stretch (recipe 3)
 *  - in-shader masked reveal with zoom settle (recipe 4)
 *  - the flashlight brightness lift, moved into the shader
 * Desktop / fine-pointer / motion-allowed only — everywhere else the DOM
 * <img> mirrors stay visible and carry a CSS masked entrance instead.
 */

const shared = {
  flow: null as THREE.Texture | null,
  velocity: 0,
  mouseClient: { x: -1000, y: -1000 },
};

/** Scratch vector — never allocate inside useFrame. */
const TMP_VEL = new THREE.Vector2();

/* ── shaders ────────────────────────────────────────────────────────────── */

const SPLAT_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const SPLAT_FRAG = /* glsl */ `
  uniform sampler2D tPrev;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uAspect;
  varying vec2 vUv;
  void main() {
    vec4 prev = texture2D(tPrev, vUv) * 0.962; // dissipation
    vec2 aspectFix = vec2(uAspect, 1.0);
    float d = distance(vUv * aspectFix, uMouse * aspectFix);
    float falloff = smoothstep(0.13, 0.0, d);
    vec3 add = vec3(uVel * 5.5, 1.0) * falloff;
    gl_FragColor = vec4(prev.rgb + add, 1.0);
  }
`;

const PLANE_VERT = /* glsl */ `
  uniform float uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    // Curtains-style bend: edges pinned, centre lags the scroll. Kept, but at
    // less than half its old amplitude — with a wheel, velocity arrives in
    // spikes, and at 0.55 every notch visibly buckled the image.
    pos.z += sin(uv.y * 3.14159265) * uVelocity * 0.22;
    // The K72 velocity-skew that used to live here (pos.x shear) is gone with
    // its DOM sibling: the client read it, correctly, as images "coming in on
    // an angle and fluttering".
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const PLANE_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D tFlow;
  uniform vec2 uPlaneSize;
  uniform vec2 uImageSize;
  uniform vec2 uMouseLocal;
  uniform vec2 uResolution;
  uniform float uHover;
  uniform float uVelocity;
  uniform float uReveal;
  uniform float uZoom;
  varying vec2 vUv;

  void main() {
    // cover-fit UVs
    vec2 s = uPlaneSize / uImageSize;
    float rmax = max(s.x, s.y);
    vec2 cuv = (vUv - 0.5) * (s / rmax) + 0.5;
    // zoom settle during the reveal
    cuv = (cuv - 0.5) / uZoom + 0.5;
    // flowmap displacement (screen-space trail)
    vec2 suv = gl_FragCoord.xy / uResolution;
    vec3 flow = texture2D(tFlow, suv).rgb;
    cuv -= flow.rg * 0.05;
    // velocity stretch cheat
    cuv.y = (cuv.y - 0.5) * (1.0 + abs(uVelocity) * 0.0014) + 0.5;
    // RGB shift from flow strength + scroll velocity — lens physics, in-motion only
    float shift = length(flow.rg) * 0.012 + abs(uVelocity) * 0.00032;
    vec2 dir = normalize(flow.rg + vec2(0.0005));
    float r = texture2D(uMap, cuv + dir * shift).r;
    float g = texture2D(uMap, cuv).g;
    float b = texture2D(uMap, cuv - dir * shift).b;
    vec3 col = vec3(r, g, b);
    // the bright editorial grade (shader twin of .graded: brightness 1.02,
    // contrast 1.06, saturate 0.9 — clean magazine, no warm cast)
    col = (col - 0.5) * 1.06 + 0.5;
    col *= 1.02;
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(vec3(lum), col, 0.9);
    // INVERTED flashlight: the image sits at full brightness; on hover the
    // frame dims a touch everywhere EXCEPT a soft warm pool at the cursor.
    float aspect = uPlaneSize.x / max(uPlaneSize.y, 1.0);
    float d = distance(vec2(vUv.x * aspect, vUv.y), vec2(uMouseLocal.x * aspect, uMouseLocal.y));
    float pool = smoothstep(0.85, 0.0, d) * uHover;
    col *= mix(1.0, 0.92, uHover * (1.0 - pool));
    col *= mix(1.0, 1.05, pool);
    col += vec3(1.0, 0.94, 0.85) * pool * 0.035;
    // masked reveal, bottom-up with a soft edge
    float m = 1.0 - smoothstep(uReveal - 0.14, uReveal, vUv.y);
    gl_FragColor = vec4(col, m);
  }
`;

/* ── px-perfect camera ──────────────────────────────────────────────────── */

function PxCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    camera.fov = (2 * Math.atan(size.height / 2 / 600) * 180) / Math.PI;
    camera.position.set(0, 0, 600);
    camera.updateProjectionMatrix();
  }, [camera, size.height]);
  return null;
}

/* ── flowmap: ping-pong FBO, one for the whole page ─────────────────────── */

function Flowmap() {
  const gl = useThree((s) => s.gl);
  const scene = useMemo(() => new THREE.Scene(), []);
  const cam = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const mouse = useRef({ uv: new THREE.Vector2(-1, -1), vel: new THREE.Vector2(), last: new THREE.Vector2(-1, -1) });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          tPrev: { value: null },
          uMouse: { value: new THREE.Vector2(-1, -1) },
          uVel: { value: new THREE.Vector2() },
          uAspect: { value: 1 },
        },
        vertexShader: SPLAT_VERT,
        fragmentShader: SPLAT_FRAG,
        depthTest: false,
        depthWrite: false,
      }),
    [],
  );

  const targets = useMemo(() => {
    const mk = () =>
      new THREE.WebGLRenderTarget(160, 160, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        depthBuffer: false,
      });
    return { a: mk(), b: mk() };
  }, []);

  useMemo(() => {
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
  }, [scene, material]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      shared.mouseClient.x = e.clientX;
      shared.mouseClient.y = e.clientY;
      mouse.current.uv.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      targets.a.dispose();
      targets.b.dispose();
    };
  }, [targets]);

  useFrame(() => {
    const m = mouse.current;
    if (m.last.x < 0) m.last.copy(m.uv);
    // lerped velocity, decaying so the trail dies gracefully
    m.vel.lerp(TMP_VEL.subVectors(m.uv, m.last), 0.4);
    m.vel.multiplyScalar(0.9);
    m.last.copy(m.uv);

    material.uniforms.tPrev.value = targets.a.texture;
    material.uniforms.uMouse.value.copy(m.uv);
    material.uniforms.uVel.value.copy(m.vel);
    material.uniforms.uAspect.value = window.innerWidth / window.innerHeight;

    gl.setRenderTarget(targets.b);
    gl.render(scene, cam);
    gl.setRenderTarget(null);
    const t = targets.a;
    targets.a = targets.b;
    targets.b = t;
    shared.flow = targets.a.texture;

    // page scroll velocity, clamped + smoothed
    const raw = THREE.MathUtils.clamp(window.__lenisVelocity ?? 0, -30, 30);
    shared.velocity += (raw - shared.velocity) * 0.1;
  }, -1);

  return null;
}

/* ── one plane per registered DOM image ─────────────────────────────────── */

function ImagePlane({ entry }: { entry: GLImageEntry }) {
  const texture = useLoader(THREE.TextureLoader, entry.src);
  const mesh = useRef<THREE.Mesh>(null);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const rect = useRef({ left: 0, top: 0, w: 1, h: 1 });
  const hover = useRef(0);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
  }, [texture]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: texture },
          tFlow: { value: null },
          uPlaneSize: { value: new THREE.Vector2(1, 1) },
          uImageSize: {
            value: new THREE.Vector2(texture.image?.width ?? 1, texture.image?.height ?? 1),
          },
          uMouseLocal: { value: new THREE.Vector2(-1, -1) },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uHover: { value: 0 },
          uVelocity: { value: 0 },
          uReveal: { value: 0 },
          uZoom: { value: 1.22 * entry.zoom },
        },
        vertexShader: PLANE_VERT,
        fragmentShader: PLANE_FRAG,
        transparent: true,
      }),
    [texture, entry.zoom],
  );

  // Measure the DOM rect (document space) — never per frame.
  useEffect(() => {
    const measure = () => {
      const r = entry.el.getBoundingClientRect();
      rect.current = {
        left: r.left + window.scrollX,
        top: r.top + window.scrollY,
        w: Math.max(r.width, 1),
        h: Math.max(r.height, 1),
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(entry.el);
    window.addEventListener("resize", measure);
    const late = window.setTimeout(measure, 900); // post-font settle
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(late);
    };
  }, [entry]);

  // Plane is live: hide the DOM img; masked reveal when it scrolls in.
  useEffect(() => {
    entry.onActive(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          gsap.to(material.uniforms.uReveal, { value: 1.16, duration: 1.25, ease: "power4.out" });
          gsap.to(material.uniforms.uZoom, { value: entry.zoom, duration: 1.5, ease: "power3.out" });
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(entry.el);
    return () => {
      entry.onActive(false);
      io.disconnect();
      material.dispose();
    };
  }, [entry, material]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const { left, top, w, h } = rect.current;
    const screenLeft = left - window.scrollX;
    const screenTop = top - window.scrollY;

    // cull offscreen planes
    if (screenTop > size.height + 240 || screenTop + h < -240) {
      m.visible = false;
      return;
    }
    m.visible = true;

    m.position.set(
      screenLeft + w / 2 - size.width / 2,
      -(screenTop + h / 2) + size.height / 2,
      0,
    );
    m.scale.set(w, h, 1);

    const u = material.uniforms;
    u.uPlaneSize.value.set(w, h);
    u.uVelocity.value = shared.velocity;
    u.tFlow.value = shared.flow;
    u.uResolution.value.set(gl.domElement.width, gl.domElement.height);

    const mx = (shared.mouseClient.x - screenLeft) / w;
    const my = 1 - (shared.mouseClient.y - screenTop) / h;
    u.uMouseLocal.value.set(mx, my);
    const inside = mx > 0 && mx < 1 && my > 0 && my < 1 ? 1 : 0;
    hover.current += (inside - hover.current) * 0.09;
    u.uHover.value = hover.current;
  });

  return (
    <mesh ref={mesh} material={material}>
      <planeGeometry args={[1, 1, 1, 32]} />
    </mesh>
  );
}

function Planes() {
  const entries = useSyncExternalStore(subscribeImages, getImageEntries, getImageEntries);
  return (
    <>
      {entries.map((entry) => (
        <Suspense key={entry.id} fallback={null}>
          <ImagePlane entry={entry} />
        </Suspense>
      ))}
    </>
  );
}

/* ── the layer ──────────────────────────────────────────────────────────── */

export function GLImagesLayer() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd =
      typeof navigator !== "undefined" &&
      "deviceMemory" in navigator &&
      (navigator as { deviceMemory?: number }).deviceMemory !== undefined &&
      (navigator as { deviceMemory?: number }).deviceMemory! <= 4;
    if (fine && wide && !reduced && !lowEnd) setEnabled(true);
  }, []);

  // Render ONLY while at least one mirrored image is near the viewport.
  // On the homepage that means the whole 560vh hero film runs with this
  // second context fully paused — no flowmap pass, no full-screen composite.
  useEffect(() => {
    if (!enabled) return;
    let io: IntersectionObserver | null = null;
    const visible = new Set<Element>();
    const sync = () => {
      io?.disconnect();
      visible.clear();
      const entries = getImageEntries();
      if (entries.length === 0) {
        setActive(false);
        return;
      }
      io = new IntersectionObserver(
        (records) => {
          for (const r of records) {
            if (r.isIntersecting) visible.add(r.target);
            else visible.delete(r.target);
          }
          setActive(visible.size > 0);
        },
        { rootMargin: "280px 0px" },
      );
      for (const entry of entries) io.observe(entry.el);
    };
    sync();
    const unsub = subscribeImages(sync);
    return () => {
      unsub();
      io?.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 600], near: 0.1, far: 1400 }}
        onCreated={({ gl }) => {
          gl.setClearAlpha(0);
          gl.domElement.addEventListener("webglcontextlost", () => setEnabled(false));
        }}
      >
        <PxCamera />
        <Flowmap />
        <Planes />
      </Canvas>
    </div>
  );
}

export default GLImagesLayer;
