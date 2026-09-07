"use client";

import {
  Component,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { advance, useFrame, useLoader, useThree, type RootState } from "@react-three/fiber";
import { Clone } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { ContactShadow } from "./materials";
import { getBoot, markShellWarm, markWorldReady, reportBootProgress, stillFor, subscribeBoot } from "./boot";
import { countLights, installLightPad, lightBudget, setStationLights } from "./lights";
import {
  createMeshoptWorkerDecoder,
  type CancellableMeshoptDecoder,
  type MeshoptWorkerController,
} from "./meshoptWorkerDecoder";
import {
  createRequestPool,
  getModelTransportConcurrency,
  loadModelRequestAttempt,
  runModelResourceAttempts,
} from "./modelRequest";
import { createModelPacketStore, type ModelPacketResource } from "./modelPackets";
import packetManifest from "./modelPackets.generated.json";
import {
  createParseScheduler,
  ParseGenerationCancelledError,
  type ParseGeneration,
} from "./parseScheduler";
import { createStationRelease } from "./stationLiveness";
import { stationAt } from "./world";
import { waitForEnvironmentWarmup, releaseEnvironmentWarmup } from "@/lib/environment-warmup";

/* ─────────────────────────────────────────────────────────────────────────────
   THE MODEL LIBRARY

   `public/models/` holds 105 verified CC0 / CC-BY .glb files, ~140 MB of raw
   authoring assets. 71 of them dress this shop, and not one ships as authored:
   `scripts/compress-models.js` re-encodes every texture to KTX2/Basis and every
   non-vehicle mesh to EXT_meshopt, into `public/models-opt/` — which is the
   only model directory that is ever deployed.

     on the wire        67.2 MB  →  16.2 MB
     texture VRAM      ~520 MB   →  ~25 MB

   The VRAM number is the one that mattered. A 1024² RGBA texture with mips is
   5.5 MB on the GPU and every one of them had to be decoded and mip-generated
   on the main thread; the same texture as ETC1S is 0.7 MB, transcodes in a
   worker, and uploads as-is.

   Station 0 downloads before the door rolls up. Everything behind it
   streams one bay at a time while the reader is watching the cold start —
   fetched, parsed, SHADER-COMPILED off-frame, and only then handed to the
   renderer. Repeats are CLONES of a single load — one fetch per file, ever.
   ────────────────────────────────────────────────────────────────────────── */

/* Raw fetch strings bypass Next's basePath handling, so the subfolder-preview
   builds (BASEPATH=/2240) inject the prefix here at build time. Empty in every
   root-hosted build. */
/* The shelf directories carry a content hash — `/models-opt-a1b2c3d4/` — so a
   model URL changes whenever its bytes do. Without it the host served the
   PREVIOUS build's geometry for up to a month: measured live right after a
   deploy, `car-dodge-charger.glb.br` came back at 94 kB with `age: 2551` while
   the file on disk was 43 kB. Since the twin is requested by name, that is not a
   missed optimisation, it is the old faceted car with a 200 and no error.
   Empty in a source checkout with no built shelves, which keeps the plain paths
   working. */
const VERSION = process.env.NEXT_PUBLIC_MODELS_VERSION ? `-${process.env.NEXT_PUBLIC_MODELS_VERSION}` : "";
const BASE = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models-opt${VERSION}/`;

export const M = {
  /* ── vehicles ── */
  challenger: `${BASE}car-muscle-challenger.glb`,
  coupeHoodUp: `${BASE}car-muscle-coupe-hoodup.glb`,
  charger: `${BASE}car-dodge-charger.glb`,
  camaro: `${BASE}car-camaro.glb`,
  primerShell: `${BASE}car-camaro-primer-shell.glb`,
  rustedShell: `${BASE}car-project-shell-rusted.glb`,
  coveredProject: `${BASE}car-covered-project.glb`,
  pickup: `${BASE}truck-pickup-classic.glb`,

  /* ── hero props (photoreal PBR, Poly Haven) ── */
  toolCart: `${BASE}prop-tool-cart-rolling.glb`,
  weldingCart: `${BASE}prop-welding-cart.glb`,
  tyre: `${BASE}prop-tyre-old.glb`,
  rim: `${BASE}prop-wheel-rim-rusted-a.glb`,
  barrel: `${BASE}prop-barrel-rusted-b.glb`,
  crate: `${BASE}prop-crate-wooden.glb`,
  rack: `${BASE}prop-rack-metal-worn.glb`,
  desk: `${BASE}prop-desk-metal-office.glb`,
  stool: `${BASE}prop-stool-metal-a.glb`,

  /* ── dressing (light-weight, Poly Pizza) ── */
  drum: `${BASE}prop-oil-drum.glb`,
  drumsRow: `${BASE}prop-oil-drums-row.glb`,
  extinguisher: `${BASE}prop-fire-extinguisher.glb`,
  droplight: `${BASE}prop-droplight-pendant.glb`,
  hookChain: `${BASE}prop-hoist-hook-chain.glb`,
  benchCluttered: `${BASE}prop-workbench-cluttered.glb`,
  benchAnvil: `${BASE}prop-workbench-anvil.glb`,
  benchGrinder: `${BASE}prop-workbench-grinder.glb`,
  partsCabinet: `${BASE}prop-parts-cabinet.glb`,
  shelving: `${BASE}prop-shelving-tall.glb`,
  battery: `${BASE}prop-car-battery.glb`,
  sparkPlug: `${BASE}prop-spark-plug.glb`,
  jumperCables: `${BASE}prop-jumper-cables.glb`,
  boxes: `${BASE}prop-cardboard-boxes.glb`,
  pallet: `${BASE}prop-pallet.glb`,
  ladder: `${BASE}prop-ladder.glb`,
  gasCan: `${BASE}prop-gas-can-red.glb`,
  compressor: `${BASE}prop-shop-machine.glb`,

  /* ── station 5/6 set dressing (all sub-600 KB — the two back bays read as
        under-furnished, and this is the cheapest way to fix a composition) ── */
  shelfWooden: `${BASE}prop-shelf-wooden.glb`,
  tyreStack: `${BASE}prop-tyre-stack.glb`,
  wheelStack: `${BASE}prop-wheel-stack-bare.glb`,
  palletJack: `${BASE}prop-pallet-jack.glb`,
  serviceRamp: `${BASE}prop-service-ramp.glb`,
  gasBottle: `${BASE}prop-gas-bottle-tall.glb`,
  tyreTruck: `${BASE}prop-tyre-truck.glb`,
  metalDoor: `${BASE}prop-metal-door.glb`,
  convertible: `${BASE}car-convertible-50s.glb`,
  prewarDonor: `${BASE}car-prewar-hotrod-donor.glb`,

  /* ── density pass (the wow round): the best remaining bytes-per-look in the
        105-file library — a real tool chest, a parts cart, a work light, air
        for the tyres, and the handful of hand tools a bench is dressed with ── */
  toolChest: `${BASE}prop-tool-chest-metal.glb`,
  storageCart: `${BASE}prop-storage-cart-industrial.glb`,
  toolboxMetal: `${BASE}prop-toolbox-metal.glb`,
  tirePump: `${BASE}prop-tire-pump.glb`,
  oilCan: `${BASE}prop-oil-can-small.glb`,
  barrelA: `${BASE}prop-barrel-rusted-a.glb`,
  barrelC: `${BASE}prop-barrel-rusted-c.glb`,
  drill: `${BASE}prop-drill.glb`,
  hammer: `${BASE}prop-hammer.glb`,
  pliers: `${BASE}prop-pliers.glb`,
  funnel: `${BASE}prop-funnel.glb`,
  propaneBottle: `${BASE}prop-gas-bottle-propane.glb`,

  /* ── busy pass (more of the library on the floor): a real bench vice for
        the fab wall, fuel cans and bare rubber for the corners — the small
        honest clutter that makes a bay read as mid-job ── */
  benchVice: `${BASE}prop-bench-vice.glb`,
  jerryCan: `${BASE}prop-jerry-can.glb`,
  gasTank: `${BASE}prop-gas-tank-yellow.glb`,
  wheelMag: `${BASE}prop-wheel-mag.glb`,
  tyreBare: `${BASE}prop-tyre-bare.glb`,

  /* ── detail pass (Matt: "more detail on the cars and the parts"): the
        heaviest photogrammetry pieces in the library, spent exactly where
        the orbits pass close — bench tops, walls beside arcs, hung light.
        These are the assets that read as REAL at half a metre. ── */
  pipesIndustrial: `${BASE}prop-pipes-industrial.glb`,
  lampCaged: `${BASE}prop-lamp-caged-hanging.glb`,
  powerBox: `${BASE}prop-power-box.glb`,
  metalJug: `${BASE}prop-metal-jug.glb`,
  lubricantSpray: `${BASE}prop-lubricant-spray.glb`,
  wrenchAdjustable: `${BASE}prop-wrench-adjustable.glb`,
  jerrycanGreen: `${BASE}prop-jerrycan-green.glb`,
  ammoBox: `${BASE}prop-ammo-box.glb`,
  stoolB: `${BASE}prop-stool-metal-b.glb`,
} as const;

/**
 * How a file wants to be finished.
 *
 *   paint — a car someone has finished: coloured base under a full clearcoat
 *   raw-metal — the fab-corner shell: worked steel, scuffed and reflective
 *   matte — a car nobody has finished: primer and rust, flat and thirsty
 *   prop  — everything else, graded to sit with the PBR set
 *
 * The paint/matte split does more for the room than any single lighting change:
 * a wet black coupe parked next to a dead-flat primer shell is instantly two
 * different objects, and the shop reads as a place where work is IN PROGRESS
 * rather than a showroom where every panel has the same finish.
 */
type Finish = "paint" | "raw-metal" | "matte" | "prop";

const PAINTED: ReadonlySet<string> = new Set<string>([
  M.challenger,
  M.coupeHoodUp,
  M.charger,
  M.camaro,
  M.pickup,
  M.convertible,
]);

const RAW_METAL: ReadonlySet<string> = new Set<string>([
  M.primerShell,
]);

const BARE: ReadonlySet<string> = new Set<string>([
  M.rustedShell,
  M.prewarDonor,
]);

function finishOf(url: string): Finish {
  if (PAINTED.has(url)) return "paint";
  if (RAW_METAL.has(url)) return "raw-metal";
  if (BARE.has(url)) return "matte";
  return "prop";
}

/* ── Decoders ───────────────────────────────────────────────────────────────
   MESHOPT, and nothing else. Geometry is decoded in wasm, roughly ten times
   cheaper than Draco — and decode cost lands inside a frame, which is the
   thing this whole pass exists to protect.

   KTX2/Basis was here and has been removed. GPU-native textures were the right
   answer on paper — a twentieth of the video memory, no main-thread decode —
   and they took the renderer process down with them: reproducibly, about a
   minute into every visit on the Radeon test machine, and never once with the
   same models as plain images. Eliminated a variable at a time (not the
   transcode target, not the worker count, not the mesh compression) the
   transcoder itself was what the driver could not survive. Textures ship as
   WebP on a per-slot size budget instead: most of the bytes saved, on a decode
   path twenty years old that cannot take a tab with it. */

/** Wire the loader's decoders. Idempotent; runs before any model loads. */
const RENDERER_PARSE_OWNERS = new WeakMap<THREE.WebGLRenderer, ParseGeneration>();

export function primeLoaders(gl: THREE.WebGLRenderer) {
  /* Nothing needs the live renderer any more. Kept as the one seam where a
     decoder that does would be wired in. */
  // Mount ownership is immutable. A stream notification can re-render an old
  // Canvas after its successor begins; remapping it would let late cleanup
  // invalidate the successor's generation.
  if (!RENDERER_PARSE_OWNERS.has(gl)) {
    RENDERER_PARSE_OWNERS.set(gl, parseScheduler.captureGeneration());
  }
}

/**
 * A GLTF loader that will not parse while the reader is moving.
 *
 * Everything else in the streaming path is paced — when a bay mounts, when it
 * compiles, when it is first drawn. The one thing that was not is the moment a
 * FILE ARRIVES: parsing a GLB is main-thread work, and it happens whenever the
 * network says so, which on a phone is squarely in the middle of a swipe. A
 * profile of the live site found exactly that — the longest frames sitting next
 * to `arrived car-muscle-challenger.glb`.
 *
 * Splitting the two halves fixes it for every model at once rather than for the
 * ones I happened to think of: the bytes are fetched the moment they are asked
 * for (network costs the main thread nothing), and the parse waits for the
 * reader to be still. It is the general form of the fix, so a model added next
 * year gets it for free.
 */
/* ── One parse at a time across every Canvas generation ───────────────────
   Waiting for stillness is not enough on its own. Half a dozen files land
   within a second of each other, every one of their loaders sees the same
   quiet moment, and they all start parsing in the same tick — six models'
   worth of main-thread work chained back to back, which a profile caught as a
   SIX-SECOND frame with the reader's finger on the glass.

   The queue makes it one at a time globally. A replacement Canvas cancels the
   active worker and inherits the same lane, so old/new generations can never
   decode concurrently or race the decoder mode. Each generation still owns
   bounded bay courtesies; continuous scroll cannot multiply them per model. */

const parseScheduler = createParseScheduler({
  waitForCourtesy: () => untilIdle(1200, true),
  yieldControl: () => wait(0),
  cancelActive: resetMeshoptParseGeneration,
});

function beginParseGeneration() {
  parseScheduler.beginGeneration();
}

function endParseGeneration(owner: ParseGeneration) {
  parseScheduler.endGeneration(owner);
}

function queueParse<T>(
  owner: ParseGeneration,
  url: string,
  run: (executionOwner: ParseGeneration) => Promise<T>,
): Promise<T> {
  return parseScheduler.enqueue(owner, parseCourtesyKey(url), run);
}

const ACTIVE_MODEL_DEMANDS = new Set<string>();
const MODEL_DEMAND_WAITERS = new Map<string, Set<() => void>>();

function resetModelDemands() {
  ACTIVE_MODEL_DEMANDS.clear();
}

function noteModelDemand(resource: string, owner: ParseGeneration | undefined) {
  if (!owner?.active || owner !== parseScheduler.captureGeneration()) return;
  if (ACTIVE_MODEL_DEMANDS.has(resource)) return;
  ACTIVE_MODEL_DEMANDS.add(resource);
  const waiters = MODEL_DEMAND_WAITERS.get(resource);
  if (!waiters) return;
  MODEL_DEMAND_WAITERS.delete(resource);
  for (const resolve of waiters) resolve();
}

function waitForModelDemand(resource: string) {
  if (ACTIVE_MODEL_DEMANDS.has(resource)) return Promise.resolve();
  return new Promise<void>((resolve) => {
    let waiters = MODEL_DEMAND_WAITERS.get(resource);
    if (!waiters) {
      waiters = new Set();
      MODEL_DEMAND_WAITERS.set(resource, waiters);
    }
    waiters.add(resolve);
  });
}

/* ── Asking for the compressed twin by name ─────────────────────────────────
   `scripts/precompress.js` builds a brotli `.glb.br` next to every model — the
   hero Charger goes 474 KB → 86 KB, the mobile shelf 9.8 MB → ~6 MB — and the
   host is configured to serve it with `Content-Encoding: br`, which a browser
   decodes transparently on the way in. The `.htaccess` rewrite that was meant
   to make that swap invisible does not fire here: the twin is directly
   fetchable and correctly labelled, but the plain URL still returns the full
   file. Rather than keep guessing at another host's mod_rewrite, the loader
   asks for the twin by name.

   The byte promise is separate from the parsed R3F resource. That lets the
   long approach corridor fill the browser/network cache without parsing glTF
   on the visible film's main thread. A later loader consumes the exact same
   ArrayBuffer promise, so there is no duplicate transfer. */
const MODEL_BYTE_CACHE = new Map<string, Promise<ArrayBuffer>>();
const PREFETCH_CONCURRENCY = 2;
const modelTransport = createRequestPool(PREFETCH_CONCURRENCY);
const MODEL_PREFETCH_QUEUE_TIMEOUT_MS = 45_000;
const MODEL_REQUEST_TIMEOUT_MS = 8_000;
const MODEL_REQUEST_HARD_TIMEOUT_MS = 45_000;
const MODEL_REQUEST_TOTAL_TIMEOUT_MS = 60_000;
const MODEL_REQUEST_BR_BUDGET_MS = 30_000;
const MODEL_REQUEST_RETRY_DELAY_MS = 160;
const MODEL_PACKET_TIMEOUT_MS = 8_000;
let modelPacketStore: ReturnType<typeof createModelPacketStore> | null = null;
const MODEL_RESOURCE_ATTEMPTS = 2;
const MODEL_RESOURCE_RETRY_DELAY_MS = 600;
const MODEL_PARSE_TIMEOUT_MS = 15_000;
const PROGRAM_COMPILE_PATIENCE_MS = 15_000;
const SHELL_FINALIZER_ATTEMPTS = 3;
const SHELL_FINALIZER_RETRY_DELAY_MS = 400;

type ModelByteOptions = {
  manager?: THREE.LoadingManager;
  requestHeader?: Record<string, string>;
  path?: string;
  withCredentials?: boolean;
  onProgress?: (event: ProgressEvent) => void;
  demanded?: boolean;
};

function getModelPacketStore() {
  if (modelPacketStore) return modelPacketStore;
  const packets: ModelPacketResource[] = [];
  // Only the exact versioned shelf may use this manifest. Source/dev and
  // mismatched deployments retain their existing independent-file path.
  if (VERSION && packetManifest.format === 1 && packetManifest.modelsVersion === VERSION.slice(1)) {
    for (const [shelf, modelBase] of [[packetManifest.shelves.full, BASE], [packetManifest.shelves.lite, MOBILE_BASE]] as const) {
      for (const item of shelf) {
        if ("entries" in item && item.entries) packets.push({
          url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/model-packets/${item.file}`,
          modelBase, decodedLength: item.decodedLength, entries: item.entries,
        });
      }
    }
  }
  modelPacketStore = createModelPacketStore({
    packets, pool: modelTransport, queueTimeoutMs: MODEL_PREFETCH_QUEUE_TIMEOUT_MS,
    loadPacket: (url) => {
      const file = new THREE.FileLoader();
      file.setResponseType("arraybuffer");
      // One bounded packet attempt, then the unchanged individual retry path.
      // The store owns the pool slot; do not nest another pool request here.
      return loadModelRequestAttempt({
        target: url,
        start: ({ onLoad, onProgress, onError }) => { file.load(url, onLoad, onProgress, onError); },
        abort: () => { file.abort(); },
        idleTimeoutMs: MODEL_PACKET_TIMEOUT_MS, hardTimeoutMs: MODEL_PACKET_TIMEOUT_MS,
      });
    },
    loadIndividual: (url, demanded) => fetchIndividualModelBytes(url, { demanded }),
  });
  return modelPacketStore;
}

