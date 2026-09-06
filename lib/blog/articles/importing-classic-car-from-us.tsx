import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Importing a Classic From the US.
 * The border-math pillar for the import keyword cluster. Two clocks carry the
 * whole article: 15 years buys you past the RIV, 25 years buys you past the
 * cashier. Links down into the OOP inspection article, the C10 guide, the
 * restoration and body service pages, and the quote page. Every regulatory
 * claim verified against Transport Canada, CBSA memoranda D10-15-20 and
 * D19-12-1, Customs Notice 25-15, US CBP, and Alberta.ca, August 2026.
 */

export const meta: ArticleMeta = {
  slug: "importing-classic-car-from-us",
  title:
    "Importing a Classic From the US Into Alberta: Duty, GST, and the 15-Year Rule",
  accent: "15-Year",
  metaTitle: "Importing a US Classic Into Alberta",
  description: "The full border math on a US classic — the 15-year RIV exemption, the 25-year duty-free line, GST at the booth, Form 1, and the Alberta inspection that gets you",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Paperwork",
  targetKeywords: [
    "importing a classic car from USA to Canada",
    "classic car import duty Canada",
    "RIV exemption 15 years",
    "US car import Alberta",
  ],
  faq: [
    {
      q: "Do I have to pay duty on a classic car imported from the US?",
      a: "Not if it is genuinely old. A vehicle manufactured more than 25 years before the date of importation enters duty-free under tariff item 9966.00.00, no matter what country built it, and as of this writing the 2025 surtax on US vehicles no longer applies to that tariff item either. Between 15 and 25 years old the picture changes: duty is zero only for North American-built vehicles with proof of origin, 6.1 per cent otherwise, and US-origin vehicles in that band can attract the 25 per cent surtax. GST of 5 per cent applies at any age.",
    },
    {
      q: "What is the 15-year rule for importing cars to Canada?",
      a: "Vehicles older than 15 years, counted from the actual month and year of manufacture rather than the model year, are not regulated by the Motor Vehicle Safety Act at the time of importation. That means no Registrar of Imported Vehicles program, no RIV fee, no federal inspection, and no compliance modifications. The vehicle still clears CBSA at the border, still pays applicable taxes, and still has to pass Alberta's own out-of-province inspection before it gets plates.",
    },
    {
      q: "How much does it cost to import a classic car from the US to Canada?",
      a: "On a 25-plus-year-old classic, plan for 5 per cent GST on the Canadian-dollar value, a $100 federal excise tax if the car has air conditioning, a few hundred dollars for a customs broker to file the US export paperwork, roughly $1,500 to $3,500 CAD for open transport from the southern US to Edmonton, and an out-of-province inspection commonly in the $130 to $190 range once it is here. All of those are planning ranges in Canadian dollars, not quotes, and the exchange rate on the purchase itself is usually the biggest number on the page.",
    },
    {
      q: "Does a US import need an inspection in Alberta?",
      a: "Yes. Before Alberta issues plates, the vehicle needs an out-of-province inspection performed at a licensed facility by a journeyperson technician. You buy a Request for Vehicle Inspection Form at any registry, present it with the vehicle, and if the car fails you have 10 days to complete repairs before a full re-inspection is required. A passed certificate must be presented to a registry agent within 14 days of issue or the inspection has to be done again.",
    },
    {
      q: "Can I drive the car home from the US instead of trailering it?",
      a: "You can, but the paperwork does not move at driving speed. US Customs and Border Protection requires the title paperwork to be submitted to the export port at least 72 hours before the vehicle crosses, so the clock has to start before the trip does. You also need insurance that covers the car in both countries and a temporary permit to move it once it is imported and uninspected in Alberta. Most buyers put a classic on a transport truck and let the paperwork ride ahead of it.",
    },
  ],
  citations: [
    {
      name: "“Importing Older Vehicles into Canada,” Transport Canada",
      url: "https://tc.canada.ca/en/road-transportation/importing-vehicle/importing-older-vehicles-canada",
    },
    {
      name: "Memorandum D10-15-20: Interpretation of Tariff Item 9966.00.00, Canada Border Services Agency",
      url: "https://www.cbsa-asfc.gc.ca/publications/dm-md/d10/d10-15-20-eng.html",
    },
    {
      name: "Customs Notice 25-15: United States Surtax Order (Motor Vehicles 2025), Canada Border Services Agency",
      url: "https://www.cbsa-asfc.gc.ca/publications/cn-ad/cn25-15-eng.html",
    },
    {
      name: "Memorandum D19-12-1: Importing Vehicles into Canada, Canada Border Services Agency",
      url: "https://www.cbsa-asfc.gc.ca/publications/dm-md/d19/d19-12-1-eng.html",
    },
    {
      name: "“Exporting a Motor Vehicle,” US Customs and Border Protection",
      url: "https://www.cbp.gov/trade/basic-import-export/export-docs/motor-vehicle",
    },
    {
      name: "“Out-of-Province Vehicle Inspections,” Government of Alberta, Alberta.ca",
      url: "https://www.alberta.ca/out-of-province-vehicle-inspections",
    },
  ],
  internalLinks: [
    "/blog/out-of-province-inspection-edmonton",
    "/blog/c10-square-body-alberta-guide",
    "/services/body-paint-metalwork",
    "/services/classic-car-restoration",
    "/quote",
  ],
  readingMinutes: 10,
};

