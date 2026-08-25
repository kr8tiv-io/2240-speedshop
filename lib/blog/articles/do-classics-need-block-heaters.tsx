import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Block Heaters, Battery Tenders, and Cold Starts.
 * The Alberta-winter keeper article no US content answers: does old iron need
 * a block heater, which heater installs on a vintage engine, and the exact
 * minus-twenty cold-start procedure for a carbureted car. Links down into the
 * tuning service, the carb rebuild article, the restoration service, the
 * winter guide, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "do-classics-need-block-heaters",
  title:
    "Block Heaters, Battery Tenders, and Cold Starts: Running a Classic Through an Alberta Cold Snap",
  accent: "Cold Snap",
  metaTitle: "Do Classic Cars Need Block Heaters? An Alberta Cold-Start Guide",
  description:
    "Whether a vintage engine needs a block heater, which type fits old iron, and how to cold-start a carbureted classic at minus twenty — from an Edmonton shop floor.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Keep It Running",
  targetKeywords: [
    "block heater classic car",
    "cold start carbureted engine",
    "battery tender winter storage",
    "classic car winter Alberta",
    "do classic cars need block heaters",
  ],
  faq: [
    {
      q: "At what temperature should I plug in my classic's block heater?",
      a: "Around minus fifteen Celsius and colder — the temperature the Alberta Motor Association flags as the point where oil thickens and batteries fade enough to matter. A big cast-iron engine wants three to four hours on the cord before you turn the key; a timer set for the small hours does that without paying to heat the block all night. Plugging in when it is warmer than minus fifteen mostly buys you faster cabin heat, not an easier start.",
    },
    {
      q: "Can you put a block heater in an old engine?",
      a: "Almost always. Most cast-iron V8s and sixes take a core-plug (frost plug) heater — the element replaces one of the soft plugs in the block and sits directly in the coolant. On rare or numbers-matching engines where nobody wants to disturb a sixty-year-old plug, an inline circulation tank heater splices into a heater hose and warms the coolant by thermal siphon without touching the block. A silicone pad heater on the oil pan warms the oil itself, which is what actually loads the starter.",
    },
    {
      q: "Is a battery tender better than a trickle charger for winter storage?",
      a: "Yes. A basic trickle charger pushes current whether the battery needs it or not, and over four or five months of storage that overcharge slowly boils the electrolyte out of an older battery. A maintainer charges to full, then drops into float mode and only tops up what the battery loses on its own. For a classic that parks in October and wakes up in April, a maintainer in the $60 to $180 CAD range is the cheapest insurance in this article.",
    },
    {
      q: "Should I disconnect my classic's battery for the winter?",
      a: "If the storage spot has power, leave the battery in the car on a maintainer — that keeps it at full charge, and a fully charged battery will not freeze until somewhere near minus sixty. If there is no outlet, pull the battery and store it somewhere above freezing, then charge it every month or so, because a discharged battery can freeze right around zero Celsius and a frozen battery is scrap. Never leave a half-charged battery sitting in an unheated garage all winter.",
    },
    {
      q: "How do you start a carbureted car in extreme cold?",
      a: "Plugged in three to four hours first, battery at full charge, fresh winter fuel in the bowl. Key off, press the pedal slowly to the floor once and release — that closes the choke, sets the fast-idle cam, and puts a prime shot down the venturi. One more slow pump at minus twenty on a cold-soaked engine; more than two risks flooding. Crank in ten-second bursts with rests between. When it fires, keep your foot off the throttle and let the fast idle hold around 1,500 rpm until the engine will take gentle driving.",
    },
  ],
  citations: [
    {
      name: "“Why Your Block Heater is Essential in Winter,” AMA Insider, Alberta Motor Association",
      url: "https://amainsider.com/auto-expert-block-heaters/",
    },
    {
      name: "“Factors that affect fuel efficiency,” Natural Resources Canada",
      url: "https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/personal-vehicles/factors-affect-fuel-efficiency",
    },
    {
      name: "Zerostart engine heating FAQ, Phillips & Temro Industries technical library",
      url: "https://phillipsandtemro.com/resources/zerostart-temro-resources/faq/",
    },
    {
      name: "“Winter Car Battery Maintenance: Complete Guide to Cold Weather Battery Care,” Battery Tender technical library",
      url: "https://www.batterytender.com/blogs/battery-tender-blog/winter-car-battery-maintenance-complete-guide-to-cold-weather-battery-care",
    },
    {
      name: "“How To Adjust The Electric Choke On A Holley 4-Barrel Carburetor,” OnAllCylinders, Summit Racing technical library",
      url: "https://www.onallcylinders.com/2013/05/09/how-to-adjust-the-electric-choke-on-a-holley-4-barrel-carburetor/",
    },
  ],
  internalLinks: [
    "/blog/carburetor-rebuild-signs",
    "/services/classic-performance-tuning",
    "/services/classic-car-restoration",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 10,
};

