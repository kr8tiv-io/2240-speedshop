import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Ethanol Fuel and Classic Cars in Canada.
 * What E10 does to carbs, fuel lines, and winter storage: hygroscopic water,
 * phase separation, rotting rubber, and the storage procedure that actually
 * works here. Links down into carb rebuilds, winter storage, spring startup,
 * the winter guide, and quote.
 */

export const meta: ArticleMeta = {
  slug: "ethanol-fuel-classic-cars-canada",
  title: "What E10 Ethanol Does to Classic Carbs, Fuel Lines, and Winter Storage",
  accent: "E10",
  metaTitle: "What E10 Ethanol Does to Classics",
  description: "How E10 absorbs water, attacks period rubber, and gums a carb over an Alberta winter — and the storage and fuel-system habits that actually hold. Writ",
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  author: "2240 Speed Shop",
  category: "Keep It Running",
  targetKeywords: [
    "ethanol classic cars Canada",
    "E10 carburetor damage",
    "ethanol free gas classic car",
    "winter storage ethanol fuel",
    "fuel lines ethanol classic",
  ],
  faq: [
    {
      q: "Is E10 gasoline bad for classic cars?",
      a: "It is hard on them. Ethanol absorbs water, which then phase-separates and sits at the bottom of a steel tank — exactly where the pickup drinks. It also attacks the rubber, cork, and leather parts older carburetors and fuel lines were built with, and it acts as a solvent that scrubs decades of varnish into the jets. Natural Resources Canada notes ethanol blends are intended for vehicles built since the 1980s, which is exactly what a classic is not.",
    },
    {
      q: "Should I store my classic with a full tank of E10?",
      a: "If ethanol-free premium is available, use that, fill to about 95 percent, add stabilizer, and run the engine five minutes so treated fuel reaches the bowl. If E10 is all you have, do the same rather than leaving the tank near-empty — bare steel plus winter condensation is how tanks rust from the inside. Stabilizer prevents gasoline from going sour; it does not stop ethanol from absorbing water, so a four-month sleep is the outer edge of what we trust.",
    },
    {
      q: "How do I know ethanol has damaged my fuel system?",
      a: "Soft, swollen, or weeping rubber lines; a carburetor that floods or idles on a screw you already set; rust flakes in the filter; a tank that smells sour at the filler; and brass jets that look etched. Any one of those is a fuel-system job, not a tune. A professional carb rebuild on a common two- or four-barrel typically runs $350 to $900 CAD, and a tank clean-and-seal commonly lands in the $400 to $1,200 range — planning ranges, not quotes.",
    },
    {
      q: "Where can I buy ethanol-free gas in Alberta?",
      a: "Some rural and small-town stations still sell ethanol-free premium, and marine or farm pumps are worth asking about. Availability moves, so treat it as a habit to confirm at the pump rather than a brand you can count on. Recreational-grade non-ethanol is the storage fuel of choice when you can find it. If you cannot, fresh premium E10, stabilizer, a full tank, and a four-month sleep is the practical Alberta plan.",
    },
    {
      q: "Do I need to replace fuel lines on a classic running E10?",
      a: "If they are original, yes. Period nitrile and neoprene lines were not designed for a ten-percent alcohol blend. They swell, crack, and weep, and a weep in an engine bay is a fire. Replace with ethanol-rated hose — SAE 30R9 or an FKM/Viton liner — from tank to pump to carburetor, and replace the rubber parts inside the carb at the same time. The hose is cheap. The fire is not.",
    },
  ],
  citations: [
    {
      name: "“Ethanol,” Natural Resources Canada",
      url: "https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/ethanol",
    },
    {
      name: "“Choosing the Right Fuel Will Protect Your Classic,” Hagerty Media",
      url: "https://www.hagerty.com/media/maintenance-and-tech/choosing-the-right-fuel-for-your-classic/",
    },
    {
      name: "Clean Fuel Regulations (SOR/2022-140), Government of Canada environmental protection registry",
      url: "https://pollution-waste.canada.ca/environmental-protection-registry/regulations/view?Id=1170",
    },
    {
      name: "“STA-BIL Fuel Stabilizer: What You Need to Know,” Gold Eagle Co. technical library",
      url: "https://www.goldeagle.com/tips-tools/sta-bil-fuel-stabilizer-what-you-need-to-know/",
    },
    {
      name: "“How to: Classic Car Winterization & Storage,” Hagerty",
      url: "https://www.hagerty.com/resources/car-maintenance/how-to-classic-car-winterization-and-storage",
    },
  ],
  internalLinks: [
    "/blog/carburetor-rebuild-signs",
    "/blog/classic-car-winter-storage-alberta",
    "/blog/classic-car-spring-startup-checklist",
    "/guides/winter",
    "/quote",
  ],
  readingMinutes: 8,
};

