import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Restomod Wiring Harness.
 * Why a new harness stops fires, typical CAD range, and why this is not a
 * stereo job. Links down into restomods, the restomod definition, LS-swap
 * cost, the costs guide, the red stepside, and quote.
 */

export const meta: ArticleMeta = {
  slug: "restomod-wiring-harness",
  title: "Why a New Restomod Wiring Harness Stops Fires — and What It Costs in CAD",
  accent: "Harness",
  metaTitle: "Restomod Wiring Harness Cost: Fires",
  description: "Why cloth and cracked PVC start classic-car fires, what a restomod harness includes, and typical CAD ranges — this is not a stereo job.",
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  author: "2240 Speed Shop",
  category: "Restomods",
  targetKeywords: [
    "restomod wiring harness",
    "classic car rewire cost Canada",
    "American Autowire Painless harness",
    "classic car electrical fire",
    "new wiring harness classic car",
  ],
  faq: [
    {
      q: "How much does a restomod wiring harness cost in Canada?",
      a: "A complete chassis harness kit typically runs $500 to $1,800 CAD before labour. Installed in a restomod — routed, terminated, fused, and tied into lights, ignition, charging, and any EFI — the job commonly lands in the $2,500 to $6,500 range. A full custom harness on a heavily modified car can push $7,000 to $12,000 or more. Every figure is a planning range, not a quote. The kit is the cheap line; the hours in the cabin and the engine bay are the invoice.",
    },
    {
      q: "Can I just patch the old wiring instead of replacing the harness?",
      a: "Not safely. Cloth wrap and sixty-year-old PVC crack, copper oxidises inside the insulation, and a tape splice raises resistance, which raises heat. Hagerty's electrical writing is blunt: a short to ground on an unfused feed — battery to starter, battery to the fuse block — can burn a car down in a minute. Patching hides the next failure inside the loom. A new harness with a modern fuse block is the fire suppression.",
    },
    {
      q: "Is a wiring harness just for adding a stereo and electric fans?",
      a: "No. Accessories are why people shop kits. Fires are why shops install them. A restomod harness is a new power distribution system: correctly gauged TXL or GXL wire, a blade-fuse or breaker panel, relays for headlights and fans, and labelled circuits you can actually diagnose. The stereo, the fans, and the EFI all ride on that. They are not the job. The job is that a short can no longer find an unfused path to the body.",
    },
    {
      q: "Do I need a new harness if I LS-swap the car?",
      a: "You need two conversations that have to agree: an engine/EFI harness for the crate or truck engine, and a chassis harness for everything else. They meet at a fused distribution block, not at a Scotchlok in the kick panel. An LS swap done on the original 1967 loom is how you get a no-start that is actually a ground, or a fire that is actually a 10-gauge charge wire asked to carry a 100-amp alternator.",
    },
    {
      q: "How long does a restomod rewire take?",
      a: "At a working shop, a complete chassis rewire on a common classic typically takes 20 to 50 labour hours once the kit is in hand — more if the dash comes out, the body is off, or every accessory is custom. A first-time DIY in a home garage is a winter, not a weekend. The hours are in routing, grommets, grounding, and the last ten percent that makes the turn signals agree with the brake lights.",
    },
  ],
  citations: [
    {
      name: "Rob Siegel, “Why a short circuit can burn your car to the ground,” Hagerty Media",
      url: "https://www.hagerty.com/media/maintenance-and-tech/short-circuit-danger/",
    },
    {
      name: "“The Wrong Kind of Combustion: YOU Can Prevent Automotive Fires,” Hagerty Media",
      url: "https://www.hagerty.com/media/advice/the-wrong-kind-of-combustion-you-can-prevent-automotive-fires/",
    },
    {
      name: "Painless Performance, “FAQ” — TXL chassis harnesses, fuse protection, and kit types",
      url: "https://painlessperformance.com/frequently-asked-questions/",
    },
    {
      name: "“Keep current with your wiring and connections,” Hagerty Media",
      url: "https://www.hagerty.com/media/maintenance-and-tech/keep-current-with-your-wiring-and-connections/",
    },
    {
      name: "“Corner Wrench: Don’t get fried by a wiring burn-out,” Driving.ca",
      url: "https://driving.ca/column/corner-wrench/corner-wrench-dont-get-fried-by-a-wiring-burn-out",
    },
  ],
  internalLinks: [
    "/services/restomods-custom-builds",
    "/blog/what-is-a-restomod",
    "/blog/ls-swap-cost-canada",
    "/guides/costs",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * Split loom: left, a cloth-wrapped factory harness with a tungsten short-to-
 * ground arc at an unfused battery feed; right, a labelled TXL restomod
 * harness into a blade-fuse panel. Editorial diagram of why the harness is
 * fire suppression, not a stereo install.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical split diagram of classic-car wiring: the left side shows a cloth-wrapped factory harness with an unfused battery feed shorting to the body, the right side shows a labelled modern TXL restomod harness landing in a blade-fuse panel, with numbered callouts for the unfused feed, the short, and the fused distribution"
      className="h-auto w-full"
    >
      <title>The harness is the firewall. The stereo is a passenger.</title>
      <defs>
        <radialGradient id="wh-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wh-seam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a9ca0" stopOpacity="0" />
          <stop offset="18%" stopColor="#9a9ca0" stopOpacity="0.5" />
          <stop offset="82%" stopColor="#9a9ca0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9a9ca0" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="600" cy="540" rx="400" ry="32" fill="url(#wh-pool)" />

      {/* ══ LEFT — OLD LOOM ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        {/* battery */}
        <rect x="80" y="120" width="90" height="56" rx="3" strokeWidth="1.8" />
        <line x1="96" y1="120" x2="96" y2="108" strokeWidth="2" />
        <line x1="154" y1="120" x2="154" y2="108" strokeWidth="2" />
        {/* unfused feed */}
        <path d="M 170 148 L 320 148 L 320 280 L 400 280" strokeWidth="4" />
        {/* cloth wrap bundle */}
        <path d="M 400 260 L 560 260 L 560 420 L 420 420 L 420 300" strokeWidth="14" strokeOpacity="0.35" />
        <path d="M 400 268 L 548 268 L 548 412 L 428 412 L 428 292" strokeWidth="1.2" strokeOpacity="0.7" />
        {/* wrap ticks */}
        <g strokeWidth="1" strokeOpacity="0.4">
          <line x1="430" y1="260" x2="430" y2="292" />
          <line x1="470" y1="260" x2="470" y2="292" />
          <line x1="510" y1="260" x2="510" y2="292" />
        </g>
        {/* body ground plane */}
        <line x1="80" y1="480" x2="560" y2="480" strokeWidth="1.4" strokeOpacity="0.5" />
        {/* the short */}
        <path d="M 500 292 L 500 470" stroke="#ffb066" strokeWidth="2.2" />
        <path d="M 488 458 L 500 470 L 512 458" stroke="#ffd9ad" strokeWidth="1.6" />
        <path d="M 494 448 L 500 438 L 506 448" stroke="#ffd9ad" strokeWidth="1.4" />
      </g>

      {/* ══ RIGHT — NEW HARNESS ══ */}
      <g fill="none" stroke="#ffb066" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1020" y="120" width="90" height="56" rx="3" strokeWidth="1.8" />
        <line x1="1036" y1="120" x2="1036" y2="108" strokeWidth="2" />
        <line x1="1094" y1="120" x2="1094" y2="108" strokeWidth="2" />
        {/* mega fuse */}
        <rect x="980" y="140" width="36" height="18" rx="2" stroke="#ffd9ad" strokeWidth="1.4" />
        <path d="M 1020 148 L 1016 148" strokeWidth="3" />
        {/* labelled runs */}
        <path d="M 980 148 L 860 148 L 860 220" strokeWidth="2.4" />
        {/* fuse panel */}
        <rect x="800" y="220" width="120" height="160" rx="4" strokeWidth="1.6" />
        <g strokeWidth="1.1" strokeOpacity="0.85">
          <rect x="814" y="236" width="28" height="14" />
          <rect x="814" y="258" width="28" height="14" />
          <rect x="814" y="280" width="28" height="14" />
          <rect x="814" y="302" width="28" height="14" />
          <rect x="814" y="324" width="28" height="14" />
          <rect x="858" y="236" width="28" height="14" />
          <rect x="858" y="258" width="28" height="14" />
          <rect x="858" y="280" width="28" height="14" />
          <rect x="858" y="302" width="28" height="14" />
          <rect x="858" y="324" width="28" height="14" />
        </g>
        {/* outgoing circuits */}
        <g strokeWidth="1.3" strokeOpacity="0.8">
          <path d="M 800 250 L 740 250 L 740 480" />
          <path d="M 800 290 L 700 290 L 700 480" />
          <path d="M 800 330 L 660 330 L 660 480" />
        </g>
      </g>
      <line x1="640" y1="480" x2="1120" y2="480" stroke="#9a9ca0" strokeWidth="1.4" strokeOpacity="0.5" />

      <line x1="600" y1="60" x2="600" y2="520" stroke="url(#wh-seam)" strokeWidth="1" strokeDasharray="6 7" />
      <rect x="596" y="56" width="8" height="8" transform="rotate(45 600 60)" fill="#ffb066" fillOpacity="0.9" />

      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 80 90 L 154 108" />
        <path d="M 80 280 L 320 280" />
        <path d="M 80 470 L 500 470" />
        <path d="M 1160 90 L 1036 108" />
        <path d="M 1160 300 L 920 300" />
      </g>

      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 154, y: 108, n: "1" },
          { x: 320, y: 280, n: "2" },
          { x: 500, y: 470, n: "3" },
          { x: 998, y: 149, n: "4" },
          { x: 860, y: 220, n: "5" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>

      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="580" y="80" textAnchor="end" fill="#9a9ca0" fillOpacity="0.85">
          AS DELIVERED · CLOTH LOOM
        </text>
        <text x="620" y="80" fill="#ffb066">
          AS BUILT · TXL + FUSES
        </text>
        <text x="40" y="94" fill="#ffb066">
          1 · BATTERY
        </text>
        <text x="40" y="284" fill="#ffb066">
          2 · UNFUSED FEED — THE RED PATH
        </text>
        <text x="40" y="474" fill="#ffb066">
          3 · SHORT TO GROUND — THE FIRE
        </text>
        <text x="1160" y="94" textAnchor="end" fill="#ffb066">
          4 · MEGA-FUSE BEFORE ANYTHING ELSE
        </text>
        <text x="1160" y="304" textAnchor="end" fill="#ffb066">
          5 · BLADE PANEL — EVERY CIRCUIT FUSED
        </text>
      </g>

      <text
        x="600"
        y="636"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. A — THE HARNESS IS THE FIREWALL. THE STEREO IS A PASSENGER.
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        A new restomod harness is fire suppression, not a stereo install. Cracked cloth or PVC
        lets an unfused battery feed find the body, and that short can burn a car down in a
        minute. Installed, a complete chassis harness typically lands in the $2,500 to $6,500 CAD
        range — planning range, not a quote. The hours are the invoice.
      </p>

      <h2>Why do original harnesses start fires?</h2>
      <p>
        Because so much of a vintage loom is not fused. The feed from the battery to the starter,
        and the feed from the battery to the fuse block, run live all the time. If insulation
        cracks and that wire touches the body, the wire itself becomes the load, resistance is
        tiny, current is huge, and the heat has nowhere to go except into the insulation and
        whatever is next to it. Hagerty&rsquo;s short-circuit explainer is the diagram this shop
        draws on the whiteboard: a fuse in the path saves the car; a short before the fuse does
        not.
        <a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        Hagerty&rsquo;s claims team has said electrical failure is one of the most common sources
        of vehicle fires they see, including cars that were sitting.
        <a href="#src-2" className="cite-ref">[2]</a> Cloth-wrapped fifties looms and brittle
        sixties PVC are sixty years into a job they were given a decade. Add a 100-amp alternator,
        electric fans, air conditioning, and a previous owner&rsquo;s Scotchloks, and the original
        10-gauge charge wire is a heater. Driving.ca&rsquo;s shop column makes the same call we
        do: once a loom has melted, you are into a section replacement or a complete harness from
        a house that actually builds them.
        <a href="#src-5" className="cite-ref">[5]</a>
      </p>
      <blockquote>
        <p>
          A stereo is an accessory. A fuse is a fire extinguisher you install before the fire.
          Do not confuse the two invoices.
        </p>
        <footer>Shop rule, taped to the wire rack</footer>
      </blockquote>

      <h2>What does a restomod harness actually include?</h2>
      <p>
        A complete chassis kit — Painless, American Autowire, and their peers — is a new power
        distribution system: TXL or GXL wire labelled every few inches, a modern fuse or breaker
        panel, relays for headlights and horns, and enough circuits for lights, ignition, charging,
        wipers, and the accessories a restomod actually carries.
        <a href="#src-3" className="cite-ref">[3]</a> Direct-fit kits plug into factory switches
        on common cars. Universal kits are for the car whose firewall was smoothed. Either way
        the point is the same: every circuit is fused, every wire is the right gauge, and you can
        diagnose it in ten years.
      </p>
      <ul>
        <li>
          <strong>Mega-fuse or main breaker</strong> on the battery feed, before anything else.
          This is the fuse the factory often omitted.
        </li>
        <li>
          <strong>Blade fuse panel</strong> with labelled circuits, not a glass-fuse block hiding
          in a kick panel full of additions.
        </li>
        <li>
          <strong>Relays</strong> for headlights, fans, and fuel pump, so the switch is a trigger
          and the wire to the load is heavy enough.
        </li>
        <li>
          <strong>Grounds</strong> that are actual grounds — braided straps, clean paint-free
          bosses — because a restomod that &ldquo;has a wiring problem&rdquo; often has a ground
          problem.
        </li>
        <li>
          <strong>A separate EFI harness</strong> if the engine is injected. Chassis and engine
          meet at a fused block, not in a tangle behind the heater box. That pairing is the same
          conversation as an{" "}
          <Link href="/blog/ls-swap-cost-canada">LS swap</Link>.
        </li>
      </ul>

      <h2>What does a restomod rewire cost in Canada?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$500–$1,800</span>
          <span className="stat-l">Complete chassis harness kit, typical range</span>
        </div>
        <div>
          <span className="stat-v">$2.5K–$6.5K</span>
          <span className="stat-l">Typical installed restomod rewire</span>
        </div>
        <div>
          <span className="stat-v">$7K–$12K+</span>
          <span className="stat-l">Full custom harness, heavy modification</span>
        </div>
        <div>
          <span className="stat-v">20–50 hrs</span>
          <span className="stat-l">Shop hours on a common classic</span>
        </div>
      </div>
      <p>
        Every figure is a planning range in Canadian dollars, not a quote. The kit is the cheap
        line. Hours are the rest: dash out, column switches, tail-light looms, grommets through a
        painted firewall, and the last afternoon making the four-ways agree with the brake lights.
        Hagerty&rsquo;s maintenance writing is right that harnesses do not announce themselves
        with a clunk — they announce themselves with a smell, or a dark cabin, or a claim.
        <a href="#src-4" className="cite-ref">[4]</a>
      </p>
      <p>
        This is why a rewire sits inside a{" "}
        <Link href="/services/restomods-custom-builds">restomod and custom build</Link> rather than
        an accessories menu. The{" "}
        <Link href="/blog/what-is-a-restomod">restomod definition</Link> lists wiring next to
        brakes and overdrive for a reason: it is unglamorous, and it is what stops fires. The
        money map for the rest of the spine is the{" "}
        <Link href="/guides/costs">costs guide</Link>.
      </p>

      <h2>Is this just for adding a stereo and fans?</h2>
      <p>
        No. People shop kits because they want a radio, power windows, and electric fans. Shops
        install kits because the original loom cannot carry those loads without becoming a heater,
        and because the unfused battery feed was a fire even before anyone added a watt. If the
        only goal is a radio, a fused tap off an accessory circuit is the honest job. If the goal
        is a restomod that will still be a car in twenty years, the harness is the job, and the
        radio rides along.
      </p>
      <p>
        If the car is coming in because something smells hot, because an LS is going in, or because
        a previous owner wired a fuel pump through a door-jamb switch, send photos of the fuse
        block and the battery feed through the <Link href="/quote#form">quote page</Link>. The first
        honest answer is often: stop patching, buy the harness, and let one shop answer for the
        whole circuit.
      </p>
    </>
  );
}