function modelByteCacheKey(url: string, options: ModelByteOptions = {}) {
  const headers = Object.entries(options.requestHeader ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${name}:${value}`)
    .join("\n");
  return `${options.path ?? ""}|${url}|${options.withCredentials ? 1 : 0}|${headers}`;
}

function releaseModelBytes(
  url: string,
  options: ModelByteOptions,
  owner: Promise<ArrayBuffer>,
) {
  const key = modelByteCacheKey(url, options);
  if (MODEL_BYTE_CACHE.get(key) === owner) MODEL_BYTE_CACHE.delete(key);
  modelPacketStore?.release(url, owner);
}

function fetchModelBytes(url: string, options: ModelByteOptions = {}) {
  const key = modelByteCacheKey(url, options);
  const cached = MODEL_BYTE_CACHE.get(key);
  if (cached) {
    // A mounted useLoader consumer owns the foreground lane. If its bytes are
    // still parked behind speculative route work, move that exact promise to
    // the front without aborting any active CDN response.
    if (options.demanded) modelTransport.demand(cached);
    if (options.demanded) modelPacketStore?.demand(cached);
    return cached;
  }

  // Register the promise before transport begins. Preload and mounted loaders
  // therefore share one exact ArrayBuffer owner, while the pool is the single
  // authority that admits at most two cellular/CDN requests at once.
  const eligible = !options.path && !options.withCredentials &&
    Object.keys(options.requestHeader ?? {}).length === 0 &&
    (!options.manager || options.manager === THREE.DefaultLoadingManager);
  const request = (eligible ? getModelPacketStore().request(url, options.demanded) : undefined)
    ?? fetchIndividualModelBytes(url, options);
  MODEL_BYTE_CACHE.set(key, request);
  void request.catch(() => {
    if (MODEL_BYTE_CACHE.get(key) === request) MODEL_BYTE_CACHE.delete(key);
    modelPacketStore?.release(url, request);
  });
  return request;
}

function fetchIndividualModelBytes(url: string, options: ModelByteOptions = {}) {
  const path = options.path ?? "";
  return modelTransport.run(async () => {
    const deadline = Date.now() + MODEL_REQUEST_TOTAL_TIMEOUT_MS;
    const totalTimeout = (target: string) => {
      const error = new Error(`Timed out loading ${target} within the total request budget`);
      error.name = "ModelRequestTimeoutError";
      return error;
    };
    const remainingBudget = (attemptDeadline = deadline) =>
      Math.min(deadline, attemptDeadline) - Date.now();

    const loadAttempt = (target: string, attemptDeadline = deadline) => {
      const remaining = remainingBudget(attemptDeadline);
      if (remaining <= 0) return Promise.reject<ArrayBuffer>(totalTimeout(target));
      // FileLoader owns an AbortController, so every retry needs a fresh loader.
      const file = new THREE.FileLoader(options.manager);
      file.setResponseType("arraybuffer");
      file.setRequestHeader(options.requestHeader ?? {});
      file.setPath(path);
      file.setWithCredentials(options.withCredentials ?? false);
      return loadModelRequestAttempt({
        target,
        start: ({ onLoad, onProgress, onError }) => {
          file.load(target, onLoad, onProgress, onError);
        },
        abort: () => {
          file.abort();
        },
        onProgress: options.onProgress,
        idleTimeoutMs: MODEL_REQUEST_TIMEOUT_MS,
        hardTimeoutMs: Math.max(1, Math.min(MODEL_REQUEST_HARD_TIMEOUT_MS, remaining)),
      });
    };

    const retry = async (target: string, attempts: number, attemptDeadline = deadline) => {
      let lastError: unknown;
      for (let attempt = 0; attempt < attempts; attempt++) {
        try {
          return await loadAttempt(target, attemptDeadline);
        } catch (error) {
          lastError = error;
          const remaining = remainingBudget(attemptDeadline);
          if (attempt + 1 < attempts && remaining > 0) {
            await new Promise<void>((resolve) =>
              globalThis.setTimeout(
                resolve,
                Math.min(MODEL_REQUEST_RETRY_DELAY_MS, remaining),
              ),
            );
          }
        }
      }
      if (remainingBudget(attemptDeadline) <= 0) throw totalTimeout(target);
      throw lastError ?? new Error(`Unable to load model bytes for ${target}`);
    };

    if (url.endsWith(".glb") && VERSION) {
      // Reserve half the total budget for the exact plain asset. A stalled
      // Brotli edge can never consume the fallback's entire opportunity.
      const brDeadline = Math.min(deadline, Date.now() + MODEL_REQUEST_BR_BUDGET_MS);
      try {
        return await retry(`${url}.br`, 2, brDeadline);
      } catch {
        // A persistently missing twin affects this URL only. Never poison
        // compressed delivery for the rest of the session.
      }
    }
    // The exact plain twin also gets one recovery attempt on a dead edge.
    return retry(url, 2);
  }, {
    demanded: options.demanded ?? false,
    queueTimeoutMs: options.demanded ? undefined : MODEL_PREFETCH_QUEUE_TIMEOUT_MS,
  });

}

function prefetchModelBytes(url: string) {
  return fetchModelBytes(url).then(() => undefined);
}

class IdleGLTFLoader extends GLTFLoader {
  load(
    url: string,
    onLoad: (gltf: GLTF) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void,
  ) {
    const options: ModelByteOptions = {
      manager: this.manager,
      requestHeader: this.requestHeader,
      path: this.path,
      withCredentials: this.withCredentials,
      onProgress,
      demanded: true,
    };
    // Match GLTFLoader's manager contract even when the network bytes came
    // from our early cache. Route parking closes the current manager cycle;
    // a revisit opens a fresh one rather than leaving global progress hung.
    let managerActive = false;
    const startManagerItem = () => {
      if (managerActive) return;
      managerActive = true;
      this.manager.itemStart(url);
    };
    const endManagerItem = () => {
      if (!managerActive) return;
      managerActive = false;
      this.manager.itemEnd(url);
    };
    const waitForLiveModelDemand = async () => {
      while (true) {
        while (!parseScheduler.captureGeneration().active) {
          endManagerItem();
          await parseScheduler.waitForActiveGeneration();
        }
        if (!ACTIVE_MODEL_DEMANDS.has(url)) {
          endManagerItem();
          await waitForModelDemand(url);
          continue;
        }
        startManagerItem();
        return;
      }
    };
    startManagerItem();
    let settled = false;
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      if (onError) onError(error);
      else console.error(error);
      if (managerActive) this.manager.itemError(url);
      endManagerItem();
    };
    void runModelResourceAttempts({
      attempts: MODEL_RESOURCE_ATTEMPTS,
      retryDelayMs: MODEL_RESOURCE_RETRY_DELAY_MS,
      run: async () => {
        // A route-away drains queued CPU work and waits without retaining its
        // model buffers. A revisit reuses the browser's exact-byte HTTP cache
        // and joins the newly active Canvas without poisoning useLoader.
        while (true) {
          await waitForLiveModelDemand();
          const byteRequest = fetchModelBytes(url, options);
          try {
            const data = await byteRequest;
            const parseOwner = parseScheduler.captureGeneration();
            if (!parseOwner.active || !ACTIVE_MODEL_DEMANDS.has(url)) continue;
            // `useLoader` owns a global URL cache. If the Canvas changed while
            // bytes were in flight, release this reference and re-enter only
            // through the replacement renderer's exact-tier demand gate.
            const parseOnce = (decoder: CancellableMeshoptDecoder | typeof MeshoptDecoder) =>
              new Promise<GLTF>((resolve, reject) => {
                const started = DEBUG ? performance.now() : 0;
                // R3F memoizes one loader instance for every URL. A dedicated
                // parser per attempt prevents a fallback from mutating decoder
                // state underneath another cached resource.
                const parser = new GLTFLoader(this.manager);
                parser.setCrossOrigin(this.crossOrigin);
                parser.setRequestHeader(this.requestHeader);
                parser.setWithCredentials(this.withCredentials);
                parser.setMeshoptDecoder(decoder as typeof MeshoptDecoder);
                parser.parse(
                  data,
                  this.resourcePath || this.path || "",
                  (gltf) => {
                    if (DEBUG) {
                      const ms = Math.round(performance.now() - started);
                      if (ms > 30) console.log(`[shop] parse ${url.split("/").pop()} ${ms} ms`);
                    }
                    resolve(gltf);
                  },
                  reject,
                );
              });
            try {
              // Bytes are here. The expensive half waits its turn in the queue
              // for stillness and every earlier model to finish.
              return await queueParse(
                parseOwner,
                url,
                async (executionOwner) => {
                  if (!meshoptWorkersEnabled) {
                    try {
                      return await parseOnce(MeshoptDecoder);
                    } catch (error) {
                      if (!executionOwner.active) throw new ParseGenerationCancelledError();
                      throw error;
                    }
                  }
                  try {
                    // The decoder owns the timeout so it can finish this exact
                    // GLTF parser locally instead of launching a duplicate.
                    return await parseOnce(activeMeshoptWorkerDecoder());
                  } catch {
                    if (!executionOwner.active) throw new ParseGenerationCancelledError();
                    disableMeshoptWorkers();
                    // The worker parser settled. A clean exact-byte local parse
                    // is now safe and cannot overlap the abandoned attempt.
                    try {
                      return await parseOnce(MeshoptDecoder);
                    } catch (localError) {
                      if (!executionOwner.active) throw new ParseGenerationCancelledError();
                      throw localError;
                    }
                  }
                },
              );
            } catch (error) {
              if (error instanceof ParseGenerationCancelledError) continue;
              throw error;
            }
          } finally {
            releaseModelBytes(url, options, byteRequest);
          }
        }
      },
    }).then(
      (gltf) => {
        if (settled) return;
        reportOpeningModelParsed(url);
        settled = true;
        onLoad(gltf);
        endManagerItem();
      },
      fail,
    );
  }
}

const MESHOPT_WORKER_COUNT = 2;
let meshoptWorkerController: MeshoptWorkerController | null = null;
let meshoptWorkersConfigured = false;
let meshoptWorkersEnabled = false;
let meshoptWorkerFallbackLatched = false;

function activeMeshoptWorkerDecoder() {
  if (!meshoptWorkerController) {
    meshoptWorkerController = createMeshoptWorkerDecoder({
      count: MESHOPT_WORKER_COUNT,
      decodeTimeoutMs: MODEL_PARSE_TIMEOUT_MS,
      onFallback: () => {
        // The controller has already moved every outstanding request onto the
        // exact local decoder inside the same GLTF parser. Only latch future
        // parses here; cancelling it would abort the recovery we just began.
        meshoptWorkersEnabled = false;
        meshoptWorkerFallbackLatched = true;
      },
    });
  }
  return meshoptWorkerController.decoder;
}

function enableMeshoptWorkers() {
  if (meshoptWorkersConfigured || typeof window === "undefined") return;
  meshoptWorkersConfigured = true;
  if (
    meshoptWorkerFallbackLatched ||
    typeof Worker === "undefined" ||
    !MeshoptDecoder.supported
  ) return;
  try {
    activeMeshoptWorkerDecoder();
    meshoptWorkersEnabled = true;
  } catch {
    // A restrictive worker-src policy or older WebKit keeps the exact
    // single-thread decoder path. Geometry bytes and decoded output match.
    disableMeshoptWorkers();
  }
}

function disableMeshoptWorkers() {
  meshoptWorkersEnabled = false;
  meshoptWorkerFallbackLatched = true;
  meshoptWorkerController?.cancel(new Error("Meshopt worker parse cancelled for exact local fallback"));
  meshoptWorkerController = null;
}

function resetMeshoptParseGeneration() {
  meshoptWorkersEnabled = false;
  meshoptWorkersConfigured = false;
  meshoptWorkerController?.cancel(new Error("Meshopt worker parse superseded by a new Canvas"));
  meshoptWorkerController = null;
}

function extendLoader() {
  enableMeshoptWorkers();
}
/* ── The stream ─────────────────────────────────────────────────────────────
   Stations mount in order, never more than one new bay in flight, and each one
   only opens the gate for the next once it is fully warm. That single rule is
   what keeps the network, the GLB parse, the texture transcode and — above all
   — the shader link out of the frames the reader is scrolling through.

   Plain module state with a subscription rather than context: a station
   unlocking must re-render exactly one component, not the scene graph. */

const STATION_COUNT = 7;
const STATION_READY_FAILSAFE_MS = 30_000;
/** Only the establishing bay owns the critical opening lane. */
const OPENING = 1;

let unlocked = OPENING;
const streamListeners = new Set<() => void>();

function subscribeStream(listener: () => void) {
  streamListeners.add(listener);
  return () => {
    streamListeners.delete(listener);
  };
}

function openGate(next: number) {
  if (next <= unlocked || unlocked >= STATION_COUNT) return;
  unlocked = Math.min(next, STATION_COUNT);
  for (const listener of streamListeners) listener();
}

/* The photographic doorway is a safety layer for the OPENING bay only.
   Later stations still compile in order and the camera will not enter a cold
   bay, but holding the veil until all seven stops are first-used made the
   shop look late while the rest of the page was already there. Same models,
   same shaders, same first-use proof — the door just rolls up when the room
   you can actually see is real. */
const WARM_KEYS = [
  "shell",
  ...Array.from({ length: STATION_COUNT }, (_, i) => String(i)),
  "5-gallery",
];
/* Building + station zero. Downstream bays keep streaming; the rail clamps
   to highestContiguousWarmStation so a fast walk never lands in empty space. */
const REVEAL_WARM_KEYS = ["shell", "0"];
const PENDING = new Set<string>(WARM_KEYS);
const REVEAL_PENDING = new Set<string>(REVEAL_WARM_KEYS);
const WARMED = new Set<string>();
let contiguousWarmStation = -1;
let worldFinalizer: (() => Promise<void>) | null = null;
let finalizedWorld: (() => Promise<void>) | null = null;
let revealFinalizing: Promise<void> | null = null;
let revealRetryTimer = 0;
let revealAttempts = 0;
/* Renderer-owned async work must never cross a Canvas lifecycle. A route
   revisit creates a new WebGL context while loader bytes intentionally stay
   cached; this generation distinguishes those two kinds of ownership. */
let loaderGeneration = 0;

/**
 * Reset renderer-owned progress before a new Canvas is created.
 *
 * The loader cache intentionally survives — identical GLTF bytes should be a
 * cache hit on a revisit. These flags describe React/GPU work for one WebGL
 * context, however, and inheriting them made every bay mount together while a
 * brand-new Safari/Edge renderer was still blank.
 */
export function beginLoaderStream() {
  loaderGeneration += 1;
  resetModelRecoveries();
  // Demand belongs to the exact tier and renderer generation about to mount.
  // Parked full/lite promises resume only if this Canvas asks for their URL.
  resetModelDemands();
  // Do not put a new renderer behind promises queued by a Canvas that no
  // longer exists. In-flight old work observes the generation and restores
  // its visibility snapshot before exiting at its next async boundary.
  warmQueue = Promise.resolve();
  beginParseGeneration();
  // A shared useLoader promise may already be waiting from the prior Canvas,
  // so configure its replacement pool before active-generation waiters resume.
  enableMeshoptWorkers();
  unlocked = OPENING;
  PENDING.clear();
  for (const key of WARM_KEYS) PENDING.add(key);
  REVEAL_PENDING.clear();
  for (const key of REVEAL_WARM_KEYS) REVEAL_PENDING.add(key);
  WARMED.clear();
  seededProgressGeneration = -1;
  contiguousWarmStation = -1;
  worldFinalizer = null;
  finalizedWorld = null;
  revealFinalizing = null;
  revealAttempts = 0;
  if (revealRetryTimer) window.clearTimeout(revealRetryTimer);
  revealRetryTimer = 0;
  worldParked = true;
  restoreComposerOvens();
  for (const listener of streamListeners) listener();
}

/** The furthest station the camera can enter without aiming at an empty bay. */
export function highestContiguousWarmStation() {
  return contiguousWarmStation;
}

function revealWorldIfReady() {
  if (
    finalizedWorld === worldFinalizer &&
    worldFinalizer &&
    REVEAL_PENDING.size === 0 &&
    !revealFinalizing
  ) {
    const finalizer = worldFinalizer;
    const generation = loaderGeneration;
    revealAttempts += 1;
    // The shell proof happened before the streamed bays existed. Submit two
    // fresh full-composer frames now that the complete initial camera view is
    // populated, then hand the frontbuffer to the doorway dissolve.
    revealFinalizing = (async () => {
      let revealed = false;
      try {
        await finalizer();
        if (
          generation === loaderGeneration &&
          finalizedWorld === finalizer &&
          worldFinalizer === finalizer &&
          REVEAL_PENDING.size === 0
        ) {
          markWorldReady();
          revealed = true;
        }
      } catch (error) {
        if (DEBUG && generation === loaderGeneration) {
          console.warn("[shop] final route frame failed; retaining doorway", error);
        }
      } finally {
        if (generation === loaderGeneration) {
          revealFinalizing = null;
          if (
            !revealed &&
            revealAttempts < 3 &&
            finalizedWorld === finalizer &&
            worldFinalizer === finalizer &&
            REVEAL_PENDING.size === 0
          ) {
            revealRetryTimer = window.setTimeout(() => {
              revealRetryTimer = 0;
              revealWorldIfReady();
            }, 400 * revealAttempts);
          }
        }
      }
    })();
  }
}

function setWorldFinalizer(finalizer: (() => Promise<void>) | null) {
  worldFinalizer = finalizer;
}

function reportWarm(key: string) {
  if (PENDING.delete(key)) {
    WARMED.add(key);
    while (
      contiguousWarmStation + 1 < STATION_COUNT &&
      WARMED.has(String(contiguousWarmStation + 1)) &&
      (contiguousWarmStation + 1 !== 5 || WARMED.has("5-gallery"))
    ) {
      contiguousWarmStation += 1;
    }
    REVEAL_PENDING.delete(key);
    reportBootProgress(0.75 + 0.25 * ((WARM_KEYS.length - PENDING.size) / WARM_KEYS.length));
    revealWorldIfReady();
    // Keep the postage-stamp compositor oven for the later bays. They can
    // still first-use the exact HDR target cheaply while the world is parked.
    if (PENDING.size === 0) restoreComposerOvens();
  }
}

/* A background prefetch of the remaining bays lived here and has been removed
   on purpose. It raced the loader's own request for the same file: two
   in-flight requests for one URL, one of them cancelled, and the loser reading
   a truncated entry back out of the HTTP cache — which is how a perfectly
   valid `prop-bench-vice.glb` started failing to parse in production and
   nowhere else. The whole model set is 16 MB now; the bays can fetch their own
   files when their turn comes. */

/**
 * The stream opens only after the opening room is genuinely ready.
 *
 * This used to clear `PENDING` and call `markWorldReady()` on a module-scope
 * 15-second timer. The timer started when this chunk was imported, not when
 * the renderer mounted; on a slower GPU it could therefore lift the doorway
 * photograph while the shell was still compiling and every bay was hidden.
 * The photograph now waits for the shell, station zero, and a verified
 * full-composer frame. Later bays still compile and first-use every object
 * before the camera may enter them. There is still no time-based path to
 * `ready`.
 */
/* ── Load, grade, measure ───────────────────────────────────────────────── */

/* ── One program for the whole shop ─────────────────────────────────────────
   three compiles a separate shader for every distinct COMBINATION of features
   a material uses: a prop with a normal map and a prop without one are two
   programs, and on Windows each one is an HLSL translation that measured
   ~100 ms on the test machine. Thirty-five props dressed by four different
   artists produced thirty-five programs for what is, visually, one material.

   So every prop is given the full set of slots whether its author supplied
   them or not, filled with textures that change nothing: white multiplies to
   the same colour, flat blue is a normal pointing straight out. Identical
   feature set, identical program — one compile for the whole shop instead of
   one per file, and the pixels are bit-identical to what the author shipped. */

function neutral(r: number, g: number, b: number) {
  const texture = new THREE.DataTexture(new Uint8Array([r, g, b, 255]), 1, 1);
  texture.needsUpdate = true;
  return texture;
}

/** White: multiplies colour, roughness and metalness by exactly 1. */
const FILL_WHITE = neutral(255, 255, 255);
/** The normal that points straight out of the surface. */
const FILL_NORMAL = neutral(128, 128, 255);

function unify(material: THREE.MeshStandardMaterial) {
  let changed = false;
  if (!material.map) {
    material.map = FILL_WHITE;
    changed = true;
  }
  if (!material.normalMap) {
    material.normalMap = FILL_NORMAL;
    changed = true;
  }
  if (!material.roughnessMap) {
    material.roughnessMap = FILL_WHITE;
    changed = true;
  }
  if (!material.metalnessMap) {
    material.metalnessMap = FILL_WHITE;
    changed = true;
  }
  // Drei clones share source materials. Re-invalidating an already-unified
  // material increments its Three version and makes another bay throw away a
  // program the prior bay just compiled. Only feature-slot changes need a new
  // program; a no-op traversal must remain a no-op at the driver boundary.
  if (changed) material.needsUpdate = true;
}

/**
 * A tiny, shared roughness field for unfinished steel. The shell source has no
 * texture coordinates, so `ensureRawSteelUVs` supplies box-projected UVs after
 * its normals are softened. Long directional passes and a few harder scuffs
 * break the otherwise uniform grey response without another request, mesh, or
 * draw call. The pattern is deterministic, so it never crawls or shimmers.
 */
function rawSteelRoughness() {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const brushed = Math.sin(y * 1.73 + Math.sin(x * 0.31) * 1.8) * 17;
      const broad = Math.sin(x * 0.34 + y * 0.08) * 11;
      const scratch = (x * 17 + y * 29) % 47 === 0 ? -38 : 0;
      const value = THREE.MathUtils.clamp(Math.round(208 + brushed + broad + scratch), 142, 244);
      const offset = (y * size + x) * 4;
      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;
      data[offset + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.name = "2240 raw-steel micro-roughness";
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3.5, 11);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const RAW_STEEL_ROUGHNESS = rawSteelRoughness();

function ensureRawSteelUVs(geometry: THREE.BufferGeometry) {
  if (geometry.getAttribute("uv")) return;
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  if (!position || !normal) return;

  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) return;
  const span = box.getSize(new THREE.Vector3());
  span.set(Math.max(span.x, 1e-5), Math.max(span.y, 1e-5), Math.max(span.z, 1e-5));
  const uv = new Float32Array(position.count * 2);

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const nx = Math.abs(normal.getX(i));
    const ny = Math.abs(normal.getY(i));
    const nz = Math.abs(normal.getZ(i));
    if (ny >= nx && ny >= nz) {
      uv[i * 2] = (x - box.min.x) / span.x;
      uv[i * 2 + 1] = (z - box.min.z) / span.z;
    } else if (nx >= nz) {
      uv[i * 2] = (z - box.min.z) / span.z;
      uv[i * 2 + 1] = (y - box.min.y) / span.y;
    } else {
      uv[i * 2] = (x - box.min.x) / span.x;
      uv[i * 2 + 1] = (y - box.min.y) / span.y;
    }
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

/**
 * The same treatment for the hand-built building.
 *
 * The shell is a hundred-odd primitives with inline materials — a colour here,
 * a roughness there — and each unique combination of slots was its own program
 * and its own ~150 ms of Direct3D translation. Handing them all the same four
 * neutral maps makes them one program without moving a pixel. Custom shader
 * materials (the reflector floor, the fog, the neon glows) are left alone:
 * their programs are hand-written and unifying them would break them.
 */
export function unifyTree(node: THREE.Object3D) {
  const combos = new Map<string, number>();
  const unified = new Set<THREE.MeshStandardMaterial>();
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const entry of list) {
      const material = entry as THREE.MeshStandardMaterial;
      const type = material?.type;
      if (type !== "MeshStandardMaterial" && type !== "MeshPhysicalMaterial") continue;
      if (!unified.has(material)) {
        unified.add(material);
        unify(material);
      }
      if (DEBUG) {
        const geometry = mesh.geometry;
        const combo = [
          type,
          `side${material.side}`,
          material.transparent ? "transparent" : "",
          material.alphaTest ? "alphaTest" : "",
          material.depthWrite ? "" : "noDepth",
          material.vertexColors ? "vcol" : "",
          material.toneMapped ? "" : "raw",
          material.emissive && material.emissive.getHex() !== 0 ? "emissive" : "",
          material.flatShading ? "flat" : "",
          geometry?.getAttribute?.("tangent") ? "tangent" : "",
          geometry?.getAttribute?.("uv1") ? "uv1" : "",
          (mesh as unknown as THREE.InstancedMesh).isInstancedMesh ? "instanced" : "",
        ]
          .filter(Boolean)
          .join("|");
        combos.set(combo, (combos.get(combo) ?? 0) + 1);
      }
    }
  });
  if (DEBUG && combos.size) {
    console.log(`[shop] material combos (${combos.size}):`);
    for (const [combo, n] of [...combos].sort((a, b) => b[1] - a[1])) {
      console.log(`   x${n}  ${combo}`);
    }
  }
}

const GRADED = new WeakSet<THREE.Object3D>();
/** old geometry → its re-creased replacement, or itself if it was left alone. */
const SMOOTHED = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
const GREY = new THREE.Color();

/**
 * Pull a flat authored colour toward the room. The darkening is weighted by
 * luminance, so a white toy body loses most of its brightness while a dark
 * tyre keeps its value — a flat multiply would crush the darks and leave the
 * whites still shouting.
 */
function tame(color: THREE.Color, darken: number, desaturate: number) {
  const luma = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
  GREY.setScalar(luma);
  color.lerp(GREY, desaturate);
  color.multiplyScalar(
    THREE.MathUtils.lerp(1, darken, THREE.MathUtils.clamp(luma, 0, 1)),
  );
}

function lumaOf(color: THREE.Color) {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
}

/* Vertices above this get left alone: photogrammetry props already ship correct
   smoothing, and re-deriving normals for a 200k-triangle tyre on the main
   thread would cost more than every other fix in this file put together. */
const CREASE_BUDGET = 80_000;

/**
 * SMOOTH THE FACETS.
 *
 * The stylized vehicles are the loudest defect in the whole scene: a Camaro
 * roof arrives as a fan of hard triangles because the exporter wrote one normal
 * per FACE. `computeVertexNormals` on its own would not fix it — a non-indexed
 * GLB has no shared vertices to average across — and welding everything would
 * go too far the other way and round off the windscreen frame and the panel
 * gaps along with the roof.
 *
 * `toCreasedNormals` is the right tool: average normals across any edge under
 * the crease angle, keep them hard above it. At 55° a roof, a bonnet and a
 * wheel arch go smooth while door shuts, glass frames and body lines stay as
 * crisp as the model author drew them.
 */
function smooth(mesh: THREE.Mesh, creaseAngle: number) {
  const geometry = mesh.geometry;
  if (!geometry?.isBufferGeometry) return;
  if (typeof window !== "undefined" && window.location.search.includes("nosmooth")) return;

  // Geometries are shared between meshes inside a file. Resolve through the
  // map rather than recomputing — and never dispose one that a sibling mesh is
  // still pointing at.
  const done = SMOOTHED.get(geometry);
  if (done) {
    mesh.geometry = done;
    return;
  }

  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  if (
    !position ||
    position.count > CREASE_BUDGET ||
    (geometry.morphAttributes && Object.keys(geometry.morphAttributes).length > 0) ||
    geometry.getAttribute("skinIndex") ||
    (normal && !isFlatShaded(geometry))
  ) {
    SMOOTHED.set(geometry, geometry);
    return;
  }

  try {
    const creased = toCreasedNormals(geometry, creaseAngle);
    SMOOTHED.set(geometry, creased);
    SMOOTHED.set(creased, creased);
    mesh.geometry = creased;
    geometry.dispose();
  } catch {
    // A malformed attribute set is not worth taking the scene down for.
    geometry.computeVertexNormals();
    SMOOTHED.set(geometry, geometry);
  }
}

/**
 * Does this geometry carry one normal per FACE?
 *
 * Sampled, not exhaustive — a couple of hundred triangles is plenty to tell a
 * faceted low-poly export from a properly smoothed one, and it keeps the check
 * off the critical path for the big props.
 */
function isFlatShaded(geometry: THREE.BufferGeometry) {
  const normal = geometry.getAttribute("normal");
  if (!normal) return true;
  const index = geometry.getIndex();
  const triangles = (index ? index.count : normal.count) / 3;
  if (triangles < 1) return false;

  const step = Math.max(1, Math.floor(triangles / 200));
  let sampled = 0;
  let flat = 0;

  for (let t = 0; t < triangles; t += step) {
    const a = index ? index.getX(t * 3) : t * 3;
    const b = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const c = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    sampled++;
    const same =
      Math.abs(normal.getX(a) - normal.getX(b)) < 1e-4 &&
      Math.abs(normal.getY(a) - normal.getY(b)) < 1e-4 &&
      Math.abs(normal.getZ(a) - normal.getZ(b)) < 1e-4 &&
      Math.abs(normal.getX(a) - normal.getX(c)) < 1e-4 &&
      Math.abs(normal.getY(a) - normal.getY(c)) < 1e-4 &&
      Math.abs(normal.getZ(a) - normal.getZ(c)) < 1e-4;
    if (same) flat++;
  }

  // A cube is legitimately all-flat and re-creasing it changes nothing, so the
  // bar is set where a curved surface would start losing the argument.
  return sampled > 0 && flat / sampled > 0.7;
}

/**
 * One pass over a freshly loaded file, applied to the SOURCE geometry and
 * materials so every clone inherits it for free.
 *
 * The honest problem flagged by whoever sourced these: the cars are stylized
 * flat-shaded low-poly and the best props are photogrammetry-grade PBR. The old
 * answer was to hide the difference — darken everything, roughen everything,
 * let silhouette carry the frame. That is why the shop read as flat and toy-
 * like: EVERY surface in it had the same matte response.
 *
 * The answer now is to differentiate instead. Bodywork becomes real car paint —
 * `MeshPhysicalMaterial` with a full clearcoat over a coloured base, which is
 * the actual physical difference between a painted panel and a plastic one.
 * Rubber goes near-black and dead matte. Bright trim keeps its bite. The props
 * are left alone because they were always right.
 */
function grade(scene: THREE.Object3D, finish: Finish) {
  if (GRADED.has(scene)) return;
  GRADED.add(scene);

  const isVehicle = finish !== "prop";
  const rawMetal = finish === "raw-metal";

  // One physical material per source material, so a body panel shared by nine
  // meshes still compiles one program and issues one uniform upload.
  const swapped = new Map<THREE.Material, THREE.Material>();

  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const rebuilt: THREE.Material[] = [];
    let replaced = false;

    for (const entry of list) {
      const material = entry as THREE.MeshStandardMaterial;
      if (!material?.isMeshStandardMaterial) {
        rebuilt.push(entry);
        continue;
      }

      // Flat shading is a per-material override that beats any normals we
      // compute below, so it has to go first and it has to go everywhere.
      material.flatShading = false;

      if (!isVehicle) {
        if (material.map) {
          // Photogrammetry props already carry their own values.
          material.envMapIntensity = 1.05;
        } else {
          // Flat-colour dressing. Left alone, a rack of primary-colour barrels
          // reads as a toy shelf next to the PBR set.
          tame(material.color, 0.52, 0.38);
          material.roughness = THREE.MathUtils.clamp(material.roughness, 0.45, 0.85);
          material.metalness = Math.min(material.metalness, 0.35);
          material.envMapIntensity = 0.85;
        }
        unify(material);
        rebuilt.push(material);
        continue;
      }

      /* ── vehicles ── */
      const cached = swapped.get(material);
      if (cached) {
        rebuilt.push(cached);
        replaced = true;
        continue;
      }

      const luma = lumaOf(material.color);
      const name = material.name.toLowerCase();
      const isGlass =
        material.transparent ||
        material.opacity < 1 ||
        /glass|window|windscreen|windshield|screen/.test(name);
      /* The raw shell source contains one material for the entire body and its
         author named that slot `Tire_Rubber`. Trusting the name turned every
         panel into dead-black rubber. Raw-metal ownership is file-level and
         therefore outranks that malformed material label. */
      const isRubber = !rawMetal && (luma < 0.045 || /tyre|tire|rubber|wheel/.test(name));

      if (isGlass) {
        // Dark, hard, reflective. Glass is the one place a low-poly car gets a
        // mirror for free, and it is what makes a windscreen read as glazed.
        material.color.setRGB(0.03, 0.033, 0.04);
        material.roughness = 0.08;
        material.metalness = 0.2;
        material.envMapIntensity = 1.5;
        unify(material);
        rebuilt.push(material);
        continue;
      }

      if (isRubber) {
        material.color.setRGB(0.018, 0.019, 0.022);
        material.roughness = 0.94;
        material.metalness = 0;
        material.envMapIntensity = 0.35;
        unify(material);
        rebuilt.push(material);
        continue;
      }

      /* Bright, near-neutral surfaces are trim: bumpers, grilles, mirrors,
         exhaust tips. Those are chrome, not paint.

         Brightness alone misses the ones that say so in their name. The
         Charger's trim slot is called `Metalic` and sits at 0.43 luma — well
         under the 0.62 threshold — so a chrome bumper was being coloured,
         clear-coated and lit like a wing. The name test catches those; the luma
         test still catches the many slots whose names say nothing at all
         (`Details 2`, `back_plate`, `mat15`). Both are gated on low saturation,
         because a strongly coloured surface is paint whatever it is called. */
      const CHROME_NAME = /chrome|metal|steel|alum|bumper|grille|grill|exhaust|mirror|trim/;
      const hsl = material.color.getHSL({ h: 0, s: 0, l: 0 });
      const chromeish =
        finish === "paint" &&
        ((luma > 0.62 && hsl.s < 0.14) || (CHROME_NAME.test(name) && hsl.s < 0.25));
      const bare = finish === "matte";

      const paint = new THREE.MeshPhysicalMaterial({
        name: material.name,
        color: rawMetal ? new THREE.Color("#929aa3") : material.color.clone(),
        map: material.map,
        normalMap: material.normalMap,
        roughnessMap: rawMetal ? RAW_STEEL_ROUGHNESS : material.roughnessMap,
        metalnessMap: material.metalnessMap,
        vertexColors: material.vertexColors,
        side: material.side,
        // Automotive paint is a DIELECTRIC. Pushing metalness up to fake
        // "metallic paint" eats the diffuse term, and in a dark garage that
        // turns a silver body into a black one — which is exactly what
        // happened on the first pass. A little flake, a coloured base, and let
        // the coat below do the shine.
        metalness: chromeish ? 1 : rawMetal ? 0.82 : bare ? 0.06 : 0.14,
        roughness: chromeish ? 0.09 : rawMetal ? 0.46 : bare ? 0.78 : 0.44,
        // The whole point. A coloured base under a near-mirror second layer is
        // what a painted panel physically IS; without it the same colour is
        // just a lump of tinted plastic, which is precisely how these bodies
        // have been reading. Primer and rust get almost none of it — a shell
        // that has not been painted yet must not be the shiniest thing in the
        // building, which is exactly what it became on the first pass.
        clearcoat: chromeish ? 0 : rawMetal ? 0 : bare ? 0.08 : 1,
        // Hard. Once the bay lights were moved off the cars' centrelines the
        // blown circle in the middle of every bonnet went with them, and a
        // tight coat is what turns the overhead strips into the long clean
        // streak down a wing that says "this paint is three feet deep".
        clearcoatRoughness: 0.07,
        envMapIntensity: chromeish ? 1.35 : rawMetal ? 1.28 : bare ? 0.6 : 1,
      });
      if (chromeish) {
        // nothing to tame — trim keeps its brightness
      } else if (rawMetal) {
        // Keep the steel neutral. The roughness field and shop reflections do
        // the panel work; a coloured clearcoat would turn it back into paint.
      } else if (bare) {
        tame(paint.color, 0.5, 0.42);
      } else {
        tame(paint.color, 0.6, 0.12);
      }

      unify(paint);
      swapped.set(material, paint);
      rebuilt.push(paint);
      replaced = true;
    }

    // Softer crease on bodywork than on dressing: a car is mostly one big
    // swept surface and wants to hold together across it.
    smooth(mesh, isVehicle ? THREE.MathUtils.degToRad(55) : THREE.MathUtils.degToRad(42));
    if (rawMetal) ensureRawSteelUVs(mesh.geometry);

    if (replaced) {
      mesh.material = Array.isArray(mesh.material) ? rebuilt : rebuilt[0];
    }
  });
}

const MEASURED = new WeakMap<THREE.Object3D, THREE.Box3>();

/**
 * Poly Haven ships real-world metres, Poly Pizza ships whatever the author had,
 * and the two sources do not agree on which way is forward either. Rather than
 * guess a scale and a yaw per file, measure the bounding box once and derive
 * both. Same call, both sources, no magic numbers to go stale if a model is
 * swapped for another of the 105.
 */
function measure(scene: THREE.Object3D): THREE.Box3 {
  const cached = MEASURED.get(scene);
  if (cached) return cached;

  const box = new THREE.Box3().setFromObject(scene);
  // An empty or non-finite box would divide by zero downstream.
  if (box.isEmpty() || !Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) {
    box.set(new THREE.Vector3(-0.5, 0, -0.5), new THREE.Vector3(0.5, 1, 0.5));
  }
  MEASURED.set(scene, box);
  return box;
}

/**
 * How to stand the model up before it is placed.
 *
 *   length — longest horizontal axis runs along Z, so every car in the library
 *            answers to the same yaw convention whichever way its author built it
 *   disc   — thinnest axis runs along X: a wheel or a rim standing on its tread
 *   flat   — thinnest axis runs along Y: the same wheel lying on the floor
 */
export type Orient = "none" | "length" | "disc" | "flat";

const ROT_X = new THREE.Euler(Math.PI / 2, 0, 0);
const ROT_Y = new THREE.Euler(0, Math.PI / 2, 0);
const ROT_Z = new THREE.Euler(0, 0, Math.PI / 2);
const ROT_NONE = new THREE.Euler(0, 0, 0);

function orientOf(box: THREE.Box3, orient: Orient): THREE.Euler {
  if (orient === "none") return ROT_NONE;
  const size = box.getSize(new THREE.Vector3());

  if (orient === "length") return size.x > size.z ? ROT_Y : ROT_NONE;

  const thin =
    size.x <= size.y && size.x <= size.z ? "x" : size.y <= size.z ? "y" : "z";

  if (orient === "disc") {
    // Thin axis to X: Rz sends +Y to ±X, Ry sends +Z to +X.
    return thin === "y" ? ROT_Z : thin === "z" ? ROT_Y : ROT_NONE;
  }
  // "flat" — thin axis to Y: Rz sends +X to +Y, Rx sends +Z to ∓Y.
  return thin === "x" ? ROT_Z : thin === "z" ? ROT_X : ROT_NONE;
}

/* ── One shelf per tier ─────────────────────────────────────────────────────
   `public/models-mobile/` is the same 71 models at half the texture budget in
   every slot. A phone draws the whole car about four inches wide and never
   gets closer to a prop than about a metre, so those texels do not survive the
   trip to the screen — but they do have to be downloaded, decoded and uploaded
   first, on the device least able to afford any of it.

   The swap happens here rather than in the `M` map because the tier is not
   known until the canvas mounts, and `M` is built when the module loads. Keys
   stay the desktop paths, so the `PAINTED`/`BARE` finish lookups still match. */
const MOBILE_BASE = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models-mobile${VERSION}/`;

function tierUrl(url: string, lite: boolean) {
  return lite ? url.replace(BASE, MOBILE_BASE) : url;
}

function shelf(url: string) {
  return tierUrl(url, phoneTier);
}

const OPENING_MODELS = [
  // Vehicles establish the scene. Stream their unchanged bytes before the
  // heavier decorative tyre/rim props so the doorway subject wins every race.
  M.charger,
  M.camaro,
  M.pickup,
  M.drum,
  M.extinguisher,
  M.pallet,
  M.tyre,
  M.rim,
  M.jerryCan,
  M.jerrycanGreen,
  M.wheelMag,
] as const;
const OPENING_PRELOAD_COUNT = OPENING_MODELS.length;
const OPENING_MODEL_NAMES = new Set(
  OPENING_MODELS.map((url) => url.slice(url.lastIndexOf("/") + 1)),
);

/* Exact first-use order for the remaining route. Every entry is introduced
   once, in the first bay that needs it; repeated scene instances still share
   the same R3F resource. This preserves opening vehicle priority while the
   two transport workers continue through all 71 lossless model files. */
const ROUTE_MODEL_GROUPS = [
  OPENING_MODELS,
  [
    M.challenger,
    M.coupeHoodUp,
    M.wheelStack,
    M.tirePump,
    M.oilCan,
    M.funnel,
    M.droplight,
    M.powerBox,
    M.toolCart,
  ],
  [
    M.hookChain,
    M.sparkPlug,
    M.battery,
    M.metalJug,
    M.pipesIndustrial,
    M.jumperCables,
    M.benchCluttered,
    M.partsCabinet,
    M.toolChest,
    M.drill,
    M.hammer,
    M.pliers,
    M.barrel,
    M.gasTank,
    M.crate,
    M.boxes,
  ],
  [
    M.benchVice,
    M.lubricantSpray,
    M.wrenchAdjustable,
    M.ammoBox,
    M.lampCaged,
    M.benchAnvil,
    M.benchGrinder,
    M.prewarDonor,
    M.weldingCart,
    M.propaneBottle,
    M.toolboxMetal,
    M.barrelC,
    M.primerShell,
    M.rustedShell,
    M.tyreBare,
    M.ladder,
    M.stool,
  ],
  [
    M.compressor,
    M.stoolB,
    M.gasCan,
    M.storageCart,
    M.barrelA,
    M.convertible,
  ],
  [
    M.desk,
    M.rack,
    M.shelving,
    M.tyreStack,
    M.palletJack,
    M.metalDoor,
    M.shelfWooden,
    M.coveredProject,
  ],
  [
    M.drumsRow,
    M.serviceRamp,
    M.tyreTruck,
    M.gasBottle,
  ],
] as const;
const ROUTE_PREFETCH_MODELS = [...new Set(ROUTE_MODEL_GROUPS.flat())];
const ROUTE_PARSE_BAY_BY_NAME = new Map<string, string>();
for (const [bay, urls] of ROUTE_MODEL_GROUPS.entries()) {
  for (const url of urls) {
    const canonical = url.replace(/[?#].*$/, "").replace(/\.br$/i, "");
    ROUTE_PARSE_BAY_BY_NAME.set(canonical.slice(canonical.lastIndexOf("/") + 1), `bay-${bay}`);
  }
}

function parseCourtesyKey(url: string) {
  const canonical = url.replace(/[?#].*$/, "").replace(/\.br$/i, "");
  const name = canonical.slice(canonical.lastIndexOf("/") + 1);
  return ROUTE_PARSE_BAY_BY_NAME.get(name) ?? "shared";
}

type OpeningTier = "full" | "lite";
const PARSED_OPENING_MODELS: Record<OpeningTier, Set<string>> = {
  full: new Set<string>(),
  lite: new Set<string>(),
};
let seededProgressGeneration = -1;
let seededProgressTier: OpeningTier | null = null;

function reportParsedOpeningProgress(tier: OpeningTier) {
  const parsed = PARSED_OPENING_MODELS[tier].size;
  if (parsed === 0) return;
  reportBootProgress(0.06 + 0.64 * Math.min(1, parsed / Math.max(OPENING_PRELOAD_COUNT, 1)));
}

function seedOpeningProgress(tier: OpeningTier) {
  if (seededProgressGeneration === loaderGeneration && seededProgressTier === tier) return;
  seededProgressGeneration = loaderGeneration;
  seededProgressTier = tier;
  const generation = loaderGeneration;
  queueMicrotask(() => {
    if (generation !== loaderGeneration || (phoneTier ? "lite" : "full") !== tier) return;
    reportParsedOpeningProgress(tier);
  });
}

function reportOpeningModelParsed(url: string) {
  const canonical = url.replace(/[?#].*$/, "").replace(/\.br$/i, "");
  const name = canonical.slice(canonical.lastIndexOf("/") + 1);
  if (!OPENING_MODEL_NAMES.has(name)) return;
  const tier: OpeningTier = canonical.startsWith(MOBILE_BASE) ? "lite" : "full";
  PARSED_OPENING_MODELS[tier].add(canonical);
  if ((phoneTier ? "lite" : "full") === tier) reportParsedOpeningProgress(tier);
}
const PREFETCHED_ROUTE_URLS = new Set<string>();

/**
 * Fill the exact byte cache in first-use tour order while the visitor is still
 * approaching the garage. The mounted loader awaits these same promises, so
 * it cannot race or duplicate a request.
 * Parsing remains one-file-at-a-time and no GPU upload or shader work begins
 * until the real Canvas reaches its existing warm gate.
 */
export function preloadOpeningModels(lite: boolean) {
  const connection = typeof navigator !== "undefined" && "connection" in navigator ? navigator.connection : undefined;
  modelTransport.setLimit(getModelTransportConcurrency(lite, connection));
  const urls = ROUTE_PREFETCH_MODELS.map((url) => tierUrl(url, lite));
  // Healthy lite worlds overlap up to four lossless transfers; full worlds
  // and unknown/slow connections retain two. This fills
  // the exact byte cache IdleGLTFLoader consumes later; parsing remains serial
  // in the parked Canvas instead of interrupting the visible film in a burst.
  // Register every route promise synchronously. The shared transport pool
  // remains shared even if the Canvas mounts while this loop is running.
  // Only successful URLs latch, so a transient edge miss can re-arm on the
  // next proximity/hero-ready signal.
  for (const url of urls) {
    if (PREFETCHED_ROUTE_URLS.has(url)) continue;
    void prefetchModelBytes(url).then(() => PREFETCHED_ROUTE_URLS.add(url))
      .catch(() => undefined);
  }
}

function useShopModel(url: string) {
  const resource = shelf(url);
  const gl = useThree((state) => state.gl);
  noteModelDemand(resource, RENDERER_PARSE_OWNERS.get(gl));
  const gltf = useLoader(IdleGLTFLoader, resource, extendLoader) as unknown as GLTF;
  useEffect(() => {
    markModelResourceHealthy(resource);
  }, [resource]);
  // Grading is idempotent and guarded by a WeakSet, so it is safe here — but
  // nothing else may be: the debug timing that used to wrap this called
  // `performance.now()` during render, which is exactly the impurity React's
  // own lint rule is there to catch. The parse timings in `IdleGLTFLoader`
  // cover the same ground from a place where measuring is legal.
  grade(gltf.scene, finishOf(url));
  return gltf.scene;
}

/* ── Placement ──────────────────────────────────────────────────────────── */

export type PlacedProps = {
  url: string;
  /** Real-world size in metres along `axis`, measured after `orient`. */
  size: number;
  /** Which bounding-box dimension `size` refers to. */
  axis?: "x" | "y" | "z" | "max" | "xz";
  position: [number, number, number];
  /** Yaw in radians, applied after `orient`. */
  yaw?: number;
  /** Pitch and roll, for things leaning or knocked over. */
  tilt?: [number, number];
  /** Sit the bounding box on the group origin, or centre it there. */
  anchor?: "floor" | "center";
  orient?: Orient;
  /** Contact-shadow radius in metres, or false for anything off the floor. */
  shadow?: number | false;
  shadowSpread?: [number, number];
  shadowOpacity?: number;
  /**
   * Repaint the BODYWORK of this one instance — the panels `grade` gave a
   * clearcoat — leaving glass, rubber, trim and every other instance of the
   * same file untouched. This is what lets two clones of one .glb read as two
   * different customers' cars instead of a copy-paste.
   */
  tint?: string;
};

/**
 * Swap the clearcoated paint materials on a freshly cloned subtree for tinted
 * copies. Runs on the CLONE's meshes, so the shared source materials — and
 * every other instance — are never touched. The clones are cached per call
 * site and disposed with it.
 */
function useTint(group: React.RefObject<THREE.Group | null>, tint?: string) {
  useLayoutEffect(() => {
    if (!tint) return;
    const swapped = new Map<THREE.Material, THREE.MeshPhysicalMaterial>();

    group.current?.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const rebuilt = list.map((entry) => {
        const material = entry as THREE.MeshPhysicalMaterial;
        // Clearcoat is how `grade` marks body paint; everything else keeps its
        // shared material.
        if (!material?.isMeshPhysicalMaterial || material.clearcoat < 0.5) return entry;
        let paint = swapped.get(entry);
        if (!paint) {
          paint = material.clone();
          paint.color.set(tint);
          // Gentler than the grade pass on authored paint: a repaint is chosen
          // to READ as a colour under tungsten, so it keeps more of its value.
          tame(paint.color, 0.78, 0.08);
          swapped.set(entry, paint);
        }
        return paint;
      });
      mesh.material = Array.isArray(mesh.material) ? rebuilt : rebuilt[0];
    });

    return () => {
      for (const material of swapped.values()) material.dispose();
    };
  }, [group, tint]);
}

/**
 * One model, stood up, fitted to a real size, sat on the floor and grounded
 * with a contact smudge. Every repeat of a file in this shop goes through here,
 * and `Clone` shares the loaded geometry and materials — so eight tyres cost
 * one fetch, one geometry upload and eight matrices.
 */
const MODEL_BOUNDARY_RETRIES = 1;
const MODEL_BOUNDARY_RETRY_DELAY_MS = 2_000;

type ModelRecovery = {
  attempts: number;
  timer: number;
  listeners: Set<() => void>;
};

const MODEL_RECOVERIES = new Map<string, ModelRecovery>();

function scheduleModelRecovery(resource: string, listener: () => void) {
  let recovery = MODEL_RECOVERIES.get(resource);
  if (!recovery) {
    recovery = { attempts: 0, timer: 0, listeners: new Set() };
    MODEL_RECOVERIES.set(resource, recovery);
  }
  if (recovery.attempts >= MODEL_BOUNDARY_RETRIES) return false;
  recovery.listeners.add(listener);
  if (recovery.timer) return true;
  const delay = MODEL_BOUNDARY_RETRY_DELAY_MS * 2 ** recovery.attempts;
  recovery.timer = window.setTimeout(() => {
    recovery.timer = 0;
    recovery.attempts += 1;
    useLoader.clear(IdleGLTFLoader, resource);
    const listeners = [...recovery.listeners];
    recovery.listeners.clear();
    for (const retry of listeners) retry();
  }, delay);
  return true;
}

function unsubscribeModelRecovery(resource: string | null, listener: () => void) {
  if (!resource) return;
  MODEL_RECOVERIES.get(resource)?.listeners.delete(listener);
}

function markModelResourceHealthy(resource: string) {
  const recovery = MODEL_RECOVERIES.get(resource);
  if (!recovery) return;
  if (recovery.timer) window.clearTimeout(recovery.timer);
  MODEL_RECOVERIES.delete(resource);
}

function resetModelRecoveries() {
  for (const [resource, recovery] of MODEL_RECOVERIES) {
    if (recovery.timer) window.clearTimeout(recovery.timer);
    // A new Canvas is a new bounded recovery generation. Clear only keys that
    // actually failed; successful resources never enter this map.
    useLoader.clear(IdleGLTFLoader, resource);
  }
  MODEL_RECOVERIES.clear();
}

class ModelBoundary extends Component<
  { url: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  private recoveryResource: string | null = null;
  private retry = () => {
    this.recoveryResource = null;
    this.setState({ failed: false });
  };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    /* The loader already kept one whole recovery attempt inside the same
       Suspense resource. If the edge or WebKit decoder still failed, clear
       only this exact R3F key after a bounded cooldown. Never leave one
       transient rejection cached for the rest of the SPA visit, and never
       create an immediate error-boundary render loop. */
    const resource = shelf(this.props.url);
    if (!scheduleModelRecovery(resource, this.retry)) {
      console.warn(`[shop] model ${this.props.url} failed after recovery — omitting only this prop`, error);
      return;
    }
    this.recoveryResource = resource;
    console.warn(`[shop] model ${this.props.url} failed — scheduling exact-key recovery`, error);
  }

  componentWillUnmount() {
    unsubscribeModelRecovery(this.recoveryResource, this.retry);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function PlacedModel({
  url,
  size,
  axis = "max",
  position,
  yaw = 0,
  tilt,
  anchor = "floor",
  orient = "none",
  shadow = false,
  shadowSpread = [1, 1],
  shadowOpacity = 0.5,
  tint,
}: PlacedProps) {
  const scene = useShopModel(url);
  const clone = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  useTint(clone, tint);

  /* A PLACED MODEL NEVER MOVES AGAIN.
     three recomputes a local matrix from position/quaternion/scale for every
     object in the graph, every frame. This scene carries three and a half
     thousand of them, and all but a handful — the turntable, the lift deck,
     the dyno drums, the fan — are bolted to the floor. Composing a matrix to
     discover that a tyre is exactly where it was last frame is pure tax, and
     on a throttled phone it is a real slice of the budget.
     Freezing is safe for exactly this subtree because its transforms are
     props, written once at mount. Anything that DOES animate lives outside
     `Placed` and keeps its own updates — and because three forces the update
     down through children, a frozen model riding an animated turntable still
     tracks it perfectly. */
  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    node.updateMatrixWorld(true);
    node.traverse((child) => {
      child.matrixAutoUpdate = false;
    });
    return () => {
      node.traverse((child) => {
        child.matrixAutoUpdate = true;
      });
    };
  }, [scene, size, axis, anchor, orient, position, yaw, tilt, tint]);

  const fit = useMemo(() => {
    const euler = orientOf(measure(scene), orient);
    // Transform the box by the same rotation the mesh will get, so the fit and
    // the ground offset are computed in the frame the model actually ends up in.
    const box = measure(scene)
      .clone()
      .applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(euler));
    const dims = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());

    const span =
      axis === "max"
        ? Math.max(dims.x, dims.y, dims.z)
        : axis === "xz"
          ? Math.max(dims.x, dims.z)
          : dims[axis];
    const scale = span > 1e-6 ? size / span : 1;

    return {
      euler,
      scale,
      offset: [
        -centre.x * scale,
        anchor === "floor" ? -box.min.y * scale : -centre.y * scale,
        -centre.z * scale,
      ] as [number, number, number],
    };
  }, [scene, size, axis, anchor, orient]);

  return (
    <group ref={root} position={position} rotation={[tilt?.[0] ?? 0, yaw, tilt?.[1] ?? 0]}>
      <group position={fit.offset} scale={fit.scale}>
        <group ref={clone} rotation={fit.euler}>
          <Clone object={scene} />
        </group>
      </group>
      {shadow !== false && (
        <ContactShadow
          radius={shadow}
          spread={shadowSpread}
          opacity={shadowOpacity}
          position={[0, 0.018 - position[1], 0]}
        />
      )}
    </group>
  );
}

export function Placed(props: PlacedProps) {
  return (
    <ModelBoundary url={props.url}>
      <PlacedModel {...props} />
    </ModelBoundary>
  );
}

/** A car: nose-to-tail down Z, sized by length, grounded with a long blob. */
export function Vehicle(props: Omit<PlacedProps, "orient">) {
  const { size, shadow, shadowSpread, shadowOpacity, ...rest } = props;
  return (
    <Placed
      {...rest}
      size={size}
      orient="length"
      shadow={shadow ?? size * 0.5}
      shadowSpread={shadowSpread ?? [0.4, 1]}
      shadowOpacity={shadowOpacity ?? 0.6}
    />
  );
}

/* ── Station streaming ──────────────────────────────────────────────────────

   THE FIX FOR THE 21-SECOND FRAME.

   A Chrome trace of the old build showed the render loop blocking the main
   thread for 12, 17, 18 and 21 seconds at a stretch — every one of them the
   frame in which a bay mounted. Nothing was wrong with the scene: the cost was
   `glLinkProgram`. A dozen fresh `MeshPhysicalMaterial`s, translated to HLSL
   and linked by ANGLE, INSIDE the frame that first draws them, because a
   material is not compiled until the renderer meets it in a render.

   So the renderer meets them before the camera arrives. Each bay mounts hidden;
   the base renderer allocates its program set, then the real composer draws the
   shipped HDR/post-processing variants in adaptive slices and yields between
   them. Only when both steps finish does the group become available to reveal.

   The same resolution opens the gate for the next bay, so the shop arrives as
   an orderly queue rather than a stampede. */

/* ── Tier ───────────────────────────────────────────────────────────────────
   The phone tier is not "the same shop with cheaper pixels" any more. Three
   things it does differently are decided here, because they are decisions
   about what gets BUILT, not about how it is drawn:

     draw span      how many bays exist in the frame at once
     bay lights     whether a droplight is a real light or just a glowing bulb
     light pad      how many slots the shader's light loop carries

   All three are per-fragment or per-object costs that a desktop GPU shrugs off
   and a phone cannot. */

let phoneTier = false;
export function setWorldTier(lite: boolean) {
  phoneTier = lite;
  seedOpeningProgress(lite ? "lite" : "full");
}

/** How far from a station the camera keeps it drawn, in station units. */
const DRAW_SPAN_FULL = 2.6;
/* Just over one station. The orbit the reader is on, and its neighbour coming
   into view — nothing else is submitted, matrixed, or culled. */
const DRAW_SPAN_LITE = 1.25;
const drawSpan = () => (phoneTier ? DRAW_SPAN_LITE : DRAW_SPAN_FULL);

/** `?perf` on the URL turns on the warm-up timings and the renderer handle. */
const DEBUG =
  typeof window !== "undefined" && window.location.search.includes("perf");

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** A hidden Safari tab may suspend rAF indefinitely; a timer still advances the
 * parked renderer's proof and is cancelled when the real frame arrives. */
const nextFrameWithin = (timeoutMs = 1_000) =>
  new Promise<void>((resolve) => {
    let settled = false;
    let frame = 0;
    let timer = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      resolve();
    };
    frame = window.requestAnimationFrame(finish);
    timer = window.setTimeout(finish, timeoutMs);
  });

/* ── Yield to the reader ────────────────────────────────────────────────────
   Warming a bay is the cheapest it will ever be, and it is still work: a few
   hundred milliseconds of shader translation that has to happen SOMEWHERE. The
   one place it must not happen is inside a scroll — that is the entire point
   of doing it early.

   So the rig reports whether the film is moving, and every batch of warm-up
   work waits for the reader to stop first. Readers stop constantly: the snap
   parks them on a station, they read a paragraph, they look at the picture.
   The shop fills itself in during those pauses. A bay that has been waiting
   too long goes ahead regardless — a reader who never stops still has to get
   a shop eventually. */

/**
 * Resolves true if the reader actually stopped, false if patience ran out.
 *
 * PATIENCE IS SHORT ON PURPOSE. It used to be nine seconds, which assumed the
 * motion signal was trustworthy. It was not — and because every slice of every
 * warm-up waited on it, one bad signal turned a thirty-second stream into one
 * that never finished, with the shop hidden behind it the whole time. Just
 * under a second is long enough to sit out a flick and short enough that being
 * wrong costs a frame instead of the entire scene.
 */
async function untilIdle(patience = 900, protectVisiblePage = false) {
  // Most hidden garage work can race before reveal. Model parsing is the
  // exception because it blocks the same main thread as the visible hero.
  if (racing() && !protectVisiblePage) return true;
  // Nobody is watching a parked world: keep the queue's shape, shrink its wait.
  if (worldParked && !protectVisiblePage) patience = Math.min(patience, 150);
  const deadline = performance.now() + patience;
  while (stillFor() < 200) {
    if (performance.now() > deadline) return false;
    await wait(60);
  }
  return true;
}

/**
 * NOTHING IS PROTECTED WHILE NOBODY IS LOOKING AT THE SHOP.
 *
 * Every pacing mechanism in this file exists to protect a reader who is looking
 * at the garage. While the canvas is parked in the film — even after the
 * opening bay is ready enough to roll the door — they are looking at Acts I–II
 * and there is nothing in the shop to protect. Pacing that window does not buy
 * smoothness; it just makes the later bays late. A phone measured the opening
 * bay finishing at fifteen seconds, most of it spent waiting politely for a
 * reader who could not yet see anything.
 *
 * So the gates stand open while the world is parked, and close once the shop
 * canvas is actually drawing.
 */
function racing() {
  return worldParked;
}

/* PARKED SHORTENS THE COURTESIES. On the original page every pacing courtesy
   switched off until the preloader lifted, because nobody could see the shop
   yet. On the combined page the equivalent state is the frameloop being
   parked: the reader is up in the film and the walk-through canvas is faded
   out — being polite to a shop nobody is looking at only makes it late. But
   the courtesies cannot switch off OUTRIGHT while parked: they also stagger
   the parse and texture-upload pressure, and removing them entirely while the
   film owns the GPU took the phone-tier renderer down. So while parked the
   queue keeps its shape — serialized, yielding — and only its PATIENCE
   shrinks. `ShopWorld` reports the state. */
let worldParked = true;
export function setWorldParked(parked: boolean) {
  worldParked = parked;
}

function countRenderables(node: THREE.Object3D) {
  let n = 0;
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh || (child as THREE.Points).isPoints || (child as THREE.Line).isLine) n++;
  });
  return n;
}

