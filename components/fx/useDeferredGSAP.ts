"use client";

import { useEffect, type DependencyList, type RefObject } from "react";

type GSAPRuntime = typeof import("gsap").gsap;
type ScrollTriggerRuntime = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type Cleanup = void | (() => void);

type Options = {
  scope?: RefObject<Element | null>;
  dependencies?: DependencyList;
};

/**
 * Load the shared motion engine after the browser has painted, then give the
 * caller the same scoped GSAP context/cleanup semantics as useGSAP. The page's
 * server HTML and CSS are already complete; none of this code can contribute
 * a pixel to FCP, so it does not belong in the opening hydration graph.
 */
export function useDeferredGSAP(
  setup: (gsap: GSAPRuntime, ScrollTrigger: ScrollTriggerRuntime) => Cleanup,
  { scope, dependencies = [] }: Options = {},
) {
  useEffect(() => {
    let cancelled = false;
    let context: ReturnType<GSAPRuntime["context"]> | null = null;
    let cleanup: Cleanup;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapModule, triggerModule]) => {
        if (cancelled) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        context = gsap.context(() => {
          cleanup = setup(gsap, ScrollTrigger);
        }, scope?.current ?? undefined);
      })
      // Motion is progressive enhancement: static server-rendered content is
      // the correct fallback if a deferred chunk is blocked or interrupted.
      .catch(() => {});

    return () => {
      cancelled = true;
      cleanup?.();
      context?.revert();
    };
    // The caller deliberately owns the dependency list, matching useGSAP.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
