import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Classic Interior Restoration Cost, Canada.
 * Seats, headliner, carpets, Alberta: hedged CAD ranges and the labour that
 * actually moves the number. Links down into interiors service, restoration
 * cost, restoration timeline, costs guide, and quote.
 */

export const meta: ArticleMeta = {
  slug: "classic-interior-restoration-cost-canada",
  title: "Classic Interior Restoration Cost in Canada: Seats, Headliner, Carpets",
  accent: "Interior",
  metaTitle: "Classic Interior Restoration Cost",
  description: "Typical CAD ranges for seats, headliner, and carpets on a classic in Alberta — what a driver interior costs, what show work costs, and where the hours hide.",
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  author: "2240 Speed Shop",
  category: "Costs & Pricing",
  targetKeywords: [
    "classic car interior restoration cost Canada",
    "classic car upholstery Edmonton",
    "headliner replacement classic car cost",
    "classic car carpet replacement",
    "seat restoration classic car Alberta",
  ],
  faq: [
    {
      q: "How much does a classic car interior restoration cost in Canada?",
      a: "A driver-quality refresh on a common 1960s or 1970s classic — seats recovered, new carpet, a headliner that is not on your head — typically lands in the $4,000 to $12,000 CAD range. Show-level or leather-everywhere work commonly runs $12,000 to $30,000 or more. Seats alone typically run $1,500 to $4,500 a pair, a headliner $400 to $1,200, carpets $600 to $1,800. Every figure is a planning range, not a quote.",
    },
    {
      q: "What is the most expensive part of a classic interior?",
      a: "The seats, if they need new foam, new listing wires, and period-correct covers sewn rather than a mail-order slip-on. A pair of buckets done properly is skilled labour billed by the hour, and the covers are only the visible third of the job. A dash pad, a set of door panels with broken welting, or a convertible top can overtake the seats. The headliner looks dramatic and is usually not the budget-breaker — unless the bows are rusted and the skin has been glued to a collapsing board.",
    },
    {
      q: "Can I just replace the covers and skip the foam?",
      a: "You can, and you will feel it in an hour. Sixty-year-old foam has compressed, crumbled, or turned to dust, and a new cover over dead foam looks tight for a week and then bags. The honest seat job is foam, burlap or insulator, listing wires, and then the cover. Skip the structure and you are buying the cover twice.",
    },
    {
      q: "Does Alberta sun and cold wreck interiors faster?",
      a: "Yes, in two directions. Prairie UV through a parked windshield cooks dash pads and fades vinyl on the window-adjacent bolsters. Then the cold makes what is left brittle, so a dash that still looked intact in July cracks when someone leans on it in January. Heated storage helps the materials; it does not undo UV that already happened. A dash pad is cheaper than a dashboard.",
    },
    {
      q: "Should I restore the interior before or after paint?",
      a: "After. Paint overspray, block-sanding dust, and the number of times a door gets opened during bodywork will ruin new carpet and a new headliner. The interior comes out for paint, gets bagged, and goes back in when the shell is a car again. The exception is a rolling restoration that will not see a booth — then do the seats you sit in, and leave the carpets until the floors are finished rust work.",
    },
  ],
  citations: [
    {
      name: "“8 Tips for Disassembling Aging Interiors,” Hagerty Media",
      url: "https://www.hagerty.com/media/maintenance-and-tech/8-tips-for-disassembling-aging-interiors/",
    },
    {
      name: "“How Much Does it Cost to Restore a Classic Car?,” Hagerty",
      url: "https://www.hagerty.com/resources/car-restoration/how-much-does-it-cost-to-restore-a-classic-car",
    },
    {
      name: "Benjamin Hunting, “Upgrading my ’87 Grand Wagoneer’s headliner was a mixed success,” Hagerty Media",
      url: "https://www.hagerty.com/media/maintenance-and-tech/i-tried-to-touch-the-future-with-my-jeep-grand-wagoneers-headlinerand-failed/",
    },
    {
      name: "“Repair estimates and authorizations: what you need to know,” Alberta Motor Vehicle Industry Council",
      url: "https://www.amvic.org/repair-estimates-and-authorizations-what-you-need-to-know/",
    },
    {
      name: "“Reducing the risk of hantavirus,” Government of Alberta",
      url: "https://www.alberta.ca/reducing-the-risk-of-hantavirus",
    },
  ],
  internalLinks: [
    "/services/classic-interiors-service",
    "/blog/classic-car-restoration-cost-canada",
    "/blog/classic-car-restoration-timeline",
    "/guides/costs",
    "/quote",
  ],
  readingMinutes: 8,
};

