import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Engine Rebuild & Performance Build Costs (Canada).
 * The commercial-investigation pillar for the engine rebuild keyword cluster.
 * Links down into the engine swaps service page, the costs guide, the LS swap
 * cost sibling, the barn find protocol, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "engine-rebuild-cost-canada",
  title:
    "Engine Rebuild & Performance Build Costs in Canada (2026): From Stock Refresh to Full Build",
  accent: "Costs",
  metaTitle: "Engine Rebuild & Performance Build Costs in Canada (2026)",
  description:
    "What a stock rebuild, a performance build, and a crate engine typically cost in CAD, what Alberta machine shops charge, and where budgets actually blow up.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Costs & Pricing",
  targetKeywords: [
    "engine rebuild cost canada",
    "performance engine build cost",
    "engine machining cost alberta",
    "crate engine vs rebuild",
    "engine rebuild Edmonton",
  ],
  faq: [
    {
      q: "How much does it cost to rebuild an engine in Canada?",
      a: "A stock rebuild of a common V8 typically runs $5,000 to $10,000 in Canadian dollars with parts, machining, and labour included. A performance build typically lands between $10,000 and $25,000 and climbs from there. Machining is the wildcard — the real number only exists after the block is stripped, cleaned, and measured. These are planning ranges, not quotes.",
    },
    {
      q: "Is a crate engine cheaper than rebuilding?",
      a: "Often, yes — for common engines. When a tired small-block needs heavy machining, a new assembled crate engine can cost the same or less than the rebuild and arrives fresh from the factory. Rebuilding wins when the engine is original to a collectible car, when the engine family has no crate equivalent, or when keeping the original character is the whole point.",
    },
    {
      q: "What does engine machining cost in Alberta?",
      a: "Typical Alberta planning ranges in CAD: cleaning and crack-checking $200 to $450, bore and hone $400 to $800 on a V8, decking $200 to $400, crank grind or polish $100 to $500, rod reconditioning $250 to $500, a valve job $500 to $1,000, and balancing $400 to $700. A full machining package on a common V8 commonly lands between $1,500 and $4,000.",
    },
    {
      q: "How long does an engine rebuild take?",
      a: "The wrenching is measured in days; the calendar is measured in queues. Four to twelve weeks is realistic from teardown to a fired engine, and the machine-shop queue is usually the driver — good shops stay booked. Backordered parts for an older or unusual engine can stretch the calendar to months, which is why winter is the smart season to start.",
    },
    {
      q: "Rebuild or swap — which is cheaper?",
      a: "A stock rebuild, typically $5,000 to $10,000 CAD, is usually cheaper than a complete LS or diesel swap, which typically runs $15,000 to $35,000 done properly. But they buy different things: a rebuild returns the engine the car came with, while a swap buys fuel injection, overdrive, cold-start manners, and a parts counter in every town. Match the money to how you will drive the car.",
    },
  ],
  citations: [
    {
      name: "“About,” AERA — Engine Builders Association, est. 1922",
      url: "https://aera.org/about/",
    },
    {
      name: "Rob Siegel, “$25K Project Dino: Engine Rebuild Was a Budget-Busting, Quad-Cam Quagmire,” Hagerty",
      url: "https://www.hagerty.com/media/maintenance-and-tech/25k-project-dino-engine-rebuild-was-a-budget-busting-quad-cam-quagmire/",
    },
    {
      name: "“Performance Engine Bearings,” MAHLE Aftermarket North America",
      url: "https://www.mahle-aftermarket.com/na/en/performance/engine-bearings/",
    },
    {
      name: "“Chevrolet Crate Engines,” Chevrolet Performance Parts",
      url: "https://www.chevrolet.com/performance-parts/crate-engines",
    },
    {
      name: "“Flat Tappet Camshaft Failures — Technical Bulletin,” COMP Cams (PDF)",
      url: "https://www.compcams.com/pub/media/wysiwyg/CompCams/FlatTappetCamTechBulletin.pdf",
    },
  ],
  internalLinks: [
    "/services/engine-swaps-builds",
    "/guides/costs",
    "/blog/ls-swap-cost-canada",
    "/blog/barn-find-first-steps",
    "/quote",
  ],
  readingMinutes: 10,
};

