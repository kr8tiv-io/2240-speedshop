import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * THE SHOP JOURNAL — The C10 & Square-Body Buyer's-and-Builder's Guide,
 * Alberta Edition. The classic-truck buying pillar. Links down into the
 * restoration and restomod service pages, the LS-swap cost article, the
 * restomod definition pillar, the blue shortbox build, and the costs guide.
 */

export const meta: ArticleMeta = {
  slug: "c10-square-body-alberta-guide",
  title: "The C10 & Square-Body Buyer's-and-Builder's Guide, Alberta Edition",
  accent: "Alberta",
  metaTitle: "C10 & Square-Body Buyer's Guide — Alberta Edition",
  description:
    "Which C10 generation to buy, where square-body Chevys rust first, what prairie trucks are actually worth, and how to source one in Alberta — from an Edmonton shop.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Buying & Building",
  targetKeywords: [
    "c10 restoration guide",
    "square body chevy buyers guide",
    "classic truck restoration edmonton",
    "best classic truck to restore",
  ],
  faq: [
    {
      q: "What is the best C10 generation to restore?",
      a: "For most builders, the 1967–72 Action Line: it has the strongest values, near-total reproduction parts support, and factory front disc brakes from 1971. The 1973–87 square-body is the best budget entry — cheapest to buy, longest production run, and the easiest platform to LS-swap. The 1960–66 trucks are the style pick, with a thinner aftermarket than the two generations that followed.",
    },
    {
      q: "Are square-body Chevys a good investment?",
      a: "Valuation data and auction results have trended up for years — restored square-bodies have crossed six figures at Barrett-Jackson, and clean drivers sell fast. But buy condition, not a chart. A rust-free truck bought right will hold its money; a rough one bought cheap consumes the difference in steel and labour long before the market matters.",
    },
    {
      q: "Where do square-bodies rust first?",
      a: "Windshield channel, cab corners, rockers, bed seams, wheel arches, and cab floors — in roughly that order of expense to fix. Early 1973–75 trucks are the worst because GM's rust protection improved through the run. Always pull the windshield trim area and press on the lower cab corners; shiny paint over filler is the standard trap.",
    },
    {
      q: "How much does a C10 restoration cost in Canada?",
      a: "A mechanical sort-out on a solid truck commonly lands in the $10,000 to $30,000 CAD range. A full body-off restoration typically runs $50,000 to $150,000 and up, and a ground-up restomod carries the same labour plus fabrication. Parts mostly cross the border, so exchange and shipping belong in the budget. These are planning ranges, not quotes.",
    },
    {
      q: "Can you LS-swap a square-body?",
      a: "Yes — it is one of the most LS-swapped platforms in existence. The engine bay was designed around a small-block V8, so a modern LS drops in with off-the-shelf mounts, crossmembers, and harnesses. Done properly, with cooling, fuel, wiring, and driveline sorted together, a complete swap typically runs $15,000 to $35,000 CAD.",
    },
  ],
  citations: [
    {
      name: "“Your definitive 1967–72 Chevrolet C/K pickup buyer's guide,” Hagerty",
      url: "https://www.hagerty.com/media/car-profiles/definitive-chevrolet-pickup-buyers-guide/",
    },
    {
      name: "“1973–87 Chevrolet/GMC Truck buyers guide,” Hagerty",
      url: "https://www.hagerty.com/media/buying-and-selling/1973-1987-chevrolet-gmc-truck-buyers-guide/",
    },
    {
      name: "“Parts for 1973–1987 Chevy & GMC Trucks,” LMC Truck",
      url: "https://www.lmctruck.com/chevy-gmc-truck-1973-1987",
    },
    {
      name: "“Chevrolet/GMC Truck Restoration: Your Ultimate Parts Guide,” Classic Industries",
      url: "https://news.classicindustries.com/chevrolet/gmc-truck-restoration-your-ultimate-parts-guide",
    },
    {
      name: "Chevrolet C10 past sales, Hagerty Valuation Tools",
      url: "https://www.hagerty.com/valuation-tools/chevrolet/c10",
    },
    {
      name: "“Is This the World's Most Expensive Square-Body Chevy?,” Hagerty Insider",
      url: "https://www.hagerty.com/media/market-trends/hagerty-insider/is-this-the-worlds-most-expensive-square-body-chevy/",
    },
  ],
  internalLinks: [
    "/services/classic-car-restoration",
    "/services/restomods-custom-builds",
    "/blog/ls-swap-cost-canada",
    "/blog/what-is-a-restomod",
    "/builds/blue-lowered-pickup",
    "/guides/costs",
    "/quote",
  ],
  readingMinutes: 11,
};

