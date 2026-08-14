import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 03 — LS Swap Cost in Canada.
 * The commercial-investigation pillar for the swap-cost keyword cluster.
 * Links down into the engine swap service page, the costs and Alberta-law
 * guides, the red stepside case study, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "ls-swap-cost-canada",
  title:
    "LS Swap Cost in Canada: The Real All-In Number (and the Alberta Paperwork Nobody Mentions)",
  accent: "Paperwork",
  metaTitle: "LS Swap Cost in Canada — The Real All-In Number",
  description:
    "What an LS swap really costs in Canada — junkyard 5.3 versus crate paths in CAD, the harness and cooling money nobody budgets, and the Alberta insurance paperwork.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Costs & Pricing",
  targetKeywords: [
    "ls swap cost canada",
    "engine swap cost alberta",
    "ls swap edmonton",
    "engine swap insurance alberta",
    "junkyard 5.3 vs crate engine",
  ],
  faq: [
    {
      q: "How much does an LS swap cost in Canada?",
      a: "A complete LS swap done properly at a shop typically runs $15,000 to $35,000 CAD all-in — a junkyard 5.3 build toward the bottom of that range, a new crate engine pushing the top and past it. A disciplined do-it-yourself junkyard swap commonly lands in the $7,000 to $12,000 range in parts alone, before the value of your own winter. These are planning ranges, not quotes — the harness, cooling, and driveline lines are where individual cars move the number.",
    },
    {
      q: "Is a junkyard 5.3 worth it vs a crate engine?",
      a: "For a driver-grade build, usually yes. A used 5.3 truck engine typically costs $800 to $2,500 CAD and the LS platform's reputation for surviving high mileage is deserved — but you are buying unknown history, so budget for gaskets, a cam swap if you want character, and the possibility of surprises. A crate engine costs several times more and buys you known internals, a warranty, and zero teardown time. The supporting parts bill is nearly identical either way, which is why the crate premium shrinks as the build gets more serious.",
    },
    {
      q: "Do I have to tell my insurance about an engine swap in Alberta?",
      a: "Yes. In Canada, modifications that change a vehicle's performance — and an engine swap is the textbook case — must be declared to your insurer, and an undeclared swap risks a denied claim or a cancelled policy after a loss. Call before the build, not after. Many owners of swapped classics end up on a collector or modified-vehicle policy with an agreed value, which is usually the better home for the car anyway.",
    },
    {
      q: "Does an LS swap hurt a classic car's value?",
      a: "For common driver-grade classics, a well-executed swap generally helps saleability, and the auction record shows professionally built modified cars out-earning comparable stock examples. The money follows build quality — a tidy, documented swap adds value, a hacked one subtracts it. The exception is rare, numbers-matching cars, where originality is the value and the original drivetrain should stay, or at least stay with the car on a stand.",
    },
    {
      q: "How long does an engine swap take?",
      a: "At a working shop, a properly scoped LS swap typically takes 80 to 200 labour hours, which usually means two to six weeks on the calendar once parts are in hand. Parts lead times are the real schedule risk — harnesses, radiators, and driveshafts all arrive on their own clocks. A first-time DIY swap in a home garage is realistically a winter, not a weekend.",
    },
  ],
  citations: [
    {
      name: "Chevrolet Performance — Crate Engines catalog",
      url: "https://www.chevrolet.com/performance-parts/crate-engines",
    },
    {
      name: "Holley Performance — LS Swap Systems",
      url: "https://www.holley.com/products/ls_power/ls_swap_systems/",
    },
    {
      name: "“LS Engine Swap — What You Need for an LS Conversion,” Summit Racing",
      url: "https://www.summitracing.com/ls-engine-swap",
    },
    {
      name: "“Car Modifications and Insurance,” ThinkInsure",
      url: "https://www.thinkinsure.ca/insurance-help-centre/car-modifications-and-insurance.html",
    },
    {
      name: "“Vehicle Inspections,” Government of Alberta",
      url: "https://www.alberta.ca/vehicle-inspections",
    },
    {
      name: "Rick Carey, “For These Corvettes, the Stock vs. Modified Debate Has a Clear Winner,” Hagerty Insider, February 2024",
      url: "https://www.hagerty.com/media/market-trends/hagerty-insider/c2-stock-v-restomod/",
    },
  ],
  internalLinks: [
    "/services/engine-swaps-builds",
    "/guides/costs",
    "/guides/alberta-laws",
    "/builds/red-stepside-pickup",
    "/quote",
  ],
  readingMinutes: 11,
};

