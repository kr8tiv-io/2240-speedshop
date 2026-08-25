"use client";

import { useCallback, useEffect } from "react";
import { useProgress } from "@react-three/drei";
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

  return (
    <div
      data-hero-runtime
      data-runtime-profile={mobile ? "mobile" : "desktop"}
      className="absolute inset-0 h-full w-full"
    >
      <HeroProgressBridge />
      <HeroScene
        shot={shot}
        mobile={mobile}
        active={active}
        onReady={onSceneReady}
      />
    </div>
  );
}

export default HeroRuntime;
