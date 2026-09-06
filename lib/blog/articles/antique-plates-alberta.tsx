import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Alberta Antique Plates.
 * The paperwork article for the antique-registration keyword cluster. Answers
 * what the plate allows and forbids BEFORE the owner buys it, then routes into
 * the out-of-province inspection article, the Radium road story, the
 * restoration service, the winter guide, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "antique-plates-alberta",
  title:
    "Alberta Antique Plates: The 25-Year Rule, the Restrictions, and Whether They Are Worth It",
  accent: "Worth It",
  metaTitle: "Alberta Antique Plates: The Rules",
  description: "What Alberta antique vehicle registration allows and forbids, the one-time fee, year-of-manufacture plates, and how the plate squares with collector insurance.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Paperwork",
  targetKeywords: [
    "antique plates Alberta",
    "antique vehicle registration Alberta",
    "antique plate restrictions Alberta",
    "collector plates Alberta cost",
    "year of manufacture plates Alberta",
  ],
  faq: [
    {
      q: "How old does a vehicle have to be for antique plates in Alberta?",
      a: "Twenty-five years old or older. But age is only one of four statutory conditions — the regulation defines an antique motor vehicle as one that is 25 years old or older, is owned as a collector's item, is not used as general transportation, and is driven only in exhibitions, club activities, parades, or similar events. The line moves every year: in 2026, a 2001 model year qualifies, which means the first factory-LS Silverados are now antiques.",
    },
    {
      q: "Can I daily drive a car with antique plates in Alberta?",
      a: "No. The regulation flatly prohibits using an antique-registered vehicle as general transportation. The permitted uses are driving to, from, and in exhibitions, club activities, parades, and similar events, plus trips to and from a garage or service station for repairs or servicing. Commuting, errands, and casual driving are outside the registration class. If you want to drive the car whenever the sun is out, keep regular plates.",
    },
    {
      q: "How much do antique plates cost in Alberta?",
      a: "The government fee is $30, paid once. With the registry agent's service charge and GST on top, expect roughly $40 to $45 at an Edmonton counter. The registration then never expires for as long as you own the vehicle — no annual renewal. Regular passenger registration, by comparison, is a $75 government fee every year, typically $90 to $100 all-in at the counter, so the antique class pays for itself in the first year. All figures are planning ranges in Canadian dollars.",
    },
    {
      q: "Can I run my car's original year-of-manufacture licence plate in Alberta?",
      a: "Yes, with approval. If you produce an Alberta plate that was issued in the year your antique vehicle was manufactured, and it is in a condition satisfactory to the Registrar, it can be approved for use on the car in place of the issued antique plate. You run one plate or the other, never both. It is the best cosmetic paperwork provision in the book for a period-correct restoration.",
    },
    {
      q: "Do I still need insurance with antique plates?",
      a: "Yes. Antique registration is a registration class, not an insurance policy — the vehicle still needs valid Alberta insurance to be on the road. Most collectors pair the plate with a collector policy carrying agreed value, which in Alberta is applied through an endorsement, so a total loss pays the full insured amount instead of a depreciated book figure. Registration and insurance are separate systems with separate usage rules; the car has to obey the tighter of the two.",
    },
  ],
  citations: [
    {
      name: "“Licence plates,” Government of Alberta",
      url: "https://www.alberta.ca/licence-plates",
    },
    {
      name: "Operator Licensing and Vehicle Control Regulation (AR 320/2002), Alberta King's Printer",
      url: "https://kings-printer.alberta.ca/documents/Regs/2002_320.pdf",
    },
    {
      name: "“Antique & Personalized Alberta Licence Plates,” In & Out Registry Services, Edmonton",
      url: "https://services.edmontonregistry.com/article/59-antique-personalized-veterans-alberta-licence-plates",
    },
    {
      name: "“Coverage for Classic & Collector Cars,” Hagerty Canada",
      url: "https://www.hagerty.ca/insurance/classic-car-insurance",
    },
    {
      name: "“Registering an Out-of-Province Vehicle in Alberta,” Government of Alberta, Transportation and Economic Corridors",
      url: "https://www.alberta.ca/system/files/tec-registering-an-out-of-province-vehicle-in-alberta.pdf",
    },
  ],
  internalLinks: [
    "/blog/road-to-radium-show-and-shine",
    "/blog/out-of-province-inspection-edmonton",
    "/services/classic-car-restoration",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * An Alberta antique plate drawn as steel line art — bolt slots, ALBERTA
 * header, ANTIQUE banner — with a fee tag hanging off one bolt and, at right,
 * a permitted-routes diagram: garage, show grounds, and service bay joined by
 * solid amber legs, the daily-commute leg dashed and crossed out. A smaller
 * year-of-manufacture plate sits below. Numbered tungsten pins tie the four
 * rules to the article. Editorial plate style: mono labels, sourced glow.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of an Alberta antique licence plate in steel line art with a one-time-fee tag on its mounting bolt, beside a route map showing solid permitted legs from a garage to show grounds and a service bay and a crossed-out dashed leg toward daily errands, with a smaller year-of-manufacture plate below and four numbered callout pins for the 25-year rule, the one-time fee, exhibition-only use, and the original-plate option"
      className="h-auto w-full"
    >
      <title>The plate is cheap. The restriction is the price — Alberta antique registration, mapped</title>
      <defs>
        <radialGradient id="ap-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the plate */}
      <ellipse cx="360" cy="470" rx="300" ry="32" fill="url(#ap-pool)" />

      {/* ══ THE ANTIQUE PLATE ══ */}
      <g>
        <rect x="170" y="170" width="380" height="200" rx="14" fill="none" stroke="#9a9ca0" strokeWidth="2" />
        <rect x="182" y="182" width="356" height="176" rx="9" fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" />
        {/* bolt slots */}
        <g fill="none" stroke="#9a9ca0" strokeWidth="1.3">
          <rect x="235" y="188" width="26" height="8" rx="4" />
          <rect x="459" y="188" width="26" height="8" rx="4" />
        </g>
        {/* header */}
        <text
          x="360"
          y="225"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="16"
          letterSpacing="0.42em"
          fill="#9a9ca0"
        >
          ALBERTA
        </text>
        {/* serial */}
        <text
          x="360"
          y="296"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="52"
          letterSpacing="0.14em"
          fill="#9a9ca0"
        >
          A·2240
        </text>
        {/* ANTIQUE banner */}
        <line x1="240" y1="322" x2="480" y2="322" stroke="#ffb066" strokeWidth="1" strokeOpacity="0.5" />
        <text
          x="360"
          y="347"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="19"
          letterSpacing="0.5em"
          fill="#ffb066"
        >
          ANTIQUE
        </text>
      </g>

      {/* fee tag hanging off the left bolt slot */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.2" strokeLinecap="round">
        <path d="M 248 196 Q 226 216 210 240" strokeOpacity="0.7" strokeDasharray="1 4" />
        <path d="M 210 240 L 156 262 L 148 316 L 226 296 L 232 250 Z" />
      </g>
      <circle cx="212" cy="252" r="3" fill="none" stroke="#ffb066" strokeWidth="1" />
      <text
        x="188"
        y="284"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="12"
        letterSpacing="0.06em"
        fill="#ffd9ad"
        transform="rotate(-13 188 284)"
      >
        $30 · ONCE
      </text>

      {/* ══ YEAR-OF-MANUFACTURE PLATE, BELOW ══ */}
      <g>
        <rect x="238" y="420" width="244" height="118" rx="9" fill="none" stroke="#9a9ca0" strokeWidth="1.5" strokeOpacity="0.8" />
        <text
          x="360"
          y="463"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="30"
          letterSpacing="0.16em"
          fill="#9a9ca0"
          fillOpacity="0.85"
        >
          59·417
        </text>
        <text
          x="360"
          y="500"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="12"
          letterSpacing="0.3em"
          fill="#9a9ca0"
          fillOpacity="0.6"
        >
          ALBERTA 1959
        </text>
        {/* worn corner tick */}
        <path d="M 238 438 L 252 420" stroke="#9a9ca0" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
      </g>
      <text
        x="360"
        y="572"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        ONE PLATE ON THE CAR — NEVER BOTH
      </text>

      {/* ══ PERMITTED-ROUTES DIAGRAM, RIGHT ══ */}
      {/* garage node */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 662 336 L 662 296 L 700 272 L 738 296 L 738 336 Z" />
        <rect x="684" y="308" width="32" height="28" strokeWidth="1.1" strokeOpacity="0.7" />
      </g>
      <text x="700" y="362" textAnchor="middle" fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.16em" fill="#9a9ca0" fillOpacity="0.7">
        YOUR GARAGE
      </text>

      {/* show grounds node — pennant over a plinth */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4" strokeLinecap="round">
        <line x1="1012" y1="150" x2="1012" y2="216" />
        <path d="M 1012 150 L 1058 162 L 1012 174" />
        <rect x="978" y="216" width="68" height="12" strokeWidth="1.1" strokeOpacity="0.7" />
      </g>
      <text x="1012" y="252" textAnchor="middle" fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.16em" fill="#9a9ca0" fillOpacity="0.7">
        SHOW · CLUB · PARADE
      </text>

      {/* service bay node — two lift posts */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4" strokeLinecap="round">
        <line x1="986" y1="474" x2="986" y2="430" />
        <line x1="1038" y1="474" x2="1038" y2="430" />
        <line x1="978" y1="430" x2="994" y2="430" />
        <line x1="1030" y1="430" x2="1046" y2="430" />
        <line x1="966" y1="474" x2="1058" y2="474" strokeOpacity="0.7" strokeWidth="1.1" />
      </g>
      <text x="1012" y="500" textAnchor="middle" fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.16em" fill="#9a9ca0" fillOpacity="0.7">
        SERVICE BAY
      </text>

      {/* permitted legs — solid amber, arrowed both ways */}
      <g stroke="#ffb066" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M 742 306 Q 870 224 972 196" />
        <path d="M 958 200 L 972 196 L 962 208" strokeWidth="1.1" />
        <path d="M 756 300 L 742 306 L 752 316" strokeWidth="1.1" />
        <path d="M 742 330 Q 870 388 962 438" />
        <path d="M 948 436 L 962 438 L 950 446" strokeWidth="1.1" />
        <path d="M 756 326 L 742 330 L 752 340" strokeWidth="1.1" />
      </g>
      <text x="866" y="238" textAnchor="middle" fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.14em" fill="#ffd9ad">
        PERMITTED — S.57(4)
      </text>
      <text x="862" y="402" textAnchor="middle" fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.14em" fill="#ffd9ad">
        REPAIRS &amp; SERVICING
      </text>

      {/* forbidden leg — dashed steel toward the office block, crossed out */}
      <g fill="none" strokeLinecap="round">
        <path d="M 700 340 Q 700 470 640 560" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.55" strokeDasharray="4 6" />
        <g stroke="#ffb066" strokeWidth="1.6">
          <line x1="664" y1="458" x2="692" y2="486" />
          <line x1="692" y1="458" x2="664" y2="486" />
        </g>
      </g>
      {/* office block */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6">
        <rect x="608" y="560" width="56" height="66" />
        <line x1="622" y1="576" x2="650" y2="576" />
        <line x1="622" y1="592" x2="650" y2="592" />
        <line x1="622" y1="608" x2="650" y2="608" />
      </g>
      <text x="702" y="600" fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.16em" fill="#9a9ca0" fillOpacity="0.6">
        WORK · ERRANDS · DAILY USE
      </text>
      <text x="702" y="618" fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.16em" fill="#ffb066">
        NOT PERMITTED
      </text>

      {/* ══ LEADER LINES ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 96 96 L 300 176" />
        <path d="M 96 330 L 148 306" />
        <path d="M 866 96 L 760 288" />
        <path d="M 96 520 L 240 500" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 300, y: 176, n: "1" },
          { x: 148, y: 306, n: "2" },
          { x: 760, y: 288, n: "3" },
          { x: 240, y: 500, n: "4" },
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
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10.5" letterSpacing="0.16em">
        <text x="40" y="88" fill="#ffb066">
          1 · 25 YEARS OLD OR OLDER
        </text>
        <text x="40" y="338" fill="#ffb066">
          2 · ONE FEE, NO RENEWAL
        </text>
        <text x="866" y="88" fill="#ffb066">
          3 · EXHIBITION USE ONLY
        </text>
        <text x="40" y="528" fill="#ffb066">
          4 · YEAR-OF-MANUFACTURE OPTION
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
        FIG. P — THREE LEGAL ROADS, AND EVERY OTHER ONE
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Alberta antique plates cost about forty dollars once, never renew, and put a hard limit on
        the car: exhibitions, club activities, parades, travel to and from them, and trips to the
        shop for service — nothing else. Any vehicle 25 years old or older qualifies. Whether that
        trade is worth it depends entirely on how you actually drive.
      </p>

      <h2>How old does a car have to be for antique plates in Alberta?</h2>
      <p>
        Twenty-five years or older — that is the headline rule, straight from the province&rsquo;s
        licence plate page.<a href="#src-1" className="cite-ref">[1]</a> But age is only one of
        four conditions. The regulation defines an antique motor vehicle as one that is 25 years
        old or older, is owned as a collector&rsquo;s item, is not used as general transportation,
        and is driven only in exhibitions, club activities, parades, or similar events.
        <a href="#src-2" className="cite-ref">[2]</a> When you register, you are declaring all
        four, not just the birthday.
      </p>
      <p>
        The line moves every year, and it moves in interesting directions. In 2026 a 2001 model
        year qualifies — which means the first Silverados with factory LS power are now antiques,
        parked in the same registration class as a Model A. The registry does not care about
        condition or originality: a rusty survivor, a rotisserie restoration, and a full restomod
        all qualify on age alone. Trucks and motorcycles count the same as cars.
      </p>

      <h2>What do antique plates cost in Alberta?</h2>
      <p>
        The government fee is $30, paid one time.<a href="#src-2" className="cite-ref">[2]</a>{" "}
        Registry agents add their service charge on top — an Edmonton counter will typically land
        around $40 with GST.<a href="#src-3" className="cite-ref">[3]</a> Then the meter stops:
        the regulation says an antique certificate of registration does not expire for as long as
        you own the vehicle.<a href="#src-2" className="cite-ref">[2]</a> No renewal notice, no
        annual line-up, no late fee, ever.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$30</span>
          <span className="stat-l">Government fee — once, not yearly</span>
        </div>
        <div>
          <span className="stat-v">$40–$45</span>
          <span className="stat-l">Typical all-in at an Edmonton registry counter</span>
        </div>
        <div>
          <span className="stat-v">$90–$100</span>
          <span className="stat-l">Regular passenger registration, per year, all-in</span>
        </div>
        <div>
          <span className="stat-v">25 yrs</span>
          <span className="stat-l">Minimum vehicle age — 2001 qualifies in 2026</span>
        </div>
      </div>
      <p>
        Against regular passenger registration — a $75 government fee every twelve months, call it
        $90 to $100 a year once the agent is paid — the antique plate pays for itself before the
        first summer is out. Over a decade of ownership the difference is roughly $900 in Canadian
        dollars, hedged like every number in this journal. Two fine-print notes: the registration
        stays with you and that vehicle, so a sale ends it and the new owner starts fresh; and
        with the Registrar&rsquo;s consent the antique plate itself can move to another antique
        vehicle you register later.<a href="#src-2" className="cite-ref">[2]</a>
      </p>

      <h2>What are the antique plate restrictions in Alberta?</h2>
      <p>
        The regulation gives an antique-registered vehicle exactly two jobs. It may be used as a
        collector&rsquo;s item for transportation to, from, and in exhibitions, club activities,
        parades, or similar events. And it may be driven to and from a garage or service station
        for repairs or servicing.<a href="#src-2" className="cite-ref">[2]</a> The province&rsquo;s
        own plain-language version says the same thing: shows, club functions, parades, the drive
        there and back, and servicing appointments.<a href="#src-1" className="cite-ref">[1]</a>{" "}
        Everything else — commuting, groceries, the school run — is general transportation, and
        the regulation prohibits it outright.
      </p>
      <p>
        Translate that to a real season. Cruise night with the club: covered. The haul out to a
        show — the kind of run we made on the{" "}
        <Link href="/blog/road-to-radium-show-and-shine">road to Radium</Link> — covered, both
        directions. Driving to this shop for carb work: covered. The honest grey zone is the
        Saturday-evening drive for its own sake. &ldquo;Similar events&rdquo; does some work in
        that sentence, and a documented club run is defensible in a way a solo rip up Groat Road
        is not. Nobody is running checkstops for parade trucks — but the regulation&rsquo;s text
        is what a peace officer reads at a traffic stop, and worse, what an insurance adjuster
        reads after a loss. A collision on a Tuesday commute in a car registered for exhibitions
        invites questions you do not want asked over a bent fender.
      </p>
      <blockquote>
        <p>The plate is thirty dollars. The restriction is the price.</p>
        <footer>Shop rule, said at the counter</footer>
      </blockquote>

      <h2>Can you run the car&rsquo;s original year-of-manufacture plate?</h2>
      <p>
        This is the provision most owners have never heard of, and it is the best cosmetic
        paperwork in the book. If you produce an Alberta licence plate that was issued in the year
        your antique vehicle was manufactured — a real 1959 plate for a real 1959 truck — and it
        is in a condition satisfactory to the Registrar, it can be approved for use on the car in
        place of the issued antique plate.<a href="#src-2" className="cite-ref">[2]</a> A
        period-correct restoration gets a period-correct plate, legally registered. The rules are
        short: it must be an Alberta plate, from the year of manufacture, and the car wears one
        plate or the other — never both. Condition is the Registrar&rsquo;s call, so a straight,
        legible plate from a swap meet is a better bet than a lace-rusted barn wall trophy.
        Original-year plates for common years turn up at Alberta swap meets and online regularly;
        expect to pay somewhere between $30 and $150 CAD depending on year and condition.
      </p>

      <h2>Does an antique plate change your insurance?</h2>
      <p>
        No — and this is the interplay that catches people. Antique registration is a registration
        class, not an insurance policy. The car still needs valid Alberta insurance to touch a
        public road, and your insurer neither knows nor cares what the plate says until claim
        time. What most collectors actually pair with the plate is a collector policy: agreed
        value — applied in Alberta through an endorsement — so a total loss pays the full insured
        amount rather than a depreciated book figure, at premiums that reflect a car driven
        carefully and rarely.<a href="#src-4" className="cite-ref">[4]</a>
      </p>
      <p>
        Here is the part to think through before the plate is on. Registration and insurance are
        two separate rulebooks, and the car must obey the tighter one. A collector policy built
        around occasional pleasure use may happily cover an evening drive that the antique
        registration does not permit — in which case the registration is your limit, not the
        policy. Run it the other way and the trap flips: regular plates give you legal freedom to
        drive anywhere, but a collector policy still excludes commuting and routine errands, so
        the policy is the limit. The combination that works for people who actually drive their
        classic is usually regular registration plus collector insurance. The combination that
        works for a parade truck is antique registration plus collector insurance. The
        combination that works for nobody is any paperwork that says one thing while the odometer
        says another.
      </p>

      <h2>Does an out-of-province classic still need an inspection?</h2>
      <p>
        Yes. There is no antique carve-out. A vehicle coming into Alberta from another province or
        country generally needs to pass an out-of-province inspection before it can be registered
        and plated, and the province&rsquo;s current fact sheet lists the full set of exemptions:
        new vehicles, recently inspected commercial vehicles, and the New West Partnership
        provisions for BC, Saskatchewan, and Manitoba. Antique registration is not on the list —
        and the New West exemption excludes custom, lifted, and lowered vehicles anyway.
        <a href="#src-5" className="cite-ref">[5]</a> So the &rsquo;69 Camaro you bought in
        Kelowna faces the same inspection whether it will wear a regular plate or an antique one.
        The full process, the failure points, and how this shop preps cars for it are covered in
        the <Link href="/blog/out-of-province-inspection-edmonton">out-of-province inspection
        guide</Link>.
      </p>
      <p>
        One useful non-requirement: a project does not need registration while it is a shell. A
        car in the middle of a{" "}
        <Link href="/services/classic-car-restoration">frame-off restoration</Link> can sit
        unregistered for the whole build and take its antique plate the week it first drives.
        Nothing in the antique class rewards or punishes you for when you register — the 25 years
        are counted from the vehicle&rsquo;s age, not your paperwork date.
      </p>

      <h2>So are antique plates worth it?</h2>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Antique registration compared with regular passenger registration in Alberta by
            upfront cost, renewal, permitted use, plate options, and best fit
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Antique registration</th>
              <th scope="col">Regular registration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Upfront cost (CAD)</th>
              <td className="num">$30 fee — roughly $40–$45 at the counter</td>
              <td className="num">$75 fee — roughly $90–$100 at the counter</td>
            </tr>
            <tr>
              <th scope="row">Renewal</th>
              <td>None — never expires while you own the car</td>
              <td>Every 12 months, for as long as you drive</td>
            </tr>
            <tr>
              <th scope="row">Where you can drive</th>
              <td>Shows, club events, parades, there and back, and servicing trips</td>
              <td>Anywhere, any day, any reason</td>
            </tr>
            <tr>
              <th scope="row">Plate on the bumper</th>
              <td>&ldquo;Antique&rdquo; plate, or an approved original year-of-manufacture plate</td>
              <td>Standard current issue</td>
            </tr>
            <tr>
              <th scope="row">Best for</th>
              <td>Parade trucks, show cars, collection cars that trailer more than they drive</td>
              <td>Any classic you want to drive on a whim</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The shop&rsquo;s honest read: antique plates are worth it for the car that leaves the
        garage a dozen times a summer and always toward an event. The fee is trivial, the
        no-renewal registration is genuinely convenient, and the year-of-manufacture option is a
        detail that finishes a period build properly. They are the wrong answer for any classic
        you intend to drive when the weather cooperates — the ninety-odd dollars a year you save is
        the cheapest thing about your car, and trading every spontaneous drive for it is a bad
        bargain. If you would resent asking the regulation&rsquo;s permission, keep regular plates
        and let a collector policy handle the value protection.
      </p>
      <p>
        Either way, the car sits from November to April, and how it sits matters more than what
        plate it wears — the <Link href="/guides/winter">winter guide</Link> covers storage, fuel,
        and battery strategy in one place. And if the paperwork question is attached to a build —
        an out-of-province purchase, a restoration nearing its first start-up, a truck that needs
        to be roadworthy before any plate goes on — send the details through the{" "}
        <Link href="/quote">quote page</Link> and you will get a straight answer on the work, the
        order to do it in, and what it typically runs.
      </p>
    </>
  );
}
