import type { ReactNode } from "react";

type SectionProps = {
  /** Anchor id, so in-page nav and deep links can target the block. */
  id?: string;
  /**
   * Which of the seven shop stations this block arrives at:
   * 0 doorway · 1 hoist · 2 engine room · 3 fab corner · 4 tuning bay ·
   * 5 office wall · 6 roll-up door.
   *
   * The camera rig in `ShopWorld` reads raw document scroll progress, not
   * anchors, so this is an ORDERING CONTRACT rather than a lookup: stations
   * are visited in the order the sections appear. Keep it monotonic, and keep
   * the copy at a station matched to what the camera is looking at there.
   */
  station?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Small tracked label rendered above the content (font-sub, uppercase). */
  eyebrow?: string;
  /** Renders the weld-seam divider at the top of the section. */
  divider?: boolean;
  /** id of the heading that names this section, for assistive tech. */
  labelledBy?: string;
  /** Extra classes on the <section> element — spacing overrides. */
  className?: string;
  /** Extra classes on the inner max-width container. */
  innerClassName?: string;
  /**
   * How the copy is made legible over a moving image.
   *
   * `"scrim"` (default) floats it on a blurred, semi-transparent plate — the
   * shop keeps running behind and between the panels. `"bare"` hands the
   * treatment to the children, for blocks that already bring their own.
   * A fully opaque full-bleed background is never an option: it would paint
   * the whole world out.
   */
  surface?: "scrim" | "bare";
  /** Extra classes on the scrim plate itself — `scrim-strong`, borders. */
  surfaceClassName?: string;
  children: ReactNode;
};

/**
 * Server component. One vertical rhythm for the whole site, one max width.
 * Everything inside ships in the server-rendered HTML — no client boundary,
 * nothing behind the canvas, nothing an AI crawler has to execute JS to read.
 *
 * The generous `py` is not decoration: those gaps are where the camera travels
 * between stations, and they are the only place the shop is unobstructed.
 */
export function Section({
  id,
  station,
  eyebrow,
  divider = false,
  labelledBy,
  className = "",
  innerClassName = "",
  surface = "scrim",
  surfaceClassName = "",
  children,
}: SectionProps) {
  const content = (
    <>
      {eyebrow ? (
        <p className="mb-6 font-sub text-[11px] uppercase tracking-[0.34em] text-neon-bloom">
          {eyebrow}
        </p>
      ) : null}
      {children}
    </>
  );

  return (
    <section
      id={id}
      data-station={station}
      aria-labelledby={labelledBy}
      className={`relative scroll-mt-24 px-5 py-20 sm:py-28 ${className}`.trim()}
    >
      <div className={`mx-auto max-w-6xl ${innerClassName}`.trim()}>
        {/* The seam sits in the gap, above the plate — it reads as the joint
            between one station and the next. */}
        {divider ? <div className="weld mb-14" aria-hidden="true" /> : null}

        {surface === "scrim" ? (
          <div
            className={`scrim border border-rust/25 px-6 py-10 sm:px-10 sm:py-14 ${surfaceClassName}`.trim()}
          >
            {content}
          </div>
        ) : (
          content
        )}
      </div>
    </section>
  );
}
