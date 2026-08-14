import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. — Alberta Exhaust & Noise Laws.
 * The exhaust deep-dive under the Alberta-laws pillar. The pillar overviews
 * every rule area; this article goes all the way down on exhaust and noise:
 * the Vehicle Equipment Regulation, Edmonton's $1,000 fine, the noise-camera
 * pilot, and the overnight residential rule. Links down into the performance
 * service page, the pillar, the FAQ, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "alberta-exhaust-noise-laws",
  title:
    "Are Exhaust Mods Legal in Alberta? Noise Laws, Edmonton's $1,000 Fine, and How Not to Get Ticketed",
  accent: "$1,000 Fine",
  metaTitle: "Are Exhaust Mods Legal in Alberta? Noise Laws & the $1,000 Fine",
  description:
    "Exhaust mods are legal in Alberta with a working muffler, inside the noise rules. The equipment law, Edmonton's $1,000 fine, the noise-camera pilot, and how to pass.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Alberta Law",
  targetKeywords: [
    "are exhaust mods legal in alberta",
    "alberta exhaust noise laws",
    "edmonton loud vehicle bylaw fine",
    "noise cameras edmonton",
    "muffler delete alberta",
  ],
  faq: [
    {
      q: "Is a muffler delete legal in Alberta?",
      a: "No. Alberta's Vehicle Equipment Regulation requires every internal-combustion vehicle to have an exhaust muffler that expels gases without excessive noise and without flames or sparks. Removing the muffler removes the required equipment, and a straight-piped car fails that test the moment it starts. It is an equipment violation before anyone measures how loud it is.",
    },
    {
      q: "How much is the loud-exhaust fine in Edmonton?",
      a: "Edmonton amended its Traffic Bylaw in February 2023 to set a $1,000 fine for a first excessive-vehicle-noise offence and $2,000 for repeat offences. The bylaw previously targeted motorcycles and now covers all vehicles. Separate provincial charges for noise and equipment carry their own, smaller penalties. Fine amounts change, so confirm the current figure with the City of Edmonton.",
    },
    {
      q: "Are noise cameras active in Edmonton?",
      a: "Not for ticketing. In August 2025 city council approved a $50,000 pilot using cameras and microphones to monitor vehicle noise, but provincial rules do not currently allow automated noise tickets, so the pilot collects data rather than issuing fines. A report on the pilot is expected around early 2027. Officers can still ticket you the ordinary way in the meantime.",
    },
    {
      q: "Can I get ticketed for a stock performance exhaust?",
      a: "In principle, yes. The noise rules are written around noise and behaviour, not brand or origin, so a factory system revved hard at a light can draw the same charge as an aftermarket one. In practice a stock or stock-equivalent system driven normally sits at the quiet end of enforcement. It is the driving that converts a legal system into a ticket.",
    },
    {
      q: "Is exhaust drone illegal?",
      a: "No law in Alberta names drone. Drone is the resonance you hear inside the cabin at highway cruise, and the people it punishes are you and your passengers, not the public. The legal question is exterior noise. Drone is a build-quality problem — resonator choice, muffler design, and pipe routing — and a well-built system controls both at once.",
    },
  ],
  citations: [
    {
      name: "Vehicle Equipment Regulation, Alta Reg 122/2009, s 61, Alberta King's Printer",
      url: "https://kings-printer.alberta.ca/documents/Regs/2009_122.pdf",
    },
    {
      name: "“Noise — Vehicle Noise,” City of Edmonton",
      url: "https://www.edmonton.ca/city_government/bylaws/noise",
    },
    {
      name: "“Obnoxiously loud vehicles will be fined $1K following changes to bylaw passed by Edmonton city council,” Global News, February 2023",
      url: "https://globalnews.ca/news/9510700/bylaw-passes-noisy-vehicle-edmonton/",
    },
    {
      name: "“City approves $50K automated pilot project to curb noisy vehicles,” CTV News Edmonton, August 2025",
      url: "https://www.ctvnews.ca/edmonton/article/city-approves-50k-automated-pilot-project-to-curb-noisy-vehicles/",
    },
    {
      name: "Community Standards Bylaw 14600, City of Edmonton",
      url: "https://www.edmonton.ca/sites/default/files/public-files/C14600.pdf",
    },
  ],
  internalLinks: [
    "/guides/alberta-laws",
    "/services/classic-performance-tuning",
    "/faq",
    "/quote",
  ],
  readingMinutes: 10,
};

