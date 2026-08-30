export type ModelRequestCallbacks = {
  onLoad: (data: unknown) => void;
  onProgress: (event: ProgressEvent) => void;
  onError: (error: unknown) => void;
};

export type ModelRequestClock = {
  set: (callback: () => void, delay: number) => unknown;
  clear: (handle: unknown) => void;
};

export type ModelRequestAttempt = {
  target: string;
  start: (callbacks: ModelRequestCallbacks) => void;
  abort: () => void;
  onProgress?: (event: ProgressEvent) => void;
  idleTimeoutMs: number;
  hardTimeoutMs: number;
  clock?: ModelRequestClock;
};

const DEFAULT_CLOCK: ModelRequestClock = {
  set: (callback, delay) => globalThis.setTimeout(callback, delay),
  clear: (handle) => globalThis.clearTimeout(handle as ReturnType<typeof globalThis.setTimeout>),
};

function timeoutError(target: string, kind: "idle" | "hard") {
  const error = new Error(`Timed out (${kind}) loading ${target}`);
  error.name = "ModelRequestTimeoutError";
  return error;
}

/** Load one exact binary response with progress-sensitive and absolute bounds. */
export function loadModelRequestAttempt({
  target,
  start,
  abort,
  onProgress,
  idleTimeoutMs,
  hardTimeoutMs,
  clock = DEFAULT_CLOCK,
}: ModelRequestAttempt): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    let settled = false;
    let idleTimer: unknown;
    let hardTimer: unknown;

    const clearTimers = () => {
      if (idleTimer !== undefined) clock.clear(idleTimer);
      if (hardTimer !== undefined) clock.clear(hardTimer);
      idleTimer = undefined;
      hardTimer = undefined;
    };

    const rejectOnce = (error: unknown, shouldAbort = false) => {
      if (settled) return;
      settled = true;
      clearTimers();
      if (shouldAbort) {
        try {
          abort();
        } catch {
          // The timeout still owns settlement if an old loader cannot abort.
        }
      }
      reject(error);
    };

    const resolveOnce = (data: unknown) => {
      if (settled) return;
      if (!(data instanceof ArrayBuffer)) {
        rejectOnce(new TypeError(`Expected model bytes for ${target}`));
        return;
      }
      settled = true;
      clearTimers();
      // Return the exact FileLoader buffer; never copy or transform model data.
      resolve(data);
    };

    const timeOut = (kind: "idle" | "hard") => {
      rejectOnce(timeoutError(target, kind), true);
    };

    const armIdle = () => {
      if (settled) return;
      if (idleTimer !== undefined) clock.clear(idleTimer);
      idleTimer = clock.set(() => timeOut("idle"), idleTimeoutMs);
    };

    armIdle();
    hardTimer = clock.set(() => timeOut("hard"), hardTimeoutMs);

    try {
      start({
        onLoad: resolveOnce,
        onProgress: (event) => {
          if (settled) return;
          armIdle();
          onProgress?.(event);
        },
        onError: rejectOnce,
      });
    } catch (error) {
      rejectOnce(error);
    }
  });
}
