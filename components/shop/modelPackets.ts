export type ModelPacketEntry = Readonly<{
  name: string;
  offset: number;
  length: number;
  sha256: string;
}>;

export type ModelPacketDescriptor = Readonly<{
  decodedLength: number;
  entries: readonly ModelPacketEntry[];
}>;

export const MAX_PACKET_DECODED_BYTES = 1024 * 1024;

/** Extract original GLBs only after the complete bounded packet is verified.
 * Returned buffers own their bytes: parsing one model cannot keep the entire
 * packet alive or mutate a neighbour. No scene or image processing occurs. */
export async function decodeModelPacket(
  bytes: ArrayBuffer,
  descriptor: ModelPacketDescriptor,
): Promise<Map<string, ArrayBuffer>> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle || typeof subtle.digest !== "function") {
    throw new Error("Model packet verification unavailable");
  }
  if (
    !(bytes instanceof ArrayBuffer) ||
    !descriptor ||
    !Number.isSafeInteger(descriptor.decodedLength) ||
    descriptor.decodedLength < 12 ||
    descriptor.decodedLength > MAX_PACKET_DECODED_BYTES ||
    descriptor.decodedLength !== bytes.byteLength ||
    !Array.isArray(descriptor.entries) ||
    descriptor.entries.length === 0
  ) {
    throw new Error("Invalid model packet size or manifest");
  }
  let end = 0;
  const names = new Set<string>();
  for (const entry of descriptor.entries) {
    if (
      !entry || !/^[a-z0-9][a-z0-9._-]*\.glb$/.test(entry.name) ||
      names.has(entry.name) || !/^[a-f0-9]{64}$/.test(entry.sha256) ||
      !Number.isSafeInteger(entry.offset) || entry.offset !== end ||
      !Number.isSafeInteger(entry.length) || entry.length < 12 ||
      entry.length % 4 !== 0 || entry.length > bytes.byteLength - entry.offset
    ) {
      throw new Error("Invalid model packet entry");
    }
    names.add(entry.name);
    end += entry.length;
    const header = new DataView(bytes, entry.offset, 12);
    if (
      header.getUint32(0, true) !== 0x46546c67 ||
      header.getUint32(4, true) !== 2 ||
      header.getUint32(8, true) !== entry.length
    ) {
      throw new Error(`Invalid GLB header in model packet: ${entry.name}`);
    }
  }
  if (end !== bytes.byteLength) throw new Error("Unclaimed model packet bytes");

  const models = new Map<string, ArrayBuffer>();
  for (const entry of descriptor.entries) {
    const original = bytes.slice(entry.offset, entry.offset + entry.length);
    const digest = await subtle.digest("SHA-256", original);
    const hash = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, "0")).join("");
    if (hash !== entry.sha256) throw new Error(`Model packet hash mismatch: ${entry.name}`);
    models.set(entry.name, original);
  }
  return models;
}

export type ModelPacketResource = ModelPacketDescriptor & Readonly<{
  url: string;
  modelBase: string;
}>;

type PacketPool = {
  run: <T>(task: () => Promise<T>, options?: { demanded?: boolean; queueTimeoutMs?: number }) => Promise<T>;
  demand: (owner: Promise<unknown>) => boolean;
};

type PacketConsumer = {
  name: string;
  demanded: boolean;
  promise: Promise<ArrayBuffer>;
  fallback: Promise<ArrayBuffer> | null;
};

type PacketState = {
  resource: ModelPacketResource;
  transport: Promise<ArrayBuffer> | null;
  result: Promise<Map<string, ArrayBuffer>>;
  consumers: Map<string, PacketConsumer>;
  settled: boolean;
};

/** Own the shared packet job, not the renderer or glTF parse lifecycle.
 * All transports, including fallback, use the caller's one global pool.
 * A failed packet releases its network slot before any fallback is queued. */
export function createModelPacketStore(options: {
  packets: readonly ModelPacketResource[];
  pool: PacketPool;
  loadPacket: (url: string) => Promise<ArrayBuffer>;
  loadIndividual: (url: string, demanded: boolean) => Promise<ArrayBuffer>;
  queueTimeoutMs?: number;
}) {
  const index = new Map<string, ModelPacketResource>();
  for (const resource of options.packets) {
    for (const entry of resource.entries) index.set(resource.modelBase + entry.name, resource);
  }
  const states = new Map<ModelPacketResource, PacketState>();
  const owners = new WeakMap<Promise<ArrayBuffer>, { state: PacketState; consumer: PacketConsumer; url: string }>();
  const clean = (state: PacketState) => {
    if (state.settled && state.consumers.size === 0 && states.get(state.resource) === state) states.delete(state.resource);
  };
  const demand = (promise: Promise<ArrayBuffer>) => {
    const owner = owners.get(promise);
    if (!owner) return false;
    owner.consumer.demanded = true;
    const job = owner.consumer.fallback ?? owner.state.transport;
    if (job) options.pool.demand(job);
    return true;
  };
  const request = (url: string, demanded = false): Promise<ArrayBuffer> | undefined => {
    const resource = index.get(url);
    if (!resource) return undefined;
    let state = states.get(resource);
    const existing = state?.consumers.get(url);
    if (existing) {
      if (demanded) demand(existing.promise);
      return existing.promise;
    }
    if (typeof globalThis.crypto?.subtle?.digest !== "function") return undefined;
    if (!state) {
      const transport = options.pool.run(() => options.loadPacket(resource.url), {
        demanded, queueTimeoutMs: demanded ? undefined : (options.queueTimeoutMs ?? 45_000),
      });
      const result = transport.then(bytes => decodeModelPacket(bytes, resource));
      const created: PacketState = { resource, transport, result, consumers: new Map(), settled: false };
      states.set(resource, created);
      // Neither the fulfilled transport promise nor its whole packet buffer
      // should survive after verification has taken ownership of the bytes.
      void transport.then(() => { created.transport = null; }, () => { created.transport = null; });
      const settled = () => { created.settled = true; clean(created); };
      void result.then(settled, settled);
      state = created;
    }
    const consumer: PacketConsumer = {
      name: url.slice(resource.modelBase.length), demanded, fallback: null,
      promise: null as unknown as Promise<ArrayBuffer>,
    };
    const fallback = () => {
      consumer.fallback = options.loadIndividual(url, consumer.demanded);
      return consumer.fallback;
    };
    // Separate success/error handlers avoid retrying a failed individual
    // fallback twice. A released model can use its exact individual file
    // while its unparsed packet neighbours keep their already-loaded bytes.
    consumer.promise = state.result.then(models => models.get(consumer.name) ?? fallback(), fallback);
    state.consumers.set(url, consumer);
    owners.set(consumer.promise, { state, consumer, url });
    // A prefetch may be abandoned before a mounted loader attaches a handler.
    void consumer.promise.catch(() => undefined);
    if (demanded) demand(consumer.promise);
    return consumer.promise;
  };
  const release = (url: string, promise: Promise<ArrayBuffer>) => {
    const owner = owners.get(promise);
    if (!owner || owner.url !== url || owner.state.consumers.get(url) !== owner.consumer) return;
    owner.state.consumers.delete(url);
    owners.delete(promise);
    owner.consumer.fallback = null;
    // Registration follows the consumer's own read, so even early retirement
    // cannot erase its pending result before that consumer has received it.
    void owner.state.result.then(models => { models.delete(owner.consumer.name); }, () => undefined);
    clean(owner.state);
  };
  return { request, demand, release };
}
