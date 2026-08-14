import type { CSSProperties } from "react";

/**
 * Char-roll label: the text twice, stacked, each character in its own column.
 * On hover of the nearest link/button (or `.roll-trigger` ancestor) the
 * columns roll up with a 0.02 s stagger — the site's ONLY link hover.
 * Server component: static markup, all motion in CSS (globals `.roll`).
 * Screen readers get the plain string; the char soup is aria-hidden.
 */
export function Roll({ text, className = "" }: { text: string; className?: string }) {
  const chars = Array.from(text);
  return (
    <span className={`roll ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((ch, i) =>
          ch === " " ? (
            <span key={i}>&nbsp;</span>
          ) : (
            <span key={i} className="roll-c" style={{ "--i": i } as CSSProperties}>
              <span>{ch}</span>
              <span>{ch}</span>
            </span>
          ),
        )}
      </span>
    </span>
  );
}

export default Roll;
