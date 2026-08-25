import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Frame-Off or Rolling Restoration.
 * The fork-in-the-road decision article for the restoration keyword cluster.
 * Links down into the restoration service page, body and metalwork, the
 * restoration timeline article, the barn-find protocol, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "frame-off-vs-rolling-restoration",
  title: "Frame-Off or Rolling Restoration: Which One Your Car Actually Needs",
  accent: "Rolling",
  metaTitle: "Frame-Off vs Rolling Restoration: Which One Your Car Needs",
  description:
    "The structure decides — what a frame-off actually buys, when a rolling restoration is the smarter spend, and the rot and end-use markers that make the call.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Revivals",
  targetKeywords: [
    "frame off vs rolling restoration",
    "what is a frame off restoration",
    "rotisserie restoration cost",
    "partial restoration classic car",
    "rolling restoration Edmonton",
  ],
  faq: [
    {
      q: "What is the difference between a frame-off and a rolling restoration?",
      a: "A frame-off strips the car to nothing — body lifted off the frame, or a unibody stripped to the bare shell — so every surface can be inspected, repaired, and refinished before the car goes back together as one project. A rolling restoration keeps the car assembled and drivable while you fix it in planned stages: stopping and running gear first, drivetrain next, cosmetics last. One buys total certainty at total cost. The other spreads the money out and keeps the car a car.",
    },
    {
      q: "How much does a rotisserie or frame-off restoration cost in Canada?",
      a: "Plan on roughly $80,000 to $200,000 CAD at professional shop rates for a proper frame-off on a common classic, and well past that for concours work or rough starting cores. The driver is labour — restoration is hundreds to thousands of bench hours at typical Canadian shop rates of $100 to $185 per hour, before parts, chrome, and upholstery. Every one of those figures is a planning range, not a quote; the honest number comes after the car is apart.",
    },
    {
      q: "Is a frame-off restoration worth it on my car?",
      a: "It is worth it when the structure demands it — rotted rails, rockers, floors, or torque boxes, or hidden prior repair — or when the end goal is a top-condition show car, where every unseen surface has to be right. On a sound, honest driver that will be enjoyed on summer evenings rather than judged on a lawn, a frame-off is usually money spent fixing things nobody will ever see. Match the depth of the restoration to the car's structure and its actual end use.",
    },
    {
      q: "Can a unibody car get a frame-off restoration?",
      a: "Not literally — a unibody car has no separate frame to lift the body from. The equivalent is a bare-shell restoration: every mechanical, interior, and trim component comes out, and the stripped shell goes on a rotisserie or body cart so the underside and every seam can be repaired and refinished. The objective is identical to a body-on-frame car's frame-off — full access to everything — the hardware holding the shell is just different.",
    },
    {
      q: "How long does a frame-off restoration take?",
      a: "At a professional shop, a genuine frame-off commonly runs twelve to thirty months, driven by metalwork discoveries, parts hunting, and the queue at paint. A rolling restoration has no finish line in the same sense — each stage is weeks to a few months, and the car drives between stages. If a hard date matters, a show, an anniversary, a sale, say so before the car comes apart, because the schedule gets planned around the metalwork, not the other way round.",
    },
  ],
  citations: [
    {
      name: "Rick Carey, “‘Rotisserie’ Restoration,” Hagerty Media, April 2016",
      url: "https://www.hagerty.com/media/archived/rotisserie-restoration/",
    },
    {
      name: "“3 Ways to Mount a Body for a Frame-Off Restoration,” The Garage, Eastwood technical library, October 2024",
      url: "https://www.eastwood.com/garage/3-ways-to-mount-a-body-for-a-frame-off-restoration/",
    },
    {
      name: "“Edmonton ditches calcium chloride as anti-icing agent,” CBC News Edmonton, October 2019",
      url: "https://www.cbc.ca/news/canada/edmonton/edmonton-city-council-calcium-chloride-1.5314123",
    },
    {
      name: "“About Our Condition Ratings,” Hagerty Valuation Tools",
      url: "https://www.hagerty.com/valuation-tools/about-our-conditions",
    },
    {
      name: "“How Much Does it Cost to Restore a Classic Car?,” Hagerty resource library",
      url: "https://www.hagerty.com/resources/car-restoration/how-much-does-it-cost-to-restore-a-classic-car",
    },
  ],
  internalLinks: [
    "/services/classic-car-restoration",
    "/services/body-paint-metalwork",
    "/blog/classic-car-restoration-timeline",
    "/blog/barn-find-first-steps",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * The fork, drawn as one editorial plate. Left: the frame-off — a coupe body
 * hoisted clear of its bare frame on the rotisserie axis, mount points hanging
 * on dashed plumb lines, the four rot stations pinned in tungsten. Right: the
 * same coupe on its wheels, rolling, with the three stages bracketed in order.
 * A dashed divider and an OR pivot split the decision. Steel line art, mono
 * labels, every glow sourced.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Two-panel technical diagram comparing restoration paths: on the left, a classic coupe body hoisted off its bare frame along a rotisserie axis, with dashed plumb lines at the body mounts and four numbered tungsten pins marking rot stations at the rear kickup, body mounts, front rail, and rockers; on the right, the same coupe assembled and rolling on its wheels with three staged work brackets — brakes, fuel, and ignition first, drivetrain second, body and paint last; a dashed divider with an OR pivot separates the panels"
      className="h-auto w-full"
    >
      <title>The fork — lift it off, or keep it rolling</title>
      <defs>
        <radialGradient id="fr-pool-l" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.09" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.035" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pools of light under each subject */}
      <ellipse cx="320" cy="500" rx="270" ry="30" fill="url(#fr-pool-l)" />
      <ellipse cx="880" cy="510" rx="270" ry="30" fill="url(#fr-pool-l)" />

      {/* ══ CENTER DIVIDER + OR PIVOT ══ */}
      <line
        x1="600"
        y1="92"
        x2="600"
        y2="560"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeDasharray="4 8"
      />
      <circle cx="600" cy="300" r="24" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.3" />
      <text
        x="600"
        y="305"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="12"
        letterSpacing="0.14em"
        fill="#ffd9ad"
      >
        OR
      </text>

      {/* ══ PANEL HEADERS ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.18em"
        fill="#ffb066"
      >
        <text x="66" y="70">BODY OFF — EVERYTHING SEEN, EVERYTHING TOUCHED</text>
        <text x="650" y="70">ROLLING — FIX IN STAGES, KEEP DRIVING</text>
      </g>

      {/* ══ LEFT — THE FRAME-OFF ══ */}

      {/* hoist lines from above */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" fill="none" strokeLinecap="round">
        <line x1="210" y1="92" x2="210" y2="146" strokeDasharray="3 5" />
        <line x1="420" y1="92" x2="420" y2="150" strokeDasharray="3 5" />
        <path d="M 204 138 L 210 148 L 216 138" />
        <path d="M 414 142 L 420 152 L 426 142" />
      </g>
      <text
        x="240"
        y="104"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        LIFT
      </text>

      {/* rotisserie axis through the raised body */}
      <line
        x1="58"
        y1="216"
        x2="566"
        y2="216"
        stroke="#ffb066"
        strokeWidth="0.9"
        strokeOpacity="0.45"
        strokeDasharray="6 6"
      />
      <circle cx="76" cy="216" r="7" fill="none" stroke="#ffb066" strokeWidth="1.3" />
      <circle cx="548" cy="216" r="7" fill="none" stroke="#ffb066" strokeWidth="1.3" />
      {/* rotisserie posts */}
      <g stroke="#9a9ca0" strokeWidth="1.3" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <path d="M 76 223 L 76 480 M 58 480 L 94 480" />
        <path d="M 548 223 L 548 480 M 530 480 L 566 480" />
      </g>

      {/* body shell, hovering — front at left */}
      <path
        d="M 110 268 L 118 236 Q 152 210 202 202 L 238 162 Q 292 138 352 144 L 394 174 Q 462 180 506 202 Q 522 226 524 252 L 524 268 L 472 268 A 34 34 0 0 1 404 268 L 234 268 A 34 34 0 0 1 166 268 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* beltline + door cut */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" fill="none">
        <path d="M 132 238 L 500 238" />
        <path d="M 262 160 L 262 236 M 366 168 L 366 236" />
      </g>

      {/* plumb lines — body mounts down to frame mounts */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" fill="none" strokeLinecap="round">
        <line x1="200" y1="272" x2="200" y2="420" strokeDasharray="3 6" />
        <line x1="316" y1="272" x2="316" y2="420" strokeDasharray="3 6" />
        <line x1="440" y1="272" x2="440" y2="352" strokeDasharray="3 6" />
      </g>

      {/* bare frame — rails with rear kickup, on the stands */}
      <path
        d="M 96 430 L 306 430 Q 336 430 356 410 L 396 374 Q 408 364 428 364 L 544 364"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 96 446 L 306 446 Q 342 446 362 426 L 402 390 Q 412 380 430 380 L 544 380"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.4"
        strokeOpacity="0.75"
        strokeLinecap="round"
      />
      {/* crossmember ticks + mount pads */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7" fill="none">
        <line x1="150" y1="430" x2="150" y2="446" />
        <line x1="256" y1="430" x2="256" y2="446" />
        <line x1="470" y1="364" x2="470" y2="380" />
        <rect x="192" y="422" width="16" height="8" />
        <rect x="308" y="422" width="16" height="8" />
        <rect x="432" y="356" width="16" height="8" />
      </g>

      {/* ══ LEFT — ROT STATION PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 486, y: 372, n: "1" },
          { x: 316, y: 438, n: "2" },
          { x: 130, y: 438, n: "3" },
          { x: 300, y: 268, n: "4" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>

      {/* rot station labels */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.14em"
        fill="#ffb066"
      >
        <text x="66" y="530">1 · REAR RAIL &amp; KICKUP</text>
        <text x="330" y="530">2 · BODY MOUNTS</text>
        <text x="66" y="554">3 · FRONT RAIL &amp; STEERING BOX</text>
        <text x="330" y="554">4 · ROCKERS &amp; FLOORS</text>
      </g>

      {/* ══ RIGHT — THE ROLLING CAR ══ */}

      {/* ground line */}
      <line
        x1="652"
        y1="486"
        x2="1148"
        y2="486"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      {/* body shell, assembled — same silhouette, sitting on its wheels */}
      <path
        d="M 702 446 L 710 414 Q 744 388 794 380 L 830 340 Q 884 316 944 322 L 986 352 Q 1054 358 1098 380 Q 1114 404 1116 430 L 1116 446 L 1064 446 A 34 34 0 0 1 996 446 L 826 446 A 34 34 0 0 1 758 446 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* beltline + door cut */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" fill="none">
        <path d="M 724 416 L 1092 416" />
        <path d="M 854 338 L 854 414 M 958 346 L 958 414" />
      </g>
      {/* wheels */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6">
        <circle cx="792" cy="450" r="34" />
        <circle cx="792" cy="450" r="12" strokeWidth="1" strokeOpacity="0.6" />
        <circle cx="1030" cy="450" r="34" />
        <circle cx="1030" cy="450" r="12" strokeWidth="1" strokeOpacity="0.6" />
      </g>
      {/* motion ticks trailing the car */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.45" strokeLinecap="round">
        <line x1="1122" y1="404" x2="1148" y2="404" />
        <line x1="1128" y1="428" x2="1156" y2="428" />
        <line x1="1122" y1="452" x2="1146" y2="452" />
      </g>

      {/* stage leader lines */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 700 156 L 884 316" />
        <path d="M 668 236 L 754 388" />
        <path d="M 700 116 L 792 414" />
      </g>
      {/* stage pins */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 792, y: 414, n: "1" },
          { x: 754, y: 388, n: "2" },
          { x: 884, y: 316, n: "3" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>
      {/* stage labels */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.14em"
        fill="#ffb066"
      >
        <text x="710" y="112">1 · BRAKES, FUEL &amp; IGNITION FIRST</text>
        <text x="678" y="232">2 · DRIVETRAIN NEXT</text>
        <text x="710" y="152">3 · BODY &amp; PAINT LAST</text>
      </g>
      {/* steel feature label */}
      <text
        x="1148"
        y="530"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        DRIVES BETWEEN STAGES
      </text>

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
        FIG. R — THE FORK: LIFT IT OFF, OR KEEP IT ROLLING
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        If the frame or the structure under your car is rotten, badly repaired, or hiding both, it
        needs a <strong>frame-off</strong>. If the bones are sound and the car runs, drives, and
        stops, a <strong>rolling restoration</strong> — fixing it in planned stages while it stays
        a car — is usually the smarter spend. The structure decides, not the calendar.
      </p>

      <h2>What does a frame-off restoration actually involve?</h2>
      <p>
        Everything. The car comes apart to nothing: drivetrain out, glass out, interior out,
        wiring out, and the body lifted off the frame so both can be repaired, refinished, and
        rebuilt as separate assemblies before the car goes back together as one project. The point
        of the exercise is access — with the body off, there is no surface you cannot see, no seam
        you cannot reach, no rust you can talk yourself out of. On a unibody car there is no
        separate frame to lift away, so the equivalent is a bare-shell restoration: strip the
        shell of every component and mount it on a rotisserie or body cart so the underside gets
        the same honesty as the top.<a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <p>
        A word on the label itself, because sellers lean on it. &ldquo;Rotisserie
        restoration&rdquo; describes a piece of equipment, not a standard of work — a car can be
        stripped to bare metal on a rotisserie, or spun on one just long enough for a quick coat
        of chassis black. Veteran auction observers put it flatly: the term is so loosely applied
        that it tells you nothing about quality, and a documented body-off with photos is the only
        claim worth paying for.<a href="#src-1" className="cite-ref">[1]</a> That cuts both ways.
        When this shop does the work, the file of bare-metal photographs is part of what you are
        buying — it is the proof that holds value when the car sells. The full scope lives on the{" "}
        <Link href="/services/classic-car-restoration">classic restoration service page</Link>.
      </p>

      <h2>What is a rolling restoration, and when is it the smarter spend?</h2>
      <p>
        A rolling restoration keeps the car whole and drivable while the work happens in planned
        stages. The order matters and it never changes: stopping and running first — brakes,
        fuel system, ignition, steering, tires — because a car you can safely drive is a car that
        stays in the rotation instead of under a tarp. Drivetrain and suspension next. Cosmetics
        last, always last, for a reason that comes up later in this article.
      </p>
      <p>
        The case for rolling is not just budget, though spreading the cost over three seasons
        instead of one invoice is real. It is momentum. A car you drive every second weekend keeps
        earning its place; a car that has been a pile of labelled boxes for two years starts
        negotiating with you about whether it should exist. Every shop foreman has met the
        abandoned frame-off — bought as boxes, sold as boxes, at a loss, by a discouraged owner
        who never got to drive the thing. If the structure is sound, staying rolling avoids the
        single biggest killer of amateur restorations, which is not money. It is stall.
      </p>
      <blockquote>
        <p>A driving car negotiates its own survival. Boxes in a corner do not.</p>
        <footer>Shop rule, learned the expensive way</footer>
      </blockquote>

      <h2>How do you tell which one your car needs?</h2>
      <p>Three markers make the call. Read them in order, because the first one overrules the other two.</p>

      <h3>1. Structural rot</h3>
      <p>
        Get under the car with a flashlight and a screwdriver and probe the places rot lives:
        frame rails at the rear kickup, body mounts, torque boxes, rocker panels, floor pans, cab
        corners, spring hangers. Surface scale that dusts off is patina; a screwdriver that goes{" "}
        <strong>through</strong> is a verdict. Structural rust cannot be repaired honestly from
        underneath a loaded car — the metal around it has to come clean, get cut back to bright
        steel, and be welded with the structure supported and square, which is{" "}
        <Link href="/services/body-paint-metalwork">metalwork</Link> done properly or not at all.
        Alberta cars have a better starting hand than Ontario or Quebec cars, but do not assume —
        Edmonton ran calcium chloride anti-icing brine on its streets from 2016 to 2019, and
        engineers and residents reported enough added rust and vehicle damage that council shelved
        the program.<a href="#src-3" className="cite-ref">[3]</a> A classic that commuted through
        those winters, or spent a decade back east before it came west, gets the screwdriver test
        with no benefit of the doubt.
      </p>

      <h3>2. Prior repair</h3>
      <p>
        The second marker is what somebody already did to the car. Plates stitched over frame rot
        instead of cut out. Brazed patches. An inch of filler bridging a rusted rocker. Body
        mounts shimmed with washers because the floor sagged. One bodged repair found usually
        means more hiding, and here is the uncomfortable arithmetic: you cannot price what you
        cannot see, and neither can we. A car wearing shiny paint over unknown repair is a worse
        bet than an honest rusty one, because the honest car tells you the scope up front. When
        the evidence of prior hackwork stacks up, a teardown stops being optional — the frame-off
        becomes the only way to establish what the car actually is. The same logic drives the{" "}
        <Link href="/blog/barn-find-first-steps">barn-find protocol</Link>: assess before you
        spend, because the discoveries set the budget.
      </p>

      <h3>3. End use</h3>
      <p>
        The third marker is what the car is for, and this is where owners overspend. The collector
        market grades condition on a scale where a #1 car is concours-perfect down to the tire
        treads, a #2 could win a local show, and a #3 is a clean, correct car that runs and
        drives well.<a href="#src-4" className="cite-ref">[4]</a> Chasing #1 or #2 means every
        surface — including the two hundred nobody sees with the car assembled — has to be
        finished, and that is a frame-off by definition. But a #3 driver that gets ice cream duty
        on summer evenings does not need its frame painted to show standard. It needs to start,
        stop, steer, and not embarrass you at a red light. Match the depth of the work to the
        car&rsquo;s real life, not to a magazine build. A driver-grade car restored to
        driver-grade is a finished car; a driver-grade car restored to concours is usually a
        cheque the market never pays back.
      </p>

      <h2>Frame-off vs rolling — what do they cost and what do you get?</h2>
      <p>Typical planning ranges in Canadian dollars, not quotes:</p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Frame-off restoration versus rolling restoration compared by typical Canadian dollar
            cost, timeline, drivability, what you get, best fit, and main risk
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Frame-off</th>
              <th scope="col">Rolling</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Typical cost (CAD)</th>
              <td className="num">$80,000 – $200,000+</td>
              <td className="num">$5,000 – $30,000 per stage</td>
            </tr>
            <tr>
              <th scope="row">Timeline</th>
              <td>12 – 30 months, all at once</td>
              <td>Weeks to months per stage, over years</td>
            </tr>
            <tr>
              <th scope="row">Car drivable meanwhile</th>
              <td>No — it is boxes and a bare frame</td>
              <td>Yes, between stages</td>
            </tr>
            <tr>
              <th scope="row">What you get</th>
              <td>Every surface seen, repaired, documented</td>
              <td>A sound, improving driver — unseen areas stay unseen</td>
            </tr>
            <tr>
              <th scope="row">Best when</th>
              <td>Structural rot, hidden prior repair, or a show-grade goal</td>
              <td>Sound structure, driver-grade goal, budget in stages</td>
            </tr>
            <tr>
              <th scope="row">The risk</th>
              <td>Stall — the project outlasting the owner&rsquo;s patience</td>
              <td>Rot discovered later, after money went to cosmetics</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The cost gap is not markup — it is hours. Restoration is priced in labour, and a
        frame-off is hundreds of hours before the first part goes back on: teardown, media
        blasting, metal repair, refinishing, and an assembly that is really a thousand small
        alignments done patiently.<a href="#src-5" className="cite-ref">[5]</a> At typical Alberta
        shop rates of $100 to $185 per hour, the arithmetic gets to five figures quickly and six
        figures honestly. A rolling restoration buys the same hourly work in smaller, planned
        bites — and skips the hours spent perfecting surfaces a driver-grade car never shows.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$80K–$200K+</span>
          <span className="stat-l">Typical professional frame-off, common classics, CAD</span>
        </div>
        <div>
          <span className="stat-v">$5K–$30K</span>
          <span className="stat-l">Typical rolling-restoration stage, CAD</span>
        </div>
        <div>
          <span className="stat-v">$100–$185/hr</span>
          <span className="stat-l">Typical Alberta restoration shop labour</span>
        </div>
        <div>
          <span className="stat-v">10 min</span>
          <span className="stat-l">The flashlight-and-screwdriver structure check. Free</span>
        </div>
      </div>

      <h2>Can you start rolling and switch to a frame-off later?</h2>
      <p>
        Yes — and planned right, nothing is wasted. This is the quiet advantage of starting
        rolling on a sound car: a rebuilt engine, fresh brakes, new fuel lines, and a sorted
        harness all transfer straight into a frame-off if the project escalates. The one thing
        that does not transfer is paint. Pulling a freshly painted body off a frame to do the
        structure underneath means masking, chips, seam damage, and colour-matching grief — you
        end up paying for the same finish twice. That is the standing rule behind the stage
        order: <strong>structure and mechanicals first, paint last</strong>, so every dollar
        spent early survives whatever the project becomes. Owners who invert it — paint first,
        because paint is what friends see — are the ones who end up funding the same rocker
        panel twice.
      </p>
      <p>
        The switch usually announces itself. Stage two is open-heart surgery anyway — engine out,
        front clip off — and that is when a hidden rail repair or a crusty torque box finally
        shows. At that point the car is half apart, the discovery is real, and going the rest of
        the way is a far shorter conversation than it would have been at the start. Budget owners
        should hold ten to fifteen percent of the project money for exactly this moment. What the
        teardown finds is also what sets the schedule, which the{" "}
        <Link href="/blog/classic-car-restoration-timeline">restoration timeline article</Link>{" "}
        walks through stage by stage.
      </p>

      <h2>What should you do before spending a dollar?</h2>
      <p>
        Spend ten minutes and nothing else. Put the car on stands, take a flashlight and a
        screwdriver, and probe the rails, mounts, rockers, and floors. Photograph everything that
        worries you. If the screwdriver stays out of the metal and the history is honest, plan a
        rolling restoration in stages and start with the brakes. If it goes through — or the car
        wears repairs nobody will own up to — stop, because every dollar spent before the
        structure is settled is a dollar spent in the wrong order.
      </p>
      <p>
        Either way, the decision costs nothing to check twice. Send the year, model, where the
        car has lived, and your photos through the <Link href="/quote">quote page</Link>, or
        bring it by the shop — an hour on the hoist settles what a listing paragraph never will.
        You will get a straight answer: frame-off, rolling, or — when it is true — that the car
        is better than you feared and the first stage is smaller than you budgeted.
      </p>
    </>
  );
}
