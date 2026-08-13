/**
 * One continuous marquee strip — the seam between chapters. Server component,
 * CSS animation, duplicated track for the seamless loop. There is exactly one
 * of these on the site.
 */
const ITEMS = [
  "RESTORATION",
  "RESTOMODS",
  "LS SWAPS",
  "PAINT",
  "INTERIORS",
  "DIESEL CONVERSIONS",
  "CARBS & IGNITION",
];

function Run() {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-8 font-mono text-sm uppercase tracking-[0.3em] text-steel/70">
            {item}
          </span>
          <span className="h-1.5 w-1.5 rotate-45 bg-tungsten/50" />
        </span>
      ))}
    </span>
  );
}

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-rust/60 py-5">
      <p className="sr-only">
        Restoration, restomods, LS swaps, paint, interiors, diesel conversions, carburetors and
        ignition.
      </p>
      <div className="marquee-track">
        <Run />
        <Run />
      </div>
    </div>
  );
}

export default Marquee;
