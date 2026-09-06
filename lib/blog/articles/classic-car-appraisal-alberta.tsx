import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Classic Car Appraisals in Alberta.
 * The paperwork wedge for the valuation keyword cluster. Answers when a
 * written appraisal is actually required — agreed-value insurance, sale,
 * estate — what the appraiser inspects, and honest CAD fee ranges. Links
 * down into the restomod explainer, the restoration timeline, the
 * out-of-province inspection guide, the restomod service page, and the
 * quote page.
 */

export const meta: ArticleMeta = {
  slug: "classic-car-appraisal-alberta",
  title: "When Your Classic Needs an Appraisal — and What One Costs in Alberta",
  accent: "Appraisal",
  metaTitle: "Classic Car Appraisals in Alberta",
  description: "The four moments a classic actually needs a written appraisal in Alberta — agreed-value insurance, sale, estate — what the appraiser checks, and honest CAD fee.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Paperwork",
  targetKeywords: [
    "classic car appraisal Edmonton",
    "classic car appraisal cost",
    "agreed value appraisal Alberta",
    "how to get a classic car appraised",
    "collector car appraisal Alberta",
  ],
  faq: [
    {
      q: "How much does a classic car appraisal cost in Alberta?",
      a: "A standard in-person appraisal on a classic car or truck in the Edmonton area typically runs $200 to $350 in Canadian dollars, with the report included. Photo-based desktop appraisals commonly run $100 to $200, and specialty work — one-off customs, disputed insurance claims, or reports prepared for lawyers — commonly starts around $400 and climbs with complexity. All of these are planning ranges, not quotes; appraisers post their own fees.",
    },
    {
      q: "Do I need an appraisal for agreed value classic car insurance?",
      a: "Often not for a stock, unmodified classic. Collector insurers in Canada work from their own valuation data, and RBC's collector program states an appraisal is not required where the value reflects verifiable market values. The cars that do need one are exactly the cars the price guides cannot see: restomods, engine-swapped trucks, fresh frame-off restorations, and anything with rare options or documented history that pushes it past the book number.",
    },
    {
      q: "How do I get a classic car appraised in Edmonton?",
      a: "Book an appraiser who works on collector vehicles — several in the Edmonton area come to you, which matters for a car that is insured for limited use. Have the car clean and cold, and have your documentation ready: receipts, build photos, ownership history, and any factory paperwork. Expect roughly an hour to two hours on the car, then a written report with photographs, usually inside a week or two.",
    },
    {
      q: "How often should a classic car appraisal be updated?",
      a: "Review the insured value once a year against the market, and update the appraisal itself whenever the car changes — a completed restoration, an engine swap, a repaint, or accident repair. An agreed value set five years ago on a car that has since had a full build is the most common and most expensive gap we see: the policy pays the old number, not the new car.",
    },
    {
      q: "Is an appraisal required to sell a classic car in Alberta?",
      a: "No. Alberta requires a completed bill of sale to transfer ownership — names and addresses of both parties, VIN, vehicle description, price, and signatures — and the buyer registers from there. An appraisal is optional, but in a private sale it does real work: private transactions fall outside AMVIC's consumer protection framework, so a written third-party valuation with photos is one of the few trust documents a seller can offer.",
    },
  ],
  citations: [
    {
      name: "“Antique & Collector Car Insurance Policy Features,” Hagerty Canada",
      url: "https://www.hagerty.ca/insurance/classic-car-insurance/policy-features",
    },
    {
      name: "“Collector Car Insurance,” RBC Insurance",
      url: "https://www.rbcinsurance.com/en-ca/auto-car-insurance/collector-classic-car-insurance/",
    },
    {
      name: "Consumer information, Alberta Motor Vehicle Industry Council (AMVIC)",
      url: "https://www.amvic.org/consumer/",
    },
    {
      name: "“Buying a vehicle from a private seller,” Government of Alberta",
      url: "https://www.alberta.ca/buying-vehicle-private-seller",
    },
    {
      name: "“Standard bill of sale,” Government of Alberta",
      url: "https://www.alberta.ca/standard-bill-sale",
    },
  ],
  internalLinks: [
    "/blog/what-is-a-restomod",
    "/services/restomods-custom-builds",
    "/blog/classic-car-restoration-timeline",
    "/blog/out-of-province-inspection-edmonton",
    "/quote",
  ],
  readingMinutes: 8,
};

