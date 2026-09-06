import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Disc Brake Conversion Cost, Canada.
 * The stopping-power wedge for the restomod livability cluster: can drums
 * hold a classic in 2026 traffic, what a conversion actually changes, and
 * hedged CAD ranges for front versus four-wheel. Links down into restomods,
 * the restomod definition, daily-driving Alberta, the costs guide, and quote.
 */

export const meta: ArticleMeta = {
  slug: "disc-brake-conversion-cost-canada",
  title:
    "Can You Stop a Classic with Drums in 2026 Traffic? Disc Conversion Costs in Canada",
  accent: "Drums",
  metaTitle: "Classic Disc Brake Conversion Cost",
  description: "CAD ranges for converting a classic from drums to discs — front versus four-wheel, why the master cylinder matters, and what 2026 traffic actually demands.",
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  author: "2240 Speed Shop",
  category: "Restomods",
  targetKeywords: [
    "disc brake conversion cost Canada",
    "drum to disc conversion classic car",
    "classic car disc brakes Edmonton",
    "front disc conversion cost",
    "can you daily drive a classic with drums",
  ],
  faq: [
    {
      q: "How much does a disc brake conversion cost in Canada?",
      a: "A front disc conversion on a common classic typically lands in the $2,500 to $6,000 CAD range installed, covering the kit, a dual-circuit master cylinder, lines, and labour. A four-wheel disc job commonly runs $4,500 to $8,500, and a big-brake kit behind larger wheels can push $6,000 to $12,000 or more. Every figure is a planning range, not a quote — spindle type, booster, proportioning, and wheel clearance move the number.",
    },
    {
      q: "Can I keep rear drums and only convert the front to discs?",
      a: "Yes, and for most street-driven classics it is the right first move. The front axle does most of the stopping work, so a quality front disc kit with a matched master cylinder and an adjustable proportioning valve will transform the pedal without the parking-brake complications rear discs bring. Keep the rear drums fresh, shoes and hardware new, and the self-adjusters working. Rear discs earn their keep on a heavy car, a mountain-road car, or a restomod with real power.",
    },
    {
      q: "Do I need a new master cylinder for a disc conversion?",
      a: "Almost always. Drum masters are small-bore units with residual-pressure valves sized for shoes inside a drum. Discs need more fluid volume and different residual pressure, so the old master will give you a long pedal or dragging pads. A dual-circuit master — and usually a booster that actually fits the firewall — is part of the conversion, not an optional extra. Skip it and the calipers you paid for will never feel right.",
    },
    {
      q: "Will a disc conversion pass an Alberta vehicle inspection?",
      a: "A properly installed conversion with a dual-circuit hydraulic system, working parking brake, and even braking left to right is what inspectors want to see. Alberta's vehicle-inspection program is looking for a car that stops, not for factory drums. What fails inspections is hack work: a single-circuit master left in place, a parking brake that no longer holds, mismatched hose lengths, or a proportioning valve that dumps the rear into lockup. Build it as a system and the paperwork is a formality.",
    },
    {
      q: "Do disc brakes hurt a classic car's value?",
      a: "On a rare, numbers-matching car, originality still carries the money and reversible upgrades are kinder than cutting. On the common driver-grade cars that come through this door, a well-executed disc conversion is what buyers of restomods expect — Barrett-Jackson's restomod market has been pricing modern brakes as part of the build, not a deduction. Build quality is the value. A tidy, documented conversion helps. A hacked one subtracts.",
    },
  ],
  citations: [
    {
      name: "Wilwood Disc Brakes, “Bolt-On Brake Kits” — Classic Series drum-to-disc conversions",
      url: "https://www.wilwood.com/BrakeKits/BrakeKitLanding",
    },
    {
      name: "“Classic Cars, Modern Markets Report Now Available,” Specialty Equipment Market Association (SEMA)",
      url: "https://www.sema.org/get-involved/councils-networks/hria/classic-cars-modern-markets-report-now-available",
    },
    {
      name: "“Safety standards for vehicles,” Transport Canada — Canada Motor Vehicle Safety Standards",
      url: "https://tc.canada.ca/en/road-transportation/safety-standards-vehicles-tires-child-car-seats/safety-standards-vehicles",
    },
    {
      name: "“Vehicle inspections,” Government of Alberta",
      url: "https://www.alberta.ca/vehicle-inspections",
    },
    {
      name: "Rick Carey, “For These Corvettes, the Stock vs. Modified Debate Has a Clear Winner,” Hagerty Insider, February 2024",
      url: "https://www.hagerty.com/media/market-trends/hagerty-insider/c2-stock-v-restomod/",
    },
    {
      name: "“The Art of Resto-Mods: Where Classic Aesthetics Meet Modern Performance,” Barrett-Jackson",
      url: "https://www.barrett-jackson.com/media/articles/the-art-of-resto-mods-where-classic-aesthetics-meet-modern-performance",
    },
  ],
  internalLinks: [
    "/services/restomods-custom-builds",
    "/blog/what-is-a-restomod",
    "/blog/daily-driving-a-classic-in-alberta",
    "/guides/costs",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * Split-view front hub: left of the seam, a period drum in steel line art;
 * right of the seam, the same spindle x-rayed with a disc, four-piston caliper,
 * and dual-circuit master called out in tungsten. Two stopping-distance bars
 * underneath make the traffic argument without a cartoon. Editorial plate.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical split-view diagram of a classic front hub: the left half drawn as a period drum brake in steel line art, the right half x-rayed to show a disc rotor, four-piston caliper, and dual-circuit master cylinder highlighted in tungsten, with two stopping-distance bars underneath comparing drums to discs in 2026 traffic"
      className="h-auto w-full"
    >
      <title>Same spindle, two eras — drums fade, discs clamp</title>
      <defs>
        <radialGradient id="db-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="db-seam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a9ca0" stopOpacity="0" />
          <stop offset="18%" stopColor="#9a9ca0" stopOpacity="0.5" />
          <stop offset="82%" stopColor="#9a9ca0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9a9ca0" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="600" cy="430" rx="420" ry="40" fill="url(#db-pool)" />
      <line x1="80" y1="430" x2="1120" y2="430" stroke="#9a9ca0" strokeOpacity="0.25" strokeWidth="1" />

      {/* ══ LEFT — PERIOD DRUM ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="340" cy="280" r="118" strokeWidth="2.2" />
        <circle cx="340" cy="280" r="102" strokeWidth="1.2" strokeOpacity="0.55" />
        <circle cx="340" cy="280" r="78" strokeWidth="1.6" />
        {/* shoes */}
        <path d="M 278 232 A 72 72 0 0 1 278 328" strokeWidth="8" strokeOpacity="0.55" />
        <path d="M 402 232 A 72 72 0 0 0 402 328" strokeWidth="8" strokeOpacity="0.55" />
        {/* wheel cylinder */}
        <rect x="324" y="196" width="32" height="22" rx="3" strokeWidth="1.4" />
        <line x1="328" y1="218" x2="318" y2="236" strokeWidth="1.2" />
        <line x1="368" y1="218" x2="378" y2="236" strokeWidth="1.2" />
        {/* hub + studs */}
        <circle cx="340" cy="280" r="18" strokeWidth="1.6" />
        <circle cx="340" cy="280" r="5" strokeWidth="1.3" />
        <g strokeWidth="1.1" strokeOpacity="0.7">
          <circle cx="340" cy="248" r="3.5" />
          <circle cx="368" cy="264" r="3.5" />
          <circle cx="358" cy="300" r="3.5" />
          <circle cx="322" cy="300" r="3.5" />
          <circle cx="312" cy="264" r="3.5" />
        </g>
        {/* heat ticks */}
        <g strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3 5">
          <line x1="340" y1="150" x2="340" y2="162" />
          <line x1="250" y1="220" x2="262" y2="228" />
          <line x1="430" y1="220" x2="418" y2="228" />
        </g>
      </g>

      {/* ══ RIGHT — DISC X-RAY ══ */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="860" cy="280" r="118" stroke="#9a9ca0" strokeWidth="2" strokeOpacity="0.45" />
        <circle cx="860" cy="280" r="78" stroke="#ffb066" strokeWidth="2" />
        <circle cx="860" cy="280" r="64" stroke="#ffb066" strokeWidth="0.9" strokeOpacity="0.5" strokeDasharray="3 5" />
        <circle cx="860" cy="280" r="18" stroke="#ffb066" strokeWidth="1.5" />
        <circle cx="860" cy="280" r="6" stroke="#ffb066" strokeWidth="1.3" />
        {/* caliper astride the rotor, upper rear */}
        <path d="M 792 214 A 92 92 0 0 1 860 188" stroke="#ffd9ad" strokeWidth="14" strokeOpacity="0.95" />
        <rect x="778" y="198" width="36" height="28" rx="3" stroke="#ffd9ad" strokeWidth="1.4" />
        {/* piston ticks */}
        <g stroke="#ffd9ad" strokeWidth="1.1" strokeOpacity="0.8">
          <line x1="786" y1="204" x2="786" y2="220" />
          <line x1="798" y1="204" x2="798" y2="220" />
          <line x1="806" y1="204" x2="806" y2="220" />
          <line x1="818" y1="204" x2="818" y2="220" />
        </g>
        {/* spokes */}
        <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.55">
          <line x1="860" y1="262" x2="860" y2="216" />
          <line x1="876" y1="272" x2="918" y2="248" />
          <line x1="872" y1="294" x2="906" y2="328" />
          <line x1="848" y1="294" x2="814" y2="328" />
          <line x1="844" y1="272" x2="802" y2="248" />
        </g>
      </g>

      {/* dual-circuit master, ghosted above the disc side */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.4" strokeLinejoin="round">
        <rect x="980" y="86" width="92" height="36" rx="4" />
        <rect x="1072" y="94" width="28" height="20" rx="2" />
        <line x1="1026" y1="122" x2="1026" y2="148" strokeWidth="1.1" />
        <line x1="1048" y1="122" x2="1048" y2="148" strokeWidth="1.1" />
        <path d="M 1026 148 Q 980 170 900 214" strokeWidth="1" strokeOpacity="0.7" strokeDasharray="4 5" />
      </g>

      {/* ══ THE SEAM ══ */}
      <line x1="600" y1="48" x2="600" y2="448" stroke="url(#db-seam)" strokeWidth="1" strokeDasharray="6 7" />
      <rect x="596" y="44" width="8" height="8" transform="rotate(45 600 48)" fill="#ffb066" fillOpacity="0.9" />

      {/* ══ STOPPING BARS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="10" letterSpacing="0.16em">
        <text x="80" y="500" fill="#9a9ca0" fillOpacity="0.7">
          110 KM/H · TYPICAL STOP
        </text>
        <text x="80" y="536" fill="#9a9ca0" fillOpacity="0.85">
          DRUMS
        </text>
        <rect x="180" y="522" width="760" height="14" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7" />
        <text x="80" y="576" fill="#ffb066">
          DISCS
        </text>
        <rect x="180" y="562" width="520" height="14" fill="#ffb066" fillOpacity="0.35" stroke="#ffb066" strokeWidth="1.4" />
        <text x="960" y="536" fill="#9a9ca0" fillOpacity="0.55">
          FADE + LOCK
        </text>
        <text x="720" y="576" fill="#ffd9ad">
          SHORTER, STRAIGHT
        </text>
      </g>

      {/* leaders */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 860 86 L 860 188" />
        <path d="M 1120 104 L 1072 104" />
        <path d="M 1120 248 L 938 248" />
      </g>
      <g stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 80 196 L 324 208" />
        <path d="M 80 280 L 222 280" />
      </g>

      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
      >
        <text x="580" y="72" textAnchor="end" fill="#9a9ca0" fillOpacity="0.85">
          AS DELIVERED · DRUM
        </text>
        <text x="620" y="72" fill="#ffb066">
          AS BUILT · DISC
        </text>
        <text x="80" y="190" fill="#9a9ca0" fillOpacity="0.85">
          WHEEL CYLINDER + SHOES
        </text>
        <text x="80" y="274" fill="#9a9ca0" fillOpacity="0.85">
          HEAT STAYS IN THE DRUM
        </text>
        <text x="860" y="78" textAnchor="middle" fill="#ffb066">
          FOUR-PISTON CALIPER
        </text>
        <text x="1160" y="100" textAnchor="end" fill="#ffb066">
          DUAL-CIRCUIT MASTER
        </text>
        <text x="1160" y="252" textAnchor="end" fill="#ffb066">
          VENTED ROTOR
        </text>
        <text x="600" y="636" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.55" fontSize="10">
          FIG. A — SAME SPINDLE, TWO ERAS: DRUMS FADE, DISCS CLAMP
        </text>
      </g>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Not reliably. Factory drums from the fifties and sixties were never designed for 110 km/h
        traffic, ABS-equipped neighbours, or a restomod&rsquo;s extra power. A disc conversion
        typically lands in the $2,500 to $6,000 CAD range for a front-end job and $4,500 to $8,500
        for four-wheel discs — planning ranges, not quotes. The pedal you can trust is the job.
      </p>

      <h2>Why do factory drums fail in 2026 traffic?</h2>
      <p>
        Drums stop a car by expanding shoes against the inside of a spinning hat. The physics
        worked in 1964, at 70 km/h, behind a 250-horsepower small-block, with a following distance
        nobody uses anymore. Heat has nowhere to go except into the drum. After two or three hard
        stops the shoes glaze, the drum bell-mouths, and the pedal you had a minute ago is gone.
        That fade is not gradual. It is sudden.
      </p>
      <p>
        Modern traffic makes the problem worse, not better. The Henday at rush hour is a string of
        110 km/h stops behind vehicles that can dump speed with ABS and stability control. Your
        classic has neither. A{" "}
        <Link href="/blog/daily-driving-a-classic-in-alberta">daily-driven Alberta classic</Link>{" "}
        that still wears four-wheel drums is asking a sixty-year-old hydraulic design to do a
        twenty-first-century job. Transport Canada writes the Canada Motor Vehicle Safety Standards
        that new vehicles have to meet for hydraulic brake performance; a 1967 Camaro was never
        certified to those numbers, and it does not magically acquire them because the roads got
        faster.<a href="#src-3" className="cite-ref">[3]</a>
      </p>
      <blockquote>
        <p>
          Horsepower is a hobby. Brakes are a promise. Fit the promise to the traffic, not the
          brochure.
        </p>
        <footer>Shop rule, written above the brake lathe</footer>
      </blockquote>

      <h2>What does a disc conversion actually change?</h2>
      <p>
        A conversion is a system, not a pair of rotors. Aftermarket kits for common classics — GM
        A-bodies, early Mustangs, C10s — bolt to the original spindle with a one-piece hub and
        rotor, a four-piston caliper, brackets, and hardware, and they are intended to clear
        popular 14- and 15-inch disc-brake wheels with no spindle machining.
        <a href="#src-1" className="cite-ref">[1]</a> That is the easy half. The half that decides
        whether the car actually stops:
      </p>
      <ul>
        <li>
          <strong>Master cylinder.</strong> Discs need more fluid volume and different residual
          pressure than drums. Leave the original single-circuit drum master in place and you get
          a long pedal, or pads that never quite release.
        </li>
        <li>
          <strong>Booster.</strong> A firewall-mounted vacuum booster that actually fits the engine
          bay, or a hydra-boost setup on a diesel swap. Measure twice. Many period firewalls were
          never designed around a seven-inch can.
        </li>
        <li>
          <strong>Proportioning.</strong> Mix front discs with rear drums — the usual street setup —
          and an adjustable proportioning valve is what keeps the rear from locking first. Get the
          bias wrong and the car swaps ends under a hard stop.
        </li>
        <li>
          <strong>Lines, hoses, and fluid.</strong> New stainless or NiCopp lines, flex hoses rated
          for the caliper, DOT 4, and a complete bleed. Old rubber hoses balloon and steal pedal.
        </li>
        <li>
          <strong>Wheels.</strong> Most conversion rotors want a 15-inch minimum. Factory 14-inch
        drum wheels often will not clear the caliper. Confirm backspacing before the kit is ordered.
        </li>
      </ul>
      <p>
        That list is why this lives inside a{" "}
        <Link href="/services/restomods-custom-builds">restomod and custom build</Link> rather than
        a Saturday parts run. SEMA&rsquo;s classic-car research has been saying the same thing for
        years: owners under 45 are restomodding — brakes, suspension, drivetrain — rather than
        preserving the fade their parents learned to live with.
        <a href="#src-2" className="cite-ref">[2]</a>
      </p>

      <h2>How much does a disc brake conversion cost in Canada?</h2>
      <p>
        Typical planning ranges in 2026 Canadian dollars, before GST — not quotes. Your spindle,
        booster, and wheel choice will move the number:
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$2.5K–$6K</span>
          <span className="stat-l">Typical front disc conversion, installed</span>
        </div>
        <div>
          <span className="stat-v">$4.5K–$8.5K</span>
          <span className="stat-l">Typical four-wheel disc conversion, installed</span>
        </div>
        <div>
          <span className="stat-v">$6K–$12K+</span>
          <span className="stat-l">Big-brake kit behind 17-inch-plus wheels</span>
        </div>
        <div>
          <span className="stat-v">12–28 hrs</span>
          <span className="stat-l">Shop hours on a straightforward bolt-on</span>
        </div>
      </div>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Disc brake conversion scopes compared by what is included, typical CAD planning range,
            and the owner it fits
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Front discs, rear drums</th>
              <th scope="col">Four-wheel discs</th>
              <th scope="col">Big-brake kit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">What you buy</th>
              <td>Front kit, dual-circuit master, proportioning valve, hoses</td>
              <td>Front and rear kits, master, booster, parking-brake solution</td>
              <td>Larger rotors and multi-piston calipers, usually 17-inch wheels</td>
            </tr>
            <tr>
              <th scope="row">Typical CAD range</th>
              <td className="num">$2,500 – $6,000</td>
              <td className="num">$4,500 – $8,500</td>
              <td className="num">$6,000 – $12,000+</td>
            </tr>
            <tr>
              <th scope="row">Right owner</th>
              <td>Street driver, first livability upgrade</td>
              <td>Heavier car, mountain roads, real power</td>
              <td>Pro-touring restomod, track days</td>
            </tr>
            <tr>
              <th scope="row">The catch</th>
              <td>Rear drums must be fresh and self-adjusting</td>
              <td>Parking brake is the integration headache</td>
              <td>Will not fit period 14- or 15-inch steel wheels</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The kit is the cheap line. Labour, the master, the booster, a shortened or rebuilt
        proportioning circuit, and a set of wheels that actually clear the caliper are where the
        invoice grows. The full picture of where restoration and restomod money goes, stage by
        stage, is in the <Link href="/guides/costs">restoration cost guide</Link>.
      </p>

      <h2>Front discs only, or four-wheel?</h2>
      <p>
        For a street car that sees summer evenings and the odd highway run, front discs and fresh
        rear drums are the honest answer. The front axle does most of the work. A matched master
        and an adjustable proportioning valve will make the car stop straight from highway speed
        without turning the parking brake into a science project. Rear discs need a separate
        parking-brake mechanism — a drum-in-hat, a mechanical caliper, or an electric actuator —
        and that is hours.
      </p>
      <p>
        Four-wheel discs earn the extra money on a heavy truck, a car that will see mountain grades
        or repeated hard stops, or a restomod whose engine makes numbers the factory drums never
        saw. Barrett-Jackson has been treating four-wheel discs as standard equipment on the
        restomods that actually sell, not as a novelty.
        <a href="#src-6" className="cite-ref">[6]</a> Match the brakes to the power, not the
        catalogue.
      </p>

      <h2>Will it pass an Alberta inspection?</h2>
      <p>
        Alberta inspects for a car that stops, not for a factory drum. A dual-circuit hydraulic
        system, even braking side to side, a parking brake that holds, and hoses that are not
        cracked are what the inspector is paid to find.
        <a href="#src-4" className="cite-ref">[4]</a> What fails is the conversion that left the
        single-circuit master in place, deleted the parking brake, or used brake hose from a
        hardware aisle. Build it as one system and the inspection is a signature.
      </p>
      <p>
        One honest caveat, the same one that sits on the{" "}
        <Link href="/blog/what-is-a-restomod">restomod definition</Link>: rare, documented,
        numbers-matching cars still store their value in originality.
        <a href="#src-5" className="cite-ref">[5]</a> A disc conversion on a documented big-block
        car should make you pause. A farm truck with faded paint and a seized six should not.
      </p>
      <p>
        If the car is coming in for brakes as part of a larger plan — stance, power, the rest of
        the spine — send what you have through the <Link href="/quote#form">quote page</Link>. Photos of
        the spindle, the wheels you want to keep, and the engine that will actually have to stop
        are enough for a straight range. The first honest answer on a lot of these is: convert the
        front, refresh the rear, and drive it.
      </p>
    </>
  );
}