/**
 * The night before a minus-twenty morning, drawn as a plate: an engine in
 * section with a core-plug heater element live in the coolant jacket and a
 * silicone pad under the oil pan, cord running through a timer to the wall,
 * heat shimmer rising off the valve cover; beside it a battery on a
 * maintainer holding float, and a thermometer reading the cold snap. Steel
 * line art, tungsten for everything that is warm or working.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of a classic car prepared for a minus-twenty Alberta night: an engine cross-section with a core-plug block heater element glowing in the coolant jacket and a silicone pad heater under the oil pan, the heater cord running through a timer to a wall outlet, heat shimmer rising from the valve cover, a thermometer reading minus twenty Celsius, and a battery connected to a maintainer holding float charge"
      className="h-auto w-full"
    >
      <title>The night before the cold start — what plugs in where</title>
      <defs>
        <radialGradient id="bh-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the engine */}
      <ellipse cx="500" cy="560" rx="330" ry="32" fill="url(#bh-pool)" />

      {/* ══ THERMOMETER — the cold snap ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 122 132 Q 122 118 134 118 Q 146 118 146 132 L 146 468" />
        <path d="M 122 132 L 122 468" />
        <circle cx="134" cy="496" r="24" />
      </g>
      {/* scale ticks: 0 / -10 / -20 / -30 */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55">
        <line x1="146" y1="180" x2="160" y2="180" />
        <line x1="146" y1="248" x2="160" y2="248" />
        <line x1="146" y1="316" x2="160" y2="316" />
        <line x1="146" y1="384" x2="160" y2="384" />
      </g>
      {/* mercury — up to the minus-twenty line */}
      <circle cx="134" cy="496" r="15" fill="#ffb066" fillOpacity="0.55" />
      <line x1="134" y1="480" x2="134" y2="316" stroke="#ffb066" strokeWidth="7" strokeOpacity="0.55" strokeLinecap="round" />
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.08em"
      >
        <text x="168" y="184" fill="#9a9ca0" fillOpacity="0.6">0</text>
        <text x="168" y="252" fill="#9a9ca0" fillOpacity="0.6">-10</text>
        <text x="168" y="320" fill="#ffd9ad">-20</text>
        <text x="168" y="388" fill="#9a9ca0" fillOpacity="0.6">-30</text>
      </g>
      <text
        x="134"
        y="566"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        OVERNIGHT
      </text>

      {/* ══ HEAT SHIMMER off the valve cover ══ */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.45" strokeLinecap="round">
        <path d="M 380 118 Q 388 102 380 86 Q 372 70 380 56" />
        <path d="M 450 122 Q 458 106 450 90 Q 442 74 450 60" />
        <path d="M 520 118 Q 528 102 520 86 Q 512 70 520 56" />
      </g>

      {/* ══ ENGINE IN SECTION ══ */}
      {/* valve cover */}
      <path
        d="M 336 136 Q 330 136 330 144 L 330 168 L 570 168 L 570 144 Q 570 136 564 136 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* block */}
      <path
        d="M 316 168 L 316 424 L 584 424 L 584 168"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* cylinder bores, dashed */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.65" strokeDasharray="4 5">
        <path d="M 366 186 L 366 330 M 410 186 L 410 330" />
        <path d="M 490 186 L 490 330 M 534 186 L 534 330" />
      </g>
      {/* pistons */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.3">
        <rect x="368" y="236" width="40" height="30" />
        <rect x="492" y="264" width="40" height="30" />
      </g>
      {/* coolant jacket channels around the bores */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5">
        <path d="M 340 186 L 340 400 M 436 186 L 436 400 M 464 186 L 464 400 M 560 186 L 560 400" />
      </g>
      {/* core-plug heater — element live in the jacket */}
      <circle cx="316" cy="356" r="11" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.5" />
      <path
        d="M 328 356 L 342 346 L 356 366 L 370 346 L 384 366 L 398 350"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* warmth rising inside the jacket — thermal siphon */}
      <g fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" strokeDasharray="2 5">
        <path d="M 340 340 L 340 200" />
        <path d="M 436 380 L 436 214" />
        <path d="M 464 372 L 464 206" />
      </g>
      {/* oil pan */}
      <path
        d="M 336 424 L 348 486 L 552 486 L 564 424"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* oil level */}
      <line x1="356" y1="462" x2="544" y2="462" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="5 4" />
      {/* pad heater under the pan */}
      <rect x="396" y="490" width="120" height="9" rx="4" fill="none" stroke="#ffb066" strokeWidth="1.4" />

      {/* ══ CORD — heater to timer to wall ══ */}
      <path
        d="M 316 368 Q 296 404 296 452 Q 296 522 380 534 L 620 538"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.3"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      {/* timer */}
      <rect x="620" y="516" width="58" height="44" rx="4" fill="#0a0a0b" stroke="#9a9ca0" strokeWidth="1.5" />
      <circle cx="649" cy="538" r="13" fill="none" stroke="#9a9ca0" strokeWidth="1.2" />
      <path d="M 649 538 L 649 528 M 649 538 L 656 542" stroke="#ffb066" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* cord on to the outlet */}
      <path d="M 678 538 L 762 538" fill="none" stroke="#ffb066" strokeWidth="1.3" strokeOpacity="0.7" strokeLinecap="round" />
      {/* wall outlet */}
      <rect x="762" y="512" width="40" height="52" rx="4" fill="none" stroke="#9a9ca0" strokeWidth="1.5" />
      <g stroke="#9a9ca0" strokeWidth="1.4" strokeLinecap="round">
        <line x1="777" y1="528" x2="777" y2="538" />
        <line x1="787" y1="528" x2="787" y2="538" />
        <line x1="782" y1="548" x2="782" y2="552" />
      </g>

      {/* ══ BATTERY ON THE MAINTAINER ══ */}
      <rect x="852" y="196" width="196" height="112" rx="6" fill="none" stroke="#9a9ca0" strokeWidth="2" />
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4">
        <rect x="874" y="182" width="22" height="14" />
        <rect x="1004" y="182" width="22" height="14" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.08em"
      >
        <text x="885" y="176" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.7">-</text>
        <text x="1015" y="176" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.7">+</text>
        <text x="950" y="290" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6">12 V</text>
      </g>
      {/* maintainer box */}
      <rect x="906" y="86" width="110" height="52" rx="5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.4" />
      {/* float-mode trace: charge ramp, then flat float line */}
      <path
        d="M 916 126 L 936 126 L 948 102 L 1006 102"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* leads to the posts */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round">
        <path d="M 916 138 Q 886 158 885 180" />
        <path d="M 1006 138 Q 1014 158 1015 180" />
      </g>
      <circle cx="885" cy="182" r="4" fill="none" stroke="#ffb066" strokeWidth="1.2" />
      <circle cx="1015" cy="182" r="4" fill="none" stroke="#ffb066" strokeWidth="1.2" />

      {/* ══ LEADER LINES ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 214 76 L 420 88" />
        <path d="M 214 336 L 304 352" />
        <path d="M 214 506 L 392 494" />
        <path d="M 1160 350 L 1050 300" />
        <path d="M 1160 452 L 682 528" />
        <path d="M 1156 96 L 1020 108" />
      </g>

      {/* ══ MONO LABELS ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="40" y="80" fill="#ffb066">
          HEAT RISES — 3-4 H ON THE CORD
        </text>
        <text x="40" y="340" fill="#ffb066">
          CORE-PLUG HEATER — IN THE COOLANT
        </text>
        <text x="40" y="510" fill="#ffb066">
          PAD HEATER — WARMS THE OIL ITSELF
        </text>
        <text x="1160" y="100" textAnchor="end" fill="#ffb066">
          MAINTAINER — FLOAT, NOT TRICKLE
        </text>
        <text x="1160" y="354" textAnchor="end" fill="#ffb066">
          FULL CHARGE WON&rsquo;T FREEZE — FLAT WILL
        </text>
        <text x="1160" y="456" textAnchor="end" fill="#ffb066">
          TIMER — ON BEFORE YOU WAKE
        </text>
        {/* steel feature labels */}
        <text x="620" y="452" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          OIL PAN
        </text>
        <text x="782" y="592" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          120 V
        </text>
      </g>
      <path d="M 616 448 L 566 452" stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.4" fill="none" />

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
        FIG. W — WHAT PLUGS IN WHERE, THE NIGHT BEFORE
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        If the car drives in winter, yes — fit a block heater, plug in below minus fifteen, and
        give cast iron three to four hours. If it sleeps until spring, the{" "}
        <strong>battery tender</strong> matters more than the heater. And a carbureted engine will
        start at minus twenty, provided the choke, the fuel, and the battery are all doing their
        jobs.
      </p>

      <h2>Does a classic car actually need a block heater?</h2>
      <p>
        A modern car starts unplugged at minus thirty because everything about it was engineered
        to: 0W-20 synthetic oil that still pours in the cold, sequential fuel injection that
        meters a perfect rich mixture on the first revolution, and a gear-reduction starter fed by
        a battery sized with winter in mind. Your classic has none of that. It has conventional
        oil that turns to honey, a carburetor that needs a working choke and a prayer, and — on
        original cars — a starter and charging system designed when engineers assumed you owned a
        garage.
      </p>
      <p>
        So the honest answer splits in two. A classic that gets driven through winter needs a
        block heater, full stop. The Alberta Motor Association&rsquo;s guidance is the number this
        province runs on: plug in at minus fifteen and colder, for three to four hours before you
        drive, and put the cord on a timer so you are not paying to heat the block all
        night.<a href="#src-1" className="cite-ref">[1]</a> Natural Resources Canada backs the
        timer habit from the fuel side — a pre-warmed engine burns measurably less fuel and does
        not need to idle to warm up, which is the slowest and dirtiest way to heat an
        engine.<a href="#src-2" className="cite-ref">[2]</a> Their two-hour timer figure is
        written for modern engines; a 300-pound cast-iron V8 soaks up cold like a boat anchor,
        which is why the three-to-four-hour number is the one this shop uses.
      </p>
      <p>
        A classic that hibernates from October to April does not need a block heater at all. It
        needs the battery looked after, the fuel stabilized, and the choke set right for the
        spring morning it wakes up — which is the rest of this article.
      </p>

      <h2>Which block heater installs on old iron?</h2>
      <p>
        Four types matter, and the right one depends on how original the engine is and how brave
        you feel about sixty-year-old core plugs. The classic choice is the{" "}
        <strong>core-plug heater</strong> — often called a frost plug or freeze plug heater — where
        the element replaces one of the soft plugs in the side of the block and sits directly in
        the coolant.<a href="#src-3" className="cite-ref">[3]</a> On a small-block Chevrolet,
        Ford, or Mopar V8 the plugs are accessible and the parts are cheap. The catch is age: a
        steel plug that has been in a block since the sixties may be rust-welded in place or
        thinned to foil, and the correct move while the coolant is drained is to replace the
        neighbouring plugs with brass at the same time, not to disturb one and hope.
      </p>
      <p>
        Where nobody wants a hole punched in numbers-matching iron, the{" "}
        <strong>circulation tank heater</strong> is the answer. It splices into a heater hose,
        heats the coolant in its own canister, and moves it through the engine by thermal
        siphoning — warm coolant rises, cool coolant falls in behind it — with no drilling and no
        block surgery.<a href="#src-3" className="cite-ref">[3]</a> Third is the{" "}
        <strong>silicone pad heater</strong>, glued to the flat of the oil pan, which warms the
        one fluid the other two barely touch: the oil itself, which is what actually fights the
        starter at minus twenty-five. Fourth is the magnetic heater, which is a convenience item
        for a truck bumper, not a plan.
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Four engine heater types compared for vintage engines: core-plug heater, circulation
            tank heater, oil pan pad heater, and magnetic heater, by typical installed cost in
            Canadian dollars, how each installs, and what each is best for
          </caption>
          <thead>
            <tr>
              <th scope="col">Heater type</th>
              <th scope="col">Typical cost, installed (CAD)</th>
              <th scope="col">How it goes on</th>
              <th scope="col">Best for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Core-plug heater</th>
              <td className="num">$200 – $450</td>
              <td>Element replaces a frost plug, sits in the coolant jacket</td>
              <td>Common V8s and sixes with sound, accessible plugs</td>
            </tr>
            <tr>
              <th scope="row">Circulation tank heater</th>
              <td className="num">$250 – $550</td>
              <td>Splices into a heater hose, thermal-siphons warm coolant</td>
              <td>Rare or numbers-matching engines — no holes in the block</td>
            </tr>
            <tr>
              <th scope="row">Oil pan pad heater</th>
              <td className="num">$150 – $350</td>
              <td>Silicone pad bonded to the pan, warms the oil directly</td>
              <td>Pairing with a coolant heater for the brutal weeks</td>
            </tr>
            <tr>
              <th scope="row">Magnetic heater</th>
              <td className="num">$40 – $90, no install</td>
              <td>Sticks to any flat steel surface, moves car to car</td>
              <td>Occasional use on a spare vehicle — not a daily plan</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Every figure is a planning range in Canadian dollars, not a quote — access is the
        variable. A core plug hiding behind a steering box or an exhaust manifold turns a
        one-hour job into three, and the honest number arrives after someone has actually looked
        at your engine bay.
      </p>

      <h2>Will a battery tender get a stored classic through winter?</h2>
      <p>
        The battery is where Alberta winters kill classics, and the arithmetic is ugly. At minus
        eighteen, a battery delivers roughly half the cranking power it makes on a summer
        day — at the exact moment the thickened oil demands more from the starter, not
        less.<a href="#src-4" className="cite-ref">[4]</a> Worse, state of charge decides whether
        the battery survives the season at all: a fully charged battery will not freeze until
        somewhere near minus sixty, but a discharged one can freeze right around zero
        Celsius.<a href="#src-4" className="cite-ref">[4]</a> A frozen battery — cracked case,
        buckled plates — is scrap, and it usually announces itself the first warm day of spring.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">-15&deg;C</span>
          <span className="stat-l">The plug-in point — AMA&rsquo;s line for Alberta</span>
        </div>
        <div>
          <span className="stat-v">50%</span>
          <span className="stat-l">Cranking power a battery loses by minus eighteen</span>
        </div>
        <div>
          <span className="stat-v">3–4 hrs</span>
          <span className="stat-l">Cord time before starting — put it on a timer</span>
        </div>
        <div>
          <span className="stat-v">$60–$180</span>
          <span className="stat-l">Typical quality maintainer, CAD — cheap insurance</span>
        </div>
      </div>
      <p>
        The fix costs less than one tow. A <strong>battery maintainer</strong> — tender is the
        brand name that became the noun — charges the battery to full, then drops to a float mode
        that only replaces what the battery loses sitting there.<a href="#src-4" className="cite-ref">[4]</a>{" "}
        That float behaviour is the whole difference from an old-school trickle charger, which
        pushes current whether the battery wants it or not and will slowly boil an unattended
        battery dry over a five-month Edmonton winter. Buy the maintainer, not the trickle
        charger, and if your car is an early one still on 6 volts, check the box — most good
        maintainers switch between 6 and 12.
      </p>
      <p>
        No power at the storage spot? Pull the battery, store it somewhere above freezing, and
        put a charger on it monthly. What you must not do is the common thing: leave a
        half-charged battery in an unheated garage in November and hope. By February it is
        discharged, by the first cold snap it is frozen, and by May you are buying a battery and
        cleaning up the acid.
      </p>

      <h2>How do you cold-start a carbureted engine at minus twenty?</h2>
      <p>
        Technique matters more than displacement here. Three preconditions, then a procedure.
        Fuel: fresh, winter-blend gasoline — winter fuel is blended more volatile exactly so it
        vaporizes in the cold, and six-month-old summer gas is half your hard-start problem.
        Battery: full charge, per the section above. Choke: actually working — a choke fighting
        fifty years of varnish loses to a cold snap every time, and if yours will not close and
        release cleanly, read the{" "}
        <Link href="/blog/carburetor-rebuild-signs">carburetor rebuild signs</Link> before
        blaming the weather.
      </p>
      <ol>
        <li>
          <strong>Plug in three to four hours ahead.</strong> Timer on, cord checked — a warm
          block thins the oil, speeds cranking, and helps fuel vaporize off the intake runners.
        </li>
        <li>
          <strong>Key off, press the pedal slowly to the floor once, and release.</strong> That
          single stroke closes the choke plate and drops the fast-idle cam into
          position,<a href="#src-5" className="cite-ref">[5]</a> and the accelerator pump fires
          one prime shot down the venturi on the way. At minus twenty on a cold-soaked engine,
          give it one more slow pump. More than two is how carbureted engines flood.
        </li>
        <li>
          <strong>Crank in ten-second bursts.</strong> Rest half a minute between bursts so the
          starter cools and the battery voltage recovers. Grinding away for thirty seconds
          straight cooks starters and finishes batteries.
        </li>
        <li>
          <strong>When it fires, feet off.</strong> The fast-idle cam should hold the engine
          around 1,500 rpm<a href="#src-5" className="cite-ref">[5]</a> while the choke pull-off
          cracks the plate open so it does not drown. Resist the urge to blip the
          throttle — every blip risks knocking the cam loose and stalling a still-cold engine.
        </li>
        <li>
          <strong>Thirty to sixty seconds, then drive gently.</strong> Idling in the driveway is
          the slowest possible way to warm an engine and it washes fuel past cold rings; light
          driving warms everything faster and cleaner.<a href="#src-2" className="cite-ref">[2]</a>{" "}
          A light kick of the pedal once the engine takes throttle steps it down off fast idle.
        </li>
      </ol>
      <p>
        If the choke releases too early and the engine stumbles cold, or hangs on fast idle ten
        minutes after warm-up, the electric choke cap adjusts one notch at a time against its
        index marks until it holds through warm-up and releases when the engine is
        ready.<a href="#src-5" className="cite-ref">[5]</a> A sea-level factory index is rarely
        right for an Edmonton January — setting chokes and fast idle for real Alberta mornings is
        routine work on the{" "}
        <Link href="/services/classic-performance-tuning">performance and tuning</Link> bench,
        and it is a one-visit fix.
      </p>
      <blockquote>
        <p>The car that starts at minus twenty was prepared at plus five.</p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>

      <h2>Should the car just sleep until spring?</h2>
      <p>
        Most classics should, and not because of the cold — cold is solvable with a cord and a
        battery charger. The reason is what Edmonton puts on the roads. Anti-icing brine and
        salt-sand mix sit in every seam and crevice a sixty-year-old body offers, and original
        quarter panels do not come back. One slushy winter can undo years of careful ownership,
        which is how too many nice drivers end up booked into{" "}
        <Link href="/services/classic-car-restoration">restoration</Link> for rust repair they
        never had to need.
      </p>
      <p>
        If the car hibernates: maintainer on the battery, tank filled with stabilized or
        ethanol-free fuel so the carburetor does not varnish, tires at full pressure, and a
        proper once-over before the key turns in April. The complete checklist — storage, fuel,
        rodents, insurance, and the spring wake-up — lives in the{" "}
        <Link href="/guides/winter">winter guide</Link>. If the car works for a living all
        winter, do all of the above plus the block heater, and wash the underside every thaw.
      </p>
      <p>
        Either way, the cheap moves happen before the snow. A core-plug heater, a choke set for
        this latitude, and a maintainer together cost less than one flatbed ride and a spring
        no-start diagnosis. Send the year, the engine, and how the car gets used through the{" "}
        <Link href="/quote">quote page</Link>, and you will get a straight answer on which heater
        fits your block, what it should cost, and whether your cold-start problem is weather or
        wear.
      </p>
    </>
  );
}
