import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Selling a Classic in Canada.
 * The exit half of the ownership lifecycle: defensible pricing, the
 * documentation that converts to money, and auction versus consignment versus
 * private sale with the Alberta paperwork attached. Links down into the
 * appraisal and out-of-province articles, the body and paint service page,
 * the winter storage guide, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "selling-a-classic-car-canada",
  title:
    "Selling a Classic in Canada: Pricing It, Proving It, and Picking the Venue",
  accent: "Proving It",
  metaTitle: "How to Sell a Classic Car in Canada",
  description: "How to put a defensible price on a classic, which paperwork actually adds money, and whether auction, consignment, or a private sale nets more in Alberta.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Buy Smart",
  targetKeywords: [
    "how to sell a classic car Canada",
    "classic car auction vs private sale",
    "classic car value Canada",
    "selling a restored car",
    "sell classic car Alberta",
  ],
  faq: [
    {
      q: "How do I find out what my classic car is worth in Canada?",
      a: "Start with a price guide bracket for an honestly graded condition — most restored drivers are a #3, not the #2 their owners believe — then override the guide with sold comparables for your exact drivetrain and spec. Most comp data is American, so convert to Canadian dollars and remember your buyer's alternative is importing a U.S. car with shipping and exchange on top. An insurance appraisal is not a market price; it protects the car, it does not sell it.",
    },
    {
      q: "Is it better to sell a classic car at auction or privately?",
      a: "A private sale usually nets the most because nobody takes a commission and, in Alberta, no sales tax lands on a deal between individuals — but it costs weeks of your time and every showing is yours to run. An auction trades some of the money for a certain sale date and competitive bidding, with entry fees and seller commissions commonly quoted in the 5 to 10 percent range. Consignment sits in the middle: a licensed business does the work and takes its cut from your cheque.",
    },
    {
      q: "What paperwork do I need to sell a car privately in Alberta?",
      a: "A bill of sale carrying the full names and addresses of buyer and seller, the VIN, the year, make, model, and colour, the price, and both signatures — Alberta publishes a free standard form, and you fill out two copies so each side keeps one. Licence plates stay with the seller in Alberta, so pull them before the car leaves, and clear any lien beforehand, because a careful buyer will run the search and walk if it comes back dirty.",
    },
    {
      q: "Do I pay tax when I sell my classic car in Alberta?",
      a: "In a private sale between individuals in Alberta, no sales tax applies to the transaction — Alberta has no PST, and GST attaches when a business sells the car, which is one quiet advantage a private seller holds over a consignment lot. Income tax is a separate question: a collector car that sells for meaningfully more than it cost can trigger a capital gain under Canada's personal-use property rules, and that conversation belongs with your accountant before the ad goes up, not after.",
    },
    {
      q: "Should I restore my car before selling it?",
      a: "No. Sort it, clean it, and document it — do not restore it. Fixing the cheap mechanical flaws pays, because every leak and dead gauge costs more in negotiation than the repair would have. A pre-sale repaint almost never comes back: honest paint and metal work runs deep into five figures, buyers discount fresh paint because they cannot see what is under it, and the market prices your car as a driver either way. Sell a project as a project and let the next owner restore it their way.",
    },
  ],
  citations: [
    {
      name: "“How to Find the Value of a Classic Car,” Hagerty resource library",
      url: "https://www.hagerty.com/resources/how-tos/how-to-find-the-value-of-a-classic-car",
    },
    {
      name: "“How To Sell Your Classic Car at an Auction,” Hagerty resource library",
      url: "https://www.hagerty.com/resources/car-buying-and-selling/selling-at-a-classic-car-auction",
    },
    {
      name: "“About Us,” EG Auctions — Canada's largest classic and collector car auction house",
      url: "https://www.egauctions.com/about-us",
    },
    {
      name: "“Consigning a Vehicle,” Alberta Motor Vehicle Industry Council (AMVIC)",
      url: "https://www.amvic.org/consumer/consigning-a-vehicle/",
    },
    {
      name: "“Standard Bill of Sale,” Government of Alberta",
      url: "https://www.alberta.ca/standard-bill-sale",
    },
  ],
  internalLinks: [
    "/blog/classic-car-appraisal-alberta",
    "/blog/out-of-province-inspection-edmonton",
    "/services/body-paint-metalwork",
    "/blog/classic-car-winter-storage-alberta",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * The exit, drawn as a plate: a classic coupe in steel line art under a price
 * ladder graded #4 to #2 with the ask pinned in tungsten, a document stack
 * feeding the car its proof, and three numbered routes out of the bottom —
 * auction gavel, consignment storefront, private-sale bill — each tagged with
 * what it costs. Every label mono, every glow sourced.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Diagram of selling a classic car: a coupe in steel line art beneath a price ladder graded from #4 driver to #2 excellent with the asking price and reserve floor marked in tungsten, a stack of documentation labelled receipts, photos, and chain of owners feeding the car, and three numbered exit routes below — auction with a gavel, consignment with a storefront, private sale with a signed bill of sale — each labelled with what it costs the seller"
      className="h-auto w-full"
    >
      <title>The price ladder, the proof, and the three ways out</title>
      <defs>
        <radialGradient id="sc-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the car */}
      <ellipse cx="600" cy="372" rx="300" ry="30" fill="url(#sc-pool)" />

      {/* ══ PRICE LADDER ══ */}
      <line x1="250" y1="112" x2="950" y2="112" stroke="#9a9ca0" strokeWidth="1.4" strokeLinecap="round" />
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeLinecap="round">
        <line x1="250" y1="104" x2="250" y2="120" />
        <line x1="950" y1="104" x2="950" y2="120" />
        <line x1="360" y1="106" x2="360" y2="118" />
        <line x1="560" y1="106" x2="560" y2="118" />
        <line x1="880" y1="106" x2="880" y2="118" />
      </g>
      {/* the ask — tungsten diamond */}
      <path d="M 720 100 L 730 112 L 720 124 L 710 112 Z" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.4" />
      {/* the floor / reserve — dashed drop below the ask */}
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <line x1="660" y1="112" x2="660" y2="140" strokeDasharray="3 4" />
        <line x1="648" y1="140" x2="672" y2="140" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="360" y="92" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.65">
          #4 DRIVER
        </text>
        <text x="560" y="92" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.65">
          #3 GOOD
        </text>
        <text x="880" y="92" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.65">
          #2 EXCELLENT
        </text>
        <text x="720" y="76" textAnchor="middle" fill="#ffd9ad">
          YOUR ASK
        </text>
        <text x="660" y="158" textAnchor="middle" fill="#ffb066" fillOpacity="0.8" fontSize="10">
          FLOOR / RESERVE
        </text>
        <text x="250" y="140" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.5" fontSize="10">
          SOLD COMPS
        </text>
        <text x="950" y="140" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.5" fontSize="10">
          GUIDE VALUES
        </text>
      </g>
      <path d="M 720 124 L 720 176" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none" strokeDasharray="2 5" />

      {/* ══ THE CAR — long-hood coupe in profile ══ */}
      <path
        d="M 400 336 L 404 312 Q 406 302 418 300 L 480 292 Q 500 262 536 252 L 640 246 Q 686 246 712 268 L 736 288 L 790 296 Q 806 298 810 310 L 814 330 Q 815 336 808 336 L 754 336"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* rocker between the wheels */}
      <line x1="560" y1="336" x2="672" y2="336" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      <line x1="400" y1="336" x2="478" y2="336" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      {/* greenhouse */}
      <path
        d="M 500 290 Q 516 266 544 258 L 632 254 Q 668 254 692 272 L 706 284"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.2"
        strokeOpacity="0.75"
        strokeLinecap="round"
      />
      <line x1="596" y1="254" x2="596" y2="290" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.6" />
      {/* beltline crease */}
      <line x1="424" y1="302" x2="788" y2="302" stroke="#9a9ca0" strokeWidth="0.9" strokeOpacity="0.45" />
      {/* wheels */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8">
        <circle cx="519" cy="338" r="26" />
        <circle cx="713" cy="338" r="26" />
      </g>
      <g fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.6">
        <circle cx="519" cy="338" r="12" />
        <circle cx="713" cy="338" r="12" />
      </g>
      {/* ground line */}
      <line x1="360" y1="366" x2="840" y2="366" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" />

      {/* ══ THE PROOF — document stack feeding the car ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.3" strokeLinejoin="round">
        <rect x="150" y="252" width="92" height="112" strokeOpacity="0.45" transform="rotate(-4 196 308)" />
        <rect x="158" y="248" width="92" height="112" strokeOpacity="0.7" transform="rotate(-1.5 204 304)" />
        <rect x="166" y="244" width="92" height="112" />
      </g>
      {/* lines of record on the top sheet */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55" strokeLinecap="round">
        <line x1="178" y1="264" x2="246" y2="264" />
        <line x1="178" y1="280" x2="246" y2="280" />
        <line x1="178" y1="296" x2="232" y2="296" />
        <line x1="178" y1="312" x2="246" y2="312" />
      </g>
      {/* the signature line — tungsten */}
      <path d="M 178 336 Q 192 328 202 336 Q 212 344 226 334" fill="none" stroke="#ffb066" strokeWidth="1.2" strokeLinecap="round" />
      {/* leader from the stack into the car */}
      <path d="M 258 300 L 400 314" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />
      <text
        x="204"
        y="392"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#ffb066"
      >
        THE PROOF
      </text>
      <text
        x="204"
        y="410"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9.5"
        letterSpacing="0.12em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        RECEIPTS · PHOTOS · OWNERS
      </text>

      {/* ══ THREE ROUTES OUT ══ */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55" fill="none" strokeLinecap="round">
        <path d="M 560 372 Q 460 408 388 448" strokeDasharray="3 5" />
        <path d="M 600 372 L 600 448" strokeDasharray="3 5" />
        <path d="M 640 372 Q 740 408 812 448" strokeDasharray="3 5" />
        <path d="M 382 442 L 388 450 L 396 446" />
        <path d="M 594 440 L 600 450 L 606 440" />
        <path d="M 804 446 L 812 450 L 818 442" />
      </g>

      {/* route 1 — auction: the gavel */}
      <g stroke="#9a9ca0" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="346" y="470" width="34" height="16" transform="rotate(-38 363 478)" />
        <line x1="374" y1="486" x2="404" y2="516" />
        <line x1="336" y1="530" x2="392" y2="530" strokeOpacity="0.7" />
      </g>
      {/* route 2 — consignment: the storefront */}
      <g stroke="#9a9ca0" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 572 486 L 572 530 L 628 530 L 628 486" />
        <path d="M 566 486 L 572 470 L 628 470 L 634 486 Z" />
        <path d="M 566 486 L 634 486" strokeWidth="1" strokeOpacity="0.7" />
        <rect x="592" y="506" width="16" height="24" strokeWidth="1" strokeOpacity="0.7" />
      </g>
      {/* route 3 — private sale: the signed bill */}
      <g stroke="#9a9ca0" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="790" y="466" width="48" height="64" />
        <line x1="800" y1="482" x2="828" y2="482" strokeWidth="1" strokeOpacity="0.7" />
        <line x1="800" y1="496" x2="828" y2="496" strokeWidth="1" strokeOpacity="0.7" />
        <path d="M 800 518 Q 810 510 816 518 Q 822 526 830 516" stroke="#ffb066" strokeWidth="1.2" />
      </g>

      {/* numbered pins on the routes */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 330, y: 468, n: "1" },
          { x: 552, y: 462, n: "2" },
          { x: 776, y: 458, n: "3" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>

      {/* route labels */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="368" y="562" textAnchor="middle" fill="#ffb066">
          1 · AUCTION
        </text>
        <text x="368" y="580" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6" fontSize="9.5">
          HAMMER − FEES
        </text>
        <text x="600" y="562" textAnchor="middle" fill="#ffb066">
          2 · CONSIGNMENT
        </text>
        <text x="600" y="580" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6" fontSize="9.5">
          AGREED − COMMISSION
        </text>
        <text x="814" y="562" textAnchor="middle" fill="#ffb066">
          3 · PRIVATE SALE
        </text>
        <text x="814" y="580" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6" fontSize="9.5">
          ASK − YOUR TIME
        </text>
      </g>

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
        FIG. S — THE PRICE LADDER, THE PROOF, AND THE THREE WAYS OUT
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Price it off <strong>sold comparables</strong> and an honest condition grade, not your
        receipts. Prove it with a documented history — photos, invoices, and the chain of owners.
        Then pick the venue by what you value: an auction buys speed and certainty, consignment
        buys convenience, and a private sale usually nets the most if you can spend the time.
      </p>

      <h2>What is a classic car actually worth in Canada?</h2>
      <p>
        Three numbers matter, and only one of them is yours to choose. The first is the guide
        value: the established price guides bracket every rated car by condition, from a #1
        concours trailer queen down to a #4 daily driver, and the honest grade for most restored,
        street-driven classics is a #3 — not the #2 their owners believe they own.
        <a href="#src-1" className="cite-ref">[1]</a> Grade your car the way a stranger with a
        flashlight will, then read the guide at that line.
      </p>
      <p>
        The second number is what comparable cars actually <strong>sold</strong> for in the last
        year — same body, same drivetrain, similar spec. Asking prices are wishes; hammer prices
        and completed private sales are facts, and current sales beat historical charts every
        time.<a href="#src-1" className="cite-ref">[1]</a> Most of that comp data is American, so
        convert to Canadian dollars — and then remember your Edmonton buyer&rsquo;s alternative is
        importing that American car, which adds shipping, exchange, and paperwork to their side of
        the math. A clean local car that a buyer can drive before paying is worth real money over
        a listing four states away.
      </p>
      <p>
        The third number is the one that hurts: what you spent. Restoration cost is not value. A
        truck wearing $80,000 in receipts sells for what the market pays for that truck, and no
        bill of sale has ever been fattened by the seller&rsquo;s pain. The receipts still matter —
        as proof, which is the next section — but they set your documentation apart, not your
        price. One more distinction while we are here: an insurance appraisal establishes agreed
        value so the car is protected, and it is routinely higher than what the car fetches on the
        open market. The <Link href="/blog/classic-car-appraisal-alberta">appraisal article</Link>{" "}
        covers when that document earns its fee; do not confuse it with an ask.
      </p>
      <blockquote>
        <p>Every flaw the buyer finds himself costs you three times what fixing it would have.</p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>

      <h2>Which documents actually add money — and which just add weight?</h2>
      <p>
        Documentation converts a buyer&rsquo;s risk discount into price. An undocumented car gets
        bid like a mystery, because it is one. The paper that moves money, in order: photographs
        of the restoration in progress — bare metal, floors, rockers, the ugly middle of the job —
        because they prove what rust repair happened and what got skimmed over; invoices organized
        by system with dates and mileage, showing who did the machine work and when; the ownership
        chain, as far back as it goes; and evidence the car matches its own story — trim tags,
        stampings, factory codes decoded and photographed. The auction houses preach exactly this,
        and they are right: detail every option, run the history back as far as you can find it,
        and shoot the underside, the engine bay, and the trunk, not just the good three-quarter
        angle.<a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <p>
        What adds weight instead of money: trophies, show flyers, a decade-old appraisal, and a
        binder of magazine articles about cars like yours. Buyers pay for evidence about
        <strong> this</strong> car.
      </p>
      <p>
        One Alberta-specific card worth playing: if your buyer is taking the car to another
        province, their registration process will likely demand an inspection on their end, and a
        seller who can hand over a tidy records package makes that step painless. The{" "}
        <Link href="/blog/out-of-province-inspection-edmonton">out-of-province inspection
        article</Link> explains what that buyer is walking into — knowing it makes you the easiest
        seller they have talked to all month.
      </p>

      <h2>Auction, consignment, or private sale — which one nets more?</h2>
      <p>
        Typical planning figures in Canadian dollars, not quotes — every venue prices its own
        services, and you confirm the fee schedule in writing before signing anything:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Selling a classic car at auction versus through a licensed consignment business versus
            privately, compared by typical seller cost in Canadian dollars, time to money, seller
            effort, certainty of sale, and best fit
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Auction</th>
              <th scope="col">Consignment</th>
              <th scope="col">Private sale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">What it costs you (CAD)</th>
              <td className="num">Entry $200 – $1,000 + commission, commonly 5 – 10%</td>
              <td className="num">Commission commonly 5 – 10%, or tiered flat fee</td>
              <td className="num">$0 – $200 in ads, plus your time</td>
            </tr>
            <tr>
              <th scope="row">Time to money</th>
              <td>Fixed — the sale date is on a calendar</td>
              <td>Weeks to months, paid within 14 days of the sale in Alberta</td>
              <td>Unknown — a week or a full season</td>
            </tr>
            <tr>
              <th scope="row">Your effort</th>
              <td>Prep and delivery, then done</td>
              <td>Drop it off, then wait</td>
              <td>Every photo, call, and showing is yours</td>
            </tr>
            <tr>
              <th scope="row">Certainty</th>
              <td>High with no reserve; the reserve is your only floor</td>
              <td>None — it sells when it sells</td>
              <td>None — but you never sell below your number</td>
            </tr>
            <tr>
              <th scope="row">Best when</th>
              <td>The car is desirable and you want a date-certain exit</td>
              <td>You want it gone without doing the work</td>
              <td>Time is cheap and the car is honest</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Auctions work when competitive bidding has something to fight over — a desirable car,
        documented, photographed properly. Alberta sellers do not have to ship south to find one:
        EG Auctions, which bills itself as Canada&rsquo;s largest classic and collector car auction
        house, has been running live sales since 1999 with more than 30,000 cars hammered, and
        holds an annual collector car auction right here in Edmonton.
        <a href="#src-3" className="cite-ref">[3]</a> The one decision that decides your outcome is
        the reserve: it is the minimum bid you will accept, it exists to keep the car from being
        given away, and it has to be set at your true walk-away number — not your dream.
        <a href="#src-2" className="cite-ref">[2]</a> A reserve set at fantasy money buys you a
        no-sale, an entry fee spent, and a car the market now remembers failing to sell.
      </p>
      <p>
        Consignment in Alberta is a regulated business, and that is in your favour. The business
        must be AMVIC-licensed — it is the law — and the written consignment agreement has to spell
        out the fees, the minimum amount you will receive, how long the agreement runs, and who
        insures the car while it sits on their floor; once it sells, you are to be paid within 14
        days, with an itemized statement.<a href="#src-4" className="cite-ref">[4]</a> Check the
        licence before you hand over the keys, and call your own insurer about coverage while the
        car is on someone else&rsquo;s lot, because your policy likely does not follow it there.
      </p>
      <p>
        The private sale nets the most on paper for two reasons: nobody takes a commission, and in
        Alberta no sales tax lands on a deal between two individuals — GST attaches when a
        business sells the car, which quietly makes your private price stronger than the same
        number on a dealer&rsquo;s floor. What you pay instead is time: photographing it like an
        auction house would, answering the same six questions forty times, and running showings
        for strangers. For an honest car with honest paper, it is usually worth it.
      </p>

      <h2>How does a private classic car sale work in Alberta?</h2>
      <p>
        The paperwork is mercifully short. Alberta&rsquo;s standard bill of sale must carry the
        full names and addresses of buyer and seller, the VIN, the year, make, model, and colour,
        the price, and both signatures — the province publishes a free form, and you complete two
        copies so each side keeps one.<a href="#src-5" className="cite-ref">[5]</a> The odometer
        reading is optional on the form; write it in anyway, dated, because on a fifty-year-old
        car the recorded mileage is part of the story you are warranting. Licence plates stay with
        the seller in Alberta — pull yours before the car moves, and let the buyer arrange their
        own insurance and registration to drive it home legally.
      </p>
      <p>
        Two things to settle before the ad goes up. First, the lien: a careful buyer will run a
        lien search on the VIN, and an old forgotten financing registration from 1998 kills more
        deals than rust does — search it yourself and clear anything that shows. Second, payment:
        take a bank draft verified at the issuing branch, a wire, or an e-transfer that has fully
        cleared — verified meaning you and the buyer stand in the branch together while a teller
        confirms it, because counterfeit drafts are the classic-sale scam of record. The car and
        the signed bill of sale change hands when the money is real, not when it is promised.
      </p>

      <h2>Should you fix anything before you sell — and when should you list it?</h2>
      <p>
        Sort, do not restore. The oil leak, the dead fuel gauge, the miss at idle — each is a few
        hundred dollars to fix and a four-figure lever in the buyer&rsquo;s hand if you leave it.
        Mechanical sorting money comes back; cosmetic transformation money does not. An honest
        repaint over verified metal runs deep into five figures — the{" "}
        <Link href="/services/body-paint-metalwork">body and paint page</Link> lays out why — and
        the seller recovers a fraction of it, partly because fresh paint on a car being sold reads
        as a question: what is under it? A presentable original or older repaint with full
        documentation out-sells fresh mystery paint at the same price, every time.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$500–$1,500</span>
          <span className="stat-l">Typical pre-sale mechanical sorting — money that comes back</span>
        </div>
        <div>
          <span className="stat-v">$15K+</span>
          <span className="stat-l">An honest repaint — money that mostly does not</span>
        </div>
        <div>
          <span className="stat-v">5–10%</span>
          <span className="stat-l">Commonly quoted seller commission, auction or consignment</span>
        </div>
        <div>
          <span className="stat-v">$0</span>
          <span className="stat-l">Sales tax on an Alberta private sale between individuals</span>
        </div>
      </div>
      <p>
        Timing is the free money nobody takes. Alberta&rsquo;s selling season runs April through
        September, when buyers can drive what they are bidding on; a classic listed in October
        competes with every other seller who blinked, in front of buyers thinking about
        storage instead of ownership. If the calendar has beaten you, winterize it properly —
        the <Link href="/blog/classic-car-winter-storage-alberta">winter storage guide</Link>{" "}
        covers doing that without hurting the sale — and list it in March, when the first chinook
        has every gearhead in the province checking the classifieds.
      </p>
      <p>
        And if the car needs its sorting done before the photos get taken: that is deliberately an
        easy job to hand a shop. Send the year, the model, and the list of what it does wrong
        through the <Link href="/quote">quote page</Link>, and you will get a straight answer on
        what is worth fixing to sell — and what is the next owner&rsquo;s problem, priced
        accordingly.
      </p>
    </>
  );
}
