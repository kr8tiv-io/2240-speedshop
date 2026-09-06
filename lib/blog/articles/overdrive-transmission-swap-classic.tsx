import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Overdrive Transmission Swap for a Period Car.
 * The highway-rpm wedge: 3,500 rpm on the Yellowhead versus 2,100 in overdrive,
 * auto versus manual paths, and hedged CAD ranges. Links down into engine
 * swaps, LS-swap cost, the restomod definition, the costs guide, and quote.
 */

export const meta: ArticleMeta = {
  slug: "overdrive-transmission-swap-classic",
  title:
    "Overdrive in a Period Car: Highway RPM on the Yellowhead, and What the Swap Costs",
  accent: "Overdrive",
  metaTitle: "Overdrive Swap for a Highway Classic",
  description: "Why a three-speed screams at 110 km/h on the Yellowhead, what an overdrive auto or five-speed actually costs in CAD, and how the swap fits a period car.",
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  author: "2240 Speed Shop",
  category: "Restomods",
  targetKeywords: [
    "overdrive transmission swap classic car",
    "700R4 swap cost Canada",
    "Tremec TKX classic car",
    "highway rpm classic car",
    "overdrive automatic restomod",
  ],
  faq: [
    {
      q: "How much does an overdrive transmission swap cost in Canada?",
      a: "A rebuilt 700R4 or 4L60E automatic into a period GM typically lands in the $4,000 to $9,000 CAD range installed, including converter, crossmember, yoke, and a shortened driveshaft. A TREMEC TKX five-speed commonly runs $6,000 to $12,000 all-in. A heavy-duty 4L80E or Magnum six-speed can push $8,000 to $16,000 or more. Every figure is a planning range, not a quote — tunnel work, hydraulics, and electronics move the number.",
    },
    {
      q: "Will an overdrive automatic fit my classic without cutting the tunnel?",
      a: "Often yes on common GM and Ford platforms, with a kit crossmember and a shortened driveshaft. The 700R4 is essentially a TH350 with a fourth gear, so the tunnel conversation is usually a shifter hole and a yoke, not a sawzall. Longer overdrive manuals and some six-speeds are a different story — measure the tailshaft against the tunnel before you buy. If the floor has to move, that labour belongs in the budget on day one.",
    },
    {
      q: "Automatic overdrive or a five-speed manual — which is better?",
      a: "The automatic is the livability pick: it starts at minus thirty, it does not care about your left ankle on the Henday, and it is what most restomod buyers expect. The five-speed is the involvement pick, and a modern TREMEC overdrive fifth will drop highway rpm as hard as any automatic. Choose the automatic if the car is a cruiser or a cold-climate daily. Choose the manual if shifting is the reason you bought the car.",
    },
    {
      q: "How much does overdrive actually drop highway rpm?",
      a: "A typical period three-speed or four-speed with 3.55 gears and a 28-inch tire is turning roughly 3,000 to 3,500 rpm at 110 km/h. A 0.70-range overdrive fifth or a 700R4 fourth drops that into the low two-thousands — commonly around 2,100 rpm on the Yellowhead. The engine stops screaming, cabin noise falls, oil temperature settles, and fuel use actually matters. That single ratio is the whole point of the swap.",
    },
    {
      q: "Do I need a new driveshaft and crossmember?",
      a: "Almost always a shortened driveshaft, and usually a new or adjustable crossmember. Overdrive boxes are longer than a TH350 or a Toploader, so the rear U-joint lands in a different place. Cheap out on the shaft and you buy vibration at 110 km/h, which is exactly when you wanted the quiet. Budget the shaft, yoke, speedometer drive (mechanical or electronic), and a cooler if the automatic will see highway grades.",
    },
  ],
  citations: [
    {
      name: "TREMEC, “TKX” five-speed RWD aftermarket overdrive transmission",
      url: "https://tremec.com/aftermarket/products/tkx/",
    },
    {
      name: "“Restomodding: Business Is Still Booming,” Specialty Equipment Market Association (SEMA)",
      url: "https://www.sema.org/news-media/magazine/2021/08/restomodding-business-still-booming",
    },
    {
      name: "“Factors that affect fuel efficiency,” Natural Resources Canada",
      url: "https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/personal-vehicles/factors-affect-fuel-efficiency",
    },
    {
      name: "“Barrett-Jackson Positions Collector Car Market for the Future, Solidifies Trend for Resto-Mods,” Barrett-Jackson",
      url: "https://www.barrett-jackson.com/media/press-releases/barrett-jackson-positions-collector-car-market-for-the-future-solidifies-trend-for-resto-mods",
    },
    {
      name: "Rick Carey, “For These Corvettes, the Stock vs. Modified Debate Has a Clear Winner,” Hagerty Insider, February 2024",
      url: "https://www.hagerty.com/media/market-trends/hagerty-insider/c2-stock-v-restomod/",
    },
  ],
  internalLinks: [
    "/services/engine-swaps-builds",
    "/blog/ls-swap-cost-canada",
    "/blog/what-is-a-restomod",
    "/guides/costs",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * RPM-versus-speed chart on a prairie highway: a dashed three-speed line
 * climbs through 3,500 rpm at 110 km/h while a tungsten overdrive line
 * flattens near 2,100. Below, a period transmission case in steel with the
 * extra gear called out. Editorial diagram, not a brochure cutaway.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of highway rpm versus speed for a period car: a dashed three-speed curve climbs past 3,500 rpm at 110 kilometres per hour while a solid tungsten overdrive line stays near 2,100 rpm, above a steel line-art transmission case with the extra overdrive gear highlighted"
      className="h-auto w-full"
    >
      <title>Three speeds scream on the Yellowhead. Fourth does not.</title>
      <defs>
        <radialGradient id="od-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="860" cy="560" rx="280" ry="28" fill="url(#od-pool)" />

      {/* ══ CHART ══ */}
      <g stroke="#9a9ca0" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <line x1="90" y1="70" x2="90" y2="300" />
        <line x1="90" y1="300" x2="560" y2="300" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" fill="none">
        <line x1="90" y1="300" x2="90" y2="308" />
        <line x1="250" y1="300" x2="250" y2="308" />
        <line x1="410" y1="300" x2="410" y2="308" />
        <line x1="530" y1="300" x2="530" y2="308" />
        <line x1="82" y1="120" x2="90" y2="120" />
        <line x1="82" y1="200" x2="90" y2="200" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        <text x="82" y="64" textAnchor="end">
          RPM
        </text>
        <text x="78" y="124" textAnchor="end">
          3500
        </text>
        <text x="78" y="204" textAnchor="end">
          2100
        </text>
        <text x="250" y="324" textAnchor="middle">
          80 KM/H
        </text>
        <text x="410" y="324" textAnchor="middle">
          110 KM/H
        </text>
        <text x="530" y="324" textAnchor="middle">
          130
        </text>
      </g>
      {/* three-speed screaming */}
      <path
        d="M 100 270 L 250 210 L 410 118 L 530 86"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.6"
        strokeDasharray="5 5"
        strokeLinecap="round"
      />
      {/* overdrive flat */}
      <path
        d="M 100 270 L 250 228 L 330 210 L 410 198 L 530 192"
        fill="none"
        stroke="#ffb066"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <line x1="410" y1="122" x2="410" y2="194" strokeDasharray="2 4" />
        <path d="M 405 132 L 410 122 L 415 132" />
        <path d="M 405 184 L 410 194 L 415 184" />
      </g>
      <text
        x="398"
        y="164"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#ffd9ad"
      >
        THE RPM YOU GIVE BACK
      </text>

      {/* ══ TRANSMISSION CASE ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 700 420 L 700 470 L 760 488 L 920 488 L 980 470 L 980 400 L 920 382 L 820 382 L 780 400 Z" />
        <rect x="640" y="424" width="60" height="52" rx="4" />
        <line x1="980" y1="436" x2="1080" y2="436" strokeWidth="2.2" />
        <circle cx="1092" cy="436" r="12" strokeWidth="1.6" />
      </g>
      {/* extra OD gear in tungsten */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.6">
        <circle cx="940" cy="436" r="28" />
        <circle cx="940" cy="436" r="12" strokeWidth="1.2" />
        <g strokeWidth="0.9" strokeOpacity="0.7">
          <line x1="940" y1="408" x2="940" y2="424" />
          <line x1="964" y1="424" x2="952" y2="430" />
          <line x1="964" y1="448" x2="952" y2="442" />
          <line x1="940" y1="464" x2="940" y2="448" />
          <line x1="916" y1="448" x2="928" y2="442" />
          <line x1="916" y1="424" x2="928" y2="430" />
        </g>
      </g>
      {/* shifter */}
      <path d="M 820 382 L 820 340 L 808 318" fill="none" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="804" cy="310" r="8" fill="none" stroke="#ffb066" strokeWidth="1.4" />

      {/* ground */}
      <line x1="620" y1="560" x2="1140" y2="560" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.3" />

      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 1160 200 L 940 408" />
        <path d="M 1160 310 L 1092 430" />
        <path d="M 700 200 L 410 198" />
      </g>

      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="100" y="44" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          YELLOWHEAD · 110 KM/H
        </text>
        <text x="1160" y="204" textAnchor="end" fill="#ffb066">
          1 · OVERDRIVE GEAR · ~0.70
        </text>
        <text x="1160" y="314" textAnchor="end" fill="#ffb066">
          2 · SHORTENED DRIVESHAFT
        </text>
        <text x="700" y="196" fill="#ffb066">
          3 · 2,100 RPM INSTEAD OF 3,500
        </text>
        <text x="640" y="590" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          PERIOD CASE, ONE EXTRA RATIO
        </text>
      </g>

      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 940, y: 408, n: "1" },
          { x: 1092, y: 430, n: "2" },
          { x: 410, y: 198, n: "3" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
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
        FIG. A — THREE SPEEDS SCREAM ON THE YELLOWHEAD. FOURTH DOES NOT.
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        A period three-speed at 110 km/h on the Yellowhead turns roughly 3,000 to 3,500 rpm and
        sounds like it. Overdrive drops that near 2,100 rpm — the biggest livability change you
        can make. Typical installed ranges: $4,000 to $9,000 CAD for a 700R4-class automatic,
        $6,000 to $12,000 for a TREMEC five-speed, planning ranges, not quotes.
      </p>

      <h2>Why does a period transmission scream on the highway?</h2>
      <p>
        Because it was never given a gear shorter than 1:1. A TH350, a C4, a Toploader, a
        TorqueFlite — third or fourth is direct drive. Pair that with the 3.55 or 3.73 rear gear
        that made the car feel alive off a light, and 110 km/h is an engine-speed problem, not a
        road-speed problem. Oil temperature climbs. Cabin noise climbs. Fuel use climbs, and
        Natural Resources Canada is blunt that speed itself is one of the largest fuel-economy
        levers a driver has.
        <a href="#src-3" className="cite-ref">[3]</a> The engine is not failing. It is being asked
        to cruise in a ratio that was designed as a passing gear.
      </p>
      <p>
        Overdrive is the missing ratio: typically 0.67 to 0.75, so the tailshaft turns faster than
        the engine. TREMEC&rsquo;s TKX, designed specifically for aftermarket restomods rather than
        a factory floorpan, puts that fifth gear in a compact case rated to 600 lb-ft and 8,000
        rpm, with overdrive ratios of 0.68, 0.72, or 0.81 depending on the spec.
        <a href="#src-1" className="cite-ref">[1]</a> The automatic equivalent is a 700R4, a 4L60E,
        an AOD, a 4R70W. Same idea. Different shifter.
      </p>
      <blockquote>
        <p>
          The engine you can hear at cruise is an engine you are wearing out for no reason the
          highway asked for.
        </p>
        <footer>Counter wisdom, after the third Yellowhead shakedown</footer>
      </blockquote>

      <h2>Automatic overdrive or a five-speed — which swap is right?</h2>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Overdrive automatic versus five-speed manual swap, compared by feel, cold-weather
            manners, typical CAD planning range, and the owner it fits
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Overdrive automatic</th>
              <th scope="col">Five-speed manual (TKX-class)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">The feel</th>
              <td>Cruise. The car decides.</td>
              <td>Involvement. You decide, including fifth.</td>
            </tr>
            <tr>
              <th scope="row">Alberta cold</th>
              <td>Starts and drives at minus thirty with no left-leg argument</td>
              <td>Clutch and synchros want warmth; a block heater helps</td>
            </tr>
            <tr>
              <th scope="row">Typical CAD range</th>
              <td className="num">$4,000 – $9,000</td>
              <td className="num">$6,000 – $12,000</td>
            </tr>
            <tr>
              <th scope="row">Hidden work</th>
              <td>Converter, cooler, TV cable or electronics, shifter</td>
              <td>Bellhousing, clutch hydraulics, tunnel, pedal box</td>
            </tr>
            <tr>
              <th scope="row">Right owner</th>
              <td>Cruiser, restomod buyer, cold-climate daily</td>
              <td>The person who bought the car to row it</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        SEMA has been reporting the same split for years: restomod customers want yesterday&rsquo;s
        looks with today&rsquo;s drivetrain, and transmission work is one of the skilled trades the
        industry cannot staff fast enough.
        <a href="#src-2" className="cite-ref">[2]</a> Barrett-Jackson has been pricing that
        drivetrain — overdrive automatics behind crate engines — as part of what a restomod
        <em> is</em>, not a novelty on the docket.
        <a href="#src-4" className="cite-ref">[4]</a>
      </p>

      <h2>What does an overdrive swap actually cost in Canada?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$4K–$9K</span>
          <span className="stat-l">Typical 700R4 / 4L60E automatic, installed</span>
        </div>
        <div>
          <span className="stat-v">$6K–$12K</span>
          <span className="stat-l">Typical TREMEC TKX five-speed, installed</span>
        </div>
        <div>
          <span className="stat-v">$8K–$16K+</span>
          <span className="stat-l">4L80E or Magnum six-speed, heavier duty</span>
        </div>
        <div>
          <span className="stat-v">~2,100</span>
          <span className="stat-l">Highway rpm at 110 km/h in a 0.70 overdrive</span>
        </div>
      </div>
      <p>
        Every one of those is a planning range in Canadian dollars, not a quote. The box is one
        line. The crossmember, the shortened driveshaft, the yoke, the speedometer drive, a cooler
        on an automatic, and clutch hydraulics on a manual are the rest of the invoice. Pair the
        swap with an{" "}
        <Link href="/blog/ls-swap-cost-canada">LS conversion</Link> and some of that labour folds
        in — mounts and the crossmember get solved once. Do it as a standalone job on a period
        engine and you are still buying a quieter highway, just without the EFI manners.
      </p>

      <h2>What else has to change for the swap to work?</h2>
      <ul>
        <li>
          <strong>Driveshaft.</strong> Overdrive cases are longer. The shaft shortens, the yoke
          matches the output spline, and the angles get checked at ride height. Vibration at cruise
          is a shaft problem until proven otherwise.
        </li>
        <li>
          <strong>Crossmember and mount.</strong> Kit members exist for common GM and Ford
          platforms. Oddballs get fabricated. Either way, the tailshaft has to sit on something
          that is not the original TH350 perch.
        </li>
        <li>
          <strong>Shifter and linkage.</strong> Column-shift cars need a plan. Floor-shift cars need
          a hole in the right place. A 4L60E wants a controller or a lockup trigger, not a prayer.
        </li>
        <li>
          <strong>Speedometer.</strong> Mechanical, electronic, or a GPS-driven gauge. Get this
          wrong and you also get the speedometer error that Alberta photo radar does not care about.
        </li>
        <li>
          <strong>Cooling, on automatics.</strong> A stacked-plate cooler in front of the radiator
          is cheap insurance on a Yellowhead grade in July.
        </li>
      </ul>
      <p>
        That supporting list is the actual job of an{" "}
        <Link href="/services/engine-swaps-builds">engine swap and driveline build</Link> in this
        shop: the transmission is never &ldquo;just a transmission.&rdquo; It is the spine between
        the crank and the rear end, and it has to live with Alberta cold, Alberta heat, and the
        way this province actually uses a highway. The broader restomod case — why the spine gets
        replaced while the skin stays — is the{" "}
        <Link href="/blog/what-is-a-restomod">restomod definition</Link>.
        <a href="#src-5" className="cite-ref">[5]</a>
      </p>

      <h2>Is overdrive worth it if you only drive on weekends?</h2>
      <p>
        If the weekend includes a two-hour highway run, yes. The wear you save on the engine, the
        noise you do not sit in, and the fuel you do not burn are the return, and they accrue
        whether the car is a daily or a Saturday tool. If the car never sees more than 70 km/h on
        a back road, a rebuilt period box is cheaper and more honest. Match the ratio to the road
        you actually use.
      </p>
      <p>
        The money argument, stage by stage, sits in the{" "}
        <Link href="/guides/costs">restoration cost guide</Link>. If the car is coming in for a
        driveline conversation — overdrive only, or overdrive as part of a swap — send photos and
        the rear-gear ratio through the <Link href="/quote">quote page</Link>. The first honest
        answer is usually which box fits the tunnel you already have.
      </p>
    </>
  );
}
