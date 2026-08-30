import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import type { MeshoptDecodeRequest, MeshoptDecodeResponse } from "./meshoptWorkerDecoder";

type MeshoptWorkerScope = {
  onmessage: ((event: MessageEvent<MeshoptDecodeRequest>) => void) | null;
  postMessage: (message: MeshoptDecodeResponse, transfer?: Transferable[]) => void;
};

const scope = globalThis as unknown as MeshoptWorkerScope;

scope.onmessage = ({ data }) => {
  void MeshoptDecoder.ready.then(() => {
    try {
      const value = new Uint8Array(data.count * data.size);
      MeshoptDecoder.decodeGltfBuffer(
        value,
        data.count,
        data.size,
        data.source,
        data.mode,
        data.filter,
      );
      scope.postMessage({ id: data.id, ok: true, value }, [value.buffer]);
    } catch (error) {
      scope.postMessage({
        id: data.id,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, (error) => {
    scope.postMessage({
      id: data.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  });
};
