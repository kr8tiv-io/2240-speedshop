import * as THREE from "three";

/**
 * The three-act stage: the version-agnostic machinery behind the film.
 *
 * Everything here is palette-free and identical in the Daylight and After
 * Hours builds — what differs between them is the LOOK (materials, lights,
 * grade), which lives in each `HeroScene`. What lives here is the physics of
 * the reveal:
 *
 *   fitStage()      one traversal that both normalises a GLB onto the stage
 *                   (nose-to-tail along Z, sat on the floor, centred) AND
 *                   returns its triangles, so nothing is walked twice.
 *   sampleSurface() area-weighted random points ON the surface — not the
 *                   vertices. A 3.4k-vert body and a 47k-vert body then carry
 *                   the SAME particle density, which is the only way three
 *                   different models can share one reveal and read as one film.
 *   addDissolve()   a bottom-up dissolve front with a hot edge, injected into
 *                   any three material via onBeforeCompile.
 *   chainCompile()  composes onBeforeCompile patches so the candy paint and
 *                   the dissolve can live on the same material.
 *   frameDistance() the camera distance that provably contains a bounding
 *                   sphere at a given FOV and aspect — how "the whole car, in
 *                   frame, on a phone" stops being a hand-tuned number.
 */

/* ── Fitting ───────────────────────────────────────────────────────────── */

export type Fit = {
  /** Yaw that puts the long axis along Z. */
  rotY: number;
  /** Uniform scale onto the stage. */
  scale: number;
  /** Translation applied OUTSIDE the scale, as the original rig expects. */
  offset: THREE.Vector3;
  /** Half-extents of the fitted car (width, height, length) / 2, in metres. */
  half: THREE.Vector3;
  /** Fitted height, floor to roof, in stage metres. */
  height: number;
  /** Model-local extents, used to place the particle scatter. */
  localMinY: number;
  localHeight: number;
  /** Stage metres per model-local unit. */
  perUnit: number;
};

export type StageBuild = {
  fit: Fit;
  /** Flat triangle soup in scene-root space: 9 floats per triangle. */
  tris: Float32Array;
  /** Cumulative triangle area, same length as the triangle count. */
  cumulative: Float32Array;
};

const _v = new THREE.Vector3();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _ab = new THREE.Vector3();
const _ac = new THREE.Vector3();
const _cross = new THREE.Vector3();

/**
 * Walk the loaded scene ONCE: collect every triangle in scene-root space,
 * measure the bounds from those same triangles, and derive the stage fit.
 *
 * Transforms are taken relative to the scene root (inverse of the root's own
 * world matrix) rather than raw `matrixWorld`, so this is correct whether the
 * memo runs before or after the group is mounted — the bug class that turns
 * a car into a speck the second a build order changes.
 */
