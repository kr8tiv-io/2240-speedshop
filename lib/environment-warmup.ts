import * as THREE from "three";

type WarmableGenerator = THREE.PMREMGenerator & {
  _setSize: (size: number) => void;
  _allocateTargets: () => THREE.WebGLRenderTarget;
  _ggxMaterial: THREE.ShaderMaterial;
  _lodMeshes: THREE.Mesh[];
};
type Warmup = { ready: Promise<void>; dispose: () => void };
const warmups = new WeakMap<THREE.WebGLRenderer, Warmup>();

/**
 * Submit the installed generator's exact GGX program while models
 * load. Three's public compileCubemapShader prepares only the cheap conversion;
 * the 256-sample GGX filter otherwise links synchronously on first reflection.
 *
 * This guarded r185 adapter does not generate/replace any environment texture,
 * edit a shader, reduce samples, or alter the live scene. A future Three revision
 * falls back to its normal path until the adapter's shader-equivalence tests are
 * updated. Keep the owned materials until first real use so Three's program and
 * custom-shader caches can share them with its internal PMREM generator.
 */
export function startEnvironmentWarmup(gl: THREE.WebGLRenderer, resolution: number) {
  if (warmups.has(gl) || THREE.REVISION !== "185" || gl.getContext().isContextLost()) return;
  let generator: WarmableGenerator | undefined;
  let target: THREE.WebGLRenderTarget | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let resolveReady: () => void = () => {};
  const ready = new Promise<void>(resolve => { resolveReady = resolve; });
  const job: Warmup = {
    ready,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      if (timer !== undefined) clearTimeout(timer);
      resolveReady();
      try { target?.dispose(); } catch { /* Context loss already releases GPU storage. */ }
      try { generator?.dispose(); } catch { /* Optional warm-up never blocks teardown. */ }
    },
  };
  warmups.set(gl, job);
  try {
    generator = new THREE.PMREMGenerator(gl) as WarmableGenerator;
    if (typeof generator._setSize !== "function" || typeof generator._allocateTargets !== "function") {
      releaseEnvironmentWarmup(gl);
      return;
    }
    generator._setSize(resolution);
    // Construct the library-owned shaders/LOD geometry, but do not render or
    // allocate this full-size environment on the GPU. Only a tiny matching HDR
    // target is needed to select the exact shader output-space variant.
    generator._allocateTargets().dispose();
    target = new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      colorSpace: THREE.LinearSRGBColorSpace,
      depthBuffer: false,
    });
    const previous = gl.getRenderTarget();
    const face = gl.getActiveCubeFace();
    const mip = gl.getActiveMipmapLevel();
    try {
      gl.setRenderTarget(target);
      const mesh = new THREE.Mesh(generator._lodMeshes[1].geometry, generator._ggxMaterial);
      gl.compile(mesh, new THREE.OrthographicCamera());
    } finally {
      // All submission is synchronous. No private render target survives a
      // scheduling boundary or gets restored over a newer animation frame.
      gl.setRenderTarget(previous, face, mip);
    }
    const materials = [generator._ggxMaterial];
    const deadline = performance.now() + 8000;
    const poll = () => {
      if (disposed) return;
      try {
        if (gl.getContext().isContextLost() || performance.now() >= deadline) {
          resolveReady();
          return;
        }
        const complete = materials.every(material => {
          const { currentProgram } = gl.properties.get(material) as {
            currentProgram?: { isReady?: () => boolean };
          };
          return !currentProgram?.isReady || currentProgram.isReady();
        });
        if (complete) { resolveReady(); return; }
        timer = setTimeout(poll, 16);
      } catch {
        resolveReady();
      }
    };
    poll();
  } catch {
    releaseEnvironmentWarmup(gl);
  }
}

/** Bounded completion; missing/unsupported warm-up retains Three's normal path. */
export async function waitForEnvironmentWarmup(gl: THREE.WebGLRenderer) {
  await warmups.get(gl)?.ready;
}

/** Call after the real reflection is built, and again (idempotently) on teardown. */
export function releaseEnvironmentWarmup(gl: THREE.WebGLRenderer) {
  const job = warmups.get(gl);
  if (!job) return;
  warmups.delete(gl);
  job.dispose();
}
