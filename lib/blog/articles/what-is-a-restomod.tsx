import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 01 — What Is a Restomod?
 * The definitive-guide pillar for the restomod keyword cluster. Links down
 * into the restomod service page, two build case studies, and the costs guide.
 */

export const meta: ArticleMeta = {
  slug: "what-is-a-restomod",
  title:
    "What Is a Restomod? The Definitive Guide — With Real Builds from an Edmonton Shop",
  accent: "Restomod",
  metaTitle: "What Is a Restomod? The Definitive Guide From an Edmonton Shop",
  description:
    "What a restomod actually is, how it differs from a restoration, what one typically costs in CAD, and what the market says about value — explained from the floor of an Edmonton customs shop.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Restomods",
  targetKeywords: [
    "what is a restomod",
    "restomod meaning",
    "restomod vs restoration",
    "restomod cost Canada",
    "restomod Edmonton",
  ],
  faq: [
    {
      q: "What is the difference between a restomod and a restoration?",
      a: "A restoration returns a car to the way it left the factory — original drivetrain, original finishes, correct parts. A restomod keeps the classic body and character but replaces the engineering underneath with modern components: engine, transmission, brakes, suspension, and wiring. Restoration preserves history. A restomod preserves the look and upgrades everything you feel.",
    },
    {
      q: "How much does a restomod cost in Canada?",
      a: "A serious ground-up restomod typically runs $80,000 to $250,000 and up in Canadian dollars, because it carries a restoration's labour bill plus fabrication and integration hours. Partial restomod work is far cheaper: a disc brake conversion commonly lands in the $2,500 to $6,000 CAD range, and a complete LS or diesel conversion done properly typically runs $15,000 to $35,000. All of these are planning ranges, not quotes.",
    },
    {
      q: "Does restomodding hurt a classic car's value?",
      a: "For common models, current auction results say no — well-built restomods have consistently sold for more than comparable stock or factory-restored examples. For rare, documented, numbers-matching cars, originality is the value, and modification can erase it. Decide which kind of car you have before anything gets cut.",
    },
    {
      q: "What is the most common restomod engine swap?",
      a: "The GM LS family of V8s is the default, because it is compact, light for its output, supported by a huge aftermarket of mounts and kits, and reliable enough to start at minus thirty. Ford Coyote swaps and diesel conversions are common alternatives. The engine itself is the easy part — mounts, cooling, fuel, wiring, and driveline integration are the actual job.",
    },
    {
      q: "How long does a restomod build take?",
      a: "A full ground-up restomod at a working shop typically takes twelve to twenty-four months. The spread comes from scope, parts lead times, and how much fabrication the plan calls for. Phased builds — brakes and suspension one season, drivetrain the next — stretch longer but keep the car drivable between stages.",
    },
  ],
  citations: [
    {
      name: "Rick Carey, “For These Corvettes, the Stock vs. Modified Debate Has a Clear Winner,” Hagerty Insider, February 2024",
      url: "https://www.hagerty.com/media/market-trends/hagerty-insider/c2-stock-v-restomod/",
    },
    {
      name: "Jeff Peek, “SEMA Says Restomods Are Attracting Younger Classic Car Enthusiasts,” Hagerty, March 2021",
      url: "https://www.hagerty.com/media/news/sema-says-restomods-are-attracting-younger-classic-car-enthusiasts/",
    },
    {
      name: "“Why Do We Care So Much About Originality?,” Hagerty Insider",
      url: "https://www.hagerty.com/media/market-trends/hagerty-insider/originality-or-modified/",
    },
    {
      name: "“Restomods: The Future of Classics?,” Hagerty UK",
      url: "https://www.hagerty.co.uk/articles/restomods-the-future-of-classics/",
    },
  ],
  internalLinks: [
    "/services/restomods-custom-builds",
    "/builds/blue-lowered-pickup",
    "/builds/red-stepside-pickup",
    "/guides/costs",
    "/quote",
  ],
  readingMinutes: 10,
};