/* Texture decode and texture upload are different bills. The GLTF loader can
   finish decoding a full-resolution WebP while the driver still has no GPU
   object for it; without this pass, the first visible draw pays upload plus
   mip allocation in one frame. Ownership is renderer-specific because one
   Three texture may be consumed by more than one WebGL context. */
const UPLOADED_TEXTURES = new WeakMap<THREE.WebGLRenderer, WeakSet<THREE.Texture>>();
const nextUploadFrame = () => nextFrameWithin();

async function warmTextures(
  gl: THREE.WebGLRenderer,
  node: THREE.Object3D,
  isStale: () => boolean,
) {
  if (isStale()) return;
  let uploaded = UPLOADED_TEXTURES.get(gl);
  if (!uploaded) {
    uploaded = new WeakSet<THREE.Texture>();
    UPLOADED_TEXTURES.set(gl, uploaded);
  }

  const textures = new Set<THREE.Texture>();
  const materials = new Set<THREE.Material>();
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of list) {
      if (!material || materials.has(material)) continue;
      materials.add(material);
      for (const value of Object.values(material)) {
        const texture = value as THREE.Texture | undefined;
        if (texture?.isTexture && !uploaded.has(texture)) textures.add(texture);
      }
    }
  });

  const started = performance.now();
  let count = 0;
  for (const texture of textures) {
    if (isStale()) return;
    if (uploaded.has(texture)) continue;
    // warmSubtree enters this loop only after its bounded idle courtesy. One
    // upload per animation frame is the hard pacing contract from here: a
    // reader who moves again may see at most one texture bill in any frame,
    // while the bay does not fall seconds behind its matching copy panel.
    try {
      gl.initTexture(texture);
      uploaded.add(texture);
      count += 1;
    } catch {
      // Context loss or an optional texture can defer to Three's ordinary
      // render path; pre-upload is an acceleration, never a reveal gate.
    }
    await nextUploadFrame();
    if (isStale()) return;
  }
  if (DEBUG && count > 0) {
    console.log(`[shop]   pre-uploaded ${count} textures in ${Math.round(performance.now() - started)} ms`);
  }
}