export function fitStage(scene: THREE.Object3D, length: number): StageBuild {
  scene.updateMatrixWorld(true);
  const toRoot = new THREE.Matrix4().copy(scene.matrixWorld).invert();
  const local = new THREE.Matrix4();

  const chunks: Float32Array[] = [];
  let triCount = 0;
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity,
    maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    const pos = mesh.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!pos) return;
    local.multiplyMatrices(toRoot, mesh.matrixWorld);

    const index = mesh.geometry.getIndex();
    const n = index ? index.count : pos.count;
    const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const vi = index ? index.getX(i) : i;
      _v.fromBufferAttribute(pos, vi).applyMatrix4(local);
      out[i * 3] = _v.x;
      out[i * 3 + 1] = _v.y;
      out[i * 3 + 2] = _v.z;
      if (_v.x < minX) minX = _v.x;
      if (_v.y < minY) minY = _v.y;
      if (_v.z < minZ) minZ = _v.z;
      if (_v.x > maxX) maxX = _v.x;
      if (_v.y > maxY) maxY = _v.y;
      if (_v.z > maxZ) maxZ = _v.z;
    }
    chunks.push(out);
    triCount += Math.floor(n / 3);
  });

  const tris = new Float32Array(triCount * 9);
  let head = 0;
  for (const chunk of chunks) {
    const usable = Math.floor(chunk.length / 9) * 9;
    tris.set(chunk.subarray(0, usable), head);
    head += usable;
  }

  // Area prefix sum, for O(log n) area-weighted picking later.
  const cumulative = new Float32Array(triCount);
  let running = 0;
  for (let t = 0; t < triCount; t++) {
    const o = t * 9;
    _a.set(tris[o], tris[o + 1], tris[o + 2]);
    _b.set(tris[o + 3], tris[o + 4], tris[o + 5]);
    _c.set(tris[o + 6], tris[o + 7], tris[o + 8]);
    _ab.subVectors(_b, _a);
    _ac.subVectors(_c, _a);
    running += _cross.crossVectors(_ab, _ac).length() * 0.5;
    cumulative[t] = running;
  }

  // Nose-to-tail along Z, sat on the floor, centred on the turntable.
  const sizeX = maxX - minX;
  const sizeY = maxY - minY;
  const sizeZ = maxZ - minZ;
  const rotY = sizeX > sizeZ ? Math.PI / 2 : 0;
  const longAxis = Math.max(sizeX, sizeZ);
  const shortAxis = Math.min(sizeX, sizeZ);
  const scale = length / Math.max(longAxis, 0.001);

  // Centre in ROTATED space: a yaw of 90° swaps the x and z centres.
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const rotCentreX = rotY === 0 ? cx : cz;
  const rotCentreZ = rotY === 0 ? cz : -cx;

  const height = sizeY * scale;
  const width = shortAxis * scale;

  return {
    fit: {
      rotY,
      scale,
      offset: new THREE.Vector3(-rotCentreX * scale, -minY * scale, -rotCentreZ * scale),
      half: new THREE.Vector3(width / 2, height / 2, length / 2),
      height,
      localMinY: minY,
      localHeight: Math.max(sizeY, 1e-4),
      perUnit: scale,
    },
    tris,
    cumulative,
  };
}

/* ── Making a low-poly body look like bodywork ──────────────────────────── */

/**
 * Re-weld a mesh by POSITION and recompute its normals.
 *
 * These bodies ship flat-shaded — every triangle carries its own normals, so
 * a 9.6k-triangle Charger reads as a faceted paper model under a rim light,
 * which is exactly the "the cars look cheap" complaint. Merging by position
 * alone (normals stripped first, so identical corners actually match) and
 * averaging gives continuous shading across a panel, and a quarter panel
 * stops looking like origami. It costs nothing at runtime — one pass at load.
 *
 * Bodywork only. Doing this to glass, chrome trim or a tyre rounds off the
 * hard edges that make those read as separate parts.
 */
export function weldSmooth(geometry: THREE.BufferGeometry, tolerance = 1e-4) {
  const source = geometry.index ? geometry.toNonIndexed() : geometry;
  const pos = source.getAttribute("position") as THREE.BufferAttribute;
  const count = pos.count;

  // Everything except the normals rides along — dropping UVs here silently
  // unmaps every textured body panel, which is a nasty way to "improve" a
  // model. Normals are the one thing being rebuilt.
  const carried = Object.keys(source.attributes).filter((n) => n !== "normal");
  const out: Record<string, number[]> = {};
  for (const name of carried) out[name] = [];

  const map = new Map<string, number>();
  const indices = new Uint32Array(count);
  const q = 1 / tolerance;
  let next = 0;

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key = `${Math.round(x * q)},${Math.round(y * q)},${Math.round(z * q)}`;
    let idx = map.get(key);
    if (idx === undefined) {
      idx = next++;
      map.set(key, idx);
      for (const name of carried) {
        const attr = source.getAttribute(name) as THREE.BufferAttribute;
        for (let c = 0; c < attr.itemSize; c++) out[name].push(attr.getComponent(i, c));
      }
    }
    indices[i] = idx;
  }

  const welded = new THREE.BufferGeometry();
  for (const name of carried) {
    const attr = source.getAttribute(name) as THREE.BufferAttribute;
    welded.setAttribute(name, new THREE.Float32BufferAttribute(out[name], attr.itemSize));
  }
  welded.setIndex(new THREE.BufferAttribute(indices, 1));
  welded.computeVertexNormals();
  if (source !== geometry) source.dispose();
  return welded;
}

/* ── The matrix reveal: area-weighted surface points ───────────────────── */

export type Cloud = {
  /** Landed position — the point ON the car. */
  target: Float32Array;
  /** Where it falls in from. */
  start: Float32Array;
  /** 0-1 stagger; low lands first, so the car builds from the floor up. */
  delay: Float32Array;
  seed: Float32Array;
};