/**
 * Split-view pickup: left of the seam, period line art in steel — right of
 * the seam, the same truck x-rayed, modern drivetrain drawn in tungsten.
 * Editorial diagram, not clipart. All strokes on a transparent ground so the
 * page's dark panel and grain read through.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 620"
      role="img"
      aria-label="Technical split-view diagram of a classic pickup truck: the left half drawn as period line art, the right half x-rayed to reveal a modern engine, overdrive driveline, coil-over suspension, and disc brakes highlighted in tungsten orange"
      className="h-auto w-full"
    >
      <title>The restomod equation — period sheet metal over a modern spine</title>
      <defs>
        <radialGradient id="rm-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rm-seam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a9ca0" stopOpacity="0" />
          <stop offset="18%" stopColor="#9a9ca0" stopOpacity="0.5" />
          <stop offset="82%" stopColor="#9a9ca0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9a9ca0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* pool of light under the truck */}
      <ellipse cx="600" cy="524" rx="470" ry="46" fill="url(#rm-pool)" />
      {/* ground */}
      <line x1="90" y1="520" x2="1110" y2="520" stroke="#9a9ca0" strokeOpacity="0.25" strokeWidth="1" />

      {/* ══ BODY OUTLINE — one truck across both halves ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* profile: rear bumper → bed rail → cab → hood → nose → bumper → arches → rocker */}
        <path d="M 170 428 L 162 420 L 160 312 Q 160 300 172 298 L 556 298 L 562 294 L 568 298 L 576 298 L 582 236 Q 584 222 592 214 Q 598 206 610 204 L 700 200 Q 712 200 718 208 L 748 252 L 756 258 L 800 262 Q 870 266 930 272 L 958 276 Q 984 280 990 296 L 998 318 L 1002 356 Q 1004 374 996 380 L 1010 384 Q 1022 388 1022 400 L 1022 410 Q 1022 418 1012 419 L 980 421 L 978 420 A 80 80 0 0 0 822 420 L 700 424 L 688 414 L 618 414 L 606 424 L 398 420 A 80 80 0 0 0 242 420 L 200 424 Z" />
        {/* cab side glass */}
        <path d="M 596 244 L 600 218 Q 601 212 608 212 L 694 209 Q 700 209 704 214 L 726 246 Q 729 251 722 251 L 602 251 Q 595 251 596 244 Z" strokeWidth="1.4" strokeOpacity="0.8" />
        {/* door seam + handle */}
        <path d="M 744 258 L 738 418" strokeWidth="1.2" strokeOpacity="0.65" />
        <path d="M 712 268 L 730 268" strokeWidth="2" strokeOpacity="0.8" />
        {/* bed rail cap + stepside fender hint */}
        <path d="M 172 306 L 552 306" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M 402 420 A 84 84 0 0 0 238 420" strokeWidth="1.2" strokeOpacity="0.5" />
      </g>

      {/* ══ REAR WHEEL — period steel wheel, hubcap, whitewall ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        <circle cx="320" cy="462" r="58" strokeWidth="2" />
        <circle cx="320" cy="462" r="42" strokeWidth="1.2" strokeOpacity="0.7" />
        <circle cx="320" cy="462" r="24" strokeWidth="1.6" strokeOpacity="0.9" />
        <circle cx="320" cy="462" r="5" strokeWidth="1.4" />
      </g>

      {/* ══ FRONT WHEEL — x-ray: rotor, caliper, five spokes ══ */}
      <g fill="none" strokeLinecap="round">
        <circle cx="900" cy="462" r="58" stroke="#9a9ca0" strokeWidth="2" strokeOpacity="0.55" />
        <circle cx="900" cy="462" r="33" stroke="#ffb066" strokeWidth="1.6" />
        <circle cx="900" cy="462" r="27" stroke="#ffb066" strokeWidth="0.8" strokeOpacity="0.55" strokeDasharray="2 4" />
        <circle cx="900" cy="462" r="9" stroke="#ffb066" strokeWidth="1.4" />
        {/* caliper astride the rotor, upper rear quadrant */}
        <path d="M 872 434 A 39 39 0 0 1 903 423" stroke="#ffd9ad" strokeWidth="6" strokeOpacity="0.95" />
        {/* spokes */}
        <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6">
          <line x1="900" y1="453" x2="900" y2="431" />
          <line x1="908.6" y1="459.2" x2="929.5" y2="452.4" />
          <line x1="905.3" y1="469.3" x2="918.2" y2="487.1" />
          <line x1="894.7" y1="469.3" x2="881.8" y2="487.1" />
          <line x1="891.4" y1="459.2" x2="870.5" y2="452.4" />
        </g>
      </g>

      {/* ══ THE SEAM ══ */}
      <line x1="600" y1="86" x2="600" y2="560" stroke="url(#rm-seam)" strokeWidth="1" strokeDasharray="6 7" />
      <rect x="596" y="82" width="8" height="8" transform="rotate(45 600 86)" fill="#ffb066" fillOpacity="0.9" />

      {/* ══ X-RAY DRIVETRAIN — tungsten, right of the seam ══ */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {/* engine block + valve cover */}
        <rect x="735" y="322" width="130" height="70" rx="5" />
        <rect x="745" y="302" width="110" height="20" rx="4" />
        {/* coil ticks on the valve cover */}
        <g strokeWidth="1.1" strokeOpacity="0.8">
          <line x1="765" y1="302" x2="765" y2="295" />
          <line x1="790" y1="302" x2="790" y2="295" />
          <line x1="815" y1="302" x2="815" y2="295" />
          <line x1="840" y1="302" x2="840" y2="295" />
        </g>
        {/* intake runner toward the nose */}
        <path d="M 865 314 Q 912 308 946 324" strokeWidth="1.2" strokeOpacity="0.8" />
        {/* transmission tapering rearward */}
        <path d="M 735 340 L 668 348 L 645 358 L 645 380 L 668 388 L 735 388" />
        {/* driveshaft — solid to the seam, ghosted past it */}
        <line x1="645" y1="369" x2="600" y2="384" strokeWidth="2" />
        <line x1="600" y1="384" x2="352" y2="446" strokeWidth="2" strokeOpacity="0.32" strokeDasharray="8 7" />
        {/* rear differential, ghosted on the period side */}
        <circle cx="320" cy="462" r="16" strokeOpacity="0.32" strokeDasharray="5 5" />
        {/* coil-over above the front axle */}
        <polyline points="900,336 888,344 912,352 888,360 912,368 888,376 912,384 900,392" strokeWidth="1.3" />
        <line x1="900" y1="322" x2="900" y2="336" strokeWidth="1.3" />
        <line x1="900" y1="392" x2="900" y2="404" strokeWidth="1.3" />
        {/* exhaust — solid on the modern side, ghosted forward of the seam */}
        <path d="M 792 392 L 802 434 L 812 446 L 610 446" strokeWidth="1.2" />
        <path d="M 600 446 L 517 446" strokeWidth="1.2" strokeOpacity="0.32" strokeDasharray="7 6" />
        <rect x="447" y="438" width="70" height="17" rx="8" strokeOpacity="0.32" strokeDasharray="6 5" />
        <path d="M 447 446 L 205 446" strokeWidth="1.2" strokeOpacity="0.32" strokeDasharray="7 6" />
        {/* fuel tank ghost under the bed + feed line */}
        <rect x="405" y="386" width="100" height="30" rx="8" strokeOpacity="0.32" strokeDasharray="6 5" />
        <path d="M 505 400 L 600 400" strokeWidth="1" strokeOpacity="0.32" strokeDasharray="2 5" />
        <path d="M 600 400 L 700 400 Q 722 400 730 386" strokeWidth="1" strokeOpacity="0.8" strokeDasharray="2 5" />
      </g>

      {/* ══ LEADERS + LABELS ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5">
        <path d="M 820 158 L 820 296" />
        <path d="M 1040 262 L 916 350" />
        <path d="M 1040 332 L 938 442" />
        <path d="M 636 486 L 652 392" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.5">
        <path d="M 342 244 L 420 292" />
        <path d="M 296 556 L 314 524" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
      >
        {/* seam headers */}
        <text x="580" y="108" textAnchor="end" fill="#9a9ca0" fillOpacity="0.85">
          AS DELIVERED · PERIOD STEEL
        </text>
        <text x="620" y="108" fill="#ffb066">
          AS BUILT · MODERN SPINE
        </text>
        {/* tungsten labels */}
        <text x="820" y="148" textAnchor="middle" fill="#ffb066">
          EFI CRATE V8
        </text>
        <text x="1150" y="256" textAnchor="end" fill="#ffb066">
          COIL-OVER FRONT END
        </text>
        <text x="1150" y="326" textAnchor="end" fill="#ffb066">
          POWER DISC BRAKES
        </text>
        <text x="620" y="502" fill="#ffb066">
          OVERDRIVE DRIVELINE
        </text>
        {/* steel labels */}
        <text x="150" y="238" fill="#9a9ca0" fillOpacity="0.85">
          ORIGINAL SHEET METAL
        </text>
        <text x="200" y="574" fill="#9a9ca0" fillOpacity="0.85">
          PERIOD ROLLING STOCK
        </text>
        {/* plate caption */}
        <text x="600" y="608" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.55" fontSize="10">
          FIG. A — SAME TRUCK, TWO ERAS, ONE SEAM
        </text>
      </g>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        A restomod is a classic car or truck that keeps its original body and character but runs
        modern mechanicals underneath — engine, transmission, brakes, suspension, wiring, and
        comfort. A restoration preserves what the factory built. A restomod preserves what the
        factory <strong>drew</strong>, and replaces the engineering. Sixties sheet metal, current
        manners.
      </p>

      <h2>What does &ldquo;restomod&rdquo; actually mean?</h2>
      <p>
        The word is a blend of <strong>restoration</strong> and <strong>modification</strong>, and
        it was coined at the Barrett-Jackson auction house in the mid-2000s to describe cars that
        look mostly stock on top but carry completely new underpinnings — twenty-first-century
        drivetrains, upgraded suspension and brakes, and comfort features like modern air
        conditioning.<a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        The definition matters because it draws a hard line. A restomod is not a hot rod with the
        body chopped and the fenders gone, and it is not a restoration with a nicer stereo. The
        silhouette stays period. The stance usually drops. Everything you touch, hear, and rely on
        gets replaced.
      </p>
      <p>
        The result, done right, is a car that starts on the first turn in January, stops straight
        from highway speed, and holds a lane without wandering — while still looking like the thing
        you remember from the school parking lot.
      </p>

      <h2>How is a restomod different from a restoration?</h2>
      <p>
        Same donor car, three different jobs, three different owners. The honest comparison looks
        like this:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Restoration versus restomod versus hot rod, compared by goal, drivetrain, brakes and
            suspension, value logic, and best-fit owner
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Restoration</th>
              <th scope="col">Restomod</th>
              <th scope="col">Hot rod / custom</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">The goal</th>
              <td>Put the car back the way the factory built it</td>
              <td>Keep the look, replace the engineering</td>
              <td>Build something the factory never imagined</td>
            </tr>
            <tr>
              <th scope="row">Drivetrain</th>
              <td>Original or correct rebuild</td>
              <td>Modern EFI V8, overdrive transmission</td>
              <td>Anything that fits the vision</td>
            </tr>
            <tr>
              <th scope="row">Brakes &amp; suspension</th>
              <td>Stock spec, often drums</td>
              <td>Discs, coil-overs, corrected geometry</td>
              <td>Fabricated to suit</td>
            </tr>
            <tr>
              <th scope="row">Body</th>
              <td>Factory-correct panels and trim</td>
              <td>Period silhouette, often smoothed, lower stance</td>
              <td>Chopped, channeled, sectioned — open season</td>
            </tr>
            <tr>
              <th scope="row">Value logic</th>
              <td>Originality and documentation carry the price</td>
              <td>Build quality carries the price</td>
              <td>The builder&rsquo;s name carries the price</td>
            </tr>
            <tr>
              <th scope="row">Right owner</th>
              <td>Preservationist, rare or numbers-matching car</td>
              <td>Someone who wants to actually drive it</td>
              <td>Someone making a statement</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Most of the confusion in this trade is a customer asking for one column and pricing another.
        Pick the column first. The money argument gets much shorter after that.
      </p>

      <h2>What actually gets changed on a restomod?</h2>
      <p>
        The public sees paint and stance. The build sheet is mostly things you cannot see:
      </p>
      <ul>
        <li>
          <strong>Engine.</strong> Usually a modern fuel-injected V8 — the GM LS family is the
          default because it is compact, well supported, and cold-blooded in the right way. The
          engine is the cheap part of the swap; mounts, cooling, fuel delivery, and wiring are the
          job.
        </li>
        <li>
          <strong>Transmission.</strong> An overdrive automatic or modern manual. This is the single
          biggest livability change — 110 km/h on the Yellowhead at 2,100 rpm instead of a screaming
          3,500.
        </li>
        <li>
          <strong>Brakes.</strong> Four-wheel discs with a modern master cylinder and booster.
          Factory drums from the fifties and sixties were never designed for what a modern engine
          makes, or for modern traffic.
        </li>
        <li>
          <strong>Suspension and steering.</strong> Corrected geometry, coil-overs or a full
          aftermarket front end, and a modern steering box or rack. Stance is geometry, not just
          shorter springs.
        </li>
        <li>
          <strong>Wiring.</strong> A complete new harness with a modern fuse panel. Unglamorous, and
          it is what stops fires.
        </li>
        <li>
          <strong>Comfort.</strong> Air conditioning, insulation, seats you can sit in for four
          hours, discreet audio. Period-correct where it shows, modern where it counts.
        </li>
      </ul>
      <p>
        That list is the reason a restomod is engineered as one system, not bought as a stack of
        parts. It is also the whole pitch of the{" "}
        <Link href="/services/restomods-custom-builds">restomod and custom build service</Link> here:
        classic skin, modern spine, and the integration work done by one shop that answers for all
        of it.
      </p>

      <h2>What does a restomod cost in Canada?</h2>
      <p>
        Typical planning ranges in 2026 Canadian dollars, before GST — not quotes, and your car,
        its rust, and its parts supply will move the number:
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$80K–$250K+</span>
          <span className="stat-l">Typical full ground-up restomod</span>
        </div>
        <div>
          <span className="stat-v">$15K–$35K</span>
          <span className="stat-l">Typical complete LS or diesel conversion</span>
        </div>
        <div>
          <span className="stat-v">$2.5K–$6K</span>
          <span className="stat-l">Typical disc brake conversion</span>
        </div>
        <div>
          <span className="stat-v">1,000–2,500</span>
          <span className="stat-l">Shop hours in a serious build</span>
        </div>
      </div>
      <p>
        The spread is labour. A restomod carries a restoration&rsquo;s bill — teardown, metal,
        paint — plus the hours of engineering and fitting parts the car was never designed around.
        Every hour of fabrication is invisible in the finished truck, and every one of them is in
        the invoice. The full breakdown of where restoration money actually goes, scope by scope,
        is in the <Link href="/guides/costs">restoration cost guide</Link>.
      </p>
      <p>
        One honest note on budgeting: the cheapest way to own a restomod is usually to buy someone
        else&rsquo;s finished build, because the first owner already paid for the labour. People
        build anyway — because the car they want, in the spec they want, does not exist on the
        market. That is a good reason. Saving money is not.
      </p>

      <h2>Does a restomod hold its value?</h2>
      <p>
        Tradition said modification kills value. The current market disagrees, loudly. At
        Barrett-Jackson&rsquo;s 2024 Scottsdale auction, customs and restomods consistently brought
        more — sometimes much more — than stock counterparts of the same year and model, including
        cars restored to factory specification.<a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        The demand curve behind that is generational. SEMA&rsquo;s &ldquo;Classic Cars, Modern
        Markets&rdquo; research found 38 percent of classic owners under 45 would go restomod,
        against 22 percent of older owners, and 62 percent of specialty businesses reported
        restomod work on the rise.<a href="#src-2" className="cite-ref">[2]</a> Buyers who never
        lived with points ignition and four-wheel drums feel no loyalty to them.
        <a href="#src-4" className="cite-ref">[4]</a>
      </p>
      <blockquote>
        <p>
          Originality is worth real money on a rare car and nostalgia on a common one. Know which
          car is in your garage before anything gets cut.
        </p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>
      <p>
        The caveat is genuine and it is the honest half of the answer: for rare, documented,
        numbers-matching cars, originality is still the store of value, and the debate about
        modifying those cars is real.<a href="#src-3" className="cite-ref">[3]</a> A
        numbers-matching big-block car should make you pause. A small-window farm truck with a
        seized six should not. Most of what comes through this door is the second kind.
      </p>

      <h2>What do real restomod builds look like?</h2>
      <p>
        Two trucks from this floor make the definition concrete better than any glossary.
      </p>
      <p>
        The <Link href="/builds/blue-lowered-pickup">blue lowered shortbox</Link> is the textbook
        case: metallic blue over a smoothed body, laid low on polished billet, with the ride
        height, wheel fitment, and panel gaps solved as one problem. Every badge and seam deleted
        from that body is a hole that was welded, filled flush, and blocked flat. The stance took
        more planning than the paint.
      </p>
      <p>
        The <Link href="/builds/red-stepside-pickup">red 1950s stepside</Link> shows the other half
        of the equation — hood up in the bay, and nothing under that hood left the factory looking
        like it. Modern power in a fifties truck means mounts, cooling, fuel delivery, and wiring
        get solved together or none of them work. Brakes get sorted before power does.
      </p>

      <h2>Is a restomod right for your car?</h2>
      <p>
        Run it through four questions. First: is the car rare, documented, or numbers-matching? If
        yes, think hard, because modification can erase value that restoration would protect.
        Second: do you actually want to drive it — commutes, road trips, summer evenings — or own
        it? Restomods are for driving. Third: does the budget survive the honest range above, plus
        a contingency? Fourth: can you live with a twelve-to-twenty-four-month build?
      </p>
      <p>
        There is an Alberta angle to all four. A restomod built here has to start at minus thirty,
        which drives choices in cold-start calibration, battery placement, and cooling that a
        California build sheet never thinks about. Parts mostly cross the border, so exchange,
        shipping, and duty belong in the budget from day one. And the build calendar should respect
        the seasons — metal and paint through the winter, shakedown miles in May, not the other way
        around.
      </p>
      <p>
        If the car passes, the process starts the same way every time: photos in, honest scope out.
        Send what you have through the <Link href="/quote">quote page</Link> and you will get a
        straight answer — including, when it is true, the answer that your car is worth more left
        original.
      </p>
    </>
  );
}