/**
 * Wait for a subtree to stop growing, THEN compile it.
 *
 * Compiling too early is worse than not compiling at all: the first attempt at
 * this warmed the shell sixty milliseconds after mount, linked eighteen
 * programs, and then watched the first rendered frame link thirty-four more —
 * React had not finished committing the building yet. React 19 commits
 * concurrently and will happily yield mid-tree, so the only honest signal is
 * the subtree itself going quiet.
 */
async function warmSubtree(
  gl: THREE.WebGLRenderer,
  node: THREE.Object3D,
  camera: THREE.Camera,
  scene: THREE.Scene,
  isStale: () => boolean,
): Promise<void> {
  if (isStale()) return;
  let previous = -1;
  for (let i = 0; i < 14; i++) {
    if (isStale()) return;
    const count = countRenderables(node);
    if (count > 0 && count === previous) break;
    previous = count;
    // Short steps: this is a settle check, and every wasted tick here is a
    // bay arriving later than it needed to.
    await wait(70);
    if (isStale()) return;
  }

  // Collapse the feature sets BEFORE compiling, or we compile the variety we
  // are about to throw away.
  if (isStale()) return;
  unifyTree(node);
  await untilIdle();
  if (isStale()) return;
  await warmUp(gl, node, camera, scene, isStale);
}

