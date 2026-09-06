import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Patina: Keep It, Seal It, or Paint
 * The body-and-paint wedge for the patina keyword cluster. Answers the value
 * question honestly, tells the truth about clear-over-patina, and draws the
 * line between character and structure. Links down into the C10 guide, the
 * barn-find protocol, the body and paint service page, the winter guide, and
 * the quote page.
 */

export const meta: ArticleMeta = {
  slug: "patina-keep-it-or-paint-it",
  title: "Patina: Keep It, Seal It, or Paint",
  accent: "Patina",
  metaTitle: "Patina: Keep It, Seal It, or Paint",
  description: "When original paint adds value, how clear-over-patina really holds up, and the exact line where truck character ends and structural rust begins — from an.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Body & Paint",
  targetKeywords: [
    "patina vs repaint",
    "clear coat over patina",
    "patina truck value",
    "preserving patina classic car",
    "patina or repaint classic truck",
  ],
  faq: [
    {
      q: "Does patina add value to a classic truck?",
      a: "It can. Original-paint survivors are a recognized market category, and honest worn trucks occasionally sell for more than restored equivalents, because factory finish cannot be repeated. The premium only attaches when the paint is genuinely original, the wear is consistent across the truck, and the structure underneath is sound. A failed old respray, faked patina, or rot hiding under the character carries no premium at all.",
    },
    {
      q: "Does clear coat over patina last?",
      a: "Not indefinitely. Standard urethane clear bonds poorly to rust, and weathered paint is contaminated with chalked oxide and decades of wax that prep never fully removes, so edge-lift and peeling within a few seasons is the known failure. Done as proper paint work — loose scale removed, surfaces degreased until rags come back clean, a test panel first, then a 2K satin — it can look right for years, but treat it as a finish with a maintenance schedule, not a permanent seal.",
    },
    {
      q: "How do I tell patina from structural rust?",
      a: "Probe, don't look. Dry, tight surface bloom that only stains a rag is patina. Layered scale that flakes off with a fingernail is metal actively leaving. Perforation anywhere is structural territory. Check where structure lives: frame rails at the spring hangers, cab mounts, rocker boxes, cab corners, floor pans, and box crossmembers. A pick, a flashlight, and a magnet for hidden body filler tell you more than any walk-around ever will.",
    },
    {
      q: "How much does it cost to repaint a classic truck in Canada?",
      a: "Plan on roughly $8,000 to $20,000 CAD for a driver-quality respray on a truck with sound metal, and well beyond that for show-level work, because metal repair — not colour — drives the bill. Sealing existing patina under a properly prepped 2K clear typically runs $2,000 to $5,000 CAD, and an oil or wax preservation routine costs a few hundred dollars a year at most. All of these are planning ranges, not quotes.",
    },
    {
      q: "Can I drive a patina truck in an Edmonton winter?",
      a: "You can, but the truck pays for it. Edmonton treats winter roads with sand, salt, and calcium chloride brine, and chloride brine clings to exposed steel and stays damp on it — which is exactly what a patina panel is. A truck already wearing surface rust corrodes far faster than a painted one once salt is involved. The sustainable pattern is May-to-October driving with indoor storage, or a strict rinse-and-oil-film routine if it must move in winter.",
    },
  ],
  citations: [
    {
      name: "Rob Siegel, “Can You Live with Patina?,” Hagerty Media, September 2023",
      url: "https://www.hagerty.com/media/opinion/the-hack-mechanic/can-you-live-with-patina/",
    },
    {
      name: "Carl Heideman, “Patina: The Good, the Bad, and How to Preserve Time-Worn Classics,” Classic Motorsports, March 2013",
      url: "https://classicmotorsports.com/articles/patina-good-bad-and-how-preserve-true-time-worn-cl/",
    },
    {
      name: "“Vehicle Inspections,” Government of Alberta",
      url: "https://www.alberta.ca/vehicle-inspections",
    },
    {
      name: "“Clear Coat FAQ,” Eastwood Garage technical library",
      url: "https://www.eastwood.com/garage/clear-coat-faq/",
    },
    {
      name: "“Winter Travel: Snow and Ice,” City of Edmonton",
      url: "https://www.edmonton.ca/transportation/on_your_streets/snow-ice",
    },
  ],
  internalLinks: [
    "/blog/c10-square-body-alberta-guide",
    "/blog/barn-find-first-steps",
    "/services/body-paint-metalwork",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * A classic pickup in side profile, split into three treatment zones — KEEP,
 * SEAL, PAINT — over a door-skin cross-section that runs bloom, scale,
 * perforation left to right, with an amber vertical rule marking the line
 * where cosmetic ends and structural begins. Steel line art, amber accents,
 * every label mono. Editorial plate in the shop style.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of a classic pickup truck in side profile divided into three zones labelled keep it, seal it, and paint it — original oxide bloom on the front sheet metal, a dashed clear film traced over the cab, and fresh-coat hatching on the box — above a door-skin cross-section showing the three stages of corrosion from tight surface bloom to flaking scale to full perforation, with an amber vertical rule marking the line where cosmetic character ends and structural rust begins"
      className="h-auto w-full"
    >
      <title>Three trucks in one — where character ends and the bill begins</title>
      <defs>
        <radialGradient id="pt-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the truck */}
      <ellipse cx="550" cy="344" rx="420" ry="30" fill="url(#pt-pool)" />

      {/* ══ ZONE LABELS ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="12"
        letterSpacing="0.22em"
        textAnchor="middle"
      >
        <text x="308" y="84" fill="#ffb066">
          KEEP IT
        </text>
        <text x="600" y="84" fill="#ffb066">
          SEAL IT
        </text>
        <text x="832" y="84" fill="#ffb066">
          PAINT IT
        </text>
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9.5"
        letterSpacing="0.16em"
        textAnchor="middle"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        <text x="308" y="362">
          ORIGINAL BLOOM · WASH &amp; WAX
        </text>
        <text x="600" y="362">
          2K SATIN OR OIL FILM
        </text>
        <text x="832" y="362">
          METAL FIRST, COLOUR SECOND
        </text>
      </g>

      {/* zone dividers */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 6">
        <line x1="488" y1="96" x2="488" y2="340" />
        <line x1="712" y1="96" x2="712" y2="340" />
      </g>

      {/* ══ TRUCK BODY — side profile, facing left ══ */}
      <path
        d="M 132 296 L 132 244 L 150 236 L 150 214 L 352 206 L 372 204 L 388 140 L 524 134 L 534 202 L 560 202 L 560 194 L 948 192 L 948 296 L 918 296 A 62 62 0 0 0 794 296 L 400 296 A 62 62 0 0 0 276 296 L 132 296"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* cab glass */}
      <path
        d="M 398 148 L 514 143 L 519 192 L 395 197 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />
      {/* door seams + handle */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55" fill="none">
        <path d="M 440 204 L 446 292" />
        <path d="M 528 202 L 534 292" />
        <line x1="454" y1="222" x2="478" y2="221" strokeWidth="1.6" />
      </g>
      {/* body character line */}
      <line
        x1="150"
        y1="252"
        x2="948"
        y2="242"
        stroke="#9a9ca0"
        strokeWidth="0.8"
        strokeOpacity="0.35"
      />
      {/* wheels */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6">
        <circle cx="338" cy="296" r="46" />
        <circle cx="338" cy="296" r="18" strokeWidth="1.1" strokeOpacity="0.7" />
        <circle cx="856" cy="296" r="46" />
        <circle cx="856" cy="296" r="18" strokeWidth="1.1" strokeOpacity="0.7" />
      </g>

      {/* KEEP zone — oxide blooms on the front sheet metal */}
      <g fill="#ffb066" fillOpacity="0.12" stroke="#ffb066" strokeWidth="0.9" strokeOpacity="0.5">
        <ellipse cx="216" cy="232" rx="15" ry="8" />
        <ellipse cx="262" cy="262" rx="19" ry="10" />
        <ellipse cx="318" cy="226" rx="11" ry="6" />
        <ellipse cx="356" cy="258" rx="14" ry="7" />
        <ellipse cx="180" cy="272" rx="9" ry="5" />
        <ellipse cx="420" cy="236" rx="12" ry="6" />
      </g>

      {/* SEAL zone — dashed clear film traced above the surfaces */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.65" strokeDasharray="5 4" strokeLinecap="round">
        <path d="M 492 128 L 522 126 L 532 194 L 558 194 L 558 186 L 710 184" />
      </g>
      <g fill="#ffb066" fillOpacity="0.1" stroke="#ffb066" strokeWidth="0.8" strokeOpacity="0.4">
        <ellipse cx="512" cy="252" rx="13" ry="7" />
        <ellipse cx="580" cy="230" rx="10" ry="5" />
        <ellipse cx="648" cy="256" rx="15" ry="8" />
      </g>

      {/* PAINT zone — fresh-coat hatching on the box side */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.45" strokeLinecap="round">
        <line x1="736" y1="212" x2="762" y2="288" />
        <line x1="768" y1="210" x2="794" y2="286" />
        <line x1="800" y1="208" x2="820" y2="266" />
        <line x1="832" y1="206" x2="850" y2="258" />
        <line x1="864" y1="206" x2="890" y2="282" />
        <line x1="896" y1="204" x2="922" y2="280" />
        <line x1="928" y1="204" x2="944" y2="252" />
      </g>

      {/* ══ CROSS-SECTION — the door skin, bloom to perforation ══ */}
      <text
        x="150"
        y="416"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        DOOR SKIN, IN SECTION
      </text>

      {/* paint layer — intact over the bloom zone, breaking up through scale */}
      <line x1="150" y1="458" x2="430" y2="458" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round" />
      <g stroke="#9a9ca0" strokeWidth="1.4" strokeOpacity="0.7" strokeLinecap="round">
        <line x1="446" y1="458" x2="492" y2="458" />
        <line x1="516" y1="459" x2="552" y2="459" />
        <line x1="580" y1="460" x2="602" y2="460" />
        <line x1="636" y1="461" x2="650" y2="461" />
      </g>
      {/* primer line, faint */}
      <line
        x1="150"
        y1="464"
        x2="430"
        y2="464"
        stroke="#9a9ca0"
        strokeWidth="0.8"
        strokeOpacity="0.35"
        strokeDasharray="4 4"
      />

      {/* steel plate — top edge pitted through scale, holed at perforation */}
      <path
        d="M 150 470 L 430 470 L 448 472 L 470 469 L 494 474 L 520 470 L 548 476 L 574 471 L 600 478 L 628 473 L 656 480 L 684 474 L 700 478 L 726 474 L 756 480 L 788 476 L 812 482 L 836 486 L 848 492"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 934 488 L 948 480 L 976 474 L 1050 472"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* steel bottom edge with the same hole */}
      <path
        d="M 150 524 L 820 524 L 842 520 L 856 514"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M 926 512 L 942 520 L 1050 524" fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinecap="round" />
      {/* section hatching inside the steel */}
      <g stroke="#9a9ca0" strokeWidth="0.7" strokeOpacity="0.25">
        <line x1="190" y1="470" x2="176" y2="524" />
        <line x1="260" y1="470" x2="246" y2="524" />
        <line x1="330" y1="470" x2="316" y2="524" />
        <line x1="400" y1="470" x2="386" y2="524" />
        <line x1="470" y1="472" x2="456" y2="524" />
        <line x1="540" y1="473" x2="526" y2="524" />
        <line x1="610" y1="476" x2="596" y2="524" />
        <line x1="680" y1="475" x2="666" y2="524" />
        <line x1="750" y1="478" x2="736" y2="524" />
        <line x1="980" y1="474" x2="966" y2="524" />
        <line x1="1030" y1="472" x2="1016" y2="524" />
      </g>

      {/* bloom speckle above the paint */}
      <g fill="#ffb066" fillOpacity="0.55">
        <circle cx="196" cy="453" r="1.3" />
        <circle cx="238" cy="451" r="1" />
        <circle cx="284" cy="453" r="1.4" />
        <circle cx="330" cy="451" r="1" />
        <circle cx="372" cy="453" r="1.3" />
        <circle cx="408" cy="452" r="1" />
      </g>
      {/* scale crust riding the pitted edge, flakes lifting */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.7" strokeLinecap="round">
        <path d="M 446 468 Q 470 458 494 468 Q 520 456 548 470 Q 574 458 600 472 Q 628 460 656 474 Q 680 462 698 472" />
        <path d="M 500 452 L 512 444" />
        <path d="M 590 452 L 604 442" />
        <path d="M 660 456 L 674 448" />
      </g>
      {/* perforation — ragged amber rim, crumbs falling */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.2" strokeOpacity="0.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 848 492 L 862 500 L 858 510 L 872 508 L 880 516 L 856 514" />
        <path d="M 934 488 L 920 498 L 928 506 L 914 508 L 926 512" />
      </g>
      <circle cx="884" cy="540" r="2" fill="#ffb066" fillOpacity="0.7" />
      <circle cx="898" cy="552" r="1.3" fill="#ffb066" fillOpacity="0.45" />
      <circle cx="870" cy="554" r="1.1" fill="#ffb066" fillOpacity="0.4" />

      {/* THE LINE — cosmetic | structural */}
      <line x1="700" y1="430" x2="700" y2="556" stroke="#ffb066" strokeWidth="1.4" />
      <text
        x="700"
        y="422"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.2em"
        fill="#ffd9ad"
      >
        THE LINE
      </text>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        <text x="688" y="444" textAnchor="end">
          COSMETIC
        </text>
        <text x="712" y="444">
          STRUCTURAL
        </text>
      </g>

      {/* stage labels under the section */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
        textAnchor="middle"
        fill="#ffb066"
      >
        <text x="290" y="586">
          BLOOM — SURFACE ONLY
        </text>
        <text x="560" y="586">
          SCALE — METAL LEAVING
        </text>
        <text x="900" y="586">
          PERFORATION — STRUCTURE
        </text>
      </g>
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.4" fill="none">
        <path d="M 290 574 L 290 462" />
        <path d="M 560 574 L 560 470" />
        <path d="M 900 574 L 894 520" />
      </g>

      {/* plate caption */}
      <text
        x="600"
        y="634"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. P — WHERE CHARACTER ENDS AND THE BILL BEGINS
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Keep patina when the paint is factory-original and the metal under it is solid — the market
        now pays for that. Seal it only if you accept that clear over weathered paint is a
        maintenance item, not a cure. Paint when rust has gone past the surface, or when the finish
        was never original to begin with. The metal decides, not the look.
      </p>

      <h2>Does patina actually add value, or is that a myth?</h2>
      <p>
        Ten years ago a worn truck was an apology. Now survivor vehicles are their own recognized
        category, and honest worn examples occasionally sell for more than restored counterparts in
        objectively better condition.<a href="#src-2" className="cite-ref">[2]</a> The logic is
        simple and permanent: a truck is only original once. A restoration can be redone next
        decade; sixty-year-old factory paint cannot be re-grown. There is an unromantic half to the
        argument too — patina&rsquo;d vehicles cost less to buy and less to own, because a truck
        that is nowhere near perfect never puts you on the treadmill of chasing perfection.
        <a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        But the market pays for something specific: genuinely original finish, wear that is
        consistent across the whole truck, a desirable body, and sound structure underneath. It
        does not pay for a chalky 1970s respray that faded and flaked — that is not patina, it is
        an old paint job that needs to be forgotten.<a href="#src-2" className="cite-ref">[2]</a>{" "}
        It pays even less for faked patina, which a trained eye reads in about a minute. Nowhere is
        the split clearer than in the squarebody world, where straight original-paint trucks keep
        climbing while rattle-canned &ldquo;patina builds&rdquo; stall — the{" "}
        <Link href="/blog/c10-square-body-alberta-guide">C10 buyer&rsquo;s guide</Link> gets into
        which trucks deserve the premium.
      </p>
      <blockquote>
        <p>Patina is history you cannot reorder. Rust is a bill you have not opened yet.</p>
        <footer>Shop rule, tailgate edition</footer>
      </blockquote>

      <h2>Where does patina end and structural rust begin?</h2>
      <p>
        Oxide runs in three stages, and only the first one is character. <strong>Bloom</strong> is
        dry, tight surface rust — orange shading to brown, stains a rag, nothing lifts. That is
        patina. <strong>Scale</strong> is layered crust that flakes off under a fingernail with
        pitting underneath — that is metal actively leaving the truck, and it is a countdown, not a
        look. <strong>Perforation</strong> is daylight through steel, and no coating on earth
        rescues it. Sealing a panel with scale under the film is putting glass over a leak.
      </p>
      <p>
        Location matters more than stage. Skin panels are cosmetic; structure is not. On a classic
        pickup, put a pick and a flashlight on the frame rails around the spring hangers and
        steering box, the cab mounts, the rocker boxes, the cab corners, the floor pans, and the
        box crossmembers. Run a magnet along the lower panels — no pull means body filler, and
        filler means someone already fought rust here and may not have won.
        <a href="#src-2" className="cite-ref">[2]</a> A truck can wear perfect prairie bloom on top
        and be rotten in the mounts underneath, and the reverse is just as common: scabby-looking,
        structurally excellent.
      </p>
      <p>
        Two Alberta specifics. First, if the truck is coming in from Saskatchewan or BC, it must
        pass an out-of-province inspection — licensed facility, journeyperson technician — before
        plates are issued, and that program exists to confirm the vehicle is safe to operate.
        <a href="#src-3" className="cite-ref">[3]</a> Surface patina sails through; perforated
        structure does not. Second, probe before money changes hands, the same discipline as the{" "}
        <Link href="/blog/barn-find-first-steps">barn-find first steps</Link> — assume nothing
        until the pick says so. And borrow the preservationist&rsquo;s rule of thumb: sympathetic
        metal repair on a patina truck tops out around a tenth of the body.
        <a href="#src-2" className="cite-ref">[2]</a> Past that you are restoring, and the honest
        move is to do it properly.
      </p>

      <h2>Does clear coat over patina actually hold up?</h2>
      <p>
        The straight answer: sometimes, and never forever. Adhesion decides everything, and the
        deck is stacked against it. Standard urethane clear does not bond well to rust — that
        comes from Eastwood&rsquo;s own tech library, a company that sells clear.
        <a href="#src-4" className="cite-ref">[4]</a> And what looks like paint on a fifty-year-old
        panel is really chalked oxide, decades of wax, silicone dressing, and dirt driven into the
        surface. You cannot get it perfectly clean without erasing the character you are trying to
        seal, so whatever contamination stays behind becomes the layer your clear is actually
        stuck to. That is why the classic failure mode is edge-lift and peeling a few seasons in,
        starting at trim edges and stone chips and spreading from there.
      </p>
      <p>
        There is a sharper point buried in the Hagerty take: clear-coating patina{" "}
        <strong>is painting</strong> — same prep, same gun, same booth time — and the result is
        only as good as the preparation, so if you are doing the work right you are most of the
        way to a repaint anyway.<a href="#src-1" className="cite-ref">[1]</a> A high-gloss shell
        over weathered paint also just reads wrong. When a customer insists, the honest version of
        the job looks like this: kill every trace of loose scale, degrease until the rags come
        back clean, spray a test panel, shoot a 2K satin or matte rather than gloss, and agree up
        front that edges get inspected every spring. That is a finish with a maintenance schedule,
        sold as exactly that.
      </p>
      <p>
        The softer options age more gracefully. An oil film — boiled linseed oil cut with mineral
        spirits, or Penetrol — creeps into the rust pores, sheds water, and darkens the surface so
        the remaining colour pops; the effect fades over months and wants reapplying every season.
        The catch is that oil soaks deep, and if the truck ever heads to paint, getting the panels
        oil-free is miserable.<a href="#src-1" className="cite-ref">[1]</a> Wax on the surviving
        paint is the least committed move of all, and fully reversible. So the shop guidance runs:
        a truck that might be painted someday gets wax, never oil. A keeper patina truck living
        outdoors gets the oil film. A show truck under a roof gets the 2K matte — eyes open.
      </p>

      <h2>What are your four real options, and what do they cost?</h2>
      <p>
        Four honest paths, with typical planning ranges in Canadian dollars — ranges, not quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Keeping patina as-found versus preserving it with oil or wax versus sealing it under
            two-component clear versus repainting, compared by typical Canadian dollar cost, how
            each option ages, and when each is the right call
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Keep it</th>
              <th scope="col">Oil or wax it</th>
              <th scope="col">Seal it (2K clear)</th>
              <th scope="col">Paint it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Typical cost (CAD)</th>
              <td className="num">$0 – $300 / year</td>
              <td className="num">$50 – $200 / season</td>
              <td className="num">$2,000 – $5,000</td>
              <td className="num">$8,000 – $20,000+</td>
            </tr>
            <tr>
              <th scope="row">What it looks like</th>
              <td>As found — honest, slow fade</td>
              <td>Darker, wetter, colours pop for a season</td>
              <td>Locked-in, low sheen</td>
              <td>A new truck; originality gone for good</td>
            </tr>
            <tr>
              <th scope="row">How it fails</th>
              <td>Rust creeps if driven wet</td>
              <td>Fades in months; fights any future paint</td>
              <td>Edge-lift and peeling at chips</td>
              <td>Only by budget and prep quality</td>
            </tr>
            <tr>
              <th scope="row">Best when</th>
              <td>Original paint, fair-weather truck</td>
              <td>Keeper living outside</td>
              <td>Show truck, dry storage</td>
              <td>Structure repaired, finish failed</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The repaint column deserves one honest footnote: metal repair drives that bill, not
        colour. A truck with sound panels and a dead finish sits at the bottom of the range; a
        truck that needs rockers, cab corners, and floor sections before primer sits far above it,
        because that is fabrication time, not spray time. The{" "}
        <Link href="/services/body-paint-metalwork">body, paint, and metalwork page</Link> breaks
        down how the shop sequences that work — steel first, colour second, always.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">Once</span>
          <span className="stat-l">How many times a truck is original</span>
        </div>
        <div>
          <span className="stat-v">~10%</span>
          <span className="stat-l">Metal replacement before preserving becomes restoring</span>
        </div>
        <div>
          <span className="stat-v">$2,000–$5,000</span>
          <span className="stat-l">Typical clear-over-patina, done as real paint work</span>
        </div>
        <div>
          <span className="stat-v">$8,000–$20,000+</span>
          <span className="stat-l">Typical driver-quality repaint, sound metal</span>
        </div>
      </div>

      <h2>Can you drive a patina truck through an Edmonton winter?</h2>
      <p>
        You can. The truck will pay. Edmonton treats winter roads with sand, salt, and calcium
        chloride brine, adjusting the mix to the weather, and the city is genuinely one of the
        lowest salt users among major Canadian cities.<a href="#src-5" className="cite-ref">[5]</a>{" "}
        That is cold comfort for bare steel: chloride brine clings to panels and stays damp on
        them, and a patina panel is bare steel on purpose. A vehicle already showing surface rust
        is more rust-prone than a painted one, and running it through snow and salt accelerates
        the damage dramatically.<a href="#src-1" className="cite-ref">[1]</a> Bloom that held
        steady for forty dry prairie summers can move to scale in two brine seasons.
      </p>
      <p>
        The sustainable calendar here is May to October. Park the truck before the brine trucks
        roll, and the patina stays the slow, stable kind that made it valuable. If it absolutely
        must move in winter, rinse the underside often, lay an oil film on the exposed metal every
        fall, and price in the decay you are choosing. Storage prep — fuel, battery, moisture, and
        where to park it — is covered in one place in the{" "}
        <Link href="/guides/winter">winter guide</Link>.
      </p>

      <h2>So — keep it, seal it, or paint over it?</h2>
      <p>The decision, compressed to four lines:</p>
      <ul>
        <li>
          <strong>Original paint, solid structure, summer truck:</strong> keep it. Wash it, wax
          what paint survives, park it inside, and let the market keep agreeing with you.
        </li>
        <li>
          <strong>Keeper truck that lives outside:</strong> oil film every fall — and skip the oil
          entirely if paint is ever in the truck&rsquo;s future.
        </li>
        <li>
          <strong>Show truck you want frozen in time:</strong> 2K satin over serious prep, treated
          as paint work, with edges checked every spring.
        </li>
        <li>
          <strong>Scale in the structure, a dead respray, or a daily driver:</strong> fix the
          steel and paint the truck. New history starts now, and there is no shame in it.
        </li>
      </ul>
      <p>
        If you are staring at a rocker wondering which side of the line it sits on, do not guess.
        Take photos of the worst of it — rockers, cab corners, mounts, and floors, not the good
        fender — and send them through the <Link href="/quote#form">quote page</Link> with the year and
        model. You will get a straight answer: preserve, seal, or cut steel. The truck already
        knows which one it needs. It just takes a pick and honest eyes to hear it.
      </p>
    </>
  );
}
