import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 02 — Barn Find First Steps.
 * The revival-protocol pillar. Links down into the blue project shell case
 * study, the restoration service page, the costs guide, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "barn-find-first-steps",
  title:
    "Barn Find First Steps: Don't Start It! How to Revive a Car That Sat for Years",
  accent: "Don't",
  metaTitle: "Barn Find First Steps — Don't Start It. Revive It Properly",
  description:
    "Why you never turn the key on a car that sat for years, and the five-step protocol that wakes one up safely — free the engine, replace the fluids, sort the fuel, then first start. From an Edmonton shop.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Revivals",
  targetKeywords: [
    "barn find first steps",
    "how to start a car that has been sitting for years",
    "barn find revival checklist",
    "wake up a stored classic car",
    "barn find Edmonton",
  ],
  faq: [
    {
      q: "How long can a car sit before the gas goes bad?",
      a: "Pump gasoline typically lasts three to six months before oxidation and evaporation degrade it, and ethanol-blended gas can start going off in one to three months because ethanol absorbs water. A car that sat for years has varnish, not fuel, in the tank — drain it, never try to run the engine on it.",
    },
    {
      q: "Should I change the oil before starting a car that has been sitting?",
      a: "Yes, always, before the first start. Oil degrades with age and collects moisture, and whatever is in that pan has been off the cylinder walls for years. Fresh oil of the correct weight and a new filter cost very little against what a dry start costs. Squirting oil into the cylinders through the spark plug holes before rotating the engine is cheap insurance on top.",
    },
    {
      q: "How do you free an engine that is seized from sitting?",
      a: "Pull the spark plugs, put penetrating oil or fogging oil into each cylinder, and let it soak — days, sometimes weeks, re-oiling as you go. Then try rotating the crankshaft gently by hand with a wrench on the crank bolt, never with the starter motor. If it will not move after a long soak, stop. Forcing it breaks things, and the honest next step is teardown and assessment.",
    },
    {
      q: "Can I drive a barn find home after it starts?",
      a: "No. Trailer it. Running is not the same as roadworthy — the brakes have almost certainly deteriorated, the fuel system is suspect, and tires that sat for a decade are done regardless of how much tread shows. Brakes, steering, fuel lines, and tires get sorted before the car carries anyone on a public road.",
    },
    {
      q: "How much does it cost to get a barn find running again in Canada?",
      a: "Doing the wake-up right — fluids, filters, battery, plugs, and a drained and cleaned fuel system — commonly runs a few hundred to a couple of thousand Canadian dollars if the engine is healthy. A full mechanical recommissioning that makes the car genuinely driveable typically lands in the $4,000 to $15,000 CAD range. A seized engine or a rotten brake system moves the number well past that. These are planning ranges, not quotes.",
    },
  ],
  citations: [
    {
      name: "Rob Siegel, “Why You Shouldn't Cold-Start a Long-Dead Car,” Hagerty, April 2019",
      url: "https://www.hagerty.com/media/maintenance-and-tech/dont-cold-start-a-long-dead-car/",
    },
    {
      name: "Matt Hill, “Does Gasoline Go Bad?,” AAA Club Alliance, August 2024",
      url: "https://cluballiance.aaa.com/the-extra-mile/advice/car/how-to-keep-gas-from-going-bad",
    },
    {
      name: "“Barnfind Cars: What Is a ‘Barn Find’ and How Can It Be Restored?,” Classic Industries",
      url: "https://news.classicindustries.com/restorationnews/turning-barnfind-driver/",
    },
    {
      name: "“How Do You Start a Car That Has Been Sitting for 1 Year?,” The Drive",
      url: "https://www.thedrive.com/maintenance-repair/34946/how-to-start-a-car-that-has-been-sitting-for-1-year",
    },
  ],
  internalLinks: [
    "/builds/blue-project-shell",
    "/services/classic-car-restoration",
    "/guides/costs",
    "/quote",
  ],
  readingMinutes: 10,
};