/** Prefer stillness before an indivisible driver upload, but never strand the
 * reveal or warm queue behind a reader who keeps a finger on the page. */
async function waitForReaderQuiet(patience = 900) {
  const deadline = performance.now() + patience;
  while (stillFor() < 450 && performance.now() < deadline) await wait(80);
}

type ReadyShaderProgram = { isReady?: () => boolean };

/**
 * Start Three's exact program compile, but own the polling loop so a disposed
 * WebKit renderer cannot leave `compileAsync()`'s private 10 ms timer alive
 * forever. A later postage-stamp first-use remains the authoritative proof.
 */
async function compileProgramsWithin(
  gl: THREE.WebGLRenderer,
  node: THREE.Object3D,
  camera: THREE.Camera,
  targetScene: THREE.Scene | undefined,
  isStale: () => boolean,
  renderTarget: THREE.WebGLRenderTarget,
  prepareTextures?: () => Promise<void>,
) {
  if (isStale()) return;
  let pending = new Set<THREE.Material>();
  let submissionFailure: { error: unknown } | undefined;
  const previousTarget = gl.getRenderTarget();
  const previousFace = gl.getActiveCubeFace();
  const previousMip = gl.getActiveMipmapLevel();
  let compileScope = node;
  if (targetScene && node !== targetScene) {
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (parent !== targetScene) continue;
      // Three gathers lights from targetScene AND the object being added.
      // Our shell is already attached, so passing it directly doubles its
      // lights and compiles a variant the real frame never uses. Delegate
      // only material traversal; the actual scene supplies every light once.
      // Original objects/materials, visibility and parentage remain untouched.
      const materialsOnly = new THREE.Group();
      materialsOnly.traverse = node.traverse.bind(node);
      compileScope = materialsOnly;
      break;
    }
  }
  try {
    gl.setRenderTarget(renderTarget);
    pending = gl.compile(compileScope, camera, targetScene);
  } catch (error) {
    submissionFailure = { error };
  } finally {
    // compile() submits synchronously; only driver completion is asynchronous.
    // Never retain a private HDR framebuffer while textures or visible frames
    // yield, and never overwrite a newer frame's state in an async finally.
    try {
      gl.setRenderTarget(previousTarget, previousFace, previousMip);
    } catch {
      // A superseded Canvas may already have released its renderer.
    }
  }
  if (isStale()) return;
  // The driver can compile while the unchanged one-texture-per-frame upload
  // pass runs. This is one awaited chain, not competing GL mutation promises.
  // Keep uploads even when optional shader submission failed: the first-use
  // fallback must not inherit an unpaced texture bill.
  if (prepareTextures) await prepareTextures();
  if (isStale()) return;
  if (submissionFailure) throw submissionFailure.error;
  const deadline = performance.now() + PROGRAM_COMPILE_PATIENCE_MS;
  while (!isStale() && performance.now() < deadline) {
    for (const material of pending) {
      const properties = gl.properties.get(material) as {
        currentProgram?: ReadyShaderProgram;
      };
      const program = properties.currentProgram;
      if (!program || typeof program.isReady !== "function" || program.isReady()) {
        pending.delete(material);
      }
    }
    if (pending.size === 0) return;
    await wait(16);
  }
}

