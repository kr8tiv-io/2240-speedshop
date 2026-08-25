import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Registering a Bill-of-Sale Classic in Alberta.
 * The paperwork wedge for the farm-find keyword cluster. Answers the "no
 * title" panic, walks the lien and VIN checks, and links down into the
 * out-of-province inspection article, the barn-find protocol, the
 * restoration service page, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "registering-classic-no-title-alberta",
  title:
    "Buying a Classic With No Registration: How Alberta Handles a Bill-of-Sale Car",
  accent: "Bill-of-Sale",
  metaTitle: "Register a Classic With Only a Bill of Sale in Alberta",
  description:
    "What an Alberta registry actually needs to plate a classic sold on a bill of sale alone — and the lien, VIN, and inspection problems that kill a farm-find deal.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Paperwork",
  targetKeywords: [
    "register car without title Alberta",
    "bill of sale only car Alberta",
    "no registration classic car",
    "VIN lien search Alberta",
    "out of province inspection classic car",
  ],
  faq: [
    {
      q: "Can you register a car in Alberta with only a bill of sale?",
      a: "Yes. Alberta does not issue vehicle titles — proof of ownership at the registry is a document such as a bill of sale, a lease, a probated will, or letters of administration. Bring a complete bill of sale, proof of insurance in your name, and identification to any registry agent. If the car was last registered outside Alberta, or has no Alberta record in the system, plan on an out-of-province inspection before plates are issued.",
    },
    {
      q: "How do I check a classic car for liens in Alberta?",
      a: "Search the VIN or serial number through Alberta's Personal Property Registry before money changes hands — any registry agent can run it, and online services typically charge $10 to $30 CAD. A registered lien survives the sale, which means the lender can seize the car from you even though you paid the seller in full. Search the number exactly as stamped on the car, and on pre-1981 vehicles try the short factory serial number as well.",
    },
    {
      q: "Does a barn find need an out-of-province inspection in Alberta?",
      a: "It depends on where it was last registered. A vehicle with an Alberta registration record on file can generally be re-registered on a bill of sale without an inspection, no matter how long it sat. A vehicle last registered in another province, or one with no record the agent can find, goes through the out-of-province inspection: buy the request form at a registry, pass at a licensed inspection facility, and file the certificate within 14 days of passing.",
    },
    {
      q: "What if the seller has no paperwork at all?",
      a: "Slow down before you pay. If the owner is deceased, the estate documents — a probated will or letters of administration — plus a bill of sale signed by the executor are the clean route. Where nothing exists, some registry agents will accept a statutory declaration sworn before a commissioner for oaths describing how the vehicle came into the seller's hands, but this is discretionary. Phone the registry agent first and ask exactly what they will take.",
    },
    {
      q: "Does Alberta issue vehicle titles?",
      a: "No. Alberta is a registration province: ownership is evidenced by the bill of sale chain and the registration record, not by a title certificate. That is why a no-title classic is not the problem here that it is in most American states — and why the bill of sale you write at the farm gate is the single document your ownership rests on. Write it completely, sign it in duplicate, and keep it forever.",
    },
  ],
  citations: [
    {
      name: "“Register a vehicle in Alberta,” Alberta.ca",
      url: "https://www.alberta.ca/register-vehicle",
    },
    {
      name: "“Personal property liens,” Alberta.ca",
      url: "https://www.alberta.ca/personal-property-liens",
    },
    {
      name: "Canadian Police Information Centre public search, RCMP",
      url: "https://www.cpic-cipc.ca/index-eng.htm",
    },
    {
      name: "“Out-of-province vehicle inspections,” Alberta.ca",
      url: "https://www.alberta.ca/out-of-province-vehicle-inspections",
    },
    {
      name: "“Salvage vehicle inspections,” Alberta.ca",
      url: "https://www.alberta.ca/salvage-vehicle-inspections",
    },
  ],
  internalLinks: [
    "/blog/barn-find-first-steps",
    "/blog/out-of-province-inspection-edmonton",
    "/services/classic-car-restoration",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * The paper and the plate — a hand-written bill of sale on the left, the
 * stamped serial plate on the right, an amber match-line insisting the two
 * agree character for character, and the three pre-purchase checks pinned
 * below: PPR lien search, CPIC stolen check, out-of-province inspection.
 * Editorial diagram in the shop's plate style: steel line art, mono labels,
 * sourced glow.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of a hand-written bill of sale document beside a riveted vehicle serial number plate, drawn in steel line art, with an amber match line connecting the VIN field on the paper to the stamped plate and the note that the two must agree character for character, plus three numbered checkpoint pins below for the Personal Property Registry lien search, the Canadian Police Information Centre stolen check, and the out-of-province inspection"
      className="h-auto w-full"
    >
      <title>The paper and the plate must agree — the bill-of-sale deal in one figure</title>
      <defs>
        <radialGradient id="bs-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bs-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a9ca0" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#9a9ca0" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* pool of light under the document */}
      <ellipse cx="300" cy="560" rx="280" ry="30" fill="url(#bs-pool)" />

      {/* ══ THE PAPER — bill of sale ══ */}
      <path
        d="M 130 84 L 424 84 L 470 130 L 470 540 L 130 540 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* corner fold */}
      <path d="M 424 84 L 424 130 L 470 130" fill="none" stroke="#9a9ca0" strokeWidth="1.4" strokeOpacity="0.8" />

      <text
        x="300"
        y="126"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="15"
        letterSpacing="0.3em"
        fill="#9a9ca0"
      >
        BILL OF SALE
      </text>
      <line x1="196" y1="140" x2="404" y2="140" stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.5" />

      {/* field rows: label + rule line */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.65"
      >
        <text x="158" y="182">SELLER — FULL LEGAL NAME</text>
        <text x="158" y="232">BUYER — FULL LEGAL NAME</text>
        <text x="158" y="282">YEAR / MAKE / MODEL</text>
        <text x="158" y="382">PRICE PAID (CAD)</text>
        <text x="158" y="432">DATE OF SALE</text>
        <text x="158" y="490">SIGNED — BOTH PARTIES</text>
      </g>
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.45">
        <line x1="158" y1="196" x2="442" y2="196" />
        <line x1="158" y1="246" x2="442" y2="246" />
        <line x1="158" y1="296" x2="442" y2="296" />
        <line x1="158" y1="396" x2="442" y2="396" />
        <line x1="158" y1="446" x2="442" y2="446" />
        <line x1="158" y1="504" x2="288" y2="504" />
        <line x1="312" y1="504" x2="442" y2="504" />
      </g>
      {/* signature scrawls */}
      <g stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.7" fill="none" strokeLinecap="round">
        <path d="M 168 500 Q 186 484 200 498 Q 214 510 236 494 Q 252 484 268 498" />
        <path d="M 322 500 Q 344 482 360 498 Q 374 512 400 492" />
      </g>

      {/* the VIN field — amber, the one that matters */}
      <rect x="150" y="312" width="300" height="34" fill="none" stroke="#ffb066" strokeWidth="1.4" />
      <text
        x="158"
        y="326"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#ffb066"
      >
        VIN / SERIAL NO. — EXACTLY AS STAMPED
      </text>
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7">
        <line x1="158" y1="340" x2="360" y2="340" />
      </g>

      {/* ══ THE PLATE — stamped serial plate, riveted ══ */}
      <rect x="700" y="130" width="400" height="96" rx="6" fill="url(#bs-plate)" stroke="#9a9ca0" strokeWidth="2" />
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.8">
        <circle cx="720" cy="150" r="5" />
        <circle cx="1080" cy="150" r="5" />
        <circle cx="720" cy="206" r="5" />
        <circle cx="1080" cy="206" r="5" />
      </g>
      <text
        x="900"
        y="162"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.26em"
        fill="#9a9ca0"
        fillOpacity="0.65"
      >
        SERIAL NUMBER PLATE — DOOR POST
      </text>
      {/* stamped character cells — 13, the pre-1981 nod */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.1">
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} x={742 + i * 24.5} y={176} width="18" height="26" strokeOpacity={0.7} />
        ))}
      </g>
      <g stroke="#9a9ca0" strokeWidth="1.4" strokeOpacity="0.85" strokeLinecap="round">
        <path d="M 748 196 L 754 182 M 754 182 L 758 196" />
        <path d="M 772 184 L 772 198 M 772 184 L 782 198 M 782 184 L 782 198" />
        <path d="M 799 184 L 799 198 M 799 184 L 807 184 M 799 191 L 805 191" />
        <path d="M 826 184 Q 820 184 820 191 Q 820 198 826 198" />
      </g>
      <text
        x="852"
        y="198"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="13"
        letterSpacing="0.32em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        ··········
      </text>

      {/* ══ THE MATCH LINE ══ */}
      <path
        d="M 450 329 Q 580 329 620 280 Q 660 232 700 208"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.3"
        strokeDasharray="6 5"
        strokeOpacity="0.8"
      />
      <path d="M 690 214 L 702 207 L 694 224" fill="none" stroke="#ffb066" strokeWidth="1.2" strokeLinecap="round" />
      <text
        x="600"
        y="262"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.2em"
        fill="#ffb066"
      >
        MUST AGREE
      </text>
      <text
        x="600"
        y="280"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9.5"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        CHARACTER FOR CHARACTER
      </text>

      {/* ══ THE THREE CHECKS — before money moves ══ */}
      <text
        x="700"
        y="308"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.24em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        BEFORE MONEY MOVES
      </text>
      <line x1="700" y1="318" x2="1100" y2="318" stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.35" />

      {[
        { y: 356, n: "1", l: "PPR LIEN SEARCH — BY SERIAL NUMBER", done: true },
        { y: 412, n: "2", l: "CPIC STOLEN CHECK — PUBLIC, FREE", done: true },
        { y: 468, n: "3", l: "OUT-OF-PROV INSPECTION — IF FROM AWAY", done: false },
      ].map((c) => (
        <g key={c.n}>
          <circle cx="716" cy={c.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
          <text
            x="716"
            y={c.y + 4}
            textAnchor="middle"
            fontFamily="var(--font-plex-mono), ui-monospace, monospace"
            fontSize="11"
            letterSpacing="0.08em"
            fill="#ffd9ad"
          >
            {c.n}
          </text>
          <rect
            x="744"
            y={c.y - 9}
            width="18"
            height="18"
            fill="none"
            stroke={c.done ? "#ffb066" : "#9a9ca0"}
            strokeWidth="1.2"
            strokeOpacity={c.done ? 0.9 : 0.55}
            strokeDasharray={c.done ? undefined : "3 3"}
          />
          {c.done ? (
            <path
              d={`M 748 ${c.y} L 752 ${c.y + 5} L 759 ${c.y - 6}`}
              fill="none"
              stroke="#ffb066"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          <text
            x="776"
            y={c.y + 4}
            fontFamily="var(--font-plex-mono), ui-monospace, monospace"
            fontSize="10.5"
            letterSpacing="0.16em"
            fill={c.done ? "#ffb066" : "#9a9ca0"}
            fillOpacity={c.done ? 1 : 0.7}
          >
            {c.l}
          </text>
        </g>
      ))}

      {/* the lien hook — what a live lien does to a deal */}
      <g fill="none" stroke="#ffb066" strokeOpacity="0.55" strokeLinecap="round">
        <path d="M 1090 356 Q 1112 356 1112 378 Q 1112 396 1096 396" strokeWidth="1.2" />
        <path d="M 1100 390 L 1096 396 L 1102 400" strokeWidth="1.1" />
      </g>
      <text
        x="1112"
        y="424"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9.5"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        A LIEN FOLLOWS THE CAR
      </text>

      {/* feature labels on the paper */}
      <text
        x="108"
        y="330"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#ffb066"
      >
        THE FIELD
      </text>
      <text
        x="108"
        y="346"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        DEALS DIE ON
      </text>
      <path d="M 114 336 L 148 330" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />

      {/* no-title note */}
      <text
        x="700"
        y="540"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        NO TITLE EXISTS IN ALBERTA —
      </text>
      <text
        x="700"
        y="558"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        THIS PAPER IS THE OWNERSHIP
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
        FIG. P — THE PAPER AND THE PLATE MUST AGREE
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Yes — Alberta will register a classic sold on a bill of sale alone, because Alberta has
        never issued vehicle titles at all. The registry wants a complete <strong>bill of
        sale</strong>, proof of insurance, and your ID<a href="#src-1" className="cite-ref">[1]</a>{" "}
        — and the deal only dies when a lien, a VIN problem, or a missing inspection gets there
        first.
      </p>

      <h2>Why is there no title to sign over?</h2>
      <p>
        The panic usually starts with an American buying guide. In most U.S. states the title
        certificate <strong>is</strong> the ownership, and a no-title car is a legal project in
        its own right. Alberta does not work that way. This is a registration province: the
        government keeps a record of who has the vehicle registered, and ownership itself is
        evidenced by ordinary documents — Alberta.ca lists a bill of sale, a lease, a probated
        will, or letters of administration as proof of ownership for registration.
        <a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        Two things follow from that. First, the seller&rsquo;s expired registration is not a deal
        requirement — registration lapses the moment a farmer stops buying plates, and a truck
        that has sat behind the quonset since 1993 is simply an unregistered vehicle, not a
        suspicious one. Second, the paper that matters most is the one you and the seller write at
        the tailgate. There is no title certificate backing you up. The bill of sale is the
        ownership, so write it like it matters.
      </p>
      <blockquote>
        <p>Nobody has ever lost a farm-find deal to a missing title in Alberta. Plenty have lost one to a lazy bill of sale.</p>
        <footer>Shop rule, learned the slow way</footer>
      </blockquote>

      <h2>What does the registry actually need to put plates on it?</h2>
      <p>
        Three things come to the counter: proof of ownership, proof of insurance in your name, and
        acceptable identification.<a href="#src-1" className="cite-ref">[1]</a> The registry agent
        — a private business in Alberta, which is why answers vary slightly office to office —
        creates the vehicle record from your bill of sale. A handwritten bill of sale is fine if
        it is complete. Complete means all of this, every time:
      </p>
      <ul>
        <li>Full legal names and addresses of seller and buyer — not &ldquo;Gary at the auction&rdquo;</li>
        <li>Year, make, and model of the vehicle</li>
        <li>The VIN or serial number, copied <strong>character for character from the car</strong>, not from memory or an old insurance slip</li>
        <li>The price actually paid, the date, and both signatures — two copies, one each</li>
      </ul>
      <p>
        Two upgrades cost nothing and save grief. Ask the seller for any old registration
        paperwork that exists, even expired — it ties their name to the VIN in the province&rsquo;s
        own records. And confirm the person signing is the person entitled to sell: if the owner
        is deceased, the clean route is the estate documents — a probated will or letters of
        administration — with the executor signing the bill of sale.
        <a href="#src-1" className="cite-ref">[1]</a> &ldquo;I&rsquo;m selling it for my
        brother-in-law&rdquo; is not a chain of ownership. Get the actual owner&rsquo;s signature
        or walk.
      </p>

      <h2>How do you check the VIN before money changes hands?</h2>
      <p>
        Two searches, both cheap, both before you pay. The first is a lien search through
        Alberta&rsquo;s Personal Property Registry — vehicles are exactly the kind of property the
        province tells you to search before buying, because loans get secured against them.
        <a href="#src-2" className="cite-ref">[2]</a> Any registry agent can run the serial
        number, and online services do it for roughly $10 to $30 CAD. Here is the part that
        surprises people: a registered lien <strong>survives the sale</strong>. Pay the seller in
        full, register the car, spend two winters on the bodywork — the lender can still seize it,
        because their security interest rides the serial number, not the seller. If the search
        shows a live lien, the money does not move until you see a discharge or a payout letter
        from the secured party. No exceptions, no matter how honest the seller&rsquo;s face is.
      </p>
      <p>
        The second search is free: the Canadian Police Information Centre runs a public database
        where anyone can check whether a vehicle has been reported stolen.
        <a href="#src-3" className="cite-ref">[3]</a> Thirty seconds on a phone at the farm gate.
        One wrinkle for older iron — the 17-character VIN only standardized in 1981, so a
        &rsquo;68 Meteor or a &rsquo;74 C10 carries a shorter factory serial number. Search it
        exactly as stamped, and on trucks check that the door-post plate agrees with the frame
        stamp while you are under there anyway.
      </p>

      <h2>Will a farm find need an out-of-province inspection?</h2>
      <p>
        Depends entirely on where the car was last registered. If it last wore Alberta plates and
        the VIN still pulls up an Alberta record, it can generally go back on the road on your
        bill of sale with no inspection — the province does not care that it sat for thirty
        years. But a vehicle registered outside Alberta must pass an out-of-province inspection
        before plates are issued<a href="#src-4" className="cite-ref">[4]</a> — and in practice a
        car with no findable record gets treated the same way. That catches more farm finds than
        people expect, because half the cheap classics in this province came across the
        Saskatchewan line on a borrowed trailer.
      </p>
      <p>
        The mechanics of it: buy a Request for Vehicle Inspection form at any registry (budget
        about $20 to $30), present the car at a licensed inspection facility, and get the passed
        certificate back to a registry agent within 14 days — miss that window and you start
        over.<a href="#src-4" className="cite-ref">[4]</a> Facilities set their own fees;
        $150 to $350 is the typical planning range, and a failed inspection gives you 10 days for
        repairs before re-inspection. Remember what the inspection is: a roadworthiness check. A
        genuine barn find with dead brakes and rotted fuel lines will not pass it on arrival —
        the mechanical wake-up has its own order of operations in the{" "}
        <Link href="/blog/barn-find-first-steps">barn-find first steps</Link>, and the full
        inspection walkthrough, checklist and all, is in the{" "}
        <Link href="/blog/out-of-province-inspection-edmonton">out-of-province inspection
        guide</Link>.
      </p>

      <h2>Where does a bill-of-sale deal actually die?</h2>
      <p>
        Not at the registry counter, usually. The deals that die, die at one of four specific
        places — which means all four can be checked before your cash leaves your pocket:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Five bill-of-sale purchase scenarios in Alberta compared by what the registry
            requires and the typical extra cost in Canadian dollars
          </caption>
          <thead>
            <tr>
              <th scope="col">The situation</th>
              <th scope="col">What it takes to register</th>
              <th scope="col">Typical extra cost (CAD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Last registered in Alberta, clean searches</th>
              <td>Bill of sale, insurance, ID — done at the counter</td>
              <td className="num">$0 beyond plates &amp; fees</td>
            </tr>
            <tr>
              <th scope="row">From out of province, or no record found</th>
              <td>All of the above plus the out-of-province inspection, certificate filed within 14 days</td>
              <td className="num">$170 – $380+</td>
            </tr>
            <tr>
              <th scope="row">Live lien on the serial number</th>
              <td>Discharge or payout letter from the secured party before money moves</td>
              <td className="num">The lien amount — or walk</td>
            </tr>
            <tr>
              <th scope="row">No paperwork at all — estate or lost documents</th>
              <td>Probated will or letters of administration, or a statutory declaration the agent will accept</td>
              <td className="num">$0 – $50, plus weeks</td>
            </tr>
            <tr>
              <th scope="row">VIN plate missing, altered, or not matching the paper</th>
              <td>Stop. Police-level scrutiny, an assigned VIN at best — often the end of the deal</td>
              <td className="num">Unbounded — usually walk</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The lien standoff is the most common killer, and it is covered above. The second is
        status flags: if the record shows the car was written off, a <strong>salvage</strong>{" "}
        status means repairs to standard, a Rebuilt Vehicle Work Plan, and a salvage inspection
        before the status becomes rebuilt and the car can be registered again
        <a href="#src-5" className="cite-ref">[5]</a> — and a <strong>non-repairable</strong>{" "}
        status means exactly what it says. Third is the seller who is not the owner — the estate
        with no probate, the buddy-of-a-buddy arrangement. And fourth is the VIN itself: a plate
        that is missing, re-riveted, ground off, or simply does not match the bill of sale. There
        is a process for assigning a VIN to a vehicle without one, but it runs through provincial
        and police scrutiny and takes weeks when it goes well. When the numbers do not add up and
        the seller shrugs, the price of the car is no longer the risk you are pricing.
      </p>
      <p>
        For the cars that do not hit any of that — which is most of them — the whole paperwork
        bill is small next to anything mechanical:
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$10–$30</span>
          <span className="stat-l">PPR lien search, per serial number</span>
        </div>
        <div>
          <span className="stat-v">$0</span>
          <span className="stat-l">CPIC stolen-vehicle check — public and free</span>
        </div>
        <div>
          <span className="stat-v">$150–$350</span>
          <span className="stat-l">Typical out-of-province inspection, facility sets the fee</span>
        </div>
        <div>
          <span className="stat-v">14 days</span>
          <span className="stat-l">Inspection certificate&rsquo;s shelf life at the registry</span>
        </div>
      </div>

      <h2>What if there is genuinely no paperwork at all?</h2>
      <p>
        It happens more often than you would think, and usually innocently — grandpa&rsquo;s
        coupe, grandpa gone fifteen years, nothing probated because nobody thought a dead Fairlane
        needed lawyers.
        Alberta&rsquo;s system has room for it, but the room is discretionary. Some registry
        agents will accept a statutory declaration — a sworn statement, signed before a
        commissioner for oaths, laying out how the vehicle came into the seller&rsquo;s or your
        hands. Others want the estate route done properly first. The move is unglamorous: phone
        the registry agent you plan to use, describe the situation plainly, and ask exactly what
        they will accept before you finalize anything with the seller. Ten minutes on the phone
        beats owning a car the province will not record.
      </p>
      <p>
        One habit ties this whole article together: photograph everything at the point of sale.
        The VIN plate, the frame stamp, the seller&rsquo;s signature going onto the paper, the car
        where it sat. If a question comes up at the registry in three weeks — or from a buyer in
        ten years — your phone holds the evidence a title province would have kept for you.
      </p>
      <p>
        And once the record exists and the plate is on, the paperwork story ends and the real one
        starts. When a bill-of-sale car lands at the shop for{" "}
        <Link href="/services/classic-car-restoration">restoration assessment</Link>, the numbers
        check is part of the intake — VIN plate, frame stamp, and paper read against each other
        before anything comes apart, because a discrepancy is cheaper to solve while the seller
        still answers the phone. Found something in a field between Leduc and Vegreville and want
        a straight answer on what it needs — paper and metal both? Send the photos and the story
        through the <Link href="/quote">quote page</Link>. If the paperwork side smells wrong, you
        will hear that too, before you have spent a dollar on the car.
      </p>
    </>
  );
}
