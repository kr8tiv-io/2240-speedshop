"use client";

import { useCallback, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { WebGLBoundary } from "@/components/gl/WebGLBoundary";
import { HeroScene, type Shot } from "./HeroScene";
import { publishHeroBoot } from "./hero-boot";

function HeroProgressBridge() {
  const { progress, errors } = useProgress();

  useEffect(() => {
    publishHeroBoot({ progress, failed: errors.length > 0 });
  }, [errors, progress]);

  return null;
}

export function HeroRuntime({
  shot,
  mobile,
  active = true,
}: {
  shot: Shot;
  mobile: boolean;
  active?: boolean;
}) {
  const onSceneReady = useCallback(() => publishHeroBoot({ sceneReady: true }), []);
  const onRuntimeFailure = useCallback(() => publishHeroBoot({ failed: true }), []);

  return (
    <div
      data-hero-runtime
      data-runtime-profile={mobile ? "mobile" : "desktop"}
      data-runtime-chunk="2240-hero-runtime-chunk"
      className="absolute inset-0 h-full w-full"
    >
      <HeroProgressBridge />
      <WebGLBoundary onFailure={onRuntimeFailure}>
        <HeroScene
          shot={shot}
          mobile={mobile}
          active={active}
          onReady={onSceneReady}
        />
      </WebGLBoundary>
    </div>
  );
}

export default HeroRuntime;
