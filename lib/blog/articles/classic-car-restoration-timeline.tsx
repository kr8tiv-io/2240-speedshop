import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 03 — The Restoration Timeline.
 * Owns the TIME question the way /guides/costs owns the MONEY question.
 * Links up into the costs pillar, down into the restoration service page,
 * the blue project shell case study, the barn-find protocol, and the quote.
 */

export const meta: ArticleMeta = {
  slug: "classic-car-restoration-timeline",
  title:
    "How Long Does a Classic Car Restoration Take? Stage-by-Stage, From the Shop Floor",
  accent: "Long",
  metaTitle: "How Long Does a Classic Car Restoration Take? Stage-by-Stage",
  description:
    "How long a classic car restoration really takes — honest hour and calendar ranges by stage, why schedules slip, and why sorting cannot be skipped. From an Edmonton shop.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Restoration",
  targetKeywords: [
    "how long does a classic car restoration take",
    "restoration timeline stages",
    "why do restorations take so long",
    "frame-off restoration timeline",
    "classic car restoration Edmonton",
  ],
  faq: [
    {
      q: "How many hours does a full restoration take?",
      a: "A driver-quality frame-off commonly plans out at 800 to 1,200 shop hours, and show-quality work runs 1,500 to 2,500. Hagerty puts a true concours restoration at 4,000 to 5,000 hours. A mechanical refresh is far lighter — commonly 40 to 150 hours. Hours scale with the standard being built to, not the size of the car.",
    },
    {
      q: "Why do restorations go over schedule?",
      a: "Three causes cover almost every overrun: parts lead times, because plating, glass, and rare trim can take months to arrive; surprises found at teardown, because rust hides until the paint and panels come off; and decision latency, because every colour choice or approval the owner sits on stops the car. The shop controls the hours. The calendar is shared.",
    },
    {
      q: "Can a restoration be done in stages?",
      a: "Yes. A rolling restoration takes the car in planned phases — safety and brakes first, then drivetrain, then metal, paint, and interior — usually spread over two to five years. It costs slightly more in total hours because some work gets touched twice, and the car stays drivable between phases. It is how most private owners actually get a car finished.",
    },
    {
      q: "What is the fastest a frame-off can be done properly?",
      a: "With clean metal, well-supported parts supply, and an owner who answers decisions the same day, roughly a year is a realistic floor for a driver-quality frame-off at a working shop. High-volume production restomod builders finish faster with dedicated assembly lines, but that model does not apply to a one-off customer car. On a one-off, dramatically faster usually means a stage got shorted — most often sorting.",
    },
    {
      q: "How do I keep my restoration project on schedule?",
      a: "Approve a written scope that names the standard before teardown, answer decisions quickly, order long-lead items like chrome, glass, and upholstery early, and fund each phase so the car never waits on money. Resist changing the target standard mid-build — it is the single most expensive schedule decision an owner can make. The owner is on the critical path more often than the shop is.",
    },
  ],
  citations: [
    {
      name: "“Before You Dive Into a Restoration, Read This,” Hagerty Media",
      url: "https://www.hagerty.com/media/buying-and-selling/before-you-dive-into-a-restoration-read-this/",
    },
    {
      name: "“How Long Does a Restomod Take to Build?,” Velocity Restorations",
      url: "https://www.velocityrestorations.com/blog/how-long-does-a-restomod-take/",
    },
    {
      name: "“What Does It Cost to Restore My Classic Car?,” Hagerty, May 2026",
      url: "https://www.hagerty.com/resources/car-restoration/how-much-does-it-cost-to-restore-a-classic-car",
    },
    {
      name: "“Judging & Awards,” National Corvette Restorers Society",
      url: "https://www.ncrs.org/services/judging-awards.php",
    },
  ],
  internalLinks: [
    "/guides/costs",
    "/builds/blue-project-shell",
    "/blog/barn-find-first-steps",
    "/services/classic-car-restoration",
    "/quote",
  ],
  readingMinutes: 10,
};

