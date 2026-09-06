import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — What a Proper Paint Job Costs in Canada.
 * The money article for the body-and-paint cluster. Separates the three jobs
 * that all get sold as "a paint job," pins the cost drivers — prep depth,
 * single-stage versus base/clear, jambs — and links down into the body and
 * paint service page, the restoration service, the timeline article, and the
 * quote page.
 */

export const meta: ArticleMeta = {
  slug: "classic-car-paint-job-cost-canada",
  title: "What a Proper Paint Job Costs in Canada — and Why the Range Is So Wide",
  accent: "Range",
  metaTitle: "Classic Car Paint Job Cost Canada",
  description: "Why paint quotes run from $3,000 to past $30,000 CAD — prep depth, single-stage versus base/clear, jambs, and how to tell which paint job you are actually being",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Body & Paint",
  targetKeywords: [
    "classic car paint job cost Canada",
    "how much to paint a classic car",
    "single stage vs base clear",
    "car respray Edmonton",
    "classic car paint Edmonton",
  ],
  faq: [
    {
      q: "How much does it cost to paint a classic car in Canada?",
      a: "Three ranges, all Canadian dollars, all planning numbers rather than quotes. A production scuff-and-shoot respray on a straight car typically runs $1,500 to $5,000. A driver-quality repaint with real bodywork, proper blocking, and the jambs done commonly lands between $8,000 and $18,000. A strip-to-metal colour change or show-level finish runs $20,000 to $60,000 and can pass that on rough or rare cars. The car's condition — rust, old filler, previous repaints — moves the number more than the colour does.",
    },
    {
      q: "Why are classic car paint jobs so expensive?",
      a: "Because most of the bill is labour that happens before any colour is sprayed. A strip-to-metal repaint commonly absorbs 150 to 300-plus hours of stripping, metal repair, filler work, priming, and block sanding. Materials are the next layer: modern VOC-compliant primers, base, and clear can run $2,000 to $5,000 CAD on a full job. Then comes overhead — a heated downdraft booth, air-fed respirators for isocyanate clears, and filtration are mandatory equipment, and their cost lives inside every shop's hourly rate.",
    },
    {
      q: "Is single-stage paint good enough for a classic car?",
      a: "Often, yes. Single-stage puts colour and gloss in one product, costs less in material and spray time, and looks period-correct on solid colours — many classics wore single-stage from the factory, and an ultra-wet modern clear can read as over-restored. Choose base/clear when the colour is metallic or pearl, when you want maximum depth, or when the finish will be cut and buffed hard, because clear gives you a sacrificial layer to correct without thinning the colour itself.",
    },
    {
      q: "Can I get a good paint job for under $5,000 in Canada?",
      a: "You can get a serviceable one under the right conditions: a straight, rust-free car, staying the same colour, with no jamb work — a scuff-and-shoot that will present well at ten feet for some years. What you cannot get for that money is corrected bodywork or a finish that survives close inspection, because the hours are not in the price. If the car has rust or wavy panels, the honest move is to spend the budget on metal first and paint later.",
    },
    {
      q: "How long does a proper classic car paint job take?",
      a: "Weeks to months, and almost none of it is spraying. A driver-quality repaint commonly occupies four to ten weeks of shop time; strip-to-metal show paint can run several months because block-sanding a car flat is measured in full days per panel. Booth time is a day or two of the whole job. In the Edmonton area, book well ahead of show season — the cruising window is short and every painter's summer calendar fills by spring.",
    },
  ],
  citations: [
    {
      name: "“How Much Does It Cost To Paint a Car?,” AAA Automotive repair library",
      url: "https://www.aaa.com/autorepair/articles/how-much-does-it-cost-to-paint-a-car",
    },
    {
      name: "Andrew Newton, “Why Is Paint So Expensive?,” Hagerty Media, November 2025",
      url: "https://www.hagerty.com/media/market-trends/why-is-paint-so-expensive/",
    },
    {
      name: "Eric Giroux, “Single Stage vs Basecoat: Which Fits?,” Eastwood Canada technical library",
      url: "https://www.eastwoodcanada.com/post/single-stage-vs-basecoat-which-fits",
    },
    {
      name: "Volatile Organic Compound (VOC) Concentration Limits for Automotive Refinishing Products Regulations (SOR/2009-197), Justice Laws Website, Government of Canada",
      url: "https://laws-lois.justice.gc.ca/eng/regulations/SOR-2009-197/index.html",
    },
    {
      name: "“Spray Painting,” OSH Answers, Canadian Centre for Occupational Health and Safety",
      url: "https://www.ccohs.ca/oshanswers/safety_haz/spray-painting.html",
    },
  ],
  internalLinks: [
    "/services/body-paint-metalwork",
    "/services/classic-car-restoration",
    "/blog/classic-car-restoration-timeline",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * The paint system in section — an exploded layer stack from bare steel to
 * clearcoat, drawn as steel line art, with three tungsten depth pins showing
 * how far down each grade of paint job actually sands: the scuff-and-shoot
 * stops at the old clear, the driver repaint reaches primer, the show job
 * goes to bare metal. A coupe profile anchors the plate; a spray gun feeds
 * the top layer. Every label mono, every price a hedged CAD range.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of an automotive paint system shown as an exploded layer stack — clearcoat, basecoat colour, sealer, high-build primer, body filler, epoxy primer, and bare steel — with three numbered tungsten depth pins showing how deep each grade of paint job sands: a scuff-and-shoot respray stops at the old clearcoat, a driver-quality repaint cuts to primer, and a show-level colour change strips to bare metal, each labelled with a hedged Canadian-dollar range, beside a classic coupe profile and a spray gun feeding the top layer"
      className="h-auto w-full"
    >
      <title>Same colour, three jobs — the money is in how deep you go</title>
      <defs>
        <radialGradient id="pj-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pj-clear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0.02" />
        </linearGradient>
        <pattern id="pj-steel" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M -2 14 L 14 -2" stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.35" />
        </pattern>
      </defs>

      {/* pool of light under the stack */}
      <ellipse cx="790" cy="560" rx="330" ry="34" fill="url(#pj-pool)" />

      {/* ══ SPRAY GUN feeding the top layer ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* body + handle */}
        <path d="M 560 64 L 618 64 L 626 74 L 626 88 L 600 88 L 596 80 L 560 80 Z" />
        <path d="M 596 88 L 588 128 L 572 128 L 578 88" />
        {/* nozzle + trigger */}
        <path d="M 618 64 L 618 54 M 610 64 L 610 56" strokeOpacity="0.7" />
        <path d="M 560 68 L 546 74" strokeOpacity="0.7" />
      </g>
      {/* atomized mist toward the stack */}
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.55" strokeLinecap="round" fill="none">
        <path d="M 636 76 L 668 96" strokeDasharray="2 5" />
        <path d="M 636 84 L 664 112" strokeDasharray="2 5" />
        <path d="M 634 90 L 656 126" strokeDasharray="2 5" />
      </g>
      <text
        x="560"
        y="46"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        COLOUR — THE CHEAP PART
      </text>

      {/* ══ THE LAYER STACK — exploded, top to bottom ══ */}
      {/* clearcoat */}
      <rect x="660" y="120" width="330" height="30" fill="url(#pj-clear)" stroke="#9a9ca0" strokeWidth="1.6" />
      {/* basecoat / colour */}
      <rect x="660" y="160" width="330" height="26" fill="#ffb066" fillOpacity="0.1" stroke="#9a9ca0" strokeWidth="1.6" />
      {/* sealer */}
      <rect x="660" y="196" width="330" height="16" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.85" />
      {/* high-build primer */}
      <rect x="660" y="222" width="330" height="30" fill="none" stroke="#9a9ca0" strokeWidth="1.4" />
      {/* block-sanding ticks across the primer face */}
      <g stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.45">
        <line x1="676" y1="228" x2="700" y2="246" />
        <line x1="716" y1="228" x2="740" y2="246" />
        <line x1="756" y1="228" x2="780" y2="246" />
        <line x1="796" y1="228" x2="820" y2="246" />
        <line x1="836" y1="228" x2="860" y2="246" />
        <line x1="876" y1="228" x2="900" y2="246" />
        <line x1="916" y1="228" x2="940" y2="246" />
      </g>
      {/* body filler skim — a lens, not a slab */}
      <path
        d="M 660 276 L 990 276 M 700 276 Q 790 260 880 276"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.2"
        strokeOpacity="0.8"
      />
      {/* epoxy primer */}
      <rect x="660" y="286" width="330" height="16" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.85" />
      {/* bare steel — hatched */}
      <rect x="660" y="312" width="330" height="44" fill="url(#pj-steel)" stroke="#9a9ca0" strokeWidth="2" />

      {/* ══ LAYER LABELS — right column ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        <text x="1004" y="139">CLEARCOAT</text>
        <text x="1004" y="177">BASECOAT / COLOUR</text>
        <text x="1004" y="208">SEALER</text>
        <text x="1004" y="241">HIGH-BUILD PRIMER — BLOCKED</text>
        <text x="1004" y="278">FILLER SKIM</text>
        <text x="1004" y="298">EPOXY PRIMER</text>
        <text x="1004" y="338">BARE STEEL</text>
      </g>

      {/* ══ DEPTH PINS — how far each job cuts ══ */}
      {/* dashed depth lines from label column to the layer each tier reaches */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 318 130 L 636 130" />
        <path d="M 318 210 L 636 237" />
        <path d="M 318 290 L 636 334" />
      </g>
      {/* sanding-depth arrows at the stack's left edge */}
      <g stroke="#ffb066" strokeWidth="1.2" strokeLinecap="round" fill="none">
        <path d="M 648 118 L 648 130 M 643 124 L 648 131 L 653 124" strokeOpacity="0.9" />
        <path d="M 648 196 L 648 237 M 643 231 L 648 238 L 653 231" strokeOpacity="0.9" />
        <path d="M 648 260 L 648 334 M 643 328 L 648 335 L 653 328" strokeOpacity="0.9" />
      </g>
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 648, y: 130, n: "1" },
          { x: 648, y: 237, n: "2" },
          { x: 648, y: 334, n: "3" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>

      {/* ══ TIER LABELS — left column ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10.5" letterSpacing="0.16em">
        <text x="40" y="124" fill="#ffb066">
          1 · SCUFF &amp; SHOOT — SANDS TO HERE
        </text>
        <text x="40" y="140" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          TYP. $1.5K–$5K CAD
        </text>
        <text x="40" y="204" fill="#ffb066">
          2 · DRIVER REPAINT — CUTS TO PRIMER
        </text>
        <text x="40" y="220" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          TYP. $8K–$18K CAD
        </text>
        <text x="40" y="284" fill="#ffb066">
          3 · SHOW / COLOUR CHANGE — BARE STEEL
        </text>
        <text x="40" y="300" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          TYP. $20K–$60K+ CAD
        </text>
      </g>

      {/* ══ COUPE PROFILE — the panel the stack lives on ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* body line: nose, hood, roof, deck, tail */}
        <path d="M 66 500 L 78 476 Q 84 466 100 464 L 200 456 Q 254 414 318 410 L 372 410 Q 420 414 446 442 L 500 452 Q 516 456 518 470 L 518 494 Q 518 500 508 500 L 486 500" />
        <path d="M 66 500 L 66 486 Q 66 470 82 470" strokeOpacity="0.7" />
        {/* rockers between arches */}
        <path d="M 154 500 L 210 500 M 366 500 L 422 500" />
        {/* wheel arches */}
        <path d="M 96 500 Q 96 460 128 460 Q 160 460 160 500" strokeOpacity="0.9" />
        <path d="M 416 500 Q 416 460 448 460 Q 480 460 480 500" strokeOpacity="0.9" />
        {/* wheels */}
        <circle cx="128" cy="500" r="24" strokeOpacity="0.8" />
        <circle cx="128" cy="500" r="8" strokeOpacity="0.5" />
        <circle cx="448" cy="500" r="24" strokeOpacity="0.8" />
        <circle cx="448" cy="500" r="8" strokeOpacity="0.5" />
        {/* glasshouse + door cut */}
        <path d="M 236 456 Q 268 422 322 418 L 360 418 Q 396 422 414 444" strokeOpacity="0.7" strokeWidth="1.2" />
        <path d="M 300 456 L 300 418 M 302 456 L 306 500" strokeOpacity="0.55" strokeWidth="1.1" />
      </g>
      {/* the sampled quarter panel — zoom ring tied to the stack */}
      <circle cx="452" cy="446" r="17" fill="none" stroke="#ffb066" strokeWidth="1.3" />
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 468 440 L 560 384 L 640 344" />
      </g>
      <text
        x="66"
        y="560"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        ONE QUARTER PANEL, IN SECTION
      </text>

      {/* plate caption */}
      <text
        x="600"
        y="632"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. P — SAME COLOUR, THREE JOBS: THE MONEY IS IN HOW DEEP YOU GO
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        A proper repaint on a classic in Canada typically runs $8,000 to $18,000 CAD;
        strip-to-metal show paint runs $20,000 to $60,000-plus; and the $3,000 respray also
        exists — it is just a different product. The spread is not the paint in the gun. It is
        prep depth, jambs, and what the shop finds under the old finish.
      </p>
      <p>
        Three very different jobs get sold under the same two words. This article separates them
        — the scuff-and-shoot, the driver-quality repaint, and the strip-to-metal show job —
        shows where the hours actually go, and gives you the questions that make any two quotes
        comparable. Because the number alone will not tell you which of the three you are buying.
      </p>

      <h2>Why do paint quotes run from $3,000 to past $30,000?</h2>
      <p>
        Because &ldquo;paint job&rdquo; is not one product. At the bottom of the market, a
        production shop scuffs the existing finish, masks the trim in place, and shoots new
        colour over whatever is there. AAA&rsquo;s repair library pegs that grade in the low four
        figures and says the quiet part plainly: on cheap resprays, prep is skimped or skipped,
        and areas you do not see from the curb — underhood, inside the door frames — stay the
        old colour.<a href="#src-1" className="cite-ref">[1]</a> Nothing dishonest about it. On a
        straight, rust-free daily driver it is the right tool.
      </p>
      <p>
        Restoration paint is a different product wearing the same name. Hagerty, writing about
        why paint keeps getting more expensive, points to dedicated shops posting menus that
        start around $13,000 USD for driver-grade paint and climb past $55,000 for
        best-of-show finishes — and to a scruffy-but-solid C10 drawing a paint-and-body estimate
        near $20,000.<a href="#src-2" className="cite-ref">[2]</a> Those are American numbers,
        but the shape of them holds in Alberta: unless you compromise hard on quality, there is
        no such thing as a cheap paint job.
      </p>
      <p>
        The gun time is nearly identical on all three. What separates them is everything before
        the gun. Typical planning ranges in Canadian dollars, not quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            The three grades of paint job — scuff-and-shoot respray, driver-quality repaint, and
            strip-to-metal show or colour-change paint — compared by typical Canadian dollar
            cost, sanding depth, jamb and trim treatment, bodywork included, and what each grade
            is honestly for
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Scuff-and-shoot</th>
              <th scope="col">Driver-quality repaint</th>
              <th scope="col">Show / colour change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Typical cost (CAD)</th>
              <td className="num">$1,500 – $5,000</td>
              <td className="num">$8,000 – $18,000</td>
              <td className="num">$20,000 – $60,000+</td>
            </tr>
            <tr>
              <th scope="row">How deep it sands</th>
              <td>Scuffs the old finish for adhesion</td>
              <td>Cuts to primer; strips questionable areas</td>
              <td>Bare metal, every panel</td>
            </tr>
            <tr>
              <th scope="row">Jambs, underhood, trunk</th>
              <td>Masked off, stay the old colour</td>
              <td>Usually included; doors and deck come off</td>
              <td>Everything — shell painted inside and out</td>
            </tr>
            <tr>
              <th scope="row">Bodywork included</th>
              <td>None to a quick skim</td>
              <td>Real filler work and block sanding</td>
              <td>Metal finishing; gaps set before primer</td>
            </tr>
            <tr>
              <th scope="row">Honestly for</th>
              <td>A straight daily you want tidy at ten feet</td>
              <td>A classic you drive and are proud of up close</td>
              <td>Colour changes, show cars, keepers</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What does &ldquo;prep&rdquo; actually pay for?</h2>
      <p>
        Flatness. A show finish is not sprayed on — it is sanded on. High-build primer goes over
        the bodywork, gets guide-coated, and is block-sanded by hand until a fluorescent tube
        reflects down the panel in one unbroken line. Then it happens again. A single door can
        absorb a full day of blocking; a strip-to-metal repaint commonly absorbs 150 to 300-plus
        hours before colour. That is the bill. The paint is the cheap part.
      </p>
      <p>
        Prep is also where the surprises live, and on sixty-year-old sheet metal there are
        always surprises. Alberta cars carry decades of gravel rash, and anything driven through
        Edmonton winters has met road salt and calcium chloride brine somewhere under its
        rockers. Old repaints hide the rest: strip a straight-looking quarter and you find a
        quarter-inch of filler over a crease from 1987, or brazed patches going green. This is
        why an honest paint quote on a classic is a range with a discovery clause, not a firm
        number — the real scope shows up when the old finish comes off. It is the same reason
        the metal side of our{" "}
        <Link href="/services/body-paint-metalwork">body, paint, and metalwork service</Link>{" "}
        is quoted stage by stage: nobody can price rust they have not seen yet.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">60–80%</span>
          <span className="stat-l">Share of a proper paint bill that is prep and bodywork, not colour</span>
        </div>
        <div>
          <span className="stat-v">150–300+ hrs</span>
          <span className="stat-l">Typical labour, strip-to-metal classic repaint</span>
        </div>
        <div>
          <span className="stat-v">$2,000–$5,000+</span>
          <span className="stat-l">Materials alone — primers, sealer, colour, clear, abrasives</span>
        </div>
        <div>
          <span className="stat-v">1–2 days</span>
          <span className="stat-l">Actual booth time on a multi-week job</span>
        </div>
      </div>
      <blockquote>
        <p>You are not paying for the colour. You are paying for the reflection.</p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>

      <h2>Single-stage or base/clear — which one are you being quoted?</h2>
      <p>
        The other fork in every paint quote is the system. Single-stage paint carries colour and
        gloss in one product; a base/clear system separates them — basecoat for colour, then a
        urethane clear for gloss, depth, and UV protection.<a href="#src-3" className="cite-ref">[3]</a>{" "}
        Single-stage means fewer materials and fewer spray steps, so it lands cheaper, and on
        solid colours it looks period-correct — most classics wore single-stage from the
        factory, and a thick modern wet-look clear on a 1950s solid can read as over-restored
        rather than right.
      </p>
      <p>
        Base/clear earns its premium three ways: metallics and pearls lay down more evenly in
        basecoat; the clear gives more depth and better long-term gloss retention; and when dirt
        or orange peel needs cutting and buffing, you are correcting a sacrificial clear layer
        instead of thinning the colour itself.<a href="#src-3" className="cite-ref">[3]</a> The
        practical rule: solid-colour driver, single-stage is a defensible saving; metallic,
        pearl, or anything aiming at show correction, base/clear. A quote that does not say
        which system — or names no paint line at all — is not finished being written.
      </p>

      <h2>Do jambs and panel gaps really change the price that much?</h2>
      <p>
        They are the biggest single fork in the estimate. Painting jambs, underhood, and the
        trunk aperture means the car comes apart: doors, hood, and deck lid off and painted
        separately, glass and seals out, handles and stainless trim removed rather than masked.
        Every one of those steps is hours, which is exactly why the budget tier masks around
        parts instead of removing them and leaves the unseen areas alone.
        <a href="#src-1" className="cite-ref">[1]</a> On a same-colour repaint you can sometimes
        defend skipping the jambs. On a colour change you cannot — every door opening announces
        the old colour, and the car reads as resprayed, permanently, to anyone who looks.
      </p>
      <p>
        Panel gaps are the quieter tell. On a proper job the fenders, doors, and hood are hung,
        shimmed, and set to even gaps <strong>before</strong> final primer, because paint adds
        thickness and a gap you like bare will tighten by a couple of coats. Show painters
        block-sand with the panels bolted on for the same reason. When a quote includes
        &ldquo;fit and alignment,&rdquo; that is not padding — it is the difference between a
        car that photographs straight and one that is merely shiny.
      </p>

      <h2>Why did paint itself get so expensive in Canada?</h2>
      <p>
        Three compounding reasons. First, the chemistry: modern urethane systems and their
        pigments — especially custom-mixed metallics and pearls — are genuinely costly to
        develop and buy, and Hagerty ranks paint among the most expensive, most regulated, and
        least DIY-friendly parts of restoring a car.<a href="#src-2" className="cite-ref">[2]</a>{" "}
        Second, the regulation is real: since 2010, federal rules under SOR/2009-197 have
        capped the volatile organic compound content of automotive refinishing products sold in
        Canada, which pushed the industry into low-VOC and waterborne systems that demand
        tighter technique and climate control than the old high-solvent lacquers ever did.
        <a href="#src-4" className="cite-ref">[4]</a>
      </p>
      <p>
        Third, the safety overhead is non-negotiable. Two-component urethane clears cure with
        isocyanates, which the Canadian Centre for Occupational Health and Safety flags as
        highly toxic sensitizers — capable of triggering asthma-like reactions at very low
        exposures — demanding proper booth ventilation and supplied-air respirators, not a
        cartridge mask in a driveway.<a href="#src-5" className="cite-ref">[5]</a> A heated
        downdraft booth in a city that spends four months below freezing costs real money to
        run, and that cost lives inside every shop&rsquo;s hourly rate. It is also most of the
        answer to &ldquo;why is my buddy&rsquo;s garage quote half the price&rdquo; — and why
        the garage job so often gets bought twice.
      </p>

      <h2>How do you make two paint quotes comparable?</h2>
      <p>
        Two numbers $7,000 apart are usually describing two different jobs. Before comparing
        price, make both shops answer the same seven questions:
      </p>
      <ul>
        <li>How deep does the sanding go — scuff, cut to primer, or strip to bare metal?</li>
        <li>What comes off the car, and what gets masked in place?</li>
        <li>Are jambs, underhood, and the trunk aperture painted?</li>
        <li>Single-stage or base/clear — and which paint line, by name?</li>
        <li>How much bodywork and blocking is included, in hours or dollars?</li>
        <li>What is the allowance for rust and filler discoveries, and how are changes approved?</li>
        <li>Is cut-and-buff included, and what does the warranty actually cover?</li>
      </ul>
      <p>
        Ask those and the cheap quote usually confesses on the spot — it was a scuff-and-shoot
        wearing a restoration&rsquo;s name. Sometimes that is still the right buy. But now you
        are choosing it, instead of discovering it at the first open door.
      </p>
      <p>
        One caution from the floor: paint is the <strong>last</strong> trade on a car, not the
        first. Spraying show paint over tired mounts, seeping gaskets, and un-repaired metal
        just seals problems somewhere expensive, which is why a{" "}
        <Link href="/services/classic-car-restoration">full restoration</Link> sequences paint
        after metal, driveline, and trial assembly — and why the{" "}
        <Link href="/blog/classic-car-restoration-timeline">restoration timeline</Link> puts
        bodywork and paint in the long middle of the schedule, not the triumphant end. If the
        budget forces a choice between perfect paint and finished mechanicals, finish the car.
        Paint waits better than rust does.
      </p>
      <p>
        If you are pricing paint for a classic in Edmonton, Sherwood Park, St. Albert, or
        anywhere in the region, send the year, model, current condition, and what you want the
        car to be — ten-foot driver or trophy hunter — through the{" "}
        <Link href="/quote">quote page</Link>. You will get a straight answer about which of the
        three jobs your car and your budget actually call for, a staged range in Canadian
        dollars, and — when it is true — the advice that your money should go into metal first
        and colour next year.
      </p>
    </>
  );
}
