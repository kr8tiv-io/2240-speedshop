export type ParseSchedulerOptions = {
  waitForCourtesy: () => Promise<unknown>;
  yieldControl: () => Promise<unknown>;
  cancelActive?: () => void;
};

export type ParseGeneration = {
  active: boolean;
  courtesies: Map<string, Promise<unknown>>;
};

export class ParseGenerationCancelledError extends Error {
  constructor(message = "Parse generation is no longer active") {
    super(message);
    this.name = "ParseGenerationCancelledError";
  }
}

function createGeneration(active = false): ParseGeneration {
  return {
    active,
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
  let tail: Promise<void> = Promise.resolve();
  const activeWaiters = new Set<(owner: ParseGeneration) => void>();

  const invalidate = (owner: ParseGeneration) => {
    if (owner !== current || !owner.active) return false;
    owner.active = false;
    try {
      options.cancelActive?.();
    } catch {
      // The global lane still advances when a browser has already disposed
      // the old worker or renderer.
    }
    return true;
  };

  const beginGeneration = () => {
    invalidate(current);
    generation += 1;
    current = createGeneration(true);
    for (const resolve of activeWaiters) resolve(current);
    activeWaiters.clear();
    return generation;
  };

  const endGeneration = (owner: ParseGeneration) => invalidate(owner);

  const captureGeneration = () => current;

  const waitForActiveGeneration = () => {
    if (current.active) return Promise.resolve(current);
    return new Promise<ParseGeneration>((resolve) => activeWaiters.add(resolve));
  };

  const enqueue = <T>(
    owner: ParseGeneration,
    courtesyKey: string,
    run: (executionOwner: ParseGeneration) => Promise<T>,
  ): Promise<T> => {
    const next = tail.then(async () => {
      // A stale URL must re-enter through the new Canvas's exact demand gate.
      // Migrating this queued closure directly could parse a full-tier model
      // inside a replacement lite generation (or the reverse).
      const effectiveOwner = owner.active ? owner : null;
      if (!effectiveOwner) throw new ParseGenerationCancelledError();
      // Start a bay's courtesy only when that bay reaches the serial head.
      // Starting it at enqueue lets every downstream courtesy expire behind
      // earlier parses, so it offers no protection at the moment work begins.
      let courtesy = effectiveOwner.courtesies.get(courtesyKey);
      if (!courtesy) {
        courtesy = Promise.resolve()
          .then(options.waitForCourtesy)
          .then(
            () => undefined,
            () => undefined,
          );
        effectiveOwner.courtesies.set(courtesyKey, courtesy);
      }
      await courtesy;
      if (!effectiveOwner.active) throw new ParseGenerationCancelledError();
      try {
        const value = await run(effectiveOwner);
        if (!effectiveOwner.active) throw new ParseGenerationCancelledError();
        return value;
      } finally {
        // One parse per turn. A rejection still hands control back and cannot
        // poison the remaining jobs in this generation.
        await Promise.resolve()
          .then(options.yieldControl)
          .catch(() => undefined);
      }
    });

    tail = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  };

  return {
    beginGeneration,
    endGeneration,
    captureGeneration,
    waitForActiveGeneration,
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
