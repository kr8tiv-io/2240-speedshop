import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Alberta Vehicle Status for Project Cars.
 * The paperwork wedge for the salvage-title keyword cluster. Answers what each
 * Alberta status stamp means before money changes hands, what the rebuilt
 * inspection actually involves, and how a brand hits value and insurance.
 * Links down into the out-of-province inspection article, the barn-find
 * protocol, the restoration and metalwork service pages, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "salvage-rebuilt-status-alberta",
  title:
    "Salvage, Rebuilt, Non-Repairable: What Alberta Vehicle Status Means for a Project Car",
  accent: "Non-Repairable",
  metaTitle: "Alberta Vehicle Status: Salvage, Rebuilt, Non-Repairable",
  description:
    "What each Alberta status stamp means for a project car — which ones can legally drive again, what the rebuilt inspection takes, and how a brand hits value.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Paperwork",
  targetKeywords: [
    "salvage title Alberta",
    "rebuilt vehicle inspection Alberta",
    "non-repairable status Alberta",
    "buying a salvage classic car",
    "salvage vehicle inspection Edmonton",
  ],
  faq: [
    {
      q: "Can you register a salvage vehicle in Alberta?",
      a: "Not as it sits. Salvage status means the vehicle was written off, and Alberta will not issue registration until it passes a salvage vehicle inspection at a licensed inspection facility. The inspection verifies structural integrity and mechanical fitness, repairs must follow OEM or I-CAR methods, and the certificate you receive must be presented to a registry agent within 14 days. Pass, and the status changes to rebuilt — which can be registered and driven like any other vehicle.",
    },
    {
      q: "Can a non-repairable vehicle ever be put back on the road in Alberta?",
      a: "No. Non-repairable is permanent — the vehicle can only be sold for parts or scrap, and no inspection exists that reverses it. The status covers vehicles flooded to the bottom of the dashboard or into the major electrical systems, burned in two or more compartments, recovered from theft with the body or interior substantially stripped, or needing both cab and frame replaced. The reach goes further: the cab, frame, SRS components, and electronic ABS components from a non-repairable vehicle cannot legally be used to rebuild another vehicle.",
    },
    {
      q: "How much does a salvage vehicle inspection cost in Alberta?",
      a: "The inspection facility sets its own price, and Alberta requires those prices to be posted. Around Edmonton, a salvage inspection commonly runs $250 to $600 plus GST, with the request form from a registry agent typically $10 to $30 on top. If you show up without the required four pre-repair photographs, the facility may have to remove components to verify the repairs, which adds teardown time at shop rates. All of these are planning ranges, not quotes.",
    },
    {
      q: "Does a rebuilt title hurt a classic car's value and insurance?",
      a: "Yes, permanently — the rebuilt brand follows the vehicle for the rest of its life. On resale, expect offers commonly 20 to 40 percent below a clean-title twin, with a thorough photo and receipt file shrinking that gap. On insurance, coverage availability varies by insurer and by how bad the original damage was; some limit endorsements or optional coverages on branded vehicles. Call your insurer — and your collector-policy provider, if the car qualifies — before you buy, not after.",
    },
    {
      q: "How do I check a vehicle's status before buying in Alberta?",
      a: "Pull a Vehicle Information Report with the VIN — online through Alberta eServices or at any registry agent, typically $20 to $35. It shows the vehicle's current status (active, salvage, rebuilt, non-repairable), its Alberta registration history, and the number of liens registered against it in Alberta. It covers Alberta records only, so on a car that has lived in other provinces, add a national history report. Pull it before money changes hands, every time.",
    },
  ],
  citations: [
    {
      name: "Vehicle Inspection Regulation, Alta. Reg. 211/2006 (office consolidation), Alberta King's Printer",
      url: "https://kings-printer.alberta.ca/documents/Regs/2006_211.pdf",
    },
    {
      name: "“Salvage vehicle inspections,” Government of Alberta",
      url: "https://www.alberta.ca/salvage-vehicle-inspections",
    },
    {
      name: "“Guide to Completing a Rebuilt Vehicle Work Plan” (TSSRVWP2009), Alberta Transportation",
      url: "https://www.transportation.alberta.ca/Content/docType41/Production/appreveh.pdf",
    },
    {
      name: "“Vehicle information report,” Government of Alberta",
      url: "https://www.alberta.ca/vehicle-information-report",
    },
    {
      name: "“Rebuilt Title & Car Insurance,” TD Insurance",
      url: "https://www.tdinsurance.com/products-services/auto-car-insurance/tips-advice/rebuilt-car-insurance",
    },
  ],
  internalLinks: [
    "/blog/out-of-province-inspection-edmonton",
    "/blog/barn-find-first-steps",
    "/services/body-paint-metalwork",
    "/services/classic-car-restoration",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * The paper trail as a plate diagram: a written-off classic on the left, its
 * motor vehicle record in the middle, and the two roads out — SALVAGE through
 * the inspection gate to REBUILT and back onto the road, or NON-REPAIRABLE
 * down to the parts crate with no way back. A dashed waterline at dashboard
 * height marks the flood rule. Steel line art, tungsten stamps, mono labels.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Flow diagram of Alberta vehicle status for a project car: a written-off classic car in steel line art with a dashed waterline at dashboard height, its motor vehicle record card, then two routes — a salvage stamp passing through a salvage vehicle inspection checklist gate to a rebuilt stamp and a road marked brand for life, and a non-repairable stamp dropping to a parts crate marked parts or scrap with no way back, noting that the cab, frame, SRS, and ABS components are banned as donor parts"
      className="h-auto w-full"
    >
      <title>Three stamps, two roads, one point of no return — Alberta status for a project car</title>
      <defs>
        <radialGradient id="sv-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the record card */}
      <ellipse cx="520" cy="470" rx="330" ry="36" fill="url(#sv-pool)" />

      {/* ══ THE WRITE-OFF — classic coupe, side profile ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* body */}
        <path d="M 74 404 L 74 380 Q 74 362 96 358 L 138 350 Q 168 310 212 306 L 268 306 Q 300 310 318 348 L 356 356 Q 376 360 376 378 L 376 404" />
        {/* rockers between wheel cutouts */}
        <path d="M 74 404 L 102 404 M 176 404 L 288 404 M 358 404 L 376 404" />
        {/* wheel cutouts */}
        <path d="M 102 404 A 37 37 0 0 1 176 404" />
        <path d="M 288 404 A 35 35 0 0 1 358 404" />
      </g>
      {/* wheels */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6">
        <circle cx="139" cy="404" r="24" />
        <circle cx="139" cy="404" r="8" strokeOpacity="0.6" />
        <circle cx="323" cy="404" r="24" />
        <circle cx="323" cy="404" r="8" strokeOpacity="0.6" />
      </g>
      {/* greenhouse + door line */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.75" strokeLinecap="round">
        <path d="M 152 350 Q 176 316 214 312 L 262 312 Q 292 316 308 348" />
        <line x1="228" y1="312" x2="228" y2="402" />
      </g>
      {/* ground line */}
      <line x1="52" y1="430" x2="398" y2="430" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" />

      {/* front-hit crumple burst */}
      <g stroke="#ffb066" strokeWidth="1.4" strokeOpacity="0.85" fill="none" strokeLinecap="round">
        <path d="M 356 340 L 344 352 L 358 358 L 346 370" />
        <path d="M 372 332 L 384 322 M 380 348 L 394 344 M 376 366 L 390 372" />
      </g>

      {/* flood waterline at dashboard height */}
      <line
        x1="56"
        y1="352"
        x2="404"
        y2="352"
        stroke="#ffb066"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeDasharray="5 5"
      />
      <path
        d="M 428 330 Q 416 350 428 360 Q 440 350 428 330"
        fill="#ffb066"
        fillOpacity="0.14"
        stroke="#ffb066"
        strokeWidth="1.2"
      />
      <text
        x="56"
        y="340"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#ffb066"
        fillOpacity="0.8"
      >
        WATER TO THE DASH = NON-REPAIRABLE
      </text>

      {/* ══ THE MOTOR VEHICLE RECORD ══ */}
      <rect x="470" y="300" width="160" height="118" rx="4" fill="#0a0a0b" stroke="#9a9ca0" strokeWidth="1.6" />
      <text
        x="550"
        y="326"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
      >
        MOTOR VEHICLE
      </text>
      <text
        x="550"
        y="340"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
      >
        RECORD
      </text>
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.45">
        <line x1="486" y1="356" x2="614" y2="356" />
        <line x1="486" y1="370" x2="596" y2="370" />
      </g>
      <text
        x="486"
        y="396"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.14em"
        fill="#ffd9ad"
      >
        STATUS: ?
      </text>
      <line x1="486" y1="404" x2="560" y2="404" stroke="#ffb066" strokeWidth="1.2" strokeOpacity="0.7" />

      {/* arrow: car -> record */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <line x1="408" y1="376" x2="462" y2="364" />
        <path d="M 452 358 L 464 364 L 452 370" />
      </g>

      {/* ══ UPPER ROAD — SALVAGE -> INSPECTION -> REBUILT -> ROAD ══ */}
      {/* record -> salvage stamp */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <path d="M 592 296 Q 600 220 646 204" />
        <path d="M 636 200 L 649 203 L 641 214" />
      </g>
      {/* SALVAGE stamp */}
      <g>
        <rect x="656" y="176" width="140" height="48" rx="6" fill="none" stroke="#ffb066" strokeWidth="1.6" />
        <rect x="662" y="182" width="128" height="36" rx="4" fill="none" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" />
        <text
          x="726"
          y="206"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="13"
          letterSpacing="0.22em"
          fill="#ffd9ad"
        >
          SALVAGE
        </text>
      </g>
      {/* salvage -> inspection gate */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <line x1="800" y1="200" x2="850" y2="200" />
        <path d="M 842 194 L 854 200 L 842 206" />
      </g>
      {/* inspection gate — checklist plate */}
      <rect x="858" y="140" width="118" height="122" rx="4" fill="#0a0a0b" stroke="#9a9ca0" strokeWidth="1.6" />
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2">
        <rect x="872" y="158" width="12" height="12" />
        <rect x="872" y="182" width="12" height="12" />
        <rect x="872" y="206" width="12" height="12" />
      </g>
      <g fill="none" stroke="#ffb066" strokeWidth="1.4" strokeLinecap="round">
        <path d="M 874 164 L 878 169 L 884 159" />
        <path d="M 874 188 L 878 193 L 884 183" />
        <path d="M 874 212 L 878 217 L 884 207" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5">
        <line x1="892" y1="164" x2="962" y2="164" />
        <line x1="892" y1="188" x2="962" y2="188" />
        <line x1="892" y1="212" x2="950" y2="212" />
      </g>
      <text
        x="917"
        y="246"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9.5"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.75"
      >
        OEM / I-CAR
      </text>
      {/* fail loop back to repairs */}
      <g stroke="#9a9ca0" strokeWidth="0.9" strokeOpacity="0.45" fill="none" strokeLinecap="round">
        <path d="M 900 132 Q 848 100 796 128" strokeDasharray="3 5" />
        <path d="M 804 120 L 794 129 L 806 133" />
      </g>
      <text
        x="848"
        y="96"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9.5"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FAIL — BACK TO THE BENCH
      </text>
      {/* inspection -> rebuilt, the 14-day certificate leg */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <line x1="980" y1="200" x2="1024" y2="200" />
        <path d="M 1016 194 L 1028 200 L 1016 206" />
      </g>
      <text
        x="1002"
        y="186"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9.5"
        letterSpacing="0.12em"
        fill="#ffb066"
        fillOpacity="0.8"
      >
        14 DAYS
      </text>
      {/* REBUILT stamp */}
      <g>
        <rect x="1032" y="176" width="126" height="48" rx="6" fill="none" stroke="#9a9ca0" strokeWidth="1.6" />
        <text
          x="1095"
          y="206"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="13"
          letterSpacing="0.22em"
          fill="#f0f0f2"
        >
          REBUILT
        </text>
      </g>
      {/* the road out */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.3" strokeLinecap="round">
        <path d="M 1050 300 L 1088 240 M 1140 300 L 1112 240" strokeOpacity="0.7" />
        <path d="M 1096 296 L 1098 284 M 1100 272 L 1102 260 M 1104 250 L 1105 244" strokeOpacity="0.5" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" fill="none" strokeLinecap="round">
        <path d="M 1095 228 L 1095 236" />
        <path d="M 1090 232 L 1095 238 L 1100 232" />
      </g>
      <text
        x="1096"
        y="322"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.7"
      >
        REGISTERED — BRAND FOR LIFE
      </text>

      {/* ══ LOWER ROAD — NON-REPAIRABLE -> PARTS CRATE ══ */}
      {/* record -> non-repairable stamp */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <path d="M 592 422 Q 600 488 644 502" />
        <path d="M 634 504 L 647 503 L 640 492" />
      </g>
      {/* NON-REPAIRABLE stamp — heavier, double struck */}
      <g>
        <rect x="654" y="482" width="212" height="48" rx="6" fill="none" stroke="#ffb066" strokeWidth="2" />
        <rect x="660" y="488" width="200" height="36" rx="4" fill="none" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" />
        <text
          x="760"
          y="512"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="13"
          letterSpacing="0.18em"
          fill="#ffd9ad"
        >
          NON-REPAIRABLE
        </text>
      </g>
      {/* non-repairable -> crate */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <line x1="870" y1="506" x2="920" y2="506" />
        <path d="M 912 500 L 924 506 L 912 512" />
      </g>
      {/* parts crate — isometric cube with slats */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M 932 486 L 992 470 L 1052 486 L 992 502 Z" />
        <path d="M 932 486 L 932 540 L 992 556 L 992 502" />
        <path d="M 1052 486 L 1052 540 L 992 556" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="0.9" strokeOpacity="0.5" fill="none">
        <line x1="932" y1="504" x2="992" y2="520" />
        <line x1="932" y1="522" x2="992" y2="538" />
        <line x1="992" y1="520" x2="1052" y2="504" />
        <line x1="992" y1="538" x2="1052" y2="522" />
      </g>
      {/* no way back */}
      <g stroke="#ffb066" strokeWidth="1.4" strokeOpacity="0.85" fill="none" strokeLinecap="round">
        <line x1="1078" y1="492" x2="1102" y2="516" />
        <line x1="1102" y1="492" x2="1078" y2="516" />
      </g>
      <text
        x="992"
        y="586"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.7"
      >
        PARTS OR SCRAP — NO WAY BACK
      </text>
      <text
        x="760"
        y="556"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9.5"
        letterSpacing="0.12em"
        fill="#ffb066"
        fillOpacity="0.7"
      >
        CAB · FRAME · SRS · ABS — BANNED AS DONOR PARTS
      </text>

      {/* feature labels */}
      <text
        x="226"
        y="272"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        THE WRITE-OFF
      </text>
      <text
        x="550"
        y="446"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        PULL THE VIR FIRST
      </text>
      <text
        x="917"
        y="126"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        SALVAGE VEHICLE INSPECTION
      </text>

      {/* plate caption */}
      <text
        x="600"
        y="638"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. P — THREE STAMPS, TWO ROADS, ONE POINT OF NO RETURN
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Alberta stamps a vehicle record one of four ways. <strong>Active</strong> is a normal car.{" "}
        <strong>Salvage</strong> means written off but legally rebuildable — pass a salvage
        inspection and it becomes <strong>rebuilt</strong>, registerable for life with the brand
        attached. <strong>Non-repairable</strong> means parts or scrap, permanently — no
        inspection exists that brings it back. Check the stamp before any money moves.
      </p>

      <h2>What do Alberta&rsquo;s vehicle status stamps actually mean?</h2>
      <p>
        Every vehicle in the provincial system carries a status on its motor vehicle record,
        assigned under Alberta&rsquo;s Vehicle Inspection Regulation.
        <a href="#src-1" className="cite-ref">[1]</a> For a project-car buyer, the status is the
        single most important line on the paperwork, because it decides three things at once:
        whether the car can ever be registered, what hoops stand between you and a licence plate,
        and what the car is worth when you are done. Here is the whole system in one table:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Alberta vehicle statuses — active, salvage, rebuilt, and non-repairable — compared by
            whether the vehicle can be registered, what the status tells a buyer, and what a
            project-car buyer should do about it
          </caption>
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Can it be registered?</th>
              <th scope="col">What it tells you</th>
              <th scope="col">Your move</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Active</th>
              <td>Yes, normally</td>
              <td>No Alberta write-off on record</td>
              <td>Verify liens, then negotiate on condition</td>
            </tr>
            <tr>
              <th scope="row">Salvage</th>
              <td>Not until it passes inspection</td>
              <td>Written off — an insurer paid out on it</td>
              <td>Price in the inspection and the permanent brand</td>
            </tr>
            <tr>
              <th scope="row">Rebuilt</th>
              <td>Yes</td>
              <td>Was salvage, passed the inspection</td>
              <td>Ask for the work plan, photos, and receipts</td>
            </tr>
            <tr>
              <th scope="row">Non-repairable</th>
              <td>Never</td>
              <td>Parts or scrap only, anywhere, forever</td>
              <td>Buy it only as a parts donor — priced like one</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        There is also an <strong>unsafe</strong> flag the Registrar can put on a vehicle, and it
        clears through the same salvage inspection route.<a href="#src-1" className="cite-ref">[1]</a>{" "}
        You will not see it often on a classic, but if it turns up, treat the car exactly like a
        salvage purchase.
      </p>

      <h2>How does a project car end up with salvage status?</h2>
      <p>
        An insurance company writes it off. Under the regulation, a vehicle becomes salvage when
        an insurer replaces it, or pays out its pre-damage value under a policy — whether or not
        the insurer takes ownership afterward.<a href="#src-1" className="cite-ref">[1]</a> That
        detail matters in Alberta more than most places, because hail does a lot of the writing
        off here. A straight, running classic can total out on dents alone after one June storm,
        which is exactly the kind of salvage car worth a second look: cosmetic damage, honest
        drivetrain, big discount.
      </p>
      <p>
        Two wrinkles catch project buyers. First, brands travel. A vehicle declared salvage in
        another province is deemed salvage when it comes to Alberta
        <a href="#src-1" className="cite-ref">[1]</a> — you cannot launder a British
        Columbia write-off by dragging it across the border, and a clean out-of-province car still
        needs its own <Link href="/blog/out-of-province-inspection-edmonton">out-of-province
        inspection</Link> before Alberta will register it. Second, absence of a brand is not proof
        of a clean past. A 1969 pickup that has sat in a Wetaskiwin shelterbelt since 1994
        usually shows no status at all — it predates the electronic trail, and its record may
        simply read as long-expired. That car is not salvage; it is just unregistered, which is a
        far easier road. The point of checking is knowing which road you are on before you pay.
      </p>
      <p>
        And the brand is a one-way valve. Once a vehicle passes inspection and becomes rebuilt,
        that status follows it for the rest of its useful life — it never reverts to active.
        <a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <blockquote>
        <p>The stamp never comes off. Price the car like it, insure it like it, and be ready to sell it like it.</p>
        <footer>Shop rule, applied before every salvage purchase</footer>
      </blockquote>

      <h2>Can a non-repairable car ever drive again?</h2>
      <p>
        No. This is the status that ends the conversation, and it is worth knowing the list that
        earns it. A salvage vehicle is declared non-repairable when it has no resale value except
        as parts or scrap — including a vehicle immersed to the bottom of the dashboard or deep
        enough to reach major electrical components, burned in two or more compartments or hot
        enough to affect high-strength steel, recovered from theft with substantially all the body
        or interior stripped, or, on a full-frame vehicle, damaged badly enough to need both cab
        and frame replaced.<a href="#src-1" className="cite-ref">[1]</a> Flood cars are the trap
        to respect most: a dry, detailed interior hides water history well, and water to the dash
        is a permanent death sentence, not a repair estimate.
      </p>
      <p>
        The status reaches beyond the vehicle itself. The cab, frame, SRS components, electronic
        ABS components, and other electronic safety components from a non-repairable vehicle
        cannot legally be used to rebuild another vehicle.
        <a href="#src-3" className="cite-ref">[3]</a> So that cheap &ldquo;parts truck&rdquo; with
        the perfect cab is only a donor for the parts the rules allow — and if your quiet plan was
        to register the parts truck itself someday, the status already decided otherwise. Before
        you start any rebuild, or cut anything off a donor, pull a Vehicle Information Report from
        a registry agent and read the status line<a href="#src-4" className="cite-ref">[4]</a> —
        the government&rsquo;s own rebuild guide tells you to do exactly that,
        <a href="#src-3" className="cite-ref">[3]</a> because rebuilding a vehicle that turns out
        to be non-repairable is money poured straight down the drain.
      </p>

      <h2>What does the rebuilt vehicle inspection involve in Alberta?</h2>
      <p>
        The salvage inspection is a documentation exam as much as a mechanical one, and most
        failures are paperwork failures. The sequence that works:
      </p>
      <ol>
        <li>
          <strong>Photograph the car before you touch it.</strong> Four colour photos — front,
          rear, both sides — taken before the rebuild. Show up without them and the inspection
          facility may have to remove components to verify your repairs, at extra cost.
          <a href="#src-3" className="cite-ref">[3]</a>
        </li>
        <li>
          <strong>Complete the Rebuilt Vehicle Work Plan.</strong> The government form describes
          the damage, your repair procedure, and every major component used — with supplier,
          invoice number, and the donor vehicle&rsquo;s VIN.<a href="#src-3" className="cite-ref">[3]</a>{" "}
          Keep every receipt. This is where a disciplined build folder pays for itself.
        </li>
        <li>
          <strong>Repair to a published standard.</strong> Any damage affecting occupant
          protection, collision management, or structural integrity must be repaired using OEM or
          I-CAR methods — not whatever a buddy with a MIG welder felt like on a Saturday.
          <a href="#src-2" className="cite-ref">[2]</a> Structural metal is the part of a rebuild
          worth paying a professional for; it is the core of what our{" "}
          <Link href="/services/body-paint-metalwork">metal and body work</Link> exists to do.
        </li>
        <li>
          <strong>Leave the evidence visible.</strong> No seam sealer, soundproofing, or rust
          proofing over welds or assembly joints before the inspection — the technician has to
          see the joinery.<a href="#src-3" className="cite-ref">[3]</a> Paint the pretty stuff
          after the certificate, not before.
        </li>
        <li>
          <strong>Book a licensed facility, then move fast.</strong> Buy the inspection request
          from a registry agent, present everything at a licensed Salvage Vehicle Inspection
          Facility, and budget up to four hours of inspection time covering both structure and
          mechanical fitness. Pass, and the certificate must be back at a registry within 14 days
          — miss the window and the vehicle gets inspected all over again.
          <a href="#src-2" className="cite-ref">[2]</a>
        </li>
      </ol>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$250–$600</span>
          <span className="stat-l">Typical salvage inspection, Edmonton-area facility, plus GST</span>
        </div>
        <div>
          <span className="stat-v">$20–$35</span>
          <span className="stat-l">Vehicle Information Report — the cheapest insurance in this article</span>
        </div>
        <div>
          <span className="stat-v">14 days</span>
          <span className="stat-l">Certificate life — inspection to registry counter</span>
        </div>
        <div>
          <span className="stat-v">20–40%</span>
          <span className="stat-l">Common resale discount a rebuilt brand carries versus clean title</span>
        </div>
      </div>
      <p>
        Facilities set their own inspection prices and must post them, so the dollar figures above
        are planning ranges in Canadian dollars, not quotes — phone two or three facilities before
        you book.<a href="#src-2" className="cite-ref">[2]</a>
      </p>

      <h2>How does a rebuilt brand hit value and insurance?</h2>
      <p>
        Permanently, and in both pockets. On value: a rebuilt classic sells against its clean-title
        twin, and the market discounts it — commonly by a fifth to a third or more, depending on
        the car, the damage, and the documentation. The one lever you control is paper. A rebuild
        backed by the original work plan, the before photos, receipts, and the inspection
        certificate sells at the small end of the discount; a rebuilt title with a shrug behind it
        sells at the large end, or not at all.
      </p>
      <p>
        On insurance: coverage for a rebuilt vehicle is more complicated than for a clean one, and
        the availability of certain coverages and endorsements can vary with the extent of the
        original damage and the insurer&rsquo;s own guidelines. The standing advice from insurers
        themselves is to get the car professionally inspected and confirm the coverage you want
        before you buy.<a href="#src-5" className="cite-ref">[5]</a> For a classic, ask the
        agreed-value collector-policy question early — some collector programs are choosy about
        brands, and a salvage classic you cannot insure at its restored value is a build with a
        hole in the bottom of it.
      </p>

      <h2>Should you buy a salvage classic?</h2>
      <p>
        Sometimes — with open eyes and a calculator. The case for it: a hail total or a light hit
        on an otherwise honest car can be the cheapest entry into a model you could not touch at
        clean-title money, and if the car is headed into a{" "}
        <Link href="/services/classic-car-restoration">full restoration</Link> anyway, most of
        what the inspection wants — documented structural repair, receipts, photographs — is work
        a proper restoration produces as a matter of course. The case against: flood cars, fire
        cars, anything non-repairable at any price, and any seller who gets vague when you ask for
        the status or the damage photos.
      </p>
      <p>
        The buying drill takes an afternoon. Get the VIN off the car itself — not the ad. Pull the
        Vehicle Information Report, typically $20 to $35, and read the status and the Alberta lien
        count; remember it covers Alberta records only, so a car with out-of-province history
        needs a national history report on top.<a href="#src-4" className="cite-ref">[4]</a> Then
        run the math in one line: purchase price, plus honest repair costs, plus inspection and
        registration, should land meaningfully under clean-title market value after the 20 to 40
        percent brand discount — because that discounted number is what you will own. If the car
        has been sitting for years on top of everything else, the{" "}
        <Link href="/blog/barn-find-first-steps">barn-find first steps</Link> apply before any of
        the paperwork does.
      </p>
      <p>
        If the math holds and the status is clean enough to build on, the structural repair,
        the documentation, and the inspection prep are all work this shop does with the registry
        rules in mind. Send the VIN, the status line, and a few photos through the{" "}
        <Link href="/quote">quote page</Link> and you will get a straight answer — including,
        when the stamp says so, the answer that the car is a parts donor and your money belongs
        in a better shell.
      </p>
    </>
  );
}
