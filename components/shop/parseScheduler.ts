export type ParseSchedulerOptions = {
  waitForCourtesy: () => Promise<unknown>;
  yieldControl: () => Promise<unknown>;
};

export type ParseGeneration = {
  tail: Promise<void>;
  courtesy: Promise<unknown> | null;
};

function createGeneration(): ParseGeneration {
  return {
    tail: Promise.resolve(),
    courtesy: null,
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

  const enqueue = <T>(owner: ParseGeneration, run: () => Promise<T>): Promise<T> => {
    owner.courtesy ??= Promise.resolve()
      .then(options.waitForCourtesy)
      .then(
        () => undefined,
        () => undefined,
      );

    const next = owner.tail.then(async () => {
      await owner.courtesy;
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
