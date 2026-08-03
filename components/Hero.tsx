import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { GarageScene } from "./GarageScene";
import { Tach } from "./Tach";

const hours = site.hours[0];

/**
 * MIDNIGHT GARAGE hero — Server Component.
 *
 * Everything that matters is here in the server payload: the H1, the answer-
 * first subhead, the CTA pair, the NAP strip. The still of the D100 is the LCP
 * element (priority, explicit sizes, one grade over it). `GarageScene` mounts
 * client-side only, absolutely positioned over the still with an opacity fade,
 * so slow devices, phones and every AI crawler get the photograph and the copy
 * with zero layout shift and zero JS dependency.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden border-b border-rust/25 md:min-h-[92svh]">
      <Image
        src="/shop/ig-D100-slide1-fullres.jpg"
        alt="1960s Dodge D100 pickup built by 2240 Speed Shop, the customs and classics garage in Edmonton, Alberta"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="graded object-cover object-center"
      />

      {/* Decoration only — aria-hidden, pointer-events-none, never in layout. */}
      <GarageScene />

      {/* Night grade: pull the frame down to bay-black so the copy stays legible. */}
      <div
        className="absolute inset-0 bg-[radial-gradient(115%_95%_at_62%_18%,transparent_0%,rgba(11,11,13,0.35)_45%,rgba(11,11,13,0.88)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-bay-black via-bay-black/85 to-transparent"
        aria-hidden="true"
      />

      <div className="relative w-full">
        <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-28 md:pb-28 md:pt-44">
          <p className="font-sub text-[11px] uppercase tracking-[0.34em] text-steel">
            {site.name} · {site.city}, Alberta
          </p>

          <h1 className="mt-5 font-display text-[clamp(3rem,10.5vw,9rem)] uppercase leading-[0.85] tracking-[0.01em] text-bone">
            <span className="block">Customs and classics.</span>
            <span className="neon-red block">Built in Edmonton.</span>
          </h1>

          <p className="mt-7 max-w-2xl font-body text-base leading-relaxed text-steel md:text-lg">
            {site.name}
            {" — "}
            restorations, restomods, and engine swaps from a working shop on the Sherwood Park
            line. Don&rsquo;t save your dreams for sleep. Revive your ride.
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
                <a href={`tel:${site.phone}`} className="transition-colors hover:text-neon-bloom">
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
