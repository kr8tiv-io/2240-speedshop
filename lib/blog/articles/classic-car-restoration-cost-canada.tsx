import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Restoration Cost, Stage by Stage.
 * The money companion to the restoration timeline article: hedged CAD ranges
 * for teardown, metal, paint, drivetrain, and assembly, plus the Alberta
 * estimate rules that make stage-by-stage pricing the honest way to buy a
 * build. Links down into the restoration and body-paint service pages, the
 * engine rebuild cost article, the timeline article, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "classic-car-restoration-cost-canada",
  title: "What a Classic Car Restoration Costs in Canada, Stage by Stage",
  accent: "Costs",
  metaTitle: "What a Classic Car Restoration Costs in Canada (Stage by Stage)",
  description:
    "Hedged Canadian-dollar ranges for every stage of a classic restoration — teardown, metal, paint, drivetrain, assembly — plus the Alberta rules that protect your budget.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Revivals",
  targetKeywords: [
    "classic car restoration cost Canada",
    "how much to restore a classic car",
    "restoration cost breakdown",
    "car restoration price Edmonton",
    "frame-off restoration cost",
  ],
  faq: [
    {
      q: "How much does it cost to restore a classic car in Canada?",
      a: "A professional frame-off restoration to driver quality typically lands between $60,000 and $150,000 in Canadian dollars, and show-level work commonly runs $150,000 to $300,000 or more. A staged rolling restoration — the car stays drivable while one system at a time gets done — can deliver a solid driver for $25,000 to $60,000 spread over several years. Every figure is a planning range, not a quote; the shell's condition and the finish level you demand set the real number.",
    },
    {
      q: "What is the most expensive part of a classic car restoration?",
      a: "Bodywork — metal repair plus paint prep — is almost always the biggest line, commonly 40 to 60 percent of a full build's cost. The reason is hours, not materials: cutting out rust, welding in panels, and block-sanding a body straight is skilled hand labor billed by the hour, and there is no machine that does it faster. A rust-free western shell is the single biggest discount available, because it deletes hours from the most expensive stage.",
    },
    {
      q: "Why won't a restoration shop give me one firm price for the whole car?",
      a: "Because Alberta law holds a licensed shop to any written estimate it issues — the final bill cannot exceed a written estimate by more than 10 percent, to a maximum of $100 over. No honest shop will sign up for that on a car whose floors and quarters have not been media-blasted yet. The professional answer is stage-by-stage pricing: a written estimate and a written authorization for each stage, with the next stage priced only after the previous one has told the truth.",
    },
    {
      q: "Can I restore a classic car for under $25,000?",
      a: "Yes, if you change the shape of the project. Start with a straight, running, rust-managed car instead of a shell; keep the car assembled and do a rolling restoration one system at a time; do your own disassembly, cleaning, and parts chasing; and buy professional hours only where they matter most — metalwork, paint, and machine work. What you cannot do for $25,000 is a full frame-off with professional hours at every stage; the labor math simply does not fit.",
    },
    {
      q: "Will I get my money back when I sell a restored classic?",
      a: "Usually not, and it is better to know that before teardown. Unless the car is genuinely rare and high-value, the market price of the finished car will sit below what a full professional restoration costs to buy. Restore the car because you want that car; buy an already-restored example if the spreadsheet is what matters. The exceptions — matching-numbers, documented, desirable models — are exceptions, not a plan.",
    },
  ],
  citations: [
    {
      name: "“How Much Does it Cost to Restore a Classic Car?,” Hagerty",
      url: "https://www.hagerty.com/resources/car-restoration/how-much-does-it-cost-to-restore-a-classic-car",
    },
    {
      name: "“Repair estimates and authorizations: what you need to know,” Alberta Motor Vehicle Industry Council",
      url: "https://www.amvic.org/repair-estimates-and-authorizations-what-you-need-to-know/",
    },
    {
      name: "“Repairing a vehicle,” Alberta Motor Vehicle Industry Council consumer guide",
      url: "https://www.amvic.org/consumer/repairing-a-vehicle/",
    },
    {
      name: "“Licence plates,” Government of Alberta",
      url: "https://www.alberta.ca/licence-plates",
    },
  ],
  internalLinks: [
    "/services/classic-car-restoration",
    "/services/body-paint-metalwork",
    "/blog/engine-rebuild-cost-canada",
    "/blog/classic-car-restoration-timeline",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * A classic coupe in steel line art with five numbered pins — teardown at the
 * cowl, metal at the rocker, paint at the roof, drivetrain at the front
 * wheels, assembly at the door — feeding a segmented cost bar below, each
 * segment's width proportional to the midpoint of its CAD range, with a
 * dashed contingency box on the end. Editorial plate in the shop style:
 * mono labels, sourced amber accents, dim figure caption.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Diagram of a classic coupe in side profile with five numbered pins marking teardown, metal repair, paint, drivetrain, and assembly, above a segmented cost bar whose section widths are proportional to each stage's typical Canadian-dollar range, ending in a dashed contingency segment"
      className="h-auto w-full"
    >
      <title>Where the money goes — five stages and a contingency box</title>
      <defs>
        <radialGradient id="rc-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the car */}
      <ellipse cx="600" cy="330" rx="420" ry="30" fill="url(#rc-pool)" />

      {/* ══ THE COUPE — side profile, steel line art ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* body line: bumper, hood, windshield, roof, backlight, trunk, tail */}
        <path d="M 170 292 L 176 262 Q 180 250 200 246 L 348 232 Q 420 172 470 166 L 560 160 Q 700 152 760 168 Q 830 186 890 214 L 972 238 Q 1010 248 1016 264 L 1020 292" />
        {/* rocker between the arches */}
        <path d="M 398 318 L 552 318 M 762 318 L 900 318 M 900 318 Q 1010 314 1020 292" />
        <path d="M 170 292 Q 180 314 268 318" />
        {/* wheel arches */}
        <path d="M 268 318 A 66 66 0 0 1 398 318" />
        <path d="M 632 318 A 66 66 0 0 1 762 318" />
        {/* greenhouse: A-pillar, roof glass line, B-pillar */}
        <path d="M 470 172 L 512 236 M 742 170 L 716 236" strokeWidth="1.4" strokeOpacity="0.75" />
        <path d="M 512 236 L 716 236" strokeWidth="1.4" strokeOpacity="0.75" />
        {/* door cut */}
        <path d="M 560 236 L 556 316" strokeWidth="1.4" strokeOpacity="0.75" />
        {/* hood shut line at the cowl */}
        <path d="M 452 176 L 448 234" strokeWidth="1.4" strokeOpacity="0.6" />
        {/* belt line */}
        <path d="M 348 240 L 448 234 M 512 240 L 980 244" strokeWidth="1" strokeOpacity="0.5" />
      </g>
      {/* wheels */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8">
        <circle cx="333" cy="318" r="52" />
        <circle cx="697" cy="318" r="52" />
        <circle cx="333" cy="318" r="21" strokeWidth="1.1" strokeOpacity="0.7" />
        <circle cx="697" cy="318" r="21" strokeWidth="1.1" strokeOpacity="0.7" />
      </g>
      {/* rust ticks at the rocker and rear arch — where the metal money hides */}
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.65" strokeLinecap="round">
        <line x1="470" y1="322" x2="478" y2="330" />
        <line x1="492" y1="322" x2="500" y2="330" />
        <line x1="514" y1="322" x2="522" y2="330" />
        <line x1="772" y1="322" x2="780" y2="330" />
        <line x1="794" y1="322" x2="802" y2="330" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 450, y: 205, n: "1" }, // teardown — the cowl shut line
          { x: 496, y: 326, n: "2" }, // metal — the rocker
          { x: 614, y: 156, n: "3" }, // paint — the roof skin
          { x: 296, y: 252, n: "4" }, // drivetrain — over the front wheel
          { x: 660, y: 276, n: "5" }, // assembly — the door
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>

      {/* ══ THE COST BAR — width proportional to midpoint of range ══ */}
      {/* segments: teardown 75 · metal 216 · paint 273 · drivetrain 169 · assembly 207 (of 940) */}
      <g>
        {[
          { x: 80, w: 75, o: 0.06 },
          { x: 155, w: 216, o: 0.14 },
          { x: 371, w: 273, o: 0.16 },
          { x: 644, w: 169, o: 0.1 },
          { x: 813, w: 207, o: 0.12 },
        ].map((s, i) => (
          <g key={i}>
            <rect
              x={s.x}
              y={430}
              width={s.w}
              height={46}
              fill="#ffb066"
              fillOpacity={s.o}
              stroke="#ffb066"
              strokeWidth="1.2"
            />
            <text
              x={s.x + s.w / 2}
              y={459}
              textAnchor="middle"
              fontFamily="var(--font-plex-mono), ui-monospace, monospace"
              fontSize="11"
              letterSpacing="0.08em"
              fill="#ffd9ad"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        ))}
        {/* contingency — the dashed box every build cashes eventually */}
        <rect
          x="1020"
          y="430"
          width="100"
          height="46"
          fill="none"
          stroke="#ffb066"
          strokeWidth="1"
          strokeOpacity="0.6"
          strokeDasharray="5 4"
        />
        <text
          x="1070"
          y="459"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="10"
          letterSpacing="0.1em"
          fill="#9a9ca0"
          fillOpacity="0.7"
        >
          +15–20%
        </text>
      </g>

      {/* ══ STAGGERED SEGMENT LABELS ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#ffb066"
      >
        {/* upper row — 1, 3, 5 */}
        <text x="117" y="506" textAnchor="middle">
          01 · TEARDOWN
        </text>
        <text x="117" y="522" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.65">
          $4K–$12K
        </text>
        <text x="507" y="506" textAnchor="middle">
          03 · BODY &amp; PAINT
        </text>
        <text x="507" y="522" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.65">
          $15K–$45K
        </text>
        <text x="916" y="506" textAnchor="middle">
          05 · ASSEMBLY &amp; TRIM
        </text>
        <text x="916" y="522" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.65">
          $12K–$35K
        </text>
        {/* lower row — 2, 4 */}
        <text x="263" y="548" textAnchor="middle">
          02 · METAL &amp; RUST
        </text>
        <text x="263" y="564" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.65">
          $8K–$40K+
        </text>
        <text x="728" y="548" textAnchor="middle">
          04 · DRIVETRAIN
        </text>
        <text x="728" y="564" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.65">
          $8K–$30K
        </text>
        {/* lower-row ticks from bar to label */}
        <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.4">
          <line x1="263" y1="478" x2="263" y2="536" />
          <line x1="728" y1="478" x2="728" y2="536" />
        </g>
        {/* upper-row ticks */}
        <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.4">
          <line x1="117" y1="478" x2="117" y2="494" />
          <line x1="507" y1="478" x2="507" y2="494" />
          <line x1="916" y1="478" x2="916" y2="494" />
        </g>
      </g>

      {/* axis note + totals */}
      <text
        x="80"
        y="416"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        SEGMENT WIDTH ∝ MIDPOINT OF TYPICAL RANGE, CAD
      </text>
      <text
        x="1120"
        y="416"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#ffb066"
      >
        DRIVER $60K–$150K · SHOW $150K–$300K+
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
        FIG. R — WHERE THE MONEY GOES, STAGE BY STAGE
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        In Canada, a professional frame-off restoration typically lands between{" "}
        <strong>$60,000 and $150,000</strong>, and show-level work runs past $200,000. Stage by
        stage: teardown $4,000–$12,000; metal $8,000–$40,000; paint and body $15,000–$45,000;
        drivetrain $8,000–$30,000; assembly and interior $12,000–$35,000. Every figure is a
        planning range, not a quote.
      </p>

      <h2>How much does it cost to restore a classic car in Canada?</h2>
      <p>
        The honest answer is a range, and the range is wide because two variables dominate
        everything else: the condition of the shell you start with, and the finish level you stop
        at. A dry, straight prairie car built to driver quality and a salt-rotted eastern car
        chased to show judging standards are not the same project — they are not even the same
        decade of labor. Hagerty&rsquo;s restoration guidance puts shop labor upwards of US$70 an
        hour and climbing for specialist work, and warns that disassembly routinely uncovers
        problems nobody priced — a bent frame, a cracked block, floors that looked solid from
        above.<a href="#src-1" className="cite-ref">[1]</a> In Alberta, established restoration
        shops commonly bill $100 to $165 an hour in Canadian dollars, and the same rule holds:
        the car you can see is never the whole bill.
      </p>
      <p>
        Say the second honest thing early, too: unless the car is genuinely rare and valuable, you
        will not get the money back at sale.<a href="#src-1" className="cite-ref">[1]</a> A full
        professional restoration on a common classic costs more than the finished car brings.
        Restore the car because it is your grandfather&rsquo;s truck, your first car, or the one
        you have wanted since high school — those are all good reasons, and they are the reasons
        the <Link href="/services/classic-car-restoration">restoration service</Link> exists. The
        spreadsheet is not a good reason, and no honest shop will tell you it is.
      </p>
      <blockquote>
        <p>The car you buy is the cheapest part of the car you finish.</p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>

      <h2>What does each stage cost, one at a time?</h2>
      <p>
        Five stages, in the order the money leaves. Driver quality means a straight, correct,
        reliable car you drive without apology; show quality means a car built to be judged.
        Typical planning ranges in Canadian dollars, not quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            The five stages of a classic car restoration — teardown and assessment, metal and rust
            repair, body and paint, drivetrain and chassis, and assembly, wiring, and interior —
            compared by what happens in each stage and typical Canadian dollar cost at driver
            quality and at show quality
          </caption>
          <thead>
            <tr>
              <th scope="col">Stage</th>
              <th scope="col">What actually happens</th>
              <th scope="col">Driver quality (CAD)</th>
              <th scope="col">Show quality (CAD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1. Teardown &amp; assessment</th>
              <td>Strip to the shell, catalogue every part, media-blast, map the damage</td>
              <td className="num">$4,000 – $12,000</td>
              <td className="num">$8,000 – $18,000</td>
            </tr>
            <tr>
              <th scope="row">2. Metal &amp; rust repair</th>
              <td>Floors, rockers, quarters, patch panels, frame repair, panel fit</td>
              <td className="num">$8,000 – $40,000+</td>
              <td className="num">$20,000 – $60,000+</td>
            </tr>
            <tr>
              <th scope="row">3. Body &amp; paint</th>
              <td>Blocking, priming, blocking again, sealer, colour, clear, cut and polish</td>
              <td className="num">$15,000 – $45,000</td>
              <td className="num">$40,000 – $80,000+</td>
            </tr>
            <tr>
              <th scope="row">4. Drivetrain &amp; chassis</th>
              <td>Engine, transmission, axle, brakes, suspension, steering, fuel</td>
              <td className="num">$8,000 – $30,000</td>
              <td className="num">$25,000 – $60,000+</td>
            </tr>
            <tr>
              <th scope="row">5. Assembly, wiring &amp; interior</th>
              <td>Harness, glass, brightwork, seats, headliner, a thousand small fights</td>
              <td className="num">$12,000 – $35,000</td>
              <td className="num">$30,000 – $70,000+</td>
            </tr>
            <tr>
              <th scope="row">Whole car</th>
              <td>Frame-off, professionally built, start to finish</td>
              <td className="num">$60,000 – $150,000</td>
              <td className="num">$150,000 – $300,000+</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Teardown and assessment — $4,000 to $12,000</h3>
      <p>
        Cheap hours, expensive information. The car comes apart to the bare shell, every fastener
        and bracket gets bagged and catalogued, and the body goes to media blasting. This is the
        stage where the project stops being a guess: blasting strips fifty years of paint, filler,
        and undercoat, and whatever is underneath is the truth you will be paying for. Skipping or
        rushing assessment does not save money — it just moves the surprise to a stage where it
        costs triple.
      </p>

      <h3>Metal and rust repair — $8,000 to $40,000 and up</h3>
      <p>
        The widest range on the table, because rust is the variable nobody controls. Floors,
        rockers, cab corners, and quarter lowers are the usual bill; a rotted windshield channel
        or a frame repair is where budgets go to die. Alberta hands you one real advantage here —
        dry prairie cars rust slower than anything that lived on Ontario or Quebec road salt, and
        paying more for a western shell is almost always cheaper than paying a welder to build you
        one. Metal work is priced in hours, and the only discount is needing fewer of them.
      </p>

      <h3>Body and paint — $15,000 to $45,000</h3>
      <p>
        Paint materials are real money, but hours are the bill: block-sanding a body straight,
        priming, blocking again, and doing it until the reflections lie flat is hand labor with no
        shortcut. The gap between a $15,000 paint job and a $60,000 one is almost entirely prep
        hours, which is why the <Link href="/services/body-paint-metalwork">body, paint, and
        metalwork service</Link> treats stages two and three as one continuous argument with the
        panel gaps. Decide your finish level before this stage starts — show paint on a driver
        budget is the most common way builds stall.
      </p>

      <h3>Drivetrain and chassis — $8,000 to $30,000</h3>
      <p>
        Two honest paths. Rebuilding the original drivetrain keeps the numbers matching: a stock
        rebuild on a common V8 typically runs $5,000 to $10,000 in parts and machine work — the
        full breakdown is in the{" "}
        <Link href="/blog/engine-rebuild-cost-canada">engine rebuild cost article</Link> — plus
        transmission, axle, brakes, suspension, and steering to the same standard. The restomod
        path swaps in a modern drivetrain and commonly lands between $15,000 and $35,000 by the
        time cooling, wiring, and tuning are counted. Either way, budget the systems around the
        engine; the engine is never the whole stage.
      </p>

      <h3>Assembly, wiring, and interior — $12,000 to $35,000</h3>
      <p>
        The stage everyone under-budgets. A new harness runs $1,500 to $4,000 installed before
        troubleshooting; interior kits for common classics run $3,500 to $10,000 plus the trim
        labor to fit them; glass, seals, and brightwork are hundreds of dollars a decision. Then
        comes the long tail — aligning panels, chasing rattles, bleeding systems, and fixing the
        hundred small things that only show up once the car is whole. Assembly is where a
        twelve-month build becomes an eighteen-month build, and the hours are real either way.
      </p>

      <h2>Why won&rsquo;t a shop quote one firm price for the whole car?</h2>
      <p>
        Because in Alberta, a written estimate is not a guess — it is close to a commitment.
        AMVIC, the province&rsquo;s automotive regulator, requires a licensed shop to provide a
        written estimate on request covering labour, parts, and equipment, and to get written
        authorization before work starts.<a href="#src-2" className="cite-ref">[2]</a> The final
        bill cannot legally exceed a written estimate by more than 10 percent, to a maximum of
        $100 over.<a href="#src-3" className="cite-ref">[3]</a> No sane shop signs that document
        for a thousand-hour project on a car that has not been blasted yet, and you should be
        suspicious of any shop that will.
      </p>
      <p>
        The professional structure is stage-by-stage: a written estimate for teardown and
        assessment, then — once the shell has told the truth — a written estimate for metal, and
        so on down the table, each stage authorized in writing before it starts. This is not the
        shop dodging accountability; it is the estimate rule working exactly as intended, one
        honest number at a time. Use it. Ask for the written estimate at every stage, ask what
        would push the number, and treat each stage boundary as a decision point where you can
        pause, re-scope, or keep going.
      </p>

      <h2>Where does the money actually go?</h2>
      <p>
        Hours. A driver-quality frame-off commonly absorbs 800 to 1,200 shop hours — the full
        schedule is in the{" "}
        <Link href="/blog/classic-car-restoration-timeline">restoration timeline article</Link> —
        and show builds run far past that. Multiply hours by an Alberta shop rate and you have
        most of the bill before a single part is purchased; parts, materials, and outside
        machine work typically make up 30 to 40 percent of the total. That arithmetic is why
        stage costs vary so much between cars, and why every dollar figure in this article is a
        range.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$100–$165</span>
          <span className="stat-l">Typical Alberta restoration shop rate, CAD per hour</span>
        </div>
        <div>
          <span className="stat-v">800–1,200</span>
          <span className="stat-l">Shop hours, driver-quality frame-off</span>
        </div>
        <div>
          <span className="stat-v">30–40%</span>
          <span className="stat-l">Parts and materials share of a typical build</span>
        </div>
        <div>
          <span className="stat-v">15–20%</span>
          <span className="stat-l">Contingency to hold back. You will use it</span>
        </div>
      </div>
      <p>
        The contingency line is not pessimism; it is pattern recognition. Blasting finds rust the
        magnet missed, the block turns out to be cracked, the chrome shop&rsquo;s quote doubles —
        something always cashes that box. Builds that die in year two are almost never killed by
        the known costs. They are killed by spending the reserve in stage one.
      </p>

      <h2>How do you keep the budget from running away?</h2>
      <ul>
        <li>
          <strong>Buy the best shell you can find, not the cheapest.</strong> Every extra dollar
          spent on a dry western car is several dollars not spent in stage two.
        </li>
        <li>
          <strong>Define done in writing before teardown.</strong> Driver or show, original or
          restomod, which systems get touched — scope creep is the real inflation.
        </li>
        <li>
          <strong>Stage the money the way the shop stages the work.</strong> One written estimate
          and one written authorization per stage, with a real decision point between stages.
        </li>
        <li>
          <strong>Hold 15 to 20 percent in reserve</strong> and do not commit it early, no matter
          how tempting the optional upgrades look in stage one.
        </li>
        <li>
          <strong>Match finish level to use.</strong> Show paint on a car that will see gravel
          roads and July hail warnings is money spent to be nervous.
        </li>
      </ul>
      <p>
        One more Alberta note for the far end of the project. If the finished car is 25 years old
        or more and will only ever see shows, parades, and club runs, the province offers an
        antique plate — but its use is restricted to exactly those events, plus the drive to and
        from them and to servicing.<a href="#src-4" className="cite-ref">[4]</a> A restored
        classic you intend to actually drive gets registered like any other passenger vehicle, and
        the good news is that driving it is the point.
      </p>
      <p>
        If you are trying to put a number on a specific car — a truck in the yard, a coupe on a
        marketplace ad, the family sedan in a relative&rsquo;s barn — send the year, model, where
        it has lived, and photos of the rockers and floors through the{" "}
        <Link href="/quote">quote page</Link>. You will get a straight answer about which stages
        that car actually needs, what each one typically runs, and — when it is true — the answer
        that this particular car is not worth restoring, before it costs you anything to learn.
      </p>
    </>
  );
}
