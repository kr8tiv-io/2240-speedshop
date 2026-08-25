import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Daily-Driving a Classic in Alberta.
 * The Alberta Life anchor for the "classic as daily driver" cluster. Answers
 * the question with a calendar instead of a shrug: chloride reality, insurance
 * reality, and the upgrade list that makes the shoulder seasons workable.
 * Links down into body and metalwork, the winter guide, the tuning service,
 * the LS swap cost article, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "daily-driving-a-classic-in-alberta",
  title: "Can You Daily-Drive a Classic in Alberta? An Honest Answer",
  accent: "Honest",
  metaTitle: "Can You Daily-Drive a Classic in Alberta? An Honest Answer",
  description:
    "The honest answer on daily driving a classic in Alberta: what road chloride does, what collector policies allow, and which upgrades make shoulder seasons sane.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Alberta Life",
  targetKeywords: [
    "daily driving a classic car",
    "classic car winter driving Alberta",
    "road salt classic car rust",
    "classic car as daily driver",
    "calcium chloride Edmonton classic car",
  ],
  faq: [
    {
      q: "Can you drive a classic car in winter in Alberta?",
      a: "Mechanically, yes — a sorted classic with a block heater starts and runs fine in deep cold, and dry cold does not hurt steel. What hurts it is chloride. Edmonton treats winter roads with salt, sand, and calcium chloride as a pre-wetting agent, and that residue wicks into the bare-steel seams of an old body shell and keeps corroding all season. Most owners drive dry-cold windows only, and park the car whenever the roads are wet or white with residue.",
    },
    {
      q: "Will collector car insurance cover a daily driver?",
      a: "No. Collector policies such as Hagerty Canada's allow reasonable pleasure use — drives, shows, club events — but state plainly that the car cannot be your daily driver, and they require every licensed driver in the household to have a regular-use vehicle with its own insurance. Commute daily on a collector policy and you are betting a claim on a usage clause you are breaking. If you genuinely need daily use, insure the car on a regular policy and accept that agreed value goes with it.",
    },
    {
      q: "Does Edmonton still use calcium chloride on roads?",
      a: "Not as a direct anti-icing spray — council paused that program in 2019 after two winters of corrosion complaints. But calcium chloride is still used as a pre-wetting agent so salt and sand stick to the road, and it is still applied to bike lanes and city-maintained sidewalks, while the province has continued using it on Anthony Henday Drive. Practically, chloride is on Edmonton-area pavement all winter either way, and the city has said vehicle protection is the owner's responsibility.",
    },
    {
      q: "What upgrades make a classic usable as a daily driver?",
      a: "In rough order of value per dollar: electronic ignition (about $250 to $700 CAD installed), a block heater ($150 to $450), modern radial tires ($900 to $1,800 a set), a front disc brake conversion ($1,500 to $3,500), and a heater, defroster, and wiper refresh ($300 to $900). Fuel injection ($4,000 to $8,000 or more installed) is the deep end, and usually only makes sense as part of an engine swap. All of those are planning ranges, not quotes.",
    },
    {
      q: "How do you protect a classic car from road salt?",
      a: "Three habits do most of the work: an annual oil-film rust treatment (typically $150 to $300 CAD) sprayed into seams and box sections before the first brine truck rolls; a thorough underside rinse any time the car has touched treated pavement; and never parking it away wet — a warm garage plus chloride residue is a corrosion accelerator, because the reaction runs fastest exactly where the car thaws. Clear drain holes and dry storage finish the job.",
    },
  ],
  citations: [
    {
      name: "“City of Edmonton says what calcium chloride may do to your vehicle is your responsibility,” Global News, June 2019",
      url: "https://globalnews.ca/news/5436112/edmonton-vehicle-calcium-chloride-winter-roads/",
    },
    {
      name: "“What's the forecast for Edmonton's snow, ice control this winter?” Transforming Edmonton, City of Edmonton",
      url: "https://transforming.edmonton.ca/whats-the-forecast-for-edmontons-snow-ice-control-this-winter/",
    },
    {
      name: "“Qualifications for Classic Car Insurance,” Hagerty Canada",
      url: "https://www.hagerty.ca/insurance/classic-car-insurance/does-my-vehicle-qualify",
    },
    {
      name: "“Licence plates,” Government of Alberta",
      url: "https://www.alberta.ca/licence-plates",
    },
    {
      name: "“Factors that affect fuel efficiency,” Natural Resources Canada",
      url: "https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/personal-vehicles/factors-affect-fuel-efficiency",
    },
  ],
  internalLinks: [
    "/services/body-paint-metalwork",
    "/services/classic-performance-tuning",
    "/blog/ls-swap-cost-canada",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 8,
};

