import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Winter Storage, Alberta Edition.
 * The October article. Owns the winter-storage keyword cluster, feeds the
 * classic-service line, and links down into the winter guide, the interiors
 * service, the carburetor piece, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "classic-car-winter-storage-alberta",
  title: "How to Put a Classic Car Away for an Alberta Winter",
  accent: "Winter",
  metaTitle: "Store a Classic for Alberta Winter",
  description: "The October put-away procedure — fuel, oil, battery, tires, and mice — that gets a classic through five months of Alberta winter and starts clean in April.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Keep It Running",
  targetKeywords: [
    "classic car winter storage Alberta",
    "how to store a classic car for winter",
    "winter car storage Edmonton",
    "fuel stabilizer classic car",
    "classic car storage checklist",
  ],
  faq: [
    {
      q: "Should I store my classic car with a full or empty gas tank?",
      a: "Full — about 95 per cent, with fuel stabilizer added and the engine run five minutes so treated fuel reaches the carburetor. A near-empty tank leaves bare steel exposed to condensation all winter, and untreated modern pump gas can gum a carburetor in a single season. Ethanol-free premium is the best base fuel for storage where you can find it.",
    },
    {
      q: "Should I disconnect my classic car's battery for winter or use a battery maintainer?",
      a: "If the car sleeps near a plug, a maintainer is the better answer: it floats the battery at full charge all winter and the car is ready in April. If there is no power, pull the battery, store it somewhere above freezing, and top up the charge monthly. What kills batteries is sitting discharged — a flat lead-acid battery can freeze and crack in an Alberta cold snap, while a fully charged one survives far colder.",
    },
    {
      q: "Should I start my classic car during winter storage?",
      a: "No. A short idle in a cold garage never brings the oil or exhaust up to full temperature, so it loads the engine with condensation and unburned fuel instead of clearing them — worse than leaving it parked. Either take it for a proper twenty-minute drive at operating temperature on dry pavement, or leave it asleep until spring.",
    },
    {
      q: "How do I keep mice out of a car in storage?",
      a: "Seal the openings: steel wool or a rag in the tailpipe and the air intake, flagged so you cannot forget them in April. Strip every scrap of food from the car and the garage — including dog food and birdseed — set traps around the car rather than inside it, and check monthly. If you find droppings in spring, never sweep or vacuum them: deer mice in Alberta can carry hantavirus. Ventilate the space, soak the droppings with a one-to-nine bleach solution, and wear gloves.",
    },
    {
      q: "How much does winter car storage cost in Edmonton?",
      a: "Your own garage costs nothing extra. Rented unheated storage around Edmonton commonly advertises in the range of $75 to $200 a month, and heated collector storage roughly $200 to $450 a month, often on a five- or six-month seasonal contract. Those are planning ranges in Canadian dollars, not quotes. The put-away supplies themselves — stabilizer, a maintainer, a breathable cover — typically total $150 to $400.",
    },
  ],
  citations: [
    {
      name: "“STA-BIL Fuel Stabilizer: What You Need to Know,” Gold Eagle Co. technical library",
      url: "https://www.goldeagle.com/tips-tools/sta-bil-fuel-stabilizer-what-you-need-to-know/",
    },
    {
      name: "“Ethanol,” Natural Resources Canada",
      url: "https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/ethanol",
    },
    {
      name: "“How to: Classic Car Winterization & Storage,” Hagerty",
      url: "https://www.hagerty.com/resources/car-maintenance/how-to-classic-car-winterization-and-storage",
    },
    {
      name: "“Reducing the risk of hantavirus,” Government of Alberta",
      url: "https://www.alberta.ca/reducing-the-risk-of-hantavirus",
    },
    {
      name: "“Tire Flat Spotting: Causes, Prevention, and Solutions,” Michelin",
      url: "https://www.michelinman.com/auto/auto-tips-and-advice/tire-damage/tire-flat-spotting",
    },
  ],
  internalLinks: [
    "/blog/carburetor-rebuild-signs",
    "/services/classic-interiors-service",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 8,
};