/**
 * Horizontal build timeline: five stage blocks sized by their honest share of
 * shop hours, hazard diamonds where schedules actually break, a wrench-handed
 * clock for the hours-versus-calendar argument, and a month rail underneath
 * that stretches past twelve. Steel line art, tungsten accents, transparent
 * ground so the page's dark panel reads through.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 600"
      role="img"
      aria-label="Horizontal timeline of a frame-off classic car restoration: five stage blocks sized by share of shop hours — teardown, metal and body, paint, assembly, sorting — with hazard markers for surprise rust and parts delay, a clock with a wrench for an hour hand, and a calendar rail showing the months stretching past twelve"
      className="h-auto w-full"
    >
      <title>Where the hours go — five stages, two hazards, one calendar</title>
      <defs>
        <radialGradient id="tl-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ══ WRENCH-CLOCK — hours are not calendar ══ */}
      <circle cx="150" cy="120" r="80" fill="url(#tl-halo)" />
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        <circle cx="150" cy="120" r="58" strokeWidth="2" />
        {/* cardinal ticks, longer */}
        <g strokeWidth="1.4">
          <line x1="150" y1="68" x2="150" y2="78" />
          <line x1="202" y1="120" x2="192" y2="120" />
          <line x1="150" y1="172" x2="150" y2="162" />
          <line x1="98" y1="120" x2="108" y2="120" />
        </g>
        {/* minor ticks */}
        <g strokeWidth="1" strokeOpacity="0.6">
          <line x1="176" y1="75" x2="173" y2="80" />
          <line x1="195" y1="94" x2="190" y2="97" />
          <line x1="195" y1="146" x2="190" y2="143" />
          <line x1="176" y1="165" x2="173" y2="160" />
          <line x1="124" y1="165" x2="127" y2="160" />
          <line x1="105" y1="146" x2="110" y2="143" />
          <line x1="105" y1="94" x2="110" y2="97" />
          <line x1="124" y1="75" x2="127" y2="80" />
        </g>
        {/* minute hand — plain steel, pointing at two */}
        <line x1="150" y1="120" x2="186" y2="99" strokeWidth="1.5" />
      </g>
      {/* hour hand — an open-end wrench, pointing at ten */}
      <g fill="none" stroke="#ffb066" strokeLinecap="round" strokeLinejoin="round">
        <line x1="150" y1="120" x2="131" y2="107" strokeWidth="3" />
        {/* open jaw at the tip */}
        <path d="M 133 99 A 7.5 7.5 0 1 0 122 110" strokeWidth="2.2" />
      </g>
      <circle cx="150" cy="120" r="3.2" fill="#ffd9ad" />
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
        textAnchor="middle"
      >
        <text x="150" y="205" fill="#ffb066">
          SHOP HOURS
        </text>
        <text x="150" y="223" fill="#9a9ca0" fillOpacity="0.7">
          &ne; CALENDAR TIME
        </text>
      </g>

      {/* ══ HEADER ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
        textAnchor="end"
      >
        <text x="1100" y="96" fill="#ffb066">
          ONE DRIVER-QUALITY FRAME-OFF
        </text>
        <text x="1100" y="116" fill="#9a9ca0" fillOpacity="0.7">
          BLOCKS SIZED BY SHARE OF SHOP HOURS
        </text>
      </g>

      {/* ══ HAZARD MARKERS — where schedules actually break ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.16em" textAnchor="middle">
        <text x="200" y="240" fill="#ffb066">
          SURPRISE RUST
        </text>
        <text x="750" y="240" fill="#ffb066">
          PARTS DELAY
        </text>
      </g>
      <g fill="none" stroke="#ffb066">
        <rect x="193" y="251" width="14" height="14" transform="rotate(45 200 258)" strokeWidth="1.3" />
        <rect x="743" y="251" width="14" height="14" transform="rotate(45 750 258)" strokeWidth="1.3" />
      </g>
      <circle cx="200" cy="258" r="1.8" fill="#ffd9ad" />
      <circle cx="750" cy="258" r="1.8" fill="#ffd9ad" />
      <g stroke="#ffb066" strokeWidth="0.8" strokeOpacity="0.55" strokeDasharray="2 4">
        <line x1="200" y1="268" x2="200" y2="298" />
        <line x1="750" y1="268" x2="750" y2="298" />
      </g>

      {/* ══ THE FIVE STAGE BLOCKS ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.5" strokeLinejoin="round">
        <rect x="100" y="300" width="100" height="60" />
        <rect x="200" y="300" width="350" height="60" />
        <rect x="550" y="300" width="200" height="60" />
        <rect x="750" y="300" width="250" height="60" />
        <rect x="1000" y="300" width="100" height="60" />
      </g>

      {/* stage numbers */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="14"
        letterSpacing="0.1em"
        fill="#ffb066"
      >
        <text x="110" y="322">01</text>
        <text x="210" y="322">02</text>
        <text x="560" y="322">03</text>
        <text x="760" y="322">04</text>
        <text x="1010" y="322">05</text>
      </g>

      {/* in-block glyphs, steel, quiet */}
      <g fill="none" stroke="#9a9ca0" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round">
        {/* teardown — bolt coming out, exploded */}
        <circle cx="140" cy="342" r="4" strokeWidth="1.2" />
        <line x1="149" y1="342" x2="168" y2="342" strokeWidth="1.1" strokeDasharray="3 3" />
        {/* metal & body — weld bead */}
        <polyline
          points="325,345 335,336 345,345 355,336 365,345 375,336 385,345 395,336 405,345 415,336 425,345"
          strokeWidth="1.2"
        />
        {/* paint — spray fan */}
        <circle cx="630" cy="342" r="2.2" strokeWidth="1.1" />
        <g strokeWidth="1" strokeOpacity="0.8">
          <line x1="635" y1="340" x2="668" y2="331" />
          <line x1="636" y1="342" x2="670" y2="342" />
          <line x1="635" y1="344" x2="668" y2="353" />
        </g>
        {/* assembly — bolt going back in */}
        <line x1="847" y1="342" x2="866" y2="342" strokeWidth="1.1" strokeDasharray="3 3" />
        <circle cx="875" cy="342" r="4" strokeWidth="1.2" />
        {/* sorting — two checks */}
        <path d="M 1035 342 l 4 5 l 8 -11" strokeWidth="1.3" />
        <path d="M 1057 342 l 4 5 l 8 -11" strokeWidth="1.3" />
      </g>

      {/* stage names + hour shares */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.14em" textAnchor="middle">
        <g fontSize="11" fill="#9a9ca0" fillOpacity="0.9">
          <text x="150" y="392">TEARDOWN</text>
          <text x="375" y="392">METAL &amp; BODY</text>
          <text x="650" y="392">PAINT</text>
          <text x="875" y="392">ASSEMBLY</text>
          <text x="1050" y="392">SORTING</text>
        </g>
        <g fontSize="10" fill="#ffb066" fillOpacity="0.75">
          <text x="150" y="410">&#8776;10% OF HOURS</text>
          <text x="375" y="410">&#8776;35% OF HOURS</text>
          <text x="650" y="410">&#8776;20% OF HOURS</text>
          <text x="875" y="410">&#8776;25% OF HOURS</text>
          <text x="1050" y="410">&#8776;10% OF HOURS</text>
        </g>
      </g>

      {/* bridge note */}
      <text
        x="600"
        y="444"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        HOURS ABOVE — CALENDAR BELOW. DELAYS STRETCH THE TAPE, NOT THE WORK.
      </text>

      {/* ══ CALENDAR RAIL ══ */}
      <line
        x1="100"
        y1="470"
        x2="900"
        y2="470"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeDasharray="2 7"
      />
      {/* the overrun stretch */}
      <line
        x1="900"
        y1="470"
        x2="1096"
        y2="470"
        stroke="#ffb066"
        strokeWidth="1"
        strokeOpacity="0.55"
        strokeDasharray="7 7"
      />
      <path d="M 1096 465 L 1106 470 L 1096 475" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.75" strokeLinejoin="round" />
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.7">
        <line x1="100" y1="463" x2="100" y2="477" />
        <line x1="300" y1="463" x2="300" y2="477" />
        <line x1="500" y1="463" x2="500" y2="477" />
        <line x1="700" y1="463" x2="700" y2="477" />
        <line x1="900" y1="463" x2="900" y2="477" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        textAnchor="middle"
        fill="#9a9ca0"
        fillOpacity="0.75"
      >
        <text x="100" y="497">MO 0</text>
        <text x="300" y="497">MO 3</text>
        <text x="500" y="497">MO 6</text>
        <text x="700" y="497">MO 9</text>
        <text x="900" y="497">MO 12</text>
      </g>
      <text
        x="1100"
        y="497"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#ffb066"
        fillOpacity="0.8"
      >
        + PARTS &amp; DECISIONS
      </text>

      {/* plate caption */}
      <text
        x="600"
        y="560"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. B — FIVE STAGES, TWO HAZARDS, ONE CALENDAR
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        A driver-quality mechanical refresh takes weeks to a couple of months. A true frame-off is
        a different animal: shops, including this one, plan around 800 to 1,200-plus hours of
        labour, and those hours land on a real calendar as a year or more. Hours are the work. The
        calendar is the work plus everything the work waits on.
      </p>

      <h2>How long does a restoration actually take?</h2>
      <p>
        &ldquo;Restoration&rdquo; is one word for at least four different jobs, and each carries
        its own clock. The table below is how the work plans out on a real floor — hours first,
        because hours are what you buy, then calendar, because calendar is what you live with. The
        money side of these same scopes — what the hours cost and why quotes vary — lives in the{" "}
        <Link href="/guides/costs">restoration cost guide</Link>. This page owns the clock.
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Classic car restoration timelines by scope: typical shop hours, typical calendar time,
            and what sets the pace for each
          </caption>
          <thead>
            <tr>
              <th scope="col">Scope</th>
              <th scope="col">Typical shop hours</th>
              <th scope="col">Typical calendar</th>
              <th scope="col">What sets the pace</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Mechanical refresh</th>
              <td className="num">40 – 150 hrs</td>
              <td>Weeks to ~2 months</td>
              <td>Parts availability, not labour</td>
            </tr>
            <tr>
              <th scope="row">Frame-off, driver quality</th>
              <td className="num">800 – 1,200 hrs</td>
              <td>12 – 18 months</td>
              <td>Metal repair and paint prep</td>
            </tr>
            <tr>
              <th scope="row">Frame-off, show quality</th>
              <td className="num">1,500 – 2,500 hrs</td>
              <td>18 – 36 months</td>
              <td>Block-sanding, plating, detail</td>
            </tr>
            <tr>
              <th scope="row">Concours</th>
              <td className="num">2,500 – 5,000+ hrs</td>
              <td>Multi-year, open-ended</td>
              <td>Correctness and documentation</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Two of those numbers deserve their sourcing. The hour ranges for refresh, driver, and show
        work are the planning figures shops like this one actually schedule against — the same
        ranges the cost guide prices out. The top tier is Hagerty&rsquo;s: a true concours
        restoration now runs 4,000 to 5,000 hours, and the shops doing that work carry backlogs
        measured in years.<a href="#src-1" className="cite-ref">[1]</a> On the calendar side, even
        a high-volume production restomod builder concedes that a traditionally built car takes
        twelve to twenty-four months or longer.<a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <p>
        The instinct is to divide: a thousand hours at forty hours a week is six months, so why
        does the car take a year and a half? Because your car does not get forty hours a week. It
        shares the floor with other builds, primer and paint cure on their own schedule, and the
        project waits — on parts, on plating, on decisions. The hours are the labour bill. The
        calendar is the labour bill plus the waiting, and no honest shop can quote the second
        number precisely before the car is apart.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">800–1,200</span>
          <span className="stat-l">Shop hours, typical driver-quality frame-off</span>
        </div>
        <div>
          <span className="stat-v">12–24 mo</span>
          <span className="stat-l">Typical frame-off calendar, traditionally built</span>
        </div>
        <div>
          <span className="stat-v">4,000–5,000</span>
          <span className="stat-l">Hours in a true concours build, per Hagerty</span>
        </div>
        <div>
          <span className="stat-v">Weeks</span>
          <span className="stat-l">An honest sorting allowance — not days</span>
        </div>
      </div>

      <h2>What happens in each stage?</h2>
      <p>
        A frame-off breaks into five stages, and their share of the hours is nothing like equal.
        The proportions below are for a typical driver-quality build; a rustier car tilts further
        toward metal, a show car tilts further toward paint.
      </p>
      <h3>Teardown — call it a tenth of the hours</h3>
      <p>
        Everything comes off and everything gets bagged, tagged, and photographed, because assembly
        two stages from now depends entirely on how disciplined teardown was. This is also where
        the truth about the car surfaces — the rust, the previous repairs, the missing pieces — and
        it is why a good shop puts a reassessment point right here, before the big money is
        committed. The <Link href="/builds/blue-project-shell">blue project shell</Link> on the
        builds page shows what that moment looks like: front clip off, assumptions replaced by
        facts. If the car has been sitting for years, the{" "}
        <Link href="/blog/barn-find-first-steps">wake-up protocol</Link> runs before teardown even
        starts — a seized engine changes the whole plan.
      </p>
      <h3>Metal and body — the biggest single share</h3>
      <p>
        A third or more of the hours on most cars, and the least visible work in the finished
        product. Rust cut out, new steel welded in, panels fitted and refitted until the gaps are
        right. Every hour here is an hour nobody will ever see, and it is the stage where the
        estimate moves most — because nobody knows what is under the paint until the paint is off.
      </p>
      <h3>Paint — a fifth, and most of it is prep</h3>
      <p>
        The spraying takes days. The preparation takes weeks: strip, prime, block, guide-coat,
        block again, until the panel is genuinely flat instead of shiny-over-wavy. Cure times are
        calendar, not labour — nobody can bill the hours primer spends hardening, but the car
        cannot move on without them. Hagerty&rsquo;s own guidance to first-time restorers is blunt
        about the whole undertaking: it takes weeks and months, not days.
        <a href="#src-3" className="cite-ref">[3]</a>
      </p>
      <h3>Assembly — a quarter, and the stage that lies to you</h3>
      <p>
        Assembly photographs beautifully. The car visibly gains parts every week — driveline in,
        glass in, wiring loomed, trim hung — and owners understandably read that as the home
        stretch. It is also the stage most hostage to lead times. Chrome at the plater, a
        windshield seal on backorder, one correct piece of trim somewhere in a warehouse: assembly
        stalls not for lack of hours but for lack of boxes, which is why the long-lead orders
        should have gone out back at teardown.
      </p>
      <h3>Sorting — the last tenth, and the one everyone skips</h3>
      <p>
        The shakedown stage. It matters enough to get its own section below.
      </p>

      <h2>Why do restorations go over schedule?</h2>
      <p>
        Three causes cover nearly every overrun this trade produces:
      </p>
      <ul>
        <li>
          <strong>Parts lead times.</strong> Plating commonly takes months, correct glass and
          orphan-make trim can take longer, and on a Canadian build most catalogue supply crosses
          the border — exchange, shipping, and customs all add days the schedule has to carry. The
          defence is ordering long-lead items at teardown, not when assembly needs them.
        </li>
        <li>
          <strong>What the paint was hiding.</strong> A restoration estimate is a set of
          assumptions, and teardown converts assumptions into facts. Rust in the floors, rockers,
          or frame that was invisible on inspection day adds real hours the moment it is found.
          This is not the shop padding the bill — it is the car telling the truth for the first
          time in decades.
        </li>
        <li>
          <strong>Decision latency.</strong> The quiet one. Colour, trim, budget approvals, which
          carburetor — every open question eventually stops the car, and a decision the owner sits
          on for two weeks costs the calendar two weeks. The shop controls the hours. The owner is
          on the critical path more often than either side realizes.
        </li>
      </ul>
      <blockquote>
        <p>The calendar is the price of doing it once.</p>
        <footer>Taped above the parts bench</footer>
      </blockquote>
      <p>
        Worth saying plainly: an overrun is not automatically a failure. A car that took four
        months longer because the metal was worse than anyone could see is a project that got done
        right. A shop that went quiet for four months is a different problem — the fix for that is
        in how the work is scheduled and communicated, below.
      </p>

      <h2>What is &ldquo;sorting&rdquo; and why can&rsquo;t it be skipped?</h2>
      <p>
        Sorting is the shakedown: the deliberate stage where a freshly assembled car gets driven,
        fixed, and driven again until it behaves like a finished one. Every fresh build has a
        hundred small faults — a weep at a fitting that only shows warm, fasteners that settle and
        want re-torquing, an alignment that changes as the suspension takes a set, a carburetor and
        ignition that need dialing on real roads, squeaks and rattles that only appear at speed.
        None of that is poor workmanship. It is what new assemblies do.
      </p>
      <p>
        Sorting gets skipped because it is the stage with no visible progress. The car looks done,
        the photos look done, everyone is tired, and the money is mostly spent. But a car delivered
        unsorted does not skip the debugging — it transfers it to the owner, one roadside surprise
        at a time, and it is how a good build earns a bad reputation. An honest schedule carries
        weeks of sorting, not days, and in Alberta it deserves real shakedown miles in decent
        weather — a car finished in the shop in February meets its sorting season in May.
      </p>

      <h2>Driver, show, or concours — how does the target move the timeline?</h2>
      <p>
        Same car, three clocks. A <strong>driver-quality</strong> build is finished to look right
        at ten feet and get driven hard — the 800-to-1,200-hour job in the table. A{" "}
        <strong>show-quality</strong> build is the same teardown with multiples of the finishing
        hours: block-sanding until panels are dead flat, the underside and engine bay finished to
        the same standard as the paint you can see, plating and detail everywhere.
      </p>
      <p>
        <strong>Concours</strong> is a different discipline again, because the standard stops being
        &ldquo;beautiful&rdquo; and becomes &ldquo;correct.&rdquo; Judging bodies like the National
        Corvette Restorers Society score cars against an as-manufactured standard — a deductive
        4,500-point sheet covering operations, interior, exterior, mechanical, and chassis, where
        the benchmark is how the car left the factory, right or wrong.
        <a href="#src-4" className="cite-ref">[4]</a> Research, correct parts, and documentation
        become hours in their own right, which is how the total climbs into Hagerty&rsquo;s
        4,000-to-5,000-hour territory.<a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        The schedule-killer is moving the target mid-build. Deciding at the paint stage that a
        driver build should really be a show build reopens metal work that was signed off months
        ago — the most expensive sentence in this trade starts with &ldquo;while it&rsquo;s
        apart, why don&rsquo;t we just.&rdquo; Pick the standard before teardown, in writing, and
        let the calendar be built around it.
      </p>

      <h2>How does a good shop schedule — and what can you do about the calendar?</h2>
      <p>
        From the shop, expect four things in writing: a scope that names the standard being built
        to, a teardown-and-reassess point before the large money is committed, long-lead parts
        ordered early rather than when the line stalls, and a steady rhythm of photo updates.
        Silence, not slippage, is the real red flag in this business. Around here the rhythm starts
        before the build does — photos in, and a scope, sequence, and honest range back inside two
        business days. How the work itself is structured is on the{" "}
        <Link href="/services/classic-car-restoration">restoration service page</Link>.
      </p>
      <p>
        From your side of the bench, the calendar levers are real: answer decisions quickly, fund
        each phase so the car never waits on money, put deposits on long-lead parts when the shop
        asks, and hold the target standard steady. An owner who does those four things routinely
        saves more calendar time than any shop can.
      </p>
      <p>
        The year is not the punishment. It is the method — teardown that tells the truth, metal
        done before paint, assembly that waits for the right parts, and sorting that catches the
        faults before you do. If you want to know what your car needs and how long it honestly
        takes, send photos through the <Link href="/quote">quote page</Link>. You will get scope,
        sequence, and a straight read on both the number and the calendar — inside two business
        days.
      </p>
    </>
  );
}
