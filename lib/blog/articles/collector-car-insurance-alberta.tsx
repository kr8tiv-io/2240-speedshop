import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Collector Car Insurance in Alberta.
 * The paperwork wedge for the insurance keyword cluster: agreed value versus
 * actual cash value, who qualifies, what it costs, and where antique plates
 * fit. Links down into the restoration service, the restoration timeline, the
 * out-of-province inspection article, the winter guide, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "collector-car-insurance-alberta",
  title:
    "Collector Car Insurance in Alberta: What It Covers, What It Costs, Who Qualifies",
  accent: "Insurance",
  metaTitle: "Collector Car Insurance in Alberta",
  description: "How agreed-value collector policies differ from regular Alberta auto insurance — who qualifies, what storage and use rules apply, and what coverage typically.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Paperwork",
  targetKeywords: [
    "collector car insurance Alberta",
    "classic car insurance Edmonton",
    "agreed value insurance classic car",
    "Hagerty vs regular insurance Canada",
  ],
  faq: [
    {
      q: "Is collector car insurance cheaper than regular insurance in Alberta?",
      a: "Usually much cheaper. A collector policy on a garaged classic commonly runs $300 to $800 per year in Canadian dollars for typical agreed values, while a daily driver in Edmonton commonly costs $1,600 to $2,800 or more. The discount exists because collector cars sit in locked garages most of the year, cover low kilometres, and get driven carefully by owners who wax them on weekends. All of these are planning ranges, not quotes — value, record, and postal code move the number.",
    },
    {
      q: "Can I daily drive a classic on collector insurance?",
      a: "No. Every collector policy is written on the condition that the car is not your daily driver — pleasure use, shows, cruises, and club runs only. Insurers also require that every licensed driver in the household has a regular-use vehicle insured in their own name, so nobody is quietly commuting in the classic. Fudge the use and you are not saving money, you are buying a policy that can deny the claim exactly when you need it.",
    },
    {
      q: "Do I need an appraisal for agreed value insurance in Alberta?",
      a: "Often not for a stock vehicle — specialty insurers set agreed values on most unmodified classics using their own valuation data, no appraisal required. Modified cars, restomods, and high-value builds are different: expect to support the number with a professional appraisal, commonly $150 to $400 CAD in Alberta, plus build receipts and photos. Keep the paper either way. The best time to document a car is before the loss, not during the claim.",
    },
    {
      q: "Does an antique licence plate lower my insurance?",
      a: "Not directly — registration and insurance are separate systems. Alberta's antique plate is a registration class for vehicles 25 years and older, and it legally restricts the car to exhibitions, club activities, parades, travel to and from those events, and servicing trips. Your premium is set by the policy you buy, not the plate. Many driver-grade classics in Alberta run regular plates with a collector policy; the antique plate suits the show-only car.",
    },
    {
      q: "What happens if my restored car appreciates after I insure it?",
      a: "Nothing, automatically — and that is the trap. Agreed value pays the number on the declaration page, so if the market climbs or you finish another stage of the build and never update the policy, the gap comes out of your pocket at total loss. Review the agreed value at every renewal, and raise it the month a major stage wraps — paint, drivetrain, interior. It moves when you move it.",
    },
  ],
  citations: [
    {
      name: "“Automobile insurance,” Alberta.ca",
      url: "https://www.alberta.ca/automobile-insurance",
    },
    {
      name: "“Coverage for Classic & Collector Cars,” Hagerty Canada",
      url: "https://www.hagerty.ca/insurance/classic-car-insurance",
    },
    {
      name: "“Qualifications for Classic Car Insurance,” Hagerty Canada",
      url: "https://www.hagerty.ca/insurance/classic-car-insurance/does-my-vehicle-qualify",
    },
    {
      name: "“Licence plates,” Alberta.ca",
      url: "https://www.alberta.ca/licence-plates",
    },
    {
      name: "“Care-First auto insurance,” Alberta.ca",
      url: "https://www.alberta.ca/care-first-auto-insurance",
    },
  ],
  internalLinks: [
    "/services/classic-car-restoration",
    "/blog/classic-car-restoration-timeline",
    "/blog/out-of-province-inspection-edmonton",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * One classic coupe, two numbers — a value-versus-time chart where the actual
 * cash value line sinks toward scrap while the agreed value line locks flat,
 * over a long-hood coupe in steel line art with the policy conditions pinned
 * in tungsten: locked garage, pleasure use only, the daily stays home, the
 * number on the declaration page. Editorial diagram in the shop's plate
 * style: every label mono, every glow sourced.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram contrasting agreed value collector insurance with regular actual cash value coverage: a value-versus-years chart shows a dashed depreciation curve sinking while a solid agreed-value line stays locked flat, above a classic long-hood coupe in steel line art with four numbered tungsten callout pins marking the agreed value on the declaration page, the depreciated book value, the pleasure-use-only condition, and the locked-garage storage requirement"
      className="h-auto w-full"
    >
      <title>Two numbers for the same car — the book&rsquo;s, and the one you agreed to in writing</title>
      <defs>
        <radialGradient id="ci-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ci-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a9ca0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#9a9ca0" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* pool of light under the car */}
      <ellipse cx="860" cy="560" rx="320" ry="32" fill="url(#ci-pool)" />

      {/* ══ THE CHART — value vs years ══ */}
      {/* axes */}
      <g stroke="#9a9ca0" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <line x1="120" y1="92" x2="120" y2="292" />
        <line x1="120" y1="292" x2="548" y2="292" />
      </g>
      {/* axis ticks */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" fill="none">
        <line x1="120" y1="292" x2="120" y2="300" />
        <line x1="334" y1="292" x2="334" y2="300" />
        <line x1="548" y1="292" x2="548" y2="300" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        <text x="112" y="86" textAnchor="end">
          VALUE (CAD)
        </text>
        <text x="334" y="316" textAnchor="middle">
          25 YRS
        </text>
        <text x="548" y="316" textAnchor="middle">
          50 YRS
        </text>
      </g>
      {/* the depreciation curve — actual cash value, sinking */}
      <path
        d="M 132 130 Q 240 226 380 246 Q 470 258 536 262"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.6"
        strokeDasharray="5 5"
        strokeLinecap="round"
      />
      {/* the agreed value line — locked flat */}
      <path
        d="M 132 130 L 380 122 L 536 118"
        fill="none"
        stroke="#ffb066"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* the lock at the end of the agreed line */}
      <g stroke="#ffb066" strokeWidth="1.3" fill="none">
        <rect x="546" y="112" width="16" height="13" />
        <path d="M 550 112 L 550 106 Q 554 100 558 106 L 558 112" />
      </g>
      {/* the gap between the two numbers */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <line x1="512" y1="126" x2="512" y2="254" strokeDasharray="2 4" />
        <path d="M 507 134 L 512 124 L 517 134" />
        <path d="M 507 246 L 512 256 L 517 246" />
      </g>
      <text
        x="498"
        y="196"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#ffd9ad"
      >
        THE GAP YOU EAT
      </text>

      {/* ══ THE CAR — long-hood coupe, side profile ══ */}
      {/* body outline */}
      <path
        d="M 606 512 L 606 486 Q 606 470 626 466 L 664 460 L 780 446 Q 800 442 812 430 L 846 398 Q 854 388 868 386 L 946 386 Q 972 388 986 402 L 1012 434 Q 1020 444 1038 446 L 1092 452 Q 1108 456 1108 470 L 1108 502 L 1062 512 L 1042 512 A 52 52 0 0 0 938 512 L 762 512 A 52 52 0 0 0 648 512 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* glasshouse */}
      <path
        d="M 824 428 L 852 400 Q 858 394 870 393 L 940 393 Q 962 395 974 407 L 996 432 Z"
        fill="url(#ci-glass)"
        stroke="#9a9ca0"
        strokeWidth="1.1"
        strokeOpacity="0.75"
      />
      {/* b-pillar */}
      <line x1="912" y1="393" x2="916" y2="430" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.7" />
      {/* door cut + handle */}
      <path d="M 818 432 L 812 508" fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.7" />
      <path d="M 962 434 L 968 508" fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="828" y1="452" x2="854" y2="451" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round" />
      {/* beltline */}
      <line
        x1="630"
        y1="468"
        x2="1094"
        y2="458"
        stroke="#9a9ca0"
        strokeWidth="0.8"
        strokeOpacity="0.45"
      />
      {/* bumpers */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.8" fill="none" strokeLinecap="round">
        <line x1="600" y1="496" x2="620" y2="496" />
        <line x1="1096" y1="496" x2="1114" y2="496" />
      </g>
      {/* headlight + taillight */}
      <circle cx="620" cy="478" r="5" fill="none" stroke="#9a9ca0" strokeWidth="1.2" />
      <rect x="1098" y="472" width="8" height="6" fill="none" stroke="#9a9ca0" strokeWidth="1.1" />
      {/* wheels */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8">
        <circle cx="700" cy="520" r="40" />
        <circle cx="990" cy="520" r="40" />
      </g>
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.75">
        <circle cx="700" cy="520" r="15" />
        <circle cx="990" cy="520" r="15" />
      </g>
      {/* ground line */}
      <line
        x1="572"
        y1="564"
        x2="1140"
        y2="564"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.35"
      />

      {/* the paper trail — appraisal card by the front wheel */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.2" strokeLinejoin="round">
        <rect x="600" y="574" width="66" height="44" />
        <line x1="608" y1="586" x2="658" y2="586" strokeOpacity="0.7" strokeWidth="1" />
        <line x1="608" y1="596" x2="646" y2="596" strokeOpacity="0.45" strokeWidth="1" />
        <line x1="608" y1="606" x2="652" y2="606" strokeOpacity="0.45" strokeWidth="1" />
      </g>
      <text
        x="678"
        y="600"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        APPRAISAL + RECEIPTS, FILED
      </text>

      {/* ══ LEADER LINES — label to pin ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 900 116 L 570 118" />
        <path d="M 214 356 L 500 262" />
        <path d="M 214 446 L 664 484" />
        <path d="M 900 336 L 906 386" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 570, y: 118, n: "1" },
          { x: 512, y: 262, n: "2" },
          { x: 676, y: 484, n: "3" },
          { x: 906, y: 386, n: "4" },
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
        <text x="1160" y="120" textAnchor="end" fill="#ffb066">
          1 · AGREED VALUE — THE DEC-PAGE NUMBER, LOCKED
        </text>
        <text x="1160" y="340" textAnchor="end" fill="#ffb066">
          4 · GARAGE KEPT — INDOORS AND LOCKED
        </text>
        <text x="40" y="360" fill="#ffb066">
          2 · ACTUAL CASH VALUE — THE BOOK&rsquo;S OPINION
        </text>
        <text x="40" y="450" fill="#ffb066">
          3 · PLEASURE USE — THE DAILY STAYS HOME
        </text>
        {/* steel feature labels */}
        <text x="132" y="70" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          SAME CAR, TWO PAYOUTS
        </text>
        <text x="1140" y="548" textAnchor="end" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          THE CAR YOU RESTORED
        </text>
      </g>

      {/* plate caption */}
      <text
        x="600"
        y="644"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. P — TWO NUMBERS FOR THE SAME CAR: THE BOOK&rsquo;S, AND THE ONE YOU AGREED TO
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Collector car insurance covers your classic for an <strong>agreed value</strong> you lock
        in when the policy is written — not a depreciated book number — and it typically costs a
        fraction of regular Alberta coverage. In exchange, the car cannot be your daily driver:
        pleasure use, proper storage, and a clean record are the price of admission.
      </p>

      <h2>How is collector car insurance different from a regular Alberta policy?</h2>
      <p>
        Start with what does not change. Any car registered for Alberta roads needs basic
        automobile insurance — third-party liability and accident benefits are required by law,
        while collision and comprehensive stay optional.<a href="#src-1" className="cite-ref">[1]</a>{" "}
        Your 1969 Camaro carries the same legal minimums as a new half-ton. The collector policy
        does not exempt you from any of that. What it changes is everything on the physical-damage
        side: how the car is valued when it is damaged or gone, what use the insurer assumes, and
        what the premium reflects.
      </p>
      <p>
        A regular policy assumes a commuter and settles a total loss at <strong>actual cash
        value</strong> — what the depreciation tables say a car of that age is worth. Depreciation
        tables were built for appliances that lose value every year. A restored classic does the
        opposite, and that mismatch is exactly how people end up insuring a $70,000 restoration
        for the price of a very old used car. The collector policy replaces the table with a
        number you and the insurer agree on in advance, in writing.
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Regular Alberta auto insurance compared with an agreed-value collector policy, by
            total-loss payout, typical annual premium in Canadian dollars, permitted use, storage
            expectations, household requirements, and what happens as the car appreciates
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Regular Alberta policy</th>
              <th scope="col">Collector policy (agreed value)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Total-loss payout</th>
              <td>Actual cash value — depreciated, negotiated after the loss</td>
              <td>The agreed number on the declaration page, set before the loss</td>
            </tr>
            <tr>
              <th scope="row">Typical annual premium (CAD)</th>
              <td className="num">$1,600 – $2,800+</td>
              <td className="num">$300 – $800</td>
            </tr>
            <tr>
              <th scope="row">Use assumed</th>
              <td>Commuting, errands, daily kilometres</td>
              <td>Pleasure only — shows, cruises, club runs, never the commute</td>
            </tr>
            <tr>
              <th scope="row">Storage expected</th>
              <td>Anywhere you park it</td>
              <td>Locked private garage preferred; carports reviewed case by case</td>
            </tr>
            <tr>
              <th scope="row">Household rule</th>
              <td>None</td>
              <td>Every licensed driver needs a daily insured in their own name</td>
            </tr>
            <tr>
              <th scope="row">As the car appreciates</th>
              <td>Payout keeps falling with the book</td>
              <td>You raise the agreed value at renewal — it moves when you move it</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What does agreed value actually mean?</h2>
      <p>
        Agreed value — Hagerty brands it Guaranteed Value, and in Alberta it rides on an
        endorsement to the standard policy — means a covered total loss pays the full insured
        value stated on your policy, with no depreciation applied.
        <a href="#src-2" className="cite-ref">[2]</a> The number is settled when the policy is
        written, not argued about after the fire. That single difference is most of why this
        product exists.
      </p>
      <p>
        Picture the alternative. A freshly finished{" "}
        <Link href="/services/classic-car-restoration">frame-off restoration</Link> with $80,000
        of documented work burns in a garage fire on a regular policy. The adjuster does not owe
        you your receipts — they owe you actual cash value, built from comparable sales of
        &ldquo;similar&rdquo; cars, most of which are nothing like yours. You negotiate from
        grief, they negotiate from a database, and the cheque commonly lands at a fraction of
        what the build cost. On an agreed-value policy the same loss pays the declaration-page
        number, full stop.
      </p>
      <blockquote>
        <p>
          The worst time to find out what your car is worth to an insurance company is the week
          after the fire.
        </p>
        <footer>Counter wisdom, repeated to every restoration client</footer>
      </blockquote>
      <p>
        The catch is that agreed value only protects the number you set. Insure the car at
        $40,000, spend two more years and a{" "}
        <Link href="/blog/classic-car-restoration-timeline">full restoration timeline</Link>{" "}
        pushing it to $75,000, and forget the policy — the gap is yours. Update the agreed value
        the month a major stage wraps, and review it at every renewal.
      </p>

      <h2>Who qualifies for collector car insurance?</h2>
      <p>
        Four gates, and the insurer checks all of them. Using Hagerty Canada&rsquo;s published
        criteria as the reference point — most specialty insurers run close variations of the
        same rules:<a href="#src-3" className="cite-ref">[3]</a>
      </p>
      <ul>
        <li>
          <strong>The vehicle.</strong> Classic cars 1979 and older qualify on age alone; stock
          trucks and SUVs need to be at least 25 years old, and modified ones at least 15. Restomods
          and customs are insurable — they simply get underwritten as modified vehicles, which is
          where documentation starts to matter.
        </li>
        <li>
          <strong>The use.</strong> Reasonable pleasure use — cruises, shows, club events — with
          no fixed mileage cap on Hagerty&rsquo;s policy, but it cannot be your daily driver. Some
          other insurers instead cap annual kilometres. Either way, commuting is out.
        </li>
        <li>
          <strong>The storage.</strong> A locked private garage, pole barn, or storage unit is the
          preferred answer. Carports, driveways, and parking garages get reviewed case by case,
          and a car that sleeps outside year-round is a hard sell.
        </li>
        <li>
          <strong>The drivers.</strong> Every licensed driver in the household needs a regular-use
          vehicle insured in their own name, and a serious infraction in the last three years —
          impaired driving, racing, excessive speed — usually disqualifies.
        </li>
      </ul>
      <p>
        Answer the use and storage questions honestly. The premium saved by calling a commuter a
        pleasure car is small; the claim denied because the car was photographed in a downtown
        parkade every weekday is not. A collector policy is cheap because the risk is genuinely
        low — keep it true and it stays cheap.
      </p>

      <h2>What does collector car insurance cost in Alberta?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$300–$800</span>
          <span className="stat-l">Typical collector premium per year, common agreed values</span>
        </div>
        <div>
          <span className="stat-v">$1,600–$2,800+</span>
          <span className="stat-l">Typical Edmonton daily-driver premium, for contrast</span>
        </div>
        <div>
          <span className="stat-v">$150–$400</span>
          <span className="stat-l">Professional appraisal, modified and high-value cars</span>
        </div>
        <div>
          <span className="stat-v">25 yrs</span>
          <span className="stat-l">Alberta&rsquo;s antique-plate age threshold</span>
        </div>
      </div>
      <p>
        Every one of those is a planning range in Canadian dollars, not a quote — agreed value,
        driving record, postal code, and storage all move the number. But the shape of the deal
        holds: a garaged classic on agreed value routinely insures for a fraction of what a
        commuter costs, and even against standard carriers quoting the very same classic,
        Hagerty&rsquo;s own consumer data claims average savings up to 33 percent.
        <a href="#src-2" className="cite-ref">[2]</a> The logic is not charity. A collector car
        covers a few thousand fair-weather kilometres a year, sleeps indoors, and is driven by
        someone who spent a winter wet-sanding it. That is the lowest-risk profile on the road,
        and the premium prices it accordingly.
      </p>

      <h2>Do you need an appraisal for agreed value?</h2>
      <p>
        For a stock classic, often not — specialty insurers set agreed values on most unmodified
        vehicles from their own valuation data, no appraisal required.
        <a href="#src-2" className="cite-ref">[2]</a> For anything modified — which in this shop
        means most things — expect to support the number. A professional appraisal in Alberta
        commonly runs $150 to $400 CAD, and it is the cheapest insurance your insurance will ever
        buy, because a restomod&rsquo;s value lives in its build sheet, not in any price guide.
      </p>
      <p>
        Whether an appraisal is required or not, build the paper trail: dated photos of every
        stage, receipts for parts and machine work, dyno sheets, invoices. When a build leaves
        this shop, the owner gets that package precisely so the agreed-value conversation takes
        ten minutes instead of a month. File it somewhere fireproof that is not the glovebox of
        the car it describes.
      </p>

      <h2>Do antique plates change your insurance?</h2>
      <p>
        No — plates are registration, and registration is a separate decision from insurance.
        Alberta offers an antique plate for vehicles 25 years and older, with a registration that
        legally restricts the car to exhibitions, club activities, parades, travel to and from
        those events, and trips for servicing.<a href="#src-4" className="cite-ref">[4]</a> It is
        a good fit for a show car that only sees the road on event weekends, and a bad fit for
        anything you want to drive on a random Tuesday evening in July.
      </p>
      <p>
        The common Alberta setup for a driver-grade classic is regular plates with a collector
        policy — full legal use of the road, agreed-value protection, pleasure-use pricing. Run
        the antique plate only when the car&rsquo;s life genuinely matches its restrictions. And
        if the car is coming in from Saskatchewan, B.C., or the States, remember the order of
        operations: the{" "}
        <Link href="/blog/out-of-province-inspection-edmonton">out-of-province inspection</Link>{" "}
        comes before Alberta registration, and registration comes before any of these plate
        decisions matter.
      </p>

      <h2>What changes under Alberta&rsquo;s new insurance system in 2027?</h2>
      <p>
        Alberta&rsquo;s auto insurance system moves to a Care-First model on January 1, 2027,
        which reworks how injury claims are handled — treatment benefits, income replacement, and
        limits on when injured parties can sue.<a href="#src-5" className="cite-ref">[5]</a> That
        overhaul lands on the injury side of every Alberta policy, collector policies included.
        What it does not touch is the part this article is about: agreed value is physical-damage
        coverage, and the deal on your declaration page rides through the reform unchanged. Read
        the renewal paperwork that arrives in late 2026 like a gearhead reads a torque spec —
        carefully — but do not expect the collector product to disappear.
      </p>

      <h2>What should you do before the car leaves the shop?</h2>
      <p>
        Line the policy up while the car is still on the hoist, not after it is sitting in your
        garage uninsured and gleaming. The sequence: get the build documented, get the agreed
        value set from that documentation, answer the use and storage questions straight, and
        diarize a value review for every renewal. If the car winters indoors — and in Edmonton it
        should — do not cancel coverage in November; fire, theft, and a collapsing shelf do not
        take the season off, and the <Link href="/guides/winter">winter guide</Link> covers how
        storage and coverage fit together.
      </p>
      <p>
        And if the reason you are reading this is a car that is about to become worth insuring —
        a build you are pricing, a barn car you are weighing, a restoration you want done right —
        send the details through the <Link href="/quote#form">quote page</Link>. Every car that leaves
        here goes out with the paper trail an agreed-value policy wants, because a restoration
        you cannot prove the value of is a restoration you paid for twice.
      </p>
    </>
  );
}
