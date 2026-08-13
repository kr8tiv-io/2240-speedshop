"use client";

import { useEffect, useRef, useState } from "react";
import { opt, optSrcSet } from "@/lib/optimized";
import { registerImage, unregisterImage } from "./registry";

/**
 * An image that gets mirrored onto the shared WebGL canvas when the layer is
 * running (desktop, fine pointer, motion allowed). The real <img> always
 * ships in the HTML — layout, SEO, a11y, and the fallback for touch,
 * reduced-motion, low-end, and WebGL context loss. When the plane is live the
 * img drops to opacity 0 and the shader takes over (flowmap distortion,
 * velocity bend + skew, flashlight lift, masked reveal).
 *
 * Couture plate treatment: pass `fig` (and optionally `caption`) to get the
 * mono figure plate — slides up on hover on desktop, arrives with the reveal
 * on touch — plus a hairline offset frame floating on the mat. Plates render
 * at z-40 so they clear the GL canvas (z-30).
 */
export function GLImage({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 40vw, 100vw",
  eager = false,
  zoom = 1,
  fig,
  caption,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
  zoom?: number;
  /** Figure number for the mono plate, e.g. "01". */
  fig?: string;
  /** Short mono caption on the plate. */
  caption?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [glOn, setGlOn] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const id = registerImage({
      el,
      src: opt(src, 1600),
      zoom,
      onActive: setGlOn,
    });
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      unregisterImage(id);
      io.disconnect();
      setGlOn(false);
    };
  }, [src]);

  const hasPlate = Boolean(fig || caption);

  return (
    <div
      ref={wrapRef}
      data-skew=""
      data-inview={inView ? "true" : "false"}
      className={`flashlight relative overflow-hidden ${hasPlate ? "mat-frame" : ""} ${className}`.trim()}
      style={
        // CSS half of the masked entrance — carries the choreography alone
        // whenever the GL layer is off (touch / reduced motion / low-end).
        glOn
          ? undefined
          : {
              clipPath: inView ? "inset(0 0 0 0)" : "inset(14% 9% 10% 9%)",
              transform: inView ? "none" : "scale(0.97)",
              transition:
                "clip-path 1.15s cubic-bezier(0.22,1,0.36,1), transform 1.15s cubic-bezier(0.22,1,0.36,1)",
            }
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={opt(src, 1600)}
        srcSet={optSrcSet(src)}
        sizes={sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`graded absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          glOn ? "opacity-0" : "opacity-100"
        }`}
        style={zoom !== 1 ? { transform: `scale(${zoom})` } : undefined}
      />
      {hasPlate && (
        <span className="fig-plate" aria-hidden="true">
          {fig && <span>FIG. {fig}</span>}
          {caption && <span className="fig-cap">{caption}</span>}
        </span>
      )}
    </div>
  );
}

export default GLImage;
