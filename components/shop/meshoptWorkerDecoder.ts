import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

export type MeshoptDecodeRequest = {
  id: number;
  count: number;
  size: number;
  source: Uint8Array;
  mode: string;
  filter?: string;
};

export type MeshoptDecodeResponse =
  | { id: number; ok: true; value: Uint8Array }
  | { id: number; ok: false; error: string };

export type MeshoptWorkerLike = {
  onmessage: ((event: MessageEvent<MeshoptDecodeResponse>) => void) | null;
  onerror: ((event: { error?: unknown; message?: string }) => void) | null;
  postMessage: (message: MeshoptDecodeRequest, transfer: Transferable[]) => void;
  terminate: () => void;
};

type PendingDecode = {
  count: number;
  size: number;
  source: Uint8Array;
  mode: string;
  filter?: string;
  slot?: WorkerSlot;
  timer?: unknown;
  resolve: (value: Uint8Array) => void;
  reject: (error: unknown) => void;
};

type WorkerSlot = {
  worker: MeshoptWorkerLike;
  pending: number;
};

export type CancellableMeshoptDecoder = {
  supported: true;
  ready: Promise<void>;
  decodeGltfBufferAsync: (
    count: number,
    size: number,
    source: Uint8Array,
    mode: string,
    filter?: string,
  ) => Promise<Uint8Array>;
};

export type MeshoptWorkerController = {
  decoder: CancellableMeshoptDecoder;
  fallbackToLocal: (reason?: unknown) => void;
  cancel: (reason?: unknown) => void;
  pendingCount: () => number;
};

export type MeshoptWorkerClock = {
  set: (callback: () => void, delay: number) => unknown;
  clear: (handle: unknown) => void;
};

export type MeshoptLocalDecoder = (
  count: number,
  size: number,
  source: Uint8Array,
  mode: string,
  filter?: string,
) => Uint8Array | Promise<Uint8Array>;

const DEFAULT_CLOCK: MeshoptWorkerClock = {
  set: (callback, delay) => globalThis.setTimeout(callback, delay),
  clear: (handle) => globalThis.clearTimeout(handle as ReturnType<typeof globalThis.setTimeout>),
};

const decodeLocally: MeshoptLocalDecoder = (
  count,
  size,
  source,
  mode,
  filter,
) => {
  const value = new Uint8Array(count * size);
  MeshoptDecoder.decodeGltfBuffer(value, count, size, source, mode, filter);
  return value;
};

const createBrowserWorker = () =>
  new Worker(new URL("./meshoptDecode.worker.ts", import.meta.url), {
    type: "module",
    name: "2240-meshopt",
  }) as unknown as MeshoptWorkerLike;

/**
 * A tiny Meshopt pool whose outstanding decoder promises can actually reject.
 * Three's bundled pool closes workers without settling their request map;
 * cancelling here releases the GLTF parser and exact source bytes before a
 * local fallback or replacement Canvas is allowed into the global parse lane.
 */
