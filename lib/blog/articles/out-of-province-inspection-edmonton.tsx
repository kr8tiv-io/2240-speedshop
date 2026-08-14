import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. — Out-of-Province Inspection, Edmonton.
 * The Alberta-law pillar for the OOP inspection keyword cluster. Links down
 * into the Alberta laws guide, the performance service page, the Sherwood
 * Park area page, and the quote page. Every regulatory claim verified against
 * Alberta.ca and the Government of Alberta registration bulletin, May 2026.
 */

export const meta: ArticleMeta = {
  slug: "out-of-province-inspection-edmonton",
  title:
    "Out-of-Province Vehicle Inspection in Edmonton: 2026 Cost, What's Checked, and the Modified-Car Trap",
  accent: "Trap",
  metaTitle: "Out-of-Province Inspection Edmonton — 2026 Cost & What's Checked",
  description:
    "What an Alberta out-of-province inspection covers, typical 2026 Edmonton costs, the 10-day repair window, and why lifted or modified vehicles never skip it.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Alberta Law",
  targetKeywords: [
    "out of province inspection edmonton",
    "oop inspection cost alberta",
    "out of province inspection checklist",
    "new west partnership exemption",
  ],
  faq: [
    {
      q: "How much is an out-of-province inspection in Edmonton?",
      a: "Edmonton shops were advertising out-of-province inspections in roughly the $130 to $190 range in 2026, and Alberta lets every licensed facility set and post its own price, so quotes above and below that exist. Add a small registry fee for the Request for Vehicle Inspection form, and budget separately for whatever repairs the inspection finds — the repairs, not the inspection fee, are the real number.",
    },
    {
      q: "What fails an OOP inspection most often?",
      a: "The boring stuff. Windshield damage in the driver's line of sight, tires worn to or near the wear bars, burnt-out bulbs, tired wiper blades, and worn brakes fail more inspections than anything dramatic. Behind those come structural rust, play in steering and suspension components, exhaust leaks, and an illuminated check-engine or airbag light. Most failures are cheap to prevent and annoying to discover on inspection day.",
    },
    {
      q: "How long do I have to fix failures?",
      a: "Ten days from the original inspection. Complete the repairs and return within that window and the re-inspection covers verification of the required repairs only. Miss the window and a new full inspection is required, at full cost. Separately, a passed certificate must be presented to an Alberta registry agent within 14 days of issue, or the whole inspection has to be redone.",
    },
    {
      q: "Does a lifted truck qualify for the New West Partnership exemption?",
      a: "No. Alberta's exemption rules exclude lifted or lowered vehicles outright, along with custom and homebuilt vehicles, rebuilt-status vehicles, salvage, non-repairable, right-hand drive, and kit cars. A lifted truck coming from British Columbia, Saskatchewan, or Manitoba needs the full out-of-province inspection no matter how new it is or how recently it was inspected there.",
    },
    {
      q: "Can any shop do an OOP inspection?",
      a: "No. Only a facility licensed under Alberta's Vehicle Inspection Program can perform one, and the inspection itself must be done by a journeyperson technician licensed by the program for out-of-province inspections. A general repair shop cannot issue the certificate — 2240 Speed Shop is a repair and build shop, not an inspection facility, and its role is getting the vehicle ready to pass before you book the official inspection.",
    },
  ],
  citations: [
    {
      name: "“Out-of-Province Vehicle Inspections,” Government of Alberta, Alberta.ca",
      url: "https://www.alberta.ca/out-of-province-vehicle-inspections",
    },
    {
      name: "Out-of-Province Inspection pricing, KT Vehicle Inspections, Edmonton",
      url: "https://vehicleinspections.ca/",
    },
    {
      name: "Vehicle Inspections pricing, Good News Auto, Edmonton",
      url: "https://www.goodnewsauto.ca/vehicle-inspections",
    },
    {
      name: "“Out of Province Inspections,” Revolution Motors, Edmonton",
      url: "https://revolutionmotors.ca/vehicle-inspection/out-of-province/",
    },
    {
      name: "“Why Out of Province Vehicle Inspections Fail,” Revolution Motors, Edmonton",
      url: "https://revolutionmotors.ca/blog/province-vehicle-inspections-fail/",
    },
    {
      name: "“Registering an Out-of-Province Vehicle in Alberta,” Government of Alberta, Transportation and Economic Corridors, May 2026",
      url: "https://www.alberta.ca/system/files/tec-registering-an-out-of-province-vehicle-in-alberta.pdf",
    },
  ],
  internalLinks: [
    "/guides/alberta-laws",
    "/services/classic-performance-tuning",
    "/edmonton/sherwood-park",
    "/quote",
  ],
  readingMinutes: 10,
};

