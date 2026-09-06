import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — The Alberta Show Circuit.
 * The circuit-wide companion to the Radium road piece: which shows anchor a
 * short season, how to build the calendar around them, and how to get car,
 * budget, and family to September intact. Links down into the Radium article,
 * the tuning and body service pages, the winter guide, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "alberta-show-and-shine-season",
  title: "The Alberta Show Circuit: A Season Planner From May Long to September",
  accent: "Season",
  metaTitle: "Alberta Car Show Season Planner AB",
  description: "Which Alberta shows are worth the fuel, how to plan the calendar around three anchor weekends, and how to finish September without burning out car or family.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Alberta Life",
  targetKeywords: [
    "Alberta car shows",
    "Edmonton show and shine",
    "classic car events Alberta",
    "car show calendar Alberta",
  ],
  faq: [
    {
      q: "When does car show season start in Alberta?",
      a: "The working season runs from the May long weekend to the third weekend of September — about eighteen weekends. Cruise nights and community shows start as soon as the street sweepers have cleared the winter gravel, the big anchor shows land in July and August, and the season traditionally closes with the Radium Show and Shine in mid-September.",
    },
    {
      q: "What are the biggest classic car shows near Edmonton?",
      a: "Three events anchor the calendar. The Ultimate Car Show at the Reynolds-Alberta Museum in Wetaskiwin draws more than 650 vehicles each July. Rock'n August in St. Albert runs five days and roughly fourteen events in early August. And the Columbia Valley Classics Show and Shine in Radium Hot Springs — technically BC, spiritually Alberta's season finale — fields over 1,000 cars on the third weekend of September.",
    },
    {
      q: "How much does a season on the Alberta show circuit cost?",
      a: "A full season built around one or two day-trip anchors, weekly cruise nights, and one Radium-style road trip typically runs $1,500 to $3,500 in Canadian dollars — fuel, registration fees, two or three hotel nights, food, and detailing supplies. A stay-local season of cruise nights and community shows can come in under $800. Both numbers are planning ranges, not quotes, and they assume the car behaves.",
    },
    {
      q: "Can I daily drive a car with antique plates in Alberta?",
      a: "No. Alberta's antique plate is for vehicles at least 25 years old and restricts use to exhibitions, club activities, parades, transportation to and from those events, and trips to servicing — not general transportation. The show circuit is exactly what the plate exists for, but the grocery run is not. If the car is a regular driver, register it normally and talk to a broker about collector insurance instead.",
    },
    {
      q: "How do I protect my classic from hail at Alberta car shows?",
      a: "Respect the corridor and the clock. Central and southern Alberta take some of the worst hail in Canada, and the storms concentrate in July and August afternoons. Check the convective forecast the morning of every show, know where the nearest hard cover is before you park, and leave early when the sky builds — a trophy is not worth a resprayed roof. Carry comprehensive insurance on the car year-round, not just a parade rider.",
    },
  ],
  citations: [
    {
      name: "“August hailstorm in Calgary results in nearly $2.8 billion in insured damage,” Insurance Bureau of Canada",
      url: "https://www.ibc.ca/news-insights/news/august-hailstorm-in-calgary-results-in-nearly-2-8-billion-in-insured-damage",
    },
    {
      name: "“The Ultimate Car Show,” Reynolds-Alberta Museum, Government of Alberta",
      url: "https://reynoldsmuseum.ca/events/ultimate-car-show",
    },
    {
      name: "Rock'n August, official festival site, St. Albert",
      url: "https://www.rocknaugust.com/",
    },
    {
      name: "“Show and Shine,” Columbia Valley Classics Car Club (official event page)",
      url: "https://columbiavalleyclassics.ca/show-and-shine",
    },
    {
      name: "“Licence plates,” Alberta.ca — antique vehicle plate eligibility and permitted use",
      url: "https://www.alberta.ca/licence-plates",
    },
  ],
  internalLinks: [
    "/blog/road-to-radium-show-and-shine",
    "/services/classic-performance-tuning",
    "/services/body-paint-metalwork",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * The season as a plate: a highway timeline from May long to first snow, three
 * numbered anchor pins flying flags over Wetaskiwin, St. Albert, and Radium, a
 * hail-watch cone over July–August, a solstice sun, cruise-night diamonds
 * running underneath, and a steel-line classic rolling the road. Exemplar
 * style: steel line art, tungsten accents, every label mono, caption plated.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Timeline diagram of the Alberta show season drawn as a highway running from the May long weekend to first snow in late September, with three numbered anchor pins marking the Ultimate Car Show in Wetaskiwin in July, Rock'n August in St. Albert in early August, and the Radium Show and Shine on the third September weekend, a hail-watch cone over July and August, a solstice sun in June, cruise-night diamonds every week beneath the road, and a classic car in steel line art rolling toward September"
      className="h-auto w-full"
    >
      <title>Eighteen weekends, three anchors, one finale — the season as a road</title>
      <defs>
        <radialGradient id="ss-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the road */}
      <ellipse cx="600" cy="420" rx="420" ry="40" fill="url(#ss-pool)" />

      {/* ══ SOLSTICE SUN — June, top of the arc ══ */}
      <g fill="none" stroke="#9a9ca0" strokeOpacity="0.55" strokeLinecap="round">
        <path d="M 150 150 Q 600 40 1050 150" strokeWidth="1" strokeDasharray="3 7" />
        <circle cx="392" cy="94" r="17" strokeWidth="1.4" strokeOpacity="0.8" />
        <g strokeWidth="1">
          <line x1="392" y1="66" x2="392" y2="58" />
          <line x1="392" y1="122" x2="392" y2="130" />
          <line x1="364" y1="94" x2="356" y2="94" />
          <line x1="420" y1="94" x2="428" y2="94" />
          <line x1="372" y1="74" x2="366" y2="68" />
          <line x1="412" y1="74" x2="418" y2="68" />
          <line x1="372" y1="114" x2="366" y2="120" />
          <line x1="412" y1="114" x2="418" y2="120" />
        </g>
      </g>
      <text
        x="392"
        y="152"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        SOLSTICE — LONGEST CRUISE OF THE YEAR
      </text>

      {/* ══ HAIL WATCH — cone over July–August ══ */}
      <g stroke="#ffb066" strokeOpacity="0.55" fill="none">
        <path d="M 560 186 L 520 330 M 800 186 L 840 330" strokeWidth="0.75" strokeDasharray="4 5" />
        <path d="M 560 186 L 800 186" strokeWidth="1" />
      </g>
      <g fill="none" stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.75">
        <circle cx="620" cy="232" r="6" />
        <circle cx="676" cy="260" r="4.5" />
        <circle cx="724" cy="226" r="7.5" />
        <circle cx="768" cy="268" r="5" />
        <circle cx="660" cy="300" r="3.5" />
      </g>
      <text
        x="680"
        y="172"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
        fill="#ffb066"
      >
        HAIL WATCH — JUL–AUG AFTERNOONS
      </text>

      {/* ══ THE ROAD — May long to first snow ══ */}
      <g stroke="#9a9ca0" fill="none" strokeLinecap="round">
        <line x1="90" y1="366" x2="1110" y2="366" strokeWidth="2" />
        <line x1="90" y1="412" x2="1110" y2="412" strokeWidth="2" />
        <line x1="104" y1="389" x2="1096" y2="389" strokeWidth="1.2" strokeOpacity="0.55" strokeDasharray="26 20" />
      </g>

      {/* month ticks + labels */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5">
        <line x1="130" y1="412" x2="130" y2="428" />
        <line x1="330" y1="412" x2="330" y2="428" />
        <line x1="530" y1="412" x2="530" y2="428" />
        <line x1="730" y1="412" x2="730" y2="428" />
        <line x1="930" y1="412" x2="930" y2="428" />
        <line x1="1096" y1="412" x2="1096" y2="428" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
        fill="#9a9ca0"
      >
        <text x="130" y="446" textAnchor="middle">MAY</text>
        <text x="330" y="446" textAnchor="middle">JUN</text>
        <text x="530" y="446" textAnchor="middle">JUL</text>
        <text x="730" y="446" textAnchor="middle">AUG</text>
        <text x="930" y="446" textAnchor="middle">SEP</text>
      </g>

      {/* season ends — dust-off and first snow */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.16em">
        <text x="90" y="342" fill="#9a9ca0" fillOpacity="0.6">
          MAY LONG — DUST-OFF
        </text>
        <text x="1110" y="342" textAnchor="end" fill="#9a9ca0" fillOpacity="0.6">
          FIRST SNOW
        </text>
      </g>
      {/* frost ticks at the far end */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" fill="none" strokeLinecap="round">
        <path d="M 1122 360 L 1122 348 M 1116 354 L 1128 354 M 1118 350 L 1126 358 M 1126 350 L 1118 358" />
      </g>

      {/* ══ THE CAR — steel-line classic rolling toward September ══ */}
      <g stroke="#9a9ca0" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 196 384 L 210 384 Q 218 370 236 368 L 268 366 Q 282 356 300 355 L 330 355 Q 344 358 350 368 L 366 372 Q 374 375 374 384 L 368 384" />
        <path d="M 240 384 L 344 384" strokeOpacity="0.7" />
      </g>
      <circle cx="226" cy="386" r="9" fill="none" stroke="#ffb066" strokeWidth="1.5" />
      <circle cx="354" cy="386" r="9" fill="none" stroke="#ffb066" strokeWidth="1.5" />
      {/* speed ticks trailing */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.45" strokeLinecap="round">
        <line x1="168" y1="376" x2="184" y2="376" />
        <line x1="158" y1="384" x2="178" y2="384" />
      </g>

      {/* ══ ANCHOR PINS — flags over the road ══ */}
      {/* leader masts */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <line x1="565" y1="360" x2="565" y2="268" />
        <line x1="745" y1="360" x2="745" y2="238" />
        <line x1="990" y1="360" x2="990" y2="212" />
      </g>
      {/* flags */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.2" strokeOpacity="0.85">
        <path d="M 565 268 L 597 276 L 565 284" />
        <path d="M 745 238 L 777 246 L 745 254" />
      </g>
      {/* checkered finale flag at Radium */}
      <g stroke="#ffb066" strokeWidth="1.2" fill="none">
        <rect x="990" y="212" width="34" height="22" strokeOpacity="0.85" />
      </g>
      <g fill="#ffb066" fillOpacity="0.7">
        <rect x="990" y="212" width="8.5" height="11" />
        <rect x="1007" y="212" width="8.5" height="11" />
        <rect x="998.5" y="223" width="8.5" height="11" />
        <rect x="1015.5" y="223" width="8.5" height="11" />
      </g>
      {/* numbered pins on the road */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 565, y: 366, n: "1" },
          { x: 745, y: 366, n: "2" },
          { x: 990, y: 366, n: "3" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>
      {/* pin labels */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.14em"
        fill="#ffb066"
      >
        <text x="553" y="262" textAnchor="end">
          1 · WETASKIWIN — 650+ CARS
        </text>
        <text x="733" y="232" textAnchor="end">
          2 · ST. ALBERT — 5 DAYS
        </text>
        <text x="978" y="206" textAnchor="end">
          3 · RADIUM — 550 KM · 1,000+ CARS
        </text>
      </g>

      {/* ══ CRUISE NIGHTS — weekly diamonds under the road ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.6">
        {[170, 250, 410, 490, 610, 690, 810, 890, 970].map((x) => (
          <path key={x} d={`M ${x} 490 L ${x + 7} 497 L ${x} 504 L ${x - 7} 497 Z`} />
        ))}
      </g>
      <text
        x="600"
        y="536"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        CRUISE NIGHTS — EVERY WEEK, NO COMMITMENT
      </text>

      {/* season counter */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.16em">
        <text x="90" y="586" fontSize="11" fill="#ffb066">
          18 WEEKENDS
        </text>
        <text x="1110" y="586" textAnchor="end" fontSize="11" fill="#9a9ca0" fillOpacity="0.7">
          CAP: 2 BIG ONES A MONTH
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
        FIG. S — EIGHTEEN WEEKENDS, THREE ANCHORS, ONE FINALE
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Plan the season around three anchors — the Ultimate Car Show in Wetaskiwin in July,
        Rock&rsquo;n August in St. Albert, and the Radium Show and Shine in mid-September — then
        fill the gaps with cruise nights close to home. Cap yourself at two big weekends a month,
        and the car, the budget, and the family all make it to September.
      </p>

      <h2>How long is the Alberta show season, really?</h2>
      <p>
        Shorter than the calendar admits. The street sweepers clear the winter gravel in late
        April, the first serious cruise nights land on the May long weekend, and by the end of
        September you are watching the forecast for the flake that ends it. Call it{" "}
        <strong>eighteen weekends</strong>, and not all of them are yours: graduations, camping
        trips, and weddings take their cut like they do every year. A season plan is really a
        triage plan — deciding in May which weekends the car gets, so July does not turn into an
        argument.
      </p>
      <p>
        The middle of that season also runs straight through the worst hail corridor in the
        country. The August 2024 Calgary hailstorm alone caused nearly $2.8 billion in insured
        damage — the second-costliest disaster in Canadian history — and a big share of any
        Alberta hail event is parked vehicles.<a href="#src-1" className="cite-ref">[1]</a> An
        Edmonton-area car is better off than one in Airdrie, but July and August afternoons
        anywhere south of Highway 16 deserve a weather check before you commit chrome to an open
        field. More on that below.
      </p>

      <h2>Which Alberta shows are worth the fuel?</h2>
      <p>
        Think in tiers. Tier one is the anchors — the shows big enough to plan a month around.
        Tier two is the regional circuit: community show-and-shines in Leduc, Sherwood Park,
        Camrose, Vegreville, and every county fairground with a pancake breakfast, most of them a
        single Saturday and a $20 to $40 registration. Tier three is the weekly stuff — cruise
        nights and parking-lot meets that ask nothing but fuel money. The tiers are not a ranking
        of quality. Some of the best conversations of a season happen at a fifty-car lot meet. They
        are a ranking of <strong>commitment</strong>.
      </p>
      <p>
        Three anchors have earned their place. The <strong>Ultimate Car Show</strong> at the
        Reynolds-Alberta Museum in Wetaskiwin — the show old hands still call History Road — has
        run since 1999 and now fields more than 650 vehicles on the museum grounds each July,
        under an hour south of Edmonton.<a href="#src-2" className="cite-ref">[2]</a>{" "}
        <strong>Rock&rsquo;n August</strong> in St. Albert is the hometown week: five days and
        roughly fourteen events in early August — show-and-shines, cruises, and live music — that
        have raised more than $1.9 million for diabetes research over thirty years.
        <a href="#src-3" className="cite-ref">[3]</a> And the{" "}
        <strong>Columbia Valley Classics Show and Shine</strong> in Radium Hot Springs closes the
        book on the third weekend of September with over 1,000 cars — technically British
        Columbia, spiritually the Alberta finale, and worth its own plan.
        <a href="#src-4" className="cite-ref">[4]</a> We wrote that plan separately in the{" "}
        <Link href="/blog/road-to-radium-show-and-shine">Radium road guide</Link>; this article is
        about the rest of the season.
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            The three anchor events of the Alberta show season plus weekly cruise nights, compared
            by timing, distance from Edmonton, scale, and typical cost in Canadian dollars
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">When</th>
              <th scope="col">From Edmonton</th>
              <th scope="col">Scale</th>
              <th scope="col">Typical cost (CAD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Ultimate Car Show, Wetaskiwin</th>
              <td>One Saturday, July</td>
              <td>~70 km</td>
              <td>650+ vehicles</td>
              <td className="num">$50 – $150 day trip</td>
            </tr>
            <tr>
              <th scope="row">Rock&rsquo;n August, St. Albert</th>
              <td>Five days, early August</td>
              <td>Across town</td>
              <td>~14 events</td>
              <td className="num">$100 – $300 for the week</td>
            </tr>
            <tr>
              <th scope="row">Radium Show &amp; Shine</th>
              <td>Third weekend, September</td>
              <td>~550 km</td>
              <td>1,000+ cars</td>
              <td className="num">$600 – $1,200 with hotels</td>
            </tr>
            <tr>
              <th scope="row">Cruise nights &amp; lot meets</th>
              <td>Weekly, May – September</td>
              <td>Under 50 km</td>
              <td>20 – 200 cars</td>
              <td className="num">$20 – $60 a night</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Every dollar figure there is a planning range, not a quote — registration fees move,
        hotels in a resort town price like a resort town, and a carbureted V8 keeps its own
        opinion about fuel economy.
      </p>

      <h2>How do you build the calendar without burning out?</h2>
      <p>
        The failure mode is always the same: a great May, an exhausted July, a car with a
        neglected rattle by August, and a family that has stopped coming. The fix is a calendar
        with rules, set in the spring while everyone is still speaking to each other.
      </p>
      <ul>
        <li>
          <strong>Two big weekends a month, maximum.</strong> Anchors and regionals combined.
          The third weekend belongs to the family with the car left home, and the fourth belongs
          to the wrench.
        </li>
        <li>
          <strong>Book the anchors first.</strong> Radium hotels for the third September weekend
          go early — book in spring, cancel later if you must. The day-trip anchors just need the
          date blocked out.
        </li>
        <li>
          <strong>Pick shows the family can survive.</strong> Rock&rsquo;n August has music every
          night, Wetaskiwin has an entire museum attached, and Radium has hot springs. A
          gravel-lot show with nothing but cars is a solo trip. Know the difference before you
          load the truck.
        </li>
        <li>
          <strong>Leave the weekend before Radium empty.</strong> That is prep weekend — fluids,
          brakes, lights, spares — not another show. A 1,100 km round trip is the hardest thing
          most show cars do all year.
        </li>
        <li>
          <strong>Quit while it is fun.</strong> If you are polishing at midnight and dreading
          the alarm, skip one. The circuit will be there next weekend and next year.
        </li>
      </ul>
      <blockquote>
        <p>The season is a marathon run in eighteen sprints. Nobody hands out a trophy for entering all of them.</p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>

      <h2>What does a full season cost to run?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$1,500–$3,500</span>
          <span className="stat-l">Typical full season — anchors, cruise nights, one road trip</span>
        </div>
        <div>
          <span className="stat-v">$800 or less</span>
          <span className="stat-l">Typical stay-local season, no overnights</span>
        </div>
        <div>
          <span className="stat-v">$250–$350</span>
          <span className="stat-l">Fuel alone, Radium round trip in a classic V8</span>
        </div>
        <div>
          <span className="stat-v">$20–$40</span>
          <span className="stat-l">Typical show registration, most community events</span>
        </div>
      </div>
      <p>
        The quiet costs matter more than the loud ones. Registration and fuel you can see coming;
        the tire that ages out mid-season, the water pump that objects to its fourth parade idle,
        and the detailing supplies that evaporate at $30 a bottle are what push a season past
        budget. Hot, slow parade laps and show-lane idling are the hardest duty an old cooling
        system sees all year — if the temp gauge has been creeping at cruise nights in June, get
        it looked at before July, not after. That kind of pre-season sort-out is exactly what the{" "}
        <Link href="/services/classic-performance-tuning">tuning and diagnosis bay</Link> is for:
        cooling, ignition, and carburetion dialed before the season asks hard questions.
      </p>

      <h2>What can you actually drive to on antique plates?</h2>
      <p>
        This trips people up every spring. Alberta&rsquo;s antique licence plate — available for
        vehicles at least 25 years old — restricts the car to use{" "}
        <strong>as a collector&rsquo;s item</strong>: exhibitions, club activities, parades,
        transportation to and from those events, and trips to servicing appointments.
        <a href="#src-5" className="cite-ref">[5]</a> Read that list again and notice what it is:
        the show circuit, described in regulatory language. Every cruise night, show-and-shine,
        and club run in this article is squarely what the plate exists for. The commute, the
        grocery run, and the Sunday drive with no destination are not.
      </p>
      <p>
        So decide honestly which car you own. If it leaves the garage only for events, antique
        registration is cheap and appropriate. If you drive it because driving it is the point,
        register it normally and price collector insurance through a broker — declared value,
        agreed mileage, and comprehensive coverage that stays on through winter storage. We are
        not insurance advisors and will not pretend to be; we will say that the cars that arrive
        here on flatbeds with hail damage and no comprehensive coverage make for the worst
        conversations of the summer.
      </p>

      <h2>How do you get the car — and the family — to September?</h2>
      <p>
        Treat the season like a race schedule: the car gets inspected between rounds, not just
        before round one. Oil and coolant checks after every hot parade idle, a torque check on
        anything you have had apart, and a walk-around with a flashlight the night before each
        show. Watch the sky in July and August: check the severe-weather forecast the morning of
        every outdoor show, know where the nearest hard cover is before you pick a parking spot,
        and be willing to leave a show early when the anvil clouds build. Cloth car covers stop
        dust, not hailstones the size of chicken eggs.<a href="#src-1" className="cite-ref">[1]</a>{" "}
        If the worst happens anyway, dents and respray are fixable — that is bread-and-butter work
        for the <Link href="/services/body-paint-metalwork">body and paint bay</Link> — but the
        deductible conversation is better avoided.
      </p>
      <p>
        Then end the season on purpose. After Radium, run the tank down for stabilized fuel,
        book the winter work while you still remember every rattle, and put the car away clean —
        the full procedure is in the <Link href="/guides/winter">winter guide</Link>. The best
        build decisions we see are made in October, by owners who just spent eighteen weekends
        finding out exactly what the car does well and what it does not. If this season wrote
        you a list — the soft brakes, the hot-start stumble, the paint that stopped winning —
        send it through the <Link href="/quote#form">quote page</Link> with the year, the engine, and
        what the car is doing. Winter is when next season&rsquo;s car gets built.
      </p>
    </>
  );
}
