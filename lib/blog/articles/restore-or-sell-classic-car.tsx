import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Restore, Restomod, or Sell.
 * The honest fork: restore, restomod, or sell before rust eats the equity.
 * Links down into restoration, restomods, restoration cost, selling, rust
 * repair, and quote.
 */

export const meta: ArticleMeta = {
  slug: "restore-or-sell-classic-car",
  title: "Restore, Restomod, or Sell? Decide Before Rust Eats the Equity",
  accent: "Sell",
  metaTitle: "Restore or Sell Your Classic Car?",
  description: "An honest fork for a rusting classic: when restoration math works, when a restomod is the driveable path, and when selling now protects the equity in Alberta.",
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  author: "2240 Speed Shop",
  category: "Buy Smart",
  targetKeywords: [
    "restore or sell classic car",
    "is it worth restoring my classic",
    "restomod vs restoration vs sell",
    "classic car rust equity",
    "should I restore my classic car Canada",
  ],
  faq: [
    {
      q: "Is it worth restoring my classic car, or should I sell it?",
      a: "Usually, sell if the car is a common model and the rust is structural — floors, rails, rockers — because a professional restoration typically runs $60,000 to $150,000 CAD and the finished market price will sit below that bill. Restore if the car is rare, documented, or family, and you are buying the car you want rather than an investment. Restomod if you want to drive it and originality is not the store of value. Hagerty is blunt: you will probably not recoup a major restoration.",
    },
    {
      q: "When does rust mean I should sell instead of restoring?",
      a: "When the metal that carries load is going — frame rails, floor supports, rockers on a unibody, spring mounts — and the car is not rare enough for the finished value to cover the steel. Surface rust and a few patch panels are a rolling restoration. Structural rust is a frame-off, and a frame-off on a common sedan is how equity disappears into a rotisserie. Get the car on a hoist before you decide. The bubble you can see is never the whole repair.",
    },
    {
      q: "Is a restomod a better financial move than a restoration?",
      a: "On a common driver-grade car, often yes for resale, because buyers of restomods are paying for a car they can use, and auction results have been rewarding well-built modified cars. You still will not get the labour back dollar-for-dollar. A restomod typically runs $80,000 to $250,000 CAD ground-up. The financial winner is usually buying someone else's finished build. You build anyway when the spec you want does not exist.",
    },
    {
      q: "Should I restore a car before I sell it?",
      a: "No. Sort it, clean it, document it. Fix the cheap mechanical flaws that cost more in negotiation than in parts. A pre-sale restoration almost never returns: buyers discount fresh paint because they cannot see under it, and the market prices your car as a driver either way. Sell a project as a project. Let the next owner restore it their way, on their budget.",
    },
    {
      q: "What if the car is family, and the math does not work?",
      a: "Then the math was never the point, and that is a legitimate reason to restore. Say it out loud so the budget is an honesty tool rather than a surprise. Stage the work — structure first, then brakes and running gear, cosmetics last — so the car cannot quietly become a parts pile in a heated garage. Family is a reason. Denial about rust is not.",
    },
  ],
  citations: [
    {
      name: "“How Much Does it Cost to Restore a Classic Car?,” Hagerty",
      url: "https://www.hagerty.com/resources/car-restoration/how-much-does-it-cost-to-restore-a-classic-car",
    },
    {
      name: "“Why Do We Care So Much About Originality?,” Hagerty Insider",
      url: "https://www.hagerty.com/media/market-trends/hagerty-insider/originality-or-modified/",
    },
    {
      name: "“Which classic cars are worth restoring?,” Hagerty UK",
      url: "https://www.hagerty.co.uk/articles/which-classic-cars-are-worth-restoring/",
    },
    {
      name: "“Barrett-Jackson Positions Collector Car Market for the Future, Solidifies Trend for Resto-Mods,” Barrett-Jackson",
      url: "https://www.barrett-jackson.com/media/press-releases/barrett-jackson-positions-collector-car-market-for-the-future-solidifies-trend-for-resto-mods",
    },
    {
      name: "“How To Sell Your Classic Car at an Auction,” Hagerty resource library",
      url: "https://www.hagerty.com/resources/car-buying-and-selling/selling-at-a-classic-car-auction",
    },
    {
      name: "“Consigning a Vehicle,” Alberta Motor Vehicle Industry Council (AMVIC)",
      url: "https://www.amvic.org/consumer/consigning-a-vehicle/",
    },
  ],
  internalLinks: [
    "/services/classic-car-restoration",
    "/services/restomods-custom-builds",
    "/blog/classic-car-restoration-cost-canada",
    "/blog/selling-a-classic-car-canada",
    "/blog/rust-repair-cost-canada",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * Three-road fork under a period coupe: restore (factory-correct spine),
 * restomod (tungsten modern spine), sell (title and bill of sale leaving
 * the frame). Rust blooms on the rocker as a countdown. Editorial diagram.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of a decision fork under a classic coupe: three roads labelled restore, restomod, and sell, with rust marked on the rocker as the clock, and tungsten highlighting the restomod spine versus a steel restoration path versus a paper-trail exit"
      className="h-auto w-full"
    >
      <title>Three roads, one car, one honest call</title>
      <defs>
        <radialGradient id="rs-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="600" cy="250" rx="320" ry="28" fill="url(#rs-pool)" />

      {/* coupe, small, top centre */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 420 230 L 430 200 Q 436 186 460 180 L 560 168 Q 580 164 600 164 L 640 164 Q 670 166 690 180 L 760 200 L 780 214 L 780 230 L 750 238 L 730 238 A 36 36 0 0 0 658 238 L 542 238 A 36 36 0 0 0 470 238 L 440 238 Z" />
        <circle cx="506" cy="240" r="22" strokeWidth="1.5" />
        <circle cx="694" cy="240" r="22" strokeWidth="1.5" />
        <path d="M 560 180 L 640 180 L 650 210 L 550 210 Z" strokeWidth="1.1" strokeOpacity="0.6" />
      </g>
      {/* rust bloom on rocker */}
      <circle cx="600" cy="236" r="3.2" fill="#ffb066" fillOpacity="0.9" />
      <ellipse cx="600" cy="236" rx="48" ry="10" fill="none" stroke="#ffb066" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.7" />

      {/* fork */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round">
        <line x1="600" y1="268" x2="600" y2="340" />
        <path d="M 600 340 L 280 500" />
        <path d="M 600 340 L 600 520" stroke="#ffb066" strokeWidth="2" />
        <path d="M 600 340 L 920 500" />
      </g>
      {/* road ticks */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4">
        <line x1="520" y1="380" x2="508" y2="392" />
        <line x1="460" y1="420" x2="448" y2="432" />
        <line x1="680" y1="380" x2="692" y2="392" />
        <line x1="740" y1="420" x2="752" y2="432" />
      </g>
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.5">
        <line x1="600" y1="380" x2="600" y2="392" />
        <line x1="600" y1="430" x2="600" y2="442" />
      </g>

      {/* restore icon — factory badge */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4">
        <rect x="210" y="508" width="140" height="50" rx="3" />
        <text
          x="280"
          y="538"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="11"
          letterSpacing="0.16em"
          fill="#9a9ca0"
          stroke="none"
        >
          ORIGINAL
        </text>
      </g>
      {/* restomod icon — modern block */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.4">
        <rect x="530" y="528" width="140" height="50" rx="3" />
        <rect x="548" y="540" width="50" height="26" rx="2" />
        <path d="M 598 548 L 650 548 L 650 562 L 598 562" />
      </g>
      {/* sell icon — paper */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4">
        <rect x="850" y="508" width="100" height="64" />
        <line x1="866" y1="524" x2="934" y2="524" strokeWidth="1" strokeOpacity="0.7" />
        <line x1="866" y1="536" x2="918" y2="536" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="866" y1="548" x2="926" y2="548" strokeWidth="1" strokeOpacity="0.5" />
      </g>

      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 80 180 L 552 230" />
        <path d="M 80 360 L 500 400" />
        <path d="M 1160 360 L 700 400" />
        <path d="M 1160 180 L 648 230" />
      </g>

      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 600, y: 236, n: "1" },
          { x: 280, y: 500, n: "2" },
          { x: 600, y: 520, n: "3" },
          { x: 920, y: 500, n: "4" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>

      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="40" y="184" fill="#ffb066">
          1 · THE ROCKER IS THE CLOCK
        </text>
        <text x="40" y="364" fill="#ffb066">
          2 · RESTORE — ORIGINALITY IS THE VALUE
        </text>
        <text x="1160" y="364" textAnchor="end" fill="#ffb066">
          4 · SELL — BEFORE THE STEEL BILL
        </text>
        <text x="1160" y="184" textAnchor="end" fill="#ffb066">
          3 · RESTOMOD — DRIVE IT
        </text>
        <text x="280" y="580" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          FACTORY-CORRECT
        </text>
        <text x="600" y="600" textAnchor="middle" fill="#ffb066" fontSize="10">
          MODERN SPINE
        </text>
        <text x="900" y="590" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          TITLE + BILL OF SALE
        </text>
      </g>

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
        FIG. A — THREE ROADS, ONE CAR, ONE HONEST CALL
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Restore if the car is rare, documented, or family — you want that car, not a return.
        Restomod if you want to drive it and originality is not the value. Sell if rust is
        structural and the model is common: a professional restoration typically runs $60,000
        to $150,000 CAD, and the market will not pay you back.
      </p>

      <h2>How do you decide restore, restomod, or sell?</h2>
      <p>
        Four questions, in this order. First: is the car rare, numbers-matching, or documented?
        If yes, originality is still the money, and modification can erase it.
        <a href="#src-2" className="cite-ref">[2]</a> Second: is the rust cosmetic, or is it in
        metal that carries load? Third: do you actually want to drive this car in 2026 traffic,
        or own a piece of 1968? Fourth: will the budget survive an honest restoration or restomod
        range, plus a contingency? Hagerty&rsquo;s restoration-cost piece says the quiet part:
        you will probably not recoup a major restoration unless the car is genuinely rare.
        <a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Restore versus restomod versus sell, compared by the car it fits, typical CAD
            planning range, and the outcome for equity
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Restore</th>
              <th scope="col">Restomod</th>
              <th scope="col">Sell now</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">The car</th>
              <td>Rare, documented, or family</td>
              <td>Common, driver-grade, you want to use it</td>
              <td>Common, structural rust, no emotional claim</td>
            </tr>
            <tr>
              <th scope="row">Typical CAD range</th>
              <td className="num">$60,000 – $150,000+</td>
              <td className="num">$80,000 – $250,000+</td>
              <td className="num">Today&rsquo;s as-is price, minus honesty</td>
            </tr>
            <tr>
              <th scope="row">What you buy</th>
              <td>The factory, done right</td>
              <td>The look, with a modern spine</td>
              <td>Time, and someone else&rsquo;s problem</td>
            </tr>
            <tr>
              <th scope="row">Equity</th>
              <td>Usually does not return the labour</td>
              <td>Build quality can sell; labour still depreciates</td>
              <td>Protected from the steel bill that is coming</td>
            </tr>
            <tr>
              <th scope="row">Right owner</th>
              <td>Preservationist</td>
              <td>Driver</td>
              <td>Someone who already knows the answer</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>When does rust mean sell?</h2>
      <p>
        When the structure is going and the car is not special enough to justify a frame-off.
        A cluster of patch panels is a rolling restoration. Rails, floor supports, unibody
        rockers, or spring mounts are a different invoice — the{" "}
        <Link href="/blog/rust-repair-cost-canada">rust-repair numbers</Link> climb from hundreds
        into tens of thousands once you are cutting load-bearing steel. Every season you wait,
        chloride works the seams. The as-is price today is an asset. The as-is price after two
        more winters is a negotiation against a hoist report.
      </p>
      <p>
        Hagerty UK&rsquo;s &ldquo;which cars are worth restoring&rdquo; exercise is the right
        instinct even when the models are different: look at the spread between condition grades,
        then subtract real labour, and see whether the ladder still has rungs.
        <a href="#src-3" className="cite-ref">[3]</a> A common sedan with rotten floors does not
        have rungs. A documented, desirable model might. Most cars in Alberta garages are the
        first kind.
      </p>
      <blockquote>
        <p>
          Rust does not pause for a decision. It invoices either the restorer or the next buyer.
          Pick which one you want to be.
        </p>
        <footer>Hoist bay, every spring</footer>
      </blockquote>

      <h2>When is a restomod the honest path?</h2>
      <p>
        When you want to drive the car and the car is not a museum piece. Barrett-Jackson has
        spent two decades telling that story: professionally built restomods are a growth market,
        and they sell to people who will never be loyal to points and drums.
        <a href="#src-4" className="cite-ref">[4]</a> The catch is the same as restoration: a
        ground-up restomod typically runs $80,000 to $250,000 CAD, and the labour does not resell
        at cost. The cheap way to own one is to buy a finished build. You build anyway when the
        spec you want — this truck, this stance, this engine — does not exist on the market.
      </p>
      <p>
        That is the whole pitch of{" "}
        <Link href="/services/restomods-custom-builds">restomods and custom builds</Link> here, and
        of <Link href="/services/classic-car-restoration">restoration</Link> when originality is
        the point. Pick the column first. The money argument gets shorter.
      </p>

      <h2>If you sell, do you restore first?</h2>
      <p>
        No. The{" "}
        <Link href="/blog/selling-a-classic-car-canada">selling guide</Link> is explicit: sort,
        clean, document, fix the cheap mechanicals that cost more in a buyer&rsquo;s discount than
        in parts. A pre-sale restoration is how you donate labour to the next owner. Auction and
        consignment are venues, not strategies — Hagerty&rsquo;s auction primer and AMVIC&rsquo;s
        consignment rules are the paperwork half, not a reason to paint a project.
        <a href="#src-5" className="cite-ref">[5]</a>
        <a href="#src-6" className="cite-ref">[6]</a>
      </p>

      <h2>What should you do this month?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$60K–$150K+</span>
          <span className="stat-l">Typical professional restoration, planning range</span>
        </div>
        <div>
          <span className="stat-v">$80K–$250K+</span>
          <span className="stat-l">Typical ground-up restomod, planning range</span>
        </div>
        <div>
          <span className="stat-v">Hoist</span>
          <span className="stat-l">The only honest place to read the rust</span>
        </div>
        <div>
          <span className="stat-v">Now</span>
          <span className="stat-l">Sell as-is if structure is going and the car is common</span>
        </div>
      </div>
      <p>
        Get the car on a hoist. Photograph the rails, the floors, the rockers. Compare that to
        the <Link href="/blog/classic-car-restoration-cost-canada">stage-by-stage cost</Link>{" "}
        ranges. Then pick a column. If you want this shop to say the quiet part — including
        &ldquo;sell it&rdquo; — send those photos through the <Link href="/quote#form">quote page</Link>.
        We would rather lose a restoration than win a rust balloon.
      </p>
    </>
  );
}
