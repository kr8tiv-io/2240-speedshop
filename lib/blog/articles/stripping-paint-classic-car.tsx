import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Stripping Paint: Media Blasting, Chemical, or Sanding.
 * The body-and-paint wedge for the paint-stripping keyword cluster. Answers
 * which method is safe for which panel before someone warps forty hours of
 * straight sheet metal, and routes down into the body and metalwork service,
 * the restoration service, the barn-find protocol, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "stripping-paint-classic-car",
  title:
    "Media Blasting, Chemical Stripping, or Sanding: Taking a Classic to Bare Metal",
  accent: "Bare Metal",
  metaTitle: "Blasting vs Chemical Stripping Paint",
  description: "Which stripping method is safe for which panel — where blasting heat warps skins, why soda residue peels primer, and when chemical stripper earns its mess.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Body & Paint",
  targetKeywords: [
    "media blasting car body",
    "soda blasting vs sandblasting car",
    "chemical paint stripping classic car",
    "best way to strip car paint",
  ],
  faq: [
    {
      q: "What is the best way to strip paint off a classic car?",
      a: "There is no single best way — there is a best way per panel. Media blasting with the right media is best for frames, floors, brackets, and heavy rust. Outer skins survive better under chemical stripper or an 80-grit disc on a DA sander, because blasting heat can warp thin, flat sheet metal. Soda blasting is the gentlest on the metal but leaves a residue that must be rinsed and neutralized before primer, and it does not touch rust at all.",
    },
    {
      q: "Will media blasting warp my classic's body panels?",
      a: "It can. Aggressive media at high pressure builds heat and friction, and thin outer sheet metal — hoods, roofs, door skins, quarters — stretches and oil-cans when it gets hot. Structure and heavily crowned metal shrug it off. An experienced operator running fine media at low pressure, a shallow angle, and a moving nozzle can blast a skin safely; a rushed operator with coarse media at high pressure can ruin one in minutes. Ask what media, what pressure, and how many complete cars they have done.",
    },
    {
      q: "Is soda blasting safe before painting?",
      a: "Safe for the metal, dangerous for the paint job — unless the cleanup is done properly. Soda will not warp panels because it shatters on impact instead of building friction heat, but it leaves an alkaline film on the steel. Primer sprayed over that film can let go in sheets. Because baking soda is water soluble, the fix is a thorough flood rinse, a neutralizing wash, a scuff, and a final clean before any primer goes on. Skip a step and the failure shows up months later at the edges.",
    },
    {
      q: "How much does it cost to media blast a car in Canada?",
      a: "A professionally blasted complete exterior commonly runs $1,500 to $4,500 CAD, and a full shell done inside and out on a rotisserie commonly runs $3,000 to $7,000 or more, depending on size, rust, and how many old paint jobs are stacked on the car. A DIY chemical strip usually lands between $250 and $600 in stripper and supplies plus a long string of weekends. All of these are planning ranges, not quotes — the honest number comes after someone sees the car.",
    },
    {
      q: "Can I use regular sand in my sandblaster?",
      a: "No. Blasting with silica sand throws respirable crystalline silica into the air, and breathing it causes silicosis — an incurable lung disease. The Canadian Centre for Occupational Health and Safety lists abrasive blasting among the high-risk activities and recommends substituting safer media. Crushed glass, aluminum oxide, and plastic media all strip better than sand anyway, with less heat in the panel. There is no version of this job where bagged sand is the right answer.",
    },
  ],
  citations: [
    {
      name: "“Differences of Sandblasting, Soda Blasting, or Dustless Sandblasting Your Vehicle,” Gold Eagle Co. technical library",
      url: "https://www.goldeagle.com/tips-tools/differences-of-sandblasting-soda-blasting-or-dustless-sandblasting-your-vehicle/",
    },
    {
      name: "“Silicosis,” OSH Answers fact sheet, Canadian Centre for Occupational Health and Safety",
      url: "https://www.ccohs.ca/oshanswers/diseases/silicosis.html",
    },
    {
      name: "“The Best Media for Auto Restoration,” Dustless Blasting resource library",
      url: "https://www.dustlessblasting.com/blog/the-best-media-for-auto-restoration",
    },
    {
      name: "“The Proper Use of Soda Blasting Equipment Using ARMEX,” ARMEX / Arm & Hammer technical resources",
      url: "https://armex.ahperformance.com/resources/the-proper-use-of-soda-blasting-equipment-using-armex/",
    },
    {
      name: "“Methylene Chloride,” OSH Answers chemical profile, Canadian Centre for Occupational Health and Safety",
      url: "https://www.ccohs.ca/oshanswers/chemicals/chem_profiles/methylene.html",
    },
  ],
  internalLinks: [
    "/services/body-paint-metalwork",
    "/blog/barn-find-first-steps",
    "/services/classic-car-restoration",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * One painted panel in cross-section — topcoat, primer, steel — with the three
 * roads to bare metal working side by side: a blast nozzle cutting an anchor
 * profile over a ghosted oil-can wave, chemical stripper lifting the paint in
 * curls above a pinch-weld seam that keeps dripping, and a DA pad leaving its
 * scratch pattern. A corner inset shows soda residue peeling primer. Editorial
 * plate in the shop style: steel line art, tungsten hazards, mono labels.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical cross-section diagram of a painted body panel showing topcoat, primer, and steel, with three stripping methods side by side: an abrasive blast nozzle cutting an anchor profile with heat waves and a ghosted warp wave below the steel, chemical stripper lifting paint curls above a pinch-weld seam with tungsten drips escaping it, and a DA sander pad leaving a fine scratch pattern, plus a corner inset of soda residue lifting primer off steel"
      className="h-auto w-full"
    >
      <title>One panel, three roads to bare steel — and where each one bites</title>
      <defs>
        <radialGradient id="sp-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sp-film" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* pool of light under the panel */}
      <ellipse cx="600" cy="470" rx="420" ry="36" fill="url(#sp-pool)" />

      {/* ══ THE STEEL — one long substrate bar ══ */}
      {/* top edge is drawn per-zone; verticals + bottom here */}
      <path
        d="M 100 382 L 100 432 L 1100 432 L 1100 382"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* intact top edge under the surviving paint strips */}
      <g stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round">
        <line x1="100" y1="382" x2="150" y2="382" />
        <line x1="400" y1="382" x2="460" y2="382" />
        <line x1="720" y1="382" x2="780" y2="382" />
        <line x1="1050" y1="382" x2="1100" y2="382" />
      </g>

      {/* ══ SURVIVING PAINT STACK — topcoat over primer, four strips ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.75">
        <rect x="100" y="366" width="50" height="16" />
        <rect x="100" y="350" width="50" height="16" />
        <rect x="400" y="366" width="60" height="16" />
        <rect x="400" y="350" width="60" height="16" />
        <rect x="720" y="366" width="60" height="16" />
        <rect x="720" y="350" width="60" height="16" />
        <rect x="1050" y="366" width="50" height="16" />
        <rect x="1050" y="350" width="50" height="16" />
      </g>
      {/* primer tint */}
      <g fill="#ffb066" fillOpacity="0.08">
        <rect x="100" y="366" width="50" height="16" />
        <rect x="400" y="366" width="60" height="16" />
        <rect x="720" y="366" width="60" height="16" />
        <rect x="1050" y="366" width="50" height="16" />
      </g>

      {/* layer labels, left edge */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.6"
        textAnchor="end"
      >
        <text x="88" y="361">TOPCOAT</text>
        <text x="88" y="377">PRIMER</text>
        <text x="88" y="412">STEEL</text>
      </g>

      {/* ══ ZONE 1 — ABRASIVE BLAST (x 150–400) ══ */}
      {/* anchor-profile top edge: fine zigzag */}
      <path
        d="M 150 382 l 10 -4 l 10 5 l 10 -5 l 10 4 l 10 -4 l 10 5 l 10 -5 l 10 4 l 10 -4 l 10 5 l 10 -5 l 10 4 l 10 -4 l 10 5 l 10 -5 l 10 4 l 10 -4 l 10 5 l 10 -5 l 10 4 l 10 -4 l 10 5 l 10 -5 l 10 4 l 10 -1"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* nozzle at 45 degrees */}
      <g stroke="#9a9ca0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 156 168 L 200 212 M 176 148 L 220 192" />
        <path d="M 200 212 L 220 192" />
        <path d="M 156 168 L 176 148" />
        <path d="M 210 202 L 224 216" />
      </g>
      {/* spray cone */}
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.55" fill="none" strokeLinecap="round">
        <line x1="224" y1="216" x2="278" y2="368" strokeDasharray="3 6" />
        <line x1="224" y1="216" x2="330" y2="352" strokeDasharray="3 6" />
        <line x1="224" y1="216" x2="238" y2="374" strokeDasharray="3 6" />
      </g>
      {/* media grains */}
      <g fill="#ffb066" fillOpacity="0.7">
        <circle cx="252" cy="280" r="1.6" />
        <circle cx="284" cy="312" r="1.4" />
        <circle cx="266" cy="336" r="1.2" />
        <circle cx="304" cy="330" r="1.4" />
        <circle cx="246" cy="322" r="1.2" />
      </g>
      {/* heat rising off the strike zone */}
      <g stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <path d="M 330 336 q 8 -14 0 -28 q -8 -14 0 -28" />
        <path d="M 356 344 q 8 -14 0 -28 q -8 -14 0 -28" />
        <path d="M 382 336 q 8 -14 0 -28 q -8 -14 0 -28" />
      </g>
      {/* ghosted oil-can wave under the steel */}
      <path
        d="M 156 466 q 30 -14 60 0 q 30 14 60 0 q 30 -14 60 0 q 28 13 54 1"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.2"
        strokeOpacity="0.55"
        strokeDasharray="4 5"
      />
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.55" fill="none" strokeLinecap="round">
        <path d="M 214 452 L 214 440 M 209 445 L 214 439 L 219 445" />
        <path d="M 274 468 L 274 480 M 269 475 L 274 481 L 279 475" />
      </g>

      {/* ══ ZONE 2 — CHEMICAL STRIP (x 460–720) ══ */}
      {/* bare top edge, clean */}
      <line x1="460" y1="382" x2="720" y2="382" stroke="#9a9ca0" strokeWidth="1.8" />
      {/* brush */}
      <g stroke="#9a9ca0" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="520" y="150" width="14" height="52" />
        <rect x="508" y="202" width="38" height="16" />
        <path d="M 510 218 L 512 240 M 519 218 L 520 242 M 527 218 L 527 243 M 535 218 L 534 242 M 543 218 L 542 240" strokeWidth="1.1" strokeOpacity="0.8" />
      </g>
      {/* stripper glob falling */}
      <path
        d="M 527 262 q -6 12 0 18 q 6 -6 0 -18"
        fill="#ffb066"
        fillOpacity="0.35"
        stroke="#ffb066"
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      {/* lifted paint curls */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4" strokeLinecap="round">
        <path d="M 500 378 q 6 -22 26 -24 q 16 -1 14 12 q -2 10 -13 8" />
        <path d="M 570 376 q 10 -26 32 -22 q 14 3 9 15 q -4 9 -14 5" />
        <path d="M 646 378 q 6 -20 24 -22 q 15 -1 13 11 q -2 10 -12 8" />
      </g>
      {/* solvent bubbles */}
      <g fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6">
        <circle cx="556" cy="352" r="4" />
        <circle cx="618" cy="344" r="3" />
        <circle cx="640" cy="360" r="2.2" />
        <circle cx="530" cy="340" r="2.6" />
      </g>
      {/* pinch-weld seam below — the dip-and-drip detail */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 500 508 L 620 508 L 656 522 L 692 508" />
        <path d="M 500 522 L 620 522 L 656 534 L 692 522" />
        <path d="M 656 522 L 656 534" strokeWidth="1.1" />
      </g>
      {/* stripper weeping out of the seam */}
      <g fill="#ffb066" fillOpacity="0.7">
        <circle cx="656" cy="546" r="2.4" />
        <circle cx="650" cy="560" r="1.6" />
        <circle cx="662" cy="572" r="1.2" />
      </g>
      <text
        x="500"
        y="560"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        THE SEAM REMEMBERS
      </text>
      <path d="M 640 552 L 600 552" stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.4" fill="none" />

      {/* ══ ZONE 3 — DA SANDING (x 780–1050) ══ */}
      {/* top edge with fine scratch hatch */}
      <line x1="780" y1="382" x2="1050" y2="382" stroke="#9a9ca0" strokeWidth="1.8" />
      <g stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.55">
        <line x1="796" y1="378" x2="806" y2="386" />
        <line x1="822" y1="386" x2="832" y2="378" />
        <line x1="848" y1="378" x2="858" y2="386" />
        <line x1="874" y1="386" x2="884" y2="378" />
        <line x1="900" y1="378" x2="910" y2="386" />
        <line x1="926" y1="386" x2="936" y2="378" />
        <line x1="952" y1="378" x2="962" y2="386" />
        <line x1="978" y1="386" x2="988" y2="378" />
        <line x1="1004" y1="378" x2="1014" y2="386" />
      </g>
      {/* DA pad */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        <circle cx="912" cy="258" r="58" strokeWidth="2" />
        <circle cx="912" cy="258" r="40" strokeWidth="1" strokeOpacity="0.6" />
        <circle cx="924" cy="246" r="12" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M 912 200 L 912 168 M 892 172 L 932 172" strokeWidth="2" />
      </g>
      {/* orbit swirls trailing off the pad */}
      <g fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round">
        <path d="M 852 328 q 12 -10 24 0 q 12 10 24 0" />
        <path d="M 912 336 q 12 -10 24 0 q 12 10 24 0" />
      </g>

      {/* ══ CORNER INSET — SODA RESIDUE ══ */}
      <g>
        <rect x="1010" y="96" width="132" height="84" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7" />
        {/* steel base */}
        <rect x="1024" y="150" width="104" height="16" fill="none" stroke="#9a9ca0" strokeWidth="1.2" />
        {/* residue film on the steel */}
        <rect x="1024" y="142" width="104" height="8" fill="url(#sp-film)" stroke="#ffb066" strokeWidth="0.8" strokeOpacity="0.6" />
        {/* primer lifting off the film */}
        <path
          d="M 1024 142 L 1084 142 q 20 0 28 -18"
          fill="none"
          stroke="#9a9ca0"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <text
          x="1076"
          y="118"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="9.5"
          letterSpacing="0.12em"
          fill="#ffb066"
        >
          SODA FILM = PEEL
        </text>
      </g>

      {/* ══ LEADER LINES — label column to pin ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 214 110 L 300 300" />
        <path d="M 760 620 L 656 534" />
        <path d="M 1000 620 L 912 320" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 300, y: 300, n: "1" },
          { x: 656, y: 534, n: "2" },
          { x: 912, y: 320, n: "3" },
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
        <text x="40" y="104" fill="#ffb066">
          1 · HEAT + FRICTION — THIN SKINS WARP
        </text>
        <text x="760" y="632" fill="#ffb066">
          2 · STRIPPER LIVES IN SEAMS
        </text>
        <text x="1000" y="606" textAnchor="end" fill="#ffb066">
          3 · 80-GRIT ON A DA — KEEP IT MOVING
        </text>
        <text x="150" y="500" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          ANCHOR PROFILE CUT FOR PRIMER
        </text>
      </g>

      {/* plate caption */}
      <text
        x="600"
        y="648"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. S — ONE PANEL, THREE ROADS TO BARE STEEL
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Blast the structure, strip the skins, sand the blends. Media blasting is right for frames,
        floors, and rusty brackets; outer sheet metal survives better under chemical stripper or an
        80-grit DA; soda is gentle but leaves a film primer hates. Match the method to the panel,
        and straight metal stays straight.
      </p>

      <h2>Why do straight panels come back wavy?</h2>
      <p>
        The outer skins on a classic — hood, roof, door skins, quarters — are thin sheet steel
        holding shape mostly by their crown. Aggressive blasting builds heat and friction at the
        strike point, and thin metal answers heat by stretching. Once the surface stretches, the
        panel oil-cans: push it and it pops, sight down it in low light and it rolls like water.
        Normal sandblasting produces exactly this — heat, friction, and warped panels, especially
        where the metal is thin.<a href="#src-1" className="cite-ref">[1]</a> The cruel part is the
        timing: the damage hides under a uniform grey surface and shows up after primer, in the
        first raking light. Shrinking stretched metal back is skilled torch-and-hammer work billed
        by the hour, so the rule is simple — the flatter and thinner the panel, the gentler the
        method.
      </p>
      <blockquote>
        <p>Nobody ever warped a panel slowly. It happens in the ten seconds the nozzle stops moving.</p>
        <footer>Shop rule, learned the expensive way</footer>
      </blockquote>

      <h2>When is media blasting the right call?</h2>
      <p>
        For everything that is not a flat outer skin, blasting is the best tool in the building.
        Frames, floors, inner structure, brackets, suspension parts, wheels — anything crowned,
        boxed, or rusty gets clean faster and more completely than any other method, and the
        process leaves an anchor profile that epoxy primer grips like a thread grips a bolt. Start
        with what not to load: actual silica sand. Blasting it fills the air with respirable
        crystalline silica, and the Canadian Centre for Occupational Health and Safety lists
        abrasive blasting among the activities that put workers at risk of silicosis — an
        incurable lung disease — and recommends substituting safer materials.
        <a href="#src-2" className="cite-ref">[2]</a> Sand also runs hot, which is half of the warp
        story above. There is no job in this trade where bagged sand is the right answer.
      </p>
      <p>
        The working menu: crushed glass in a 40/70 grit has become the go-to for automotive work
        because it cuts paint and rust without eating the underlying steel.
        <a href="#src-3" className="cite-ref">[3]</a> Aluminum oxide is the aggressive option for
        frames and heavy scale. Plastic media and walnut shell run cool enough for fiberglass and
        for skins in careful hands. Wet-blast rigs — several run mobile around Edmonton and
        Sherwood Park — add water at the nozzle, which knocks down both the dust cloud and the
        friction heat. But the honest variable is the operator. Media, pressure, distance, angle,
        and a nozzle that never stops moving is the difference between a shell ready for epoxy and
        a shell booked into the <Link href="/services/body-paint-metalwork">metal and body
        shop</Link> for shrinking work. Before you hire a blaster, ask three things: what media,
        what pressure, and how many complete cars.
      </p>

      <h2>Is soda blasting really safer for car bodies?</h2>
      <p>
        Safer for the metal, riskier for the paint job. Soda is sodium bicarbonate — soft,
        friable, silica-free, and water soluble.<a href="#src-4" className="cite-ref">[4]</a> The
        particles shatter on impact instead of grinding, so soda strips coatings without building
        the friction heat that warps steel.<a href="#src-1" className="cite-ref">[1]</a> On paper
        that makes it the perfect skin-safe method. Two catches. First, soda does not touch rust
        and leaves no anchor profile — a soda-blasted panel is clean paint-free steel with rust
        still in every pit, needing mechanical prep before primer anyway. Second, and the one that
        ruins paint jobs: soda leaves an alkaline film on the surface, and primer sprayed over that
        film can let go in sheets months later. Any paint supplier who has handled a warranty
        claim treats a soda-blasted shell as suspect until proven rinsed.
      </p>
      <p>
        The fix is built into the chemistry — because the residue is water soluble, a thorough
        flood rinse, a neutralizing wash, a scuff, and a final clean take it off.
        <a href="#src-1" className="cite-ref">[1]</a> Do all of it, every panel, every seam, or do
        not soda blast. Choose soda when the paint is failing over sound metal, when there is
        brightwork or glass nearby you cannot fully mask, or on fiberglass where hard media would
        cut the gel coat.
      </p>

      <h2>When does chemical stripping earn the mess?</h2>
      <p>
        Chemical stripper is the skin-safe workhorse: zero heat, zero abrasion, and it works one
        panel at a time on a Tuesday night. The classic fast strippers were built on methylene
        chloride, and that chemistry deserves respect — it is toxic to inhale, a suspected
        carcinogen, and the body converts it to carbon monoxide in the blood.
        <a href="#src-5" className="cite-ref">[5]</a> Read that against an Edmonton January:
        a sealed garage with the overhead furnace cycling is exactly the wrong room for it. Do
        chemical work in the warm season with the door open and air moving, in gloves and
        goggles, or use the modern benzyl-alcohol strippers — slower, needing two or three
        applications, but far kinder to the person holding the scraper.
      </p>
      <p>
        Technique buys more than product: score the paint in a crosshatch so the stripper gets
        under the film, lay it on thick in one direction, cover the panel in poly sheet so the
        solvents stay wet and working instead of flashing off in our dry prairie air, scrape with
        plastic, repeat. Then wash and neutralize exactly as the label says, because stripper
        residue under primer fails the same way soda does. The other flavour is dip stripping —
        the whole shell immersed in a tank, which reaches boxed sections nothing else can. Its
        famous failure mode is dip-and-drip: stripper and rinse water wick into pinch welds and
        seams and weep back out for weeks, bubbling fresh paint at every joint unless the tank
        shop neutralizes, pressure-flushes, and gets the shell into primer promptly. Immersion
        tanks are also scarce in Western Canada, so budget a trailer ride. For a long-parked car
        already apart, the sequencing logic in the{" "}
        <Link href="/blog/barn-find-first-steps">barn-find first-steps guide</Link> applies here
        too: strip nothing you cannot protect the same week.
      </p>

      <h2>Can you just sand the whole car?</h2>
      <p>
        You can, and for single panels you should. An 80-grit disc on a dual-action sander is
        slow, cool, and controllable — the DA&rsquo;s orbit spreads heat instead of concentrating
        it, and you can stop at every layer to read the car&rsquo;s history: old filler, previous
        repairs, the factory primer telling you which panels are original. That archaeology is
        worth real money before a purchase or a repaint decision. The sin is reaching for an angle
        grinder with a hard disc — it burns, gouges, and warps skins faster than any blaster. Keep
        the DA moving, let the paper cut, and change discs the moment they glaze. The honest
        arithmetic: a complete car by DA is forty to eighty hours of arm work and boxes of
        abrasive, which is why most owners strip one fender, recalculate, and book the rest as a
        blast job.
      </p>

      <h2>Which method for which panel?</h2>
      <p>
        The decision, panel by panel. Costs are typical planning ranges in Canadian dollars, not
        quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Media blasting, soda blasting, chemical stripping, dip stripping, and DA sanding
            compared by best use, panel risk, required preparation before primer, and typical
            Canadian dollar cost
          </caption>
          <thead>
            <tr>
              <th scope="col">Method</th>
              <th scope="col">Best for</th>
              <th scope="col">The risk</th>
              <th scope="col">Before primer</th>
              <th scope="col">Typical cost (CAD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Media blast</th>
              <td>Frames, floors, brackets, heavy rust; shells with the right media and operator</td>
              <td>Heat warp on thin outer skins</td>
              <td>Blow off, wipe, epoxy the same day</td>
              <td className="num">$1,500 – $4,500 exterior</td>
            </tr>
            <tr>
              <th scope="row">Soda blast</th>
              <td>Failing paint over sound metal, fiberglass, near trim and glass</td>
              <td>Alkaline film peels primer; no rust removal, no profile</td>
              <td>Flood rinse, neutralize, scuff, clean again</td>
              <td className="num">$1,500 – $4,000</td>
            </tr>
            <tr>
              <th scope="row">Chemical, by hand</th>
              <td>Outer skins, one-panel jobs, home garages</td>
              <td>Fumes; residue in seams bleeds back</td>
              <td>Neutralize per the label, sand, clean the seams</td>
              <td className="num">$250 – $600 materials</td>
            </tr>
            <tr>
              <th scope="row">Dip strip</th>
              <td>Complete shells, boxed sections, hidden rust</td>
              <td>Dip-and-drip — seams weep for weeks</td>
              <td>Pressure-flush, neutralize, prime fast</td>
              <td className="num">$2,500 – $6,000+</td>
            </tr>
            <tr>
              <th scope="row">DA sanding</th>
              <td>Single panels, blends, reading the car&rsquo;s history</td>
              <td>Only the hours; grinders, not DAs, burn metal</td>
              <td>Degrease and go</td>
              <td className="num">$150 – $400 abrasives</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What does taking a classic to bare metal cost?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$1,500–$4,500</span>
          <span className="stat-l">Typical pro blast, complete exterior</span>
        </div>
        <div>
          <span className="stat-v">$3,000–$7,000+</span>
          <span className="stat-l">Full shell, inside and out, on a rotisserie</span>
        </div>
        <div>
          <span className="stat-v">$250–$600</span>
          <span className="stat-l">DIY chemical strip, materials for a whole car</span>
        </div>
        <div>
          <span className="stat-v">1 day</span>
          <span className="stat-l">Longest bare steel should wait for epoxy</span>
        </div>
      </div>
      <p>
        The spread is history. A one-repaint car strips fast; a car wearing four paint jobs and a
        skim of old filler is double the media and double the hours, and nobody can see the count
        until the first panel opens up. Rust repair discovered under the paint is its own line
        item. If the car is headed for a complete rebuild anyway, stripping is priced and
        sequenced as part of the{" "}
        <Link href="/services/classic-car-restoration">restoration process</Link> rather than as a
        standalone job — the shell comes back from bare metal straight into metal repair and
        epoxy without sitting.
      </p>

      <h2>What happens in the first hour after the paint is gone?</h2>
      <p>
        Bare steel starts dying immediately. Flash rust can bloom in hours — faster the moment
        humidity, a floor wash, or a bare hand touches the surface. Alberta&rsquo;s dry air is
        more forgiving than the coast, but forgiveness is not protection. So treat bare metal as
        an appointment, not a storage state: blow the media out of every seam and cavity, wipe the
        panel down with a clean solvent wipe, and get epoxy primer on the same day — never park a
        stripped shell to wait for a free weekend. Plan the whole chain before the first grain of
        media flies: stripper booked, primer on the shelf, gun clean, day cleared.
      </p>
      <p>
        And if you are standing in the garage trying to decide which column of that table your car
        lands in — that is a photo conversation. Send pictures of the panels, what you know of the
        paint history, and where the car has to end up through the{" "}
        <Link href="/quote">quote page</Link>, and you will get a straight answer: what we would
        blast, what we would strip by hand, and what we would leave alone.
      </p>
    </>
  );
}