/** Deterministic PRNG — the same car assembles the same way every reload. */
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * `count` points scattered over the surface, area-weighted, plus the digital
 * rain they fall from: each point starts on a coarse quantised lattice above
 * its landing spot, so the incoming cloud reads as data resolving into a
 * shape rather than as a puff of smoke.
 */
export function sampleSurface(build: StageBuild, count: number, seedValue = 2240): Cloud {
  const { tris, cumulative, fit } = build;
  const triCount = cumulative.length;
  const total = triCount > 0 ? cumulative[triCount - 1] : 0;
  const rand = mulberry(seedValue);

  const target = new Float32Array(count * 3);
  const start = new Float32Array(count * 3);
  const delay = new Float32Array(count);
  const seed = new Float32Array(count);

  // Scatter distances are quoted in STAGE metres and converted to model-local
  // units, so a 3.4k-poly body and a 47k-poly body drop from the same height.
  const perM = 1 / Math.max(fit.perUnit, 1e-6);
  const rise = 5.2 * perM;
  const lateral = 1.15 * perM;
  const cell = 0.16 * perM;

  for (let i = 0; i < count; i++) {
    // Area-weighted triangle pick.
    const r = rand() * total;
    let lo = 0;
    let hi = triCount - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const o = lo * 9;

    // Uniform barycentric point on that triangle.
    let u = rand();
    let v = rand();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    const x = tris[o] * w + tris[o + 3] * u + tris[o + 6] * v;
    const y = tris[o + 1] * w + tris[o + 4] * u + tris[o + 7] * v;
    const z = tris[o + 2] * w + tris[o + 5] * u + tris[o + 8] * v;

    target[i * 3] = x;
    target[i * 3 + 1] = y;
    target[i * 3 + 2] = z;

    // Quantised lattice start, high above and drifting outward.
    const q = (n: number) => Math.round(n / cell) * cell;
    start[i * 3] = q(x + (rand() - 0.5) * 2 * lateral);
    start[i * 3 + 1] = y + rise * (0.45 + rand() * 0.85);
    start[i * 3 + 2] = q(z + (rand() - 0.5) * 2 * lateral);

    const hNorm = (y - fit.localMinY) / fit.localHeight;
    delay[i] = Math.min(0.999, Math.max(0, hNorm * 0.68 + rand() * 0.32));
    seed[i] = rand();
  }

  return { target, start, delay, seed };
}

/* ── Shader plumbing ───────────────────────────────────────────────────── */

type Patch = (shader: THREE.WebGLProgramParametersWithUniforms) => void;

/**
 * Compose an onBeforeCompile patch onto a material that may already carry
 * one (the candy paint does), and keep the program cache key unique per
 * combination so three never hands back the wrong compiled program.
 */
export function chainCompile(mat: THREE.Material, key: string, patch: Patch) {
  const previous = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, renderer) => {
    previous?.call(mat, shader, renderer);
    patch(shader);
  };
  const previousKey = mat.customProgramCacheKey;
  mat.customProgramCacheKey = () => `${previousKey ? previousKey.call(mat) : ""}|${key}`;
}

export type DissolveUniforms = {
  /** 0 = gone, 1 = fully materialised. Shared by every material of one act. */
  uDiss: { value: number };
  /** Colour of the hot edge riding the dissolve front. */
  uDissEdge: { value: THREE.Color };
  /** Fitted height in stage metres — the front sweeps 0 → this. */
  uDissH: { value: number };
  /** How hard the edge bites. */
  uDissGain: { value: number };
  /** Size of one grid cell, in stage metres. The car builds cell by cell. */
  uGridCell: { value: number };
  /** Colour of the grid drawn on the surface and of the wireframe ghost. */
  uGridColor: { value: THREE.Color };
  /** Grid strength. 0 turns the whole grid language off. */
  uGridGain: { value: number };
};

/* The build order, shared verbatim by the surface shader and the wireframe
   ghost so the two agree on where the front is to the pixel. Quantising the
   threshold to a CELL is what makes the car assemble in blocks — the same
   maths with a per-fragment hash gives a sandstorm, which is pretty and says
   nothing. */