/**
 * Cutaway short-block in steel line art — one cylinder sectioned, piston and
 * ring pack lit in ember, rod down to the crank — with the three-tier cost
 * ladder plotted beside it on a CAD scale, range chips in tungsten.
 * Editorial diagram, not clipart. Transparent ground so the page's dark panel
 * and grain read through.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 640"
      role="img"
      aria-label="Technical cutaway diagram of an engine short block: one cylinder sectioned to show the piston with its ring pack highlighted, connecting rod, and crankshaft — beside a three-column cost ladder plotting typical Canadian dollar ranges for a stock refresh, a performance build, and a crate engine with installation"
      className="h-auto w-full"
    >
      <title>The short-block, sectioned — and the three budgets that put it back together</title>
      <defs>
        <radialGradient id="er-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="er-plus" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* pool of light under the block */}
      <ellipse cx="360" cy="524" rx="330" ry="38" fill="url(#er-pool)" />
      {/* ground */}
      <line x1="80" y1="520" x2="1120" y2="520" stroke="#9a9ca0" strokeOpacity="0.25" strokeWidth="1" />

      {/* ══ BLOCK OUTLINE — deck, water jacket step, pan rail ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 150 150 L 520 150 L 520 300 L 552 334 L 552 470 Q 552 480 542 480 L 185 480 Q 175 480 175 470 L 175 334 L 150 300 Z" />
        {/* crankcase parting line */}
        <path d="M 175 334 L 552 334" strokeWidth="1" strokeOpacity="0.35" />
        {/* freeze plug on the right water jacket */}
        <circle cx="490" cy="240" r="13" strokeWidth="1.2" strokeOpacity="0.6" />
      </g>

      {/* deck machining ticks */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55">
        <line x1="166" y1="142" x2="158" y2="150" />
        <line x1="196" y1="142" x2="188" y2="150" />
        <line x1="226" y1="142" x2="218" y2="150" />
        <line x1="256" y1="142" x2="248" y2="150" />
        <line x1="286" y1="142" x2="278" y2="150" />
        <line x1="316" y1="142" x2="308" y2="150" />
        <line x1="346" y1="142" x2="338" y2="150" />
        <line x1="376" y1="142" x2="368" y2="150" />
        <line x1="406" y1="142" x2="398" y2="150" />
        <line x1="436" y1="142" x2="428" y2="150" />
        <line x1="466" y1="142" x2="458" y2="150" />
        <line x1="496" y1="142" x2="488" y2="150" />
      </g>

      {/* ══ CYLINDER NO.1 — SECTIONED ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        {/* bore walls: inner solid, outer light — the section shows wall thickness */}
        <line x1="200" y1="150" x2="200" y2="322" strokeWidth="1.8" />
        <line x1="290" y1="150" x2="290" y2="322" strokeWidth="1.8" />
        <line x1="190" y1="150" x2="190" y2="322" strokeWidth="1" strokeOpacity="0.45" />
        <line x1="300" y1="150" x2="300" y2="322" strokeWidth="1" strokeOpacity="0.45" />
        {/* fresh hone crosshatch above the piston */}
        <g strokeWidth="0.8" strokeOpacity="0.35">
          <line x1="203" y1="168" x2="219" y2="156" />
          <line x1="203" y1="186" x2="227" y2="168" />
          <line x1="211" y1="198" x2="239" y2="177" />
          <line x1="225" y1="198" x2="257" y2="174" />
          <line x1="243" y1="198" x2="275" y2="174" />
          <line x1="261" y1="198" x2="287" y2="178" />
          <line x1="279" y1="198" x2="287" y2="192" />
          <line x1="219" y1="156" x2="203" y2="144" />
          <line x1="239" y1="177" x2="211" y2="156" />
          <line x1="257" y1="174" x2="225" y2="150" />
          <line x1="275" y1="174" x2="243" y2="150" />
          <line x1="287" y1="178" x2="261" y2="158" />
        </g>
      </g>

      {/* piston, mid-stroke */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 204 205 L 286 205 L 286 278 L 272 284 L 218 284 L 204 278 Z" />
        {/* wrist pin */}
        <circle cx="245" cy="260" r="11" strokeWidth="1.4" />
        <circle cx="245" cy="260" r="4" strokeWidth="1" strokeOpacity="0.7" />
      </g>
      {/* ring pack — the ember detail */}
      <g stroke="#ffd9ad" strokeWidth="4" strokeLinecap="round">
        <line x1="205" y1="215" x2="285" y2="215" />
        <line x1="205" y1="227" x2="285" y2="227" />
        <line x1="205" y1="239" x2="285" y2="239" strokeOpacity="0.7" />
      </g>

      {/* connecting rod — tapered beam from pin to journal */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 238 271 L 296 382" />
        <path d="M 253 269 L 322 376" />
        {/* big end + cap */}
        <circle cx="312" cy="392" r="17" />
        <path d="M 296 398 L 328 386" strokeWidth="1" strokeOpacity="0.6" />
      </g>
      {/* rod bearing shell hint */}
      <circle cx="312" cy="392" r="12" fill="none" stroke="#ffd9ad" strokeWidth="1.2" strokeOpacity="0.55" strokeDasharray="3 4" />

      {/* ══ CRANKSHAFT ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        {/* counterweight opposite the throw */}
        <path d="M 322 446 A 56 56 0 0 1 415 380" strokeWidth="2" />
        <path d="M 334 438 A 42 42 0 0 1 403 389" strokeWidth="1" strokeOpacity="0.5" />
        {/* main journal + center mark */}
        <circle cx="360" cy="410" r="19" strokeWidth="1.8" />
        <line x1="360" y1="402" x2="360" y2="418" strokeWidth="0.9" strokeOpacity="0.7" />
        <line x1="352" y1="410" x2="368" y2="410" strokeWidth="0.9" strokeOpacity="0.7" />
        {/* cheek connecting journal to throw */}
        <path d="M 344 398 L 322 380 L 302 384" strokeWidth="1.2" strokeOpacity="0.7" />
      </g>
      {/* crank centerline */}
      <line x1="140" y1="410" x2="562" y2="410" stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="10 6 2 6" />

      {/* ══ CYLINDER NO.2 — INTACT, GHOSTED ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="6 5" strokeLinecap="round">
        <line x1="360" y1="150" x2="360" y2="322" />
        <line x1="450" y1="150" x2="450" y2="322" />
        <path d="M 364 188 L 446 188 L 446 250 L 364 250 Z" />
        <path d="M 405 250 L 405 322" />
      </g>

      {/* ══ LEADERS + LABELS — annotation column between block and ladder ══ */}
      <g stroke="#ffd9ad" strokeWidth="0.75" strokeOpacity="0.55" fill="none">
        <path d="M 288 227 L 596 212" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 284 176 L 596 152" />
        <path d="M 290 330 L 596 300" />
        <path d="M 380 418 L 596 448" />
        <path d="M 168 128 L 186 148" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
      >
        <text x="150" y="120" fill="#9a9ca0" fillOpacity="0.85">
          DECK · MACHINED FLAT
        </text>
        <text x="604" y="156" fill="#9a9ca0" fillOpacity="0.85">
          BORE · FRESH CROSSHATCH
        </text>
        <text x="604" y="216" fill="#ffd9ad">
          RING PACK · SECTIONED
        </text>
        <text x="604" y="304" fill="#9a9ca0" fillOpacity="0.85">
          CONNECTING ROD
        </text>
        <text x="604" y="452" fill="#9a9ca0" fillOpacity="0.85">
          CRANKSHAFT · MAINS
        </text>
        <text x="245" y="508" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.55" fontSize="10">
          CYL NO.1 · SECTIONED
        </text>
      </g>

      {/* ══ THE COST LADDER — $0 to $30K CAD, three tiers ══ */}
      {/* faint grid */}
      <g stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.14">
        <line x1="806" y1="386.7" x2="1140" y2="386.7" />
        <line x1="806" y1="273.3" x2="1140" y2="273.3" />
        <line x1="806" y1="160" x2="1140" y2="160" />
      </g>
      {/* scale rail + ticks */}
      <line x1="806" y1="150" x2="806" y2="500" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" />
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5">
        <line x1="800" y1="500" x2="812" y2="500" />
        <line x1="800" y1="443.3" x2="812" y2="443.3" />
        <line x1="800" y1="386.7" x2="812" y2="386.7" />
        <line x1="800" y1="330" x2="812" y2="330" />
        <line x1="800" y1="273.3" x2="812" y2="273.3" />
        <line x1="800" y1="216.7" x2="812" y2="216.7" />
        <line x1="800" y1="160" x2="812" y2="160" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.1em"
        fill="#9a9ca0"
        fillOpacity="0.55"
        textAnchor="end"
      >
        <text x="794" y="504">$0</text>
        <text x="794" y="390.7">$10K</text>
        <text x="794" y="277.3">$20K</text>
        <text x="794" y="164">$30K</text>
      </g>

      {/* tier 1 — stock refresh, $5K–$10K */}
      <rect x="846" y="386.7" width="60" height="56.6" rx="6" fill="#ffb066" fillOpacity="0.08" stroke="#ffb066" strokeWidth="1.5" />
      {/* tier 2 — performance build, $10K–$25K+ */}
      <rect x="956" y="216.7" width="60" height="170" rx="6" fill="#ffb066" fillOpacity="0.08" stroke="#ffb066" strokeWidth="1.5" />
      <rect x="984.5" y="184" width="3" height="30" fill="url(#er-plus)" />
      {/* tier 3 — crate + install, $9K–$20K+ */}
      <rect x="1066" y="273.3" width="60" height="124.7" rx="6" fill="#ffb066" fillOpacity="0.08" stroke="#ffb066" strokeWidth="1.5" />
      <rect x="1094.5" y="240" width="3" height="30" fill="url(#er-plus)" />

      {/* range chips + column labels */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.12em" textAnchor="middle">
        <g fontSize="11" fill="#ffd9ad">
          <text x="876" y="376">$5K–$10K</text>
          <text x="986" y="206">$10K–$25K+</text>
          <text x="1096" y="263">$9K–$20K+</text>
        </g>
        <g fontSize="10" fill="#9a9ca0" fillOpacity="0.85">
          <text x="876" y="546">STOCK</text>
          <text x="876" y="562">REFRESH</text>
          <text x="986" y="546">PERFORMANCE</text>
          <text x="986" y="562">BUILD</text>
          <text x="1096" y="546">CRATE +</text>
          <text x="1096" y="562">INSTALL</text>
        </g>
      </g>
      <text
        x="1140"
        y="136"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        TYPICAL CAD · BEFORE GST · NOT A QUOTE
      </text>

      {/* plate caption */}
      <text
        x="600"
        y="608"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. A — ONE SHORT-BLOCK, THREE BUDGETS
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        In 2026 Canadian dollars, a stock rebuild of a common V8 typically runs{" "}
        <strong>$5,000 to $10,000</strong> with parts, machining, and labour included. A
        performance build typically lands between <strong>$10,000 and $25,000</strong> and climbs
        with ambition. Machining is the wildcard — the honest number does not exist until the
        block is stripped, cleaned, and measured.
      </p>

      <h2>What does an engine rebuild cost in Canada?</h2>
      <p>
        It depends on which of three jobs is hiding under the word. &ldquo;Rebuild&rdquo; is the
        least standardized term in this trade — it covers everything from a gasket-and-bearings
        freshening to a blueprinted performance engine, and the budgets are not neighbours. The
        honest comparison looks like this:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Stock refresh versus performance build versus crate engine replacement, compared by
            goal, typical scope, and typical Canadian dollar range
          </caption>
          <thead>
            <tr>
              <th scope="col">Tier</th>
              <th scope="col">The goal</th>
              <th scope="col">Typical scope</th>
              <th scope="col">Typical range (CAD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Stock refresh</th>
              <td>Back to factory spec, healthy and tight</td>
              <td>Bore and hone, new pistons or rings, bearings, gaskets, oil pump, stock-grind
                cam, valve job</td>
              <td className="num">$5,000 – $10,000</td>
            </tr>
            <tr>
              <th scope="row">Performance build</th>
              <td>More power than the factory ever shipped</td>
              <td>Forged or upgraded rotating assembly, ported or aftermarket heads, cam and
                valvetrain, balancing, better fasteners</td>
              <td className="num">$10,000 – $25,000+</td>
            </tr>
            <tr>
              <th scope="row">Crate replacement</th>
              <td>New engine, old one retired</td>
              <td>Assembled crate engine plus swap-over of accessories, install, fluids, and
                break-in</td>
              <td className="num">$9,000 – $20,000+ installed</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Three things move a job inside those ranges: the condition of the core, how far the
        machining has to go, and parts availability for your engine family. A small-block Chevy
        swims in cheap parts; a flathead or an orphan straight-six does not, and the same wear
        costs more to fix. All of these are planning ranges, not quotes — and they sit alongside
        the wider numbers in the <Link href="/guides/costs">restoration cost guide</Link>, which
        covers the rest of the car.
      </p>

      <h2>What does machine-shop work cost in Alberta?</h2>
      <p>
        A builder and a machinist are two different trades. The builder specs, measures, and
        assembles; the machine shop makes worn castings round, flat, and true again on equipment
        most garages will never own. It is a century-old specialist profession with its own
        technical association — AERA, the Engine Builders Association, has been publishing
        specifications and standards for machinists since 1922.
        <a href="#src-1" className="cite-ref">[1]</a> Nobody rebuilds an engine alone.
      </p>
      <p>
        Typical Alberta planning ranges for the common operations, in CAD:
      </p>
      <ul>
        <li>
          <strong>Clean, magnaflux, and inspect — $200 to $450.</strong> Hot-tanking and
          crack-checking come first, because there is no point machining a cracked block. This is
          the cheapest bad news you will ever buy.
        </li>
        <li>
          <strong>Bore and hone — $400 to $800 for a V8.</strong> Oversize the cylinders and
          finish them with the crosshatch the new rings need. Add a torque plate for a
          performance build and the number sits at the top of the range.
        </li>
        <li>
          <strong>Deck the block — $200 to $400.</strong> A flat deck is what head gaskets seal
          against. Skipping it to save money is how fresh engines weep coolant.
        </li>
        <li>
          <strong>Crankshaft — $100 to $500.</strong> A healthy crank needs only a polish. A
          scored or worn one gets ground undersize; one that has run a bearing too long may be
          scrap, and that discovery changes the budget.
        </li>
        <li>
          <strong>Rod reconditioning — $250 to $500.</strong> Resized big ends and new bolts, or
          replacement with aftermarket rods when the price gap closes, which it often does.
        </li>
        <li>
          <strong>Cylinder heads — $650 to $1,300.</strong> A valve job typically runs $500 to
          $1,000 and surfacing $150 to $300. Hardened seats for unleaded fuel on an older head
          add more.
        </li>
        <li>
          <strong>Balance the rotating assembly — $400 to $700.</strong> Optional on a stock
          refresh, not negotiable on a performance build that will live above five grand.
        </li>
      </ul>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$1.5K–$4K</span>
          <span className="stat-l">Typical full machining package, common V8</span>
        </div>
        <div>
          <span className="stat-v">$400–$800</span>
          <span className="stat-l">Typical V8 bore and hone</span>
        </div>
        <div>
          <span className="stat-v">4–12 wk</span>
          <span className="stat-l">Realistic calendar, teardown to fired engine</span>
        </div>
        <div>
          <span className="stat-v">10–30%</span>
          <span className="stat-l">Contingency the teardown usually claims</span>
        </div>
      </div>
      <p>
        The Alberta reality is the queue, not the price. The good machine shops here stay booked
        on agricultural, industrial, and oilfield work as well as hot rods, and a few weeks in
        line is normal. That is one more reason engine work belongs in the winter build season —
        the queue runs while the snow flies, and the car is fired and sorted before May.
      </p>

      <h2>Where do rebuild budgets actually blow up?</h2>
      <p>
        Almost never on the parts list. Budgets die in three specific places, and every one of
        them is survivable if it was in the plan.
      </p>
      <p>
        <strong>Machining you did not plan for.</strong> The estimate is written before the
        teardown; the truth arrives after it. A crack in a cylinder wall, a crank ground once
        already, valve guides gone past reaming — none of it shows until the block is hot-tanked
        and measured. Hagerty&rsquo;s long-running Ferrari Dino project is the canonical example:
        a rebuild that walked its own budget through the wall once the engine was opened and the
        quad-cam reality was on the bench.<a href="#src-2" className="cite-ref">[2]</a> The
        cure is not optimism, it is a contingency — ten to thirty percent held back, ready.
      </p>
      <blockquote>
        <p>An estimate written before teardown is a guess with a dollar sign on it.</p>
        <footer>Shop rule, repeated at every intake</footer>
      </blockquote>
      <p>
        <strong>Fasteners and the small hard parts.</strong> Torque-to-yield bolts are one-use by
        design. Add rod bolts, head bolts or studs, a balancer, seals, freeze plugs, and the
        brackets that snapped on disassembly, and a quiet thousand dollars materializes. Bearings
        and rings are precision components engineered to survive specific loads — this is the
        wrong place for the bargain bin, which is why serious builders spec name-brand hard parts
        such as MAHLE&rsquo;s Clevite bearing line and price them in from day one.
        <a href="#src-3" className="cite-ref">[3]</a>
      </p>
      <p>
        <strong>&ldquo;While we&rsquo;re in there.&rdquo;</strong> The most expensive sentence in
        the building. Some of it is legitimate — a $60 rear main seal absolutely gets done while
        the crank is out. But a stock refresh that picks up a cam, then heads, then an intake,
        then a converter is a performance build being bought one surprise at a time, at retail.
        Decide the tier before the teardown, write down where the line is, and make anything past
        it a phone call, not an assumption.
      </p>

      <h2>Is a crate engine cheaper than rebuilding?</h2>
      <p>
        Often, yes — and sometimes the honest answer is a crate motor. For common engine
        families the math is brutal: GM alone sells new, assembled small-block, big-block, LS,
        and LT crate engines straight off the shelf,<a href="#src-4" className="cite-ref">[4]</a>{" "}
        and a landed entry small-block commonly runs $5,000 to $9,000 CAD, with modern EFI
        LS-class crates commonly $11,000 to $18,000 before accessories. When your core needs a
        crank, a bore, and new heads, rebuilding it can cost more than a fresh engine with zero
        kilometres on it.
      </p>
      <p>
        The crate wins on budget certainty: one part number, one price, no teardown surprises.
        The rebuild wins in three situations. First, originality — a numbers-matching engine in a
        collectible car is worth rebuilding at almost any sane cost, because the engine is part
        of the car&rsquo;s identity and value. Second, no crate exists — nobody sells a new
        nailhead, flathead, or vintage straight-six, so those engines get rebuilt or they get
        swapped. Third, character — if you want the sound and manners the car was born with, a
        rebuild is the only product that sells it.
      </p>
      <p>
        There is a Canadian line item either way: most crates and most parts cross the border,
        so exchange, freight, and brokerage belong in the comparison from the start, not as a
        surprise on the invoice.
      </p>

      <h2>How do you break in a fresh engine?</h2>
      <p>
        Deliberately, because the first twenty minutes decide whether the money was well spent.
        Before first fire the oil system gets primed so the bearings are never run dry. If the
        build uses a flat-tappet camshaft — most vintage engines do — the cam and lifters must
        break in immediately: straight up to roughly 2,000 to 2,500 rpm, varied, for 20 to 30
        minutes, on a high-zinc break-in oil, exactly as the cam manufacturers&rsquo; own
        bulletins prescribe.<a href="#src-5" className="cite-ref">[5]</a> Idling a fresh
        flat-tappet engine is how lobes get wiped in the first half hour.
      </p>
      <p>
        Rings seat under load. After the cam is safe, the engine wants moderate, varied throttle
        — acceleration and deceleration cycles, no lugging, no hour of idling in the driveway.
        Then the break-in oil and filter come out, because they are full of the metal a new
        engine sheds, and the first heat cycles get followed by a re-torque and a leak check.
        This is the opposite problem from waking an engine that sat for twenty years — that
        protocol, and why you never just turn the key on one, is in the{" "}
        <Link href="/blog/barn-find-first-steps">barn find first steps guide</Link>.
      </p>

      <h2>Rebuild or swap — which is right for your car?</h2>
      <p>
        A rebuild returns the engine your car was born with. A swap replaces it with a modern
        drivetrain — typically an LS — and typically runs $15,000 to $35,000 CAD done properly,
        which buys fuel injection, overdrive, minus-thirty cold starts, and a parts counter in
        every town in Alberta. The full money breakdown lives in the{" "}
        <Link href="/blog/ls-swap-cost-canada">LS swap cost guide</Link>; how the work is
        structured lives on the{" "}
        <Link href="/services/engine-swaps-builds">engine swaps and builds service page</Link>.
      </p>
      <p>
        The decision is three questions. Is the engine original to a car where originality is the
        value? Rebuild it — modification erases what a collector pays for. Do you want the
        character of the original engine — the sound, the carburetor, the era? Rebuild, because a
        swap cannot sell you that at any price. Do you mostly want to drive the car — commutes,
        road trips, July evenings — with modern manners? Then the swap usually returns more per
        dollar, and pretending otherwise would be an upsell in the wrong direction.
      </p>
      <p>
        Either way, the process starts the same: photos and a compression story in, honest scope
        out. Send what you have through the <Link href="/quote">quote page</Link> and you will
        get a straight answer — including, when it is true, that your engine needs a tune-up and
        a valve adjustment, not a rebuild. You will get that answer too.
      </p>
    </>
  );
}