/**
 * Exploded cabin in steel line art: headliner lifting off, a seat pulled
 * forward with foam layers visible, carpet rolled back from a floor pan.
 * Three tungsten CAD chips. Editorial diagram of where interior money goes.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Exploded technical diagram of a classic car cabin: a headliner lifting off its bows, a seat pulled forward with foam layers visible, and carpet rolled back from a floor pan, each labelled with a typical Canadian-dollar planning range"
      className="h-auto w-full"
    >
      <title>Seats, headliner, carpets — three bills, one cabin</title>
      <defs>
        <radialGradient id="ir-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="600" cy="560" rx="380" ry="30" fill="url(#ir-pool)" />

      {/* cabin outline */}
      <path
        d="M 220 430 L 240 260 Q 248 210 320 190 L 880 190 Q 952 210 960 260 L 980 430 L 940 470 L 260 470 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* windshield / back glass hints */}
      <path d="M 320 190 L 380 260 L 820 260 L 880 190" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.55" />
      <line x1="260" y1="430" x2="940" y2="430" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" />

      {/* headliner lifted */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 340 120 Q 600 88 860 120" />
        <path d="M 340 120 Q 360 150 380 170" strokeWidth="1.1" strokeOpacity="0.7" />
        <path d="M 860 120 Q 840 150 820 170" strokeWidth="1.1" strokeOpacity="0.7" />
        {/* bows */}
        <path d="M 400 128 Q 600 108 800 128" strokeWidth="1.1" strokeOpacity="0.6" />
        <path d="M 420 140 Q 600 122 780 140" strokeWidth="1.1" strokeOpacity="0.45" />
      </g>

      {/* seat */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M 430 390 L 430 320 L 560 320 L 560 390" />
        <path d="M 430 390 L 400 430 L 590 430 L 560 390" />
        <path d="M 430 320 L 410 250 L 540 250 L 560 320" />
      </g>
      {/* foam layers in tungsten */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.3">
        <path d="M 438 338 L 552 338" />
        <path d="M 438 352 L 552 352" strokeOpacity="0.7" />
        <path d="M 438 366 L 552 366" strokeOpacity="0.5" />
      </g>

      {/* carpet rolled */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.5" strokeLinecap="round">
        <path d="M 640 448 Q 720 430 800 448 L 800 468 L 640 468 Z" />
        <path d="M 800 448 Q 860 420 900 390" />
        <ellipse cx="910" cy="382" rx="22" ry="10" />
      </g>
      {/* floor pan ribs */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.45" fill="none">
        <line x1="640" y1="448" x2="900" y2="448" />
        <line x1="660" y1="438" x2="660" y2="448" />
        <line x1="720" y1="438" x2="720" y2="448" />
        <line x1="780" y1="438" x2="780" y2="448" />
      </g>

      {/* dash pad */}
      <path d="M 300 268 L 880 268 L 860 300 L 320 300 Z" fill="none" stroke="#9a9ca0" strokeWidth="1.3" strokeOpacity="0.6" />

      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 80 120 L 400 128" />
        <path d="M 80 340 L 438 352" />
        <path d="M 80 470 L 640 448" />
        <path d="M 1160 268 L 880 268" />
      </g>

      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 400, y: 128, n: "1" },
          { x: 438, y: 352, n: "2" },
          { x: 640, y: 448, n: "3" },
          { x: 880, y: 268, n: "4" },
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
        <text x="40" y="124" fill="#ffb066">
          1 · HEADLINER + BOWS · $400–$1,200
        </text>
        <text x="40" y="344" fill="#ffb066">
          2 · SEATS, FOAM, COVERS · $1,500–$4,500
        </text>
        <text x="40" y="474" fill="#ffb066">
          3 · CARPETS · $600–$1,800
        </text>
        <text x="1160" y="272" textAnchor="end" fill="#ffb066">
          4 · DASH PAD — UV, THEN COLD
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
        FIG. A — SEATS, HEADLINER, CARPETS: THREE BILLS, ONE CABIN
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        A driver-quality interior on a common classic typically lands in the $4,000 to $12,000 CAD
        range — seats, carpet, a headliner that stays up. Show-level or leather work commonly runs
        $12,000 to $30,000 or more. Seats are the expensive line. All figures are planning ranges,
        not quotes, and Alberta UV plus cold is why dash pads fail twice.
      </p>

      <h2>What does a classic interior restoration actually include?</h2>
      <p>
        The cabin is a stack of trades. Upholstery, carpet, headliner, door panels, dash pad,
        kick panels, and the insulation nobody photographs. Hagerty is right that interiors are
        ground zero for parts that were assembled once and never meant to come apart — brittle
        clips, hidden screws, welting that tears if you look at it.
        <a href="#src-1" className="cite-ref">[1]</a> Taking it down without destroying what you
        wanted to save is the first bill. Putting it back so doors close on new panels is the
        second.
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Classic interior restoration line items with typical CAD planning ranges and what
            moves the number
          </caption>
          <thead>
            <tr>
              <th scope="col">Line</th>
              <th scope="col">Typical CAD range</th>
              <th scope="col">What moves it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Seats, pair</th>
              <td className="num">$1,500 – $4,500</td>
              <td>Foam, listing wires, period covers vs. custom leather</td>
            </tr>
            <tr>
              <th scope="row">Headliner</th>
              <td className="num">$400 – $1,200</td>
              <td>Bows rusted, glued board vs. sewn skin</td>
            </tr>
            <tr>
              <th scope="row">Carpets</th>
              <td className="num">$600 – $1,800</td>
              <td>Molded kit vs. cut-pile, insulation, trans tunnel fit</td>
            </tr>
            <tr>
              <th scope="row">Door panels</th>
              <td className="num">$400 – $1,600</td>
              <td>Repro cards vs. rebuilt originals, welting, hardware</td>
            </tr>
            <tr>
              <th scope="row">Dash pad</th>
              <td className="num">$300 – $1,200</td>
              <td>Cover vs. reproduction pad, cracks from UV then cold</td>
            </tr>
            <tr>
              <th scope="row">Driver interior, complete</th>
              <td className="num">$4,000 – $12,000</td>
              <td>Common 1960s–70s car, kit-based, no custom leather</td>
            </tr>
            <tr>
              <th scope="row">Show / leather</th>
              <td className="num">$12,000 – $30,000+</td>
              <td>Hides, stitching, dash, console, every visible surface</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Hagerty&rsquo;s restoration-cost writing is the same warning we give on metal: labour is
        the bill, and nobody&rsquo;s major restoration is cheap.
        <a href="#src-2" className="cite-ref">[2]</a> Interior labour is slower than it looks
        because every clip is unique and every mistake is visible from the driver&rsquo;s seat.
      </p>

      <h2>Where do the hours actually go?</h2>
      <p>
        Seats. A cover kit is a few hundred dollars. The hours are in tearing down to the frame,
        blasting or painting the seat frame, replacing foam that has the structural integrity of
        a digestive biscuit, hog-ringing listing wires so the cover sits on the intended crease,
        and stretching vinyl so it does not bag in July. Skip the foam and the new cover looks
        like a bedsheet in a month.
      </p>
      <p>
        Headliners fail in public, so they get over-feared. A sewn-in skin on bows is a known
        job on a common classic; a sagging glued board in a later car is a different job, and
        Hagerty&rsquo;s own headliner experiments are a useful warning that &ldquo;flat panel,
        close enough&rdquo; is how you buy wind noise and a gap at the glass.
        <a href="#src-3" className="cite-ref">[3]</a> Carpets are honest: a molded kit fits or it
        does not, and the hours are in insulation, the trans tunnel, and not covering a wet floor
        pan.
      </p>
      <blockquote>
        <p>
          New carpet over a rusty floor is a gift-wrap job. Do the metal first, or you are
          wrapping a problem you will smell in April.
        </p>
        <footer>Trim bay, every time a carpet kit arrives early</footer>
      </blockquote>

      <h2>What does Alberta do to an interior?</h2>
      <p>
        UV through a parked windshield cooks the dash pad and the window-adjacent bolsters. Then
        January makes the same vinyl brittle, so a pad that survived summer cracks when a glove
        hits it. Heated storage is kinder to materials; it is also where mice move in. Alberta
        health guidance on hantavirus is not optional here — deer mice nest in headliners and
        carpet underlay, and you do not sweep that out.
        <a href="#src-5" className="cite-ref">[5]</a> Enzyme clean, bag, replace. Do not vacuum dry
        droppings.
      </p>
      <p>
        That is why this shop&rsquo;s{" "}
        <Link href="/services/classic-interiors-service">interiors and classic service</Link>{" "}
        treats the cabin as part of the car&rsquo;s climate, not a furniture job. Period-correct
        where it shows, modern foam and insulation where you sit for four hours.
      </p>

      <h2>When should the interior happen in a restoration?</h2>
      <p>
        After paint, after the floors are metal-finished, and after the glass is in. The{" "}
        <Link href="/blog/classic-car-restoration-timeline">restoration timeline</Link> puts trim
        at the end for a reason: overspray and dust will ruin new cloth, and a door that is still
        being fitted will crease a new panel. On a rolling restoration, do the seats you sit in
        and leave the carpets until rust work on the floors is done. Alberta&rsquo;s estimate
        rules still apply — a licensed shop is held to a written estimate — so interiors get
        quoted as their own stage, with the next stage priced when the last one has told the
        truth.
        <a href="#src-4" className="cite-ref">[4]</a>
      </p>
      <p>
        The rest of the money map is the{" "}
        <Link href="/blog/classic-car-restoration-cost-canada">stage-by-stage restoration cost</Link>{" "}
        piece and the <Link href="/guides/costs">costs guide</Link>. If the cabin is the reason
        the car is coming in, send photos of the seats, the headliner, and the floors — floors
        especially — through the <Link href="/quote">quote page</Link>. A pretty cabin on a rusty
        pan is the wrong sequence, and we will say so.
      </p>
    </>
  );
}