const GRID_GLSL = /* glsl */ `
  float dissHash3( vec3 p ) {
    return fract( sin( dot( p, vec3( 12.9898, 78.233, 37.719 ) ) ) * 43758.5453 );
  }
  /* Signed distance to the build front: < 0 not yet built, > 0 solid. */
  float dissFrontAt( vec3 wp, float diss, float height, float cell ) {
    float h = clamp( wp.y / height, 0.0, 1.0 );
    float r = dissHash3( floor( wp / cell ) );
    return diss * 1.34 - 0.17 - ( h * 0.72 + r * 0.28 );
  }
`;

/**
 * `edge` may deliberately exceed 1 in any channel: the edge is composited as a
 * MIX toward this colour, not an addition, so an over-bright value is what
 * makes it cross the bloom threshold in the dark build — while the daylight
 * build passes a plain red and gets an ink-hot cut line instead of the white
 * smear that adding anything to paper produces.
 */
export function dissolveUniforms(
  edge: THREE.ColorRepresentation,
  height: number,
  gain = 1,
  boost = 1,
  grid: { cell?: number; color?: THREE.ColorRepresentation; gain?: number; boost?: number } = {},
): DissolveUniforms {
  return {
    uDiss: { value: 0 },
    uDissEdge: { value: new THREE.Color(edge).multiplyScalar(boost) },
    uDissH: { value: Math.max(height, 0.001) },
    uDissGain: { value: gain },
    uGridCell: { value: grid.cell ?? 0.15 },
    uGridColor: {
      value: new THREE.Color(grid.color ?? "#ffb066").multiplyScalar(grid.boost ?? 1),
    },
    uGridGain: { value: grid.gain ?? 1 },
  };
}

/**
 * The wireframe ghost — the effect this whole film is named after.
 *
 * A second draw of the car's own geometry as lines, sharing the build-front
 * maths with the surface shader. A bright band rides the front, so the grid
 * visibly RUNS THROUGH the body: ahead of it the car exists only as a lattice,
 * at it the lattice is white-hot, behind it the solid has taken over and the
 * lines fade. The whole thing envelopes away as the car completes, which is
 * why it reads as construction rather than as a permanent wireframe gimmick.
 */
export function gridGhostMaterial(u: DissolveUniforms, gain = 1) {
  return new THREE.ShaderMaterial({
    wireframe: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    // The lines sit ON the surface they describe; without this they z-fight
    // with the solid they are drawn over and the grid crawls with the camera.
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    uniforms: {
      uDiss: u.uDiss,
      uDissH: u.uDissH,
      uGridCell: u.uGridCell,
      uGridColor: u.uGridColor,
      uGhostGain: { value: gain },
    },
    vertexShader: /* glsl */ `
      varying vec3 vGhostW;
      void main() {
        vec4 wp = modelMatrix * vec4( position, 1.0 );
        vGhostW = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uDiss;
      uniform float uDissH;
      uniform float uGridCell;
      uniform vec3 uGridColor;
      uniform float uGhostGain;
      varying vec3 vGhostW;
      ${GRID_GLSL}
      void main() {
        float front = dissFrontAt( vGhostW, uDiss, uDissH, uGridCell );
        // A hot band centred exactly on the front, plus a low lattice over
        // everything not yet built.
        float band = exp( -abs( front ) * 3.2 );
        float pending = step( front, 0.0 ) * 0.2;
        // Gone at both ends: an empty stage has no ghost, and a finished car
        // is a car, not a diagram.
        float envelope = smoothstep( 0.0, 0.05, uDiss ) * ( 1.0 - smoothstep( 0.88, 1.0, uDiss ) );
        float a = clamp( band + pending, 0.0, 1.0 ) * envelope * uGhostGain;
        if ( a < 0.004 ) discard;
        gl_FragColor = vec4( uGridColor * ( 0.45 + 0.75 * band ), a );
      }
    `,
  });
}

/**
 * World height of the build front, for the scan sheet that rides it. Uses the
 * average cell hash (0.5) because the sheet is one plane and the front is a
 * ragged cell boundary — the sheet marks where the sweep IS, not its edge.
 */
export function scanHeight(diss: number, height: number) {
  return THREE.MathUtils.clamp((diss * 1.34 - 0.17 - 0.14) / 0.72, -0.15, 1.15) * height;
}

