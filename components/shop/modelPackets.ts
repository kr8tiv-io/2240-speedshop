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
