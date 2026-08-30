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

type RequestPoolJob = {
  demanded: boolean;
  state: "queued" | "active" | "settled";
  start: () => void;
  rejectQueued: (error: unknown) => void;
  queueTimer?: unknown;
};

export type RequestPoolRunOptions = {
  demanded?: boolean;
  queueTimeoutMs?: number;
};

export type ModelResourceAttemptOptions<T> = {
  attempts: number;
  retryDelayMs: number;
  run: (attempt: number) => Promise<T>;
  clock?: ModelRequestClock;
};

/** Register every request immediately while admitting only `limit` transports. */
export function createRequestPool(limit: number, clock: ModelRequestClock = DEFAULT_CLOCK) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError("Request pool limit must be a positive integer");
  }
  let active = 0;
  const pending: RequestPoolJob[] = [];
  const owners = new WeakMap<Promise<unknown>, RequestPoolJob>();

  const clearQueueTimer = (job: RequestPoolJob) => {
    if (job.queueTimer !== undefined) clock.clear(job.queueTimer);
    job.queueTimer = undefined;
  };

  const insertByDemand = (job: RequestPoolJob) => {
    if (!job.demanded) {
      pending.push(job);
      return;
    }
    const firstPrefetch = pending.findIndex((candidate) => !candidate.demanded);
    if (firstPrefetch < 0) pending.push(job);
    else pending.splice(firstPrefetch, 0, job);
  };

  const drain = () => {
    while (active < limit && pending.length > 0) {
      const job = pending.shift();
      if (!job) return;
      clearQueueTimer(job);
      job.state = "active";
      active += 1;
      job.start();
    }
  };

  const run = <T>(task: () => Promise<T>, options: RequestPoolRunOptions = {}): Promise<T> => {
    let job: RequestPoolJob;
    const promise = new Promise<T>((resolve, reject) => {
      job = {
        demanded: options.demanded ?? false,
        state: "queued",
        rejectQueued: reject,
        start: () => {
          void (async () => {
            try {
              resolve(await task());
            } catch (error) {
              reject(error);
            } finally {
              job.state = "settled";
              active -= 1;
              drain();
            }
          })();
        },
      };
      insertByDemand(job);
      if (!job.demanded && options.queueTimeoutMs && options.queueTimeoutMs > 0) {
        job.queueTimer = clock.set(() => {
          if (job.state !== "queued" || job.demanded) return;
          const index = pending.indexOf(job);
          if (index >= 0) pending.splice(index, 1);
          job.state = "settled";
          const error = new Error("Prefetched model request expired before transport admission");
          error.name = "ModelRequestQueueTimeoutError";
          job.rejectQueued(error);
          drain();
        }, options.queueTimeoutMs);
      }
      drain();
    });
    owners.set(promise, job!);
    return promise;
  };

  const demand = (promise: Promise<unknown>) => {
    const job = owners.get(promise);
    if (!job || job.state !== "queued") return false;
    if (job.demanded) return true;
    job.demanded = true;
    clearQueueTimer(job);
    const index = pending.indexOf(job);
    if (index >= 0) pending.splice(index, 1);
    insertByDemand(job);
    drain();
    return true;
  };

  return { run, demand };
}

/** Keep a transient exact-byte/decoder failure inside one Suspense resource. */
export async function runModelResourceAttempts<T>({
  attempts,
  retryDelayMs,
  run,
  clock = DEFAULT_CLOCK,
}: ModelResourceAttemptOptions<T>): Promise<T> {
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new RangeError("Model resource attempts must be a positive integer");
  }
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await run(attempt);
    } catch (error) {
      lastError = error;
      if (attempt + 1 >= attempts) break;
      const delay = Math.max(0, retryDelayMs * 2 ** attempt);
      await new Promise<void>((resolve) => {
        clock.set(() => resolve(), delay);
      });
    }
  }
  throw lastError ?? new Error("Model resource failed without an error");
}

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
