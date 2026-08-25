"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useWebGLFailureBoundary } from "./WebGLBoundary";

/** Routes asynchronous GPU loss through the same boundary as render errors. */
export function WebGLContextGuard() {
  const canvas = useThree((state) => state.gl.domElement);
  const reportFailure = useWebGLFailureBoundary();

  useEffect(() => {
    const onContextLost = (event: Event) => {
      event.preventDefault();
      reportFailure("context-lost");
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    return () => canvas.removeEventListener("webglcontextlost", onContextLost);
  }, [canvas, reportFailure]);

  return null;
}

