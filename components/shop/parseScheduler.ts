export type ParseSchedulerOptions = {
  waitForCourtesy: () => Promise<unknown>;
  yieldControl: () => Promise<unknown>;
};

export type ParseGeneration = {
  tail: Promise<void>;
  courtesies: Map<string, Promise<unknown>>;
};

function createGeneration(): ParseGeneration {
  return {
    tail: Promise.resolve(),
    courtesies: new Map(),
  };
}

/**
 * Serializes expensive parses without allowing an abandoned Canvas lifecycle
 * to hold the replacement Canvas behind its unresolved work.
 */
export function createParseScheduler(options: ParseSchedulerOptions) {
  let generation = 0;
  let current = createGeneration();

  const beginGeneration = () => {
    generation += 1;
    current = createGeneration();
    return generation;
  };

  const captureGeneration = () => current;

  const enqueue = <T>(
    owner: ParseGeneration,
    courtesyKey: string,
    run: () => Promise<T>,
  ): Promise<T> => {
    const next = owner.tail.then(async () => {
      // Start a bay's courtesy only when that bay reaches the serial head.
      // Starting it at enqueue lets every downstream courtesy expire behind
      // earlier parses, so it offers no protection at the moment work begins.
      let courtesy = owner.courtesies.get(courtesyKey);
      if (!courtesy) {
        courtesy = Promise.resolve()
          .then(options.waitForCourtesy)
          .then(
            () => undefined,
            () => undefined,
          );
        owner.courtesies.set(courtesyKey, courtesy);
      }
      await courtesy;
      try {
        return await run();
      } finally {
        // One parse per turn. A rejection still hands control back and cannot
        // poison the remaining jobs in this generation.
        await Promise.resolve()
          .then(options.yieldControl)
          .catch(() => undefined);
      }
    });

    owner.tail = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  };

  return {
    beginGeneration,
    captureGeneration,
    enqueue,
    currentGeneration: () => generation,
  };
}

export type FallbackClock = {
  set: (callback: () => void, delay: number) => unknown;
  clear: (handle: unknown) => void;
};

const DEFAULT_FALLBACK_CLOCK: FallbackClock = {
  set: (callback, delay) => globalThis.setTimeout(callback, delay),
  clear: (handle) => globalThis.clearTimeout(handle as ReturnType<typeof globalThis.setTimeout>),
};

/** Bound an operation while still observing every late settlement. */
export function runWithTimeout<T>({
  run,
  timeoutMs,
  clock = DEFAULT_FALLBACK_CLOCK,
}: {
  run: () => Promise<T>;
  timeoutMs: number;
  clock?: FallbackClock;
}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const timer = clock.set(() => {
      if (settled) return;
      settled = true;
      const error = new Error(`Operation did not settle within ${timeoutMs} ms`);
      error.name = "OperationTimeoutError";
      reject(error);
    }, timeoutMs);
    void Promise.resolve()
      .then(run)
      .then(
        (value) => {
          if (settled) return;
          settled = true;
          clock.clear(timer);
          resolve(value);
        },
        (error) => {
          if (settled) return;
          settled = true;
          clock.clear(timer);
          reject(error);
        },
      );
  });
}

/** Retry an exact operation through an independently bounded fallback. */
export async function runWithTimeoutFallback<T>({
  runPrimary,
  runFallback,
  beforeFallback,
  timeoutMs,
  fallbackTimeoutMs = timeoutMs,
  clock = DEFAULT_FALLBACK_CLOCK,
}: {
  runPrimary: () => Promise<T>;
  runFallback: () => Promise<T>;
  beforeFallback: () => void;
  timeoutMs: number;
  fallbackTimeoutMs?: number;
  clock?: FallbackClock;
}): Promise<T> {
  try {
    return await runWithTimeout({ run: runPrimary, timeoutMs, clock });
  } catch {
    beforeFallback();
    return runWithTimeout({ run: runFallback, timeoutMs: fallbackTimeoutMs, clock });
  }
}
