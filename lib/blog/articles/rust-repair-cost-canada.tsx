import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Rust Repair Cost Canada.
 * The body-and-paint conversion wedge for the rust keyword cluster. Teaches an
 * owner to read a rust quote instead of fearing it — patch versus panel versus
 * fabrication, and why the number moves after blasting. Links down into the
 * metal/body/paint service, the restoration timeline, the barn-find protocol,
 * the out-of-province inspection explainer, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "rust-repair-cost-canada",
  title:
    "Rust Repair on a Classic: Patch Panels, Full Panels, and Honest CAD Numbers",
  accent: "Honest",
  metaTitle: "Classic Rust Repair Cost in Canada",
  description: "What rust repair really costs on a classic in Canada — patch panels, full panels, and hand fabrication — and why honest estimates move once the paint comes off.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Body & Paint",
  targetKeywords: [
    "rust repair cost classic car",
    "patch panel vs replacement panel",
    "classic car rust repair Edmonton",
    "how much rust is too much",
    "classic car rust repair cost Canada",
  ],
  faq: [
    {
      q: "How much does rust repair cost on a classic car in Canada?",
      a: "As planning ranges in Canadian dollars: a single welded patch panel, finished and refinished, typically runs $300 to $900; a cluster of repairs across one area with paint blending runs $1,000 to $2,500; a full quarter panel installed and painted runs $2,500 to $6,000 or more; and hand fabrication where no reproduction panel exists bills at shop rate, commonly $110 to $160 per hour in the Edmonton area, for ten to forty-plus hours per panel. The honest number always comes after the paint and filler are off.",
    },
    {
      q: "What is the difference between a patch panel and a replacement panel?",
      a: "A patch panel is a small stamped or hand-made section that covers only the damaged area — it gets welded into surrounding steel that is still sound. A full replacement panel is the entire stamping, fitted at the factory seams. The extent of the rust decides which one is right: a quarter-size hole in an otherwise solid panel takes a patch, while widespread perforation or deep pitting across the panel justifies replacing the whole thing.",
    },
    {
      q: "How much rust is too much to fix?",
      a: "Mechanically, almost nothing is unfixable — steel can always be cut out and replaced. The real question is money against the finished value of the car. The line that matters is structural: rust in frame rails, suspension and spring mounts, floor supports, or the rockers of a unibody changes the job from bodywork to structural repair, and the budget with it. Walk away when the repair bill clearly exceeds what the finished car is worth — unless the car is family, in which case the math was never the point.",
    },
    {
      q: "Why do rust repair estimates change after blasting?",
      a: "Because paint, filler, and undercoating hide the true edges of the damage. Rust spreads under coatings and inside seams where no flashlight reaches, and the bubble you can see is the smallest part of it. Media blasting strips everything back to bare steel and shows exactly where the metal ends, which is why a fair shop quotes the visible work firm, names the hidden areas as unknowns, and prices those only after the shell is stripped.",
    },
    {
      q: "Is Alberta hard on classic cars for rust?",
      a: "Kinder than Ontario or Quebec, but not kind. Alberta winters still put salt and brine on the roads every year, chinook thaw-freeze cycles keep slush wet through the season, and a heated garage with a snow-covered car in it is a corrosion chamber. On top of that, a large share of Alberta classics were imported from wetter provinces or salt-state America, so the sheet metal often arrived with history. Assume nothing until the underside has been inspected on a hoist.",
    },
  ],
  citations: [
    {
      name: "“A Beginner’s Guide to Rust Repair Body Panels,” Raybuck Auto Body Parts technical guide",
      url: "https://raybuck.com/a-beginners-guide-to-rust-repair-body-panels-for-your-vehicle/",
    },
    {
      name: "“How Much Does It Cost to Restore a Classic Car?,” Hagerty",
      url: "https://www.hagerty.com/resources/car-restoration/how-much-does-it-cost-to-restore-a-classic-car",
    },
    {
      name: "Code of Practice for the Environmental Management of Road Salts (En49-31/1-5E), Government of Canada Publications",
      url: "https://publications.gc.ca/site/eng/9.616812/publication.html",
    },
    {
      name: "“Out-of-Province Vehicle Inspections,” Government of Alberta",
      url: "https://www.alberta.ca/out-of-province-vehicle-inspections",
    },
  ],
  internalLinks: [
    "/blog/classic-car-restoration-timeline",
    "/services/body-paint-metalwork",
    "/blog/barn-find-first-steps",
    "/blog/out-of-province-inspection-edmonton",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * A classic hardtop coupe in side elevation, drawn as steel line art, with the
 * six places a body rots pinned in tungsten and numbered to match the article.
 * Each visible blister gets a small solid dot — and a much larger dashed halo
 * showing how far the rust actually runs under the paint, which is the whole
 * argument of the piece. Legend bottom-left, plate caption in the shop style.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Side elevation diagram of a classic two-door hardtop in steel line art with six numbered tungsten pins marking common rust points — rocker panel, door skin bottom, quarter panel and wheel arch, cowl and glass channel, front fender lip, and floor and trunk pans — each shown as a small solid blister dot surrounded by a much larger dashed halo indicating the true extent of corrosion revealed by media blasting"
      className="h-auto w-full"
    >
      <title>One body side, six places it rots — and how far the rust really runs</title>
      <defs>
        <radialGradient id="rr-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the car */}
      <ellipse cx="590" cy="556" rx="400" ry="34" fill="url(#rr-pool)" />

      {/* ══ BODY — upper profile ══ */}
      <path
        d="M 150 436 L 156 402 Q 158 392 172 390 L 330 380 Q 352 378 366 364 L 428 306 Q 436 296 452 294 L 706 294 Q 726 294 740 306 L 800 362 Q 814 374 838 378 L 1010 386 Q 1026 388 1028 398 L 1034 436"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* lower rocker line with wheel arches */}
      <path
        d="M 150 436 L 146 458 L 172 468 L 240 468 A 64 64 0 0 1 368 468 L 786 468 A 64 64 0 0 1 914 468 L 1006 464 L 1034 452 L 1034 436"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* glass — windshield, side glass, rear glass */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6" strokeLinecap="round">
        <path d="M 438 310 L 462 372" />
        <path d="M 452 306 L 700 306 L 700 372 L 476 372 Z" />
        <path d="M 728 308 L 786 364" />
      </g>
      {/* belt line + door seams + handle */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round">
        <line x1="172" y1="396" x2="1016" y2="390" />
        <path d="M 462 380 L 462 464" />
        <path d="M 704 380 L 710 464" />
        <line x1="600" y1="404" x2="632" y2="404" strokeWidth="1.6" strokeOpacity="0.55" />
      </g>

      {/* ══ WHEELS ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6">
        <circle cx="304" cy="470" r="44" />
        <circle cx="850" cy="470" r="44" />
        <circle cx="304" cy="470" r="16" strokeWidth="1" strokeOpacity="0.55" />
        <circle cx="850" cy="470" r="16" strokeWidth="1" strokeOpacity="0.55" />
      </g>

      {/* ══ RUST POINTS — solid blister, dashed true extent ══ */}
      {/* 1 · rocker under the door */}
      <circle cx="600" cy="463" r="3.2" fill="#ffb066" fillOpacity="0.9" />
      <ellipse cx="600" cy="463" rx="72" ry="13" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 5" />
      {/* 2 · door skin bottom corner */}
      <circle cx="692" cy="450" r="3.2" fill="#ffb066" fillOpacity="0.9" />
      <ellipse cx="686" cy="450" rx="44" ry="16" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 5" />
      {/* 3 · quarter panel behind the rear arch */}
      <circle cx="952" cy="442" r="3.2" fill="#ffb066" fillOpacity="0.9" />
      <ellipse cx="948" cy="438" rx="52" ry="26" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 5" />
      {/* 4 · cowl at the windshield base */}
      <circle cx="398" cy="364" r="3.2" fill="#ffb066" fillOpacity="0.9" />
      <ellipse cx="402" cy="366" rx="40" ry="13" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 5" />
      {/* 5 · front fender lip behind the arch */}
      <circle cx="398" cy="440" r="3.2" fill="#ffb066" fillOpacity="0.9" />
      <ellipse cx="396" cy="442" rx="38" ry="19" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="4 5" />
      {/* 6 · floor + trunk pans, hidden below the rocker line */}
      <path
        d="M 380 488 L 780 488"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.2"
        strokeOpacity="0.6"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <path
        d="M 900 488 L 1000 486"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.2"
        strokeOpacity="0.6"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />

      {/* ══ LEADER LINES — label column to pin ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        {/* left column */}
        <path d="M 218 206 L 396 358" />
        <path d="M 218 330 L 380 434" />
        <path d="M 218 500 L 540 468" />
        {/* right column */}
        <path d="M 898 168 L 950 430" />
        <path d="M 898 300 L 706 444" />
        <path d="M 898 512 L 660 490" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 540, y: 468, n: "1" },
          { x: 706, y: 444, n: "2" },
          { x: 950, y: 430, n: "3" },
          { x: 396, y: 356, n: "4" },
          { x: 378, y: 434, n: "5" },
          { x: 660, y: 490, n: "6" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>

      {/* ══ MONO LABELS ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        {/* left column */}
        <text x="40" y="210" fill="#ffb066">
          4 · COWL &amp; GLASS CHANNEL
        </text>
        <text x="40" y="334" fill="#ffb066">
          5 · FENDER LIP — SEAM HOLDS SALT
        </text>
        <text x="40" y="504" fill="#ffb066">
          1 · ROCKER — THE SALT SHELF
        </text>
        {/* right column */}
        <text x="1160" y="172" textAnchor="end" fill="#ffb066">
          3 · QUARTER &amp; ARCH — WHEEL SPRAY
        </text>
        <text x="1160" y="304" textAnchor="end" fill="#ffb066">
          2 · DOOR SKIN — PLUGGED DRAINS
        </text>
        <text x="1160" y="516" textAnchor="end" fill="#ffb066">
          6 · FLOOR &amp; TRUNK PANS
        </text>
      </g>

      {/* ══ LEGEND ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.16em">
        <circle cx="78" cy="576" r="3" fill="#ffb066" fillOpacity="0.9" />
        <text x="96" y="580" fill="#9a9ca0" fillOpacity="0.6">
          THE BUBBLE YOU SEE
        </text>
        <ellipse cx="78" cy="602" rx="13" ry="6" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 4" />
        <text x="96" y="606" fill="#9a9ca0" fillOpacity="0.6">
          THE EXTENT THE BLAST FINDS
        </text>
      </g>

      {/* plate caption */}
      <text
        x="640"
        y="636"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. R — SIX PLACES A BODY ROTS, AND HOW FAR IT REALLY RUNS
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Honest numbers first: a single welded patch panel on a classic typically runs $300 to $900
        CAD, a full quarter panel installed and painted runs $2,500 to $6,000 or more, and hand
        fabrication bills by the hour. The number moves after blasting because rust hides — the
        bubble you see is never the whole repair.
      </p>

      <h2>How much does rust repair actually cost in Canada?</h2>
      <p>
        Rust repair does not have a price. It has a price <strong>per decision</strong>, and the
        decisions stack: how far the corrosion runs, whether a stamped repair section exists for
        your panel, how much finish work sits on top of the weld, and whether the metal underneath
        the metal is sound. Body suppliers grade the damage in three stages — surface rust that has
        not penetrated, scale rust where pitting reaches into the steel, and penetrating rust,
        which is full perforation, often hidden on the back of panels and inside seams.
        <a href="#src-1" className="cite-ref">[1]</a> Only the first stage is cheap. Surface rust
        is a sanding and refinishing problem. The other two are cutting problems, and cutting is
        where the money lives.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$300–$900</span>
          <span className="stat-l">One welded patch repair, finished — typical range</span>
        </div>
        <div>
          <span className="stat-v">$2,500–$6,000+</span>
          <span className="stat-l">Quarter panel replaced and painted — typical range</span>
        </div>
        <div>
          <span className="stat-v">$110–$160/hr</span>
          <span className="stat-l">Edmonton-area shop rate fabrication bills against</span>
        </div>
        <div>
          <span className="stat-v">3 stages</span>
          <span className="stat-l">Surface, scale, perforation. Only the first is cheap</span>
        </div>
      </div>
      <p>
        Every figure on this page is a planning range in Canadian dollars, not a quote. The spread
        inside each range is mostly labour, and the labour is mostly finish: a patch that will live
        under carpet gets welded, sealed, and left proud in twenty minutes of grinding, while the
        same patch in the middle of a quarter panel gets butt-welded, planished, worked to a
        skim of filler, and blended into paint across two panels. Same steel. Triple the hours.
      </p>

      <h2>Why did the estimate change after blasting?</h2>
      <p>
        Because the first estimate was priced on what a flashlight could see, and rust does its
        work where flashlights do not reach — under paint, under filler, under undercoating, and
        inside the pinch seams where two panels meet. A blister the size of a dime on a rocker
        commonly opens into a repair the size of a shoe once the coatings come off. That is not
        the shop moving the goalposts. That is the paint finally telling the truth.
      </p>
      <p>
        Hagerty&rsquo;s own restoration cost guidance makes the same point from the insurer&rsquo;s
        side of the counter: once a car comes apart, you find frame damage you did not plan for,
        and when the interior comes out, you find more rust than expected.
        <a href="#src-2" className="cite-ref">[2]</a> The fix for this is not optimism. It is
        sequencing. A fair shop quotes the work it can see firm, names the hidden areas as
        unknowns — floors under the sound deadening, quarters behind the undercoat, cowl under the
        fenders — and prices those areas only after the shell is stripped to bare metal. That
        strip-first sequence is the backbone of the{" "}
        <Link href="/blog/classic-car-restoration-timeline">restoration timeline</Link>: nobody
        can schedule what nobody has seen.
      </p>
      <blockquote>
        <p>The bubble is never the size of the hole, and the hole is never the size of the repair.</p>
        <footer>Shop rule, said over every blasted shell</footer>
      </blockquote>
      <p>
        So when two shops quote the same car and one number is suspiciously firm, ask each of them
        the same question: what happens to this price after blasting? The shop that says
        &ldquo;nothing, it&rsquo;s all included&rdquo; has either padded the number heavily or
        plans to bury the surprise under filler. The shop that says &ldquo;these three areas are
        quoted, these two are unknowns until the metal is bare&rdquo; is the one reading you the
        actual job.
      </p>

      <h2>Patch panel, full panel, or fabrication — which repair is right?</h2>
      <p>
        Once the true extent is known, every rusty area on the car gets one of three answers, and
        the honest quote names which one, panel by panel. The rule of thumb from the panel
        suppliers themselves: a quarter-size hole in an otherwise solid panel takes a small patch,
        while multiple perforations or widespread pitting usually justify a full replacement.
        <a href="#src-1" className="cite-ref">[1]</a> Typical planning ranges in Canadian dollars:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Patch panel repair versus full replacement panel versus hand fabrication, compared by
            typical Canadian dollar cost, when each is the right call, what drives the price, and
            what to watch out for
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Patch panel</th>
              <th scope="col">Full replacement panel</th>
              <th scope="col">Hand fabrication</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Typical cost (CAD)</th>
              <td className="num">$300 – $900 per repair</td>
              <td className="num">$2,500 – $6,000+ installed &amp; painted</td>
              <td className="num">$110 – $160/hr, 10 – 40+ hrs per panel</td>
            </tr>
            <tr>
              <th scope="row">The right call when</th>
              <td>Rust is localized in a panel that is otherwise sound</td>
              <td>Perforation or deep pitting runs across the panel</td>
              <td>No reproduction stamping exists for the car</td>
            </tr>
            <tr>
              <th scope="row">What drives the price</th>
              <td>Access, and how invisible the finish must be</td>
              <td>Repro panel fit — cheap stampings cost hours to make fit</td>
              <td>Crown and compound curves. Flat is fast, shape is not</td>
            </tr>
            <tr>
              <th scope="row">Watch out for</th>
              <td>Lap-welded patches skimmed over with filler</td>
              <td>Seam placement and blending across adjacent panels</td>
              <td>Anyone quoting it flat without seeing bare metal</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Two notes from the bench. First, the reproduction panel itself is the cheap part — a
        stamped quarter or bedside commonly runs $200 to $1,200 CAD, and the rest of the bill is
        cutting, fitting, welding, corrosion-proofing the backside, and paint. Second, cheap
        repro steel is a false economy: a poorly stamped panel can eat ten hours of massaging
        before it fits, which is real money at shop rate. Choosing the panel is part of the
        craft, and it is exactly the kind of call the{" "}
        <Link href="/services/body-paint-metalwork">metal, body, and paint service</Link> makes
        with the owner, not for them — because seam placement and panel choice are permanent.
      </p>

      <h2>Why do Alberta classics rust where they do?</h2>
      <p>
        Alberta is kinder to steel than Ontario or Quebec — drier air, drier winters, less brine
        per kilometre. Kinder is not kind. Canadian road authorities spread enough de-icing salt
        that the federal government maintains a formal code of practice just to manage the
        environmental load of it.<a href="#src-3" className="cite-ref">[3]</a> Every classic that
        saw Alberta shoulder seasons collected its share, and the chinook cycle — thaw, slush,
        freeze, repeat — keeps that salt wet and working long after the storm. Worst of all is the
        heated garage: park a snow-packed car inside at plus fifteen and the melt runs into every
        seam and stays there.
      </p>
      <p>
        The pattern on the hoist is predictable, which is why the illustration above looks the way
        it does. Rockers rot first because they are a shelf for everything the tires throw. Door
        skins rot from the inside when the drain holes plug. Quarters and arches take wheel spray
        directly. Cowls and glass channels trap leaves and hold water against the steel. Floors
        and trunk pans sweat under original underlay for decades. And remember that a large share
        of the classics in this province immigrated — from British Columbia coast salt, from
        Ontario winters, from the American rust belt — so the body may carry a history the
        Alberta plates do not show. It is the same reason the{" "}
        <Link href="/blog/barn-find-first-steps">barn-find protocol</Link> treats every
        long-parked car as unknown until proven solid: where the car sat matters as much as how
        long.
      </p>

      <h2>How much rust is too much?</h2>
      <p>
        Mechanically, there is almost no such thing. Steel is steel; anything can be cut out and
        replaced, up to and including the entire floor of the car. The real question has two
        parts, and they should be answered in this order.
      </p>
      <p>
        First: <strong>is the rust structural?</strong> Cosmetic rust lives in skins — fenders,
        doors, quarters — and costs what the table above says. Structural rust lives in frame
        rails, spring and suspension mounts, floor supports, and, on a unibody, the rockers that
        carry the car&rsquo;s stiffness. Structural repair means jigs, measurements, and welds
        that must be right rather than pretty, and the budget moves accordingly. It is also where
        registration gets real: a vehicle coming into Alberta must pass an out-of-province
        inspection at a licensed facility before plates are issued, and corroded structure is
        precisely the kind of thing that inspection exists to catch.
        <a href="#src-4" className="cite-ref">[4]</a> If you are importing a project, read the{" "}
        <Link href="/blog/out-of-province-inspection-edmonton">out-of-province inspection
        explainer</Link> before you wire anyone a deposit.
      </p>
      <p>
        Second: <strong>does the repair bill fit the finished car?</strong> A rusty floor on a
        big-block convertible is worth every hour. The same floor on a rough four-door of no
        particular rarity can cost more than the finished car will ever be worth — and a fair
        shop will say so out loud before taking the job. The exception is the car that is family.
        If it was your father&rsquo;s truck, the math was never the point, and there is no shame
        in that. Just make the decision knowing the number, not hoping around it.
      </p>

      <h2>How do you get an honest number?</h2>
      <p>
        Do three things before asking anyone for a price. Walk the car with a flashlight and a
        magnet, and note everywhere the paint bubbles, the magnet falls off filler, or a
        screwdriver handle makes the metal flex. Photograph the underside — rockers, floor pans,
        trunk drop-offs, spring mounts — even if it means crawling. And write down what the car
        is for: driver, show car, or heirloom, because the right repair for each is different and
        so is the right bill.
      </p>
      <p>
        Then send the photos and the honest story through the{" "}
        <Link href="/quote">quote page</Link>. What comes back will be structured the way this
        article is: firm numbers on the rust that can be seen, named unknowns on the areas that
        cannot, and a recommendation — patch, panel, or fabrication — for each spot, with the
        reasoning attached. A quote you can read beats a quote you have to trust. That is the
        whole trade.
      </p>
    </>
  );
}
