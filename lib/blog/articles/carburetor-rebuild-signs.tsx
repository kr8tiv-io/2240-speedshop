import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL No. 03 — Carburetor Rebuild Signs.
 * The service-conversion wedge for the carburetor keyword cluster. Links down
 * into the performance and tuning service page, the winter guide, the engine
 * swap service, the barn-find protocol, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "carburetor-rebuild-signs",
  title:
    "8 Signs Your Classic's Carburetor Needs a Rebuild, Not Just an Adjustment",
  accent: "Rebuild",
  metaTitle: "8 Signs Your Carburetor Needs a Rebuild, Not an Adjustment",
  description:
    "The one-line rule that separates a carb that needs tuning from one that needs a rebuild, plus the eight symptoms that prove it — from the floor of an Edmonton shop.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Keep It Running",
  targetKeywords: [
    "signs your carburetor needs a rebuild",
    "carburetor rebuild Edmonton",
    "carb running rich symptoms",
    "carburetor tuning",
    "rebuild or replace carburetor",
  ],
  faq: [
    {
      q: "How do I know if my carburetor needs rebuilding?",
      a: "Apply the one-line rule: if turning a screw fixes the problem and it stays fixed, the carburetor needed an adjustment; if the same symptom keeps coming back, something inside is worn and no screw reaches it. Flooding, hard hot starts, off-idle hesitation, raw fuel smell, black sooty plugs, surging at cruise, leaks at the throttle shaft, and fuel in the oil are the eight symptoms that point at wear rather than tune.",
    },
    {
      q: "How much does a carburetor rebuild cost?",
      a: "A professional rebuild on a common two- or four-barrel typically runs $350 to $900 in Canadian dollars, depending on the carburetor family and how worn the core is. Throttle shaft bushings, hard-to-find parts, or performance calibration push the number higher. A DIY kit commonly costs $75 to $150 CAD, but the kit is the cheap part — the cleaning, measuring, and setting are the job. All of these are planning ranges, not quotes.",
    },
    {
      q: "Does ethanol gas damage old carburetors?",
      a: "It can. Ethanol absorbs water, which corrodes fuel bowls and steel lines from the inside; it attacks the rubber, cork, and leather parts older carburetors were built with; and it acts as a solvent that scrubs decades of varnish loose and carries it into the jets. Natural Resources Canada notes ethanol blends are intended for vehicles built since the 1980s — which is exactly what a classic is not. Modern rebuild kits with ethanol-resistant materials are the practical fix.",
    },
    {
      q: "Should I rebuild my carb or convert to EFI?",
      a: "Rebuild if the carburetor is original to the car, the engine is otherwise stock, and you want to protect originality — a properly rebuilt and tuned carb starts, idles, and drives far better than most people remember. Convert to EFI if you drive year-round, want modern cold starts and altitude compensation, and are already deep into an engine upgrade. EFI costs several times what a rebuild does once the fuel system and installation are counted.",
    },
    {
      q: "How often do carburetors need rebuilding?",
      a: "A carburetor on a regularly driven classic commonly goes ten years or more between rebuilds. Ethanol-blended fuel and sitting shorten that considerably — a car stored with modern pump gas in the bowl can gum a fresh rebuild in a couple of seasons. Driving the car regularly, stabilizing or draining fuel before storage, and running ethanol-free premium where available all stretch the interval.",
    },
  ],
  citations: [
    {
      name: "“How to Fix a Carburetor That Floods,” Holley Motor Life technical library",
      url: "https://www.holley.com/blog/post/how_to_fix_a_carburetor_that_floods/",
    },
    {
      name: "“Ethanol,” Natural Resources Canada",
      url: "https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/ethanol",
    },
    {
      name: "Clean Fuel Regulations (SOR/2022-140), Government of Canada environmental protection registry",
      url: "https://pollution-waste.canada.ca/environmental-protection-registry/regulations/view?Id=1170",
    },
    {
      name: "“Choosing the Right Fuel Will Protect Your Classic,” Hagerty Media",
      url: "https://www.hagerty.com/media/maintenance-and-tech/choosing-the-right-fuel-for-your-classic/",
    },
    {
      name: "Randy Bolig, “Rebuilding the Quadrajet Carburetor. Yes, They Are Worth It,” Chevy Hardcore, May 2018",
      url: "https://www.chevyhardcore.com/tech-stories/rebuilding-quadrajet-carburetor/",
    },
  ],
  internalLinks: [
    "/services/classic-performance-tuning",
    "/guides/winter",
    "/services/engine-swaps-builds",
    "/blog/barn-find-first-steps",
    "/quote",
  ],
  readingMinutes: 11,
};