/** Allocate the base material programs before the paced composer first-use. */
async function warmUp(
  gl: THREE.WebGLRenderer,
  node: THREE.Object3D,
  camera: THREE.Camera,
  scene: THREE.Scene,
  isStale: () => boolean,
): Promise<void> {
  if (isStale()) return;
  // Three lazily filters scene.environment inside material compilation. Bays
  // can reach this entry while WarmScene is already awaiting that filter's
  // shader; every consumer must share readiness before triggering its first
  // use. Keep the early cubemap capture and unrelated post-pass overlap intact.
  await waitForEnvironmentWarmup(gl);
  if (isStale()) return;
  // The shipped composer renders the scene into a half-float HDR target. A
  // program prepared for the default canvas framebuffer is a different ANGLE
  // variant and does not pay that bill; the old warm-up compiled the wrong
  // programs, then linked every material again on its first composed frame.
  const composerTarget = COMPOSER_TARGETS.get(gl);
  const target =
    composerTarget ??
    new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.HalfFloatType,
      depthBuffer: true,
    });
  try {
    // Our bounded readiness poll lets KHR_parallel_shader_compile keep ANGLE's
    // link work off the main thread. The old synchronous compile could hold
    // the film still for seconds even though this shop canvas was parked.
    if (isStale()) return;
    await compileProgramsWithin(
      gl,
      node,
      camera,
      node === scene ? undefined : scene,
      isStale,
      target,
      () => warmTextures(gl, node, isStale),
    );
  } catch {
    /* A material the renderer will not touch is not one we can warm. */
  } finally {
    if (!composerTarget) target.dispose();
  }
  if (isStale()) return;
  await wait(0);
}

type ComposerHandle = {
  passes?: unknown[];
  inputBuffer?: THREE.WebGLRenderTarget;
};

const COMPOSER_TARGETS = new WeakMap<THREE.WebGLRenderer, THREE.WebGLRenderTarget>();
/* A tiny target with the same colour/depth/MSAA contract as the composer's
   scene input. Geometry and material first-use happens here without paying AO,
   bloom, DOF and the rest of the full-screen stack for every bay. */
const COMPOSER_OVENS = new Map<THREE.WebGLRenderer, THREE.WebGLRenderTarget>();

function restoreComposerOvens() {
  for (const target of COMPOSER_OVENS.values()) target.dispose();
  COMPOSER_OVENS.clear();
}

/** Release the only strong renderer-owned cache when its Canvas goes away. */
export function releaseLoaderRenderer(gl: THREE.WebGLRenderer) {
  releaseEnvironmentWarmup(gl);
  const oven = COMPOSER_OVENS.get(gl);
  if (oven) {
    oven.dispose();
    COMPOSER_OVENS.delete(gl);
  }
  // Invalidate only the generation this renderer actually owns. A late React
  // cleanup from an old Canvas must never cancel its already-mounted successor.
  const parseOwner = RENDERER_PARSE_OWNERS.get(gl);
  if (parseOwner) {
    RENDERER_PARSE_OWNERS.delete(gl);
    endParseGeneration(parseOwner);
  }
}

/**
 * Compile the post chain's own fullscreen materials without drawing it.
 *
 * `WebGLRenderer.compileAsync(scene)` cannot discover EffectComposer passes:
 * they live beside the Three scene graph. Previously the first hidden
 * `advance()` discovered AO, bokeh, bloom, grain, grade and vignette together,
 * forcing ANGLE to link the whole lens synchronously inside one 9–12 second
 * frame. We find those already-initialised pass materials, put them on tiny
 * fullscreen quads, and let the driver's parallel compiler finish them before
 * the verification frame. No effect, define, texture, target format or scene
 * material is changed.
 */
async function warmComposerPrograms(
  gl: THREE.WebGLRenderer,
  composer: React.RefObject<ComposerHandle | null> | undefined,
  isStale: () => boolean,
) {
  // The React postprocessing wrapper installs its pass list in a layout
  // effect. WarmScene is a sibling, so allow one short commit turn for the ref.
  for (let i = 0; i < 20 && !composer?.current?.passes?.length; i++) {
    if (isStale()) return;
    await wait(25);
  }
  if (isStale()) return;

  const materials = new Set<THREE.Material>();
  const seen = new Set<object>();
  const visit = (value: unknown, depth = 0) => {
    if (!value || typeof value !== "object" || depth > 8 || seen.has(value)) return;
    seen.add(value);
    if (value instanceof THREE.Material) {
      materials.add(value);
      return;
    }
    // Postprocessing hides several shaders on fullscreen meshes inside tiny
    // private scenes. Read their materials, but never walk the real shop scene
    // (its broad child list is compiled separately by warmSubtree).
    if (value instanceof THREE.Object3D) {
      const objectMaterial = (value as THREE.Mesh).material;
      if (Array.isArray(objectMaterial)) {
        for (const material of objectMaterial) {
          if (material instanceof THREE.Material) materials.add(material);
        }
      } else if (objectMaterial instanceof THREE.Material) {
        materials.add(objectMaterial);
      }
      if (value.children.length <= 8) {
        for (const child of value.children) visit(child, depth + 1);
      }
      return;
    }
    // These graphs are enormous and cannot contain a pass-owned material that
    // needs discovery. Skipping them also prevents cycles back into the scene.
    if (
      value instanceof THREE.Texture ||
      value instanceof THREE.WebGLRenderer ||
      value instanceof THREE.WebGLRenderTarget
    ) {
      return;
    }
    if (Array.isArray(value)) {
      for (const entry of value) visit(entry, depth + 1);
      return;
    }
    if (value instanceof Map || value instanceof Set) {
      for (const entry of value.values()) visit(entry, depth + 1);
      return;
    }
    for (const entry of Object.values(value as Record<string, unknown>)) {
      visit(entry, depth + 1);
    }
  };
  visit(composer?.current?.passes ?? []);
  if (isStale()) return;
  if (!materials.size) return;

  const composerTarget = composer?.current?.inputBuffer;
  if (composerTarget) COMPOSER_TARGETS.set(gl, composerTarget);

  const geometry = new THREE.PlaneGeometry(2, 2);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  for (const material of materials) scene.add(new THREE.Mesh(geometry, material));
  const target =
    composerTarget ??
    new THREE.WebGLRenderTarget(2, 2, {
      type: THREE.HalfFloatType,
      depthBuffer: true,
    });
  try {
    if (isStale()) return;
    await compileProgramsWithin(gl, scene, camera, undefined, isStale, target);
    if (isStale()) return;
    if (DEBUG) {
      const parallel = Boolean(gl.getContext().getExtension("KHR_parallel_shader_compile"));
      console.log(`[shop] async composer programs ${materials.size} · parallel ${parallel}`);
    }
  } catch {
    // The composed verification frame below remains the authoritative fallback
    // for browsers whose driver rejects an isolated pass material.
  } finally {
    geometry.dispose();
    if (!composerTarget) target.dispose();
    scene.clear();
  }
}

async function waitForWarmKey(key: string, patience = 12000) {
  const deadline = performance.now() + patience;
  while (!WARMED.has(key) && performance.now() < deadline) await wait(50);
}

/**
 * Let drei's one-frame procedural Environment capture its lightformers before
 * any shop material is compiled.
 *
 * With `frames={1}` the environment texture does not exist until R3F advances
 * once. The old order compiled every PBR material without IBL, then the first
 * composed frame created the 256px environment and forced ANGLE to build the
 * reflective variants all over again. Hide every renderable for this one root
 * advance: the portal lightformers still capture, while no car, prop, floor or
 * shell material can accidentally pay first-use work on the main thread.
 */
async function primeEnvironment(root: RootState, isStale: () => boolean) {
  if (isStale()) return;
  const hidden: THREE.Object3D[] = [];
  root.scene.traverse((object) => {
    const renderable = object as THREE.Mesh;
    if (
      object.visible &&
      (renderable.isMesh || (object as THREE.Points).isPoints || (object as THREE.Line).isLine)
    ) {
      hidden.push(object);
      object.visible = false;
    }
  });
  try {
    // One is the contract; the two fallback turns cover a concurrent React
    // commit where the Environment hook joined just after WarmScene's effect.
    for (let i = 0; i < 3 && !root.scene.environment; i++) {
      if (isStale()) return;
      advance(performance.now(), true, root);
      if (!root.scene.environment) {
        await wait(0);
        if (isStale()) return;
      }
    }
    if (DEBUG) console.log(`[shop] environment primed ${Boolean(root.scene.environment)}`);
  } catch {
    // A missing environment is not fatal; warmSubtree retains the original
    // fallback and the scene can still build the variant on its composed pass.
  } finally {
    for (const object of hidden) object.visible = true;
  }
}

/**
 * Draw a subtree through the real composer, a few meshes at a time.
 *
 * `compile()` builds programs for the configuration it is given; the post chain
 * renders into an HDR buffer, which Direct3D treats as a different program for
 * every material it touches. So a bay that was only ever `compile()`d still
 * pays for its shaders the first frame the composer draws it — and on the phone
 * tier that landed as an eleven-second stall in the middle of a scroll, because
 * that is when a bay first becomes visible.
 *
 * Handing the meshes back in small batches, with a frame between each, pays the
 * same bill in slices small enough that nothing notices — and, crucially, it
 * happens while the bay is still two stations away from the camera.
 */
let warmQueue: Promise<void> = Promise.resolve();

/* A subtree is paced through the composer ONCE, ever. A bay whose queued warm
   is still waiting can suspend again (a late texture, a second model); React
   tears down and re-runs the owning effect, whose `warm` guard is still
   false — so a SECOND paced warm of the same node was enqueued, and the
   redundant pass re-hid a freshly restored bay for seconds (the probe kept
   catching bays at exactly "one mesh shown, N hidden"). The node object
   survives the re-suspension, so identity is the honest key. */
const PACED = new WeakMap<THREE.Object3D, number>();
/** A private draw borrows only the slots belonging to its visible bay. */
type WarmStationLights = { key: string; count: number; isStale: () => boolean };
const WARM_STATION_LIGHTS = new WeakMap<THREE.Object3D, WarmStationLights>();
const PACING = new WeakMap<THREE.Object3D, { generation: number; lights?: WarmStationLights; promise: Promise<void> }>();

/* Which objects a paced warm currently owns while temporarily hidden.
   NOT on userData: drei's <Clone> spreads `userData` BY REFERENCE, so every
   clone of one source model — across every bay — shares a single userData
   object. A mark written there phantom-marks the whole fleet at once, one
   bay's restore can otherwise erase another bay's ownership. Identity lives
   in a WeakMap instead, which cannot be shared by construction. The detail
   cull consults this map and leaves owned visibility alone; pacedWarm's
   finally block is the only authority that clears it. */
const PACED_HIDDEN = new WeakMap<THREE.Object3D, number>();

/**
 * ONE PACED WARM AT A TIME, EVER.
 *
 * The gate chain usually provides this ordering for free — each bay opens the
 * next only once it is warm. The failsafe path and React 19's dev-mode double
 * effects can mount several bays together, and two paced warms interleaving
 * their slices is exactly the disease this file exists to cure: the slices
 * stack into multi-second frames, and a warm that begins while another holds
 * the same subtree hidden snapshots that hidden state as "how it was" and
 * faithfully restores an invisible bay. A module-level queue makes the
 * ordering a fact rather than a usual outcome.
 */
function warmThroughComposer(node: THREE.Object3D, label = "", root?: RootState) {
  const generation = loaderGeneration;
  if (PACED.get(node) === generation) return Promise.resolve();
  const lights = WARM_STATION_LIGHTS.get(node);
  const pending = PACING.get(node);
  if (pending?.generation === generation && pending.lights === lights) return pending.promise;
  const entry = { generation, lights, promise: Promise.resolve() };
  const work = warmQueue.then(() => {
    if (generation !== loaderGeneration || lights?.isStale()) return;
    return pacedWarm(node, label, root, generation);
  });
  const next = work.then(() => {
    if (PACING.get(node) !== entry) return;
    // Enqueued or cancelled work is not proof of first use. A replacement
    // effect on the same Three group must await its own live preparation.
    if (generation === loaderGeneration && !lights?.isStale()) PACED.set(node, generation);
    PACING.delete(node);
  }, (error) => {
    if (PACING.get(node) === entry) PACING.delete(node);
    throw error;
  });
  entry.promise = next;
  PACING.set(node, entry);
  warmQueue = next.catch(() => undefined);
  return next;
}

/**
 * Three creates one binding state for a geometry/program pair. Drei clones
 * share both, so a first-use pass only needs one representative for each real
 * GPU combination — not every copy of every bolt and tyre in a bay.
 */
function firstUseKey(object: THREE.Object3D) {
  const mesh = object as THREE.Mesh;
  const geometry = mesh.geometry;
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const materialKey = materials
    .map((entry) => {
      const material = entry as THREE.Material & Record<string, unknown>;
      const rawDefines = material?.defines;
      const defines =
        rawDefines && typeof rawDefines === "object"
          ? JSON.stringify(
              rawDefines,
              Object.keys(rawDefines as Record<string, unknown>).sort(),
            )
          : "";
      const shaderIdentity = material?.isShaderMaterial ? material.uuid : "";
      return [
        material?.type,
        material?.side,
        Number(Boolean(material?.transparent)),
        Number(Boolean(material?.alphaTest)),
        Number(Boolean(material?.depthWrite)),
        Number(Boolean(material?.vertexColors)),
        Number(Boolean(material?.toneMapped)),
        Number(Boolean(material?.fog)),
        defines,
        shaderIdentity,
      ].join(":");
    })
    .join("+");
  const attributes = geometry?.attributes
    ? Object.keys(geometry.attributes).sort().join(",")
    : "";
  return [
    geometry?.uuid ?? object.type,
    attributes,
    Number(Boolean((object as THREE.InstancedMesh).isInstancedMesh)),
    Number(Boolean((object as THREE.SkinnedMesh).isSkinnedMesh)),
    Number(Boolean(mesh.morphTargetInfluences)),
    materialKey,
  ].join("|");
}