/**
 * Side elevation of a period fuel system: tank, steel line, rotting rubber
 * hose, carburetor bowl. A tungsten phase-separation layer sits at the bottom
 * of the tank; dashed water-ethanol mix runs toward the pickup. Editorial
 * diagram of where E10 actually does its damage.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of a classic car fuel system: a steel tank with a tungsten phase-separation layer of water-ethanol at the bottom, a rotting rubber hose section, and a carburetor bowl, showing where E10 settles in winter storage"
      className="h-auto w-full"
    >
      <title>Where E10 settles when the car sleeps</title>
      <defs>
        <radialGradient id="et-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="et-sep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0" />
          <stop offset="40%" stopColor="#ffb066" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      <ellipse cx="340" cy="560" rx="260" ry="28" fill="url(#et-pool)" />

      {/* tank */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinejoin="round">
        <rect x="120" y="280" width="360" height="200" rx="18" />
        <path d="M 140 300 Q 300 330 460 300" strokeWidth="1" strokeOpacity="0.4" />
      </g>
      {/* fuel level */}
      <path
        d="M 128 340 L 472 340"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeDasharray="6 6"
      />
      {/* phase separation layer */}
      <rect x="128" y="430" width="344" height="42" rx="4" fill="url(#et-sep)" stroke="#ffb066" strokeWidth="1.2" />
      {/* pickup */}
      <g fill="none" stroke="#ffb066" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 400 280 L 400 448" />
        <circle cx="400" cy="448" r="8" />
      </g>
      {/* filler */}
      <path d="M 160 280 L 160 230 L 190 210" fill="none" stroke="#9a9ca0" strokeWidth="1.6" />
      <ellipse cx="198" cy="204" rx="14" ry="8" fill="none" stroke="#9a9ca0" strokeWidth="1.4" />

      {/* steel line then rubber */}
      <path
        d="M 480 320 L 620 320 L 680 300 L 760 300"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* rotting rubber section */}
      <path
        d="M 760 300 L 790 292 L 820 308 L 850 296 L 880 310 L 910 300"
        fill="none"
        stroke="#ffb066"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <g stroke="#ffd9ad" strokeWidth="1" strokeOpacity="0.8">
        <circle cx="790" cy="286" r="3" fill="none" />
        <circle cx="850" cy="288" r="2.4" fill="none" />
        <circle cx="880" cy="318" r="2.8" fill="none" />
      </g>

      {/* carb */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="910" y="250" width="160" height="90" rx="6" />
        <rect x="930" y="220" width="120" height="30" rx="4" />
        <rect x="950" y="340" width="80" height="50" rx="8" />
        <line x1="970" y1="340" x2="970" y2="390" strokeWidth="1.2" strokeOpacity="0.5" />
        <line x1="1010" y1="340" x2="1010" y2="390" strokeWidth="1.2" strokeOpacity="0.5" />
      </g>
      {/* varnish in bowl */}
      <rect x="956" y="368" width="68" height="16" rx="3" fill="#ffb066" fillOpacity="0.3" stroke="#ffb066" strokeWidth="1" />

      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 80 160 L 198 204" />
        <path d="M 80 460 L 260 448" />
        <path d="M 400 160 L 400 280" />
        <path d="M 1160 280 L 850 296" />
        <path d="M 1160 400 L 1020 376" />
      </g>

      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 198, y: 204, n: "1" },
          { x: 260, y: 448, n: "2" },
          { x: 400, y: 280, n: "3" },
          { x: 850, y: 296, n: "4" },
          { x: 1020, y: 376, n: "5" },
        ].map((p) => (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="12.5" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#ffd9ad">
              {p.n}
            </text>
          </g>
        ))}
      </g>

      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="40" y="164" fill="#ffb066">
          1 · MOIST AIR IN — HYGROSCOPIC
        </text>
        <text x="40" y="464" fill="#ffb066">
          2 · PHASE SEPARATION — WHERE THE PICKUP DRINKS
        </text>
        <text x="420" y="156" fill="#ffb066">
          3 · PICKUP AT THE BOTTOM, ALWAYS
        </text>
        <text x="1160" y="284" textAnchor="end" fill="#ffb066">
          4 · PERIOD RUBBER — SWELLS, WEEPS, BURNS
        </text>
        <text x="1160" y="404" textAnchor="end" fill="#ffb066">
          5 · BOWL VARNISH + ETCHED JETS
        </text>
      </g>

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
        FIG. A — WHERE E10 SETTLES WHEN THE CAR SLEEPS
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        E10 is hard on a classic. Ethanol absorbs water, phase-separates to the bottom of a steel
        tank, attacks period rubber, and scrubs varnish into carburetor jets. Natural Resources
        Canada writes those blends for vehicles since the 1980s — a 1969 Chevelle is not. Storage
        on untreated pump gas gums a rebuild in one Alberta winter.
      </p>

      <h2>What does E10 actually do to a period fuel system?</h2>
      <p>
        Three things, and they stack. First, ethanol is hygroscopic: it pulls water out of the air
        in the tank. Past a point the water-ethanol mix can no longer stay dissolved, so it
        phase-separates and sinks. The pickup lives at the bottom. Hagerty&rsquo;s fuel advice is
        the same sentence this shop uses: there is nothing good about E10 from an automotive
        standpoint for a vintage car, and the lightly driven classic with a metal tank is the
        worst case.
        <a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <p>
        Second, ethanol is a solvent. It strips the varnish that has been quietly lining a steel
        tank since 1972 and carries it into the filter, the needle, and the jets. The car that ran
        last October and idles like a tractor in April did not &ldquo;go out of tune.&rdquo; It
        ingested a winter of dissolved gum. Third, ethanol attacks the rubber, cork, and leather
        parts older fuel systems were built with. Lines swell and weep. Floats get heavy. A weep
        in an engine bay is a fire, not a stain.
      </p>
      <p>
        Canada&rsquo;s Clean Fuel Regulations keep pushing more renewable content into the pool
        the pump draws from.
        <a href="#src-3" className="cite-ref">[3]</a> Natural Resources Canada is explicit that
        low-blend ethanol is intended for vehicles manufactured since the 1980s, and that an E10
        blend contains about 97 percent of the energy of straight gasoline.
        <a href="#src-1" className="cite-ref">[1]</a> A classic is outside that design envelope on
        both chemistry and energy. Drive it anyway — most of us do — but stop pretending the fuel
        is the fuel the carburetor was calibrated on.
      </p>

      <h2>What does winter storage do to E10?</h2>
      <p>
        It gives the chemistry four or five months to work. A near-empty tank leaves bare steel
        and a lot of moist air; a full tank of untreated E10 leaves a hygroscopic sponge sitting
        still. Either way the bowl of the carburetor is a small steel dish of the same fuel, and
        that is where the gum shows up first. The{" "}
        <Link href="/blog/classic-car-winter-storage-alberta">Alberta winter-storage procedure</Link>{" "}
        we use is: ethanol-free premium if you can find it, fill to about 95 percent, add
        stabilizer, run five minutes so treated fuel reaches the bowl.
        <a href="#src-5" className="cite-ref">[5]</a>
      </p>
      <p>
        Stabilizer is not magic. Gold Eagle&rsquo;s own technical note is that a stabilizer keeps
        gasoline from going sour; it does not cancel ethanol&rsquo;s appetite for water.
        <a href="#src-4" className="cite-ref">[4]</a> Hagerty makes the same distinction. So the
        honest storage window on E10 in this climate is one winter, not two, and the{" "}
        <Link href="/blog/classic-car-spring-startup-checklist">spring start-up</Link> should treat
        last fall&rsquo;s fuel as a suspect until it smells like gasoline, not varnish.
      </p>
      <blockquote>
        <p>
          Untreated pump gas in a bowl over an Alberta winter is how a $700 rebuild becomes a
          $700 rebuild again.
        </p>
        <footer>Posted above the carb bench</footer>
      </blockquote>

      <h2>What does a fuel-system refresh cost in Canada?</h2>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$150–$500</span>
          <span className="stat-l">Ethanol-rated lines, tank to carb, typical range</span>
        </div>
        <div>
          <span className="stat-v">$350–$900</span>
          <span className="stat-l">Professional carb rebuild, common 2- or 4-barrel</span>
        </div>
        <div>
          <span className="stat-v">$400–$1,200</span>
          <span className="stat-l">Tank dropped, cleaned, sealed — typical range</span>
        </div>
        <div>
          <span className="stat-v">$800–$2,500</span>
          <span className="stat-l">Full fuel-system refresh, planning range</span>
        </div>
      </div>
      <p>
        Every figure is a planning range in Canadian dollars, not a quote. The tell that you are
        in this invoice rather than a{" "}
        <Link href="/blog/carburetor-rebuild-signs">tune</Link> is recurrence: the same rich idle,
        the same flood, the same filter that goes dark in a month. A screw does not reach a
        swollen needle or a tank full of flakes.
      </p>

      <h2>What actually works, in this province?</h2>
      <ul>
        <li>
          <strong>Ethanol-free when you can find it.</strong> Rural premium, marine, farm. Confirm
          at the pump. It is the storage fuel of choice and the daily fuel of preference.
        </li>
        <li>
          <strong>Rated hose, the whole way.</strong> SAE 30R9 or an FKM liner, tank to pump to
          carb. Original rubber is a fire waiting on a hot manifold.
        </li>
        <li>
          <strong>Modern rebuild kits.</strong> Ethanol-resistant needle, seat, gaskets, and
          accelerator-pump cup. Rebuilding a Quadrajet with 1978 rubber is how you get to do it
          twice.
        </li>
        <li>
          <strong>Drive the car.</strong> A classic that sees a tank a month keeps the chemistry
          moving. A classic that sits on E10 is a science experiment.
        </li>
        <li>
          <strong>One-winter storage, treated and full.</strong> Not two. Drain the bowl in April if
          the filler smells sour.
        </li>
      </ul>
      <p>
        The seasonal procedure, month by month, is in the{" "}
        <Link href="/guides/winter">winter guide</Link>. If the car is coming in because it idled
        fine in October and will not idle now, send a photo of the filter and a note about what
        was in the tank when it went to sleep, through the{" "}
        <Link href="/quote">quote page</Link>. Most of those stories are the same story.
      </p>
    </>
  );
}