/**
 * The border crossing as a diagram — a classic coupe approaching the Coutts
 * booth from the Montana side, two gauge dials above it (the 15-year safety
 * clock and the 25-year money clock, both needles past the mark), a 72-hour
 * export clock on the US side, and the paper stack that comes out the other
 * end: Form 1, the GST receipt, the inspection certificate. Steel line art,
 * tungsten accents, every label mono.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Diagram of a classic coupe crossing the Canada-US border at Coutts, Alberta, with two gauge dials above it marking the 15-year safety clock for the RIV exemption and the 25-year money clock for duty-free entry, a 72-hour clock on the US side for the export filing, and a stack of documents on the Canadian side labelled Form 1, GST paid at the booth, and the out-of-province inspection certificate"
      className="h-auto w-full"
    >
      <title>Two clocks, one booth — 15 gets you in, 25 gets you in free</title>
      <defs>
        <radialGradient id="im-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the crossing */}
      <ellipse cx="600" cy="540" rx="380" ry="36" fill="url(#im-pool)" />

      {/* the border line itself */}
      <line
        x1="600"
        y1="86"
        x2="600"
        y2="514"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeDasharray="4 8"
      />

      {/* road */}
      <line x1="70" y1="520" x2="1130" y2="520" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round">
        <line x1="100" y1="536" x2="180" y2="536" strokeDasharray="14 18" />
        <line x1="240" y1="536" x2="1100" y2="536" strokeDasharray="14 18" />
      </g>

      {/* ══ THE BOOTH ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round" strokeLinejoin="round">
        {/* kiosk */}
        <rect x="612" y="330" width="86" height="190" strokeWidth="2" />
        <rect x="624" y="352" width="62" height="44" strokeWidth="1.2" strokeOpacity="0.75" />
        {/* canopy */}
        <line x1="596" y1="330" x2="714" y2="330" strokeWidth="2" />
        <line x1="588" y1="316" x2="722" y2="316" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="596" y1="330" x2="588" y2="316" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="714" y1="330" x2="722" y2="316" strokeWidth="1.2" strokeOpacity="0.7" />
      </g>
      {/* barrier arm, raised */}
      <line x1="612" y1="470" x2="540" y2="360" stroke="#ffb066" strokeWidth="2.4" strokeLinecap="round" />
      <g stroke="#0a0a0b" strokeWidth="2.4" strokeLinecap="round">
        <line x1="594" y1="442" x2="588" y2="434" />
        <line x1="576" y1="415" x2="570" y2="407" />
        <line x1="558" y1="388" x2="552" y2="380" />
      </g>
      <circle cx="612" cy="470" r="5" fill="none" stroke="#9a9ca0" strokeWidth="1.4" />
      <text
        x="655"
        y="308"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.7"
      >
        CBSA — COUTTS, AB
      </text>

      {/* ══ THE CAR — long-hood coupe, heading for the booth ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* body: trunk › roof › hood › nose, left to right */}
        <path d="M 154 492 L 150 466 Q 150 452 168 448 L 232 438 Q 254 404 296 398 L 380 392 Q 424 392 448 412 L 486 438 L 512 444 Q 528 448 528 462 L 526 486 Q 526 494 516 494 L 496 494" />
        {/* rocker between the wheels */}
        <line x1="330" y1="494" x2="404" y2="494" />
        <line x1="154" y1="492" x2="238" y2="494" />
        {/* greenhouse */}
        <path d="M 250 438 Q 268 410 300 406 L 366 402 Q 396 402 414 418 L 434 436" strokeWidth="1.2" strokeOpacity="0.75" />
        <line x1="330" y1="404" x2="332" y2="438" strokeWidth="1.2" strokeOpacity="0.75" />
        {/* beltline crease */}
        <line x1="176" y1="452" x2="502" y2="452" strokeWidth="1" strokeOpacity="0.5" />
      </g>
      {/* bumpers */}
      <g stroke="#9a9ca0" strokeWidth="2.4" strokeOpacity="0.85" strokeLinecap="round">
        <line x1="146" y1="474" x2="160" y2="474" />
        <line x1="520" y1="472" x2="534" y2="472" />
      </g>
      {/* wheels */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2">
        <circle cx="284" cy="494" r="28" />
        <circle cx="450" cy="494" r="28" />
      </g>
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7">
        <circle cx="284" cy="494" r="9" />
        <circle cx="450" cy="494" r="9" />
      </g>
      {/* motion dashes */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.45" strokeLinecap="round">
        <line x1="86" y1="452" x2="122" y2="452" strokeDasharray="10 8" />
        <line x1="94" y1="474" x2="126" y2="474" strokeDasharray="10 8" />
      </g>
      {/* the crossing path */}
      <path
        d="M 548 468 Q 610 452 672 462 L 736 474"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.2"
        strokeOpacity="0.6"
        strokeDasharray="4 6"
      />
      <path d="M 728 466 L 740 475 L 726 479" fill="none" stroke="#ffb066" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />

      {/* ══ THE TWO CLOCKS ══ */}
      {/* 15-year safety clock */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6">
        <circle cx="196" cy="170" r="56" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round">
        <line x1="196" y1="118" x2="196" y2="128" />
        <line x1="248" y1="170" x2="238" y2="170" />
        <line x1="196" y1="222" x2="196" y2="212" />
        <line x1="144" y1="170" x2="154" y2="170" />
      </g>
      {/* the 15 mark, and the needle past it */}
      <line x1="232" y1="132" x2="240" y2="124" stroke="#ffb066" strokeWidth="2" strokeLinecap="round" />
      <line x1="196" y1="170" x2="238" y2="146" stroke="#ffb066" strokeWidth="2" strokeLinecap="round" />
      <circle cx="196" cy="170" r="4" fill="#ffb066" />
      <text
        x="196"
        y="252"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
        fill="#ffb066"
      >
        15 YR — SAFETY CLOCK
      </text>
      <text
        x="196"
        y="270"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        PAST IT — NO RIV
      </text>

      {/* 25-year money clock */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6">
        <circle cx="392" cy="150" r="56" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round">
        <line x1="392" y1="98" x2="392" y2="108" />
        <line x1="444" y1="150" x2="434" y2="150" />
        <line x1="392" y1="202" x2="392" y2="192" />
        <line x1="340" y1="150" x2="350" y2="150" />
      </g>
      <line x1="428" y1="112" x2="436" y2="104" stroke="#ffb066" strokeWidth="2" strokeLinecap="round" />
      <line x1="392" y1="150" x2="434" y2="126" stroke="#ffb066" strokeWidth="2" strokeLinecap="round" />
      <circle cx="392" cy="150" r="4" fill="#ffb066" />
      <text
        x="392"
        y="232"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
        fill="#ffb066"
      >
        25 YR — MONEY CLOCK
      </text>
      <text
        x="392"
        y="250"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        PAST IT — 9966, $0 DUTY
      </text>

      {/* 72-hour export clock, US side */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.4">
        <circle cx="512" cy="286" r="30" />
      </g>
      <line x1="512" y1="286" x2="512" y2="264" stroke="#ffb066" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="512" y1="286" x2="528" y2="292" stroke="#ffb066" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="512" cy="286" r="2.6" fill="#ffb066" />
      <text
        x="512"
        y="342"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.7"
      >
        72 HR — US EXPORT FILE
      </text>

      {/* ══ THE PAPER STACK — what comes out the Canadian side ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinejoin="round">
        <rect x="800" y="132" width="308" height="60" strokeWidth="1.6" />
        <rect x="826" y="216" width="308" height="60" strokeWidth="1.6" strokeOpacity="0.85" />
        <rect x="852" y="300" width="308" height="60" strokeWidth="1.6" strokeOpacity="0.7" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.14em"
      >
        <text x="820" y="158" fill="#ffb066">
          FORM 1 — VEHICLE IMPORT
        </text>
        <text x="820" y="178" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          STAMPED AT THE BOOTH. KEEP IT.
        </text>
        <text x="846" y="242" fill="#ffb066">
          GST 5% — PAID ON THE CAD VALUE
        </text>
        <text x="846" y="262" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          PLUS $100 IF IT HAS A/C
        </text>
        <text x="872" y="326" fill="#ffb066">
          OOP CERT — 14 DAYS TO REGISTRY
        </text>
        <text x="872" y="346" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          THEN PLATES
        </text>
      </g>
      {/* leader from booth to stack */}
      <path d="M 722 352 L 796 300" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />

      {/* side labels */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        <text x="90" y="576">US — SWEETGRASS, MONTANA</text>
        <text x="1110" y="576" textAnchor="end">CANADA — ALBERTA</text>
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
        FIG. K — TWO CLOCKS, ONE BOOTH — 15 GETS YOU IN, 25 GETS YOU IN FREE
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        If the car was built more than 15 years ago, it enters Canada without RIV paperwork; more
        than 25 years ago and it crosses <strong>duty-free</strong> — and, as of this writing,
        surtax-free — under tariff item 9966.00.00. You pay 5 per cent GST at the booth, $100 if
        it has air conditioning, then Alberta&rsquo;s out-of-province inspection gets you plates.
      </p>

      <h2>What is the 15-year rule for importing a car into Canada?</h2>
      <p>
        Canada&rsquo;s Motor Vehicle Safety Act regulates vehicles coming into the country — with
        an expiry date. Vehicles older than 15 years, along with buses built before January 1,
        1971, are simply not regulated by the Act at the time of importation.
        <a href="#src-1" className="cite-ref">[1]</a> No Registrar of Imported Vehicles program,
        no RIV fee, no federal inspection, no daytime-running-light retrofit, no compliance
        modifications of any kind. The border still checks ownership and collects tax, but the
        entire federal safety-compliance apparatus that makes newer imports a project steps aside.
      </p>
      <p>
        The 15 years run from the <strong>actual month and year of manufacture</strong>, not the
        model year — Transport Canada reads it off the statement-of-compliance label the factory
        stuck on the door jamb.<a href="#src-1" className="cite-ref">[1]</a> That distinction can
        bite at the margin: a truck titled as a 2012 but built in October 2011 clears in October
        2026, not January 2027. On a &rsquo;60s car with no surviving label, the title, the VIN,
        and any factory documentation carry the argument, so bring all of it. And note what the
        exemption is not: Transport Canada is blunt that successfully importing an older vehicle
        does not guarantee your province will register it.<a href="#src-1" className="cite-ref">[1]</a>{" "}
        Alberta&rsquo;s own hoop comes later in this article.
      </p>
      <blockquote>
        <p>Safety has one clock and the cashier has another, and they are ten years apart.</p>
        <footer>Shop rule, taped above the parts computer</footer>
      </blockquote>

      <h2>How much duty will I pay on a US classic at the border?</h2>
      <p>
        Here is the second clock. Tariff item 9966.00.00 lets a motor vehicle manufactured{" "}
        <strong>more than 25 years</strong> before the date of importation enter duty-free — and
        the country that built it does not matter.<a href="#src-2" className="cite-ref">[2]</a> A
        1970 Chevelle, a 1988 Porsche 911, a 1978 F-150: all zero duty. Same fine print as the
        safety clock — CBSA counts the actual month and year of manufacture, not the model
        year.<a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <p>
        Then there is the tariff war. In the spring of 2025 Canada put a 25 per cent surtax on
        motor vehicles originating in the United States, and it applied to casual imports —
        private buyers, not just dealers.<a href="#src-3" className="cite-ref">[3]</a> It briefly
        caught vintage vehicles too, until an amending order removed tariff item 9966 from the
        surtax&rsquo;s scope, which is why a classic over 25 years old currently crosses without
        it.<a href="#src-3" className="cite-ref">[3]</a> Treat that as weather, not geography.
        Surtax policy has changed more than once since 2025, so read the current customs notice or
        put ten minutes on the phone with a broker <strong>the week you cross</strong> — not the
        month you start shopping.
      </p>
      <p>
        The trap lives between the clocks: a vehicle 15 to 25 years old. It skips the RIV, but it
        gets no help from 9966. Duty is zero only if the vehicle was built in North America and
        you can support the origin claim; a Japanese- or German-built car in that band pays the
        standard 6.1 per cent passenger-vehicle rate. And a US-built vehicle in that band — the
        2005 Mustang GT, the early Raptor, the LS-era GM trucks everyone hauls home — is exactly
        what the 25 per cent surtax was aimed at. As of this writing, a US-origin
        twenty-year-old &ldquo;modern classic&rdquo; can cost a quarter of its own price in surtax
        at the booth. Run the math before the deposit, not after.
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            What a vehicle imported from the United States pays at the Canadian border by age
            band: over 25 years old, 15 to 25 years old, and under 15 years old, compared by RIV
            program requirement, duty for North American-built vehicles, duty for vehicles built
            elsewhere, the 2025 US surtax, and GST
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Over 25 years old</th>
              <th scope="col">15–25 years old</th>
              <th scope="col">Under 15 years old</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">RIV program</th>
              <td>Exempt</td>
              <td>Exempt</td>
              <td>Required — fee, inspection, compliance</td>
            </tr>
            <tr>
              <th scope="row">Duty, built in North America</th>
              <td className="num">$0</td>
              <td className="num">$0 with proof of origin</td>
              <td className="num">$0 with proof of origin</td>
            </tr>
            <tr>
              <th scope="row">Duty, built elsewhere</th>
              <td className="num">$0 under 9966.00.00</td>
              <td className="num">6.1%</td>
              <td className="num">6.1%</td>
            </tr>
            <tr>
              <th scope="row">US surtax (as of this writing)</th>
              <td>None — 9966 removed from scope</td>
              <td>25% if US-origin</td>
              <td>25% if US-origin</td>
            </tr>
            <tr>
              <th scope="row">GST at the border</th>
              <td className="num">5%</td>
              <td className="num">5%</td>
              <td className="num">5%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What taxes and fees apply beyond duty?</h2>
      <p>
        GST, always: 5 per cent of the value for duty — the price you actually paid, converted to
        Canadian dollars — collected at the booth. Alberta charges no provincial sales tax, so
        unlike an import landing in BC or Ontario, the crossing itself costs an Albertan 5 per
        cent and small change. The small change: a $100 federal excise tax if the vehicle has air
        conditioning, factory or added.<a href="#src-4" className="cite-ref">[4]</a> The Green
        Levy on fuel-thirsty vehicles only touches vehicles put into service after March 2007,
        which is to say it does not touch your classic.<a href="#src-4" className="cite-ref">[4]</a>
      </p>
      <p>
        One habit worth keeping: declare the real number. CBSA officers see convenient $2,000
        bills of sale on $30,000 cars every week, and an officer who doubts your paperwork can
        assess the value themselves. Bring the ad, the wire-transfer receipt, and the bill of
        sale, and let them agree with each other. The GST difference you would save by shaving
        the number is small; the seizure file you would open is not.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">5%</span>
          <span className="stat-l">GST on the CAD value, paid at the booth</span>
        </div>
        <div>
          <span className="stat-v">$0</span>
          <span className="stat-l">Duty on a classic over 25 years old, any build country</span>
        </div>
        <div>
          <span className="stat-v">$100</span>
          <span className="stat-l">Federal excise if the car has air conditioning</span>
        </div>
        <div>
          <span className="stat-v">$1,500–$3,500</span>
          <span className="stat-l">Typical open transport, southern US to Edmonton, CAD</span>
        </div>
      </div>

      <h2>What does the US side need before the car can leave?</h2>
      <p>
        This is the step that wrecks timelines, because most buyers do not know the United States
        checks vehicles <strong>out</strong>. US Customs and Border Protection requires the
        vehicle&rsquo;s documentation — the certificate of title — to be submitted to the export
        port at least <strong>72 hours before</strong> the vehicle crosses, with the vehicle
        itself presented at the time of exportation.<a href="#src-5" className="cite-ref">[5]</a>{" "}
        For an Alberta run that port is Sweetgrass, Montana, opposite Coutts, and export offices
        keep business hours. In practice you, or the customs broker you hire for a few hundred
        dollars, file the electronic export declaration, send the title ahead, wait out the 72
        hours, and time the crossing for a weekday. A transport truck that shows up before the
        clock runs out sits and waits on your dime.
      </p>
      <p>
        The title itself is the other pre-deposit check. A lien recorded on it, a seller whose
        name does not match it, or a &ldquo;title in the mail&rdquo; story all stop the export
        cold — CBP wants a clear document, and CBSA wants the same one on the other side. Verify
        the title status with the issuing state <strong>before you wire a deposit to
        Arizona</strong>, not while the car sits in a Montana holding yard.
      </p>

      <h2>What actually happens at the Canadian booth?</h2>
      <p>
        Less than you fear, if the file is in order. You declare the vehicle; the officer
        establishes its non-regulated status from its age, examines the ownership documents,
        inspects for soil contamination, and collects the taxes and any duties owing.
        <a href="#src-1" className="cite-ref">[1]</a> The soil check is real — pressure-wash the
        undercarriage before it ships, because a fender full of Arizona caliche reads as
        agricultural risk, not as patina. Payment done, the Vehicle Import Form — Form 1, or its
        electronic RIV e-Form equivalent — records the vehicle&rsquo;s legal entry.
        <a href="#src-4" className="cite-ref">[4]</a> The stamped copy of that form, the US
        title, and the CBSA accounting receipt are the car&rsquo;s birth certificate in Canada.
        Registries will ask for them. Keep the stack together and make copies.
      </p>

      <h2>How do I register a US import in Alberta?</h2>
      <p>
        Alberta treats a fresh US import like any vehicle arriving from outside the province: it
        must pass an <strong>out-of-province inspection</strong> before plates are issued. The
        sequence is fixed — buy a Request for Vehicle Inspection Form at any registry, present it
        with the vehicle at a licensed inspection facility where a journeyperson technician does
        the work, fix any failures within 10 days to avoid a full re-inspection, and present the
        passed certificate to a registry agent <strong>within 14 days</strong> of issue or the
        whole inspection expires.<a href="#src-6" className="cite-ref">[6]</a> What gets checked,
        what it costs in Edmonton, and what fails most often is its own subject, and we wrote it
        up separately in the{" "}
        <Link href="/blog/out-of-province-inspection-edmonton">out-of-province inspection guide</Link>.
        Short version: windshields, tires, bulbs, and brakes fail more inspections than anything
        exotic, and a fifty-year-old car should visit a shop before it visits the inspector.
      </p>
      <p>
        With the certificate in hand, registration is a registry-counter errand: stamped Form 1,
        US title, bill of sale, proof of insurance, inspection certificate, plates. Insure the
        vehicle before it moves at all — a landed, uninspected classic can be moved on a
        temporary permit, but not on hope.
      </p>

      <h2>Is the Arizona car actually worth the haul?</h2>
      <p>
        Usually, and the reason is rust. Metal repair is the most expensive line in almost every
        restoration — quarters, floors, cab corners, and rockers consume hours the way nothing
        else on the build does, which is exactly the arithmetic behind our{" "}
        <Link href="/services/body-paint-metalwork">metal and body work</Link>. A dry-state car
        that costs more to buy and $2,000 to haul can still land tens of hours of fabrication
        ahead of the local car that spent forty winters marinating in calcium chloride. It is why
        so many of the square-body trucks in the{" "}
        <Link href="/blog/c10-square-body-alberta-guide">C10 guide</Link> came north with Arizona
        or Nevada history — the Alberta market has been importing its sheet metal for decades.
      </p>
      <p>
        Rough landed math on a $20,000 USD purchase, at recent exchange rates: call it roughly
        $27,000 to $28,000 CAD for the car, about $1,400 in GST, $100 if it has air, a few
        hundred for the broker, $1,500 to $3,500 CAD for open transport from the southern US, and
        the inspection with whatever small repairs it demands once here. Planning ranges, every
        one — the exchange rate alone moves the total more than any fee on the list. The number
        that math does not capture is the one that matters most: what the car needs after it
        lands, which is a <Link href="/services/classic-car-restoration">restoration-planning</Link>{" "}
        question, not a border question.
      </p>
      <p>
        If you are watching an auction in Scottsdale or a Craigslist ad in Phoenix right now,
        send the listing through the <Link href="/quote">quote page</Link> before you bid. We
        will tell you what the photos say about the metal, what the border math looks like for
        that specific year, and — when it is true — that the car three provinces over is the
        better buy.
      </p>
    </>
  );
}
