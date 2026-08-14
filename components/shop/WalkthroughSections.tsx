import type { ReactNode } from "react";
import Link from "next/link";
import { CinemaRail } from "./CinemaRail";
import { StationReveal } from "./StationReveal";
import { site } from "@/lib/site";

/* ─────────────────────────────────────────────────────────────────────────────
   THE WALK-THROUGH RUNWAY — seven stations of server-rendered copy over the
   3D shop.

   `#walkthrough-runway` is the scroll contract: the camera rig, the station
   reveals and the cinema rail all compute progress 0 → 1 across THIS element
   (components/shop/runway.ts), so its height is the length of the film.
   Station order IS rail order — the camera orbits stations 0 → 6 down the
   runway, and the copy at each stop is matched to what the lens is circling
   when it arrives:

     0 THE DOORWAY   turntable, the finished Charger, the neon sign
     1 THE HOIST     Challenger up on the posts
     2 ENGINE ROOM   the blown V8 on the stand
     3 FAB CORNER    primer shell on stands, the arc at the bench
     4 THE DYNO      car on the rollers, tuning neon
     5 OFFICE WALL   the pulled motor, the corkboard gallery
     6 ROLL-UP DOOR  the collected car, the night outside

   Every word ships in the server-rendered HTML: no crawler executes JS to
   read this, and on a machine that never mounts WebGL the same copy reads
   over the graded veil. The generous heights are not padding — the gaps are
   where the camera travels, and they are the only place the shop is
   unobstructed.

   `relative z-10` matters: the world canvas is fixed at z-[5] with its veil
   above it; the runway's DOM must sit in front of both.
   ────────────────────────────────────────────────────────────────────────── */

const STATION_HEAD =
  "text-balance font-display text-[clamp(2.1rem,5.6vw,4.8rem)] uppercase leading-[0.92] tracking-wide text-bone";
const STATION_BODY =
  "mt-5 max-w-md font-body text-[15px] leading-[1.7] text-steel sm:mt-6 sm:text-base";
const STATION_LIST =
  "mt-6 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-steel/90";

function Station({
  station,
  id,
  eyebrow,
  headingId,
  align = "start",
  children,
}: {
  station: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  id: string;
  eyebrow: string;
  headingId: string;
  /** Which clear side of the frame the copy takes while the camera orbits. */
  align?: "start" | "end" | "center";
  children: ReactNode;
}) {
  const seat =
    align === "end"
      ? "ml-auto text-right lg:mr-36"
      : align === "center"
        ? "mx-auto text-center"
        : "mr-auto";

  const plate = (
    <div className={`wt-cascade copy-plate max-w-xl ${seat}`}>
      <p className="corner-note text-tungsten">{eyebrow}</p>
      {children}
    </div>
  );

  return (
    <section
      id={id}
      data-station={station}
      aria-labelledby={headingId}
      className="relative flex min-h-[120vh] items-center px-5 py-24 sm:px-8"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        {/* Choreography: the plate is pulled out of the subject as its orbit
            comes around. Station 0 never gates — it IS the arrival. */}
        {station > 0 ? <StationReveal station={station}>{plate}</StationReveal> : plate}
      </div>
    </section>
  );
}

/** The written beat inside a travel — one glance, not a paragraph. */
function Glide({ note, line }: { note: string; line: string }) {
  return (
    <div className="flex min-h-[42vh] items-center px-5 sm:px-8">
      <div className="mx-auto w-full max-w-[92rem]">
        <p className="corner-note">{note}</p>
        <p className="mt-2 max-w-sm font-body text-sm leading-relaxed text-steel/70">{line}</p>
      </div>
    </div>
  );
}

/**
 * Server component. Renders the runway the walk-through world keys off —
 * place it between the film's Act II runway and the Act III finale, with
 * `<WalkthroughWorld />` mounted once anywhere on the page (it finds the
 * runway by id).
 */
