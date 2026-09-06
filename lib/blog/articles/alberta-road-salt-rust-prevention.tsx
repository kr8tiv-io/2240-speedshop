import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Alberta Road Salt and Rust Prevention.
 * Calcium chloride, the underbody, and what actually works here: oil-film
 * treatments, rinsing, never parking wet in a heated garage. Links down into
 * body/metal, rust repair cost, daily driving, winter storage, winter guide,
 * and quote.
 */

export const meta: ArticleMeta = {
  slug: "alberta-road-salt-rust-prevention",
  title: "Alberta Road Salt, Calcium Chloride, and What Actually Stops Rust",
  accent: "Chloride",
  metaTitle: "Alberta Road Salt Rust Prevention",
  description: "What calcium chloride does to a classic underbody in Alberta, why a heated garage can make it worse, and the oil-film habits that actually work here. ",
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  author: "2240 Speed Shop",
  category: "Alberta Life",
  targetKeywords: [
    "Alberta road salt rust prevention",
    "calcium chloride classic car Edmonton",
    "undercoating classic car Alberta",
    "Krown Fluid Film classic car",
    "how to protect classic car from road salt",
  ],
  faq: [
    {
      q: "Does Edmonton still use calcium chloride on winter roads?",
      a: "Not as a direct anti-icing spray on city streets — council paused that program in 2019 after corrosion complaints. Calcium chloride is still used as a pre-wetting agent so salt and sand stick, and it is still applied to bike lanes and sidewalks. The province uses salt and calcium chloride on highways, including treated sand. Practically, chloride is on Edmonton-area pavement all winter, and vehicle protection is the owner's job.",
    },
    {
      q: "What is the best rust prevention for a classic in Alberta?",
      a: "An annual oil- or wax-film treatment into seams and box sections before the first brine truck, typically $150 to $300 CAD, plus a thorough underside rinse any time the car has touched treated pavement, and never parking it wet in a heated garage. Soft, creeping films beat hard rubberized undercoating, which traps chloride against the steel when it cracks. Dry storage and clear drain holes finish the job.",
    },
    {
      q: "Is rubberized undercoating good for a classic car?",
      a: "On clean, rust-free metal, a well-applied hard coating can help. On a sixty-year-old underbody it is often a trap: the coating cracks, chloride wicks behind it, and the rust you cannot see is worse than the rust you could. Oil- and wax-film products stay wet, creep into seams, and get reapplied every year — which is the point. If a previous owner already sprayed a hard coat, inspect it. Where it has lifted, it comes off before anything honest goes on.",
    },
    {
      q: "Should I wash the underside after driving on salted roads?",
      a: "Yes, as soon as you can, and then dry it. Chloride residue plus a warm garage is a corrosion chamber — the reaction runs fastest exactly where the car thaws. A coin-op underbody wand or a shop rinse beats waiting until spring. If you cannot rinse, do not park it dripping on a heated floor. Leave it cold until you can wash, then bring it in dry.",
    },
    {
      q: "Can I drive a classic in an Alberta winter if I rustproof it?",
      a: "Mechanically, a sorted classic will run. The rustproofing slows the chloride; it does not cancel it. Most owners still treat winter pavement as a last resort — dry-cold windows only, park it when the roads are wet or white with residue. Collector policies also generally forbid daily winter commuting. Rustproofing is what you do because a single salted errand happens, not because the car became a snowplow.",
    },
  ],
  citations: [
    {
      name: "“Edmonton ditches calcium chloride as anti-icing agent,” CBC News Edmonton, October 2019",
      url: "https://www.cbc.ca/news/canada/edmonton/edmonton-city-council-calcium-chloride-1.5314123",
    },
    {
      name: "“City of Edmonton says what calcium chloride may do to your vehicle is your responsibility,” Global News, June 2019",
      url: "https://globalnews.ca/news/5436112/edmonton-vehicle-calcium-chloride-winter-roads/",
    },
    {
      name: "“Code of practice for the environmental management of road salts,” Environment and Climate Change Canada",
      url: "https://www.canada.ca/en/environment-climate-change/services/pollutants/road-salts/code-practice-environmental-management.html",
    },
    {
      name: "“Road salts assessment: inorganic chloride salts with or without ferrocyanide salts,” Environment and Climate Change Canada",
      url: "https://www.canada.ca/en/environment-climate-change/services/canadian-environmental-protection-act-registry/substances-list/road-salts-assessment-inorganic-chloride.html",
    },
    {
      name: "“What’s the forecast for Edmonton’s snow, ice control this winter?” Transforming Edmonton, City of Edmonton",
      url: "https://transforming.edmonton.ca/whats-the-forecast-for-edmontons-snow-ice-control-this-winter/",
    },
  ],
  internalLinks: [
    "/services/body-paint-metalwork",
    "/blog/rust-repair-cost-canada",
    "/blog/daily-driving-a-classic-in-alberta",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 8,
};

/**
 * Underbody in plan view: rockers, rails, floor pans as steel line art.
 * Chloride wicks into seams as dashed tungsten; an oil-film halo shows what
 * actually creeps. A heated-garage box on the right is labelled a corrosion
 * chamber when the car comes in wet. Editorial plate.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Plan-view technical diagram of a classic car underbody: frame rails, rockers, and floor pans in steel line art, with dashed tungsten showing chloride wicking into seams, an oil-film halo marking creeping rust prevention, and a heated-garage box labelled as a corrosion chamber when the car is parked wet"
      className="h-auto w-full"
    >
      <title>Where chloride hides, and what actually stops it</title>
      <defs>
        <radialGradient id="sl-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="520" cy="560" rx="360" ry="28" fill="url(#sl-pool)" />

      {/* underbody plan */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="180" y="140" width="560" height="360" rx="8" />
        {/* rails */}
        <rect x="210" y="160" width="36" height="320" rx="4" />
        <rect x="674" y="160" width="36" height="320" rx="4" />
        {/* rockers */}
        <rect x="160" y="200" width="24" height="240" rx="3" />
        <rect x="736" y="200" width="24" height="240" rx="3" />
        {/* floor ribs */}
        <g strokeWidth="1" strokeOpacity="0.45">
          <line x1="280" y1="220" x2="640" y2="220" />
          <line x1="280" y1="280" x2="640" y2="280" />
          <line x1="280" y1="340" x2="640" y2="340" />
          <line x1="280" y1="400" x2="640" y2="400" />
        </g>
        {/* trans tunnel */}
        <path d="M 430 160 L 430 420 L 490 420 L 490 160" strokeWidth="1.3" strokeOpacity="0.6" />
      </g>

      {/* chloride wicking — dashed */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.4" strokeDasharray="4 5" strokeLinecap="round">
        <path d="M 172 220 L 172 420" />
        <path d="M 748 220 L 748 420" />
        <path d="M 210 470 L 710 470" />
        <ellipse cx="172" cy="320" rx="18" ry="70" strokeOpacity="0.7" />
        <ellipse cx="748" cy="320" rx="18" ry="70" strokeOpacity="0.7" />
      </g>
      {/* oil film halo — solid soft */}
      <g fill="none" stroke="#ffd9ad" strokeWidth="2.2" strokeOpacity="0.55">
        <rect x="148" y="188" width="48" height="264" rx="8" />
        <rect x="724" y="188" width="48" height="264" rx="8" />
      </g>

      {/* drain holes */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.2">
        <circle cx="172" cy="430" r="6" />
        <circle cx="748" cy="430" r="6" />
        <circle cx="300" cy="480" r="6" />
        <circle cx="620" cy="480" r="6" />
      </g>

      {/* heated garage box */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.5">
        <rect x="900" y="180" width="230" height="220" rx="4" />
        <line x1="900" y1="210" x2="1130" y2="210" strokeOpacity="0.5" />
        {/* dripping car ghost */}
        <path d="M 940 300 L 950 270 L 1080 270 L 1090 300 L 1070 310 L 960 310 Z" strokeWidth="1.3" strokeOpacity="0.7" />
        <g stroke="#ffb066" strokeWidth="1" strokeDasharray="2 3">
          <line x1="980" y1="310" x2="980" y2="360" />
          <line x1="1010" y1="310" x2="1010" y2="370" />
          <line x1="1040" y1="310" x2="1040" y2="350" />
        </g>
      </g>

      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 80 160 L 172 220" />
        <path d="M 80 320 L 148 320" />
        <path d="M 80 480 L 300 480" />
        <path d="M 1160 160 L 1015 180" />
        <path d="M 1160 360 L 1040 360" />
      </g>

      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 172, y: 220, n: "1" },
          { x: 148, y: 320, n: "2" },
          { x: 300, y: 480, n: "3" },
          { x: 1015, y: 180, n: "4" },
          { x: 1040, y: 360, n: "5" },
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
          1 · ROCKER SEAM — THE SALT SHELF
        </text>
        <text x="40" y="324" fill="#ffb066">
          2 · OIL FILM — CREEPS, DOES NOT CRACK
        </text>
        <text x="40" y="484" fill="#ffb066">
          3 · DRAIN HOLES — KEEP THEM OPEN
        </text>
        <text x="1160" y="164" textAnchor="end" fill="#ffb066">
          4 · HEATED GARAGE
        </text>
        <text x="1160" y="364" textAnchor="end" fill="#ffb066">
          5 · WET + WARM = CORROSION CHAMBER
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
        FIG. A — WHERE CHLORIDE HIDES, AND WHAT ACTUALLY STOPS IT
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Chloride is on Alberta pavement all winter — city pre-wet, provincial salt, sidewalk brine.
        What works on a classic is an annual oil-film into the seams, typically $150 to $300 CAD,
        a rinse after any salted drive, and never parking wet in a heated garage. Hard coatings
        crack. Soft film creeps.
      </p>

      <h2>What is actually on Alberta roads in winter?</h2>
      <p>
        Sodium chloride, sand, and calcium chloride in some combination, depending on the year
        and the authority. Edmonton city council voted in 2019 to stop using calcium chloride as
        a direct anti-icing agent on streets after a very public fight about vehicle corrosion;
        the city still planned to use it on sidewalks and bike lanes, and chloride as a pre-wet
        never really left the toolkit.
        <a href="#src-1" className="cite-ref">[1]</a>
        <a href="#src-5" className="cite-ref">[5]</a> Global News quoted the city saying damage
        from calcium chloride was the owner&rsquo;s responsibility.
        <a href="#src-2" className="cite-ref">[2]</a> That sentence is still the policy, whatever
        is in the brine tank this January.
      </p>
      <p>
        The province has its own winter specification: salt and calcium chloride as de-icing
        chemicals on packed snow and ice that plows cannot take off, and calcium-chloride-treated
        sand in the stockpile. Environment and Climate Change Canada&rsquo;s Code of Practice
        exists because road salts, used at Canadian volumes, raise chloride in groundwater and
        surface water — which is another way of saying the stuff is persistent, and it does not
        stop being corrosive because a city paused a spray program.
        <a href="#src-3" className="cite-ref">[3]</a>
        <a href="#src-4" className="cite-ref">[4]</a>
      </p>

      <h2>Why is a heated garage a problem?</h2>
      <p>
        Because corrosion is a chemical reaction, and reactions run faster when they are warm and
        wet. A classic that comes off the Henday caked in brine, then sits in a 15-degree garage,
        spends the night thawing chloride into every seam. A car left cold in an unheated space
        is slower. The{" "}
        <Link href="/blog/daily-driving-a-classic-in-alberta">daily-driving piece</Link> makes the
        same point: never park it away wet. Rinse first, or leave it outside until you can.
      </p>
      <blockquote>
        <p>
          A warm garage plus last night&rsquo;s brine is not storage. It is a bath. Dry is the
          whole trick.
        </p>
        <footer>Posted on the wash-bay door, November through April</footer>
      </blockquote>

      <h2>What actually works on a classic underbody?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$150–$300</span>
          <span className="stat-l">Annual oil- or wax-film treatment, typical range</span>
        </div>
        <div>
          <span className="stat-v">Once</span>
          <span className="stat-l">Underside rinse after any salted drive, then dry</span>
        </div>
        <div>
          <span className="stat-v">Never</span>
          <span className="stat-l">Park dripping wet on a heated floor</span>
        </div>
        <div>
          <span className="stat-v">Open</span>
          <span className="stat-l">Drain holes in doors, rockers, quarters</span>
        </div>
      </div>
      <ul>
        <li>
          <strong>Soft film, every year.</strong> Oil- or wax-based products (the Krown / Fluid
          Film family of ideas) stay wet, creep into box sections, and get touched up. That
          annual $150 to $300 CAD is a planning range, not a quote, and it is the cheapest metal
          work you will buy.
        </li>
        <li>
          <strong>Not a cracked rubberized coat.</strong> Hard undercoating over sixty-year-old
          seams traps chloride when it splits. If it is already on the car and sound, leave the
          sound parts. Where it has tented, it comes off.
        </li>
        <li>
          <strong>Rinse, then dry.</strong> A wand on the rockers, the rear of the front wheels,
          the front of the rear wheels, and the floors. Then air, time, or a cold sit before the
          heat.
        </li>
        <li>
          <strong>Drain holes.</strong> Doors, quarters, rockers. A plugged drain is a salt bath
          with a lid.
        </li>
        <li>
          <strong>Drive less on wet chloride.</strong> Dry-cold is kinder than wet-white. The
          <Link href="/guides/winter"> winter guide</Link> is how the season is supposed to go.
        </li>
      </ul>

      <h2>Can rustproofing replace staying off the salt?</h2>
      <p>
        No. It buys you a margin when a salted errand happens. It does not make a classic a
        winter beater. The metal that fails first is still the metal in the{" "}
        <Link href="/blog/rust-repair-cost-canada">rust-repair map</Link> — rockers, arches, floors,
        cowl — and those repairs are hundreds to thousands of dollars a panel. Film is prevention.
        Cutting is the invoice after prevention failed.
      </p>
      <p>
        If the underside is already bubbling, stop spraying film over scale and get the car on a
        hoist. That is{" "}
        <Link href="/services/body-paint-metalwork">body, paint, and metalwork</Link>, not a
        rustproofing upsell. Send underside photos through the <Link href="/quote">quote page</Link>{" "}
        if you want a straight call on whether the car needs film, a rinse habit, or a cutter.
        Chloride will not wait for the decision.
      </p>
    </>
  );
}