/**
 * The rust map: a 1973–87 square-body in steel line art, side profile, with
 * five numbered heat markers glowing ember-to-tungsten on the spots that eat
 * budgets — windshield channel, cab corners, rockers, bed seams, wheel
 * arches. Beneath it, a generation timeline strip scaled to the model years.
 * Editorial diagram on a transparent ground so the page grain reads through.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical rust-map diagram of a 1973–87 square-body Chevrolet pickup in side profile, with numbered heat markers on the windshield channel, cab corners, rockers, bed seams, and wheel arches, above a timeline strip of the three C10 generations"
      className="h-auto w-full"
    >
      <title>The rust map — where a square-body spends your budget first</title>
      <defs>
        <radialGradient id="c10-heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd9ad" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#ffb066" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="c10-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the truck */}
      <ellipse cx="600" cy="472" rx="460" ry="40" fill="url(#c10-pool)" />
      {/* ground */}
      <line x1="90" y1="470" x2="1110" y2="470" stroke="#9a9ca0" strokeOpacity="0.25" strokeWidth="1" />

      {/* ══ BODY OUTLINE — square-body side profile, nose right ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* rear valance → bed rail → cab back → roof → windshield → hood → nose → bumper → arches → rocker */}
        <path d="M 196 396 L 186 390 L 184 282 Q 184 274 194 274 L 552 274 L 558 270 L 564 274 L 576 274 L 586 202 Q 588 186 602 184 L 742 180 L 770 250 Q 773 258 782 259 L 802 261 L 998 268 Q 1012 269 1014 281 L 1017 338 L 1024 342 Q 1032 345 1032 353 L 1032 380 Q 1032 388 1022 388 L 1002 390 L 970 392 A 74 74 0 0 0 822 392 L 400 396 A 76 76 0 0 0 248 396 L 208 398 Z" />
        {/* cab side glass — one-piece square-body window */}
        <path d="M 598 240 L 604 200 Q 605 194 612 194 L 730 190 Q 737 190 740 196 L 758 242 Q 760 248 752 248 L 606 248 Q 597 248 598 240 Z" strokeWidth="1.4" strokeOpacity="0.8" />
        {/* door seams + handle */}
        <path d="M 776 260 L 768 392" strokeWidth="1.2" strokeOpacity="0.65" />
        <path d="M 610 250 L 602 394" strokeWidth="1.2" strokeOpacity="0.65" />
        <path d="M 632 288 L 654 288" strokeWidth="2" strokeOpacity="0.8" />
        {/* body side moulding line, broken at the cab-bed gap */}
        <path d="M 194 328 L 552 328" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M 580 328 L 764 330" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M 782 330 L 1006 333" strokeWidth="1" strokeOpacity="0.4" />
        {/* bed rail cap + front bed panel seam */}
        <path d="M 194 282 L 552 282" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M 470 284 L 468 392" strokeWidth="1" strokeOpacity="0.35" />
        {/* front marker light */}
        <rect x="994" y="294" width="14" height="7" rx="1.5" strokeWidth="1.1" strokeOpacity="0.6" />
      </g>

      {/* ══ WHEELS — period steel wheels, small caps ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        <circle cx="322" cy="416" r="54" strokeWidth="2" />
        <circle cx="322" cy="416" r="38" strokeWidth="1.2" strokeOpacity="0.7" />
        <circle cx="322" cy="416" r="20" strokeWidth="1.6" strokeOpacity="0.9" />
        <circle cx="322" cy="416" r="5" strokeWidth="1.4" />
        <circle cx="896" cy="416" r="54" strokeWidth="2" />
        <circle cx="896" cy="416" r="38" strokeWidth="1.2" strokeOpacity="0.7" />
        <circle cx="896" cy="416" r="20" strokeWidth="1.6" strokeOpacity="0.9" />
        <circle cx="896" cy="416" r="5" strokeWidth="1.4" />
      </g>

      {/* ══ HEAT SPOTS — the five places the budget goes ══ */}
      <g>
        {/* 01 windshield channel */}
        <circle cx="768" cy="248" r="30" fill="url(#c10-heat)" />
        <circle cx="768" cy="248" r="14" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="2.5 3.5" />
        {/* 02 cab corners */}
        <circle cx="592" cy="378" r="30" fill="url(#c10-heat)" />
        <circle cx="592" cy="378" r="14" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="2.5 3.5" />
        {/* 03 rockers */}
        <circle cx="706" cy="394" r="30" fill="url(#c10-heat)" />
        <circle cx="706" cy="394" r="14" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="2.5 3.5" />
        {/* 04 bed seams */}
        <circle cx="468" cy="362" r="30" fill="url(#c10-heat)" />
        <circle cx="468" cy="362" r="14" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="2.5 3.5" />
        {/* 05 wheel arches */}
        <circle cx="398" cy="404" r="30" fill="url(#c10-heat)" />
        <circle cx="398" cy="404" r="14" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="2.5 3.5" />
      </g>

      {/* numbered chips at each spot */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.08em">
        {[
          { x: 768, y: 248, n: "01" },
          { x: 592, y: 378, n: "02" },
          { x: 706, y: 394, n: "03" },
          { x: 468, y: 362, n: "04" },
          { x: 398, y: 404, n: "05" },
        ].map((s) => (
          <g key={s.n}>
            <circle cx={s.x} cy={s.y} r="9.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={s.x} y={s.y + 3.5} textAnchor="middle" fill="#ffd9ad">
              {s.n}
            </text>
          </g>
        ))}
      </g>

      {/* leaders */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 1104 156 L 790 238" />
        <path d="M 262 186 L 456 352" />
        <path d="M 214 430 L 386 408" />
        <path d="M 592 500 L 592 390" />
        <path d="M 806 504 L 714 406" />
      </g>

      {/* labels */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
      >
        <text x="1120" y="150" textAnchor="end" fill="#ffb066">
          01 · WINDSHIELD CHANNEL
        </text>
        <text x="90" y="180" fill="#ffb066">
          04 · BED SEAMS
        </text>
        <text x="90" y="440" fill="#ffb066">
          05 · ARCHES
        </text>
        <text x="592" y="518" textAnchor="middle" fill="#ffb066">
          02 · CAB CORNERS
        </text>
        <text x="828" y="518" fill="#ffb066">
          03 · ROCKERS
        </text>
        <text x="1120" y="440" textAnchor="end" fill="#9a9ca0" fillOpacity="0.6">
          READ THE STEEL FIRST
        </text>
      </g>

      {/* ══ GENERATION TIMELINE STRIP — widths scaled to model years ══ */}
      <line x1="150" y1="585" x2="1050" y2="585" stroke="#9a9ca0" strokeOpacity="0.25" strokeWidth="1" />
      <line x1="150" y1="585" x2="375" y2="585" stroke="#9a9ca0" strokeOpacity="0.7" strokeWidth="2" />
      <line x1="379" y1="585" x2="568" y2="585" stroke="#9a9ca0" strokeOpacity="0.7" strokeWidth="2" />
      <line x1="572" y1="585" x2="1050" y2="585" stroke="#ffb066" strokeWidth="2" />
      <g fill="#ffb066">
        <rect x="146" y="581" width="8" height="8" transform="rotate(45 150 585)" fillOpacity="0.55" />
        <rect x="373" y="581" width="8" height="8" transform="rotate(45 377 585)" fillOpacity="0.55" />
        <rect x="566" y="581" width="8" height="8" transform="rotate(45 570 585)" fillOpacity="0.9" />
        <rect x="1046" y="581" width="8" height="8" transform="rotate(45 1050 585)" fillOpacity="0.9" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
      >
        <text x="262" y="612" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.85">
          1960–66
        </text>
        <text x="473" y="612" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.85">
          1967–72 · ACTION LINE
        </text>
        <text x="811" y="612" textAnchor="middle" fill="#ffd9ad">
          1973–87 · SQUARE BODY
        </text>
        <text x="600" y="648" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.55">
          FIG. A — THE RUST MAP · THREE GENERATIONS, ONE PARTS SHELF
        </text>
      </g>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Buy a 1967–72 Chevy C10, or a 1973–87 square-body if the budget is tighter. Between them
        they carry the deepest parts support in the classic-truck world, the prairies are still
        full of honest examples, and a decade of auction results says values are moving one way.
        Here is how to buy one in Alberta without paying for someone else&rsquo;s mistakes.
      </p>

      <h2>Why are C10s and square-bodies the smart classic-truck buy?</h2>
      <p>
        Three reasons, in order: parts, supply, and trajectory. Hagerty&rsquo;s buyer&rsquo;s
        guides treat the 1967–72 C/K as one of the definitive collector trucks — the 1971 and
        1972 models, with their egg-crate grilles and factory front disc brakes, are the most
        sought-after of the run<a href="#src-1" className="cite-ref">[1]</a> — and the 1973–87
        square-body that followed is the value entry into the same story, with fifteen model
        years of production keeping supply deep and prices sane.
        <a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <p>
        The parts situation is the real argument. LMC Truck sells essentially the whole truck
        out of one catalogue — hoods, fenders, door shells, cab corners, and full bed sides in
        OE-gauge steel for the 1973–87 trucks<a href="#src-3" className="cite-ref">[3]</a> — and
        Classic Industries stocks restoration and performance parts across seven generations of
        GM pickups, from body panels down to gauge clusters and carpet kits.
        <a href="#src-4" className="cite-ref">[4]</a> No hunting swap meets for a windshield
        gasket. No paying machine-shop money for a bracket. On a C10 you order the part, and it
        shows up.
      </p>
      <p>
        Then there is where you live. These were the working trucks of the prairies, bought by
        the tens of thousands and parked behind shelterbelts when the next one arrived. Alberta
        and Saskatchewan are still two of the best hunting grounds on the continent for dry,
        straight cabs — a genuine sourcing advantage the coasts do not have.
      </p>

      <h2>Which C10 generation should you buy?</h2>
      <p>
        All three generations share the same logic — simple body-on-frame trucks with small-block
        power and enormous aftermarkets — but they buy very differently:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            The three classic C10 generations compared by years, character, parts support, and
            typical entry price from attributed sources
          </caption>
          <thead>
            <tr>
              <th scope="col">Generation</th>
              <th scope="col">Years</th>
              <th scope="col">Character</th>
              <th scope="col">Parts support</th>
              <th scope="col">Typical entry (attributed)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">First C/K</th>
              <td>1960–66</td>
              <td>The style pick. First C10 badge, jet-age dash, prized &rsquo;66 327 V8</td>
              <td>Good, but the thinnest of the three</td>
              <td className="num">Recent Hagerty sales US$22K–$55K for sorted trucks</td>
            </tr>
            <tr>
              <th scope="row">&ldquo;Action Line&rdquo;</th>
              <td>1967–72</td>
              <td>The blue-chip truck. Cleanest lines GM ever drew, discs from &rsquo;71</td>
              <td>Near-total reproduction coverage</td>
              <td className="num">Driver-grade from ~US$7,500 (six-cyl); recent sales US$18K–$46K</td>
            </tr>
            <tr>
              <th scope="row">&ldquo;Square body&rdquo;</th>
              <td>1973–87</td>
              <td>The builder&rsquo;s truck. Longest run, biggest cab, easiest LS swap</td>
              <td>The whole truck, from one catalogue</td>
              <td className="num">Cheapest entry of the three; restored examples to six figures</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The short version: buy a 1967–72 if the money allows, because it holds value hardest and
        every panel is reproduced. Buy a square-body if you want the most truck per dollar and a
        platform the aftermarket has fully solved. Buy a 1960–66 because you love the dash and
        the eyebrows over the wheel arches — a fine reason, entered with open eyes about the
        thinner parts shelf.
      </p>
      <p>
        Two footnotes worth money. First, the GMC twins — same trucks, different grilles and
        badges — routinely sell for less than their Chevrolet siblings while sharing the entire
        parts shelf, which makes a GMC 1500 the quiet value play in every generation. Second,
        box length: shortbox trucks carry a firm premium because that is the stance everyone
        wants, but longboxes are mechanically identical, far more common on the prairies, and
        priced accordingly. If the plan is a driver rather than a show truck, the longbox
        discount buys a lot of steel and brake parts.
      </p>

      <h2>What do you inspect before buying?</h2>
      <p>
        Steel first, drivetrain second, paper third. In that order, because the order of expense
        runs the same way.
      </p>
      <h3>The rust map</h3>
      <p>
        The illustration above is the checklist. Work the numbers with a flashlight, a magnet,
        and permission to press hard on painted metal — a seller who will not let you lift the
        mats or run a magnet along the rockers has answered your question already:
      </p>
      <ul>
        <li>
          <strong>Windshield channel.</strong> The square-body&rsquo;s signature failure. The
          glass seals trap water and the channel rots invisibly under the trim — by the time
          bubbles show at the corners, the cowl and dash lip are usually involved. Fixing it
          properly means glass out and steel let in.
        </li>
        <li>
          <strong>Cab corners and rockers.</strong> Mud and chaff pack into the lower cab from
          the inside, and Alberta&rsquo;s road salt does the rest. Both are reproduced cheaply
          in steel<a href="#src-3" className="cite-ref">[3]</a>; the labour to cut, fit, and
          weld them is where the money goes. Shiny paint over hard filler here is the single
          most common trick played on buyers.
        </li>
        <li>
          <strong>Bed seams and arches.</strong> Double-wall bed sides rust from between the
          walls, and the wheel-arch lips go first. Sight down the bed sides in low light — waves
          along the seams mean filler over perforation.
        </li>
        <li>
          <strong>Floors and hood.</strong> Lift the mats, every time. On square-bodies, check
          the hood ahead of the passenger-side hinge — early trucks were known to buckle there,
          and the earliest years rust worst overall, because GM&rsquo;s primers and galvanizing
          improved as the run went on.<a href="#src-2" className="cite-ref">[2]</a>
        </li>
      </ul>
      <h3>Drivetrain and paper</h3>
      <p>
        The mechanicals are the easy half. Small-block Chevys and their three- and four-speed
        transmissions are cheap to rebuild and impossible to mystify, so a tired engine should
        discount the price, not kill the deal. What should worry you more is evidence of a hard
        working life: a sagging frame over the rear axle, wallowed-out spring hangers, a
        driveline that clunks under load. A grain truck that spent thirty harvests overloaded
        wears it in the metal.
      </p>
      <p>
        Then the paper. Confirm the VIN plate matches the registration before money moves, and
        be alert on trucks of this age — cabs get swapped, and a truck wearing a different
        cab&rsquo;s identity is a paperwork problem you inherit. If the truck is coming in from
        Saskatchewan or B.C., budget the time and cost of an out-of-province inspection before
        it goes on Alberta plates.
      </p>

      <h2>What is the prairie-truck advantage — and where are its hidden traps?</h2>
      <p>
        A dry-province truck is a real thing. Sheet metal that spent decades in a pole shed near
        Hanna carries less rust than anything the same age from Ontario or the coast, and it is
        why buyers from out of province hunt here. Kijiji Alberta, farm dispersal auctions, and
        the classic rural driveway conversation still surface trucks that were parked, not
        wrecked — often with the original paperwork in the glovebox.
      </p>
      <p>
        Timing matters here too. The prairie selling season runs opposite to the buying
        appetite: trucks surface in spring when sheds get cleaned out and estates get settled,
        and asking prices firm up in June when every buyer wants to drive one that summer. The
        patient move is to shop in October through February, when a project truck is one more
        thing to shovel around and sellers answer their phones. Winter viewing has its own
        advantage — no leaves on the trees, no long grass around the sills, and frost lines on
        the steel that show you exactly where moisture lives.
      </p>
      <blockquote>
        <p>
          A prairie truck rusts less and works harder. You are trading body rot for wear, and
          wear is the better deal — if you price it in.
        </p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>
      <p>
        The traps are specific. Farm trucks were tools: overloaded, run on gravel that
        sandblasts the rockers and arches from below, and parked in tree lines where mice moved
        into the cab and the brake lines rusted from the inside. Calcium chloride on secondary
        highways writes the same story salt does, just slower. And a truck that &ldquo;ran when
        parked&rdquo; fifteen years ago needs a proper wake-up, not a jump pack. None of this is
        disqualifying — it is all just work that belongs in the price you offer, which is
        exactly the kind of scope-reading that a{" "}
        <Link href="/services/classic-car-restoration">restoration shop</Link> does before a
        dollar is committed.
      </p>

      <h2>Should you keep it stock or restomod it?</h2>
      <p>
        Run the same test we apply to every truck through the door: is it rare, documented, or
        original enough that the market pays for preservation? A factory big-block Cheyenne
        Super or a documented low-mile survivor deserves the pause. The other ninety-five
        percent — six-cylinder longboxes, work-grade Customs, trucks on their third repaint —
        are honest raw material, and building one costs originality that nobody was paying for
        anyway.
      </p>
      <p>
        The full argument for what a restomod is and when it makes sense is in{" "}
        <Link href="/blog/what-is-a-restomod">the restomod guide</Link>, but the C10-specific
        version is short: these trucks take modern running gear more gracefully than almost any
        classic. The <Link href="/builds/blue-lowered-pickup">blue lowered shortbox</Link> on
        our builds page is the proof — stance, fitment, and panel gaps solved as one problem,
        classic skin over a modern spine. That is the standard of{" "}
        <Link href="/services/restomods-custom-builds">restomod work</Link> a C10 rewards,
        because the aftermarket has already engineered the hard parts.
      </p>

      <h2>Can you LS-swap a square-body?</h2>
      <p>
        Yes — the square-body may be the most LS-swapped vehicle in existence. The engine bay
        was drawn around a small-block V8, so a modern LS sits where GM always intended an
        engine to sit, and mounts, crossmembers, oil pans, and harnesses are all off-the-shelf.
        For an Alberta truck the payoff is blunt: fuel injection that starts at minus thirty and
        an overdrive that makes the Yellowhead a normal place to be. What the swap actually
        costs in Canadian dollars, line by line, is covered in{" "}
        <Link href="/blog/ls-swap-cost-canada">the LS-swap cost guide</Link>.
      </p>

      <h2>What are they actually worth?</h2>
      <p>
        Attributed numbers, not hopes. Hagerty&rsquo;s 1967–72 guide puts a driver-quality
        &rsquo;67 six-cylinder around US$7,500, with a V8 only a couple of thousand more
        <a href="#src-1" className="cite-ref">[1]</a> — while its recent past-sales listings show
        finished trucks from that generation trading between roughly US$18,000 and US$46,000,
        and sorted 1960–66 trucks between about US$22,000 and US$55,000.
        <a href="#src-5" className="cite-ref">[5]</a> Square-bodies start lower — Hagerty&rsquo;s
        guide pegged an average-condition truck in the high single digits, in US dollars, when
        it was written<a href="#src-2" className="cite-ref">[2]</a> — but the ceiling has moved:
        restored examples have crossed six figures at Barrett-Jackson, including a 1979 K10 at
        US$165,000 and a 1989 K5 Blazer at US$154,000.
        <a href="#src-6" className="cite-ref">[6]</a>
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">~US$7.5K</span>
          <span className="stat-l">Driver-grade &rsquo;67 six-cylinder, per Hagerty&rsquo;s guide</span>
        </div>
        <div>
          <span className="stat-v">US$18K–$46K</span>
          <span className="stat-l">Recent 1967–72 C10 past sales, Hagerty listings</span>
        </div>
        <div>
          <span className="stat-v">US$165K</span>
          <span className="stat-l">Restored &rsquo;79 K10 at Barrett-Jackson, per Hagerty Insider</span>
        </div>
        <div>
          <span className="stat-v">15 years</span>
          <span className="stat-l">Square-body production run — the supply that keeps entry cheap</span>
        </div>
      </div>
      <p>
        Two Canadian footnotes on those figures. They are US-dollar numbers, so the exchange
        rate belongs in your budget before the truck does — and so do shipping and duty on
        parts, because most of that deep aftermarket ships from the States. And the market
        rewards condition, not year: the money you save buying rough gets spent again, with
        interest, in steel and hours. The honest arithmetic of where those hours go is laid out
        in the <Link href="/guides/costs">restoration cost guide</Link>.
      </p>
      <p>
        If you are circling a truck right now — a Kijiji find, a family longbox, a square-body
        that has been waiting behind the shop since the nineties — send photos of the seams, the
        floors, and the windshield corners through the <Link href="/quote">quote page</Link>.
        You will get a straight read on what the steel says, what it typically costs to answer,
        and whether that particular truck deserves it. Sometimes the best money you spend on a
        C10 is the price of walking away from the wrong one.
      </p>
    </>
  );
}