/**
 * A carburetor in cross-section — air horn, choke, venturi, booster, throttle
 * plate, float bowl — drawn as steel line art, with the eight failure points
 * pinned in tungsten and numbered to match the article. An E10 droplet rides
 * the fuel inlet. Editorial diagram in the shop's plate style: every label
 * mono, every glow sourced.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical cross-section diagram of a carburetor showing air horn, choke plate, venturi, booster, throttle plate, and float bowl in steel line art, with eight numbered tungsten callout pins marking the failure points behind flooding, hard hot starts, off-idle stumble, fuel smell, sooty plugs, surging, throttle shaft leaks, and fuel in the oil, plus an E10 droplet at the fuel inlet"
      className="h-auto w-full"
    >
      <title>One casting, eight ways it tells you it&rsquo;s done — the carburetor in section</title>
      <defs>
        <radialGradient id="cb-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cb-fuel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* pool of light under the casting */}
      <ellipse cx="505" cy="540" rx="330" ry="34" fill="url(#cb-pool)" />

      {/* incoming air */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55" fill="none" strokeLinecap="round">
        <line x1="430" y1="34" x2="430" y2="70" strokeDasharray="3 5" />
        <path d="M 424 62 L 430 72 L 436 62" />
      </g>
      <text
        x="452"
        y="44"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        AIR IN
      </text>

      {/* ══ OUTER CASTING — horn, body, bowl, base flange ══ */}
      <path
        d="M 350 88 L 350 170 L 318 180 L 318 460 L 300 460 L 300 492 L 712 492 L 712 460 L 694 460 L 694 240 L 540 240 L 540 180 L 510 170 L 510 88"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* horn flare */}
      <g stroke="#9a9ca0" strokeWidth="1.4" strokeOpacity="0.7" fill="none" strokeLinecap="round">
        <path d="M 350 88 L 338 78" />
        <path d="M 510 88 L 522 78" />
      </g>
      {/* base flange to manifold */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" fill="none">
        <line x1="300" y1="506" x2="712" y2="506" />
        <line x1="330" y1="506" x2="330" y2="520" />
        <line x1="682" y1="506" x2="682" y2="520" />
      </g>

      {/* ══ VENTURI WALLS — narrowing bore ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 350 170 Q 350 222 386 252 Q 400 264 400 284 Q 400 304 386 318 Q 350 348 350 460" />
        <path d="M 510 170 Q 510 222 474 252 Q 460 264 460 284 Q 460 304 474 318 Q 510 348 510 460" />
      </g>
      {/* booster venturi nested in the throat */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.75" strokeLinecap="round">
        <path d="M 410 246 L 421 272 L 421 296 L 410 320" />
        <path d="M 450 246 L 439 272 L 439 296 L 450 320" />
      </g>

      {/* choke plate on its pivot */}
      <line x1="358" y1="150" x2="502" y2="126" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="430" cy="138" r="3.5" fill="none" stroke="#9a9ca0" strokeWidth="1.2" />

      {/* throttle plate + shaft */}
      <line x1="356" y1="456" x2="504" y2="426" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="430" cy="441" r="7" fill="none" stroke="#ffb066" strokeWidth="1.5" />
      {/* worn shaft bore — leak ticks where the shaft exits the casting */}
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" strokeLinecap="round">
        <line x1="318" y1="441" x2="304" y2="441" strokeDasharray="2 3" />
        <line x1="310" y1="432" x2="302" y2="426" strokeDasharray="2 3" />
        <line x1="310" y1="450" x2="302" y2="456" strokeDasharray="2 3" />
      </g>

      {/* ══ FLOAT BOWL — inner wall, fuel, float, needle & seat ══ */}
      <path d="M 548 252 L 548 468" fill="none" stroke="#9a9ca0" strokeWidth="1.4" strokeOpacity="0.8" />
      {/* fuel in the bowl */}
      <rect x="550" y="332" width="142" height="134" fill="url(#cb-fuel)" />
      <line
        x1="552"
        y1="332"
        x2="692"
        y2="332"
        stroke="#ffb066"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeDasharray="5 4"
      />
      {/* float on its hinge */}
      <ellipse cx="612" cy="322" rx="36" ry="15" fill="none" stroke="#9a9ca0" strokeWidth="1.5" />
      <path d="M 646 314 L 664 282" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.8" />
      {/* needle & seat at the inlet */}
      <rect x="656" y="248" width="22" height="14" fill="none" stroke="#9a9ca0" strokeWidth="1.3" />
      <path d="M 663 262 L 667 278 L 671 262" fill="none" stroke="#9a9ca0" strokeWidth="1.2" />
      {/* fuel inlet fitting + line from the right */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.3" strokeLinecap="round">
        <rect x="694" y="250" width="26" height="16" strokeOpacity="0.85" />
        <line x1="720" y1="258" x2="790" y2="258" strokeOpacity="0.6" />
      </g>
      {/* bowl vent tube */}
      <path
        d="M 600 240 L 600 204 Q 600 192 588 192"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* main jet + main well up to the booster */}
      <rect x="556" y="434" width="20" height="12" fill="none" stroke="#9a9ca0" strokeWidth="1.3" />
      <path
        d="M 566 434 L 566 300 Q 566 282 540 280 L 460 280"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.65"
      />
      {/* accelerator pump well + squirter into the venturi */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.1" strokeOpacity="0.7" strokeLinecap="round">
        <path d="M 596 452 L 596 388 M 620 452 L 620 388" />
        <line x1="598" y1="398" x2="618" y2="398" strokeWidth="1.6" />
        <line x1="608" y1="398" x2="608" y2="360" />
        <path d="M 608 388 L 608 254 Q 608 228 560 222 L 472 214" strokeDasharray="3 4" />
        <path d="M 472 214 L 462 224" />
      </g>

      {/* fuel past the throttle plate — the drip into the oil */}
      <g stroke="#ffb066" strokeOpacity="0.7" fill="none" strokeLinecap="round">
        <line x1="430" y1="462" x2="430" y2="524" strokeWidth="1" strokeDasharray="2 6" />
      </g>
      <circle cx="430" cy="534" r="2.2" fill="#ffb066" fillOpacity="0.8" />
      <circle cx="424" cy="548" r="1.4" fill="#ffb066" fillOpacity="0.5" />

      {/* ══ THE E10 DROPLET ══ */}
      <path
        d="M 806 214 Q 788 246 806 262 Q 824 246 806 214"
        fill="#ffb066"
        fillOpacity="0.14"
        stroke="#ffb066"
        strokeWidth="1.3"
      />
      <text
        x="806"
        y="252"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.08em"
        fill="#ffd9ad"
      >
        E10
      </text>
      <path d="M 806 262 L 806 258 M 795 268 L 760 258" stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none" />
      <text
        x="806"
        y="292"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.16em"
        fill="#9a9ca0"
        fillOpacity="0.6"
      >
        IN THE PUMP GAS
      </text>

      {/* ══ LEADER LINES — label column to pin ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        {/* right column */}
        <path d="M 900 166 L 700 230" />
        <path d="M 900 336 L 668 348" />
        <path d="M 900 116 L 618 178" />
        <path d="M 900 416 L 590 400" />
        {/* left column */}
        <path d="M 214 206 L 442 216" />
        <path d="M 214 396 L 540 440" />
        <path d="M 214 300 L 400 428" />
        <path d="M 214 500 L 408 534" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 700, y: 230, n: "1" },
          { x: 668, y: 348, n: "2" },
          { x: 460, y: 216, n: "3" },
          { x: 618, y: 178, n: "4" },
          { x: 552, y: 440, n: "5" },
          { x: 590, y: 400, n: "6" },
          { x: 396, y: 434, n: "7" },
          { x: 430, y: 534, n: "8" },
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
        {/* right column — bowl-side signs */}
        <text x="1160" y="120" textAnchor="end" fill="#ffb066">
          4 · RAW-FUEL SMELL — BOWL VENT &amp; SEAMS
        </text>
        <text x="1160" y="170" textAnchor="end" fill="#ffb066">
          1 · FLOODING — NEEDLE &amp; SEAT
        </text>
        <text x="1160" y="340" textAnchor="end" fill="#ffb066">
          2 · HARD HOT-START — FUEL BOILS IN THE BOWL
        </text>
        <text x="1160" y="420" textAnchor="end" fill="#ffb066">
          6 · SURGING AT CRUISE — PUMP WELL &amp; PASSAGES
        </text>
        {/* left column — bore-side signs */}
        <text x="40" y="210" fill="#ffb066">
          3 · OFF-IDLE STUMBLE — PUMP SHOT
        </text>
        <text x="40" y="304" fill="#ffb066">
          7 · VACUUM LEAK — THROTTLE SHAFT
        </text>
        <text x="40" y="400" fill="#ffb066">
          5 · SOOTY PLUGS — MAIN JET, RICH
        </text>
        <text x="40" y="504" fill="#ffb066">
          8 · FUEL IN THE OIL — LEAK-DOWN
        </text>
        {/* steel feature labels */}
        <text x="290" y="120" textAnchor="end" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          CHOKE PLATE
        </text>
        <text x="760" y="360" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          FLOAT BOWL
        </text>
        <text x="290" y="470" textAnchor="end" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          THROTTLE PLATE
        </text>
      </g>
      <path d="M 296 116 L 380 140" stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.4" fill="none" />
      <path d="M 296 466 L 352 452" stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.4" fill="none" />

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
        FIG. C — ONE CASTING, EIGHT WAYS IT TELLS YOU IT&rsquo;S DONE
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        The rule is one sentence: if turning a screw fixes it and it stays fixed, your carburetor
        needed an <strong>adjustment</strong> — if the same problem keeps coming back, something
        inside is worn, and that is a <strong>rebuild</strong>. Flooding, hard hot starts, off-idle
        stumble, fuel smell, sooty plugs, surging, a wet throttle shaft, and gas in the oil are the
        eight ways a carb says the second thing.
      </p>

      <h2>Adjustment or rebuild — what&rsquo;s the difference?</h2>
      <p>
        An adjustment moves a setting: idle mixture screws, idle speed, float level, accelerator
        pump linkage, choke index. Five minutes with a screwdriver and a vacuum gauge, and the
        change either helps or it does not. A rebuild replaces the parts that wear and cleans the
        passages you cannot see — needle and seat, accelerator pump, power valve, every gasket,
        and the varnish scrubbed out of jets and wells. One is tuning. The other is surgery.
      </p>
      <p>
        The trap is that a worn carburetor will still <strong>respond</strong> to adjustment. Lean
        out the idle screws to fight a rich condition caused by a sinking float and the idle
        improves for a week — then the float sinks a little further and you are chasing it again.
        Adjustments hold on healthy hardware. When settings will not stay put, stop turning screws
        and start reading symptoms. That diagnosis-first approach is the whole point of the{" "}
        <Link href="/services/classic-performance-tuning">performance and tuning service</Link>:
        find what is actually wrong, then fix that.
      </p>
      <blockquote>
        <p>A screw that needs re-turning every month is not a setting. It is a symptom.</p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>

      <h2>What are the 8 signs your carburetor needs a rebuild?</h2>

      <h3>1. Flooding, or fuel dripping into the venturi</h3>
      <p>
        Look down the throat with the engine off. Fuel dripping from the booster, or an engine
        that dies rich and reeks after sitting five minutes, means the needle and seat are not
        holding back fuel pressure — a worn needle tip, a grooved seat, debris from the tank, or a
        float that has absorbed fuel and sunk.<a href="#src-1" className="cite-ref">[1]</a> A
        stuck float sometimes frees with a tap. A grooved seat never does. Persistent flooding is
        the clearest rebuild sign on this list, and the most urgent — raw fuel over a hot engine
        is a fire looking for a date.
      </p>

      <h3>2. Hard starting when the engine is hot</h3>
      <p>
        Starts fine cold, cranks forever after a twenty-minute heat soak. That is fuel boiling out
        of the float bowl into the intake — percolation — and today&rsquo;s more volatile pump gas
        does it more readily than the fuel these carbs were designed around. An insulating spacer
        can help a healthy carb. But when hot-start trouble arrives gradually and keeps getting
        worse, the usual truth is shrunken, dried gaskets and a tired needle valve letting the
        bowl vent and flood where it should seal. Gaskets are not adjustable. They are replaced.
      </p>

      <h3>3. Hesitation or stumble just off idle</h3>
      <p>
        Tip in from a stop and the engine falls on its face before catching. That hole is the
        accelerator pump&rsquo;s job to fill, and the test takes ten seconds: engine off, look down
        the carb, work the throttle. You should see a strong, instant squirt. A weak dribble or
        nothing at all means a hardened pump cup, a stuck check valve, or a varnished passage —
        rebuild-kit parts, all three. Linkage adjustment only changes <strong>when</strong> the
        shot arrives. It cannot restore a shot that is not there.
      </p>

      <h3>4. Raw fuel smell in the garage</h3>
      <p>
        A parked classic should not perfume the shop. A persistent gasoline smell means fuel is
        escaping somewhere — weeping past dried bowl gaskets, seeping at warped casting joints, or
        evaporating out of a bowl that no longer seals. Look for wet stains and dark tracks below
        the bowl seams. Beyond the smell, this is money and safety evaporating at once: fuel that
        leaves the bowl overnight is also why the car needs ten seconds of cranking every morning
        to refill it.
      </p>

      <h3>5. Black, sooty spark plugs</h3>
      <p>
        Dry black soot on the plugs, black smoke on throttle, fuel economy falling — the engine is
        running rich, everywhere, all the time. If the mixture screws barely change anything, the
        extra fuel is coming from somewhere the screws do not control: a high or sinking float, a
        leaking power valve or worn metering rods, or an internal passage eroded past its spec.
        Chronic rich running also washes the oil film off cylinder walls and shortens engine life,
        which makes this the sign least worth ignoring for a season.
      </p>

      <h3>6. Surging at steady cruise</h3>
      <p>
        The speedometer breathes at a steady 100 km/h — surge, settle, surge. Cruise is the main
        circuit&rsquo;s territory, and surging there is almost always lean: varnish restricting
        the main jets, a low float level starving the well, or a passage half-blocked with
        crud that no spray can from outside will reach. Cleaning the discharge end and ignoring
        the supply side is why the same carb surges again a month later. Out of the car, apart,
        clean, wet-set — that fixes it.
      </p>

      <h3>7. Leaks at the throttle shaft</h3>
      <p>
        The throttle shaft rotates in bare casting bores, and fifty-plus years of pedal pushes
        wear those bores oval. The result is a vacuum leak that moves with the throttle — an idle
        you can never quite set, a lean stumble no jet change cures, and sometimes a visible fuel
        stain at the shaft ends. Grab the shaft and rock it: perceptible play means worn bores. No
        adjustment on the carburetor addresses this. The fix is drilling and bushing the bores,
        which is machine work that belongs inside a professional rebuild.
      </p>

      <h3>8. Fuel in the oil</h3>
      <p>
        Pull the dipstick and smell it. Gasoline in the crankcase means fuel is getting past the
        engine while it sits or runs — commonly a needle and seat leaking down, filling the intake
        until fuel drains past the rings. Thinned oil stops protecting bearings, so this sign ends
        the driving until it is fixed. Change the oil, rebuild the carb, and find the cause;
        on cars with a mechanical fuel pump, have the pump diaphragm checked at the same time,
        because it fails the same way with the same symptom.
      </p>

      <h2>What does ethanol fuel do to old carburetors?</h2>
      <p>
        More than any other single thing, modern pump gas is why carburetors that behaved for
        decades suddenly need attention. Canadian regulations have required an average renewable
        content in gasoline since 2010, and most regular pump gas carries up to 10 percent ethanol
        — E10. Natural Resources Canada is direct about the fit: ethanol blends are meant for
        vehicles built since the 1980s.<a href="#src-2" className="cite-ref">[2]</a> The federal
        Clean Fuel Regulations, in force since 2023, push the carbon intensity of gasoline down
        year over year, which keeps renewable content in the fuel pool for good.
        <a href="#src-3" className="cite-ref">[3]</a> Your classic predates all of it.
      </p>
      <p>
        Ethanol works on an old carburetor three ways. It is hygroscopic, so it pulls water out of
        the air, and that water-ethanol mix settles in the bowl and corrodes it from the inside.
        It attacks the rubber, cork, and leather parts vintage fuel systems were built with. And
        it is a solvent — it scrubs decades of varnish off tank and line walls and delivers the
        crumbs straight to your jets.<a href="#src-4" className="cite-ref">[4]</a> Cars that sit
        get it worst, because the ethanol has months to absorb water and gum undisturbed — the
        same reason the <Link href="/blog/barn-find-first-steps">barn-find protocol</Link> assumes
        every long-parked carburetor needs a rebuild before it needs a key.
      </p>
      <p>
        The practical defence is not exotic: drive the car regularly, run ethanol-free premium
        where you can find it, stabilize or drain fuel before storage — and when the carb does
        come apart, insist on a modern kit with ethanol-resistant materials, so the rebuild is
        proof against the fuel it will actually live on.
      </p>

      <h2>Rebuild, replace, or convert to EFI?</h2>
      <p>
        Once a carb is condemned, there are three honest paths. Typical planning ranges in
        Canadian dollars, not quotes:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Rebuilding the original carburetor versus replacing it with a new carburetor versus
            converting to electronic fuel injection, compared by typical Canadian dollar cost,
            what you keep, best fit, and drawbacks
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Rebuild the original</th>
              <th scope="col">Replace with new</th>
              <th scope="col">Convert to EFI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Typical cost (CAD)</th>
              <td className="num">$350 – $900</td>
              <td className="num">$700 – $1,600</td>
              <td className="num">$4,000 – $8,000+ installed</td>
            </tr>
            <tr>
              <th scope="row">What you keep</th>
              <td>The original, date-coded casting — originality intact</td>
              <td>The carbureted look and simplicity, not the original part</td>
              <td>Neither — and usually a new fuel system with it</td>
            </tr>
            <tr>
              <th scope="row">Best when</th>
              <td>The core is sound and the car&rsquo;s originality matters</td>
              <td>The core is cracked, warped, or missing its guts</td>
              <td>You drive year-round and want modern cold starts</td>
            </tr>
            <tr>
              <th scope="row">Watch out for</th>
              <td>Cheap kits with fuel-hostile rubber</td>
              <td>Out-of-box calibration rarely matches your engine</td>
              <td>Wiring, fuel pump, and tuning are most of the bill</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The shop bias, honestly stated: on an otherwise original classic, rebuild. A correct
        casting with a proper rebuild and tune drives better than most people believe a carburetor
        can, and it keeps the car&rsquo;s history in one piece. EFI earns its cost when the car is
        a year-round driver or the engine is coming out anyway — in which case the conversation
        belongs on the <Link href="/services/engine-swaps-builds">engine swap and build page</Link>,
        where fuel, wiring, and cooling get planned as one system instead of bolted on one regret
        at a time.
      </p>

      <h2>What does a professional rebuild include — and what does it cost?</h2>
      <p>
        More than the kit. A rebuild done properly is: full teardown to the bare casting, chemical
        or ultrasonic cleaning of every passage, all new gaskets and seals, new needle and seat,
        new accelerator pump and power valve where fitted, throttle shaft bores bushed if worn,
        float level set wet, choke indexed, and the idle circuit dialed on the running engine. On
        a Rochester Quadrajet, add the model&rsquo;s known homework — the bottom well plugs that
        seep with age get sealed, and the factory calibration checked rather than guessed. The
        Q-jet&rsquo;s reputation as a core worth saving is deserved; specialist rebuilders have
        made a business of proving it.<a href="#src-5" className="cite-ref">[5]</a>
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$350–$900</span>
          <span className="stat-l">Typical professional rebuild, common carbs</span>
        </div>
        <div>
          <span className="stat-v">$75–$150</span>
          <span className="stat-l">Typical DIY kit — parts, not the job</span>
        </div>
        <div>
          <span className="stat-v">$900+</span>
          <span className="stat-l">Hard-worn cores, rare carbs, performance calibration</span>
        </div>
        <div>
          <span className="stat-v">10 sec</span>
          <span className="stat-l">The accelerator-pump squirt test. Free</span>
        </div>
      </div>
      <p>
        The spread is the core&rsquo;s condition. A clean four-barrel that needs gaskets and a
        wet float setting sits at the bottom of the range; a shaft-worn, varnish-choked carb off a
        car that sat for fifteen years sits at the top, because bushing bores and chasing passages
        is real bench time. Every one of those numbers is a planning range — the honest number
        comes after the carb is on the bench and apart.
      </p>

      <h2>Will it start at minus twenty-five?</h2>
      <p>
        In Edmonton, the choke is not a detail — it is half of whether the car gets driven past
        September. A cold engine needs a genuinely rich mixture, which means the choke plate must
        close fully against proper spring tension, the fast-idle cam must hold rpm up while
        everything warms, and the pull-off must crack the plate open the moment the engine fires
        so it does not drown. Three settings, in order, on hardware that actually moves freely —
        a choke fighting fifty years of varnish loses to a cold snap every time.
      </p>
      <p>
        Every carburetor that leaves this shop gets its choke set for real Alberta mornings, not a
        sea-level spec sheet. If the plan is to drive shoulder seasons — or you are deciding
        whether the car sleeps through winter at all — the{" "}
        <Link href="/guides/winter">winter guide</Link> covers storage, fuel, and cold-start
        strategy in one place.
      </p>
      <p>
        And if your classic just failed more than one of the eight signs above: stop adjusting.
        Carburetor work is deliberately the easy first job to hand a shop — no trailer, no
        teardown, one component off the engine and back on tuned. Send the year, engine, carb
        model if you know it, and what the car is doing through the{" "}
        <Link href="/quote">quote page</Link>, and you will get a straight answer: adjustment,
        rebuild, or — when it is true — the answer that your carb is fine and the problem lives
        in the ignition.
      </p>
    </>
  );
}
