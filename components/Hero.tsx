import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { Badge } from "@/components/Logo";
import { Tach } from "./Tach";

const hours = site.hours[0];

/**
 * MIDNIGHT GARAGE hero — Server Component.
 *
 * Everything that matters is here in the server payload: the H1, the answer-
 * first subhead, the CTA pair, the NAP strip. The still of the D100 is the LCP
 * element (priority, explicit sizes, one grade over it) and it is what phones,
 * slow machines and every AI crawler see — no JS required, no layout shift.
 *
 * The hero no longer owns a canvas. `ShopWorldMount` is mounted once in
 * app/layout.tsx, so its fixed host escapes every section's stacking context
 * and lives behind the whole site. When that world is running it drives
 * `--hero-reveal`, and the plate below — still, grade and all — dissolves as
 * the reader scrolls past, uncovering STATION 0, the doorway. When it is not
 * running the variable is never set, the fallback `1` holds, and the
 * photograph stays exactly as it is today.
 */
export function Hero() {
  return (
    /* STATION 0 — DOORWAY / COLD START. */
    <section
      data-station="0"
      className="relative isolate flex min-h-[86svh] items-end overflow-hidden border-b border-rust/25 md:min-h-[92svh]"
    >
        {/* The plate: the still and its grade. Dissolves only when the 3D shop
            behind it is actually running. */}
        <div className="absolute inset-0" style={{ opacity: "var(--hero-reveal, 1)" }}>
          {/* The plate leads with a FINISHED build — the aspirational after,
              never a project car. Rust lives deeper in the scroll. */}
          <Image
            src="/shop/car-blue-pickup.jpg"
            alt="Gleaming finished blue pickup restomod built by 2240 Speed Shop, the customs and classics garage in Edmonton, Alberta"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="graded object-cover object-[46%_55%]"
          />

          {/* Night grade: pull the frame down to bay-black so the copy stays legible. */}
          <div
            className="absolute inset-0 bg-[radial-gradient(115%_95%_at_62%_18%,transparent_0%,rgba(11,11,13,0.35)_45%,rgba(11,11,13,0.88)_100%)]"
            aria-hidden="true"
          />
        </div>

        {/* Legibility floor and a soft top-left shade, over photo OR running
            shop — the copy never fights either backdrop. Outside the plate so
            they survive the dissolve. */}
        <div
          className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-bay-black via-bay-black/70 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(90%_60%_at_18%_30%,rgba(11,11,13,0.55)_0%,transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative w-full">
          <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-28 md:pb-28 md:pt-44">
            <div className="flex items-center gap-4">
              <Badge
                className="h-16 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] md:h-20"
                hole="#0b0b0d"
                title="2240 Speed Shop badge — the laser-cut steel sign on the shop"
              />
              <p className="font-sub text-[11px] uppercase tracking-[0.34em] text-steel">
                {site.name} · {site.city}, Alberta
                <span className="mt-2 block h-px w-24 bg-gradient-to-r from-speed-red to-transparent" />
              </p>
            </div>

            <h1 className="mt-5 font-display text-[clamp(3rem,10.5vw,9rem)] uppercase leading-[0.85] tracking-[0.01em] text-bone">
              <span className="block">Customs and classics.</span>
              <span className="neon-red block">Built in Edmonton.</span>
            </h1>

            <p className="mt-7 max-w-2xl font-body text-base leading-relaxed text-steel md:text-lg">
              {site.name}
              {" — "}
              restorations, restomods, and engine swaps from a working shop on the Sherwood
              Park line. Don&rsquo;t save your dreams for sleep. Revive your ride.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/quote"
                className="flicker border border-speed-red/70 px-7 py-4 font-sub text-xs uppercase tracking-[0.2em] text-bone transition-all hover:border-neon-bloom hover:shadow-[0_0_26px_rgba(224,69,69,0.45)]"
              >
                Start your build
              </Link>
              <Link
                href="/builds"
                className="border border-steel/35 px-7 py-4 font-sub text-xs uppercase tracking-[0.2em] text-steel transition-colors hover:border-steel/80 hover:text-bone"
              >
                See the work
              </Link>
            </div>

            <div className="mt-10 h-px w-full max-w-xl weld" aria-hidden="true" />

            <dl className="mt-6 flex flex-wrap gap-x-9 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-tungsten/85">
              <div className="flex gap-2">
                <dt className="text-steel/55">Shop</dt>
                <dd>
                  {site.street}, {site.city} {site.region}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-steel/55">Hours</dt>
                <dd>
                  Mon&ndash;Fri {hours.opens}&ndash;{hours.closes}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-steel/55">Call</dt>
                <dd>
                  <a
                    href={`tel:${site.phone}`}
                    className="transition-colors hover:text-neon-bloom"
                  >
                    {site.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <Tach />
    </section>
  );
}

export default Hero;
