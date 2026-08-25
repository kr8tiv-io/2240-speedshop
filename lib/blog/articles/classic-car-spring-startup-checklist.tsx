import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 11 — Spring Start-Up Checklist.
 * The April mirror of the winter guide, and the direct feeder for spring
 * service bookings. Links down into the winter guide, the performance and
 * tuning service, the carburetor article, the barn-find protocol, and the
 * quote page.
 */

export const meta: ArticleMeta = {
  slug: "classic-car-spring-startup-checklist",
  title: "Waking a Classic After Winter: The Spring Start-Up Checklist",
  accent: "Spring",
  metaTitle: "Spring Start-Up Checklist for a Classic After Winter Storage",
  description:
    "Every check before the first start after winter storage — nests, fluids, battery, tires, fuel, and brakes, in the order a working Edmonton shop does them.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Keep It Running",
  targetKeywords: [
    "classic car spring startup checklist",
    "starting a car after winter storage",
    "first start after storage",
    "classic car maintenance Edmonton",
    "taking a classic out of storage",
  ],
  faq: [
    {
      q: "What should I check before starting my classic after winter storage?",
      a: "Work one sequence before the key: pull the air cleaner lid and check for rodent nests and chewed wiring, check oil, coolant, and brake fluid levels, charge and test the battery, set all four tires to spec cold, and read the floor for new stains. Then crank with the ignition disabled until oil pressure registers, let it fire on fast idle, and test the brakes at walking pace before the road.",
    },
    {
      q: "Should I change the oil before the first drive in spring?",
      a: "If the oil was changed just before storage and the dipstick smells like oil, check the level and drive — then change it after the first few short runs, which flushes out the winter's condensation. If the car went to bed on old oil, or the dipstick smells of gasoline, change it before the engine runs at all. Fuel-thinned oil stops protecting bearings, and finding the source matters more than the drive.",
    },
    {
      q: "Is the gas still good after a winter in the tank?",
      a: "A tank that was topped up and stabilized in the fall is normally fine after four to six months. Untreated pump gas is the gamble: the ethanol in it absorbs water all winter, and that water-ethanol mix settles to the bottom of the tank — exactly where the pickup drinks first. If the fuel smells sour or varnish-like at the filler, drain the carburetor bowl, run fresh premium in on top, and let dilution do the rest.",
    },
    {
      q: "Why does my classic crank but not start after sitting all winter?",
      a: "Check the cheap causes in order. A carburetor float bowl evaporates dry over a winter, so the engine needs fifteen to thirty seconds of cranking, or a small prime, before fuel arrives. Battery voltage that cranks slowly also sparks weakly. Condensation inside a distributor cap kills spark outright — pull the cap and dry it. If it still will not light off, stop cranking and diagnose; flooding a cold engine washes the cylinders down.",
    },
    {
      q: "When can I drive my classic in Edmonton in the spring?",
      a: "When the street sweepers have been through and a rain has rinsed the winter gravel and salt residue off your routes — around Edmonton that usually means late April into May. If the car wears Alberta antique plates, remember the class is restricted: exhibitions, parades, club events, travel to and from them, and service appointments, not general daily use. Call your insurer before the first drive if coverage was reduced for storage.",
    },
  ],
  citations: [
    {
      name: "Rob Siegel, “11 Checks to Make Before Your Classic's First Spring Drive,” Hagerty Media",
      url: "https://www.hagerty.com/media/maintenance-and-tech/11-checks-to-make-before-your-first-springtime-drive/",
    },
    {
      name: "“Tires,” Transport Canada road transportation safety",
      url: "https://tc.canada.ca/en/road-transportation/motor-vehicle-safety/tires",
    },
    {
      name: "David Bellm, “Winter Storage: Is Your Fuel System Ready?,” Holley Motor Life technical library",
      url: "https://www.holley.com/blog/post/winter_storage_is_your_fuel_system_ready_/",
    },
    {
      name: "“Ethanol,” Natural Resources Canada",
      url: "https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/ethanol",
    },
    {
      name: "“Licence plates,” Government of Alberta",
      url: "https://www.alberta.ca/licence-plates",
    },
  ],
  internalLinks: [
    "/guides/winter",
    "/blog/barn-find-first-steps",
    "/blog/carburetor-rebuild-signs",
    "/services/classic-performance-tuning",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * A classic in side profile, car cover half pulled back, with the seven
 * spring-check zones pinned in tungsten and numbered to match the article —
 * nest in the air cleaner, fluids at the cowl, battery, fuel tank, a
 * flat-spotted front tire, the rear brake drum, and a packed tailpipe. A
 * fading snowflake and an April sun bracket the scene. Editorial plate in the
 * shop style: steel line art, mono labels, sourced glow.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical side-profile diagram of a classic car with its storage cover half pulled back, drawn in steel line art, with seven numbered tungsten callout pins marking the spring start-up checks: rodent nests in the air cleaner and heater box, fluid levels at the cowl, the battery, fuel and what ethanol left in the tank, tire pressure and flat spots, the brake rust ring, and a blocked tailpipe, bracketed by a fading January snowflake and an April sun"
      className="h-auto w-full"
    >
      <title>Seven places a prairie winter hides in a parked car — the spring walk-around</title>
      <defs>
        <radialGradient id="sp-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the car */}
      <ellipse cx="570" cy="556" rx="390" ry="34" fill="url(#sp-pool)" />

      {/* season brackets — january fading out, april arriving */}
      <g stroke="#9a9ca0" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" fill="none">
        <path d="M 96 96 L 96 152 M 68 124 L 124 124 M 76 104 L 116 144 M 116 104 L 76 144" />
      </g>
      <text
        x="96"
        y="182"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.5"
      >
        MINUS 25 · JANUARY
      </text>
      <circle cx="1096" cy="118" r="22" fill="none" stroke="#ffb066" strokeWidth="1.3" strokeOpacity="0.8" />
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.55" strokeLinecap="round" fill="none">
        <path d="M 1096 84 L 1096 74 M 1096 152 L 1096 162 M 1062 118 L 1052 118 M 1130 118 L 1140 118" />
        <path d="M 1072 94 L 1065 87 M 1120 94 L 1127 87 M 1072 142 L 1065 149 M 1120 142 L 1127 149" />
      </g>
      <text
        x="1096"
        y="188"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#ffd9ad"
        fillOpacity="0.8"
      >
        PLUS 5 · APRIL
      </text>

      {/* ground line */}
      <line x1="130" y1="531" x2="1090" y2="531" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.35" />

      {/* ══ BODY — side profile, nose left ══ */}
      <path
        d="M 168 462 L 168 424 Q 168 410 184 407 L 252 399 L 430 391 L 476 328 L 648 322 Q 664 322 676 332 L 736 380 L 906 391 Q 952 394 958 402 L 962 424 L 962 462"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* rocker line with wheel arches */}
      <path
        d="M 168 462 L 264 462 A 58 58 0 0 1 380 462 L 768 462 A 58 58 0 0 1 884 462 L 962 462"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* door cut + handle, bumper ticks */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.45" fill="none" strokeLinecap="round">
        <path d="M 560 330 L 560 460" />
        <path d="M 470 392 L 470 460" />
        <line x1="524" y1="404" x2="548" y2="404" />
        <line x1="162" y1="452" x2="174" y2="452" />
        <line x1="956" y1="452" x2="968" y2="452" />
      </g>

      {/* wheels + hubs */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6">
        <circle cx="322" cy="470" r="50" />
        <circle cx="826" cy="470" r="50" />
        <circle cx="322" cy="470" r="18" strokeOpacity="0.7" />
      </g>
      {/* rear brake drum + rust ring */}
      <circle cx="826" cy="470" r="26" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.8" />
      <path
        d="M 804 456 A 26 26 0 0 1 848 458"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.4"
        strokeOpacity="0.7"
        strokeDasharray="3 4"
      />
      {/* flat spot on the front tire */}
      <line x1="298" y1="516" x2="346" y2="516" stroke="#ffb066" strokeWidth="1.6" strokeLinecap="round" />
      <g stroke="#ffb066" strokeWidth="0.9" strokeOpacity="0.6" strokeLinecap="round">
        <line x1="306" y1="522" x2="306" y2="527" />
        <line x1="322" y1="522" x2="322" y2="527" />
        <line x1="338" y1="522" x2="338" y2="527" />
      </g>

      {/* ══ HIDDEN HARDWARE — dashed, under the sheet metal ══ */}
      {/* air cleaner with a nest in it */}
      <circle cx="240" cy="430" r="15" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.75" />
      <g fill="none" stroke="#ffb066" strokeWidth="0.9" strokeOpacity="0.7" strokeLinecap="round">
        <path d="M 232 432 Q 238 424 246 431 Q 240 436 234 434" />
        <path d="M 236 427 Q 243 428 245 435" />
      </g>
      {/* battery */}
      <rect x="398" y="412" width="36" height="22" rx="2" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.75" />
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round">
        <line x1="405" y1="408" x2="405" y2="404" />
        <line x1="427" y1="408" x2="427" y2="404" />
      </g>
      {/* fuel tank + line forward */}
      <rect x="896" y="472" width="54" height="22" rx="8" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.75" />
      <path
        d="M 896 488 L 700 500 L 460 500"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="0.9"
        strokeOpacity="0.45"
        strokeDasharray="3 5"
      />
      {/* water layer at the bottom of the tank */}
      <line x1="900" y1="489" x2="946" y2="489" stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.7" strokeDasharray="2 3" />
      {/* exhaust run + packed tailpipe */}
      <path d="M 700 505 L 968 505" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.6" />
      <path d="M 968 501 L 996 501 L 996 509 L 968 509" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.8" />
      <g fill="none" stroke="#ffb066" strokeWidth="0.9" strokeOpacity="0.7" strokeLinecap="round">
        <path d="M 984 503 Q 990 505 984 507" />
        <path d="M 989 502 Q 994 505 989 508" />
      </g>

      {/* drip stain under the engine — the floor is a map */}
      <ellipse cx="250" cy="536" rx="16" ry="3.5" fill="#ffb066" fillOpacity="0.14" />
      <circle cx="250" cy="527" r="1.6" fill="#ffb066" fillOpacity="0.6" />
      <text
        x="250"
        y="560"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        EVERY STAIN IS AN ADDRESS
      </text>

      {/* ══ CAR COVER — half pulled back off the tail ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round">
        <path d="M 636 318 Q 760 300 880 336 Q 1000 372 1046 442" strokeDasharray="7 5" />
        <path d="M 900 344 Q 960 380 990 430" strokeDasharray="4 5" strokeOpacity="0.35" />
        <path d="M 970 366 Q 1010 400 1028 438" strokeDasharray="4 5" strokeOpacity="0.35" />
      </g>
      <text
        x="1052"
        y="466"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.14em"
        fill="#9a9ca0"
        fillOpacity="0.5"
      >
        COVER
      </text>

      {/* ══ LEADER LINES — label column to pin ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        {/* left column */}
        <path d="M 344 216 L 240 418" />
        <path d="M 330 262 L 352 386" />
        <path d="M 350 308 L 416 412" />
        <path d="M 268 586 L 316 526" />
        {/* right column */}
        <path d="M 878 216 L 921 474" />
        <path d="M 878 262 L 838 460" />
        <path d="M 878 308 L 992 496" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 240, y: 430, n: "1" },
          { x: 352, y: 396, n: "2" },
          { x: 416, y: 423, n: "3" },
          { x: 923, y: 483, n: "4" },
          { x: 322, y: 516, n: "5" },
          { x: 826, y: 470, n: "6" },
          { x: 995, y: 505, n: "7" },
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
        <text x="40" y="212" fill="#ffb066">
          1 · NESTS — AIR CLEANER &amp; HEATER BOX
        </text>
        <text x="40" y="258" fill="#ffb066">
          2 · FLUIDS — OIL, COOLANT, BRAKE
        </text>
        <text x="40" y="304" fill="#ffb066">
          3 · BATTERY — 12.6 V OR THE CHARGER
        </text>
        <text x="40" y="592" fill="#ffb066">
          5 · TIRES — PRESSURE &amp; FLAT SPOTS
        </text>
        {/* right column */}
        <text x="1160" y="212" textAnchor="end" fill="#ffb066">
          4 · FUEL — WHAT ETHANOL LEFT BEHIND
        </text>
        <text x="1160" y="258" textAnchor="end" fill="#ffb066">
          6 · BRAKES — RUST RING, PEDAL FEEL
        </text>
        <text x="1160" y="304" textAnchor="end" fill="#ffb066">
          7 · EXHAUST — LOOK IN THE TAILPIPE
        </text>
      </g>

      {/* plate caption */}
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
        FIG. S — SEVEN PLACES A PRAIRIE WINTER HIDES IN A PARKED CAR
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Before the first start after winter storage, work one sequence: check for rodent nests and
        chewed wiring, check every fluid level, charge and test the battery, set the tires to spec,
        look underneath for new stains, then crank with the ignition disabled until you see oil
        pressure — and only then let it fire and idle.
      </p>

      <h2>Why can&rsquo;t I just get in and start it?</h2>
      <p>
        Because the car you park in November is not the car you find in April. Over five months the
        oil film drains off cylinder walls and bearings, the carburetor bowl evaporates dry, the
        battery self-discharges, brake fluid pulls moisture out of the air, tires lose pressure and
        take a set where they sit, and every warm cavity in the car gets advertised as vacant
        housing. None of that is damage yet. It becomes damage when the first act of spring is
        thirty seconds of hard cranking on dry bearings, followed by a drive on brakes nobody
        tested.
      </p>
      <p>
        The good news is that one winter is a known quantity. A car that sat a season needs a
        morning of checks; a car that sat for years needs a different article and a different
        budget.<a href="#src-1" className="cite-ref">[1]</a> The line between the two matters,
        because the correct response to each is different:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            What one winter of storage does to a classic car compared with years of sitting, across
            fuel, rubber and seals, brakes, and battery, with the correct response to each
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Sat one winter (4–6 months)</th>
              <th scope="col">Sat for years</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Fuel</th>
              <td>Usable if topped up and stabilized; suspect if not</td>
              <td>Assume varnish — tank, lines, and carb all need attention</td>
            </tr>
            <tr>
              <th scope="row">Rubber &amp; seals</th>
              <td>Inspect and squeeze; most of it survives</td>
              <td>Assume hardened — hoses, fuel line, and hydraulic seals</td>
            </tr>
            <tr>
              <th scope="row">Brakes</th>
              <td>Surface rust and pedal check, then drive</td>
              <td>Assume seized or leaking until proven otherwise</td>
            </tr>
            <tr>
              <th scope="row">Battery</th>
              <td>Charge and test; usually recoverable</td>
              <td>Usually done — budget for new</td>
            </tr>
            <tr>
              <th scope="row">Right response</th>
              <td>The checklist below, one careful morning</td>
              <td>A staged revival — do not turn the key first</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        This article is the one-winter checklist — the April mirror of the fall routine in the{" "}
        <Link href="/guides/winter">winter guide</Link>. If your find has been parked since the
        Chrétien years, start with the{" "}
        <Link href="/blog/barn-find-first-steps">barn-find protocol</Link> instead, because turning
        the key is the most expensive thing you can do to a long-dead engine.
      </p>

      <h2>What should I check before touching the key?</h2>

      <h3>1. The nest check</h3>
      <p>
        Mice do not care what the car is worth. Pull the air cleaner lid — the filter element is
        prime nesting material — and look into the heater blower box, the glovebox, under the
        seats, and up the tailpipe. You are looking for shredded insulation, droppings, and seed
        caches. Then follow any evidence to the wiring: chewed insulation is not a cosmetic problem
        but a short circuit and a fire waiting for current. A nest packed into an exhaust or an
        intake will also stop the engine from breathing, which turns a no-start mystery into a
        two-minute fix if you looked first.
      </p>

      <h3>2. Fluids, and what the floor says</h3>
      <p>
        Check the engine oil level, then smell the dipstick. A gasoline smell means fuel leaked
        past the carburetor while the car sat and thinned the oil — change it before the engine
        runs, and read the{" "}
        <Link href="/blog/carburetor-rebuild-signs">carburetor rebuild signs</Link> for why it
        happened. Check the coolant level and squeeze the radiator hoses; anything crunchy or
        mushy gets replaced, not watched. Check the brake and clutch reservoirs. Then read the
        floor under the car like a map, because every stain is an address: coolant under the water
        pump, oil under the pan, brake fluid inside a wheel. Five months of sitting gives even a
        slow seep time to sign its name.
      </p>

      <h3>3. The battery</h3>
      <p>
        If it spent the winter on a maintainer, it is probably fine. If it did not, put a meter on
        it before asking it to work: a healthy, fully charged battery reads about 12.6 volts, and
        every 0.2 volts below that costs roughly a quarter of its cranking power.
        <a href="#src-1" className="cite-ref">[1]</a> A battery reading closer to 12 than 12.6
        gets a slow overnight charge, not a jump — jump-starting a deeply discharged battery just
        asks the alternator to do a charger&rsquo;s job while the engine runs on unstable voltage.
        Clean the terminals while it charges. Corrosion that formed over winter is half of all
        springtime &ldquo;dead battery&rdquo; complaints.
      </p>

      <h3>4. Tires and rubber</h3>
      <p>
        Set all four tires to the placard pressure cold, then look at the sidewalls in good light
        for cracking. Transport Canada&rsquo;s standing advice — check pressure at least monthly
        and before any long trip — applies double to a car that has been holding one contact patch
        against the concrete since November.<a href="#src-2" className="cite-ref">[2]</a> Radials
        that flat-spotted over winter usually round out within the first fifteen minutes of
        driving; bias-plies may thump longer, and tires that are cracked at the base of the tread
        blocks are done regardless of tread depth. Finish the rubber tour with the fan belt and
        wiper blades — cheap parts that fail expensively.
      </p>

      <h2>Is the gas still good after a winter in the tank?</h2>
      <p>
        This is the check most likely to decide how your spring goes. The ethanol in regular pump
        gas is hygroscopic — it absorbs water from the air all winter — and when the concentration
        gets high enough, the water-ethanol mix settles to the bottom of the tank as a whitish
        sludge. The pickup drinks from the bottom, so that layer is the first thing your
        carburetor gulps in the spring.<a href="#src-3" className="cite-ref">[3]</a> Natural
        Resources Canada is blunt about the intended audience for ethanol blends: gasoline-powered
        vehicles built since the 1980s.<a href="#src-4" className="cite-ref">[4]</a> A classic
        predates the fuel it is forced to drink, which is why the fall routine matters so much in
        April.
      </p>
      <p>
        If you topped the tank and added stabilizer in the fall, the fuel is normally fine for
        start-up after a single season. If the car went to bed on half a tank of untreated E10,
        smell the filler neck: sour or varnish-like means trouble. The practical middle path is to
        drain the carburetor float bowl, run several litres of fresh premium into the tank to
        dilute what is there, and change the inline fuel filter after the first couple of drives —
        it will be catching everything the winter loosened. A few stations around Edmonton still
        sell ethanol-free premium, and for a car that sits more than it drives, it is worth the
        detour every time.
      </p>

      <h2>How do I do the first start after storage?</h2>
      <p>
        Slowly, and in two stages. First, spin it without letting it fire: disable the ignition —
        pull the coil wire and ground it, or use the kill switch if the car has one — and crank in
        ten-second bursts with rests between until the oil pressure gauge registers or the light
        goes out. That circulates oil to the bearings and cam before the engine ever runs under
        its own power, which is the whole point of doing this in two stages instead of one. On a
        carbureted car the cranking is doing double duty, because the float bowl evaporated dry
        over the winter and the pump needs time to refill it.
      </p>
      <p>
        Then reconnect the ignition, set the choke, and let it fire. Leave it on fast idle and
        keep your hands off the throttle — an engine that has not run since November does not need
        to be revved, it needs to be watched. Watch oil pressure and the charge light, watch for
        smoke, and listen: a noisy lifter that quiets in a minute is normal, a knock that does not
        is a shutdown. Let it reach full operating temperature, shut it off, and re-check every
        fluid and the floor. Heat and pressure find leaks that a cold inspection cannot.
      </p>
      <blockquote>
        <p>The first start of spring is a test you grade with your ears, not your right foot.</p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>

      <h2>What do the brakes need after sitting all winter?</h2>
      <p>
        A pedal check before the car moves: firm, high, and holding under steady pressure. A pedal
        that sinks slowly is a hydraulic leak, and the car does not leave the garage until it is
        found. The orange ring of surface rust on drums and discs is normal and scrubs off in the
        first few stops. What you are actually testing for is the sticky wheel cylinder or seized
        caliper that five months of moisture produced: drive at walking pace and stop, forward and
        then in reverse. Firm pedal, no pull, no grinding — proceed. On a manual car, be ready for
        a clutch disc that stuck to the flywheel over winter; it usually pops free with the engine
        running, brakes on, and the transmission bumped in gear.
      </p>
      <p>
        The first real drive is a shakedown, not an event. Keep it under half an hour and close to
        home, vary the speed, use the brakes deliberately, and listen with the radio off. Back in
        the garage, look at the floor again and re-torque anything you disturbed. Two short drives
        with inspections between them will surface almost everything a winter did.
      </p>

      <h2>What does spring recommissioning cost in Edmonton?</h2>
      <p>
        Most of this checklist is free — eyes, a tire gauge, a multimeter, and a morning. Where
        money enters, these are the typical planning ranges in Canadian dollars, not quotes:
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$120–$250</span>
          <span className="stat-l">Oil and filter change, classic V8, quality oil</span>
        </div>
        <div>
          <span className="stat-v">$250–$600</span>
          <span className="stat-l">Professional spring check-over, fluids through brakes</span>
        </div>
        <div>
          <span className="stat-v">$500–$1,500</span>
          <span className="stat-l">Brake hydraulic refresh — cylinders, hoses, flush</span>
        </div>
        <div>
          <span className="stat-v">$350–$900</span>
          <span className="stat-l">Carburetor rebuild, if the winter fuel won</span>
        </div>
      </div>
      <p>
        The honest pattern in those numbers: the cheap end is maintenance and the expensive end is
        what deferred maintenance turns into. A $15–$30 bottle of stabilizer in October is how
        you avoid the $900 end of the carburetor range in May. Timing matters too — every shop in the
        city fills up the first genuinely warm week, so a car booked for its check-over in March or
        early April gets bench time and conversation, while the same car in mid-May gets a queue.
        Carburetors, ignition, and cold-start tuning for Alberta air are exactly what the{" "}
        <Link href="/services/classic-performance-tuning">performance and tuning service</Link>{" "}
        exists for, and spring is its season.
      </p>

      <h2>When does driving season actually start around Edmonton?</h2>
      <p>
        Not when the snow melts — when the streets are clean. Edmonton spends weeks each spring
        sweeping up the winter&rsquo;s traction gravel, and until your routes are swept and rained
        on, that grit is a sandblaster for your rocker panels and windshield, with salt residue
        underneath it. For most of the region that means the season opens in late April and gets
        properly under way in May. Watch for the sweepers on your own streets, and give the
        underside a rinse after the first drives regardless.
      </p>
      <p>
        Two pieces of paperwork belong on the same checklist. If your car runs Alberta antique
        plates — the class for vehicles 25 years old or more — remember the registration is
        restricted to exhibitions, club activities, parades, travel to and from those events, and
        trips to service appointments, not general daily use.
        <a href="#src-5" className="cite-ref">[5]</a> And if you reduced your insurance to
        storage-only coverage for the winter, the call to put road coverage back on happens before
        the first drive, not after it.
      </p>
      <p>
        If the walk-around turns up something you do not like — a soft pedal, a sinking float, a
        stain with no obvious address — that is what the shop is for. Send the year, engine, how
        long it sat, and what you found through the <Link href="/quote">quote page</Link>, and you
        will get a straight answer about what needs doing now, what can wait until fall, and what
        was never actually a problem.
      </p>
    </>
  );
}