async function pacedWarm(
  node: THREE.Object3D,
  label = "",
  root?: RootState,
  generation = loaderGeneration,
) {
  const stationLights = WARM_STATION_LIGHTS.get(node);
  const stale = () => generation !== loaderGeneration || stationLights?.isStale() === true;
  if (stale()) return;
  const reconcileStationLights = () => {
    if (!stale() && stationLights) {
      setStationLights(stationLights.key, node.visible ? stationLights.count : 0);
    }
  };
  const drawables: THREE.Object3D[] = [];
  const mirrors: THREE.Object3D[] = [];
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!(mesh.isMesh || (child as THREE.Points).isPoints || (child as THREE.Line).isLine)) return;
    /* The wet-concrete floor renders the entire shop a second time into its
       own buffer, at its own resolution, every frame it is visible. Left in
       the queue it makes every remaining warm frame expensive; it goes last,
       so it costs exactly one. */
    const material = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as
      | THREE.Material
      | undefined;
    const defines = (material as { defines?: Record<string, unknown> } | undefined)?.defines;
    if (defines && ("USE_BLUR" in defines || "USE_DEPTH" in defines)) mirrors.push(child);
    else drawables.push(child);
  });
  drawables.push(...mirrors);
  if (drawables.length === 0) return;

  /* NO PARKED FAST PATH — it was the page's biggest freeze. The old shortcut
     drew the whole subtree in ONE manual frame while the frameloop was
     parked, on the theory that "nobody can see" those frames. True for the
     shop canvas — but the frame was drawn on the MAIN THREAD, and the reader
     was mid-FILM on that same thread: the profile caught it as a 9.5-second
     dead stop at the film→walk-through handoff on desktop, and as the 1-2.3 s
     hitches sprinkled through the phone film (the shell and opening bays
     paying their bill during act I). Parked warms now run through the same
     self-tuning slicer as live ones. Two parked-specific rules apply inside
     the loop: motion is IGNORED (an invisible canvas cannot jank, so waiting
     for scroll-stillness only starves the warm), and every slice yields a
     real animation frame so the film renders between slices. */
  const parkedNow = () => {
    const live = root?.get ? root.get() : undefined;
    return !!live && live.frameloop === "never";
  };

  /* A PARKED COMPOSER IS AN OVEN, NOT A CINEMA.
     The previous warm-up revealed one more object at full viewport resolution
     per frame. That paid the complete MSAA + AO + bloom + depth-of-field stack
     hundreds of times just to establish a few shared shader programs — 20 to
     40 seconds of duplicate pixels on the measured Radeon.

     While the real canvas is still behind the doorway photograph, submit one
     representative of each geometry/program pair to a postage-stamp HDR/MSAA
     target with the real scene lights and environment. This builds the exact
     buffers and material programs the composer's scene pass consumes without
     needlessly running its full-screen effects for every bay. The production
     composer itself never changes size or quality. */
  const composerTarget = root ? COMPOSER_TARGETS.get(root.gl) : undefined;
  if (parkedNow() && root && composerTarget) {
    // Pay the film one bounded courtesy before borrowing any scene visibility
    // or light-pad slots. A live frame or effect cleanup may run while waiting.
    await waitForReaderQuiet();
    if (stale()) return;
    const was = drawables.map((object) => object.visible);
    const wasCulled = drawables.map((object) => object.frustumCulled);
    const wasGroup = node.visible;
    const unique = new Map<string, THREE.Object3D>();
    for (let i = 0; i < drawables.length; i++) {
      if (!was[i]) continue;
      const key = firstUseKey(drawables[i]);
      if (!unique.has(key)) unique.set(key, drawables[i]);
    }
    const representatives = [...unique.values()];
    const sceneVisibility = new Map<THREE.Object3D, boolean>();
    const started = performance.now();
    const previousTarget = root.gl.getRenderTarget();
    let worstSlice = 0;
    const releaseOvenScene = () => {
      for (const [object, visible] of sceneVisibility) object.visible = visible;
      for (let i = 0; i < drawables.length; i++) {
        drawables[i].visible = was[i];
        drawables[i].frustumCulled = wasCulled[i];
      }
      node.visible = wasGroup;
      reconcileStationLights();
    };
    const isolateOvenScene = () => {
      for (const object of sceneVisibility.keys()) object.visible = false;
      node.visible = true;
      reconcileStationLights();
      for (const drawable of drawables) {
        drawable.visible = false;
        drawable.frustumCulled = false;
      }
    };
    try {
      // Keep the scene's lights, fog and environment intact, but take every
      // unrelated drawable out of this private first-use submission.
      root.scene.traverse((object) => {
        const renderable = object as THREE.Mesh;
        if (!(renderable.isMesh || (object as THREE.Points).isPoints || (object as THREE.Line).isLine)) return;
        sceneVisibility.set(object, object.visible);
        object.visible = false;
      });
      isolateOvenScene();
      let oven = COMPOSER_OVENS.get(root.gl);
      if (!oven) {
        oven = new THREE.WebGLRenderTarget(24, 24, {
          type: composerTarget.texture.type,
          format: composerTarget.texture.format as THREE.PixelFormat,
          colorSpace: composerTarget.texture.colorSpace as THREE.ColorSpace,
          depthBuffer: composerTarget.depthBuffer,
          stencilBuffer: composerTarget.stencilBuffer,
          samples: composerTarget.samples,
        });
        COMPOSER_OVENS.set(root.gl, oven);
      }
      /* Upload/bind in self-tuning slices. Shader programs have already
         completed through the bounded parallel compile; this pass is primarily geometry
         bindings plus a tiny 24px draw. Starting at one forced WebKit to pay
         its browser-frame overhead 121 times for the shell. Cold Apple-like
         runs measured twelve as both faster (27.4s → 18.6–23.0s) and gentler
         on the worst slice (2.9s → 1.2–1.6s). The controller still contracts
         immediately after any expensive batch, and every slice still yields
         so the hero film can paint between them. Full desktop keeps the
         conservative single-object start: its richer material/light graph
         made a twelve-object first batch several seconds long. */
      const OVEN_START_BATCH = phoneTier ? 12 : 1;
      let size = OVEN_START_BATCH;
      let index = 0;
      while (index < representatives.length) {
        if (stale()) return;
        const end = Math.min(index + size, representatives.length);
        for (let i = index; i < end; i++) representatives[i].visible = true;
        const sliceStarted = performance.now();
        root.gl.setRenderTarget(oven);
        root.gl.render(root.scene, root.camera);
        root.gl.setRenderTarget(previousTarget);
        const cost = performance.now() - sliceStarted;
        worstSlice = Math.max(worstSlice, cost);
        if (DEBUG && cost > 400) {
          const sample = representatives.slice(index, end).map((object) => {
            const mesh = object as THREE.Mesh;
            const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
            return `${object.name || object.type}:${mesh.geometry?.getAttribute?.("position")?.count ?? 0}:${material?.type ?? "material"}`;
          });
          console.log(
            `[shop]   ${label || "warm"} heavy oven slice ${Math.round(cost)} ms · ${sample.join(", ")}`,
          );
        }
        for (let i = index; i < end; i++) representatives[i].visible = false;
        index = end;
        if (cost > 70) size = Math.max(1, Math.floor(size / 2));
        else if (cost < 18) size = Math.min(12, size + 2);
        /* The canvas can become active while this queue is yielding. Never
           leave its real scene hidden across a browser frame: release the
        snapshot first, then either stop or re-isolate for the next private
           slice after the frame proves the shop is still parked. */
        releaseOvenScene();
        await nextFrameWithin();
        if (stale()) return;
        if (!parkedNow()) break;
        isolateOvenScene();
      }
    } finally {
      // The old renderer may already have been disposed by the time an
      // awaited frame resumes. Visibility is plain scene state and must be
      // restored; touching that stale GPU context must be avoided.
      if (!stale()) root.gl.setRenderTarget(previousTarget);
      releaseOvenScene();
    }
    if (DEBUG) {
      console.log(
        `[shop]   ${label || "warm"} postage-stamp first use ${Math.round(performance.now() - started)} ms` +
          ` · ${representatives.length}/${drawables.length} unique geometry/program pairs` +
          ` · worst slice ${Math.round(worstSlice)} ms`,
      );
    }
    return;
  }

  const was = drawables.map((object) => object.visible);
  const wasGroup = node.visible;

  /* THE DEADLINE IS THE WHOLE SAFETY PROPERTY.
     This routine hides a subtree and hands it back a few meshes at a time, so
     the driver's shader work is spread over many small frames instead of one
     enormous one. That is a fine mechanism and a terrible contract: the scene
     is INVISIBLE until the loop finishes, so anything that stops the loop
     finishing is a black screen. Which is exactly what shipped — a motion
     signal that never went quiet, nine seconds of patience per slice, and a
     warm-up that would have taken hours, with the shop hidden behind it.
     Now the pacing is a courtesy with a hard time limit. Past it, everything
     is restored and whatever is left compiles the ordinary way, costing a
     frame. A slow frame is a bad moment; an empty shop is a broken site. */
  /* Tighter than the original 6 s / 4 s: on the combined page bays stream
     while the reader may already be walking the runway, and a deadline break
     is benign now — everything is restored and shown, and what has not been
     translated yet compiles on live frames. Populated-but-momentarily-janky
     beats a bay that is still invisible when the camera arrives.
     PARKED warms get a long leash instead: the reader is still up in the film,
     nothing is waiting on this bay, and breaking early would only move the
     untranslated remainder onto the reader's arrival frame — the exact stall
     this file exists to prevent. */
  const deadline = performance.now() + (parkedNow() ? 20000 : phoneTier ? 2500 : 3000);
  const restore = () => {
    for (let k = 0; k < drawables.length; k++) {
      drawables[k].visible = was[k];
      PACED_HIDDEN.delete(drawables[k]);
    }
    node.visible = wasGroup;
    reconcileStationLights();
  };

  try {
    for (const object of drawables) {
      object.visible = false;
      // The ownership mark prevents the detail cull from touching a drawable
      // until this warm has restored the exact state it received.
      PACED_HIDDEN.set(object, performance.now());
    }
    node.visible = true;
    reconcileStationLights();

  const step = () => {
    try {
      /* Scoped to OUR root. The combined page runs a second R3F canvas (the
         hero film); a bare `advance(t)` steps EVERY root, so each warm slice
         was also re-rendering the film's scene — paying its full frame cost
         again per slice, on the thread the slices are already squeezing. */
      advance(performance.now(), true, root);
    } catch {
      /* the loop is not running yet; the shell warm will cover this */
    }
  };

  /* While the frameloop is LIVE, the warm must not hand-render at all: a
     manual advance interleaved with the running loop can leave a half-built
     composer frame on screen for as long as the slice blocks the thread —
     the probe caught it as a full-viewport white wash. Instead the batch is
     made visible and the LIVE loop draws it on its own next frame; waiting
     for that frame doubles as the cost measurement. */
  const liveNow = () => {
    const live = root?.get ? root.get() : undefined;
    return !!live && live.frameloop !== "never";
  };
  const nextFrame = () => nextFrameWithin();

  /* SELF-TUNING BATCH SIZE.
     A fixed batch is a guess about a machine you have never met. Six meshes is
     nothing on a desktop and, when those six happen to introduce five new
     shader programs to a phone's driver, it is a three-and-a-half-second
     frame — which a profile caught, with a finger on the glass.
     So the loop watches itself: it aims for a slice that costs about a frame,
     halves the batch whenever it overshoots, and grows it back slowly when the
     work turns out to be cheap. It ends up small exactly where the work is
     expensive and large where it is not, on hardware nobody tested it on. */
  /* START AT ONE AND EARN THE REST.
     A controller that starts optimistic pays for its optimism with a real
     stall before it corrects — the profile caught a 2.6-second slice being
     followed, too late, by "batch 1". Starting at a single mesh means the
     first slice cannot hurt, and the loop grows only where the evidence says
     there is headroom. On a desktop it reaches its ceiling within a second;
     on a phone in a heavy bay it simply never does, which is the right
     answer. */
  const BUDGET = 120;
  let size = 1;
  let i = 0;

    while (i < drawables.length) {
      if (stale()) break;
      if (performance.now() > deadline) {
        if (DEBUG) {
          console.log(
            `[shop]   ${label || "warm"} hit its deadline with ${drawables.length - i} left — showing everything`,
          );
        }
        break;
      }

      // Wait for the reader to stop — unless the canvas is PARKED, where an
      // invisible scene cannot jank and waiting for scroll-stillness only
      // starves the warm (the film scroll never goes quiet). If the reader
      // never stops on a LIVE canvas, the work still has to happen, so it goes
      // ahead one mesh at a time: thin enough that a forced slice costs a frame.
      const parked = parkedNow();
      const idle = parked ? true : await untilIdle();
      if (stale()) break;
      const take = idle ? size : 1;
      for (let k = i; k < Math.min(i + take, drawables.length); k++) {
        drawables[k].visible = was[k];
        PACED_HIDDEN.delete(drawables[k]);
      }
      i += take;

      const started = performance.now();
      if (liveNow()) await nextFrame();
      else step();
      if (stale()) break;
      const cost = performance.now() - started;

      if (idle) {
        /* Parked slices share the thread with the FILM's render loop, so they
           tune against a tighter budget: ~60 ms keeps the film above 15fps in
           the worst slice and typically far better, where 120 ms would read as
           visible film stutter. */
        const budget = parked ? 60 : BUDGET;
        if (cost > budget) size = Math.max(1, Math.floor(size / 2));
        else if (cost < budget / 3) size = Math.min(12, size + 2);
      }
      if (DEBUG && cost > 400) {
        console.log(`[shop]   ${label || "warm"} slice ${Math.round(cost)} ms → batch ${size}`);
      }
      /* Parked: hand the thread a real animation frame so the film renders
         between slices — that yield IS the fix for the 9.5 s handoff freeze. */
      if (parked) await nextFrame();
      else await wait(idle ? 0 : 16);
      if (stale()) break;
    }
  } finally {
    // This is the visibility contract. Exceptions, deadline exits, context
    // interruptions and successful completion all restore the same snapshot.
    restore();
  }
}


export function StationBundle({
  station,
  warmKey = String(station),
  children,
}: {
  station: number;
  warmKey?: string;
  children: ReactNode;
}) {
  const allowed = useSyncExternalStore(
    subscribeStream,
    () => station < unlocked,
    () => station < OPENING,
  );

  /* MOUNTING IS WORK TOO — and it was the last thing still landing mid-swipe.
     A bay is a couple of hundred objects, and React builds all of them in one
     commit: geometry, materials, matrices, the lot. Warming it was already
     paced and gated; CREATING it was not, so a bay unlocking while a thumb was
     moving cost seconds in a single block. The opening bay goes up
     immediately — nothing is on screen yet to disturb — and every later bay
     waits for the reader to be still. */
  const [mounted, setMounted] = useState(station < OPENING);

  useEffect(() => {
    if (!allowed || mounted) return;
    let dead = false;
    /* 2.5 s, not 9: with the motion signal now honestly fed by the page,
       a reader mid-scroll could hold every mount hostage for nine seconds a
       bay. A short courtesy pause is all the protection mounting needs — the
       heavy half (the warm) is serialized and paced separately. */
    void untilIdle(phoneTier ? 800 : 2500).then(() => {
      if (!dead) setMounted(true);
    });
    return () => {
      dead = true;
    };
  }, [allowed, mounted]);

  if (!allowed || !mounted) return null;
  return (
    <BayBoundary station={station} warmKey={warmKey}>
      <Suspense fallback={null}>
        <WarmStation station={station} warmKey={warmKey}>{children}</WarmStation>
      </Suspense>
    </BayBoundary>
  );
}

/**
 * ONE BAD MODEL MUST NOT TAKE THE SHOP WITH IT.
 *
 * A file that fails to parse throws out of the loader, through Suspense, and
 * — with nothing to catch it — unmounts the entire Canvas: renderer disposed,
 * context gone, a black page where a garage was. That is precisely what a
 * single unhappy .glb did here, five seconds into every load, and the symptom
 * (an empty page) looked nothing like the cause.
 *
 * A bay that cannot load is now a bay that is missing. The other six, the
 * building, and the film all carry on, and the gate still opens for the next
 * one so the stream never stalls behind it.
 */
class BayBoundary extends Component<
  { station: number; warmKey: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn(`[shop] bay ${this.props.station} failed to load — carrying on`, error);
    // Do not strand the queue behind a bay that will never arrive.
    openGate(this.props.station + 2);
    reportWarm(this.props.warmKey);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/**
 * One bay: compiled off-frame, then drawn only while the camera is near it.
 *
 * Visibility is written from `useFrame` on a ref — never React state. A bay
 * going out of view must cost one boolean, not a re-render of the scene graph.
 */
/* ── Detail cull ────────────────────────────────────────────────────────────
   A bay is roughly two hundred separate objects and a phone was submitting
   five hundred draw calls a frame to render one of them properly. Most of that
   is clutter the frame cannot resolve: a wrench on a bench eight metres back
   is four pixels across on a 390-point screen, behind fog, and it costs the
   same call as the car it is standing next to.

   So each object is measured once, when its bay warms — where it is, and how
   big — and after that a single divide per object decides whether it is worth
   drawing: projected size below about two pixels and it sits the frame out.
   The subject of the orbit is always metres wide and metres away, so it never
   qualifies; the clutter around it drops out exactly as the camera pulls back
   from it and returns as the camera comes in. */

type Cullable = {
  object: THREE.Object3D;
  centre: THREE.Vector3;
  maxDistanceSquared: number;
};

/** Projected radius, as a fraction of the distance. ~2 px on a 390 screen. */
const CULL_RATIO = 0.006;
/** 2.5 cm of accumulated camera travel cannot move a 2 px cull boundary by a
 * visible amount, but skipping that interval removes idle full-list scans. */
const CULL_MOVE_EPSILON_SQUARED = 0.000625;

/**
 * Build the cull index WITHOUT eating a frame.
 *
 * Measuring an object means computing its geometry's bounding sphere, which
 * walks every vertex it has. Doing that for the whole building in one go —
 * inside a frame callback, which is where the first version did it — is a
 * seven-second stall: the single worst frame left in the mobile profile, and
 * it fired the moment the cull switched on.
 *
 * So it is built a slice at a time, off the animation loop, and the cull
 * simply does not run until the index is ready.
 */
async function collectCullables(
  node: THREE.Object3D,
  onDone: (list: Cullable[]) => void,
) {
  const meshes: THREE.Mesh[] = [];
  node.updateMatrixWorld(true);
  node.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) meshes.push(mesh);
  });

  const list: Cullable[] = [];
  const scale = new THREE.Vector3();
  for (let i = 0; i < meshes.length; i++) {
    const mesh = meshes[i];
    const instanced = mesh as THREE.InstancedMesh;
    let sphere: THREE.Sphere | null;
    if (instanced.isInstancedMesh) {
      if (!instanced.boundingSphere) instanced.computeBoundingSphere();
      sphere = instanced.boundingSphere;
    } else {
      if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
      sphere = mesh.geometry.boundingSphere;
    }
    if (sphere) {
      const centre = sphere.center.clone().applyMatrix4(mesh.matrixWorld);
      // Uniform-ish scale is a fair assumption for placed props; take the
      // largest axis so nothing is culled for being thin.
      scale.setFromMatrixScale(mesh.matrixWorld);
      const radius = sphere.radius * Math.max(scale.x, scale.y, scale.z);
      if (radius > 0) {
        const maxDistance = radius / CULL_RATIO;
        list.push({ object: mesh, centre, maxDistanceSquared: maxDistance * maxDistance });
      }
    }
    // A slice per tick: forty objects is well under a frame even on a phone.
    if (i % 40 === 39) await wait(0);
  }
  onDone(list);
}

/**
 * The same cull, for the building itself.
 *
 * The bays are only half the draw calls: the shell is hand-built from
 * primitives — girts, conduit, brackets, bolts, ceiling runs, the yard outside
 * — and the far half of a sixty-eight metre shop contributes a few hundred
 * calls' worth of objects that land on one or two pixels each. Same rule, same
 * measurement, applied once the shell has stopped growing.
 */