/**
 * The noise gauge: a big arc meter in steel line art with three zones —
 * clear, grey area, fine — the fine zone struck in tungsten, a needle buried
 * in it at "revved at a light," a $1,000 first-offence chip hung off the hot
 * zone, and the Edmonton skyline silhouetted under the dial. Editorial
 * instrument, not clipart: every label mono, every glow sourced.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Decibel-gauge infographic: an arc meter with three zones labelled clear, grey area, and fine, a needle buried in the fine zone at the reading revved at a light, a chip showing Edmonton's $1,000 first-offence noise fine, and the Edmonton skyline silhouetted beneath the dial"
      className="h-auto w-full"
    >
      <title>The noise gauge — where the ticket lives</title>
      <defs>
        <radialGradient id="ex-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ex-hot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* corner annotations */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
      >
        <text x="80" y="70" fill="#9a9ca0" fillOpacity="0.6">
          EDMONTON · CRUISE SEASON
        </text>
        <text x="1120" y="70" textAnchor="end" fill="#9a9ca0" fillOpacity="0.6">
          AR 122/2009 § 61 · MUFFLER REQUIRED
        </text>
      </g>

      {/* glow pooled behind the hot end of the dial */}
      <circle cx="830" cy="300" r="170" fill="url(#ex-hot)" />

      {/* ══ THE DIAL — three zones on one arc, r=300 about (600,430) ══ */}
      {/* clear — steel, solid */}
      <path
        d="M 300 430 A 300 300 0 0 1 473 158"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* grey area — steel, broken */}
      <path
        d="M 473 158 A 300 300 0 0 1 727 158"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="3"
        strokeOpacity="0.55"
        strokeDasharray="10 9"
        strokeLinecap="round"
      />
      {/* fine — tungsten */}
      <path
        d="M 727 158 A 300 300 0 0 1 900 430"
        fill="none"
        stroke="#ffb066"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* graduation ticks, every 15° */}
      <g stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7">
        <line x1="318" y1="430" x2="300" y2="430" />
        <line x1="327.6" y1="357" x2="310.2" y2="352.3" />
        <line x1="355.8" y1="289" x2="340.2" y2="280" />
        <line x1="400.6" y1="230.6" x2="387.9" y2="217.9" />
        <line x1="459" y1="185.7" x2="450" y2="170.2" />
        <line x1="527" y1="157.6" x2="522.3" y2="140.2" />
        <line x1="600" y1="148" x2="600" y2="130" />
        <line x1="673" y1="157.6" x2="677.7" y2="140.2" />
      </g>
      <g stroke="#ffb066" strokeWidth="1.2" strokeOpacity="0.8">
        <line x1="741" y1="185.7" x2="750" y2="170.2" />
        <line x1="799.4" y1="230.6" x2="812.1" y2="217.9" />
        <line x1="844.2" y1="289" x2="859.8" y2="280" />
        <line x1="872.4" y1="357" x2="889.8" y2="352.3" />
        <line x1="882" y1="430" x2="900" y2="430" />
      </g>
      {/* zone boundary strikes — longer, heavier */}
      <line x1="485.9" y1="185.3" x2="473.2" y2="158.1" stroke="#9a9ca0" strokeWidth="2" />
      <line x1="714.1" y1="185.3" x2="726.8" y2="158.1" stroke="#ffb066" strokeWidth="2" />

      {/* zone labels */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="12"
        letterSpacing="0.2em"
      >
        <text x="322" y="252" textAnchor="end" fill="#9a9ca0" fillOpacity="0.9">
          CLEAR
        </text>
        <text x="322" y="270" textAnchor="end" fill="#9a9ca0" fillOpacity="0.5" fontSize="9.5">
          MUFFLER ON · IDLES QUIET
        </text>
        <text x="600" y="104" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.75">
          GREY AREA
        </text>
        <text x="600" y="122" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.5" fontSize="9.5">
          OFFICER&rsquo;S JUDGEMENT
        </text>
        <text x="878" y="252" fill="#ffb066">
          FINE
        </text>
        <text x="878" y="270" fill="#ffb066" fillOpacity="0.6" fontSize="9.5">
          LOUD &amp; UNNECESSARY
        </text>
      </g>

      {/* ══ THE NEEDLE — buried in the fine zone at 55° ══ */}
      <line
        x1="578.2"
        y1="461.1"
        x2="744.5"
        y2="223.6"
        stroke="#ffb066"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="600" cy="430" r="10" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.6" />
      <circle cx="600" cy="430" r="3" fill="#ffd9ad" />
      {/* needle reading */}
      <path d="M 758 212 L 748 220" stroke="#ffd9ad" strokeWidth="0.75" strokeOpacity="0.6" fill="none" />
      <text
        x="764"
        y="210"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#ffd9ad"
      >
        REVVED AT A LIGHT
      </text>

      {/* ══ THE $1,000 CHIP ══ */}
      <path d="M 938 322 L 862 286" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />
      <rect x="940" y="298" width="158" height="58" rx="3" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.4" />
      <text
        x="1019"
        y="326"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="21"
        letterSpacing="0.08em"
        fill="#ffd9ad"
      >
        $1,000
      </text>
      <text
        x="1019"
        y="344"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9"
        letterSpacing="0.2em"
        fill="#9a9ca0"
      >
        FIRST OFFENCE · BYLAW 5590
      </text>

      {/* dial end labels */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
      >
        <text x="300" y="458" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.75">
          STOCK · AT IDLE
        </text>
        <text x="900" y="458" textAnchor="middle" fill="#ffb066" fillOpacity="0.85">
          STRAIGHT PIPE · WOT
        </text>
      </g>

      {/* ══ THE CITY UNDER THE DIAL ══ */}
      <ellipse cx="600" cy="562" rx="480" ry="38" fill="url(#ex-pool)" />
      <line x1="100" y1="560" x2="1100" y2="560" stroke="#9a9ca0" strokeOpacity="0.25" strokeWidth="1" />
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.55" strokeLinejoin="round">
        <path d="M 300 560 V 530 H 336 V 560" />
        <path d="M 348 560 V 502 H 366 V 490 H 384 V 560" />
        <path d="M 420 560 V 516 H 456 V 560" />
        <path d="M 470 560 V 508 H 480 V 496 H 500 V 560" />
        {/* the tall one */}
        <path d="M 560 560 V 450 H 592 V 560" />
        <line x1="576" y1="450" x2="576" y2="430" strokeWidth="1" strokeOpacity="0.7" />
        <path d="M 640 560 V 480 H 668 V 560" />
        <path d="M 680 560 V 520 H 720 V 560" />
        <path d="M 760 560 V 540 H 800 V 560" />
        <path d="M 812 560 V 526 H 842 V 560" />
      </g>
      {/* lit windows on the tall one — the only light left on */}
      <g fill="#ffd9ad">
        <rect x="568" y="466" width="4" height="4" fillOpacity="0.55" />
        <rect x="580" y="466" width="4" height="4" fillOpacity="0.35" />
        <rect x="568" y="502" width="4" height="4" fillOpacity="0.3" />
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
        FIG. A — THE NOISE GAUGE · WHERE THE TICKET LIVES
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Yes — exhaust mods are legal in Alberta, with two conditions. The vehicle must keep a
        working muffler with no device that increases noise or throws flames, and the noise it
        makes on the street has to stay inside provincial and municipal noise rules. The hardware
        is rarely the problem. The volume, and the driving, are.
      </p>

      <h2>Are aftermarket exhausts legal in Alberta?</h2>
      <p>
        There is no law against an aftermarket exhaust. There is no approved-brand list, no
        aftermarket-parts inspection, and — for street vehicles — no decibel number printed in the
        provincial regulation. What Alberta actually runs is a two-layer system, and understanding
        the layers is the whole game.
      </p>
      <p>
        <strong>Layer one is provincial equipment law</strong> — the Vehicle Equipment Regulation
        under the Traffic Safety Act, which says what must be bolted to the car: a functioning
        muffler, no widened outlet, no noise-increasing devices.
        <a href="#src-1" className="cite-ref">[1]</a> This layer judges the hardware, and it applies
        identically in Edmonton, Leduc, and a gravel road outside Vegreville.
      </p>
      <p>
        <strong>Layer two is noise enforcement</strong> — a provincial ban on loud and unnecessary
        noise from a vehicle, plus whatever your municipality adds on top.
        <a href="#src-2" className="cite-ref">[2]</a> This layer judges the sound and the behaviour,
        and in Edmonton it now carries the four-figure fine that made the news. A system can pass
        layer one all day and still buy you a ticket under layer two before you clear the
        intersection.
      </p>
      <p>
        This article goes deep on those two layers. For the rest of the rulebook — tint, lift
        height, out-of-province inspections, antique plates, insurance — the wide-angle version
        lives in the <Link href="/guides/alberta-laws">Alberta modified vehicle laws guide</Link>.
      </p>

      <h2>What does the Vehicle Equipment Regulation actually require?</h2>
      <p>
        Section 61 of the Vehicle Equipment Regulation (Alta Reg 122/2009) is short, and every word
        of it matters to a build. A motor vehicle with an internal combustion engine must have an
        exhaust muffler that cools and expels the gases <strong>without excessive noise and without
        producing flames or sparks</strong>. On top of that, you may not drive a vehicle whose
        muffler outlet has been widened, and you may not attach any device to the exhaust system
        that increases the noise or lets a flame ignite from it.
        <a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        Read that against the common mods and the verdicts fall out on their own:
      </p>
      <ul>
        <li>
          <strong>Muffler delete or straight pipe — not legal.</strong> The regulation requires a
          muffler. Removing it is not a grey area; it is the removal of mandatory equipment, and it
          is chargeable before anyone argues about how loud the car actually is.
        </li>
        <li>
          <strong>Exhaust cutouts — not legal on the street.</strong> An electric cutout is close
          to the dictionary definition of a device attached to the exhaust system that increases
          noise. That is why they are sold as off-road or competition parts.
        </li>
        <li>
          <strong>Flame kits and aggressive crackle tunes — not legal.</strong> The flames-and-sparks
          language is aimed squarely at them. A tune that turns the overrun into a fireworks show
          is an equipment violation with the evidence built in.
        </li>
        <li>
          <strong>A quality cat-back or axle-back with real mufflers — legal hardware.</strong>{" "}
          Muffler present, outlet unmodified, nothing added to make it louder. This is the
          configuration the regulation contemplates, and it is how most of the systems leaving this
          shop are built.
        </li>
      </ul>
      <p>
        Separately from the equipment rules, Alberta&rsquo;s rules of the road prohibit creating or
        causing <strong>loud and unnecessary noise</strong> from a vehicle or any part of it.
        <a href="#src-2" className="cite-ref">[2]</a> That is the catch-all — no decibel meter
        required, judged by the officer on scene. It is also the provision that catches a
        perfectly legal system driven like a nuisance: the noise was loud, and revving at a
        crosswalk made it unnecessary. Two boxes, ticked.
      </p>

      <h2>How much is Edmonton&rsquo;s loud-vehicle fine?</h2>
      <p>
        One thousand dollars for a first offence. In February 2023, Edmonton city council voted
        12&ndash;0 to amend the city&rsquo;s Traffic Bylaw so that excessive and unnecessary
        vehicle noise draws a <strong>$1,000 fine on the first offence and $2,000 on subsequent
        ones</strong>. The bylaw had previously targeted noisy motorcycles; the amendment expanded
        it to every vehicle on the road.<a href="#src-3" className="cite-ref">[3]</a>
      </p>
      <p>
        The city&rsquo;s own guidance lists the full menu an officer can order from — the
        provincial noise and equipment provisions plus section 90.1 of Traffic Bylaw 5590 — with
        specified penalties running from $162 up to the $1,000 bylaw ticket.
        <a href="#src-2" className="cite-ref">[2]</a> Which charge you get is the officer&rsquo;s
        call. The cheap provincial ticket and the expensive municipal one can arise from the same
        thirty seconds of driving.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$1,000</span>
          <span className="stat-l">Edmonton first-offence noise fine, per the 2023 amendment</span>
        </div>
        <div>
          <span className="stat-v">$2,000</span>
          <span className="stat-l">Repeat offence under the same bylaw</span>
        </div>
        <div>
          <span className="stat-v">$162+</span>
          <span className="stat-l">Provincial noise and equipment tickets start here</span>
        </div>
        <div>
          <span className="stat-v">10 PM–7 AM</span>
          <span className="stat-l">Edmonton&rsquo;s residential quiet window</span>
        </div>
      </div>
      <p>
        How it works in practice: enforcement is complaint-driven and seasonal. Vehicle noise is
        one of the most-searched complaint topics on the city&rsquo;s website every summer, which
        is exactly why council reached for a four-figure number.
        <a href="#src-3" className="cite-ref">[3]</a> Assume attention from May through September,
        downtown, on Whyte, and along the known cruise routes. Fine schedules change — treat the
        figures above as the amounts set in 2023, and confirm the current numbers with the City of
        Edmonton before you rely on them.
      </p>

      <h2>Are noise cameras coming to Edmonton?</h2>
      <p>
        They are being tested. They are not writing tickets.
      </p>
      <p>
        In August 2025, city council approved a <strong>$50,000 pilot project</strong> to deploy
        automated noise-monitoring technology — cameras paired with microphones — against noisy
        vehicles.<a href="#src-4" className="cite-ref">[4]</a> The critical detail sits under the
        headline: provincial rules do not currently allow automated enforcement of vehicle noise,
        so the pilot is a data-collection exercise, not a photo-radar-for-sound program. Council
        also asked for a report on the pilot and on future enforcement options, with reporting
        expected around early 2027, and administration cautioned that $50,000 may be optimistic —
        an earlier monitoring pilot in 2020 reportedly cost around $200,000.
      </p>
      <p>
        So the honest status for 2026: the microphones are real, the appetite at city hall is
        real, and the automated ticket does not exist yet. The data the pilot collects is openly
        intended as ammunition for asking the province to change that. If your plan for a loud car
        is &ldquo;there are no noise cameras,&rdquo; understand that you are betting against a
        stated direction of travel — and that a constable with ears has been able to write the
        $1,000 ticket since 2023 regardless.
      </p>

      <h2>What actually gets you ticketed — and what won&rsquo;t?</h2>
      <p>
        Pattern from the street: equipment charges follow obvious hardware, and the expensive
        bylaw ticket follows behaviour. Here is the honest map.
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Common exhaust setups and behaviours compared by how Alberta law treats them and the
            realistic ticket risk
          </caption>
          <thead>
            <tr>
              <th scope="col">The move</th>
              <th scope="col">How the law reads it</th>
              <th scope="col">Realistic risk</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Muffler delete / straight pipe</th>
              <td>Required equipment missing — s. 61 violation on sight</td>
              <td>High. Chargeable at any traffic stop, loud or not</td>
            </tr>
            <tr>
              <th scope="row">Cutout open on a city street</th>
              <td>Attached device that increases noise — prohibited</td>
              <td>High, and it invites the noise charge on top</td>
            </tr>
            <tr>
              <th scope="row">Flame kit, heavy crackle tune</th>
              <td>Flames and sparks from the exhaust — prohibited</td>
              <td>High. The evidence is visible from a block away</td>
            </tr>
            <tr>
              <th scope="row">Revving at a light, loud launches downtown</th>
              <td>Loud and unnecessary noise — driver behaviour</td>
              <td>The classic $1,000 ticket. Season and location dependent</td>
            </tr>
            <tr>
              <th scope="row">Cold-start idling at 6:30 AM on a crescent</th>
              <td>Nuisance noise in the residential quiet window</td>
              <td>Complaint-driven. Your neighbours are the sensor</td>
            </tr>
            <tr>
              <th scope="row">Quality cat-back, quiet at idle, driven normally</th>
              <td>Compliant equipment, reasonable noise</td>
              <td>Low. This is the configuration the rules permit</td>
            </tr>
            <tr>
              <th scope="row">Stock or stock-equivalent system</th>
              <td>Compliant by definition — unless driven to make noise</td>
              <td>Lowest. Behaviour can still convert it to a ticket</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Notice what is missing from the high-risk rows: any mention of brand, price, or whether
        the parts came from the factory. Enforcement does not care what the receipt says. It cares
        whether there is a muffler, whether something was added to defeat it, and whether the
        street heard you before it saw you.
      </p>

      <h2>What is the overnight residential rule?</h2>
      <p>
        Edmonton&rsquo;s Community Standards Bylaw handles nuisance noise of every kind, and its
        default position is that most noise belongs between <strong>7 AM and 10 PM</strong>. Vehicle
        noise that disturbs people — loud stereos, modified exhausts, revving, careless operation —
        is squarely inside its scope, and complaints route through 311.
        <a href="#src-5" className="cite-ref">[5]</a>
      </p>
      <p>
        For a classic or a built car, this rule has one very specific bite: the cold start. A
        big-cam V8 with long-tube headers is at its loudest and least controllable in the first
        ninety seconds of a cold morning, and that is precisely when the bylaw is most protective.
        The fix is scheduling, not silence. Start it after seven where you can, skip the driveway
        warm-up concert, and roll out of the neighbourhood at low throttle before the first real
        pull. The car warms up faster under gentle load anyway — the bylaw and the engine builder
        agree on this one.
      </p>
      <blockquote>
        <p>
          Nobody ever got the $1,000 ticket for how their car sounded. They got it for when, and
          where, and how long they made it sound that way.
        </p>
        <footer>Shop observation, several summers running</footer>
      </blockquote>

      <h2>How do you build a system that sounds good and still passes?</h2>
      <p>
        Treat it as a fabrication problem with three constraints: tone under load, manners at
        idle, and nothing on the car the regulation prohibits. That triangle is very buildable.
      </p>
      <ul>
        <li>
          <strong>Keep a real muffler in the system.</strong> Not negotiable, legally or
          acoustically. Modern straight-through mufflers flow within a rounding error of open
          pipe while taking the crack off the sound. You give up almost nothing.
        </li>
        <li>
          <strong>Use the resonator instead of deleting it.</strong> Resonator selection and
          placement are how you kill drone at 110 km/h without muzzling the car at full throttle.
          Deleting it to chase volume is how a good system becomes a headache with a ticket
          attached.
        </li>
        <li>
          <strong>Size the pipe for the engine, not the catalogue.</strong> Oversized pipe on a
          mild engine is all bark and no torque. Correct diameter keeps velocity up, sounds
          deeper, and drones less.
        </li>
        <li>
          <strong>Skip the cutouts and the flame tune for a street car.</strong> Both sit on the
          wrong side of the equipment regulation, and both turn every traffic stop into an
          argument you lose. Save the theatre for the track, where it belongs.
        </li>
        <li>
          <strong>Judge the result at idle, outside the car.</strong> The build target we use:
          under load it should sound like the engine you paid for; sitting at a light it should
          be a rumble, not an event. That combination passes the officer test because it passes
          the neighbour test.
        </li>
      </ul>
      <p>
        This is exactly the work that lives on the{" "}
        <Link href="/services/classic-performance-tuning">performance and tuning page</Link> —
        exhaust systems built and fitted for classics and muscle, dialed for how the car is
        actually driven. None of this is legal advice, and fine amounts and enforcement tools
        move; the general questions people ask before booking are answered on the{" "}
        <Link href="/faq">FAQ page</Link>, and the binding answers always come from Alberta
        Transportation and the City of Edmonton.
      </p>
      <p>
        If you are planning an exhaust for a classic, a restomod, or a fresh swap, tell us what
        the car is and how you drive it through the <Link href="/quote">quote page</Link>. You
        will get a straight answer on what will sound right, what will pass, and where those two
        things need a better plan than a sawzall.
      </p>
    </>
  );
}