/**
 * Exploded LS diagram: the engine in steel line art — intake lifted, oil pan
 * dropped, driveline ghosted rearward — with leader lines out to six cost
 * buckets, each carrying a tungsten CAD range chip. The point the drawing
 * makes is the point the article makes: the engine is one chip of six.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 640"
      role="img"
      aria-label="Exploded technical diagram of an LS V8 engine drawn in steel line art — intake manifold lifted, oil pan dropped, transmission and driveshaft ghosted rearward — with callout lines to six cost buckets, each labelled with a typical Canadian dollar range: engine source, mounts and pan, harness and ECU, cooling system, driveline, and tuning"
      className="h-auto w-full"
    >
      <title>The six buckets — where LS swap money actually goes</title>
      <defs>
        <radialGradient id="ls-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light behind the assembly */}
      <ellipse cx="595" cy="330" rx="330" ry="200" fill="url(#ls-pool)" />

      {/* ══ INTAKE MANIFOLD — exploded upward ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* plenum with runner humps */}
        <path d="M 472 196 Q 478 168 510 162 Q 552 155 596 154 Q 640 155 682 162 Q 714 168 720 196 L 706 202 Q 596 190 486 202 Z" />
        {/* runner ribs */}
        <g strokeWidth="1" strokeOpacity="0.5">
          <path d="M 520 162 Q 522 180 524 199" />
          <path d="M 560 157 Q 561 176 562 196" />
          <path d="M 632 157 Q 631 176 630 196" />
          <path d="M 672 162 Q 670 180 668 199" />
        </g>
        {/* throttle body snout, front (left) */}
        <path d="M 472 182 L 444 182 Q 434 182 434 190 L 434 196 Q 434 204 444 204 L 474 202" strokeWidth="1.4" strokeOpacity="0.8" />
        <circle cx="428" cy="193" r="10" strokeWidth="1.2" strokeOpacity="0.7" />
      </g>
      {/* assembly drop lines: intake → valley */}
      <g stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 5">
        <line x1="500" y1="206" x2="500" y2="238" />
        <line x1="596" y1="200" x2="596" y2="238" />
        <line x1="692" y1="206" x2="692" y2="238" />
      </g>

      {/* ══ VALVE COVER + COILS ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <rect x="468" y="244" width="256" height="34" rx="7" />
        {/* coil packs — ember, the hot side of the harness */}
        <g stroke="#ffd9ad" strokeWidth="1.3" strokeOpacity="0.9">
          <rect x="492" y="232" width="22" height="12" rx="2" />
          <rect x="548" y="232" width="22" height="12" rx="2" />
          <rect x="604" y="232" width="22" height="12" rx="2" />
          <rect x="660" y="232" width="22" height="12" rx="2" />
        </g>
      </g>
      {/* harness — tungsten loom leaving the coil rail, connector ticks */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.2" strokeLinecap="round">
        <path d="M 682 238 Q 730 222 768 226 Q 810 231 838 214" strokeOpacity="0.85" />
        <g strokeWidth="1" strokeOpacity="0.7">
          <line x1="744" y1="222" x2="740" y2="212" />
          <line x1="788" y1="228" x2="786" y2="218" />
          <line x1="820" y1="222" x2="822" y2="212" />
        </g>
        {/* ECU brick at the end of the loom */}
        <rect x="838" y="200" width="42" height="26" rx="3" strokeOpacity="0.9" />
        <line x1="846" y1="208" x2="872" y2="208" strokeWidth="0.8" strokeOpacity="0.6" />
        <line x1="846" y1="216" x2="872" y2="216" strokeWidth="0.8" strokeOpacity="0.6" />
      </g>

      {/* ══ BLOCK ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <rect x="452" y="282" width="288" height="118" rx="9" />
        {/* deck line + skirt rib */}
        <line x1="452" y1="308" x2="740" y2="308" strokeWidth="1" strokeOpacity="0.45" />
        <line x1="452" y1="374" x2="740" y2="374" strokeWidth="1" strokeOpacity="0.45" />
        {/* freeze plugs */}
        <circle cx="516" cy="342" r="9" strokeWidth="1.1" strokeOpacity="0.6" />
        <circle cx="596" cy="342" r="9" strokeWidth="1.1" strokeOpacity="0.6" />
        <circle cx="676" cy="342" r="9" strokeWidth="1.1" strokeOpacity="0.6" />
        {/* engine mount boss — small pad low on the block */}
        <rect x="470" y="382" width="34" height="14" rx="3" strokeWidth="1.3" strokeOpacity="0.8" />
      </g>

      {/* ══ FRONT DRIVE — balancer + water pump ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        <circle cx="436" cy="376" r="24" strokeWidth="1.8" />
        <circle cx="436" cy="376" r="9" strokeWidth="1.1" strokeOpacity="0.7" />
        <circle cx="442" cy="312" r="16" strokeWidth="1.6" strokeOpacity="0.9" />
        {/* belt path hint */}
        <path d="M 436 352 Q 430 336 440 328" strokeWidth="0.9" strokeOpacity="0.5" strokeDasharray="3 4" />
      </g>
      {/* radiator ghost — cooling bucket, forward of the engine */}
      <g fill="none" stroke="#ffb066" strokeLinecap="round">
        <rect x="308" y="268" width="44" height="140" rx="6" strokeWidth="1.3" strokeOpacity="0.55" strokeDasharray="6 5" />
        <g strokeWidth="0.8" strokeOpacity="0.35">
          <line x1="322" y1="274" x2="322" y2="402" />
          <line x1="338" y1="274" x2="338" y2="402" />
        </g>
        {/* upper + lower hoses to the pump */}
        <path d="M 352 284 Q 396 280 426 302" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="5 4" />
        <path d="M 352 396 Q 392 400 414 386" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="5 4" />
      </g>

      {/* ══ EXHAUST MANIFOLD — lower rear of block, ember at the flange ══ */}
      <g fill="none" strokeLinecap="round">
        <path d="M 700 400 Q 706 420 718 430 L 762 438" stroke="#9a9ca0" strokeWidth="1.5" />
        <path d="M 672 400 Q 678 424 700 434" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7" />
        <path d="M 762 434 L 762 442" stroke="#ffd9ad" strokeWidth="4" strokeOpacity="0.9" />
      </g>

      {/* ══ OIL PAN — exploded downward ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 478 432 L 714 432 L 714 448 L 636 448 L 632 472 Q 630 480 620 480 L 540 480 Q 530 480 528 472 L 524 448 L 478 448 Z" />
        {/* drain bung */}
        <circle cx="580" cy="472" r="4" strokeWidth="1.1" strokeOpacity="0.7" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 5">
        <line x1="500" y1="402" x2="500" y2="430" />
        <line x1="596" y1="402" x2="596" y2="430" />
        <line x1="692" y1="402" x2="692" y2="430" />
      </g>

      {/* ══ DRIVELINE — bellhousing solid, trans + shaft ghosted rearward ══ */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 740 292 L 762 300 L 762 390 L 740 396" stroke="#9a9ca0" strokeWidth="1.8" />
        {/* transmission, exploded off the flange */}
        <path
          d="M 782 306 L 856 314 L 878 328 L 878 366 L 856 378 L 782 386 Z"
          stroke="#ffb066"
          strokeWidth="1.4"
          strokeOpacity="0.6"
          strokeDasharray="7 6"
        />
        {/* tailshaft + driveshaft with slip yoke tick */}
        <line x1="878" y1="346" x2="1006" y2="346" stroke="#ffb066" strokeWidth="1.8" strokeOpacity="0.45" strokeDasharray="9 7" />
        <line x1="922" y1="338" x2="922" y2="354" stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.5" />
        {/* separation marks between flange and trans */}
        <g stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 5">
          <line x1="764" y1="322" x2="780" y2="320" />
          <line x1="764" y1="368" x2="780" y2="370" />
        </g>
      </g>

      {/* ══ LEADER LINES ══ */}
      <g fill="none" strokeWidth="0.75" strokeOpacity="0.55">
        {/* engine source — from block upper-left to left chip 1 */}
        <path d="M 208 150 L 300 150 L 466 250" stroke="#ffb066" />
        {/* cooling — radiator to left chip 2 */}
        <path d="M 208 318 L 306 318" stroke="#ffb066" />
        {/* mounts & pan — mount boss/pan to left chip 3 */}
        <path d="M 208 486 L 400 486 L 484 392" stroke="#ffb066" />
        {/* harness & ECU — ECU brick to right chip 1 */}
        <path d="M 992 150 L 920 150 L 874 198" stroke="#ffb066" />
        {/* driveline — trans ghost to right chip 2 */}
        <path d="M 992 318 L 930 318 L 882 336" stroke="#ffb066" />
        {/* tuning — exhaust flange / ECU region to right chip 3 */}
        <path d="M 992 486 L 856 486 L 768 442" stroke="#ffb066" />
      </g>

      {/* ══ COST CHIPS — six buckets, tungsten ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.14em">
        {[
          { x: 36, y: 124, label: "01 · ENGINE SOURCE", range: "$800–$16K" },
          { x: 36, y: 292, label: "02 · COOLING SYSTEM", range: "$800–$2.5K" },
          { x: 36, y: 460, label: "03 · MOUNTS & PAN", range: "$1.5K–$4K" },
          { x: 992, y: 124, label: "04 · HARNESS & ECU", range: "$1.2K–$3K" },
          { x: 992, y: 292, label: "05 · DRIVELINE", range: "$2K–$6K" },
          { x: 992, y: 460, label: "06 · TUNING", range: "$500–$1.5K" },
        ].map((c) => (
          <g key={c.label}>
            <rect
              x={c.x}
              y={c.y}
              width="172"
              height="52"
              rx="4"
              fill="#0a0a0b"
              stroke="#ffb066"
              strokeWidth="1"
              strokeOpacity="0.8"
            />
            <text x={c.x + 14} y={c.y + 21} fontSize="9" fill="#9a9ca0" fillOpacity="0.9">
              {c.label}
            </text>
            <text x={c.x + 14} y={c.y + 41} fontSize="14" fill="#ffb066">
              {c.range}
            </text>
          </g>
        ))}
      </g>

      {/* ══ ANNOTATIONS ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
      >
        <text x="36" y="70" fill="#9a9ca0" fillOpacity="0.85">
          LS SWAP · COST ANATOMY
        </text>
        <text x="36" y="88" fill="#9a9ca0" fillOpacity="0.5" fontSize="10">
          TYPICAL CAD RANGES · PARTS ONLY
        </text>
        <text x="1164" y="70" textAnchor="end" fill="#ffb066" fillOpacity="0.9">
          LABOUR RIDES ON TOP
        </text>
        <text x="1164" y="88" textAnchor="end" fill="#9a9ca0" fillOpacity="0.5" fontSize="10">
          80–200 SHOP HOURS
        </text>
        <text x="600" y="614" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.55" fontSize="10">
          FIG. C — THE ENGINE IS ONE CHIP OF SIX
        </text>
      </g>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        A complete LS swap done properly at a shop typically runs <strong>$15,000 to $35,000
        CAD</strong> all-in — a junkyard 5.3 build toward the bottom, a new crate engine pushing
        the top and past it. A disciplined DIY junkyard swap can land under $12,000 in parts. The
        engine is the cheap line. Harness, cooling, and driveline are where budgets blow up.
      </p>

      <h2>What does an LS swap actually cost in Canada?</h2>
      <p>
        The honest answer is a table, not a number, because &ldquo;LS swap&rdquo; describes three
        very different projects wearing the same name. All figures are typical planning ranges in
        Canadian dollars, before GST — not quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Typical Canadian dollar cost ranges for an LS swap by build path: junkyard 5.3, crate
            engine, and built engine, showing engine cost, supporting parts, and shop-done all-in
            totals
          </caption>
          <thead>
            <tr>
              <th scope="col">Path</th>
              <th scope="col">Engine, typical</th>
              <th scope="col">Supporting parts, typical</th>
              <th scope="col">Shop-done all-in, typical</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Junkyard 5.3</th>
              <td className="num">$800 – $2,500</td>
              <td className="num">$6,000 – $10,000</td>
              <td className="num">$15,000 – $22,000</td>
            </tr>
            <tr>
              <th scope="row">Crate-based</th>
              <td className="num">$9,000 – $16,000</td>
              <td className="num">$7,000 – $12,000</td>
              <td className="num">$25,000 – $35,000+</td>
            </tr>
            <tr>
              <th scope="row">Built / forged</th>
              <td className="num">$15,000 – $30,000+</td>
              <td className="num">$8,000 – $15,000</td>
              <td className="num">$35,000 – $60,000+</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Two things stand out in that table, and they are the two things this article exists to say.
        First, the supporting-parts column barely moves between rows — the stuff around the engine
        costs roughly the same whether the engine came from a wrecker or a catalog. Second, the
        all-in column is a multiple of the engine column. Nobody blows a swap budget on the engine.
        They blow it on everything the engine touches.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$15K–$35K</span>
          <span className="stat-l">Typical shop-done LS swap, all-in CAD</span>
        </div>
        <div>
          <span className="stat-v">$7K–$12K</span>
          <span className="stat-l">Typical DIY junkyard swap, parts only</span>
        </div>
        <div>
          <span className="stat-v">$6K–$12K</span>
          <span className="stat-l">Typical supporting parts around any engine</span>
        </div>
        <div>
          <span className="stat-v">80–200</span>
          <span className="stat-l">Shop hours in a properly finished swap</span>
        </div>
      </div>

      <h2>Where does the money actually go?</h2>
      <p>
        Line by line, the way an estimate gets built. The diagram above is this list drawn to
        scale — six buckets, and the engine is one of them:
      </p>
      <ul>
        <li>
          <strong>Engine source.</strong> A used 5.3 truck engine from a wrecker typically runs
          $800 to $2,500. A new crate engine — an LS3 and its relatives from the Chevrolet
          Performance catalog<a href="#src-1" className="cite-ref">[1]</a> — typically lands in
          the $9,000 to $16,000 range by the time exchange and shipping into Alberta are paid.
          Prices move with the dollar, which is exactly why they are ranges.
        </li>
        <li>
          <strong>Mounts, pan, and headers.</strong> The parts that make the engine physically fit
          your chassis. Bolt-in swap systems exist for the popular platforms
          <a href="#src-2" className="cite-ref">[2]</a> and typically total $1,500 to $4,000; an
          unpopular chassis means fabrication hours instead, which cost more and show up in the
          labour line.
        </li>
        <li>
          <strong>Harness and ECU.</strong> A standalone harness and a properly flashed controller
          typically run $1,200 to $3,000. This is the line first-time swappers skip, and it is the
          line that decides whether the truck starts every time or becomes a driveway ornament with
          a check-engine light.
        </li>
        <li>
          <strong>Cooling.</strong> Radiator sized for the new engine, electric fans, hoses, and
          steam-vent plumbing the LS actually requires — typically $800 to $2,500. Undersize this
          bucket and the swap works perfectly until the first July long weekend.
        </li>
        <li>
          <strong>Fuel system.</strong> An EFI engine needs EFI fuel pressure. Pump, regulator,
          and lines typically run $600 to $2,000 depending on whether the tank cooperates.
        </li>
        <li>
          <strong>Driveline.</strong> Transmission, crossmember, and a driveshaft cut to length —
          typically $2,000 to $6,000, and past that fast if the plan calls for a new overdrive
          automatic or a T56. The stock driveline behind a healthy LS is living on borrowed time,
          so this bucket is honesty, not upsell.
        </li>
        <li>
          <strong>Tuning.</strong> A proper calibration session typically runs $500 to $1,500.
          Carbureted classics get dialed here in-house; EFI swaps get street-tuned on a wideband or
          booked onto a partner dyno. Either way the line belongs in the budget, because a swap
          that never got tuned is a swap that never got finished.
        </li>
      </ul>
      <p>
        Add 80 to 200 shop hours to install, wire, plumb, and shake all of that down as one
        system. That is the arithmetic behind the summary table, and it is the same arithmetic
        behind the <Link href="/services/engine-swaps-builds">engine swap and build service</Link>{" "}
        here — every one of those buckets quoted before the hood opens, not discovered after.
      </p>
      <blockquote>
        <p>The engine is not the budget. The engine is the deposit on the budget.</p>
        <footer>Shop rule, repeated over every swap estimate</footer>
      </blockquote>

      <h2>Junkyard 5.3 vs crate vs built — which path fits your build?</h2>
      <p>
        Same six buckets, three different philosophies:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Comparison of junkyard 5.3, crate engine, and built engine swap paths by what you get,
            main risk, and best-fit builder
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Junkyard 5.3</th>
              <th scope="col">Crate engine</th>
              <th scope="col">Built / forged</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">What you get</th>
              <td>Proven truck engine, unknown history, honest power</td>
              <td>New internals, warranty, documented output</td>
              <td>Power target of your choosing, forged bottom end</td>
            </tr>
            <tr>
              <th scope="row">The main risk</th>
              <td>Surprises inside — budget for gaskets and maybe more</td>
              <td>Exchange rate and shipping do the damage</td>
              <td>Scope creep — every part invites a better one</td>
            </tr>
            <tr>
              <th scope="row">Makes sense for</th>
              <td>Driver builds, first swaps, farm trucks</td>
              <td>Keeper cars, resale-minded builds, no-teardown timelines</td>
              <td>Serious power goals, show builds</td>
            </tr>
            <tr>
              <th scope="row">Typical all-in, shop-done</th>
              <td className="num">$15,000 – $22,000</td>
              <td className="num">$25,000 – $35,000+</td>
              <td className="num">$35,000 – $60,000+</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The junkyard path deserves its reputation. The 5.3 went into roughly a million GM trucks,
        survives high mileage with grace, and responds to a cam swap like it was waiting for one.
        But &ldquo;ran when pulled&rdquo; is a cousin of &ldquo;ran when parked&rdquo; — inspect
        before you buy, and price the build assuming a gasket set, new sensors, and one surprise.
        A crate engine spends its premium buying those surprises out of the deal. Neither answer is
        wrong. What is wrong is pricing a crate build and then wondering why the junkyard quote
        next door came in ten thousand lighter.
      </p>

      <h2>Which supporting mods are not optional?</h2>
      <p>
        A swap parts list is longer than the engine aisle, and the completion checklists the big
        retailers publish exist because of what happens when items get skipped.
        <a href="#src-3" className="cite-ref">[3]</a> Around this shop, four of them are treated as
        part of the swap, not accessories to it:
      </p>
      <ul>
        <li>
          <strong>Brakes.</strong> If the car still has four-wheel drums from the sixties, the
          brake conversation happens before the horsepower conversation. More engine into the same
          drums is not a build plan, it is a countdown.
        </li>
        <li>
          <strong>Gauges and sending units.</strong> The new engine speaks a different electrical
          language than the 1965 dash. Adapters or new gauges — either way, oil pressure you can
          actually see.
        </li>
        <li>
          <strong>Exhaust.</strong> Manifold-back, built for the new engine, typically $800 to
          $2,500. The old single pipe will bolt up to nothing and flow less than the engine idles
          through.
        </li>
        <li>
          <strong>Charging and battery.</strong> A modern alternator, cables sized for it, and a
          battery with real cold-cranking amps — which stops being a footnote the first week of
          January here.
        </li>
      </ul>
      <p>
        Where those items land in your total depends on what the car already has, which is why the
        ranges in this article are wide and the <Link href="/guides/costs">cost guide</Link> breaks
        the same logic out for every other kind of work a classic needs.
      </p>

      <h2>What is the Alberta paperwork nobody mentions?</h2>
      <p>
        The mechanical half of a swap is well documented. The paperwork half is where Alberta
        owners get surprised, and it has two parts.
      </p>
      <p>
        <strong>The insurance call.</strong> In Canada, a modification that changes a
        vehicle&rsquo;s performance has to be declared to your insurer, and an engine swap is the
        textbook case. Skip the call and you are carrying the risk yourself: an undeclared
        modification is grounds for a denied claim or a cancelled policy after a loss.
        <a href="#src-4" className="cite-ref">[4]</a> The right order is insurer first, wrenches
        second — before the build, ask how the swap affects the policy and what documentation they
        want. In practice, a swapped classic usually belongs on a collector or modified-vehicle
        policy with an agreed value, where the build receipts and photos work for you instead of
        against you. Keep every invoice. The file that proves what the car is worth is built during
        the swap, not after the loss.
      </p>
      <p>
        <strong>The inspection triggers.</strong> Alberta has no routine inspection for a
        registered private vehicle, which surprises people from provinces that do. Inspections
        trigger on events: a vehicle registered outside Alberta must pass an out-of-province
        inspection before plates are issued, and a written-off vehicle needs a salvage inspection
        to get back on the road.<a href="#src-5" className="cite-ref">[5]</a> That matters to swap
        math in two common cases — buying an already-swapped car from B.C. or Saskatchewan, where
        the whole car, swap included, has to pass inspection here before it gets plates; and
        building on a salvage title, where the swap becomes part of the record the inspection
        reviews. Budget the inspection fee and, more importantly, the state of completion it
        demands. A half-finished swap does not pass.
      </p>
      <p>
        The broader rules — what Alberta requires on lighting, ride height, and the rest of a
        modified vehicle — live in the{" "}
        <Link href="/guides/alberta-laws">Alberta classic car law guide</Link>. None of it is
        difficult. All of it is cheaper to know before the build than after.
      </p>

      <h2>Will a swap hurt your classic&rsquo;s value?</h2>
      <p>
        For the cars most people actually swap — driver-grade trucks and common classics — the
        market has already voted. Auction results show professionally modified cars consistently
        out-earning comparable stock examples, with the important catch that the premium follows
        build quality: the cars bringing the big numbers are the ones built to a professional
        standard, documented end to end.<a href="#src-6" className="cite-ref">[6]</a> A tidy,
        receipted LS swap makes a classic easier to sell to the next owner, who wants the look
        without the points ignition. A hacked harness and a sagging radiator do the opposite.
      </p>
      <p>
        The honest exception: rare, documented, numbers-matching cars, where originality is the
        value and the factory drivetrain should stay in the car — or at minimum stay with it,
        preserved on a stand, so the swap is reversible on paper even if nobody ever reverses it.
        Most of what rolls through this door is the first kind. The{" "}
        <Link href="/builds/red-stepside-pickup">red stepside on the builds page</Link> is the
        pattern: a fifties truck nobody was preserving for a museum, now with modern power and
        every supporting system brought along to match.
      </p>

      <h2>Why does an Alberta swap have to start at minus thirty?</h2>
      <p>
        Because the whole argument for the swap is a classic you can trust, and in Edmonton trust
        is measured in January. The LS platform&rsquo;s cold-start manners are a real advantage
        over a choke and a prayer — but only if the swap was built for it: a cold-start calibration
        in the tune, a battery with the cranking amps to prove it, cables that do not choke the
        starter, and a cooling system that handles minus thirty and plus thirty in the same year.
        A swap built to a California parts list works here for eleven months and then teaches an
        expensive lesson.
      </p>
      <p>
        That is the standard the shop builds to, and it is the test worth applying to any quote you
        collect: ask what the cold-start plan is. If the answer is a pause, keep collecting.
      </p>
      <p>
        If you are pricing a swap now, the process here starts the same way every time — photos of
        the car, what it has, what you want it to do — through the{" "}
        <Link href="/quote">quote page</Link>. You will get the six buckets, honest ranges for
        your actual car, and if the right answer is the junkyard path instead of the crate, that
        is the answer you will get.
      </p>
    </>
  );
}
