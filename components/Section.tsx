import type { ReactNode } from "react";

type SectionProps = {
  /** Anchor id, so in-page nav and deep links can target the block. */
  id?: string;
  /** Small tracked label rendered above the content (font-sub, uppercase). */
  eyebrow?: string;
  /** Renders the weld-seam divider at the top of the section. */
  divider?: boolean;
  /** id of the heading that names this section, for assistive tech. */
  labelledBy?: string;
  /** Extra classes on the <section> element — backgrounds, spacing overrides. */
  className?: string;
  /** Extra classes on the inner max-width container. */
  innerClassName?: string;
  children: ReactNode;
};

/**
 * Server component. One vertical rhythm for the whole site, one max width.
 * Everything inside ships in the server-rendered HTML — no client boundary.
 */
export function Section({
  id,
  eyebrow,
  divider = false,
  labelledBy,
  className = "",
  innerClassName = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`px-5 py-20 sm:py-28 ${className}`.trim()}
    >
      <div className={`mx-auto max-w-6xl ${innerClassName}`.trim()}>
        {divider ? <div className="weld mb-14" aria-hidden="true" /> : null}
        {eyebrow ? (
          <p className="mb-6 font-sub text-[11px] uppercase tracking-[0.34em] text-neon-bloom">
            {eyebrow}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
