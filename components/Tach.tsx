"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

/* Signature interaction #3 — REDLINE.
   The scroll indicator is an analog tach. Scroll *velocity* sweeps the needle;
   hard flicks bounce it off the redline and the dial flashes. Pure DOM/SVG, no
   WebGL cost, and it reads the same on a laptop as it does on a phone. */

const CX = 50;
const CY = 52;
const SWEEP_START = -126;
const SWEEP_END = 126;
const MAX_RPM = 8000;
const REDLINE = 6000;
/** Scroll speed (px/s) that pins the needle at 8,000. */
const VELOCITY_CEILING = 3600;

const round = (n: number) => Number(n.toFixed(2));
const angleFor = (rpm: number) => SWEEP_START + (rpm / MAX_RPM) * (SWEEP_END - SWEEP_START);

function pointAt(deg: number, radius: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [round(CX + Math.sin(rad) * radius), round(CY - Math.cos(rad) * radius)];
}

const TICKS = Array.from({ length: 17 }, (_, i) => {
  const rpm = i * 500;
  const major = i % 2 === 0;
  const deg = angleFor(rpm);
  const [x1, y1] = pointAt(deg, major ? 29 : 32.5);
  const [x2, y2] = pointAt(deg, 36.5);
  const [lx, ly] = pointAt(deg, 22);
  return { key: rpm, x1, y1, x2, y2, major, hot: rpm >= REDLINE, label: major ? String(rpm / 1000) : null, lx, ly };
});

const REDLINE_ARC = (() => {
  const [x1, y1] = pointAt(angleFor(REDLINE), 39);
  const [x2, y2] = pointAt(angleFor(MAX_RPM), 39);
  return `M ${x1} ${y1} A 39 39 0 0 1 ${x2} ${y2}`;
})();

export function Tach() {
  const [armed, setArmed] = useState(false);

  const needle = useRef<SVGGElement>(null);
  const blade = useRef<SVGPathElement>(null);
  const flash = useRef<SVGCircleElement>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // Direction is irrelevant on a tach — an engine does not spin backwards.
  const rpm = useTransform(scrollVelocity, (v) =>
    Math.min(Math.abs(v) / VELOCITY_CEILING, 1) * MAX_RPM,
  );
  // Spring is the flywheel: overshoots on a flick, settles heavy.
  const sprung = useSpring(rpm, { stiffness: 120, damping: 13, mass: 0.6, restDelta: 2 });

  useMotionValueEvent(sprung, "change", (value) => {
    const clamped = Math.max(0, Math.min(value, MAX_RPM));
    needle.current?.setAttribute("transform", `rotate(${round(angleFor(clamped))} ${CX} ${CY})`);

    const heat = Math.max(0, Math.min(1, (clamped - (REDLINE - 400)) / 1400));
    flash.current?.setAttribute("opacity", heat.toFixed(3));
    blade.current?.setAttribute("stroke", heat > 0.35 ? "#e04545" : "#c7c9cc");
  });

  useEffect(() => {
    // Decoration only: reduced-motion users get nothing that twitches.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
  }, []);

  if (!armed) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-5 right-5 z-10 select-none md:bottom-8 md:right-8"
    >
      <svg viewBox="0 0 100 108" className="h-[86px] w-[86px] md:h-[104px] md:w-[104px]" role="presentation">
        <circle cx={CX} cy={CY} r={45} fill="#131316" fillOpacity={0.72} />
        <circle cx={CX} cy={CY} r={45} fill="none" stroke="#8a5433" strokeOpacity={0.45} strokeWidth={1} />
        <circle cx={CX} cy={CY} r={41} fill="none" stroke="#c7c9cc" strokeOpacity={0.14} strokeWidth={0.6} />

        {/* Redline band */}
        <path d={REDLINE_ARC} fill="none" stroke="#a02d2d" strokeWidth={2.6} strokeLinecap="butt" />

        {/* Ticks + thousands */}
        {TICKS.map((t) => (
          <line
            key={t.key}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.hot ? "#e04545" : "#c7c9cc"}
            strokeOpacity={t.major ? 0.85 : 0.4}
            strokeWidth={t.major ? 1.5 : 0.8}
            strokeLinecap="round"
          />
        ))}
        {TICKS.filter((t) => t.label).map((t) => (
          <text
            key={`l-${t.key}`}
            x={t.lx}
            y={t.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={t.hot ? "#e04545" : "#c7c9cc"}
            fillOpacity={0.8}
            fontSize={7}
            fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          >
            {t.label}
          </text>
        ))}

        <text
          x={CX}
          y={CY + 22}
          textAnchor="middle"
          fill="#c7c9cc"
          fillOpacity={0.5}
          fontSize={5}
          letterSpacing={1.2}
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        >
          RPM x1000
        </text>

        {/* Over-redline flash */}
        <circle
          ref={flash}
          cx={CX}
          cy={CY}
          r={45}
          fill="none"
          stroke="#e04545"
          strokeWidth={2}
          opacity={0}
          style={{ filter: "drop-shadow(0 0 5px rgba(224,69,69,0.9))" }}
        />

        {/* Needle */}
        <g ref={needle} transform={`rotate(${SWEEP_START} ${CX} ${CY})`}>
          <path
            ref={blade}
            d={`M ${CX} ${CY + 7} L ${CX} ${CY - 33}`}
            stroke="#c7c9cc"
            strokeWidth={1.9}
            strokeLinecap="round"
          />
        </g>
        <circle cx={CX} cy={CY} r={3.4} fill="#c7c9cc" />
        <circle cx={CX} cy={CY} r={1.4} fill="#0b0b0d" />

        <text
          x={CX}
          y={104}
          textAnchor="middle"
          fill="#c7c9cc"
          fillOpacity={0.65}
          fontSize={7}
          letterSpacing={3.4}
          fontFamily="var(--font-archivo), system-ui, sans-serif"
        >
          SCROLL
        </text>
      </svg>
    </div>
  );
}

export default Tach;
