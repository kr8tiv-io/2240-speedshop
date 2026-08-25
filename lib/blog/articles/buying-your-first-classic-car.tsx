import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Buying Your First Classic Car in Alberta.
 * The Buy Smart anchor for purchase-intent searches. Covers the four checks
 * that matter — load-bearing rust, numbers and paperwork, the Alberta lien
 * search, and AMVIC rules at dealers and consignment lots — and links down
 * into the barn-find protocol, the out-of-province inspection guide, the
 * restoration timeline, the restoration service page, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "buying-your-first-classic-car",
  title: "Buying Your First Classic Car in Alberta: A Shop Foreman's Checklist",
  accent: "Checklist",
  metaTitle: "Buying Your First Classic Car in Alberta: The Checklist",
  description:
    "Where rust actually matters, how to run an Alberta lien search, what AMVIC covers, and the checks that keep a first classic from becoming a $30,000 lesson.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Buy Smart",
  targetKeywords: [
    "buying first classic car",
    "classic car buying checklist",
    "classic cars for sale Alberta what to check",
    "AMVIC used vehicle rules",
    "classic car lien search Alberta",
  ],
  faq: [
    {
      q: "What is the most important thing to check when buying a first classic car?",
      a: "Structural rust — corrosion in the metal that carries load. Frame rails, floor pans, rocker panels, spring perches, shock towers, and body mounts decide whether the car is a driver or a shell, and they are the most expensive metal on the car to replace. Get underneath with a flashlight, press and scrape anything rusty, and run a small magnet along the lower body to find filler. Paint, chrome, and interior are cosmetic by comparison; the load-bearing metal is the purchase.",
    },
    {
      q: "How do I check if a classic car has a lien in Alberta?",
      a: "Search the Alberta Personal Property Registry using the vehicle's serial number, through any registry agent office or an online search provider — typically $10 to $30 CAD and returned in minutes. A registered lien stays with the vehicle, not the seller, so do the search before any money moves. If a lien shows, walk away or insist on a written payout letter from the lender and pay the lender directly, never the seller.",
    },
    {
      q: "Does AMVIC protect me if I buy a classic car from a private seller?",
      a: "No. AMVIC's consumer protections — written vehicle history disclosure, the mechanical fitness assessment, all-in advertised pricing, and access to the compensation fund — apply to purchases from AMVIC-licensed businesses, which includes dealers and consignment lots. A private sale is as-is, where-is: no mandatory disclosure, no assessment, and no fund if it goes wrong. That does not make private sales bad, but it puts every check on you.",
    },
    {
      q: "Do I need an out-of-province inspection for a classic bought in BC or Saskatchewan?",
      a: "Generally yes. A vehicle last registered outside Alberta must pass an out-of-province inspection at a licensed facility before Alberta plates are issued, and the certificate must be presented to a registry agent within 14 days of completion. Limited exemptions exist for some vehicles with recent government inspections from certain provinces. Price the inspection, and the repairs it can trigger, into the deal before you commit to hauling a car home.",
    },
    {
      q: "How much should I budget beyond the purchase price of a first classic?",
      a: "For an honest driver-grade car, plan on roughly 20 to 50 percent of the purchase price in the first year — brakes, fuel system, cooling, tires, and the deferred maintenance every long-owned classic carries. All figures in Canadian dollars, and all of them planning ranges. A car that needs floors, rockers, or frame repair is not a driver with problems, it is a project, and project math is a different article.",
    },
  ],
  citations: [
    {
      name: "“10 Easy Things You Need to Look for When Inspecting a Vintage, Classic, or Collectible Car Before a Purchase,” OnAllCylinders (Summit Racing), September 2021",
      url: "https://www.onallcylinders.com/2021/09/09/10-easy-things-to-look-for-when-inspecting-a-vintage-classic-car-before-a-purchase/",
    },
    {
      name: "“Personal property liens,” Government of Alberta",
      url: "https://www.alberta.ca/personal-property-liens",
    },
    {
      name: "“Buying used,” Alberta Motor Vehicle Industry Council (AMVIC)",
      url: "https://www.amvic.org/consumer/buying-a-vehicle/buying-used/",
    },
    {
      name: "“All-in advertised pricing,” Alberta Motor Vehicle Industry Council (AMVIC)",
      url: "https://www.amvic.org/consumer/your-rights/all-inpricingisthelaw/",
    },
    {
      name: "“Out-of-province vehicle inspections,” Government of Alberta",
      url: "https://www.alberta.ca/out-of-province-vehicle-inspections",
    },
    {
      name: "“What to Know Before Performing a Pre-Purchase Car Inspection,” Hagerty Media, June 2023",
      url: "https://www.hagerty.com/resources/how-tos/inspect-your-classic-car",
    },
  ],
  internalLinks: [
    "/blog/barn-find-first-steps",
    "/blog/out-of-province-inspection-edmonton",
    "/blog/classic-car-restoration-timeline",
    "/services/classic-car-restoration",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * A first classic on jack stands, in side elevation — steel line art of a
 * late-sixties hardtop with the checklist pinned to it in tungsten: frame
 * rail, floor pans, rockers, spring perches, the VIN plate against the title,
 * a magnet hunting filler on the quarter, and the PPR lien search as a
 * document plate at top right. Same editorial plate style as the rest of the
 * Journal: mono labels, numbered pins, sourced glow.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Side elevation of a classic hardtop coupe raised on jack stands, drawn in steel line art, with six numbered tungsten callout pins marking the first-purchase checklist — frame rail, floor and trunk pans, rocker panels, spring perches and mounts, the VIN plate that must match the title, and a magnet finding body filler on the quarter panel — plus a Personal Property Registry lien-search document at top right"
      className="h-auto w-full"
    >
      <title>The first-classic checklist, pinned to the car it protects</title>
      <defs>
        <radialGradient id="bf-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the car */}
      <ellipse cx="573" cy="560" rx="360" ry="32" fill="url(#bf-pool)" />

      {/* ground line */}
      <line
        x1="200"
        y1="574"
        x2="960"
        y2="574"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.4"
        strokeDasharray="2 6"
      />

      {/* ══ JACK STANDS — the car is up, not promised up ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M 486 476 L 470 572 L 522 572 L 506 476 Z" />
        <line x1="479" y1="520" x2="513" y2="520" strokeOpacity="0.6" />
        <path d="M 664 476 L 648 572 L 700 572 L 684 476 Z" />
        <line x1="657" y1="520" x2="691" y2="520" strokeOpacity="0.6" />
      </g>

      {/* ══ BODY — hardtop coupe in side profile, nose left ══ */}
      {/* upper body: bumper, hood, A-pillar, roof, C-pillar, deck, tail */}
      <path
        d="M 246 455 L 244 402 Q 244 372 272 366 L 432 352 Q 492 302 560 292 L 668 286 Q 722 290 752 330 Q 766 344 830 352 L 876 358 Q 896 362 898 388 L 900 455"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* rocker line with wheel arches */}
      <path
        d="M 246 455 L 322 455 A 58 58 0 0 1 438 455 L 722 455 A 58 58 0 0 1 838 455 L 900 455"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* beltline + glass */}
      <line x1="446" y1="356" x2="828" y2="354" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" />
      <path
        d="M 516 300 L 664 293"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.1"
        strokeOpacity="0.7"
      />
      <line x1="598" y1="294" x2="602" y2="352" stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.7" />
      {/* wheels, hanging free of the ground */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6">
        <circle cx="380" cy="460" r="50" />
        <circle cx="380" cy="460" r="18" strokeOpacity="0.7" />
        <circle cx="780" cy="460" r="50" />
        <circle cx="780" cy="460" r="18" strokeOpacity="0.7" />
      </g>

      {/* frame rail under the floor, stand to stand */}
      <line x1="446" y1="472" x2="716" y2="472" stroke="#9a9ca0" strokeWidth="1.6" strokeOpacity="0.85" />
      {/* floor pan hint above the rail */}
      <line
        x1="452"
        y1="462"
        x2="712"
        y2="462"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.45"
        strokeDasharray="4 5"
      />

      {/* ══ RUST — tungsten hatch ticks where the load lives ══ */}
      <g stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.75" strokeLinecap="round">
        {/* frame rail scale */}
        <line x1="466" y1="478" x2="474" y2="466" />
        <line x1="478" y1="478" x2="486" y2="466" />
        <line x1="490" y1="478" x2="498" y2="466" />
        {/* rocker rot */}
        <line x1="652" y1="459" x2="660" y2="449" />
        <line x1="664" y1="459" x2="672" y2="449" />
        {/* rear arch lip */}
        <line x1="846" y1="446" x2="854" y2="436" />
        <line x1="856" y1="452" x2="864" y2="442" />
      </g>
      {/* rust flakes falling to the light pool */}
      <circle cx="482" cy="524" r="1.6" fill="#ffb066" fillOpacity="0.6" />
      <circle cx="662" cy="516" r="1.4" fill="#ffb066" fillOpacity="0.45" />

      {/* VIN plate at the cowl */}
      <rect x="500" y="330" width="30" height="13" fill="none" stroke="#ffb066" strokeWidth="1.2" />
      <line x1="504" y1="336" x2="526" y2="336" stroke="#ffb066" strokeWidth="0.8" strokeOpacity="0.7" />

      {/* ══ THE MAGNET — hunting filler on the quarter ══ */}
      <path
        d="M 942 356 Q 968 336 990 358 L 978 372 Q 968 362 956 372 Z"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <g stroke="#ffb066" strokeWidth="0.9" strokeOpacity="0.55" strokeLinecap="round">
        <line x1="944" y1="380" x2="920" y2="398" strokeDasharray="2 4" />
        <line x1="962" y1="384" x2="948" y2="404" strokeDasharray="2 4" />
      </g>

      {/* ══ THE LIEN SEARCH — PPR document, top right ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M 946 84 L 1042 84 L 1062 104 L 1062 218 L 946 218 Z" />
        <path d="M 1042 84 L 1042 104 L 1062 104" strokeWidth="1" strokeOpacity="0.7" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round">
        <line x1="960" y1="122" x2="1046" y2="122" />
        <line x1="960" y1="140" x2="1046" y2="140" />
        <line x1="960" y1="158" x2="1020" y2="158" />
      </g>
      {/* the check mark that clears the deal */}
      <path
        d="M 972 186 L 986 200 L 1014 172"
        fill="none"
        stroke="#ffb066"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ══ LEADER LINES — label column to pin ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        {/* left column */}
        <path d="M 214 226 L 505 330" />
        <path d="M 214 316 L 480 470" />
        <path d="M 214 404 L 580 462" />
        {/* right column */}
        <path d="M 906 300 L 664 452" />
        <path d="M 906 340 L 726 468" />
        <path d="M 906 420 L 946 380" />
        {/* document */}
        <path d="M 1004 246 L 1004 222" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 480, y: 470, n: "1" },
          { x: 580, y: 462, n: "2" },
          { x: 664, y: 452, n: "3" },
          { x: 726, y: 468, n: "4" },
          { x: 515, y: 336, n: "5" },
          { x: 946, y: 380, n: "6" },
          { x: 1004, y: 200, n: "7" },
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
        <text x="40" y="230" fill="#ffb066">
          5 · VIN PLATE — MATCHES THE TITLE, OR WALK
        </text>
        <text x="40" y="320" fill="#ffb066">
          1 · FRAME RAIL — SCRAPE IT, PAINT LIES
        </text>
        <text x="40" y="408" fill="#ffb066">
          2 · FLOOR &amp; TRUNK PANS — FROM UNDERNEATH
        </text>
        {/* right column */}
        <text x="1160" y="304" textAnchor="end" fill="#ffb066">
          3 · ROCKERS &amp; CAB CORNERS — FILLER COUNTRY
        </text>
        <text x="1160" y="344" textAnchor="end" fill="#ffb066">
          4 · SPRING PERCHES &amp; MOUNTS — LOAD-BEARING
        </text>
        <text x="1160" y="424" textAnchor="end" fill="#ffb066">
          6 · MAGNET — FINDS THE BONDO
        </text>
        {/* document label */}
        <text x="1004" y="266" textAnchor="middle" fill="#ffb066">
          7 · PPR LIEN SEARCH
        </text>
        <text
          x="1004"
          y="284"
          textAnchor="middle"
          fill="#9a9ca0"
          fillOpacity="0.6"
          fontSize="10"
        >
          BEFORE MONEY MOVES
        </text>
        {/* steel feature labels */}
        <text x="260" y="596" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          ON STANDS — NOT ON PROMISES
        </text>
      </g>

      {/* plate caption */}
      <text
        x="600"
        y="640"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. K — WHERE A FIRST CLASSIC HIDES ITS PROBLEMS
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Before any money moves: prove the load-bearing metal is solid — frame rails, floor pans,
        rockers, spring and shock mounts — prove the VIN on the car matches the title, run an
        Alberta lien search on the serial number, and know which AMVIC protections apply to where
        you are buying. Miss any one of those and the cheap classic gets expensive fast.
      </p>

      <h2>Where does rust actually kill a classic?</h2>
      <p>
        Not where you can see it. Surface rust on a valance or a bumper bracket is cosmetic and
        cheap. The rust that ends deals lives in the metal that carries load: frame rails, floor
        and trunk pans, rocker panels, cab corners, spring perches, shock towers, and body mounts.
        That is <strong>structural rust</strong> — corrosion attacking a stressed member — and it is the first
        thing to rule out on any candidate car, because it is the most expensive metal on the car
        to put back.<a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        The inspection costs nothing but dignity. Bring a flashlight, a piece of cardboard to lie
        on, a small screwdriver, and a fridge magnet. Get underneath — if the seller will not let
        the car go on stands or a hoist, that is your answer — and press or scrape anything rusty
        to feel whether solid metal lives under the scale. Run the magnet along rockers, lower
        fenders, and quarter panels: where it falls off, someone has been in there with filler.
        <a href="#src-1" className="cite-ref">[1]</a> Check where suspension meets body hardest —
        perches, shackle mounts, subframe mounts — because that is where stress and moisture
        collaborate.
      </p>
      <p>
        Alberta gives you one genuine advantage here. Dry prairie cars, and Saskatchewan farm
        finds, rust from the top down through bad window seals, not from the bottom up through
        road salt — which is exactly why buyers from Ontario and the coast come shopping our
        classifieds. But it cuts both ways: plenty of cars for sale in Edmonton lived their first
        thirty years in the rust belt and only retired west. Judge the car in front of you, never
        the licence plate on it. And if the car has been sitting in a quonset since the nineties,
        read the <Link href="/blog/barn-find-first-steps">barn-find first steps</Link> before you
        even think about turning the key.
      </p>
      <blockquote>
        <p>Paint is a story the seller tells you. The underside is testimony under oath.</p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>

      <h2>How do you check the numbers and the paperwork?</h2>
      <p>
        Every dollar of collector value hangs on identity. Find the VIN plate — door jamb, cowl,
        or dash depending on year — and confirm it matches the title character for character,
        before you talk price.<a href="#src-1" className="cite-ref">[1]</a> A missing plate, a
        plate with disturbed rivets, or a title that says 1968 while the trim tag says 1970 is
        not a detail to sort out later; it is <strong>a car you do not buy</strong>. On sixties and seventies
        domestics, the cowl or trim tag tells you what the car was born as — engine, paint code,
        interior — which is how a real SS or GT gets separated from a clone priced like one.
      </p>
      <p>
        Then the paper trail. Bill of sale with the seller&rsquo;s name matching the
        registration. Photo ID that matches both. Receipts for the work the seller claims —
        &ldquo;rebuilt engine&rdquo; with no machine-shop invoice is a story, not a rebuild. In
        Alberta, a seller who cannot produce current registration in their own name deserves one
        polite question and, if the answer wobbles, a short goodbye. Flippers posing as private
        sellers are common enough that AMVIC has a name for them — curbers — and the missing
        paperwork is usually how they show themselves.
      </p>

      <h2>How do you check for a lien on a vehicle in Alberta?</h2>
      <p>
        This is the ten-dollar step that saves the whole purchase, and most first-time buyers
        skip it. Any vehicle can have a lien registered against it in Alberta&rsquo;s Personal
        Property Registry — security for someone else&rsquo;s unpaid loan — and the Government of
        Alberta is blunt about the fix: search the registry before buying anything that counts as
        personal property.<a href="#src-2" className="cite-ref">[2]</a> A lien stays with the
        vehicle, not the seller. Hand over cash on a car with a registered lien and you have paid
        the seller while inheriting the lender.
      </p>
      <p>
        The search runs on the serial number — the VIN you just verified — through any registry
        agent office in the province or an online search provider, typically $10 to $30 CAD, with
        results in minutes. Clean search, keep the printout with the bill of sale. If a lien
        shows, either walk, or insist on a written payout letter from the lender and pay the
        lender directly, never the seller. There is no third option worth having on a
        first classic.
      </p>

      <h2>What do AMVIC rules mean at a dealer or consignment lot?</h2>
      <p>
        Buy from an AMVIC-licensed business — and in Alberta that includes the consignment lots
        where a lot of classics end up — and the law hands you real protections. The business
        must disclose vehicle history to you in writing before the sale: fire or flood damage,
        manufacturer buyback, previous use as a police car, taxi, or rental, salvage or
        non-repairable status, and whether the vehicle ever needed collision-related repairs
        costing more than $3,000 in parts and labour.<a href="#src-3" className="cite-ref">[3]</a>{" "}
        Used vehicles from a licensed business also come with a mechanical fitness assessment —
        valid for 120 days — which describes the vehicle&rsquo;s condition. Read it for what it
        is: a disclosure document, not a pass-or-fail safety inspection, and on a fifty-year-old
        vehicle, not a substitute for your own eyes underneath.
      </p>
      <p>
        Pricing has rules too. If a licensed seller advertises a price, that price must include
        every fee and charge they intend to collect — documentation fees, administration fees,
        all of it — with only GST and financing costs allowed on top.
        <a href="#src-4" className="cite-ref">[4]</a> A consignment lot that adds a
        surprise &ldquo;admin fee&rdquo; over the advertised number on a 1972 Chevelle is
        breaking the same law a new-car store would be. And if a licensed business does you
        wrong, there is a compensation fund and an investigations arm behind the licence. A
        private sale on Marketplace or Kijiji carries none of this — no mandatory disclosure, no
        assessment, no fund. Private deals are where the bargains live, but every protection
        above becomes a check you run yourself.
      </p>

      <h2>What if the car is coming from another province?</h2>
      <p>
        Half the good candidate cars within reach of Edmonton are in BC or Saskatchewan, so plan
        for this before you fall for one. A vehicle last registered outside Alberta must pass an
        out-of-province inspection at a licensed facility, by a licensed technician, before
        Alberta will issue plates — and the certificate must reach a registry agent within 14
        days of the inspection or it expires and you start again.
        <a href="#src-5" className="cite-ref">[5]</a> Limited exemptions exist, but assume the
        inspection applies and price it, and whatever repairs it triggers, into the purchase. The
        full walkthrough — forms, costs, the order of operations, and how classics fare — is in
        the <Link href="/blog/out-of-province-inspection-edmonton">out-of-province inspection
        guide</Link>. The one-line version: the inspection is a registration hurdle, not a
        buying decision, so never let &ldquo;it just passed inspection&rdquo; in another province
        stand in for your own look underneath.
      </p>

      <h2>What does skipping the checklist actually cost?</h2>
      <p>
        Here is what the misses on this checklist typically cost to put right after the fact.
        Planning ranges in Canadian dollars, not quotes — real numbers depend on the car, the
        parts supply, and how far the trouble spread:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Common problems missed when buying a first classic car, the typical Canadian dollar
            cost to fix each one later, and what finding it before purchase should mean for the
            deal
          </caption>
          <thead>
            <tr>
              <th scope="col">What the checklist catches</th>
              <th scope="col">Typical cost to fix later (CAD)</th>
              <th scope="col">Found before buying, it means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Rusted floor and trunk pans</th>
              <td className="num">$2,500 – $6,000</td>
              <td>Bargaining chip — if the frame and rockers are clean</td>
            </tr>
            <tr>
              <th scope="row">Rotten rockers and cab corners</th>
              <td className="num">$1,500 – $4,000 per side</td>
              <td>Re-price the car; filler here usually hides more</td>
            </tr>
            <tr>
              <th scope="row">Frame rot at rails or mounts</th>
              <td className="num">$4,000 – $10,000+</td>
              <td>Walk away, unless you meant to buy a project</td>
            </tr>
            <tr>
              <th scope="row">Full repaint over hidden filler</th>
              <td className="num">$8,000 – $20,000+</td>
              <td>The shiny car is a project in a nice shirt</td>
            </tr>
            <tr>
              <th scope="row">Undisclosed lien on the vehicle</th>
              <td className="num">The purchase price, again</td>
              <td>Walk, or pay the lender directly on a payout letter</td>
            </tr>
            <tr>
              <th scope="row">Brake and fuel system refresh</th>
              <td className="num">$1,500 – $4,000</td>
              <td>Assume it on any long-parked car, and budget it</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Two honest rules fall out of that table. First, budget beyond the sticker: an honest
        driver-grade classic commonly wants 20 to 50 percent of its purchase price in the first
        year, in brakes, fuel, cooling, and tires nobody wants to buy twice. Second, know which
        car you are buying. A driver with needs and a project shell are different purchases with
        different math, and the <Link href="/blog/classic-car-restoration-timeline">restoration
        timeline article</Link> lays out what the project road really involves before you
        volunteer for it.
      </p>

      <h2>Should you pay for a pre-purchase inspection?</h2>
      <p>
        On a first classic — yes, almost without exception. Even Hagerty, whose readers skew
        experienced, recommends putting a professional between your enthusiasm and your money
        before the deal closes.<a href="#src-6" className="cite-ref">[6]</a> A shop inspection
        typically runs $150 to $500 CAD depending on depth, it puts the car on a hoist you do not
        have, and it arrives with none of your emotional attachment. One found problem pays for
        it ten times over — and a clean report is worth exactly as much when you negotiate, or
        when you sleep the night after the deal.
      </p>
      <p>
        This shop does them, deliberately. Bring the ad, or bring the car; we put it up, go
        through this checklist with a flashlight and a pick, and give you the same straight
        answer we would want buying it ourselves — including &ldquo;buy it, it&rsquo;s
        good,&rdquo; which we say more often than you would think. And if the car does turn out
        to need metal, you will know exactly what the{" "}
        <Link href="/services/classic-car-restoration">restoration work</Link> involves before
        the seller&rsquo;s number moves. Send the listing and the seller&rsquo;s story through
        the <Link href="/quote">quote page</Link>, and buy the first classic on evidence instead
        of hope.
      </p>
    </>
  );
}
