"use client";

import { useRef, type ReactNode } from "react";

/**
 * Ink-reveal image hover (Obys): the image sits dim; a soft warm pool follows
 * the cursor inside it and lifts it toward full brightness. The visuals live
 * in globals.css (.flashlight) — this component only feeds --fx/--fy.
 */
export function Flashlight({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--fx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--fy", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div ref={ref} onPointerMove={onMove} className={`flashlight ${className}`.trim()}>
      {children}
    </div>
  );
}

export default Flashlight;