/**
 * A tarped car under a single work lamp, one shaft of light, dust hanging in
 * it — and the five-station wake-up protocol running as a dotted rail across
 * the foreground. Editorial diagram in the After Hours light logic: every
 * glow has a source.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 640"
      role="img"
      aria-label="Editorial diagram of a car under a tarp in a dark garage, lit by a single hanging work lamp, with a numbered five-step revival protocol running beneath: inspect, rotate by hand, fluids out and in, fuel system, first start"
      className="h-auto w-full"
    >
      <title>The five-step wake-up — one lamp, one tarped car, one order of operations</title>
      <defs>
        <linearGradient id="bf-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.16" />
          <stop offset="70%" stopColor="#ffb066" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bf-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd9ad" stopOpacity="0.7" />
          <stop offset="40%" stopColor="#ffb066" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bf-ground" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <clipPath id="bf-shaft-clip">
          <polygon points="398,96 462,96 728,520 168,520" />
        </clipPath>
      </defs>

      {/* the lamp: cord, shade, bulb, halo */}
      <line x1="430" y1="0" x2="430" y2="66" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7" />
      <path
        d="M 404 96 L 414 68 Q 430 60 446 68 L 456 96 Z"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="430" cy="96" r="34" fill="url(#bf-halo)" />
      <circle cx="430" cy="97" r="6" fill="#ffd9ad" />

      {/* the shaft of light */}
      <polygon points="398,96 462,96 728,520 168,520" fill="url(#bf-shaft)" />

      {/* dust hanging in the shaft */}
      <g fill="#ffd9ad">
        <circle cx="410" cy="180" r="1.4" fillOpacity="0.5" />
        <circle cx="455" cy="235" r="1" fillOpacity="0.4" />
        <circle cx="392" cy="290" r="1.6" fillOpacity="0.35" />
        <circle cx="486" cy="330" r="1.1" fillOpacity="0.45" />
        <circle cx="430" cy="262" r="0.9" fillOpacity="0.55" />
        <circle cx="522" cy="402" r="1.3" fillOpacity="0.3" />
        <circle cx="368" cy="382" r="1" fillOpacity="0.35" />
        <circle cx="472" cy="448" r="1.5" fillOpacity="0.25" />
      </g>

      {/* ground */}
      <line x1="80" y1="520" x2="1120" y2="520" stroke="#9a9ca0" strokeOpacity="0.25" strokeWidth="1" />
      <ellipse cx="448" cy="522" rx="330" ry="26" fill="url(#bf-ground)" />

      {/* ══ THE TARPED CAR ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {/* draped silhouette: trunk bump → roof ridge → cowl dip → hood → nose */}
        <path d="M 208 520 Q 200 468 216 430 Q 228 398 262 380 Q 300 362 336 344 Q 372 322 412 314 Q 452 308 486 322 Q 516 334 540 366 Q 556 386 576 398 Q 610 416 636 442 Q 660 466 668 496 Q 671 508 673 520" />
        {/* tarp folds falling from the ridge */}
        <g strokeWidth="1" strokeOpacity="0.5">
          <path d="M 300 372 Q 292 448 286 520" />
          <path d="M 372 326 Q 372 424 376 520" />
          <path d="M 448 316 Q 456 420 462 520" />
          <path d="M 540 368 Q 552 446 556 520" />
        </g>
        {/* tarp corner kicking out at the nose */}
        <path d="M 660 480 L 700 506 L 686 520" strokeWidth="1.2" strokeOpacity="0.7" />
        {/* tie-down rope over the midsection */}
        <path d="M 402 318 Q 396 420 390 520" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="5 4" />
        {/* one wheel showing under the hem */}
        <path d="M 282 520 A 30 30 0 0 1 342 520" strokeWidth="1.4" strokeOpacity="0.8" />
        <path d="M 296 520 A 16 16 0 0 1 328 520" strokeWidth="0.9" strokeOpacity="0.55" />
      </g>
      {/* the lit pass — same silhouette, brighter, only inside the shaft */}
      <g clipPath="url(#bf-shaft-clip)">
        <path
          d="M 208 520 Q 200 468 216 430 Q 228 398 262 380 Q 300 362 336 344 Q 372 322 412 314 Q 452 308 486 322 Q 516 334 540 366 Q 556 386 576 398 Q 610 416 636 442 Q 660 466 668 496 Q 671 508 673 520"
          fill="none"
          stroke="#ffd9ad"
          strokeWidth="1.8"
          strokeOpacity="0.55"
          strokeLinecap="round"
        />
      </g>

      {/* hanging paper tag at the nose */}
      <g stroke="#9a9ca0" strokeWidth="1" fill="none">
        <line x1="648" y1="452" x2="662" y2="474" strokeOpacity="0.6" />
        <rect x="654" y="474" width="34" height="22" rx="2" transform="rotate(8 654 474)" strokeOpacity="0.85" />
      </g>

      {/* annotations */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
      >
        <text x="1120" y="130" textAnchor="end" fill="#9a9ca0" fillOpacity="0.6">
          BAY 02 · ONE LAMP ON
        </text>
        <text x="760" y="356" fill="#9a9ca0" fillOpacity="0.85">
          &ldquo;RAN WHEN PARKED&rdquo;
        </text>
        <text x="760" y="376" fill="#9a9ca0" fillOpacity="0.55" fontSize="10">
          — UNVERIFIED
        </text>
      </g>
      <path d="M 752 362 L 700 400" stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />

      {/* ══ THE PROTOCOL RAIL — five stations ══ */}
      <line
        x1="150"
        y1="572"
        x2="1050"
        y2="572"
        stroke="#ffb066"
        strokeWidth="1"
        strokeOpacity="0.45"
        strokeDasharray="2 7"
      />
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.14em">
        {[
          { x: 150, n: "01", label: "INSPECT" },
          { x: 375, n: "02", label: "ROTATE BY HAND" },
          { x: 600, n: "03", label: "FLUIDS OUT / IN" },
          { x: 825, n: "04", label: "FUEL SYSTEM" },
          { x: 1050, n: "05", label: "FIRST START" },
        ].map((s) => (
          <g key={s.n}>
            <circle cx={s.x} cy="572" r="15" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={s.x} y="576.5" textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {s.n}
            </text>
            <text x={s.x} y="614" textAnchor="middle" fontSize="10" fill="#9a9ca0" fillOpacity="0.85">
              {s.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Do not start it. A car that sat for years has dry cylinder walls, sour fuel, perished
        rubber, and very possibly a mouse nest in the intake — and one hopeful turn of the key can
        convert a few hundred dollars of careful wake-up into an engine rebuild. The protocol
        below is the order of operations that protects the car.
      </p>

      <h2>Why can&rsquo;t you just start it?</h2>
      <p>
        Because the dramatic YouTube version — jumper pack, gas can, starting fluid, crank until it
        roars — is a gamble played with someone else&rsquo;s irreplaceable hardware. The first rule
        of waking a long-dead car is borrowed from medicine: first, do no harm.
        <a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        Time does specific, predictable damage to a parked car. The oil film drains off the
        cylinder walls, leaving bare steel to corrode against the rings. Gasoline oxidizes into
        varnish — pump gas is typically degrading within three to six months, and ethanol blends
        can start going off in one to three because ethanol pulls in water.
        <a href="#src-2" className="cite-ref">[2]</a> Brake fluid absorbs moisture and the system
        rusts from the inside. Seals shrink. Rodents move into airboxes and wiring looms.
        <a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        Here is what the eager key turn risks against what patience costs:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Cost comparison of starting a long-parked car immediately versus following the wake-up
            protocol, with typical Canadian dollar ranges
          </caption>
          <thead>
            <tr>
              <th scope="col">What can go wrong</th>
              <th scope="col">How the key turn causes it</th>
              <th scope="col">Typical cost if it does (CAD)</th>
              <th scope="col">Cost to prevent it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Scored cylinders, wiped bearings</th>
              <td>Cranking on dry, corroded walls with dead oil</td>
              <td className="num">$6,000 – $12,000+ rebuild</td>
              <td>Oil down the plug holes, fresh oil and filter</td>
            </tr>
            <tr>
              <th scope="row">Bent connecting rod</th>
              <td>Starter forces a hydrolocked or seized engine</td>
              <td className="num">$6,000 – $12,000+ rebuild</td>
              <td>Rotate the engine gently by hand first</td>
            </tr>
            <tr>
              <th scope="row">Debris through the engine</th>
              <td>Rodent nest in the intake gets pulled in</td>
              <td className="num">Open-ended</td>
              <td>Look inside the airbox. Two minutes</td>
            </tr>
            <tr>
              <th scope="row">Gummed carburetor and lines</th>
              <td>Pumping varnish through the fuel system</td>
              <td className="num">$350 – $900 carb rebuild, typical</td>
              <td>Drain the tank, run fresh fuel</td>
            </tr>
            <tr>
              <th scope="row">Cooked engine</th>
              <td>Running on ancient coolant, stuck thermostat</td>
              <td className="num">Head gasket and up</td>
              <td>Flush the cooling system before sustained running</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The left column is why this article exists. Everything in the right column is an afternoon
        and pocket money.
      </p>

      <h2>Step 1 — What should you do before touching anything?</h2>
      <p>
        Look. Do not wrench yet. Walk the car with a flashlight and a camera and record what
        sitting has done: fluid stains under the engine and axle, the level and colour on the
        dipstick, rodent sign in the airbox, glovebox, and under the seats, tire condition, and how
        far the brake pedal sinks. Open the fuel filler and smell it — varnish announces itself.
      </p>
      <p>
        Paperwork is part of the inspection. Confirm the VIN matches the title before a dollar is
        spent, and photograph everything for the record — future-you, an insurer, or a shop will
        want the history.<a href="#src-3" className="cite-ref">[3]</a>
      </p>
      <blockquote>
        <p>&ldquo;Ran when parked&rdquo; is a date, not a condition.</p>
        <footer>Every barn find intake, ever</footer>
      </blockquote>
      <p>
        The storage story matters more than the odometer. A dry prairie pole shed and a damp
        lakeside garage produce two very different cars after ten years, whatever the seller
        remembers about how it drove.
      </p>

      <h2>Step 2 — How do you free an engine that has sat?</h2>
      <p>
        Before the starter motor ever gets power, prove the engine turns. Pull all the spark plugs
        and squirt oil into each cylinder to re-wet the rings and walls. Let it sit. Then put a
        wrench on the crankshaft bolt and rotate the engine gently by hand — never with the
        starter, which will happily apply hundreds of amps of force to a piston that is stuck fast.
        <a href="#src-1" className="cite-ref">[1]</a>
      </p>
      <p>
        If it will not move, stop and soak. Penetrating oil in the cylinders, days or weeks of
        patience, gentle attempts in both directions. Many &ldquo;seized&rdquo; engines free up
        this way. If it still will not move after a proper soak, the honest path is teardown and
        assessment, not a longer breaker bar. Forcing it is how a stuck engine becomes a broken
        one.
      </p>

      <h2>Step 3 — Which fluids do you replace before the first start?</h2>
      <p>
        All of the ones that matter, and before — not after — the engine runs:
      </p>
      <ul>
        <li>
          <strong>Engine oil and filter.</strong> Non-negotiable. Whatever is in the pan is old,
          moisture-laden, and possibly sludge. Correct weight, new filter, done in twenty minutes.
          <a href="#src-1" className="cite-ref">[1]</a>
        </li>
        <li>
          <strong>Coolant.</strong> Drain and flush. Old coolant goes acidic and eats the system
          from the inside, and a stuck thermostat will cook a fresh start in minutes.
        </li>
        <li>
          <strong>Brake fluid — and honestly, the brake system.</strong> Brake fluid absorbs water
          and the lines, cylinders, and calipers rust from the inside while the car sleeps. Plan on
          a full hydraulic inspection before the car moves under its own power.
        </li>
        <li>
          <strong>Battery.</strong> A battery that sat dead for years is scrap. Fit a new one
          rather than jumping the corpse.<a href="#src-4" className="cite-ref">[4]</a>
        </li>
        <li>
          <strong>Everything rubber gets eyeballed.</strong> Belts, hoses, fuel lines, wiper
          blades, tires. Sitting is harder on rubber than driving ever was.
        </li>
      </ul>
      <div className="stat-plate">
        <div>
          <span className="stat-v">3–6 mo</span>
          <span className="stat-l">Typical life of pump gas before it degrades</span>
        </div>
        <div>
          <span className="stat-v">1–3 mo</span>
          <span className="stat-l">Ethanol blends — shorter still</span>
        </div>
        <div>
          <span className="stat-v">$100s</span>
          <span className="stat-l">Typical cost of doing the wake-up right</span>
        </div>
        <div>
          <span className="stat-v">$6K–$12K+</span>
          <span className="stat-l">Typical CAD rebuild if the shortcut fails</span>
        </div>
      </div>

      <h2>Step 4 — What do you do about the fuel system?</h2>
      <p>
        Assume the fuel is bad, because after years it is.<a href="#src-2" className="cite-ref">[2]</a>{" "}
        Drain the tank completely and look inside — rust and varnish in the tank will keep killing
        carburetors and pumps until the tank itself is cleaned, sealed, or replaced. Blow out or
        replace the lines, replace the flexible sections and the filter, and expect the carburetor
        to need a rebuild: dried gaskets, a stuck float, and varnished jets are the standard
        findings, not the unlucky ones.
      </p>
      <p>
        For the first start, many builders run the engine from a small clean supply — a marine tank
        or equivalent feeding the pump — so the engine proves itself before the car&rsquo;s own
        tank and lines are trusted. It is undramatic, and it works.
      </p>

      <h2>Step 5 — What does the first start look like when it is done right?</h2>
      <p>
        Quiet, short, and boring — by design. Plugs still out, crank the engine on the starter
        until oil pressure shows, so the bearings are fed before combustion ever loads them. Plugs
        back in, fresh fuel, a hand on the key and one eye on the gauges. Let it run briefly.
        Listen. Shut it down. Check for leaks, check what the dipstick and the coolant look like,
        and only then run it longer and bring it to temperature.
      </p>
      <p>
        Running is not roadworthy. Brakes, steering, fuel lines, and tires get sorted before the
        car carries anyone on a public road — and tires a decade old are done regardless of how
        much tread shows. Trailer the car to wherever the work happens. The triumphant drive home
        is how a good story becomes a bad one.
      </p>

      <h2>When should you call a shop instead?</h2>
      <p>
        Three findings move a barn find from driveway project to shop job: an engine that stays
        seized after a real soak, a brake system that is rotten end to end, and structural rust in
        the floors, rockers, or frame. Alberta barns are kinder than most — a dry prairie shed
        often preserves metal that would have dissolved in Ontario — but a car that worked before
        it slept met calcium chloride, and the underside tells that story honestly.
      </p>
      <p>
        This is also the point where a written plan beats enthusiasm. When a stalled or sleeping
        project lands on this floor, the process is the same every time: inventory first, steel
        assessment second, and nothing ordered until both are done. The{" "}
        <Link href="/builds/blue-project-shell">blue project shell</Link> on the builds page shows
        exactly what that intake looks like with the front clip off and the truth in daylight.
      </p>
      <p>
        For scope and money, the <Link href="/services/classic-car-restoration">restoration
        service page</Link> covers how the work is structured, and the{" "}
        <Link href="/guides/costs">restoration cost guide</Link> carries honest CAD ranges for
        everything from a mechanical refresh to a frame-off. If you have a barn find and a phone
        full of photos, send them through the <Link href="/quote">quote page</Link> — you will get
        a straight answer on what it needs, what that typically costs, and whether the car
        deserves it. Sometimes the honest answer is that it does not, and you will get that answer
        too.
      </p>
    </>
  );
}