export function DetailCull({ target }: { target: React.RefObject<THREE.Object3D | null> }) {
  const items = useRef<Cullable[] | null>(null);
  const building = useRef(false);
  const tick = useRef(0);
  const ready = useRef(false);
  const lastCullEye = useRef(new THREE.Vector3(Infinity, Infinity, Infinity));

  /* WAIT FOR THE WARM-UP TO BE DONE WITH THE SCENE, NOT FOR A GUESS.
     This armed on a fixed 2.5-second timer while the shell's paced warm-up runs
     to a 4-second deadline — so for ~1.5 seconds two mechanisms were writing
     `visible` on the same subtree with opposite intentions, and the cull's
     bulk-unhide handed the driver exactly the shader storm the pacing exists to
     prevent. The warm-up already announces when it is finished; use that. */
  useEffect(() => subscribeBoot((s) => {
    if (s.warm) ready.current = true;
  }), []);

  useFrame((state) => {
    if (!phoneTier || !ready.current) return;
    const node = target.current;
    if (!node) return;
    if (++tick.current % 3 !== 0) return;
    if (!items.current) {
      if (!building.current) {
        building.current = true;
        void collectCullables(node, (list) => {
          items.current = list;
        });
      }
      return;
    }
    const eye = state.camera.position;
    if (eye.distanceToSquared(lastCullEye.current) < CULL_MOVE_EPSILON_SQUARED) return;
    lastCullEye.current.copy(eye);
    for (const item of items.current) {
      // Anything the warm-up is still holding is not ours to show.
      if (PACED_HIDDEN.has(item.object)) continue;
      item.object.visible = item.centre.distanceToSquared(eye) < item.maxDistanceSquared;
    }
  });

  return null;
}

function WarmStation({
  station,
  warmKey,
  children,
}: {
  station: number;
  warmKey: string;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const warm = useRef(false);
  const lights = useRef(0);
  const drawn = useRef(false);
  const cullables = useRef<Cullable[] | null>(null);
  const building = useRef(false);
  const cullTick = useRef(0);
  const lastCullEye = useRef(new THREE.Vector3(Infinity, Infinity, Infinity));
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  const get = useThree((state) => state.get);

  useEffect(() => {
    const node = group.current;
    // A subtree that suspends again — a late texture, a second model — has its
    // effects torn down and re-run by React. The work is already done.
    if (!node || warm.current) return;
    let dead = false;

    /* ONE FINISH, NOT TWO.
       `finish` is called from the warm-up's completion AND from a failsafe
       timer, and it awaits before setting `warm.current` — so both could be
       inside it at once. Two concurrent passes over the same bay is not a
       harmless duplicate: each snapshots the subtree's visibility on entry, so
       the second snapshots the first one's HIDDEN state and then faithfully
       restores it, writing `false` across the whole bay and clearing the marks
       the watchdog looks for. A permanently invisible bay, produced by two
       copies of the code that exists to make it visible. */
    let finishing = false;
    let readyFailsafe = 0;
    const generation = loaderGeneration;
    const stale = () => dead || generation !== loaderGeneration;
    const releaseNextGate = createStationRelease({
      isStale: stale,
      release: () => openGate(station + 2),
    });

    const finish = async () => {
      if (stale() || finishing || warm.current) return;
      finishing = true;
      // Downloads and compile may finish out of order, but exact first-use is
      // the camera frontier. A later bay claiming the private composer queue
      // first can keep the camera at station two while copy is already talking
      // about station five. Advance this final ownership step linearly; the
      // wait is bounded so one broken bay can never strand the rest.
      if (station > 0) await waitForWarmKey(String(station - 1), 30000);
      if (stale()) return;
      armReadyFailsafe();
      await firstUse();
      if (stale()) return;
      warm.current = true;
      reportWarm(warmKey);
    };
    const armReadyFailsafe = () => {
      if (readyFailsafe || stale() || warm.current) return;
      // The exact models, textures, and base programs are now present. Bound
      // only the optional private first-use proof; never promote a station
      // while its lossless subtree is still uploading or compiling.
      readyFailsafe = window.setTimeout(() => {
        if (stale() || warm.current) return;
        releaseNextGate();
        warm.current = true;
        reportWarm(warmKey);
      }, STATION_READY_FAILSAFE_MS);
    };

    /* THE LAST HIDDEN COST: first USE, as opposed to first compile.
       `compile()` builds the programs a bay needs to be drawn — but the
       ambient-occlusion pass draws the building a second time through its own
       depth material, and those programs do not exist until a frame actually
       renders the bay. Waiting for the reader to arrive means paying for them
       inside the frame they arrive on.
       So one frame is rendered here, by hand, in a timer: the bay is switched
       on with frustum culling disabled so nothing can skip it, the frame is
       advanced, and everything is put back. Off the animation loop, before the
       camera is anywhere near, and invisible — the bay is drawn to a part of
       the frame that is not on screen. */
    /* A bay used to be drawn once into a private render target here, to force
       the driver to build its programs before the reader arrived. It has been
       removed: by the time a bay streams in, the render loop is LIVE, and
       reaching in to swap the render target and draw a frame from outside that
       loop — while the post-processing composer holds its own state — killed
       the renderer process about thirty-five seconds into every visit. The
       shell's warm-up (which runs with the loop parked, where this is safe)
       already builds almost every program a bay needs; what is left compiles on
       arrival in single figures. Correctness beats the last few milliseconds. */
    const firstUse = async () => {
      const node = group.current;
      if (!node) return;
      // pacedWarm reconciles this bay's pad slots with its real visibility
      // around each private draw and restores them before yielding. Claiming
      // slots here, before awaiting the queue, compiled a later gallery with
      // one fewer light and forced a new shader on that gallery's first draw.
      // Pay the bay's shaders through the composer now, in slices, while the
      // camera is still two stations away — rather than in one lump on the
      // frame the reader scrolls into it.
      try {
        await warmThroughComposer(node, `station ${station}`, get());
      } catch {
        // The finally-equivalent state below must still restore the light pad.
      }
      if (stale()) return;
      const near = Math.abs(stationAt(camera) - station) < drawSpan();
      node.visible = near;
      drawn.current = near;
      setStationLights(String(station), near ? lights.current : 0);
    };


    /* ON A PHONE, A DROPLIGHT IS A GLOWING BULB AND NOTHING MORE.
       Every real point light in the scene is another iteration of the shader's
       light loop, run for every lit fragment on the screen — the one cost that
       scales with both the size of the scene AND the size of the display.
       The bays carry nine between them; the bulb geometry, its emissive glow
       and the pool of light painted on the concrete are all still there, so
       what goes missing is a metre of falloff on a lamp the phone frame is
       showing at the size of a thumbnail. */
    if (phoneTier) {
      node.traverse((child) => {
        if ((child as THREE.PointLight).isPointLight) child.visible = false;
      });
      lights.current = 0;
    } else {
      // How many point lights this bay brings. The pad hands back the same
      // number of its own the instant these come on, so the count the shaders
      // were compiled against never moves. See `shop/lights.ts`.
      lights.current = countLights(node);
    }

    WARM_STATION_LIGHTS.set(node, { key: String(station), count: lights.current, isStale: stale });


    const started = performance.now();
    warmSubtree(gl, node, camera, scene, stale).then(() => {
      if (stale()) return;
      if (DEBUG) {
        console.log(
          `[shop] station ${station} warm in ${Math.round(performance.now() - started)} ms` +
            ` · lights ${lights.current} · programs ${gl.info.programs?.length ?? 0}` +
            ` · pad ${lightBudget()}`,
        );
      }
      /* Release only the DOWNLOAD/MOUNT credit now that this bay has finished
         texture upload and shader compile. Exact geometry first-use remains
         serialized by finish(), but it must not prevent the next files from
         crossing the network: two bays ahead on a phone, one on desktop. */
      // One completed bay earns exactly one look-ahead bay on every device.
      // Phones used to open two, creating more cellular and parse contention
      // than the desktop path.
      releaseNextGate();
      void finish();
    }).catch((error) => {
      if (stale()) return;
      if (DEBUG) console.warn(`[shop] station ${station} warm failed`, error);
      releaseNextGate();
      void finish();
    });
    // A driver that never reports its base compile cannot hold later model
    // downloads. Readiness itself remains behind `armReadyFailsafe`, which is
    // installed only after this subtree settles and its predecessor clears.
    const failsafe = window.setTimeout(() => {
      releaseNextGate();
    }, 9000);

    return () => {
      dead = true;
      window.clearTimeout(failsafe);
      window.clearTimeout(readyFailsafe);
    };
  }, [gl, camera, scene, station, warmKey, get]);

  useEffect(
    () => () => {
      // Unmounting a bay takes its lights with it — hand the slots back.
      setStationLights(String(station), 0);
    },
    [station],
  );

  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    const show =
      warm.current && Math.abs(stationAt(state.camera) - station) < drawSpan();

    // The detail cull, on the phone tier, every third frame — the camera is
    // damped and heavy, so nothing can cross two pixels of apparent size in
    // the fiftieth of a second between passes.
    if (phoneTier && show && warm.current && ++cullTick.current % 3 === 0) {
      if (!cullables.current && !building.current) {
        building.current = true;
        void collectCullables(node, (list) => {
          cullables.current = list;
        });
      }
      const list = cullables.current;
      if (list) {
        const eye = state.camera.position;
        const stationary =
          eye.distanceToSquared(lastCullEye.current) < CULL_MOVE_EPSILON_SQUARED;
        if (!stationary) {
          lastCullEye.current.copy(eye);
          for (const item of list) {
            item.object.visible = item.centre.distanceToSquared(eye) < item.maxDistanceSquared;
          }
        }
      }
    }

    // Suspense can replace the Three group while this component's refs
    // survive. The new group starts visible=false even when our cached draw
    // decision is still true, so reconcile the real object before the cheap
    // early return or a fully warm bay can remain invisible forever.
    if (node.visible !== show) node.visible = show;
    // A private warm may have borrowed slots since the previous visible
    // frame, even when this frame's cached show decision has not changed.
    // Reconcile on this same stack before the renderer consumes the lights.
    setStationLights(String(station), show ? lights.current : 0);
    if (show === drawn.current) return;
    drawn.current = show;
  });

  return (
    <group ref={group} visible={false} name={`bay-${station}`}>
      {children}
    </group>
  );
}

/**
 * The same warm-then-show treatment for anything outside a station bundle —
 * the shell, the weather, the neon. Reports itself to the boot channel, so the
 * plate at the door holds until the room it is hiding is genuinely ready.
 */
/* Re-measured from the full 2026-08-25 stream: stations 1 (2), 2 (1), 3 (1)
   and 4 (1) — five real bay point lights across all seven stations. The old
   budget of ten was stale scene history; it doubled every material shader's
   light loop and turned cold ANGLE compilation into a 24-second doorway wait
   without illuminating one extra pixel. Five preserves every real light. The
   pool grows (and warns under `?perf`) if a future bay adds another. */
export function WarmScene({
  target,
  lighting,
  padLights = 5,
  composer,
}: {
  /** The building itself — everything that is NOT a streaming bay. */
  target: React.RefObject<THREE.Object3D | null>;
  /** Original ambient fixture materials, outside the shell's neutral-map unification. */
  lighting?: React.RefObject<THREE.Object3D | null>;
  padLights?: number;
  composer?: React.RefObject<ComposerHandle | null>;
}) {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  const get = useThree((state) => state.get);

  // Before the first compile, not after: the pad has to be part of the light
  // count the very first program is built against.
  installLightPad(scene, padLights, (total) => {
    if (DEBUG) console.warn(`[shop] light pad grew to ${total} — raise padLights`);
  });

  useEffect(() => {
    let dead = false;
    const generation = loaderGeneration;
    const stale = () => dead || generation !== loaderGeneration;
    const finalizer = async () => {
      if (stale()) throw new Error("shop warm scene unmounted before final frame");
      await waitForReaderQuiet();
      if (stale()) throw new Error("shop warm scene superseded before final frame");
      const root = get();
      const started = performance.now();
      // Two completed frames: the first allocates/initialises any private pass
      // state the material compiler cannot see; the second proves the chain can
      // consume that state and reach the canvas before the photo dissolves.
      advance(performance.now(), true, root);
      await nextFrameWithin();
      if (stale()) throw new Error("shop warm scene superseded during final frame");
      advance(performance.now(), true, root);
      if (DEBUG) {
        console.log(
          `[shop] final full-composer verification ${Math.round(performance.now() - started)} ms`,
        );
      }
    };
    setWorldFinalizer(finalizer);
    const finish = async () => {
      if (stale()) return;
      for (let attempt = 1; attempt <= SHELL_FINALIZER_ATTEMPTS; attempt++) {
        try {
          // Prove the exact full-size composer as soon as the shell is warm.
          // This starts the real render loop behind a partially open photographic
          // safety layer; the final dissolve still waits for station zero.
          await finalizer();
          if (stale() || worldFinalizer !== finalizer) return;
          finalizedWorld = finalizer;
          markShellWarm();
          reportWarm("shell");
          return;
        } catch (error) {
          if (stale() || worldFinalizer !== finalizer) return;
          if (DEBUG) {
            console.warn(`[shop] shell composer proof ${attempt} failed`, error);
          }
          if (attempt < SHELL_FINALIZER_ATTEMPTS) {
            await wait(SHELL_FINALIZER_RETRY_DELAY_MS * attempt);
          }
        }
      }
      // Keep the finished photograph. Revealing an unverified renderer is
      // never a recovery path; the bounded attempts remain visible under perf.
    };

    /* THE PASSES COMPILE TOO — and `gl.compile` cannot reach them.
       Screen-space AO renders the building again through a depth material, and
       every effect in the chain (bokeh, blur, luminance, the merged effect
       shader) is a program of its own. None of them exist until a frame has
       actually gone through the composer, which is why the first frame after
       the shell was warmed still cost nine seconds.
       So the frames are stepped by hand, here, with the renderer still parked
       and the plate still up: three manual advances and the entire pipeline —
       geometry, depth variants, post chain, render targets — is built. What
       the reader sees when the door rolls up is the fourth frame, not the
       first. */
    const warmShell = async () => {
      const mark = (label: string, from: number) => {
        if (DEBUG) console.log(`[shop]   ${label} ${Math.round(performance.now() - from)} ms`);
        return performance.now();
      };
      let t = performance.now();
      await warmComposerPrograms(gl, composer, stale);
      if (stale()) return;
      t = mark("async post compile", t);
      await primeEnvironment(get(), stale);
      await waitForEnvironmentWarmup(gl);
      if (stale()) return;
      t = mark("environment prime", t);
      // Ambience lives beside the shell and bays. Its cylinder/cone fixture
      // materials otherwise first link in the final full-size frame (~680 ms
      // on the measured ANGLE run). Submit the exact original shaders now;
      // warmUp restores framebuffer state before yielding, so the driver's
      // compile can overlap the shell's settle/texture pass safely. Do not
      // unify these materials or change their maps, lights, or appearance.
      const lightingWarm = lighting?.current
        ? warmUp(gl, lighting.current, camera, scene, stale)
        : Promise.resolve();
      await warmSubtree(gl, target.current ?? scene, camera, scene, stale);
      await lightingWarm;
      if (stale()) return;
      t = mark("settle+compile", t);
      // Cheap first: the whole building drawn to a postage stamp, which pays
      // most of the driver's translation bill without submitting a frame's
      // worth of work in one go.
      /* No oven pass for the shell: measured, its programs are not the ones
         the composer ends up using (a scene rendered straight to a plain
         target is a different configuration to one rendered through an HDR
         post chain), so it was two seconds spent building programs that were
         then built again. The bays still use it — theirs mostly hit programs
         the shell has already paid for. */

      /* AND THE SAME AGAIN, THROUGH THE COMPOSER — using the one implementation.
         Drawing to a plain render target is not the configuration the shop ships
         in: the post chain renders into an HDR buffer, and Direct3D treats that
         as a different program for every material it touches, so the first
         composed frame was linking thirty-odd programs in a single command
         buffer. This used to be a second, hand-tuned copy of the bay warm-up
         with its own magic batch number; both are now the same self-tuning
         loop, so a fix to one can never again miss the other. */
      await warmThroughComposer(target.current ?? scene, "shell", get());
      if (stale()) return;
      releaseEnvironmentWarmup(gl);
      mark("composer warm", t);
    };
    const started = performance.now();
    const start = window.setTimeout(() => {
      warmShell().then(() => {
        if (stale()) return;
        if (DEBUG) {
          console.log(
            `[shop] shell warm in ${Math.round(performance.now() - started)} ms` +
              ` · programs ${gl.info.programs?.length ?? 0} · pad ${lightBudget()}`,
          );
        }
        void finish();
      }).catch((error) => {
        if (DEBUG && !stale()) console.warn("[shop] shell warm failed", error);
      });
    }, 60);
    return () => {
      dead = true;
      if (worldFinalizer === finalizer) setWorldFinalizer(null);
      if (finalizedWorld === finalizer) finalizedWorld = null;
      if (generation === loaderGeneration) {
        revealFinalizing = null;
        if (revealRetryTimer) window.clearTimeout(revealRetryTimer);
        revealRetryTimer = 0;
      }
      window.clearTimeout(start);
    };
  }, [gl, camera, scene, get, composer, target, lighting]);

  return null;
}