/**
 * A rocker panel in cross-section with brine spray wicking up into the
 * pinch-weld seam — dashed capillary creep, rust pitting inside the box
 * section, a chloride droplet in the exemplar's E10 style — over a twelve-month
 * rail running November to October, bracketed into the five-month chloride
 * season and the seven-month driving window. Steel line art, tungsten warnings,
 * mono labels, plate caption.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical cross-section diagram of a classic car rocker panel over winter road spray, showing brine wicking into the pinch-weld seam and rust pitting inside the bare-steel box section, with a chloride droplet callout, above a twelve-month rail running November to October bracketed into a five-month chloride storage season and a seven-month April-to-October driving window"
      className="h-auto w-full"
    >
      <title>Where the brine goes, and the seven months it doesn&rsquo;t</title>
      <defs>
        <radialGradient id="dd-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dd-film" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      {/* pool of light behind the section */}
      <ellipse cx="440" cy="330" rx="330" ry="120" fill="url(#dd-pool)" />

      {/* ══ ROCKER PANEL — outer sill, inner panel, floor lip, pinch weld ══ */}
      {/* outer sill skin */}
      <path
        d="M 300 96 L 300 150 Q 300 178 276 190 Q 252 202 252 236 L 252 300 Q 252 330 286 340 L 398 372 L 398 404"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* inner rocker panel */}
      <path
        d="M 560 96 L 560 150 Q 560 186 540 206 L 540 340 L 424 372 L 424 404"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* floor pan running inboard from the inner panel */}
      <path
        d="M 540 214 L 760 214 L 792 198"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.6"
        strokeOpacity="0.8"
        strokeLinecap="round"
      />
      {/* pinch-weld flange — two skins meeting at the bottom */}
      <g stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <line x1="398" y1="404" x2="398" y2="446" />
        <line x1="424" y1="404" x2="424" y2="446" />
      </g>
      {/* spot-weld ticks along the flange */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.65">
        <line x1="394" y1="414" x2="428" y2="414" />
        <line x1="394" y1="428" x2="428" y2="428" />
        <line x1="394" y1="442" x2="428" y2="442" />
      </g>
      {/* body character line above the sill */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" fill="none" strokeLinecap="round">
        <path d="M 300 96 L 288 74" />
        <path d="M 560 96 L 572 74" />
      </g>

      {/* rust pitting inside the box section, gathering at the bottom */}
      <g fill="#ffb066">
        <circle cx="330" cy="330" r="2" fillOpacity="0.55" />
        <circle cx="356" cy="344" r="2.6" fillOpacity="0.7" />
        <circle cx="388" cy="354" r="2" fillOpacity="0.5" />
        <circle cx="418" cy="356" r="2.8" fillOpacity="0.75" />
        <circle cx="452" cy="350" r="2.2" fillOpacity="0.6" />
        <circle cx="486" cy="342" r="1.8" fillOpacity="0.45" />
        <circle cx="308" cy="306" r="1.6" fillOpacity="0.4" />
      </g>

      {/* ══ ROAD, BRINE FILM, SPRAY ══ */}
      <line x1="120" y1="512" x2="820" y2="512" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      <rect x="120" y="496" width="700" height="16" fill="url(#dd-film)" />
      <line
        x1="120"
        y1="496"
        x2="820"
        y2="496"
        stroke="#ffb066"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeDasharray="5 4"
      />
      {/* spray arcs off the road toward the flange */}
      <g fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round">
        <path d="M 200 494 Q 260 448 350 448" strokeDasharray="2 6" />
        <path d="M 250 494 Q 310 460 380 456" strokeDasharray="2 6" />
        <path d="M 610 494 Q 540 456 452 452" strokeDasharray="2 6" />
      </g>
      <g fill="#ffb066">
        <circle cx="366" cy="450" r="2" fillOpacity="0.7" />
        <circle cx="404" cy="456" r="2.6" fillOpacity="0.85" />
        <circle cx="440" cy="452" r="2" fillOpacity="0.7" />
      </g>
      {/* capillary creep — up the flange, into the seam, into the box */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.2" strokeOpacity="0.8" strokeLinecap="round">
        <path d="M 411 448 L 411 404" strokeDasharray="2 4" />
        <path d="M 411 404 Q 411 384 400 372" strokeDasharray="2 4" />
        <path d="M 411 404 Q 411 384 422 372" strokeDasharray="2 4" />
      </g>
      <path
        d="M 411 372 Q 411 356 411 352"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeDasharray="2 4"
      />

      {/* ══ THE CHLORIDE DROPLET ══ */}
      <path
        d="M 760 306 Q 742 338 760 354 Q 778 338 760 306"
        fill="#ffb066"
        fillOpacity="0.14"
        stroke="#ffb066"
        strokeWidth="1.3"
      />
      <text
        x="760"
        y="344"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.08em"
        fill="#ffd9ad"
      >
        CL&#8315;
      </text>
      <text
        x="760"
        y="384"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        IN THE BRINE
      </text>
      <path d="M 742 350 L 640 470" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />

      {/* ══ LEADER LINES + MONO LABELS ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 150 424 L 396 424" />
        <path d="M 940 150 L 552 176" />
        <path d="M 150 200 L 260 220" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="40" y="196" fill="#ffb066">
          OUTER SILL — BARE STEEL
        </text>
        <text x="40" y="420" fill="#ffb066">
          PINCH-WELD SEAM — WICKS
        </text>
        <text x="948" y="154" fill="#ffb066">
          BOX SECTION, SEALED 1968
        </text>
        <text x="132" y="540" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          BRINE FILM — STAYS DAMP BELOW ZERO
        </text>
        <text x="820" y="540" textAnchor="end" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          ROAD
        </text>
      </g>

      {/* ══ TWELVE-MONTH RAIL — NOV THROUGH OCT ══ */}
      <line x1="120" y1="596" x2="1080" y2="596" stroke="#9a9ca0" strokeWidth="1.4" strokeLinecap="round" />
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.6">
        {[120, 200, 280, 360, 440, 520, 600, 680, 760, 840, 920, 1000, 1080].map((x) => (
          <line key={x} x1={x} y1="590" x2={x} y2="602" />
        ))}
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.08em"
        fill="#9a9ca0"
        textAnchor="middle"
      >
        {["N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O"].map((m, i) => (
          <text key={`${m}-${i}`} x={160 + i * 80} y="622" fillOpacity={i < 5 ? 0.5 : 0.9}>
            {m}
          </text>
        ))}
      </g>
      {/* chloride season bracket — NOV to MAR */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7" fill="none" strokeLinecap="round">
        <path d="M 120 574 L 120 566 L 520 566 L 520 574" />
      </g>
      <text
        x="320"
        y="556"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.7"
      >
        CHLORIDE SEASON — STORE
      </text>
      {/* driving window bracket — APR to OCT */}
      <g stroke="#ffb066" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M 528 574 L 528 566 L 1080 566 L 1080 574" />
      </g>
      <text
        x="804"
        y="556"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#ffb066"
      >
        THE SEVEN-MONTH WINDOW — DRIVE
      </text>

      {/* plate caption */}
      <text
        x="600"
        y="652"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. D — WHERE THE BRINE GOES, AND THE SEVEN MONTHS IT DOESN&rsquo;T
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Yes, for about seven months. From late April to the first brine truck of November, a sorted
        classic makes a fine daily. The honest rest: routine winter driving on Edmonton&rsquo;s
        chloride-treated roads is a rust sentence for an old body shell, and a collector policy will
        not cover a commuter anyway. Drive summer, store winter, upgrade for the shoulders.
      </p>

      <h2>What does an Alberta winter actually do to a classic?</h2>
      <p>
        Not what most people think. Steel does not care about minus thirty — dry cold is close to
        the best preservation climate there is, which is why Alberta barn finds come out of sheds
        with floors you could never buy in Ontario. What kills old cars here is what the road crews
        put down when the snow flies: sand, sodium chloride, and calcium chloride. Those salts do
        not politely rinse away in spring. They are hygroscopic — they pull moisture out of the air
        and keep the film on your underbody damp and electrically conductive long after the road
        looks dry — so the corrosion cell keeps running in your garage, all season.
      </p>
      <p>
        A modern unibody shrugs most of this off: galvanized steel, electrocoat primer dip, robotic
        seam sealer, engineered drain paths. A 1960s or 1970s shell has none of it. It is bare
        spot-welded steel, seamed together with capillary gaps that wick brine upward — into
        pinch welds, rocker box sections, cab corners, and cowl plenums where nothing can be
        inspected or rinsed. By the time a rocker shows a bubble under the paint, the seam behind it
        has usually been gone for two winters, and the fix is
        cut-and-weld <Link href="/services/body-paint-metalwork">metalwork</Link>, not sanding and a
        rattle can. That asymmetry is the whole argument: on a new truck, road treatment costs you
        resale; on a classic, it costs you the body.
      </p>

      <h2>Does Edmonton still put calcium chloride on the roads?</h2>
      <p>
        Sort of — and the distinction matters less than you would hope. From 2017 to 2019 the city
        direct-applied a calcium chloride anti-icing brine across roughly 3,000 kilometres of
        roadway. Complaints about corroded brake lines, wiring, and body seams piled up; the
        city&rsquo;s answer was that protecting your vehicle from it is your responsibility, and
        that washing is your maintenance job, not theirs.
        <a href="#src-1" className="cite-ref">[1]</a> Council paused the direct-spray program in
        October 2019, but did not retire the chemical: calcium chloride is still used as a
        pre-wetting agent so salt and sand stick to the road, and it is still applied to bike lanes
        and city-maintained sidewalks — while the province has continued using it on Anthony Henday
        Drive.<a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <p>
        Read that as a shop foreman does: chloride is on Edmonton-area pavement from the first
        freeze to the spring rains, whichever molecule is carrying it, and the ring road your
        commute probably uses gets the aggressive stuff. The policy debate is about how much and in
        what form — not whether. Plan the car&rsquo;s year around that fact and the rest of this
        article follows.
      </p>

      <h2>Will collector insurance let you daily-drive it?</h2>
      <p>
        No, and this ends the romantic version of the plan faster than rust does. Collector
        policies are cheap because the underwriter is pricing a car that mostly sits. Hagerty
        Canada, the biggest name in the game, puts it plainly: the policy allows reasonable
        pleasure use — evening drives, shows, club events — but the car cannot be your daily
        driver, and every licensed driver in your household must have a regular-use vehicle
        insured in their own name.<a href="#src-3" className="cite-ref">[3]</a> Commute on a
        collector policy and you are paying for coverage that a usage investigation could unwind
        exactly when you need it.
      </p>
      <p>
        Registration has its own trap. Alberta&rsquo;s antique plate — available once a vehicle is
        25 years old — is not a cheap daily-driving hack: the province limits it to exhibitions,
        club activities, parades, travel to and from those events, and trips to servicing
        appointments.<a href="#src-4" className="cite-ref">[4]</a> Regular registration with a
        regular insurance policy is perfectly legal for daily use, but then you have walked away
        from agreed value, and a standard insurer will settle your straight-axle survivor like a
        used appliance. The setup that actually works in Alberta: regular plate, collector policy,
        honest usage, and a boring vehicle for the salt months.
      </p>
      <blockquote>
        <p>The insurance question answers the daily-driver question before the rust does.</p>
        <footer>Shop rule, said at least once a week</footer>
      </blockquote>

      <h2>When is winter driving actually fine?</h2>
      <p>
        Here is the nuance the purists and the romantics both miss: the enemy is treated pavement,
        not the calendar. A minus-twenty high-pressure week in January, roads scraped and
        bone-dry, no fresh treatment down — mechanically, a healthy classic will do that drive.
        Carbureted cold starts are a choke-adjustment problem, not a character flaw, and a block
        heater turns them civilized; Natural Resources Canada&rsquo;s advice to run one on a timer
        for no more than two hours before you leave applies doubly to an engine built before
        computers could compensate for cold.<a href="#src-5" className="cite-ref">[5]</a> Budget
        for thirst, too — the same agency pegs the urban fuel-consumption penalty at 12 to 28
        percent just from a temperature drop to single digits, and a 1970 four-barrel was never
        shy to begin with.
      </p>
      <p>
        The rule that keeps the body alive is short: <strong>if the road is wet, white, or freshly
        treated, the classic stays home.</strong> Wet means brine in every seam. White residue
        means the same thing, dried and waiting for humidity. What is left after that rule are the
        dry-cold windows and the long shoulder seasons — April before the rains, October after the
        heat — which in a normal Edmonton year add up to more driving than most collector cars
        ever see.
      </p>

      <h2>Which upgrades make shoulder-season driving sane?</h2>
      <p>
        A classic that gets driven in March and November needs to start when soaked with cold,
        stop on greasy pavement, and keep its windshield clear. None of that requires butchering
        the car. Typical planning ranges in Canadian dollars, not quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Upgrades that make shoulder-season driving of a classic car practical, compared by
            typical Canadian dollar cost and what each one actually buys you
          </caption>
          <thead>
            <tr>
              <th scope="col">Upgrade</th>
              <th scope="col">Typical cost (CAD)</th>
              <th scope="col">What it actually buys you</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Electronic ignition conversion</th>
              <td className="num">$250 – $700 installed</td>
              <td>Cold starts that do not depend on points gap and prayer</td>
            </tr>
            <tr>
              <th scope="row">Block heater</th>
              <td className="num">$150 – $450 installed</td>
              <td>Oil that flows on the first crank; two hours on a timer is plenty</td>
            </tr>
            <tr>
              <th scope="row">Modern radial tires</th>
              <td className="num">$900 – $1,800 a set</td>
              <td>The single biggest grip and stability gain per dollar on any classic</td>
            </tr>
            <tr>
              <th scope="row">Front disc brake conversion</th>
              <td className="num">$1,500 – $3,500</td>
              <td>Stopping distances that belong in the same decade as the traffic</td>
            </tr>
            <tr>
              <th scope="row">Heater, defroster, and wiper refresh</th>
              <td className="num">$300 – $900</td>
              <td>A windshield you can see through at minus ten in the dark</td>
            </tr>
            <tr>
              <th scope="row">Annual oil-film rust treatment</th>
              <td className="num">$150 – $300 per year</td>
              <td>Creeping oil in the same seams the brine wants — cheap insurance</td>
            </tr>
            <tr>
              <th scope="row">EFI conversion</th>
              <td className="num">$4,000 – $8,000+ installed</td>
              <td>Modern cold starts and altitude trim; the deep end of the list</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Work the list top-down. Ignition, tires, and brakes transform how the car handles a cold
        wet Tuesday for less than the cost of a paint panel, and all of it is reversible if
        originality matters to you — dialing that combination is bread-and-butter work for
        the <Link href="/services/classic-performance-tuning">performance and tuning side of the
        shop</Link>. EFI earns its keep only if you genuinely drive year-round or the engine is
        coming out anyway, in which case read the{" "}
        <Link href="/blog/ls-swap-cost-canada">LS swap cost breakdown</Link> before you price a
        bolt-on throttle-body kit — past a certain point the swap is the better dollar.
      </p>

      <h2>How do you keep road salt from eating the car?</h2>
      <p>
        Three habits carry most of the load. First, an oil-film rust treatment every fall, before
        the first brine truck rolls — the creeping oil follows the same capillary paths into pinch
        welds and box sections that the chloride uses, and occupies them first. Second, an
        underside rinse any time the car has touched treated pavement, with attention to the
        rockers, wheel wells, and frame boxing, and the drain holes confirmed clear while you are
        under there. Third — the one that surprises people — <strong>never park it away wet and
        warm.</strong> A heated garage with chloride residue on the car is a corrosion
        accelerator: the reaction runs fastest right where the slush thaws. Cold storage with a
        dry car beats warm storage with a damp one every time.
      </p>
      <p>
        If the car is coming off the road for the full season instead, do it properly — fuel,
        battery, rubber, and rodents each get a say in what you find in April. The{" "}
        <Link href="/guides/winter">winter guide</Link> walks the whole put-away and wake-up
        sequence in one place.
      </p>

      <h2>So what is the honest verdict?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">7 months</span>
          <span className="stat-l">The realistic Edmonton driving window, April through October</span>
        </div>
        <div>
          <span className="stat-v">25 yrs</span>
          <span className="stat-l">Antique-plate age — but event and club use only</span>
        </div>
        <div>
          <span className="stat-v">12–28%</span>
          <span className="stat-l">Urban fuel penalty when the temperature drops to single digits</span>
        </div>
        <div>
          <span className="stat-v">$150–$300/yr</span>
          <span className="stat-l">Oil-film rustproofing — the cheapest line item on this page</span>
        </div>
      </div>
      <p>
        Run the math like a foreman. A modest Edmonton commute is 8,000 to 12,000 kilometres a
        year, and five months of it lands on treated pavement — precisely the usage a collector
        underwriter will not cover and the exposure an unrestored shell cannot absorb.
        Flip the calendar instead and everything reconciles: seven months of genuine, guilt-free
        use, five months of dry storage, and a car that is appreciating instead of dissolving.
        That is not a consolation prize. An Alberta summer of daily errands, river-valley evenings,
        and show weekends is more seat time than most classics on collector policies see in three
        years — legitimately insured the whole way.
      </p>
      <p>
        If your classic is not ready for that seven-month job — starts hard, stops long, wanders,
        or is already showing brine scars in the rockers — send the year, engine, and what it is
        doing through the <Link href="/quote">quote page</Link>. You will get a straight answer on
        what it needs to earn a daily slot in April, what it costs in honest ranges, and — when it
        is true — which of those things can safely wait another season.
      </p>
    </>
  );
}