/**
 * The inspection clipboard as an editorial plate: eight checklist rows in
 * steel line art, pass marks ticked — and the two rows every Edmonton tech
 * knows by heart, windshield and tires, flagged in tungsten. Beside it, the
 * stopwatch that governs the whole exercise: the 10-day repair window.
 */
export function Illustration() {
  const rows = [
    { n: "01", label: "LIGHTS · SIGNALS", pass: true },
    { n: "02", label: "WIPERS · DEFROST", pass: true },
    { n: "03", label: "BRAKES", pass: true },
    { n: "04", label: "STEERING", pass: true },
    { n: "05", label: "SUSPENSION", pass: true },
    { n: "06", label: "WINDSHIELD", pass: false },
    { n: "07", label: "TIRES · TREAD", pass: false },
    { n: "08", label: "BODY · FRAME", pass: true },
  ];
  return (
    <svg
      viewBox="0 0 1200 640"
      role="img"
      aria-label="Editorial diagram of an Alberta out-of-province inspection clipboard: eight checklist rows in steel line art with pass ticks, the windshield and tire rows flagged as failures in tungsten orange, beside a stopwatch marked ten days for the repair and re-inspection window"
      className="h-auto w-full"
    >
      <title>The list and the clock — eight systems, two usual suspects, ten days</title>
      <defs>
        <radialGradient id="oop-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="oop-dial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#ffb066" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the board */}
      <ellipse cx="450" cy="592" rx="360" ry="26" fill="url(#oop-pool)" />

      {/* ══ THE CLIPBOARD ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinejoin="round" strokeLinecap="round">
        {/* board */}
        <rect x="222" y="96" width="456" height="470" rx="10" strokeWidth="2" />
        {/* sheet edge inside the board */}
        <rect x="238" y="126" width="424" height="424" rx="4" strokeWidth="0.8" strokeOpacity="0.35" />
        {/* clip: clamp plate, hinge bar, hanging hole */}
        <rect x="408" y="74" width="84" height="36" rx="8" strokeWidth="1.6" />
        <line x1="422" y1="110" x2="478" y2="110" strokeWidth="1" strokeOpacity="0.6" />
        <circle cx="450" cy="90" r="6" strokeWidth="1.2" />
      </g>

      {/* header block */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.18em">
        <text x="258" y="158" fontSize="12" fill="#9a9ca0">
          MECHANICAL FITNESS ASSESSMENT
        </text>
        <text x="258" y="178" fontSize="10" fill="#ffb066" fillOpacity="0.9">
          OUT-OF-PROVINCE · ALBERTA
        </text>
      </g>
      <line x1="258" y1="190" x2="642" y2="190" stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.4" />

      {/* ══ CHECKLIST ROWS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.14em">
        {rows.map((r, i) => {
          const y = 226 + i * 42;
          const ink = r.pass ? "#9a9ca0" : "#ffb066";
          return (
            <g key={r.n}>
              {/* fail rows carry a tungsten side bar */}
              {!r.pass && (
                <rect x="240" y={y - 15} width="3" height="22" fill="#ffb066" fillOpacity="0.85" />
              )}
              <text x="258" y={y} fontSize="11" fill={ink} fillOpacity={r.pass ? 0.85 : 1}>
                {r.n}
              </text>
              <text
                x="292"
                y={y}
                fontSize="11"
                fill={r.pass ? "#9a9ca0" : "#ffd9ad"}
                fillOpacity={r.pass ? 0.85 : 1}
              >
                {r.label}
              </text>
              {/* dotted leader to the mark box */}
              <line
                x1="470"
                y1={y - 4}
                x2="596"
                y2={y - 4}
                stroke="#9a9ca0"
                strokeWidth="0.75"
                strokeOpacity="0.3"
                strokeDasharray="2 6"
              />
              {/* mark box */}
              <rect
                x="606"
                y={y - 16}
                width="24"
                height="24"
                rx="4"
                fill="none"
                stroke={ink}
                strokeWidth={r.pass ? 1.1 : 1.5}
                strokeOpacity={r.pass ? 0.6 : 1}
              />
              {r.pass ? (
                <polyline
                  points={`${611},${y - 4} ${616},${y + 1} ${625},${y - 11}`}
                  fill="none"
                  stroke="#9a9ca0"
                  strokeWidth="1.6"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <g stroke="#ffb066" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="611" y1={y - 11} x2="625" y2={y + 3} />
                  <line x1="625" y1={y - 11} x2="611" y2={y + 3} />
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* leader from the failed rows out to the clock */}
      <path
        d="M 638 448 Q 730 448 782 366"
        fill="none"
        stroke="#ffb066"
        strokeWidth="0.75"
        strokeOpacity="0.5"
        strokeDasharray="4 5"
      />

      {/* ══ THE 10-DAY STOPWATCH ══ */}
      <circle cx="930" cy="282" r="128" fill="url(#oop-dial)" />
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        {/* crown and shoulders */}
        <line x1="930" y1="140" x2="930" y2="158" strokeWidth="2" />
        <rect x="916" y="128" width="28" height="12" rx="3" strokeWidth="1.4" />
        <line x1="852" y1="172" x2="866" y2="186" strokeWidth="1.6" strokeOpacity="0.7" />
        <line x1="1008" y1="172" x2="994" y2="186" strokeWidth="1.6" strokeOpacity="0.7" />
        {/* case */}
        <circle cx="930" cy="282" r="112" strokeWidth="2" />
      </g>
      {/* twelve ticks */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const x1 = 930 + Math.sin(a) * 102;
          const y1 = 282 - Math.cos(a) * 102;
          const x2 = 930 + Math.sin(a) * 92;
          const y2 = 282 - Math.cos(a) * 92;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      {/* the elapsed sweep — most of the dial already gone */}
      <path
        d="M 930 198 A 84 84 0 1 1 857.3 240"
        fill="none"
        stroke="#ffb066"
        strokeWidth="2"
        strokeOpacity="0.85"
        strokeDasharray="6 5"
        strokeLinecap="round"
      />
      <circle cx="930" cy="198" r="3" fill="#ffd9ad" />
      {/* dial figures */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" textAnchor="middle">
        <text x="930" y="296" fontSize="58" letterSpacing="0.04em" fill="#ffd9ad">
          10
        </text>
        <text x="930" y="330" fontSize="14" letterSpacing="0.3em" fill="#ffb066">
          DAYS
        </text>
      </g>
      {/* clock captions */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" textAnchor="middle" letterSpacing="0.18em">
        <text x="930" y="440" fontSize="11" fill="#ffb066">
          REPAIR WINDOW
        </text>
        <text x="930" y="460" fontSize="10" fill="#9a9ca0" fillOpacity="0.85">
          RE-CHECK VERIFIES REPAIRS ONLY
        </text>
        <text x="930" y="480" fontSize="10" fill="#9a9ca0" fillOpacity="0.55">
          DAY 11 — FULL INSPECTION, FULL FEE
        </text>
      </g>

      {/* corner annotation */}
      <text
        x="1150"
        y="120"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        LICENSED FACILITY ONLY
      </text>

      {/* plate caption */}
      <text
        x="600"
        y="622"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. A — THE LIST, THE CLOCK, AND THE TWO USUAL SUSPECTS
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        An out-of-province inspection is the mandatory mechanical inspection Alberta requires
        before a vehicle registered elsewhere can get Alberta plates. If you moved here with a car
        or bought one outside the province, you almost certainly need it. In Edmonton in 2026,
        shops typically advertise the inspection itself around $130 to $190 — the repairs it finds
        are the real bill.
      </p>

      <h2>What is an out-of-province inspection and who needs one?</h2>
      <p>
        Alberta&rsquo;s rule is short: vehicles registered outside Alberta must pass an inspection
        before licence plates are issued.<a href="#src-1" className="cite-ref">[1]</a> That
        catches new residents bringing a vehicle with them, Albertans buying used out of province,
        vehicles imported from the United States after the federal RIV process, and — the traffic
        this shop sees most — classics and project trucks bought at auctions and estate sales in
        British Columbia, Saskatchewan, and beyond.
      </p>
      <p>
        The sequence matters. First you buy a Request for Vehicle Inspection form from any Alberta
        registry agent; the form does not expire, and the inspection facility needs it before it
        can begin.<a href="#src-1" className="cite-ref">[1]</a> Then the vehicle goes to a
        facility licensed under Alberta&rsquo;s Vehicle Inspection Program, where a journeyperson
        technician licensed for out-of-province inspections works through it — typically about two
        hours.<a href="#src-1" className="cite-ref">[1]</a> Pass, and you get a certificate. That
        certificate must be presented to a registry agent within 14 days of issue, or the whole
        inspection gets done again.<a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        Note what that means: not every shop can do this. A general repair shop — this one
        included — cannot issue the certificate. Only licensed inspection facilities can, which is
        exactly why the smart move with an old or modified vehicle is to arrive at one already
        knowing what the clipboard will say.
      </p>

      <h2>What does it cost in Edmonton in 2026?</h2>
      <p>
        Alberta does not set the price. Each licensed facility sets its own fee and must post it,
        so the market decides — and the Edmonton market in 2026 mostly advertises between about
        $130 and $190 for a light passenger vehicle.<a href="#src-2" className="cite-ref">[2]</a>
        <a href="#src-3" className="cite-ref">[3]</a> Ranges quoted around Alberta run wider in
        both directions. Typical planning numbers, not quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Typical 2026 Edmonton out-of-province inspection costs by line item, in Canadian
            dollars
          </caption>
          <thead>
            <tr>
              <th scope="col">Line item</th>
              <th scope="col">Typical 2026 range (CAD)</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Request for Vehicle Inspection form</th>
              <td className="num">~$10 – $20</td>
              <td>Bought at a registry agent before the inspection; does not expire</td>
            </tr>
            <tr>
              <th scope="row">Inspection fee</th>
              <td className="num">~$130 – $190 advertised</td>
              <td>Each facility sets and posts its own price; wider ranges exist</td>
            </tr>
            <tr>
              <th scope="row">Re-inspection after a failure</th>
              <td className="num">$0 – $130ish</td>
              <td>Shop policy — some waive it if they do the repairs, some charge</td>
            </tr>
            <tr>
              <th scope="row">Repairs to pass</th>
              <td className="num">Open-ended</td>
              <td>The real number. Wipers and bulbs, or floors and brake lines</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Understand what a bargain ad price is actually selling. The inspection is a
        government-defined checklist performed to one standard by licensed technicians — a $130
        inspection and a $300 inspection buy the same list. The cheap fee is a door-opener: the
        facility expects to quote the repairs, and some price accordingly. One Edmonton shop, for
        instance, discounts its $189 inspection by half when over $1,000 of repairs are done
        in-house, and charges $129 to re-inspect work done elsewhere.
        <a href="#src-3" className="cite-ref">[3]</a> None of that is dishonest — it is just worth
        reading the whole price list, not the headline.
      </p>
      <blockquote>
        <p>
          The inspection fee is the cheapest line on the invoice. The list it produces is the
          invoice.
        </p>
        <footer>Shop rule, learned the usual way</footer>
      </blockquote>

      <h2>What&rsquo;s actually checked?</h2>
      <p>
        The technician works from Alberta&rsquo;s Automotive and Light Truck Inspection Manual,
        and the governing standard is blunt: the vehicle must be maintained within the original
        equipment manufacturer&rsquo;s service limits.<a href="#src-1" className="cite-ref">[1]</a>{" "}
        Not &ldquo;runs fine,&rdquo; not &ldquo;passed in BC&rdquo; — within OEM limits, measured.
      </p>
      <p>
        In practice that means a systematic pass through the whole vehicle: brakes, steering,
        suspension, tires and wheels, lights and signals, glass, wipers and defrosters, electrical
        systems, engine controls, fuel and exhaust systems, powertrain and driveline, and the
        structural condition of the body and frame.<a href="#src-4" className="cite-ref">[4]</a>{" "}
        Expect wheels off for brake measurements and a technician under the vehicle with a pry bar
        checking for play. The two hours are real work, which is also why the certificate means
        something.
      </p>
      <p>
        For a modern used car, that list is routine. For a fifty-year-old truck — or anything
        modified — the OEM-limits standard is where things get interesting, because every worn
        kingpin, seeping wheel cylinder, and rotted hanger is measured against what the factory
        specified, not against how it drove onto the hoist.
      </p>

      <h2>What fails most often?</h2>
      <p>
        Not the dramatic stuff. Edmonton inspection shops are consistent on this: the most common
        failures are minor, cheap, and completely predictable.<a href="#src-5" className="cite-ref">[5]</a>
      </p>
      <ul>
        <li>
          <strong>Windshield damage.</strong> Cracks and chips in the driver&rsquo;s line of sight
          are a fail, full stop. On Alberta highways, behind Alberta gravel trucks, this is the
          classic — plenty of vehicles arrive from the coast with a windshield that survived the
          drive and not the clipboard.
        </li>
        <li>
          <strong>Tires.</strong> Tread at or near the wear bars, aged and cracked rubber,
          mismatched sizes on an axle. The inspection does not care how much winter the tires have
          left in your opinion.
        </li>
        <li>
          <strong>Lights and wipers.</strong> One burnt bulb is a defect. Wiper blades that smear
          are a defect. The five-dollar failures are the most common failures.
          <a href="#src-5" className="cite-ref">[5]</a>
        </li>
        <li>
          <strong>Brakes.</strong> Worn pads and shoes, scored rotors, seeping lines and
          cylinders. On older vehicles this is the most expensive of the frequent failures.
        </li>
        <li>
          <strong>Structural rust and suspension play.</strong> Surface rust on panels is
          cosmetic; rust in frames, floors, and mounting points is structural, and it fails.
          Likewise measurable play in tie rods, ball joints, and bushings.
        </li>
        <li>
          <strong>Warning lights.</strong> An illuminated check-engine or airbag light stops the
          show until it is diagnosed and resolved.<a href="#src-5" className="cite-ref">[5]</a>
        </li>
      </ul>
      <p>
        Read that list again as a buyer&rsquo;s tool. Before you e-transfer a deposit on a
        Saskatchewan farm truck, the glass, tires, brakes, and frame are twenty minutes of looking
        that predict most of the inspection outcome.
      </p>

      <h2>How does the 10-day repair window work?</h2>
      <p>
        Fail an item and the clock starts. Alberta&rsquo;s rule: complete the required repairs
        within 10 days of the original inspection, and the re-inspection covers verification of
        those repairs only. Take longer than 10 days, and a new full inspection is required — at
        full cost, from the top.<a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">~2 hrs</span>
          <span className="stat-l">Typical inspection time, light vehicles</span>
        </div>
        <div>
          <span className="stat-v">10 days</span>
          <span className="stat-l">Repair window before a full re-do</span>
        </div>
        <div>
          <span className="stat-v">14 days</span>
          <span className="stat-l">Certificate life at the registry</span>
        </div>
        <div>
          <span className="stat-v">90 days</span>
          <span className="stat-l">NWP window for a prior BC/SK/MB inspection</span>
        </div>
      </div>
      <p>
        For a late-model commuter, 10 days is generous — bulbs, blades, and a set of tires happen
        in an afternoon. For a classic, 10 days is a trap of its own. Brake hardware for a 1968
        C10 is not on an Edmonton shelf; it is on a truck from a US warehouse, and border shipping
        does not respect inspection windows. The play here is obvious once stated: know what the
        vehicle needs <strong>before</strong> the official inspection, fix it first, and book the
        inspection when the vehicle is ready — not as a discovery exercise with a countdown
        attached.
      </p>

      <h2>Does a modified vehicle qualify for the New West Partnership exemption?</h2>
      <p>
        No — and this is the trap in the title. Under the New West Partnership rules, a private
        passenger vehicle coming from British Columbia, Saskatchewan, or Manitoba can skip the
        out-of-province inspection if it is newer than four years (current model year plus the
        previous three), or if it passed a BC, SK, or MB government mechanical inspection within
        the past 90 days.<a href="#src-6" className="cite-ref">[6]</a> Useful, if narrow —
        commercial and organizational vehicles do not qualify at all.
      </p>
      <p>
        Then comes the exclusion list. Alberta&rsquo;s current guidance names the vehicles that
        can never be exempt: salvage, non-repairable, unsafe, rebuilt, right-hand drive,
        custom or homebuilt, kit cars, and — in exactly these words — lifted or lowered
        vehicles.<a href="#src-6" className="cite-ref">[6]</a> A three-year-old lifted truck from
        Saskatoon with a fresh Saskatchewan inspection still takes the full Alberta
        out-of-province inspection. So does a lowered restomod from Kelowna, a rebuilt-status
        Mustang from Winnipeg, and anything wearing a homebuilt title.
      </p>
      <p>
        Two honest clarifications, because forums get this wrong in both directions. First, being
        on the exclusion list does not mean the vehicle cannot be registered in Alberta — it means
        the inspection is mandatory, with no shortcut. Second, the exemption paperwork is a
        registry-counter decision: you bring identification, insurance, the bill of sale, and the
        prior registration or inspection documents, and the registry agent applies the rules.
        <a href="#src-6" className="cite-ref">[6]</a> Nobody at the counter is debating what
        counts as lifted. If the vehicle is modified, plan on the full inspection, where a
        licensed technician measures it against OEM service limits — and where a modification done
        badly has nowhere to hide. The wider registration picture, from insurance to plates, lives
        in the <Link href="/guides/alberta-laws">Alberta laws guide</Link>.
      </p>

      <h2>Should you get an inspection-ready check first?</h2>
      <p>
        If the vehicle is a daily driver under ten years old — probably not; book the inspection
        and fix the short list it produces. If it is a classic, a project, or anything modified,
        yes, and here is the honest framing: 2240 Speed Shop is not a licensed inspection facility
        and does not issue out-of-province certificates. What this shop does is the other half of
        the job — the pre-inspection once-over and the repairs that decide whether your official
        inspection is a formality or a countdown.
      </p>
      <p>
        On old iron that means the exact failure list above, worked in advance: brake hydraulics
        and measurements, steering and suspension play, glass, lighting, exhaust, fuel lines, and
        structural rust repair done as metalwork rather than optimism. It also means making the
        thing run clean —{" "}
        <Link href="/services/classic-performance-tuning">carburetion, ignition, and tune</Link>{" "}
        sorted so the vehicle presents as maintained, because a technician holding a clipboard
        judges a stumbling cold idle the way you would.
      </p>
      <p>
        Geography helps too. The shop sits on Edmonton&rsquo;s east side,{" "}
        <Link href="/edmonton/sherwood-park">minutes off the Sherwood Park line</Link> — convenient
        when the vehicle is arriving by trailer from Saskatchewan on a Wednesday and the plan
        needs to survive contact with reality. Bring the ad, the photos, or the vehicle itself
        through the <Link href="/quote">quote page</Link> and you will get a straight read: what
        would likely fail, what it typically costs to make right, and — when it is true — that the
        truck you are about to buy is a parts vehicle wearing licence plates.
      </p>
    </>
  );
}