/**
 * A classic coupe put away for the season, drawn in the shop's plate style —
 * steel line art under a dashed breathable cover, battery maintainer on the
 * wall, tank at 95 per cent, tailpipe plugged, tires on cradles, a deer mouse
 * turned away at the perimeter, and a thermometer holding minus thirty.
 * Six numbered tungsten pins match the article's put-away order.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical side-elevation diagram of a classic coupe in winter storage, drawn as steel line art under a dashed breathable car cover, with six numbered tungsten callout pins marking the fuel tank filled to 95 per cent with stabilizer, the fresh oil change, the battery maintainer on the wall, the plugged tailpipe, the tires set to placard pressure on cradles, and the cotton cover, plus a deer mouse turned away at the perimeter and a thermometer reading minus thirty Celsius"
      className="h-auto w-full"
    >
      <title>Parked right in October, running in April — the put-away in one plate</title>
      <defs>
        <radialGradient id="ws-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ws-fuel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* pool of light under the car */}
      <ellipse cx="540" cy="548" rx="360" ry="34" fill="url(#ws-pool)" />

      {/* falling snow — outside the cover's world */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round">
        {[
          [268, 128],
          [388, 92],
          [498, 148],
          [636, 96],
          [748, 152],
          [222, 196],
          [568, 178],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
            <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
          </g>
        ))}
      </g>

      {/* ground / slab */}
      <line x1="72" y1="530" x2="1128" y2="530" stroke="#9a9ca0" strokeWidth="1.4" strokeOpacity="0.6" />
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.25">
        <line x1="150" y1="542" x2="196" y2="542" />
        <line x1="560" y1="544" x2="628" y2="544" />
        <line x1="920" y1="542" x2="972" y2="542" />
      </g>

      {/* ══ THE CAR — long-hood coupe, side elevation ══ */}
      {/* upper body line */}
      <path
        d="M 256 488 L 256 456 Q 256 444 272 440 L 344 430 Q 420 422 466 420 L 498 388 Q 506 378 520 376 L 620 372 Q 636 372 644 384 L 670 418 Q 742 424 790 438 Q 812 444 814 460 L 814 488"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* rocker line with wheel arches */}
      <path
        d="M 256 488 L 314 488 A 52 52 0 0 1 418 488 L 660 488 A 52 52 0 0 1 764 488 L 814 488"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* greenhouse + door */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.75" strokeLinecap="round">
        <path d="M 506 388 L 480 420" />
        <path d="M 636 384 L 660 418" />
        <line x1="566" y1="376" x2="566" y2="420" />
        <line x1="474" y1="422" x2="666" y2="420" />
        <line x1="560" y1="440" x2="560" y2="486" />
        <line x1="572" y1="448" x2="588" y2="448" />
      </g>
      {/* wheels on cradles */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6">
        <circle cx="366" cy="488" r="40" />
        <circle cx="366" cy="488" r="13" strokeWidth="1.1" strokeOpacity="0.75" />
        <circle cx="712" cy="488" r="40" />
        <circle cx="712" cy="488" r="13" strokeWidth="1.1" strokeOpacity="0.75" />
      </g>
      <g stroke="#ffb066" strokeWidth="1.4" strokeOpacity="0.8" fill="none" strokeLinecap="round">
        <path d="M 330 528 L 348 510" />
        <path d="M 384 510 L 402 528" />
        <path d="M 676 528 L 694 510" />
        <path d="M 730 510 L 748 528" />
      </g>

      {/* ══ THE COVER — dashed, floating just off the body ══ */}
      <path
        d="M 242 490 L 242 452 Q 242 434 264 428 L 342 416 Q 420 408 460 406 L 492 372 Q 502 360 518 358 L 622 354 Q 642 354 652 368 L 678 404 Q 748 410 796 424 Q 826 432 828 456 L 828 490"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.2"
        strokeOpacity="0.55"
        strokeDasharray="7 6"
        strokeLinecap="round"
      />

      {/* ══ FUEL TANK — 95% full, under the trunk ══ */}
      <rect x="686" y="452" width="76" height="26" rx="6" fill="none" stroke="#9a9ca0" strokeWidth="1.3" strokeOpacity="0.8" />
      <rect x="689" y="458" width="70" height="17" rx="4" fill="url(#ws-fuel)" />
      <line x1="689" y1="458" x2="759" y2="458" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="4 3" />
      {/* stabilizer droplet at the filler */}
      <path
        d="M 866 356 Q 852 380 866 392 Q 880 380 866 356"
        fill="#ffb066"
        fillOpacity="0.14"
        stroke="#ffb066"
        strokeWidth="1.2"
      />
      <path d="M 866 392 L 812 440" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />
      <text
        x="866"
        y="414"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#ffd9ad"
      >
        STABILIZED
      </text>

      {/* ══ BATTERY MAINTAINER — on the wall, cable to the car ══ */}
      <rect x="96" y="286" width="64" height="44" rx="4" fill="none" stroke="#9a9ca0" strokeWidth="1.5" />
      <circle cx="112" cy="300" r="3" fill="#ffb066" fillOpacity="0.9" />
      <line x1="126" y1="300" x2="150" y2="300" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="126" y1="312" x2="150" y2="312" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.6" />
      <path
        d="M 128 330 Q 128 402 180 428 Q 226 450 258 452"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.2"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />

      {/* ══ TAILPIPE — plugged and flagged ══ */}
      <line x1="814" y1="472" x2="850" y2="472" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="858" cy="472" r="8" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.3" />
      <g stroke="#ffb066" strokeWidth="0.9" strokeOpacity="0.8" strokeLinecap="round">
        <line x1="853" y1="467" x2="863" y2="477" />
        <line x1="863" y1="467" x2="853" y2="477" />
      </g>
      {/* the flag you cannot forget */}
      <path d="M 858 464 L 858 434 L 884 442 L 858 450" fill="none" stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.8" strokeLinejoin="round" />

      {/* ══ THE DEER MOUSE — turned away at the line ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.3" strokeLinecap="round">
        <ellipse cx="964" cy="514" rx="15" ry="9" />
        <circle cx="946" cy="512" r="6" />
        <circle cx="948" cy="505" r="2.6" />
        <path d="M 979 514 Q 996 512 1002 500" strokeWidth="1" strokeOpacity="0.8" />
      </g>
      <circle cx="958" cy="510" r="26" fill="none" stroke="#ffb066" strokeWidth="1.3" strokeOpacity="0.8" />
      <line x1="940" y1="492" x2="976" y2="528" stroke="#ffb066" strokeWidth="1.3" strokeOpacity="0.8" strokeLinecap="round" />

      {/* ══ THE THERMOMETER — five months of this ══ */}
      <line x1="1074" y1="140" x2="1074" y2="330" stroke="#9a9ca0" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="1074" cy="344" r="13" fill="#ffb066" fillOpacity="0.14" stroke="#9a9ca0" strokeWidth="1.5" />
      <line x1="1074" y1="332" x2="1074" y2="262" stroke="#ffb066" strokeWidth="3" strokeOpacity="0.8" strokeLinecap="round" />
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55">
        <line x1="1066" y1="170" x2="1074" y2="170" />
        <line x1="1066" y1="216" x2="1074" y2="216" />
        <line x1="1066" y1="262" x2="1074" y2="262" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.1em"
        textAnchor="end"
      >
        <text x="1060" y="174" fill="#9a9ca0" fillOpacity="0.55">
          0
        </text>
        <text x="1060" y="220" fill="#9a9ca0" fillOpacity="0.55">
          -20
        </text>
        <text x="1060" y="266" fill="#ffd9ad">
          -30
        </text>
      </g>
      <text
        x="1074"
        y="386"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        FIVE MONTHS
      </text>

      {/* ══ LEADER LINES — label column to pin ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        {/* left column */}
        <path d="M 220 250 L 148 286" />
        <path d="M 214 386 L 322 428" />
        <path d="M 218 566 L 400 522" />
        {/* right column */}
        <path d="M 912 196 L 630 352" />
        <path d="M 918 300 L 762 452" />
        <path d="M 912 496 L 872 474" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 762, y: 452, n: "1" },
          { x: 322, y: 428, n: "2" },
          { x: 148, y: 286, n: "3" },
          { x: 872, y: 474, n: "4" },
          { x: 400, y: 522, n: "5" },
          { x: 630, y: 352, n: "6" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>

      {/* ══ MONO LABELS ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        {/* left column */}
        <text x="40" y="246" fill="#ffb066">
          3 · BATTERY — MAINTAINER, FLOATED
        </text>
        <text x="40" y="382" fill="#ffb066">
          2 · OIL — CHANGED BEFORE, NOT AFTER
        </text>
        <text x="40" y="562" fill="#ffb066">
          5 · TIRES — PLACARD PSI, ON CRADLES
        </text>
        {/* right column */}
        <text x="1160" y="192" textAnchor="end" fill="#ffb066">
          6 · COVER — BREATHES, NEVER PLASTIC
        </text>
        <text x="1160" y="296" textAnchor="end" fill="#ffb066">
          1 · FUEL — 95% FULL, STABILIZED
        </text>
        <text x="1160" y="492" textAnchor="end" fill="#ffb066">
          4 · TAILPIPE — PLUGGED, FLAGGED
        </text>
        {/* steel feature labels */}
        <text x="1010" y="556" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          DEER MOUSE — DENIED
        </text>
      </g>

      {/* plate caption */}
      <text
        x="600"
        y="632"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. W — PARKED RIGHT IN OCTOBER, RUNNING IN APRIL
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Fill the tank to about 95 per cent with stabilized fuel and run it five minutes. Change
        the oil. Put the battery on a maintainer. Set the tires to placard pressure. Block every
        opening a mouse can use, and cover the car with something that breathes. Do that in
        October, and April is a ten-minute wake-up instead of a rescue.
      </p>

      <h2>Why does an Alberta winter need its own storage plan?</h2>
      <p>
        Because this is not a six-week nap. A classic that parks at Halloween in Edmonton is
        realistically down until mid-April — five months and change — and most winters deliver at
        least one stretch with overnight lows past minus thirty. The cold itself is only half the
        problem. The other half is the swings: a deep snap, then a midwinter thaw, and every cold
        steel surface in an unheated garage sweats. Condensation is the quiet enemy of stored
        cars — in the tank, in the crankcase, on brake rotors, inside the exhaust. The whole
        procedure below exists to leave the car nothing to sweat into, nothing to gum up, and
        nothing for a mouse to eat. It is one honest afternoon of work.
      </p>
      <blockquote>
        <p>The car you park in October is the car you get in April. Nothing improves in the dark.</p>
        <footer>Shop rule, said every fall</footer>
      </blockquote>

      <h2>Full tank or empty — what do you do about fuel?</h2>
      <p>
        Full. An empty tank is a condensation chamber: every square inch of bare steel above the
        fuel line collects moisture through the winter and starts rusting into next summer&rsquo;s
        fuel filter. Fill to roughly 95 per cent — full enough to crowd out the air, with room
        for expansion — using the freshest fuel you can buy. Add a storage-grade fuel stabilizer
        at the label dose <strong>before</strong> the last drive home, or run the engine a good
        five minutes after dosing, because the stabilizer only protects the fuel it actually
        reaches — the carb bowl, the lines, and the pump, not just the tank. Treated correctly,
        the manufacturer rates fuel as staying fresh for up to two years.
        <a href="#src-1" className="cite-ref">[1]</a> You need six months. That margin is the
        point.
      </p>
      <p>
        Base fuel matters too. Most Canadian pump gas carries ethanol — federal rules have
        required renewable content in gasoline since 2010 — and Natural Resources Canada is plain
        that ethanol blends are meant for vehicles built since the 1980s, which your classic is
        not.<a href="#src-2" className="cite-ref">[2]</a> Ethanol pulls water out of the air and
        holds it in the fuel, which is exactly the chemistry you do not want sitting in a zinc
        carb bowl for five months. Run ethanol-free premium for the storage fill if a station
        near you still sells it — check the pump sticker. A bowl of stale E10 over winter is how
        a carburetor ends up on the bench in May; the{" "}
        <Link href="/blog/carburetor-rebuild-signs">eight rebuild signs</Link> are a separate
        article because we see it every spring.
      </p>

      <h2>Do you change the oil before storage or after?</h2>
      <p>
        Before, always. Used oil is not neutral — it carries combustion acids and moisture, and
        an oil change in October means the bearings, cam, and cylinder walls spend the winter
        coated in clean oil instead of marinating in the season&rsquo;s waste.
        <a href="#src-3" className="cite-ref">[3]</a> Change the filter with it, bring the engine
        briefly to temperature to circulate the fresh fill, and top up the cooling system with
        antifreeze rated well past minus forty — this is Alberta, test it, do not assume it.
        While you are under there, grease anything with a fitting. Then wash and wax the body,
        vacuum the interior down to the crumbs, and condition the leather and rubber. Clean is
        not vanity here: bird droppings etch paint over months, and crumbs are a standing dinner
        invitation.
      </p>

      <h2>What do you do with the battery at minus thirty?</h2>
      <p>
        A lead-acid battery self-discharges as it sits, and a discharged battery is mostly water
        — which freezes, expands, and cracks the case in a cold snap, while a fully charged one
        survives temperatures far below anything Edmonton throws. So the battery never gets to
        sit flat. If the car sleeps near a plug, the clean answer is a smart maintainer: it
        floats the battery at full charge without overcharging, and the car is ready to crank in
        April.<a href="#src-3" className="cite-ref">[3]</a> If there is no power where the car
        lives, pull the battery, store it somewhere that stays above freezing, and put a charger
        on it monthly. The old rule about never setting one on a concrete floor costs nothing to
        honour — a shelf in the furnace room does fine.
      </p>

      <h2>How do you keep mice out of a stored car?</h2>
      <p>
        Assume they are coming. A stored classic is warm-ish, dark, quiet, and upholstered — a
        deer mouse&rsquo;s dream rental — and one winter of nesting can cost more than the rest
        of this list combined: chewed harness insulation, a seat cushion opened up, a heater box
        packed with insulation. Physical exclusion is what actually works. Plug the tailpipe and
        the air intake with steel wool or a rag, and flag each plug with something loud enough
        that you cannot forget it in April.<a href="#src-3" className="cite-ref">[3]</a> Strip
        every food source from the garage — dog food and birdseed bags are the classics — and
        set snap traps around the car&rsquo;s perimeter, never inside it, where a missed trap
        means a dead mouse in your cabin all winter. Check monthly. Dryer sheets and mothballs
        have a mixed record at best; a plugged pipe has none.
      </p>
      <p>
        Take the spring inspection seriously, because in Alberta this is a health matter, not
        just an upholstery one. Deer mice here can carry hantavirus, and the province has
        recorded deaths from it; the infection risk comes from breathing dust stirred off
        droppings, so the one thing you never do is sweep or vacuum them. Air the space out for
        half an hour, soak droppings or nests with a one-to-nine bleach solution, and clean up
        with gloves.<a href="#src-4" className="cite-ref">[4]</a> If the mice won the winter and
        the cabin shows it, that is exactly what the{" "}
        <Link href="/services/classic-interiors-service">interior and trim service</Link> exists
        to put right.
      </p>

      <h2>What happens to the tires over five months?</h2>
      <p>
        They take a set. Rubber under load slowly conforms to the contact patch, and cold
        accelerates it — which is why the first drive of spring often thumps like a square
        wheel. Most flat-spotting is temporary and drives out within twenty minutes as the tires
        warm; permanent flat-spotting is rare, the product of months stationary under load in
        the wrong conditions.<a href="#src-5" className="cite-ref">[5]</a> The defence is
        simple: set the tires to the placard pressure just before parking — cold pressure drops
        as the temperature falls, and an underinflated tire takes a deeper set — and either roll
        the car half a wheel-turn once a month or take the load off entirely with jack stands or
        tire cradles for the season. On a bare or dirt floor, park on plywood or carpet squares
        so the tires are not wicking ground moisture until spring.
      </p>

      <h2>Should you start the car during the winter?</h2>
      <p>
        No — and this is the one most owners get wrong with good intentions. A ten-minute idle
        in a cold garage never brings the oil, the coolant, or the exhaust up to full
        operating temperature, so instead of clearing condensation it manufactures it:
        water and raw fuel in the crankcase, moisture sitting in a cold exhaust system, and a
        battery that gave more to the start than the idle gave back.
        <a href="#src-3" className="cite-ref">[3]</a> If a January thaw tempts you, make it a
        real drive — twenty minutes plus at temperature on dry pavement — or leave the
        car asleep. Prepared right, it loses nothing by sitting still until April.
      </p>

      <h2>Where should the car sleep — and what does storage cost?</h2>
      <p>
        Indoors, dry, and dark beats everything else. Beyond that, it is a budget question.
        Typical planning ranges in Canadian dollars, not quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Winter storage options for a classic car around Edmonton — your own unheated garage,
            rented cold storage, and heated collector storage — compared by typical monthly
            Canadian dollar cost, conditions, and drawbacks
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Your own garage</th>
              <th scope="col">Rented cold storage</th>
              <th scope="col">Heated collector storage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Typical cost (CAD)</th>
              <td className="num">$0 extra</td>
              <td className="num">$75 – $200 / month</td>
              <td className="num">$200 – $450 / month</td>
            </tr>
            <tr>
              <th scope="row">Conditions</th>
              <td>Cold swings, but you control access and can check monthly</td>
              <td>Cold but dry and dark; usually no power at the stall</td>
              <td>Stable temperature, often humidity-controlled, powered</td>
            </tr>
            <tr>
              <th scope="row">Watch out for</th>
              <td>Road salt dripping off the daily driver parked beside it</td>
              <td>No plug means the battery comes home with you</td>
              <td>Seasonal contracts book out by early fall — call in September</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Wherever it sleeps, finish with a cover that breathes — fitted cotton or a proper
        indoor-storage fabric. Never a plastic tarp, which traps ground moisture against the
        paint and hazes it by spring. Crack a window a finger&rsquo;s width so the cabin air can
        move, and leave a box of baking soda on the floor mat. And keep the comprehensive
        insurance on: fire and theft do not take the winter off. Ask your broker about
        suspending only the road coverage while it is parked. The supplies for all of this are
        cheap against what they protect:
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$10–$25</span>
          <span className="stat-l">Storage-grade fuel stabilizer, treats several tanks</span>
        </div>
        <div>
          <span className="stat-v">$30–$120</span>
          <span className="stat-l">Smart battery maintainer, typical</span>
        </div>
        <div>
          <span className="stat-v">$80–$250</span>
          <span className="stat-l">Breathable indoor car cover, typical</span>
        </div>
        <div>
          <span className="stat-v">5 min</span>
          <span className="stat-l">Run time that moves treated fuel through the carb</span>
        </div>
      </div>

      <h2>What does the April wake-up look like?</h2>
      <p>
        Mostly the put-away in reverse, done in order. Pull every plug and flag — count them
        against the note you left on the steering wheel in October. Check under the car for
        fresh stains, and check the cabin and engine bay for droppings before you sit inside,
        handling any finds by the bleach-and-gloves protocol above. Battery in or off the
        maintainer, tires back to placard pressure, oil on the dipstick and clean. Then start
        it, let it reach full operating temperature, and make the first drive a gentle one —
        the first few brake applications will scrub a winter&rsquo;s surface rust off the
        rotors, and any flat-spot thump should fade within twenty minutes. Storage, fuel, and
        cold-start strategy all live together in the{" "}
        <Link href="/guides/winter">winter guide</Link> if you want the whole season on one
        page.
      </p>
      <p>
        And if the wake-up is not clean — it cranks and will not run right, the fuel smell
        says the carb flooded, or the car went into storage with a problem you hoped winter
        would fix — stop cranking and send the year, engine, and symptoms through the{" "}
        <Link href="/quote">quote page</Link>. Spring is our season for exactly this, and the
        honest answer is sometimes ten minutes of choke adjustment, not a rebuild. Either way,
        you will know before you spend.
      </p>
    </>
  );
}
