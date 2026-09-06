import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — When No One Makes the Panel.
 * The metalwork-conversion wedge for the orphan-make and no-repro keyword
 * cluster. Links down into the body and paint service, the restoration
 * service, the barn-find protocol, the timeline article, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "metal-fabrication-no-repro-panels",
  title: "When No One Makes the Panel: Custom Metal Fabrication for Classics",
  accent: "Fabrication",
  metaTitle: "Custom Metal When No Repro Panels",
  description: "No reproduction panels for your classic? How a shop hand-forms new steel over bucks, splices donor metal, and what that costs in CAD versus waiting for parts.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Body & Paint",
  targetKeywords: [
    "custom sheet metal fabrication classic car",
    "no reproduction panels available",
    "hand formed body panels",
    "metal shaping classic car",
    "custom body panels Edmonton",
  ],
  faq: [
    {
      q: "What do you do when no reproduction panels exist for your classic car?",
      a: "You have three working options, and a fabrication shop uses all of them. Repair the original panel if enough sound metal remains. Splice in clean steel cut from a donor car that shares the stamping, butt-welded in so the seam disappears. Or have the panel hand-formed from flat stock, shaped with shrinking and stretching over a buck or hammer form until it matches the original contour. Waiting for a reproduction run that has never been announced is not an option — it is a stalled project.",
    },
    {
      q: "How much does custom metal fabrication cost for a classic car?",
      a: "In Alberta, specialty metalwork commonly bills in the range of $100 to $160 CAD per bench hour, and the panel's shape sets the hours. A flat or single-curve patch panel typically lands around $400 to $1,500. A larger section — a cab corner, a door skin, a fender arch — commonly runs $1,500 to $4,000. A full compound-curved panel formed from flat stock can take a skilled craftsman dozens of hours and commonly runs $3,000 to $10,000 or more. All of these are planning ranges, not quotes; the honest number comes after the shop sees the metal.",
    },
    {
      q: "Can you use body panels from a donor car?",
      a: "Often, and when the stamping is shared it is usually the cheapest good path. Factory panels carry the correct crowns and character lines for free, which is exactly the part of hand-forming that costs the most. The section is cut oversize from the donor, trimmed to a tight butt joint against sound metal on your car, and welded tack by tack to control heat. Prairie-dry Alberta and Saskatchewan donor cars tend to carry far less rot than eastern road-salt cars, which is one genuine local advantage.",
    },
    {
      q: "Is it better to repair the original panel or fabricate a new one?",
      a: "Repair wins while the original panel is mostly sound metal with local rust or damage — it preserves the factory stamping, and it is nearly always cheaper. Fabrication wins when rust has taken the shape itself: perforation across a large area, rot through the character lines, or previous repairs layered in filler and brazing. The deciding question is not how bad the paint looks but how much clean, full-thickness steel is left once the panel is stripped. Media blasting or stripping answers that before anyone commits money.",
    },
    {
      q: "What gauge steel are classic car body panels?",
      a: "Most North American classics were stamped from roughly 19- to 20-gauge mild steel, about 0.9 to 1.1 millimetres thick. Fabricators commonly form replacement panels from 19-gauge cold-rolled draw-quality steel because it moves predictably under shrinking and stretching and welds cleanly to the original metal. Matching thickness at the joint matters more than the exact gauge number — welding thin old steel to noticeably thicker new steel concentrates heat and distortion at the seam.",
    },
  ],
  citations: [
    {
      name: "“Get Started Fabricating Sheet Metal with the English Wheel,” Eastwood Garage technical library, May 2024",
      url: "https://www.eastwood.com/garage/get-started-fabricating-sheet-metal-with-the-english-wheel/",
    },
    {
      name: "“Body by Moal: This family metal-shaping outfit has been at it for more than a century,” Hagerty Media",
      url: "https://www.hagerty.com/articles-videos/articles/2019/11/28/moal-family-metal-shaping-outfit",
    },
    {
      name: "Ron Covell, “How to MIG and TIG Weld Auto Body Sheet Metal,” Miller Electric resource library",
      url: "https://www.millerwelds.com/resources/article-library/how-to-mig-and-tig-weld-auto-body-sheet-metal-with-ron-covell",
    },
    {
      name: "Ron Covell, “This Tucker-Based Concept Shows the Future of Custom Bodywork,” Hagerty Media, March 2025",
      url: "https://www.hagerty.com/media/maintenance-and-tech/this-tucker-based-concept-shows-the-future-of-custom-bodywork/",
    },
    {
      name: "“Automotive repair activities,” Alberta Motor Vehicle Industry Council (AMVIC)",
      url: "https://www.amvic.org/business/business-licence/automotiverepairactivities/",
    },
  ],
  internalLinks: [
    "/blog/barn-find-first-steps",
    "/services/body-paint-metalwork",
    "/blog/classic-car-restoration-timeline",
    "/services/classic-car-restoration",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * The no-repro workflow as a shop plate: flat 19-gauge stock with shrink and
 * stretch zones marked, an English wheel in section with a panel riding
 * between the wheels, a station buck with a formed panel draped over it for
 * the truth check, and below, a donor splice meeting at a tacked butt weld.
 * Steel line art, tungsten accents, every label mono.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of hand-forming a body panel when no reproduction exists: a sheet of flat 19-gauge steel marked with shrink and stretch zones, an English wheel in cross-section with a curved panel passing between its wheels, a wooden station buck with a formed fender panel draped over it for fit checking, and a donor-steel splice below meeting at a butt weld joined tack by tack"
      className="h-auto w-full"
    >
      <title>Nobody stamps it, so the shop forms it — flat stock to compound curve</title>
      <defs>
        <radialGradient id="mf-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the bench */}
      <ellipse cx="600" cy="560" rx="400" ry="32" fill="url(#mf-pool)" />

      {/* ══ STAGE 1 — FLAT STOCK ══ */}
      {/* sheet in shallow perspective */}
      <path
        d="M 78 300 L 290 258 L 344 356 L 132 402 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* layout grid on the sheet */}
      <g stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.4" fill="none">
        <path d="M 131 289 L 187 388" />
        <path d="M 184 279 L 240 377" />
        <path d="M 237 268 L 293 367" />
        <path d="M 96 333 L 308 289" />
        <path d="M 114 367 L 326 322" />
      </g>
      {/* shrink zone — hatched wedge, upper left of sheet */}
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" fill="none" strokeLinecap="round">
        <path d="M 118 296 L 138 292" />
        <path d="M 122 306 L 148 301" />
        <path d="M 126 316 L 158 310" />
      </g>
      {/* stretch zone — radial fan, lower right of sheet */}
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" fill="none" strokeLinecap="round">
        <path d="M 268 340 L 296 330" />
        <path d="M 270 350 L 300 344" />
        <path d="M 272 360 L 302 358" />
      </g>
      <text
        x="90"
        y="268"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#ffb066"
      >
        SHRINK
      </text>
      <text
        x="286"
        y="392"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#ffb066"
      >
        STRETCH
      </text>

      {/* flow arrow 1 → 2 */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55" fill="none" strokeLinecap="round">
        <line x1="366" y1="322" x2="424" y2="316" strokeDasharray="3 5" />
        <path d="M 416 310 L 426 316 L 417 322" />
      </g>

      {/* ══ STAGE 2 — ENGLISH WHEEL ══ */}
      {/* C-frame, opening left */}
      <path
        d="M 542 206 L 542 176 Q 542 148 574 148 L 668 148 Q 712 148 712 194 L 712 402 Q 712 448 668 448 L 574 448 Q 542 448 542 420 L 542 388"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* upper wheel — large, flat-faced */}
      <circle cx="542" cy="252" r="42" fill="none" stroke="#9a9ca0" strokeWidth="1.8" />
      <circle cx="542" cy="252" r="5" fill="none" stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.7" />
      {/* lower anvil wheel — small, convex */}
      <circle cx="542" cy="336" r="20" fill="none" stroke="#9a9ca0" strokeWidth="1.8" />
      <circle cx="542" cy="336" r="3.5" fill="none" stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.7" />
      {/* adjuster screw under the anvil */}
      <g stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.6" fill="none">
        <line x1="542" y1="356" x2="542" y2="388" />
        <line x1="534" y1="368" x2="550" y2="368" />
        <line x1="534" y1="378" x2="550" y2="378" />
      </g>
      {/* the panel riding between the wheels, gaining crown */}
      <path
        d="M 428 314 Q 542 290 664 306"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* wheeling tracks on the panel */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none" strokeLinecap="round">
        <path d="M 452 322 Q 542 300 640 312" strokeDasharray="2 5" />
        <path d="M 448 306 Q 542 282 648 298" strokeDasharray="2 5" />
      </g>

      {/* flow arrow 2 → 3 */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55" fill="none" strokeLinecap="round">
        <line x1="736" y1="316" x2="794" y2="322" strokeDasharray="3 5" />
        <path d="M 786 316 L 796 322 L 787 328" />
      </g>

      {/* ══ STAGE 3 — STATION BUCK ══ */}
      {/* base rail */}
      <line x1="822" y1="430" x2="1136" y2="430" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      {/* station profiles — fender silhouette rising and falling */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4" strokeLinecap="round">
        <path d="M 846 430 L 846 392 Q 846 372 862 368" />
        <path d="M 902 430 L 902 360 Q 902 336 922 332" />
        <path d="M 958 430 L 958 344 Q 958 318 978 316" />
        <path d="M 1014 430 L 1014 352 Q 1014 328 1034 326" />
        <path d="M 1070 430 L 1070 376 Q 1070 356 1088 352" />
        <path d="M 1118 430 L 1118 404 Q 1118 392 1130 390" />
      </g>
      {/* stringers tying the stations together */}
      <g stroke="#9a9ca0" strokeWidth="0.9" strokeOpacity="0.5" fill="none">
        <path d="M 846 412 L 1118 416" />
        <path d="M 862 368 Q 978 312 1130 390" />
      </g>
      {/* the formed panel draped over the buck for the truth check */}
      <path
        d="M 830 384 Q 900 320 978 308 Q 1058 298 1136 366"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="8 5"
      />

      {/* ══ BELOW — DONOR SPLICE ══ */}
      {/* left panel: your car's sound steel */}
      <path
        d="M 396 552 L 586 540 L 590 596 L 402 606 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* right panel: the donor section */}
      <path
        d="M 614 538 L 802 548 L 796 602 L 618 594 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* shared character line running through both */}
      <g stroke="#9a9ca0" strokeWidth="0.9" strokeOpacity="0.5" fill="none">
        <path d="M 410 578 L 584 568" />
        <path d="M 616 566 L 790 574" />
      </g>
      {/* the butt joint, tacked */}
      <line x1="600" y1="536" x2="602" y2="600" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="4 4" />
      <g fill="#ffb066" fillOpacity="0.85">
        <circle cx="600.3" cy="546" r="2.2" />
        <circle cx="600.8" cy="561" r="2.2" />
        <circle cx="601.2" cy="576" r="2.2" />
        <circle cx="601.7" cy="591" r="2.2" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 208, y: 214, n: "1" },
          { x: 628, y: 220, n: "2" },
          { x: 978, y: 258, n: "3" },
          { x: 350, y: 574, n: "4" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>
      {/* pin leaders */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 208 227 L 200 268" />
        <path d="M 628 233 L 600 288" />
        <path d="M 978 271 L 978 302" />
        <path d="M 363 574 L 392 576" />
      </g>

      {/* ══ MONO LABELS ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="78" y="442" fill="#9a9ca0" fillOpacity="0.7">
          1 · 19-GA FLAT STOCK — LAID OUT
        </text>
        <text x="470" y="486" fill="#9a9ca0" fillOpacity="0.7">
          2 · ENGLISH WHEEL — CROWN &amp; SMOOTH
        </text>
        <text x="836" y="470" fill="#9a9ca0" fillOpacity="0.7">
          3 · STATION BUCK — THE TRUTH GAUGE
        </text>
        <text x="396" y="632" fill="#ffb066">
          4 · DONOR SPLICE — BUTT WELD, TACK BY TACK
        </text>
      </g>

      {/* plate caption */}
      <text
        x="600"
        y="76"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. K — NOBODY STAMPS IT, SO THE SHOP FORMS IT
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        When nobody stamps a reproduction panel for your classic, you have three real options:
        repair the original steel, splice in clean donor metal from a parts car, or have the panel
        <strong> hand-formed</strong> from flat stock over a buck. All three are normal work in a
        fabrication shop — and all three beat waiting for a reproduction run that never comes.
      </p>

      <h2>Why can&rsquo;t I buy reproduction panels for my classic?</h2>
      <p>
        Reproduction panels exist where the math works. Stamping dies cost serious money, so the
        aftermarket tools up for cars with enormous surviving populations — Mustangs, Camaros,
        Tri-Five Chevs, square-body pickups. Own one of those and nearly every panel is a phone
        call away. Own a Studebaker, a Hudson, an early import, or one of the Canada-only badges
        this country actually produced — Meteor, Monarch, Fargo — and the catalogue goes quiet.
        Nobody is cutting dies for a market of a few hundred cars.
      </p>
      <p>
        The trap catches even well-supported cars. Coverage is never complete: the quarter panel
        is reproduced but the cab corner is not, or the repro exists for the two-door and your car
        is a four-door. And plenty of what is sold as a &ldquo;panel&rdquo; is a shallow patch
        skin that stops exactly where your rust does not. The honest starting point is knowing how
        much sound metal you actually have, which is why the{" "}
        <Link href="/blog/barn-find-first-steps">barn-find protocol</Link> puts assessment before
        disassembly — the answer decides whether you need repair, a splice, or a whole new panel.
      </p>

      <h2>How is a body panel made from flat steel?</h2>
      <p>
        By moving metal, not bending it. A compound curve — a surface that curves in two
        directions at once, which is most of any fender — cannot be folded into existence. The
        metal has to be <strong>shrunk</strong> in some places and <strong>stretched</strong> in
        others until the flat sheet takes the shape on its own. Fabricators commonly start with
        19-gauge cold-rolled draw-quality steel, around a millimetre thick, close to what the
        factories stamped and forgiving under the hammer.
      </p>
      <p>
        The tools have not changed much in a century. Hammer and dolly, a shot bag and mallet for
        roughing in crown, a shrinker-stretcher for flanges and curved edges, and the English
        wheel — two hardened wheels in a rigid frame that the sheet rolls between, raising smooth,
        sweeping compound curves that no other hand machine produces. Reading the panel and
        knowing where to work it is a feel developed only through practice.
        <a href="#src-1" className="cite-ref">[1]</a> This is coachbuilding, the same craft that
        built car bodies before stamping plants existed, and the handful of shops still practising
        it at the top level work the same way: metal hand-hammered and wheeled over forms until it
        flows.<a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <blockquote>
        <p>The wheel does not shape the panel. Shrinking and stretching shape the panel. The wheel makes it smooth.</p>
        <footer>Bench rule, taped above the wheel</footer>
      </blockquote>
      <h3>What is a buck, and when does a panel need one?</h3>
      <p>
        A buck is the truth gauge — a wooden or MDF skeleton of stations cut to the finished
        contour, so the panel can be offered up again and again as it forms. Small parts often use
        a hammer form instead: a solid pattern the metal is worked directly over, which makes
        repeatable flanges and matched left-and-right pairs. A simple patch needs neither; the
        original panel is its own pattern. A full fender, a nose section, or anything being built
        without an intact original to copy earns a buck, because on a surface that curves in two
        directions your eye lies and the buck does not.
      </p>

      <h2>When is donor steel the smarter play?</h2>
      <p>
        Whenever the stamping still exists on another car. Factories shared panels across years,
        models, and badges, and a clean used section carries the correct crowns, character lines,
        and factory edges — precisely the features that cost the most bench time to form by hand.
        Western Canada helps you here: prairie-dry Alberta and Saskatchewan parts cars tend to
        carry a fraction of the rot that eastern road-salt cars do, and farm-belt classifieds
        still turn up solid donors every season.
      </p>
      <p>
        The work is in the joint. The donor section gets cut oversize, clamped over your panel,
        scribed, and both get trimmed to a tight butt joint — butt welds are preferred over
        overlapped seams because a lap joint traps moisture and starts the next rust problem, and
        a single-thickness seam is far easier to straighten after welding.
        <a href="#src-3" className="cite-ref">[3]</a> Then it is welded a tack at a time, letting
        the panel cool between tacks, and the seam planished and metal-finished until it
        disappears. Thin old steel warps fast under heat; patience at the welder is most of the
        skill. Matching metal thickness matters too — a donor of the same gauge welds and finishes
        like one panel instead of two.
      </p>

      <h2>What does hand-formed metal cost versus waiting for parts?</h2>
      <p>
        Bench time is the price. Alberta specialty shops commonly bill somewhere in the range of
        $100 to $160 CAD an hour, and the shape sets the hours: a flat patch is quick, a shallow
        single curve is reasonable, and a compound-curved panel formed from flat stock can take
        even a skilled craftsman dozens of hours — a proficiency that itself takes years to build.
        <a href="#src-4" className="cite-ref">[4]</a> Typical planning ranges in Canadian dollars,
        not quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Four routes to replacing a body panel no one reproduces — repairing the original,
            splicing donor steel, hand-forming a patch, and hand-forming a complete panel —
            compared with waiting for reproduction parts, by typical Canadian dollar cost,
            typical timeline, and the main catch of each route
          </caption>
          <thead>
            <tr>
              <th scope="col">Route</th>
              <th scope="col">Typical cost (CAD)</th>
              <th scope="col">Typical timeline</th>
              <th scope="col">The catch</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Repair the original panel</th>
              <td className="num">$300 – $1,200</td>
              <td>Days</td>
              <td>Only works while sound metal outnumbers rust</td>
            </tr>
            <tr>
              <th scope="row">Splice in donor steel</th>
              <td className="num">$200 – $800 donor + $500 – $2,000 bench</td>
              <td>Weeks — finding the donor is the timeline</td>
              <td>Thickness and trim lines must match</td>
            </tr>
            <tr>
              <th scope="row">Hand-form a patch section</th>
              <td className="num">$400 – $1,500</td>
              <td>Days to weeks</td>
              <td>Complex character lines push it upward</td>
            </tr>
            <tr>
              <th scope="row">Hand-form the full panel</th>
              <td className="num">$3,000 – $10,000+</td>
              <td>Weeks to months</td>
              <td>Compound curvature is the whole bill</td>
            </tr>
            <tr>
              <th scope="row">Wait for NOS or a repro run</th>
              <td className="num">Part price — if it ever ships</td>
              <td>Unbounded</td>
              <td>The project stalls and the rust does not</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The spread inside each range is the panel itself. A door skin is mostly gentle crown and
        sits low; a fender with a peaked arch, rolled lip, and swage line sits high, because every
        one of those features is separate forming and finishing work. Where the original panel
        still exists in any condition, keep it — even a rotten original is a priceless pattern,
        and working from a pattern is always cheaper than working from photographs.
      </p>

      <h2>Should you just wait for reproduction parts instead?</h2>
      <p>
        Sometimes — but be honest about the odds. Waiting makes sense when a reputable
        manufacturer has announced the panel with a shipping date, or when the flaw is cosmetic on
        a car you are driving anyway. Waiting fails as a plan when it means a disassembled car
        holding a garage hostage for years while you refresh auction listings for NOS that may
        arrive dented, rusted, or never. Announced repro runs get cancelled when pre-orders come
        up short, and orphan makes are exactly the runs that come up short. A car apart and
        waiting is also a car deteriorating and losing momentum — the quiet project-killer the{" "}
        <Link href="/blog/classic-car-restoration-timeline">restoration timeline article</Link>{" "}
        walks through in detail. Fabrication converts an open-ended wait into a scheduled line
        item, and that certainty is a real part of what you are buying.
      </p>

      <h2>How do you pick a shop that can actually do this?</h2>
      <p>
        Paper first: in Alberta, any business doing automotive repair — bodywork included — must
        hold a valid AMVIC licence, so check that before anything else.
        <a href="#src-5" className="cite-ref">[5]</a> Then look past the finished-car photos,
        because paint hides everything. Ask to see raw metalwork in progress: a panel on a buck,
        a weld seam planished but unfilled, hammer marks before the filler goes on. Ask how they
        joint panels — butt welds, tack by tack — and what they do about thickness matching. A
        shop proud of its bare metal will show you without being asked; that willingness is the
        best credential in the industry.
      </p>
      <p>
        This is exactly the work our{" "}
        <Link href="/services/body-paint-metalwork">metal, body, and paint service</Link> exists
        for, whether it is one cab corner on a driver or every panel on a{" "}
        <Link href="/services/classic-car-restoration">frame-off restoration</Link>. If your
        classic needs steel nobody makes, send photos of the rust, the make and model, and what
        the car means to you through the <Link href="/quote">quote page</Link>. You will get a
        straight answer on which route fits — repair, splice, or hand-formed — and an honest
        range before any metal gets cut.
      </p>
    </>
  );
}
