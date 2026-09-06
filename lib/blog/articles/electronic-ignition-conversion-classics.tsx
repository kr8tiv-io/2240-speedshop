import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Electronic Ignition Conversion for Classics.
 * Points versus electronic in minus-thirty Alberta, why wet mornings kill
 * starts, and hedged CAD ranges for a module, a distributor, or a CDI box.
 * Links down into performance tuning, block heaters, carb rebuilds, winter
 * guide, and quote.
 */

export const meta: ArticleMeta = {
  slug: "electronic-ignition-conversion-classics",
  title:
    "Points vs Electronic Ignition in Minus-Thirty Alberta: Why Wet Mornings Kill Starts",
  accent: "Points",
  metaTitle: "Electronic Ignition Alberta Guide",
  description: "Why points drown on a wet Alberta morning, what an electronic conversion actually changes at minus thirty, and typical CAD ranges for the upgrade. Wri",
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  author: "2240 Speed Shop",
  category: "Keep It Running",
  targetKeywords: [
    "electronic ignition conversion classic car",
    "points vs electronic ignition",
    "Pertronix conversion Alberta",
    "classic car hard starting cold",
    "wet morning no start distributor",
  ],
  faq: [
    {
      q: "How much does an electronic ignition conversion cost in Canada?",
      a: "A points-to-electronic module installed in the original distributor typically lands in the $250 to $700 CAD range. A complete ready-to-run distributor commonly runs $400 to $1,200. A capacitive-discharge box on top of either setup can push $500 to $1,500 more. Every figure is a planning range, not a quote — coil matching, a ballast-resistor bypass, and a cap-and-rotor refresh move the number.",
    },
    {
      q: "Do I still need to set timing after converting to electronic ignition?",
      a: "Yes. A conversion module replaces the points and condenser as a trigger. It does not replace the mechanical and vacuum advance, and it does not set the initial timing for you. After the install you still time the engine with a light, and you still have springs and weights in the distributor doing the advance curve. The win is that the trigger gap no longer closes up every thousand kilometres.",
    },
    {
      q: "Why does a classic crank but not start on a wet morning?",
      a: "Condensation inside the distributor cap. Overnight temperature swing puts a film of water on the cap's inside, and the spark takes the short path to the nearest screw instead of the plug. Pull the cap, dry it, a shot of dielectric or a wipe with a clean rag, and it fires. Electronic ignition does not make the cap waterproof — it just stops the other wet-morning failure, which is points that have oxidised or a condenser that has given up overnight.",
    },
    {
      q: "Will electronic ignition help a classic start at minus thirty?",
      a: "It helps the spark. It does not replace a charged battery, winter-weight oil, or a block heater. Points that have closed up their gap, or a weak coil working through a tired condenser, are a common reason a cold engine cranks and never lights. A conversion module fires the same coil more consistently, which is exactly what a thick cold mixture wants. Pair it with the block-heater and battery-tender habits Alberta actually requires.",
    },
    {
      q: "Can I convert back to points if the module fails on the road?",
      a: "On most kits, yes — the original points plate still bolts in, and a set of points and a condenser still fit in a glovebox. That is the honest roadside argument for a drop-in module over a proprietary distributor with no field service. Carry the old points, a screwdriver, and a condenser. Failure is rare. Being unable to limp home is rarer if you packed the analog spare.",
    },
  ],
  citations: [
    {
      name: "Rob Siegel, “The great ignition debate: Points vs. Pertronix,” Hagerty Media",
      url: "https://www.hagerty.com/media/maintenance-and-tech/ignition-debate-points-vs-pertronix/",
    },
    {
      name: "PerTronix, electronic ignition conversion kits and Ignitor product line",
      url: "https://www.pertronix.com/",
    },
    {
      name: "“Why Your Block Heater is Essential in Winter,” AMA Insider, Alberta Motor Association",
      url: "https://amainsider.com/auto-expert-block-heaters/",
    },
    {
      name: "“Factors that affect fuel efficiency,” Natural Resources Canada",
      url: "https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/personal-vehicles/factors-affect-fuel-efficiency",
    },
    {
      name: "“Classic Cars, Modern Markets Report Now Available,” Specialty Equipment Market Association (SEMA)",
      url: "https://www.sema.org/get-involved/councils-networks/hria/classic-cars-modern-markets-report-now-available",
    },
  ],
  internalLinks: [
    "/services/classic-performance-tuning",
    "/blog/do-classics-need-block-heaters",
    "/blog/carburetor-rebuild-signs",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 8,
};

/**
 * A period distributor in steel line art, cap lifted. Left of the cap,
 * points and condenser; right, a Hall-effect module and reluctor in tungsten.
 * A condensation film is drawn on the cap interior — the wet-morning kill.
 * Editorial plate, not a parts-catalogue exploded view.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of a classic distributor with the cap lifted: points and condenser drawn in steel on the left, a Hall-effect electronic module and reluctor wheel highlighted in tungsten on the right, and a condensation film on the inside of the cap marking the wet-morning no-start"
      className="h-auto w-full"
    >
      <title>Points wear. The module does not. The cap still sweats.</title>
      <defs>
        <radialGradient id="ei-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="600" cy="560" rx="380" ry="32" fill="url(#ei-pool)" />
      <line x1="160" y1="548" x2="1040" y2="548" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.3" />

      {/* housing */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 430 470 L 430 390 Q 430 370 450 366 L 750 366 Q 770 370 770 390 L 770 470" />
        <path d="M 430 470 Q 430 500 600 508 Q 770 500 770 470" />
        {/* vacuum can */}
        <ellipse cx="802" cy="410" rx="28" ry="18" strokeWidth="1.4" />
        <line x1="770" y1="410" x2="774" y2="410" strokeWidth="1.4" />
      </g>

      {/* breaker plate */}
      <ellipse cx="600" cy="430" rx="118" ry="28" fill="none" stroke="#9a9ca0" strokeWidth="1.3" strokeOpacity="0.7" />

      {/* LEFT points */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.5" strokeLinecap="round">
        <path d="M 510 428 L 548 422 L 568 430" />
        <rect x="566" y="424" width="16" height="10" />
        <rect x="584" y="424" width="10" height="10" />
        <path d="M 520 418 L 520 402 L 540 402" strokeWidth="1.1" />
        <rect x="498" y="448" width="28" height="16" rx="2" strokeOpacity="0.8" />
        <text
          x="512"
          y="460"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="8"
          letterSpacing="0.08em"
          fill="#9a9ca0"
          stroke="none"
        >
          COND
        </text>
      </g>

      {/* RIGHT module + reluctor */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.5" strokeLinecap="round">
        <rect x="628" y="416" width="54" height="22" rx="3" />
        <circle cx="700" cy="428" r="16" strokeWidth="1.3" />
        <g strokeWidth="1" strokeOpacity="0.75">
          <line x1="700" y1="412" x2="700" y2="420" />
          <line x1="714" y1="420" x2="708" y2="424" />
          <line x1="714" y1="436" x2="708" y2="432" />
          <line x1="700" y1="444" x2="700" y2="436" />
          <line x1="686" y1="436" x2="692" y2="432" />
          <line x1="686" y1="420" x2="692" y2="424" />
        </g>
        <path d="M 682 416 L 682 396 L 720 384" strokeWidth="1.1" strokeDasharray="3 4" />
      </g>

      {/* shaft */}
      <line x1="600" y1="430" x2="600" y2="250" stroke="#9a9ca0" strokeWidth="2" />
      <circle cx="600" cy="248" r="10" fill="none" stroke="#9a9ca0" strokeWidth="1.4" />

      {/* cap, lifted */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M 470 236 Q 470 168 600 150 Q 730 168 730 236" />
        <path d="M 470 236 L 730 236" strokeWidth="1.2" strokeOpacity="0.5" />
        {/* towers */}
        <g strokeWidth="1.2">
          <rect x="520" y="128" width="14" height="28" rx="2" />
          <rect x="560" y="118" width="14" height="32" rx="2" />
          <rect x="593" y="110" width="14" height="36" rx="2" />
          <rect x="626" y="118" width="14" height="32" rx="2" />
          <rect x="666" y="128" width="14" height="28" rx="2" />
        </g>
      </g>
      {/* condensation film */}
      <path
        d="M 500 220 Q 560 208 600 214 Q 650 222 700 214"
        fill="none"
        stroke="#ffd9ad"
        strokeWidth="1.4"
        strokeDasharray="2 4"
        strokeOpacity="0.9"
      />
      <g fill="#ffd9ad" fillOpacity="0.7">
        <circle cx="540" cy="218" r="2" />
        <circle cx="590" cy="212" r="1.6" />
        <circle cx="640" cy="218" r="2" />
        <circle cx="680" cy="214" r="1.5" />
      </g>

      {/* coil */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.4">
        <rect x="860" y="300" width="70" height="110" rx="6" />
        <line x1="895" y1="300" x2="895" y2="278" />
        <circle cx="895" cy="270" r="8" />
        <path d="M 860 340 L 770 396" strokeWidth="1" strokeDasharray="4 5" strokeOpacity="0.7" />
      </g>

      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 240 160 L 560 210" />
        <path d="M 240 300 L 498 456" />
        <path d="M 240 430 L 568 430" />
        <path d="M 960 180 L 720 384" />
        <path d="M 960 430 L 930 350" />
      </g>

      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 560, y: 210, n: "1" },
          { x: 498, y: 456, n: "2" },
          { x: 568, y: 430, n: "3" },
          { x: 720, y: 384, n: "4" },
          { x: 930, y: 350, n: "5" },
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
        <text x="40" y="164" fill="#ffb066">
          1 · CONDENSATION FILM — THE WET-MORNING KILL
        </text>
        <text x="40" y="304" fill="#ffb066">
          2 · CONDENSER — OVERNIGHT FAILURE
        </text>
        <text x="40" y="434" fill="#ffb066">
          3 · POINTS — GAP CLOSES AS THEY WEAR
        </text>
        <text x="1160" y="184" textAnchor="end" fill="#ffb066">
          4 · HALL-EFFECT MODULE, INSIDE THE CAP
        </text>
        <text x="1160" y="434" textAnchor="end" fill="#ffb066">
          5 · MATCHED COIL — RESISTANCE MATTERS
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
        FIG. A — POINTS WEAR. THE MODULE DOES NOT. THE CAP STILL SWEATS.
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Points fail two ways in Alberta: the gap closes as they wear, and a wet morning films the
        cap so spark never reaches a plug. An electronic conversion replaces points and condenser
        with a Hall-effect trigger, typically $250 to $700 CAD installed. It does not replace a
        block heater. It does replace the four-a.m. no-start.
      </p>

      <h2>What is actually wrong with points in 2026?</h2>
      <p>
        Nothing, if you enjoy setting them. A points ignition is a mechanical switch: a cam on
        the distributor shaft opens a set of contacts, the coil field collapses, a plug fires. The
        contacts pit. The rubbing block wears. The gap closes. Timing retards a few degrees every
        thousand kilometres whether you notice or not. Hagerty&rsquo;s long-running points-versus-
        Pertronix argument is the right frame — a drop-in module is a substitute for the points
        and condenser, not a hotter spark and not a programmable advance.
        <a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        What changed is the climate the car now lives in, and the owner. SEMA&rsquo;s classic-car
        research keeps finding younger owners who will restomod the ignition rather than learn the
        feel of a dwell meter.
        <a href="#src-5" className="cite-ref">[5]</a> That is not snobbery. It is the same reason
        this shop converts cars that have to start at minus thirty and still have to start after a
        Chinook overnight that sweated the cap.
      </p>

      <h2>Why do wet mornings kill a classic start?</h2>
      <p>
        Condensation. The distributor cap is a plastic bowl over a warm shaft. Overnight the
        temperature drops, moisture films the inside, and the next spark takes the shortest path
        to a hold-down screw instead of a plug wire. The engine cranks with purpose and never
        lights. Pull the cap, wipe it dry, and it fires on the next turn — which is why the
        symptom looks like a fuel problem and is not.
      </p>
      <p>
        Electronic ignition does not waterproof the cap. It removes the other wet-morning failure:
        points that have oxidised closed, or a condenser that died in the night. A conversion
        module still lives under that cap. A cracked cap, a carbon-tracked rotor, or a set of
        wires that have gone hygroscopic will still drown the spark. Replace the cap and rotor
        when you convert. Cheap. Decisive.
      </p>
      <blockquote>
        <p>
          The cheapest no-start in this climate is water inside a cap. The second cheapest is
          points you have not looked at since October.
        </p>
        <footer>Bay-two, every April</footer>
      </blockquote>

      <h2>What does an electronic conversion cost in Canada?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$250–$700</span>
          <span className="stat-l">Typical module in the original distributor, installed</span>
        </div>
        <div>
          <span className="stat-v">$400–$1,200</span>
          <span className="stat-l">Typical ready-to-run distributor, installed</span>
        </div>
        <div>
          <span className="stat-v">$500–$1,500</span>
          <span className="stat-l">CDI box on top of either trigger</span>
        </div>
        <div>
          <span className="stat-v">1.5 Ω</span>
          <span className="stat-l">Minimum primary resistance, most V8 modules</span>
        </div>
      </div>
      <p>
        Every figure is a planning range in Canadian dollars, not a quote. PerTronix-style kits
        drop into a huge range of factory distributors and are sold as conversion kits matched to
        the cap you already have.
        <a href="#src-2" className="cite-ref">[2]</a> The install is an afternoon if the
        distributor is healthy. It is not an afternoon if the shaft is sloppy, the advance weights
        are seized, or the coil is a 0.6-ohm hot-rod piece that will cook a module rated for a
        points-style 1.5 ohms. Match the coil. Bypass or keep the ballast as the kit specifies.
        That matching is the job of{" "}
        <Link href="/services/classic-performance-tuning">performance and tuning</Link> here, not
        a parts-counter guess.
      </p>

      <h2>Will it help at minus thirty?</h2>
      <p>
        It helps the spark. It does not thicken the oil or charge the battery. The Alberta Motor
        Association flags around minus fifteen as the point where oil drag and battery fade start
        to matter, and a cast-iron V8 wants hours on a{" "}
        <Link href="/blog/do-classics-need-block-heaters">block heater</Link> before the key.
        <a href="#src-3" className="cite-ref">[3]</a> Natural Resources Canada&rsquo;s cold-weather
        fuel-use numbers tell the same story from the other end: winter is already expensive, and
        a weak spark on a cold mixture just multiplies the cranking.
        <a href="#src-4" className="cite-ref">[4]</a>
      </p>
      <p>
        What the conversion buys at minus thirty is consistency. Points that have closed their gap
        over a season fire late and weak, which is exactly when a cold, slightly-wet fuel mixture
        needs the opposite. A Hall-effect trigger fires the coil the same way on the first crank
        in January as it did in July. Pair that with a charged battery, winter oil, and a choke
        that actually closes — the{" "}
        <Link href="/blog/carburetor-rebuild-signs">carburetor</Link> has its own opinion — and
        the car starts like a car.
      </p>

      <h2>What should you convert, and what should you leave?</h2>
      <ul>
        <li>
          <strong>Convert</strong> if the car has to start on a weekday morning, if you do not want
          to set points twice a season, or if the condenser has already left you on the side of
          17th Street once.
        </li>
        <li>
          <strong>Leave points</strong> on a concours-original car, or if you genuinely like the
          ritual and carry the spare. They still work. They always have.
        </li>
        <li>
          <strong>Replace the cap, rotor, and wires</strong> either way. The module cannot out-spark
          a carbon track.
        </li>
        <li>
          <strong>Carry the old points.</strong> A glovebox spare is the honest answer to
          &ldquo;what if the module dies.&rdquo;
        </li>
      </ul>
      <p>
        The winter half of this conversation — storage, fuel, and the first start in April — is
        the <Link href="/guides/winter">winter guide</Link>. If the car is coming in for a no-start
        that is actually an ignition, send a photo of the distributor cap (inside, please) through
        the <Link href="/quote">quote page</Link>. Half of those photos already have the answer
        written in white film on the plastic.
      </p>
    </>
  );
}