/**
 * A classic coupe in side elevation on a datum grid, drawn as steel line
 * art, with six tungsten pins marking what the appraiser inspects — serial
 * plates, panel gaps, brightwork, engine bay, floors, and the documentation
 * binder — and the written report rendered as a plate at right with the
 * agreed value line underscored in amber. Editorial diagram in the shop's
 * plate style: every label mono, every glow sourced.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical side-elevation diagram of a classic coupe on a measuring datum grid in steel line art, with six numbered tungsten callout pins marking what an appraiser inspects — serial and VIN plates, panel gaps and paint, brightwork and glass, engine bay numbers, floors and frame, and the documentation binder — beside a written appraisal report plate with the agreed value line underscored in amber"
      className="h-auto w-full"
    >
      <title>One walkaround, one number that holds — what the clipboard sees</title>
      <defs>
        <radialGradient id="ap-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ap-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a9ca0" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#9a9ca0" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* pool of light under the car */}
      <ellipse cx="490" cy="510" rx="340" ry="34" fill="url(#ap-pool)" />

      {/* ══ DATUM GRID — baseline and stations ══ */}
      <g stroke="#9a9ca0" strokeOpacity="0.35" strokeWidth="1" fill="none">
        <line x1="150" y1="522" x2="830" y2="522" />
        {[190, 270, 350, 430, 510, 590, 670, 750].map((x) => (
          <line key={x} x1={x} y1="522" x2={x} y2="530" />
        ))}
      </g>
      <text
        x="830"
        y="544"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.45"
      >
        DATUM — EVERY NUMBER MEASURED, NONE GUESSED
      </text>

      {/* ══ THE CAR — side elevation, nose right ══ */}
      {/* body outline */}
      <path
        d="M 232 386 L 236 428 L 252 438 L 268 448
           A 62 62 0 0 1 392 448
           L 586 448
           A 62 62 0 0 1 710 448
           L 748 440 L 766 428 L 768 402
           L 700 394 L 604 386
           L 562 332 Q 556 326 544 325
           L 432 322 Q 418 322 406 330
           L 352 370 L 262 380 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* bumpers */}
      <g stroke="#9a9ca0" strokeWidth="1.4" strokeOpacity="0.8" fill="none" strokeLinecap="round">
        <path d="M 226 396 L 214 398 L 214 416 L 228 420" />
        <path d="M 770 408 L 784 410 L 784 424 L 770 426" />
      </g>
      {/* wheels */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8">
        <circle cx="330" cy="452" r="50" />
        <circle cx="330" cy="452" r="20" strokeWidth="1.2" strokeOpacity="0.7" />
        <circle cx="648" cy="452" r="50" />
        <circle cx="648" cy="452" r="20" strokeWidth="1.2" strokeOpacity="0.7" />
      </g>
      {/* glass — quarter window, door glass, windshield */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.8">
        <path d="M 420 334 L 468 336 L 466 372 L 408 368 Z" fill="url(#ap-glass)" />
        <path d="M 480 336 L 540 337 L 556 340 L 546 374 L 478 372 Z" fill="url(#ap-glass)" />
        <path d="M 552 341 L 596 382" fill="none" />
      </g>
      {/* door cut with gap ticks */}
      <path
        d="M 474 336 L 470 448"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.2"
        strokeOpacity="0.85"
      />
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round">
        <line x1="466" y1="400" x2="458" y2="400" />
        <line x1="478" y1="400" x2="486" y2="400" />
      </g>
      {/* door handle + body line */}
      <line x1="492" y1="392" x2="516" y2="392" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="252" y1="404" x2="742" y2="410" stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.4" />
      {/* hood cut */}
      <path d="M 604 386 L 616 396" fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.7" />
      {/* VIN plate at the cowl */}
      <rect x="582" y="370" width="16" height="8" fill="none" stroke="#ffb066" strokeWidth="1.1" />
      {/* undercarriage sight line */}
      <line
        x1="404"
        y1="472"
        x2="560"
        y2="472"
        stroke="#ffb066"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeDasharray="3 5"
      />

      {/* ══ THE BINDER — receipts, photos, history ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.3" strokeLinecap="round">
        <rect x="96" y="446" width="76" height="12" />
        <rect x="102" y="432" width="76" height="12" />
        <rect x="96" y="418" width="76" height="12" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.5">
        <line x1="104" y1="424" x2="150" y2="424" />
        <line x1="110" y1="438" x2="156" y2="438" />
        <line x1="104" y1="452" x2="150" y2="452" />
      </g>

      {/* ══ THE REPORT PLATE ══ */}
      <g>
        <rect x="872" y="128" width="268" height="230" fill="none" stroke="#9a9ca0" strokeWidth="1.5" />
        <line x1="872" y1="166" x2="1140" y2="166" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.6" />
        <text
          x="888"
          y="152"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="11"
          letterSpacing="0.18em"
          fill="#9a9ca0"
        >
          APPRAISAL REPORT
        </text>
        {/* suggested text lines */}
        <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4">
          <line x1="888" y1="188" x2="1096" y2="188" />
          <line x1="888" y1="206" x2="1122" y2="206" />
          <line x1="888" y1="224" x2="1060" y2="224" />
          <line x1="888" y1="242" x2="1108" y2="242" />
        </g>
        <text
          x="888"
          y="282"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="10.5"
          letterSpacing="0.16em"
          fill="#ffb066"
        >
          AGREED VALUE — IN WRITING
        </text>
        <line x1="888" y1="292" x2="1122" y2="292" stroke="#ffb066" strokeWidth="1.4" strokeOpacity="0.8" />
        <text
          x="888"
          y="322"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="9.5"
          letterSpacing="0.14em"
          fill="#9a9ca0"
          fillOpacity="0.6"
        >
          PHOTOS · COMPARABLES · SIGNED
        </text>
        {/* stamp ring */}
        <circle cx="1096" cy="326" r="16" fill="none" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6" />
      </g>
      {/* leader from car to report */}
      <path
        d="M 792 300 Q 836 280 868 260"
        fill="none"
        stroke="#ffb066"
        strokeWidth="0.75"
        strokeOpacity="0.5"
        strokeDasharray="3 5"
      />

      {/* ══ LEADER LINES — label column to pin ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        {/* left column */}
        <path d="M 214 116 L 434 330" />
        <path d="M 214 210 L 470 400" />
        <path d="M 214 306 L 480 472" />
        <path d="M 150 386 L 134 414" />
        {/* right column, above the report */}
        <path d="M 858 76 L 590 374" />
        <path d="M 858 96 L 688 392" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 590, y: 374, n: "1" },
          { x: 470, y: 400, n: "2" },
          { x: 434, y: 330, n: "3" },
          { x: 688, y: 392, n: "4" },
          { x: 480, y: 472, n: "5" },
          { x: 134, y: 414, n: "6" },
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
        <text x="40" y="112" fill="#ffb066">
          3 · BRIGHTWORK &amp; GLASS — DATE CODES
        </text>
        <text x="40" y="206" fill="#ffb066">
          2 · PANEL GAPS &amp; PAINT — THE MAGNET TEST
        </text>
        <text x="40" y="302" fill="#ffb066">
          5 · FLOORS &amp; FRAME — WHERE WINTERS LIVE
        </text>
        <text x="40" y="382" fill="#ffb066">
          6 · THE BINDER — RECEIPTS &amp; HISTORY
        </text>
        {/* right column */}
        <text x="1160" y="72" textAnchor="end" fill="#ffb066">
          1 · SERIAL &amp; VIN PLATES — MATCH OR NOT
        </text>
        <text x="1160" y="100" textAnchor="end" fill="#ffb066">
          4 · ENGINE BAY — NUMBERS &amp; FINISHES
        </text>
        {/* steel feature labels */}
        <text x="330" y="596" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          AS FOUND
        </text>
        <text x="1006" y="392" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          AS DEFENDED
        </text>
      </g>

      {/* plate caption */}
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
        FIG. A — ONE WALKAROUND, ONE NUMBER THAT HOLDS
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        A classic needs a written appraisal at four moments: when the insurer cannot set an agreed
        value from market data — modified and freshly restored cars, mostly — when it sells, when
        an estate or a divorce needs a defensible number, and after any build that changes what the
        car is. Around Edmonton, a standard in-person appraisal typically runs $200 to $350
        CAD.
      </p>

      <h2>When do you actually need a classic car appraisal?</h2>
      <p>
        An appraisal is a signed, photographed, third-party opinion of what one specific vehicle is
        worth on one specific date. It is not a price-guide lookup, and it is not the number your
        buddy at the cruise night floated. The distinction matters because every situation that
        genuinely calls for an appraisal has the same shape: somebody else — an insurer, a buyer,
        a court, an executor — has to accept your number, and &ldquo;trust me&rdquo; is not a
        document.
      </p>
      <p>
        In practice that means four triggers. First, <strong>agreed-value insurance</strong> on a
        car the price guides cannot see — more on that below. Second, a <strong>sale</strong>,
        where a written valuation anchors the asking price and gives a stranger a reason to believe
        it. Third, <strong>estates and settlements</strong> — an executor in Alberta has to put a
        defensible value on everything the deceased owned, and a lawyer dividing property in a
        divorce needs the same thing; in both cases a guess invites a fight. Fourth, a{" "}
        <strong>finished build</strong>: the day a frame-off restoration or an engine swap is done,
        the car&rsquo;s value has changed and its paperwork has not. There is a fifth, uglier
        trigger — a total-loss dispute after a fire, theft, or crash — but by then it is too late
        to create evidence. The appraisal you need in a claim fight is the one you got before it.
      </p>
      <blockquote>
        <p>If a number matters enough to argue about later, put it in writing before later shows up.</p>
        <footer>Shop rule, learned the expensive way</footer>
      </blockquote>

      <h2>Do you need an appraisal for agreed value insurance in Alberta?</h2>
      <p>
        Often not — and it is worth understanding why, so you know when the exception is you.
        Regular auto insurance settles a total loss at actual cash value: what a depreciated
        used vehicle is worth by the book. Collector policies instead set an agreed value up
        front — Hagerty Canada writes this in Alberta as an agreed-value endorsement on its
        Guaranteed Value coverage — so a covered total loss pays the number on the policy, not a
        depreciation table.<a href="#src-1" className="cite-ref">[1]</a> For a stock,
        well-documented classic, the insurer can usually verify that number against its own
        valuation data; RBC&rsquo;s collector program, for one, states that no appraisal is
        required where the value reflects verifiable market values.
        <a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <p>
        The cars that do need an appraisal are exactly the cars this shop builds: vehicles the
        market data cannot describe. A <Link href="/blog/what-is-a-restomod">restomod</Link> with
        $60,000 CAD of driveline, brakes, and interior in it is not a book-value car — no guide
        has a row for your combination. Same for an LS-swapped square-body, a one-off custom, or
        a car with rare factory options and documented history. Insurers handle these case by
        case, and a current appraisal with photos and receipts is what moves the agreed value from
        their default to your reality. The corollary gets missed constantly: when a{" "}
        <Link href="/services/restomods-custom-builds">custom build</Link> wraps, update the
        policy. An agreed value set on the rusty starting point does not cover the finished car,
        and the gap between those two numbers is the most expensive paperwork mistake in the
        hobby.
      </p>

      <h2>What does an appraiser actually look at?</h2>
      <p>
        A proper collector-vehicle appraisal is a slow walkaround with a camera and a checklist,
        not a glance and a handshake. Expect roughly an hour to two hours on the car. The
        appraiser verifies <strong>identity</strong> first — VIN and serial plates, engine and
        driveline stampings where the marque allows it, whether the numbers match and whether
        anything has been re-stamped or swapped. Then <strong>body and paint</strong>: panel gaps,
        door fit, paint depth and overspray, evidence of filler, rust repair quality along
        rockers, floors, and frame — the places Alberta winters and gravel roads do their work.
        Then <strong>brightwork, glass, and interior</strong>: date-coded glass, chrome condition,
        upholstery originality. Then the <strong>engine bay and undercarriage</strong>, where
        finishes, hardware, and assembly quality separate a driver-grade car from a show car.
      </p>
      <p>
        The part owners underestimate is the paper. A binder of receipts, ownership history,
        factory documentation, and dated build photos can move an appraisal meaningfully, because
        it converts claims into evidence — &ldquo;rebuilt engine&rdquo; is a sentence, an invoice
        with a date and a machine shop&rsquo;s name is a fact. It is one reason this shop
        photographs and invoices every stage of a build, the same discipline laid out in the{" "}
        <Link href="/blog/classic-car-restoration-timeline">restoration timeline</Link>. The
        appraiser closes the file with comparable sales — what cars like yours actually brought
        at auction and in private sales — and lands on a number they are prepared to defend in
        writing, which is the entire point of paying for one.
      </p>

      <h2>What does a classic car appraisal cost in Alberta?</h2>
      <p>
        Less than people expect, given what it protects. Typical planning ranges in Canadian
        dollars, not quotes — appraisers post their own fees:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Photo-based desktop appraisals versus standard in-person appraisals versus specialty
            and legal appraisals, compared by typical Canadian dollar fee, turnaround, best fit,
            and limitations
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Photo / desktop</th>
              <th scope="col">Standard in-person</th>
              <th scope="col">Specialty &amp; legal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Typical fee (CAD)</th>
              <td className="num">$100 – $200</td>
              <td className="num">$200 – $350</td>
              <td className="num">$400 – $1,000+</td>
            </tr>
            <tr>
              <th scope="row">Turnaround</th>
              <td>Days</td>
              <td>One to two weeks</td>
              <td>Weeks — scope-dependent</td>
            </tr>
            <tr>
              <th scope="row">Best when</th>
              <td>Routine insurance renewal on a known, stock car</td>
              <td>Agreed value, sale, estate — most cars, most reasons</td>
              <td>One-off customs, claim disputes, court and divorce files</td>
            </tr>
            <tr>
              <th scope="row">Watch out for</th>
              <td>Only as honest as your photos; weak in a dispute</td>
              <td>Confirm the report includes photos and comparables</td>
              <td>Expert-witness time bills by the hour on top</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$200–$350</span>
          <span className="stat-l">Typical in-person appraisal, Edmonton area</span>
        </div>
        <div>
          <span className="stat-v">1–2 hrs</span>
          <span className="stat-l">Time on the car for a proper inspection</span>
        </div>
        <div>
          <span className="stat-v">$400+</span>
          <span className="stat-l">Customs, disputes, and lawyer-bound reports</span>
        </div>
        <div>
          <span className="stat-v">1 binder</span>
          <span className="stat-l">Receipts and photos — the free value-add</span>
        </div>
      </div>
      <p>
        Two Alberta practicalities. Most collector-vehicle appraisers here are mobile — they come
        to your garage or to the shop — which matters when the car is on a collector policy with
        limited-use terms, or simply not roadworthy yet. And spring is their rush, for the same
        reason it is everyone&rsquo;s: show season and selling season arrive together. If the
        appraisal is feeding a spring sale or a policy renewal, book it in the winter, when both
        you and the appraiser have time to do it properly.
      </p>

      <h2>Does an appraisal help when you sell a classic?</h2>
      <p>
        It is optional, and it earns its fee twice. First, on price: sellers who guess tend to
        anchor on the one outlier auction result they remember, then wonder why the phone is
        quiet. An appraisal built on real comparables tells you what the car is worth in this
        market, in this condition, before you print the ad. Second, on trust. A private sale in
        Alberta runs on the buyer&rsquo;s confidence and not much else — AMVIC&rsquo;s consumer
        protection framework covers licensed dealers, and private transactions fall outside it
        except where an unlicensed curber is involved.<a href="#src-3" className="cite-ref">[3]</a>{" "}
        A prudent buyer will pull a vehicle information report from a registry agent and run a
        lien search on the VIN, as the province advises.<a href="#src-4" className="cite-ref">[4]</a>{" "}
        Meeting that diligence with a signed third-party valuation, a photo report, and a binder
        of receipts is how a fair asking price survives negotiation.
      </p>
      <p>
        The transfer itself needs less than people think: Alberta requires a completed bill of
        sale — names and addresses of both parties, VIN, vehicle description, price, and both
        signatures — and the buyer registers from there.
        <a href="#src-5" className="cite-ref">[5]</a> If the car is heading to a buyer outside
        Alberta, or you are the buyer bringing one in, the inspection paperwork works differently
        in both directions — the{" "}
        <Link href="/blog/out-of-province-inspection-edmonton">out-of-province inspection
        guide</Link> walks through it.
      </p>

      <h2>How do you prepare a classic for appraisal?</h2>
      <p>
        Treat it like show judging, because functionally it is. Wash the car properly,
        including the engine bay and wheel wells — an appraiser who cannot see a surface scores it
        conservatively. Have it cold-start in front of them if it runs; a car that lights off
        clean and idles is condition evidence. Lay the paper out in order: ownership history,
        restoration invoices, dated photos, factory documentation if the marque has it. Do not
        stage repairs you have not made or hide problems you know about — the report is only
        worth what the appraiser&rsquo;s signature is worth, and they know where to look.
      </p>
      <p>
        Where the shop fits: every build that goes through 2240 leaves with its own evidence
        file — staged photos, itemized invoices, and specifications — which is precisely what an
        appraiser needs to defend the strong number, and what an insurer needs to write the
        agreed value that matches the finished car. If you are planning the build now, plan the
        paperwork with it. And if the first honest question is what the project is worth doing at
        all, send the details through the <Link href="/quote">quote page</Link> and we will give
        you the shop-floor version of an appraisal: what it is, what it needs, and what that
        costs — in ranges we will stand behind.
      </p>
    </>
  );
}