export function WalkthroughSections() {
  return (
    <div id="walkthrough-runway" className="relative z-10">
      {/* Film furniture: the travel letterbox and the seven-orbit index.
          Client component, fixed elements, gated to runway proximity. */}
      <CinemaRail />

      {/* Lead-in — the film hands off over this quiet stretch. */}
      <div className="h-[16vh]" aria-hidden="true" />

      {/* STATION 00 — THE DOORWAY */}
      <Station
        station={0}
        id="wt-doorway"
        eyebrow="STATION 00 — THE DOORWAY"
        headingId="wt-doorway-heading"
      >
        <h2 id="wt-doorway-heading" className={`mt-4 ${STATION_HEAD}`}>
          One finished car, doing <em className="accent-serif">slow</em> circles
        </h2>
        <p className={STATION_BODY}>
          The sign is neon, the turntable is real, and the Charger on it is going home this week.
          Everything past this beat is work in progress — this is the only showroom the building
          has, and it is one car deep.
        </p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-steel/70">
          Walk on. The bays are open.
        </p>
      </Station>

      <Glide note="TRAVEL — PAST THE COPPER CAMARO" line="Bay one. The posts are loaded." />

      {/* STATION 01 — THE HOIST */}
      <Station
        station={1}
        id="wt-hoist"
        eyebrow="STATION 01 — THE HOIST"
        headingId="wt-hoist-heading"
        align="end"
      >
        <h2 id="wt-hoist-heading" className={`mt-4 ${STATION_HEAD}`}>
          Start <em className="accent-serif">under</em> the car
        </h2>
        <p className={`${STATION_BODY} ml-auto`}>
          A Challenger up on the posts, pans down, nothing hidden. The first honest conversation
          about any build happens right here — what the floors and the frame actually say, before
          anyone talks paint. The owner is the one holding the light.
        </p>
        <ul className={STATION_LIST}>
          <li>{site.street} · {site.city} {site.region}</li>
          <li>On the Sherwood Park line</li>
          <li>Mon–Fri {site.hours[0].opens}–{site.hours[0].closes}</li>
          <li>Owner-operated · {site.owner}</li>
        </ul>
      </Station>

      <Glide note="TRAVEL — DOWN THE DRIVE LINE" line="Drums on the west wall. Keep to the yellow paint." />

      {/* STATION 02 — THE ENGINE ROOM */}
      <Station
        station={2}
        id="wt-engine-room"
        eyebrow="STATION 02 — THE ENGINE ROOM"
        headingId="wt-engine-heading"
      >
        <h2 id="wt-engine-heading" className={`mt-4 ${STATION_HEAD}`}>
          Six trades, <em className="accent-serif">one</em> roof
        </h2>
        <p className={STATION_BODY}>
          A blown V8 on the stand, headers holding one hard line of light. Nothing here gets farmed
          out — the metal, the motor, the colour, and the trim all happen in this building, with
          one person answerable for the lot.
        </p>
        <ul className={STATION_LIST}>
          <li>Frame-off &amp; rolling restorations</li>
          <li>Restomods and proper hot rods</li>
          <li>LS swaps · diesel conversions</li>
          <li>Carbs, ignition, tune</li>
          <li>Metal, body, colour</li>
          <li>Interiors and trim</li>
        </ul>
      </Station>

      <Glide note="TRAVEL — PAST THE PARTS SHELVES" line="Mind the cords. The bench is live." />

      {/* STATION 03 — THE FAB CORNER */}
      <Station
        station={3}
        id="wt-fab-corner"
        eyebrow="STATION 03 — THE FAB CORNER"
        headingId="wt-fab-heading"
        align="end"
      >
        <h2 id="wt-fab-heading" className={`mt-4 ${STATION_HEAD}`}>
          Bare metal tells the <em className="accent-serif">truth</em>
        </h2>
        <p className={`${STATION_BODY} ml-auto`}>
          A shell in primer on stands, the arc striking at the bench. Gaps, reveals, and the way a
          body line carries through a door get settled here, months before anything is sprayed.
          This is the part nobody photographs and everybody sees.
        </p>
      </Station>

      <Glide note="TRAVEL — THE GAUGE WALL" line="Rollers ahead. It gets loud for a minute." />

      {/* STATION 04 — THE DYNO */}
      <Station
        station={4}
        id="wt-dyno"
        eyebrow="STATION 04 — THE DYNO"
        headingId="wt-dyno-heading"
      >
        <h2 id="wt-dyno-heading" className={`mt-4 ${STATION_HEAD}`}>
          It gets <em className="accent-serif">driven</em> before it leaves
        </h2>
        <p className={STATION_BODY}>
          A car on the rollers under the tuning neon, gauges reading honest. Nothing goes home on a
          trailer of hope — it runs, it gets sorted, and it runs again. Same four steps, every
          build.
        </p>
        <ul className={STATION_LIST}>
          <li>01 · Talk it through</li>
          <li>02 · Real scope, real hours</li>
          <li>03 · Build — metal, mechanical, paint</li>
          <li>04 · Shakedown</li>
        </ul>
      </Station>

      <Glide note="TRAVEL — PAST THE PULLED MOTOR" line="The office keeps its door open." />

      {/* STATION 05 — THE OFFICE WALL */}
      <Station
        station={5}
        id="wt-office-wall"
        eyebrow="STATION 05 — THE OFFICE WALL"
        headingId="wt-office-heading"
        align="end"
      >
        <h2 id="wt-office-heading" className={`mt-4 ${STATION_HEAD}`}>
          The wall keeps the <em className="accent-serif">receipts</em>
        </h2>
        <p className={`${STATION_BODY} ml-auto`}>
          Every print on that corkboard is a customer&rsquo;s car — the D100 a photographer pulled
          over for, the coupe, the pickups. Projects come in from across the metro and the county
          roads past it.
        </p>
        <ul className={STATION_LIST}>
          <li>Edmonton · Sherwood Park</li>
          <li>St. Albert · Leduc &amp; Nisku</li>
          <li>Spruce Grove · Fort Saskatchewan</li>
        </ul>
      </Station>

      <Glide note="TRAVEL — LAST BAY" line="The door is up. Rain on the lane." />

      {/* STATION 06 — THE ROLL-UP DOOR */}
      <Station
        station={6}
        id="wt-roll-up-door"
        eyebrow="STATION 06 — THE ROLL-UP DOOR"
        headingId="wt-door-heading"
        align="center"
      >
        <h2 id="wt-door-heading" className={`mt-4 ${STATION_HEAD}`}>
          Out that door, then <em className="accent-serif">yours</em>
        </h2>
        <p className={`${STATION_BODY} mx-auto`}>
          A finished Challenger nosed at the open door, the city behind it. Every car that leaves
          like this started as a phone call and a handful of photos.
        </p>
        <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
          <Link href="/quote" data-magnetic className="cta cta-compact">
            Start your build
          </Link>
          <a href={`tel:${site.phone}`} className="cta cta-ghost cta-compact">
            {site.phoneDisplay}
          </a>
        </div>
      </Station>

      {/* Tail — the world dissolves out over this stretch; Act III takes over. */}
      <div className="h-[14vh]" aria-hidden="true" />
    </div>
  );
}

export default WalkthroughSections;