export function createMeshoptWorkerDecoder({
  count = 2,
  decodeTimeoutMs = 15_000,
  createWorker = createBrowserWorker,
  clock = DEFAULT_CLOCK,
  localReady = MeshoptDecoder.ready,
  decodeLocal = decodeLocally,
  onFallback,
}: {
  count?: number;
  decodeTimeoutMs?: number;
  createWorker?: () => MeshoptWorkerLike;
  clock?: MeshoptWorkerClock;
  localReady?: Promise<unknown>;
  decodeLocal?: MeshoptLocalDecoder;
  onFallback?: (reason: unknown) => void;
} = {}): MeshoptWorkerController {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("Meshopt worker count must be a positive integer");
  }

  const slots: WorkerSlot[] = [];
  const pending = new Map<number, PendingDecode>();
  let nextId = 0;
  let state: "worker" | "local" | "cancelled" = "worker";

  const clearRequestTimer = (request: PendingDecode) => {
    if (request.timer !== undefined) clock.clear(request.timer);
    request.timer = undefined;
  };

  const settle = (
    id: number,
    action: (request: PendingDecode) => void,
  ) => {
    const request = pending.get(id);
    if (!request) return;
    pending.delete(id);
    clearRequestTimer(request);
    if (request.slot) {
      request.slot.pending = Math.max(0, request.slot.pending - request.count);
    }
    action(request);
  };

  const startLocal = (id: number) => {
    // Look the request up only after WASM readiness. Cancellation can then
    // clear its bytes before readiness settles, and no old-Canvas decode wakes
    // outside the scheduler's global lane.
    void localReady.then(async () => {
      const request = pending.get(id);
      if (!request || state === "cancelled") return null;
      return decodeLocal(
        request.count,
        request.size,
        request.source,
        request.mode,
        request.filter,
      );
    }).then(
      (value) => {
        if (value) settle(id, (current) => current.resolve(value));
      },
      (error) => settle(id, (current) => current.reject(error)),
    );
  };

  const fallbackToLocal = (
    reason: unknown = new Error("Meshopt worker decode timed out"),
  ) => {
    if (state !== "worker") return;
    state = "local";
    for (const slot of slots) {
      slot.worker.terminate();
      slot.pending = 0;
    }
    try {
      onFallback?.(reason);
    } catch {
      // Exact local decode remains authoritative even if diagnostics fail.
    }
    for (const [id, request] of pending) {
      clearRequestTimer(request);
      request.slot = undefined;
      startLocal(id);
    }
  };

  const cancel = (reason: unknown = new Error("Meshopt worker decode cancelled")) => {
    if (state === "cancelled") return;
    state = "cancelled";
    const error = reason instanceof Error ? reason : new Error(String(reason));
    for (const slot of slots) slot.worker.terminate();
    for (const request of pending.values()) {
      clearRequestTimer(request);
      request.reject(error);
    }
    pending.clear();
    for (const slot of slots) slot.pending = 0;
  };

  try {
    for (let index = 0; index < count; index++) {
      const worker = createWorker();
      const slot: WorkerSlot = { worker, pending: 0 };
      worker.onmessage = ({ data }) => {
        if (state !== "worker") return;
        if (data.ok) settle(data.id, (request) => request.resolve(data.value));
        else settle(data.id, (request) => request.reject(new Error(data.error)));
      };
      worker.onerror = (event) => {
        fallbackToLocal(event.error ?? new Error(event.message || "Meshopt worker failed"));
      };
      slots.push(slot);
    }
  } catch (error) {
    for (const slot of slots) slot.worker.terminate();
    throw error;
  }

  const decoder: CancellableMeshoptDecoder = {
    supported: true,
    ready: Promise.resolve(),
    decodeGltfBufferAsync(count, size, source, mode, filter) {
      if (state === "cancelled") return Promise.reject(new Error("Meshopt worker pool is closed"));
      const id = ++nextId;
      return new Promise<Uint8Array>((resolve, reject) => {
        const request: PendingDecode = {
          count,
          size,
          source,
          mode,
          filter,
          resolve,
          reject,
        };
        pending.set(id, request);
        if (state === "local") {
          startLocal(id);
          return;
        }
        const slot = slots.reduce((best, candidate) =>
          candidate.pending < best.pending ? candidate : best,
        );
        request.slot = slot;
        slot.pending += count;
        request.timer = clock.set(() => {
          fallbackToLocal(new Error(`Meshopt worker decode exceeded ${decodeTimeoutMs} ms`));
        }, decodeTimeoutMs);
        // Transfer a private copy. GLTFLoader retains its source buffer for
        // the exact in-parser local fallback and never sees a detached buffer.
        const payload = new Uint8Array(source);
        try {
          slot.worker.postMessage(
            { id, count, size, source: payload, mode, filter },
            [payload.buffer],
          );
        } catch (error) {
          fallbackToLocal(error);
        }
      });
    },
  };

  return {
    decoder,
    fallbackToLocal,
    cancel,
    pendingCount: () => pending.size,
  };
}