/**
 * The mesh half of the reveal: a bottom-up build front, quantised to grid
 * CELLS so the car assembles in blocks, with the same lattice drawn onto the
 * bodywork as it passes and a hot edge riding the front itself.
 *
 * `discard` rather than alpha blending — a car has interior geometry, and
 * sorted transparency on that is a mess; a cutout is exact at any angle.
 */
export function addDissolve(mat: THREE.Material, u: DissolveUniforms, key = "dissolve") {
  /* The uniforms object the SHADER will read, pinned to the material where the
     frame loop can find it. This codebase has been bitten twice by the same
     class of bug: a component re-creates its uniforms object, the compiled
     shader keeps the closure over the OLD one, and the frame loop then
     animates an orphan while the material reads values stuck at zero — at
     uDiss 0 the fragment below discards EVERYTHING, so the car simply is not
     there and no error fires anywhere. The frame loop now writes through this
     userData pointer as well as its own reference, so the object being
     animated and the object being read cannot diverge. */
  mat.userData.__dissU = u;
  chainCompile(mat, key, (shader) => {
    shader.uniforms.uDiss = u.uDiss;
    shader.uniforms.uDissEdge = u.uDissEdge;
    shader.uniforms.uDissH = u.uDissH;
    shader.uniforms.uDissGain = u.uDissGain;
    shader.uniforms.uGridCell = u.uGridCell;
    shader.uniforms.uGridColor = u.uGridColor;
    shader.uniforms.uGridGain = u.uGridGain;

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vDissW;")
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvDissW = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;",
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uDiss;
        uniform vec3 uDissEdge;
        uniform float uDissH;
        uniform float uDissGain;
        uniform float uGridCell;
        uniform vec3 uGridColor;
        uniform float uGridGain;
        varying vec3 vDissW;
        ${GRID_GLSL}`,
      )
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        float dissFront = dissFrontAt( vDissW, uDiss, uDissH, uGridCell );
        /* The uDiss guard is a hard visibility guarantee: at full reveal a car
           can NEVER be discarded, whatever state the front calculation is in.
           An act shipped invisible for weeks on the dark build because a stale
           uniform kept the front negative across the whole body while every
           scene-graph check (visible, framed, lit) passed — this makes that
           entire failure class render as, at worst, a wrongly-timed build,
           never an absent car. */
        if ( uDiss < 0.997 && dissFront < 0.0 ) discard;
        float dissEdge = 1.0 - smoothstep( 0.0, 0.075, dissFront );
        /* The lattice, drawn ON the paint: distance to the nearest cell wall
           in any of the three axes, so the grid is a real volume the body
           passes through rather than a texture sitting on it. It burns behind
           the front and settles out as the panel finishes. */
        vec3 dissCellUv = abs( fract( vDissW / uGridCell ) - 0.5 );
        float dissWall = min( min( dissCellUv.x, dissCellUv.y ), dissCellUv.z );
        float dissLine = 1.0 - smoothstep( 0.0, 0.055, dissWall );
        /* The band alone is not enough to clear the grid off a finished car:
           the cells that build LAST sit only 0.17 past the front even at
           uDiss = 1, so the roof kept a lattice tattoo. Envelope on uDiss as
           well — a completed car is a car, not a diagram. */
        float dissBand = exp( -dissFront * 5.5 ) * ( 1.0 - smoothstep( 0.86, 1.0, uDiss ) );`,
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
        gl_FragColor.rgb = mix(
          gl_FragColor.rgb, uGridColor,
          clamp( dissLine * dissBand * uGridGain, 0.0, 1.0 )
        );
        gl_FragColor.rgb = mix( gl_FragColor.rgb, uDissEdge, clamp( dissEdge * uDissGain, 0.0, 1.0 ) );`,
      );
  });
}

/* ── The particle material ─────────────────────────────────────────────── */

export const cloudVertex = /* glsl */ `
  attribute vec3 aStart;
  attribute float aDelay;
  attribute float aSeed;
  uniform float uReveal;
  uniform float uSize;
  uniform float uTime;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    // Each point owns a slice of the reveal: low points land first, so the
    // car precipitates out of the air from the floor up.
    float p = clamp( ( uReveal - aDelay * 0.46 ) / 0.54, 0.0, 1.0 );
    float e = 1.0 - pow( 1.0 - p, 3.0 );
    vec3 pos = mix( aStart, position, e );

    // Jitter that dies as the point lands — motion, not noise.
    float loose = 1.0 - e;
    pos.x += sin( uTime * 2.3 + aSeed * 43.0 ) * 0.055 * loose;
    pos.y += cos( uTime * 1.9 + aSeed * 61.0 ) * 0.045 * loose;
    pos.z += sin( uTime * 1.6 + aSeed * 27.0 ) * 0.055 * loose;

    vec4 mv = modelViewMatrix * vec4( pos, 1.0 );
    gl_Position = projectionMatrix * mv;
    /* CLAMPED, and this clamp is load-bearing. The old size was
       uSize * factor / max( -mv.z, 0.1 ): any particle that drifted next to
       or behind the camera hit the 0.1 floor and inflated to an ~18x-uSize
       point — and a gl_Point rasterises as an AXIS-ALIGNED SCREEN SQUARE, so
       one degenerate particle painted a viewport-sized hard-edged slab for
       exactly as long as the camera dolly kept it close. On this white build
       a bright cloud point IS the "flashes white" report; on the dark
       sibling the same bug painted a black rectangle over act II. Distance
       floor up to 1.0, pixel cap 42, and points behind the camera zeroed —
       their projection is meaningless and can only ever be artefact. */
    float dist = -mv.z;
    gl_PointSize = min( uSize * ( 0.55 + 1.25 * loose ) / max( dist, 1.0 ), 42.0 );

    // Bright in flight, gone once it has landed — the mesh takes over.
    vAlpha = smoothstep( 0.0, 0.07, p ) * ( 1.0 - smoothstep( 0.58, 1.0, p ) );
    vAlpha *= step( 0.6, dist );
    vHeat = smoothstep( 0.35, 0.95, p );
  }
`;

export const cloudFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    // Round soft dot — a square particle reads as a bug, never as light.
    vec2 d = gl_PointCoord - 0.5;
    float r = dot( d, d );
    if ( r > 0.25 ) discard;
    float falloff = 1.0 - smoothstep( 0.0, 0.25, r );
    gl_FragColor = vec4( mix( uColor, uHot, vHeat ), vAlpha * falloff );
  }
`;

/* ── Framing ───────────────────────────────────────────────────────────── */

const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _corner = new THREE.Vector3();
const _worldUp = new THREE.Vector3(0, 1, 0);

/**
 * The distance from `centre` at which a BOX of half-extents `half` provably
 * fits inside the frustum, looking along (centre − from), at `fov`° vertical
 * and `aspect`, with `margin` of breathing room.
 *
 * A bounding sphere would be far simpler and is what most sites do — but a
 * car is 4.7 m long and 1.4 m tall, so its sphere is nearly four times its
 * height, and fitting THAT shoves the camera so far back the car becomes a
 * detail in an empty room. Projecting the eight real corners costs eight dot
 * products and lets the camera come right in on a broadside while still
 * guaranteeing nothing crops — on a 390 px phone as much as on a desktop.
 */
export function fitDistance(
  half: THREE.Vector3,
  centre: THREE.Vector3,
  from: THREE.Vector3,
  fovDeg: number,
  aspect: number,
  margin = 1.06,
) {
  _fwd.copy(centre).sub(from);
  if (_fwd.lengthSq() < 1e-8) _fwd.set(0, 0, -1);
  _fwd.normalize();
  _right.crossVectors(_fwd, _worldUp);
  if (_right.lengthSq() < 1e-8) _right.set(1, 0, 0);
  _right.normalize();
  _up.crossVectors(_right, _fwd).normalize();

  const tanV = Math.tan((fovDeg * Math.PI) / 360);
  const tanH = tanV * Math.max(aspect, 0.0001);

  let need = 0;
  for (let i = 0; i < 8; i++) {
    _corner.set(
      i & 1 ? half.x : -half.x,
      i & 2 ? half.y : -half.y,
      i & 4 ? half.z : -half.z,
    );
    // Corner in camera axes, measured from the box centre.
    const x = Math.abs(_corner.dot(_right));
    const y = Math.abs(_corner.dot(_up));
    const z = _corner.dot(_fwd);
    // Corner depth from the eye is (d + z); it must satisfy both half-angles.
    need = Math.max(need, x / tanH - z, y / tanV - z);
  }
  return need * margin;
}
