import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Hail Season and the Classic Car.
 * The Alberta Life piece for the hail keyword cluster: where the corridor
 * runs, the storage hierarchy, the honest limits of PDR on old paint, and how
 * a claim actually plays out on an appraised classic. Links down into the
 * body-and-paint service, the appraisal and collector-insurance articles, the
 * winter guide, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "hail-and-classic-cars-alberta",
  title:
    "Hail Season and the Classic Car: Protection, Repair, and Insurance in Alberta",
  accent: "Hail Season",
  metaTitle: "Hail Season and the Classic Car in Alberta",
  description:
    "Where Alberta's hail corridor runs, how to shelter a classic, whether paintless dent repair survives old paint, and how an agreed-value hail claim plays out.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Alberta Life",
  targetKeywords: [
    "hail damage classic car",
    "paintless dent repair classic car",
    "hail protection Alberta",
    "classic car hail insurance claim",
    "hail season Alberta classic car storage",
  ],
  faq: [
    {
      q: "Does insurance cover hail damage on a classic car in Alberta?",
      a: "Only if you bought the optional coverage. Alberta's mandatory basic insurance is third-party liability and accident benefits — it pays nothing for hail. You need comprehensive, specified perils, or all perils on the policy, or a collector policy that includes them. On a classic, the coverage type matters as much as having it: an agreed-value collector policy pays a number you set in advance, while a standard policy pays actual cash value, which on old iron is an adjuster's guess unless you have an appraisal on file.",
    },
    {
      q: "Does paintless dent repair work on classic cars?",
      a: "The metal usually cooperates; the paint decides. PDR massages dents out from behind the panel with no filler and no respray, and old heavier-gauge steel moves fine under an experienced tech. The risk is the finish — factory lacquer and enamel from the fifties through the seventies goes brittle with decades of sun, and brittle paint can crack under the tool. A repainted classic in modern basecoat-clearcoat is usually a good candidate. Original survivor paint needs a test spot first, and sometimes the honest answer is to leave the dents alone.",
    },
    {
      q: "Should I repair hail damage or take the cash settlement?",
      a: "It depends on the car and the paint. On a driver with original paint and shallow cosmetic hail, taking the cash and living with the dents is often the right call — a respray costs originality that no settlement buys back. On a show car or a modern repaint, PDR or proper metal-and-paint work restores it. Know the catch before you pocket the money: in Alberta, an insurer can attach an endorsement (SEF 13H) that deletes hail coverage while existing damage sits unrepaired, so the next storm may be on you.",
    },
    {
      q: "How do I protect my classic car from hail in Alberta?",
      a: "Solve it in May, not in the storm. Hard cover is the only real protection: your garage, a rented indoor bay for June through September, or at minimum a solid carport. A padded hail cover or layered moving blankets are the 20-minute save when a warning goes out and the car is in the open. If you are driving when the sky turns green, get under a parkade or fuel-station canopy — do not ride it out on the shoulder. And confirm the comprehensive coverage exists before the season, because it is optional and cannot be added mid-storm.",
    },
    {
      q: "How long do I have to report a hail claim in Alberta?",
      a: "Legally you have up to two years to report, but waiting is how claims go sideways — report within days. Before you call: get the car dry and under cover, wash it gently, and photograph every panel in low-angle morning or evening light, when hail dents actually show. Keep receipts for anything you spend protecting the car. Get your own repair estimate from a shop that knows old metal before you agree to any settlement number, and stay away from the pop-up hail-repair tents that follow every big storm.",
    },
  ],
  citations: [
    {
      name: "Northern Hail Project, Western University",
      url: "https://www.uwo.ca/nhp/",
    },
    {
      name: "“August hailstorm in Calgary results in nearly $2.8 billion in insured damage,” Insurance Bureau of Canada, September 2024",
      url: "https://www.ibc.ca/news-insights/news/august-hailstorm-in-calgary-results-in-nearly-2-8-billion-in-insured-damage",
    },
    {
      name: "“Hail and insurance,” Insurance Bureau of Canada severe weather centre",
      url: "https://www.ibc.ca/stay-protected/severe-weather-centre/hail-and-insurance",
    },
    {
      name: "“Automobile insurance,” Government of Alberta",
      url: "https://www.alberta.ca/automobile-insurance",
    },
    {
      name: "“Insurance 101: What Does Our Insurance Cover?,” Hagerty insurance guides",
      url: "https://www.hagerty.com/resources/insurance-guides/insurance-101-what-does-our-insurance-cover",
    },
  ],
  internalLinks: [
    "/guides/winter",
    "/services/body-paint-metalwork",
    "/blog/classic-car-appraisal-alberta",
    "/blog/collector-car-insurance-alberta",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * A classic coupe in steel line art under a hail sky — dashed stone streaks
 * falling from an anvil cloud, a padded cover quilted over the nose, tungsten
 * impact marks on the bare rear half. Right column: the stone-size scale from
 * toonie to the 2024 Calgary eggs. Bottom: the season strip, June to
 * September, peak burned in tungsten. Editorial plate in the shop style.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical diagram of a classic coupe in profile under a hailstorm: dashed hail streaks fall from a stylized cloud band, a quilted padded cover protects the front half of the car while tungsten impact marks show dents on the exposed roof and deck, a size scale at right compares toonie, golf ball, and chicken-egg hailstones, and a season strip along the bottom marks Alberta's June-to-September hail season with the late-July-to-August peak highlighted"
      className="h-auto w-full"
    >
      <title>The season, the stones, and what stands between them — hail over a classic</title>
      <defs>
        <radialGradient id="hl-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pool of light under the car */}
      <ellipse cx="520" cy="546" rx="340" ry="32" fill="url(#hl-pool)" />

      {/* ══ THE CLOUD BAND ══ */}
      <g fill="none" stroke="#9a9ca0" strokeLinecap="round">
        <path d="M 170 96 Q 380 58 620 82 Q 880 60 1030 92" strokeWidth="1.6" strokeOpacity="0.6" />
        <path d="M 230 118 Q 430 92 640 108 Q 840 92 980 114" strokeWidth="1.2" strokeOpacity="0.45" />
        <path d="M 320 138 Q 500 122 660 132 Q 800 122 900 136" strokeWidth="1" strokeOpacity="0.3" />
      </g>
      <text
        x="600"
        y="176"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        HAILSTORM ALLEY — HIGH RIVER TO LACOMBE
      </text>

      {/* ══ HAIL STREAKS ══ */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" fill="none" strokeLinecap="round" strokeDasharray="2 7">
        <line x1="330" y1="196" x2="308" y2="424" />
        <line x1="410" y1="190" x2="392" y2="418" />
        <line x1="700" y1="196" x2="682" y2="428" />
        <line x1="850" y1="196" x2="836" y2="520" />
        <line x1="250" y1="204" x2="232" y2="520" />
      </g>
      <g stroke="#ffb066" strokeWidth="1.1" strokeOpacity="0.65" fill="none" strokeLinecap="round" strokeDasharray="2 7">
        <line x1="560" y1="190" x2="546" y2="374" />
        <line x1="620" y1="194" x2="606" y2="380" />
        <line x1="760" y1="192" x2="744" y2="432" />
      </g>

      {/* ══ THE CAR — steel line art, nose left ══ */}
      {/* upper body line */}
      <path
        d="M 252 512 Q 252 478 270 468 L 282 460 Q 306 450 344 446 L 432 440 Q 454 396 488 384 Q 546 374 594 382 Q 636 392 662 418 Q 700 436 742 440 Q 782 444 794 460 Q 802 472 800 500 L 800 512"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* rockers and wheel arches */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 800 512 L 752 512" />
        <path d="M 752 512 Q 714 468 676 512" />
        <path d="M 676 512 L 392 512" />
        <path d="M 392 512 Q 354 468 316 512" />
        <path d="M 316 512 L 252 512" />
      </g>
      {/* wheels */}
      <g fill="none" stroke="#9a9ca0">
        <circle cx="354" cy="540" r="33" strokeWidth="1.6" strokeOpacity="0.85" />
        <circle cx="354" cy="540" r="11" strokeWidth="1" strokeOpacity="0.5" />
        <circle cx="714" cy="540" r="33" strokeWidth="1.6" strokeOpacity="0.85" />
        <circle cx="714" cy="540" r="11" strokeWidth="1" strokeOpacity="0.5" />
      </g>
      {/* glasshouse + character line */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55" strokeLinecap="round">
        <path d="M 448 438 Q 466 402 494 392 L 560 386 L 566 434" />
        <path d="M 576 386 Q 620 392 646 420" />
        <line x1="284" y1="470" x2="770" y2="452" />
      </g>

      {/* ══ PADDED COVER over the nose — quilted, tungsten ══ */}
      <path
        d="M 240 508 Q 240 468 262 452 Q 296 434 342 430 L 434 424 Q 458 380 494 368 Q 528 360 556 364 L 552 380"
        fill="none"
        stroke="#ffb066"
        strokeWidth="1.4"
        strokeOpacity="0.85"
        strokeLinecap="round"
      />
      {/* quilt ticks */}
      <g stroke="#ffb066" strokeWidth="0.9" strokeOpacity="0.5" strokeLinecap="round">
        <line x1="266" y1="450" x2="274" y2="462" />
        <line x1="308" y1="436" x2="313" y2="449" />
        <line x1="352" y1="429" x2="355" y2="442" />
        <line x1="398" y1="426" x2="400" y2="439" />
        <line x1="446" y1="408" x2="456" y2="416" />
        <line x1="474" y1="382" x2="484" y2="390" />
        <line x1="512" y1="366" x2="518" y2="378" />
      </g>
      {/* stones bouncing off the cover */}
      <g stroke="#ffb066" strokeWidth="1" strokeOpacity="0.7" fill="none" strokeLinecap="round">
        <path d="M 330 412 Q 344 398 362 404" strokeDasharray="2 4" />
        <circle cx="364" cy="404" r="2.4" strokeOpacity="0.9" />
        <path d="M 486 352 Q 498 340 514 344" strokeDasharray="2 4" />
        <circle cx="516" cy="344" r="2" strokeOpacity="0.9" />
      </g>

      {/* ══ IMPACT MARKS on the bare rear half ══ */}
      <g stroke="#ffb066" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M 596 382 Q 602 388 608 382" />
        <path d="M 630 396 Q 636 402 642 396" />
        <path d="M 676 428 Q 682 434 688 428" />
        <path d="M 718 440 Q 724 446 730 440" />
        <path d="M 762 446 Q 768 452 774 446" />
      </g>

      {/* ══ LEADER LINES + LABELS ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 208 262 L 330 428" />
        <path d="M 208 330 L 620 398" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10.5"
        letterSpacing="0.16em"
      >
        <text x="40" y="258" fill="#ffb066">
          PADDED COVER — THE 20-MINUTE SAVE
        </text>
        <text x="40" y="326" fill="#ffb066">
          BARE STEEL — WHERE THE CLAIM STARTS
        </text>
      </g>

      {/* ══ STONE SCALE, right column ══ */}
      <text
        x="1056"
        y="232"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        THE STONES
      </text>
      <g fill="none">
        <circle cx="1056" cy="272" r="14" stroke="#9a9ca0" strokeWidth="1.3" strokeOpacity="0.8" />
        <circle cx="1056" cy="344" r="21" stroke="#9a9ca0" strokeWidth="1.3" strokeOpacity="0.8" />
        <circle cx="1056" cy="432" r="28" stroke="#ffb066" strokeWidth="1.4" strokeOpacity="0.9" />
      </g>
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9.5"
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        <text x="1056" y="302" fill="#9a9ca0" fillOpacity="0.65">
          28 MM · TOONIE
        </text>
        <text x="1056" y="382" fill="#9a9ca0" fillOpacity="0.65">
          43 MM · GOLF BALL
        </text>
        <text x="1056" y="478" fill="#ffd9ad">
          CHICKEN EGG · CALGARY 2024
        </text>
      </g>

      {/* ══ SEASON STRIP ══ */}
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5" fill="none" strokeLinecap="round">
        <line x1="160" y1="598" x2="840" y2="598" />
        <line x1="160" y1="592" x2="160" y2="604" />
        <line x1="296" y1="592" x2="296" y2="604" />
        <line x1="432" y1="592" x2="432" y2="604" />
        <line x1="568" y1="592" x2="568" y2="604" />
        <line x1="704" y1="592" x2="704" y2="604" />
        <line x1="840" y1="592" x2="840" y2="604" />
      </g>
      <line
        x1="296"
        y1="598"
        x2="704"
        y2="598"
        stroke="#ffb066"
        strokeWidth="2.4"
        strokeOpacity="0.85"
        strokeLinecap="round"
      />
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="9"
        letterSpacing="0.14em"
        textAnchor="middle"
      >
        <text x="160" y="618" fill="#9a9ca0" fillOpacity="0.55">MAY</text>
        <text x="296" y="618" fill="#ffd9ad">JUN</text>
        <text x="432" y="618" fill="#ffd9ad">JUL</text>
        <text x="568" y="618" fill="#ffd9ad">AUG</text>
        <text x="704" y="618" fill="#ffd9ad">SEP</text>
        <text x="840" y="618" fill="#9a9ca0" fillOpacity="0.55">OCT</text>
        <text x="500" y="586" fill="#ffb066" letterSpacing="0.16em">
          PEAK — LATE JUL TO AUG
        </text>
      </g>

      {/* plate caption */}
      <text
        x="600"
        y="648"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.18em"
        fill="#9a9ca0"
        fillOpacity="0.55"
      >
        FIG. H — THE SEASON, THE STONES, AND WHAT STANDS BETWEEN THEM
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        Get the car under hard cover from June through September, because comprehensive or
        specified perils coverage — not basic Alberta insurance — is what pays for hail.
        Paintless dent repair works on old steel but old paint decides it, and an appraised
        classic&rsquo;s claim starts with photographs and your appraisal file, not the
        adjuster&rsquo;s guess.
      </p>

      <h2>When is hail season in Alberta — and is Edmonton in the line of fire?</h2>
      <p>
        Hailstorm Alley is real and it is mapped: the belt of Canada&rsquo;s worst hail runs from
        High River up through Calgary to Red Deer and Lacombe. Alberta is where the country sends
        its hail scientists — the Northern Hail Project, Canada&rsquo;s dedicated hail research
        program, stages its summer field campaign out of Olds, right in the middle of the
        belt.<a href="#src-1" className="cite-ref">[1]</a> Edmonton sits past the north end of the
        alley, which is better than being in it and nothing like being out of it. Leduc and Nisku
        sit closer still, and the storms that build over the foothills on a hot July afternoon do
        not check municipal boundaries on their way northeast.
      </p>
      <p>
        The season runs June through September, and the ugly weeks are late July and August. For
        scale: the storm that crossed Calgary on August 5, 2024 dropped stones the size of chicken
        eggs and left insurers processing more than 130,000 claims and nearly $2.8 billion in
        damage — the second-costliest disaster in Canadian history, behind only the Fort McMurray
        fire.<a href="#src-2" className="cite-ref">[2]</a> That was one storm, one evening. A
        classic that lives outside in this province every summer is not unlucky when it gets
        hammered. It was scheduled.
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$2.8B</span>
          <span className="stat-l">Insured damage, one Calgary hailstorm, August 2024</span>
        </div>
        <div>
          <span className="stat-v">130,000+</span>
          <span className="stat-l">Claims filed from that single evening</span>
        </div>
        <div>
          <span className="stat-v">JUN–SEP</span>
          <span className="stat-l">Alberta&rsquo;s hail season — worst in late July and August</span>
        </div>
        <div>
          <span className="stat-v">2 years</span>
          <span className="stat-l">Legal window to report a claim. Use days instead</span>
        </div>
      </div>

      <h2>How do you protect a classic from hail before the storm hits?</h2>
      <p>
        There is exactly one real answer and a ladder of compromises. The real answer is hard
        cover: your garage, a friend&rsquo;s shop, or a rented indoor bay for the season — the
        same indoor spot that saves the car in January saves it in July, and the{" "}
        <Link href="/guides/winter">winter guide</Link> covers how to find and vet one. Indoor
        storage around Edmonton commonly runs $75 to $250 CAD a month, which reads differently
        when you price a respray. Below that comes a solid carport, which stops most vertical
        hail but not the wind-driven stuff, and below that the 20-minute save: a purpose-made
        padded hail cover — typically $150 to $500 CAD — or, in a pinch, moving blankets doubled
        over the horizontal panels and strapped down. Glass takes hits too, so drape past the
        pillars, not just the roof skin.
      </p>
      <p>
        The 20 minutes is the point. Hail warnings in Alberta arrive with almost no runway, so a
        plan you have to invent during the weather alert is not a plan. Decide in May where the
        car goes, keep the blankets where you can grab them, and watch the sky on any hot
        afternoon with a storm line building to the southwest. If you are out driving when it
        turns, get under a parkade or a fuel-station canopy and wait it out — not under a tree,
        and not on the shoulder hoping. And check the policy before the season opens: hail lives
        under comprehensive coverage, which is optional, and no broker can add it while the storm
        is on the radar.<a href="#src-3" className="cite-ref">[3]</a>
      </p>

      <h2>Does paintless dent repair work on old steel and old paint?</h2>
      <p>
        Paintless dent repair — PDR — is a technician massaging the dent out from behind the panel
        with steel rods, no filler and no respray. On hail it is the gold standard, because hail
        dents are exactly what it is best at: shallow, round, unstretched. On a classic the metal
        is usually the easy half of the question. Old body panels are heavier-gauge than modern
        stampings, so they move slower under the tool, but an experienced tech can work them.
      </p>
      <p>
        The paint is the hard half. PDR flexes the finish while the metal moves, and it was
        developed in the era of modern basecoat-clearcoat, which bends. Factory lacquer and
        enamel from the fifties through the seventies do not — decades of ultraviolet leave it
        brittle, and brittle paint can crack or spider under a rod. The working rule at this
        bench: a classic wearing a modern repaint is usually a good PDR candidate; original
        factory paint gets a test pull on a hidden spot first, and sometimes the answer is no.
        Access is the other honest problem — roof rails, braced hoods, and double-skinned
        decklids were not designed with service holes, so trim or headliner may have to come out
        to reach the backside, and on a sixty-year-old interior that is its own careful job.
      </p>
      <blockquote>
        <p>A dent is honest. A bad repaint lies about the whole car.</p>
        <footer>Shop rule, said over more than one hood</footer>
      </blockquote>
      <p>
        Which is why survivor paint deserves a hard think before anyone touches it. Original
        finish only exists once; shallow hail on a survivor is often better left alone than
        traded for a respray. Where PDR is off the table — cracked paint, creased or stretched
        metal, stones that found an edge — the fix is proper{" "}
        <Link href="/services/body-paint-metalwork">metal and paint work</Link>: bumping, filing,
        and refinishing panel by panel, matched to the age of the car rather than sprayed over
        it.
      </p>

      <h2>What should you do in the first 48 hours after hail?</h2>
      <p>
        First, stop the secondary damage. If glass is broken, tarp the openings and get the car
        under cover — a hailstorm is usually towing rain behind it, and water in a classic
        interior turns a body claim into a floor-pan and wiring problem. Then document before you
        negotiate: wash the car gently and photograph every panel in low-angle morning or evening
        light, which is when hail dents actually show. Wide shots to place the car, close-ups of
        every panel, the glass, and the brightwork. The Insurance Bureau of Canada&rsquo;s advice
        is the same for a &rsquo;67 as for a lease return — photograph the damage, keep receipts
        for anything you spend protecting the car, and report promptly; you have up to two years
        by law, but claims filed in days go smoother than claims filed in
        months.<a href="#src-3" className="cite-ref">[3]</a>
      </p>
      <p>
        Second, protect the car from the repair industry that follows the weather. After every
        major Alberta storm, pop-up hail-repair tents appear in parking lots, staffed by
        travelling PDR crews of wildly variable skill, priced to harvest insurance money, and
        gone by October. Some of those techs are genuinely good. None of them will be here in
        February if the paint they cracked starts lifting. A classic is not a three-year-old
        pickup: before you agree to any settlement or sign any work authorization, get an
        estimate from a shop that knows old metal and will still answer the phone next year.
      </p>

      <h2>How does a hail claim play out on an appraised classic?</h2>
      <p>
        Start with what Alberta actually requires: basic insurance is third-party liability and
        accident benefits, full stop. Hail lives in the optional tier — comprehensive, specified
        perils, or all perils — and if nobody ever added it, there is no
        claim.<a href="#src-4" className="cite-ref">[4]</a> On a proper collector policy the
        coverage is usually there, and the number behind it matters more: agreed value means you
        and the insurer fixed the car&rsquo;s worth when the policy was written, and a total loss
        pays that figure less deductible and salvage, with no depreciation
        argument.<a href="#src-5" className="cite-ref">[5]</a> A standard policy pays actual cash
        value instead — an adjuster&rsquo;s book number that treats your car as an old car rather
        than a documented one. The gap between those two outcomes is the whole case for a{" "}
        <Link href="/blog/collector-car-insurance-alberta">collector policy</Link> and a current{" "}
        <Link href="/blog/classic-car-appraisal-alberta">appraisal</Link> sitting in the file
        before the storm, not after.
      </p>
      <p>
        On a repairable claim, expect the adjuster&rsquo;s first number to assume PDR at
        commodity-car rates. Push back with your shop&rsquo;s estimate where the paint or the
        panel construction rules PDR out — that is a technical argument, and photographs plus a
        written assessment from a shop that works old steel usually carry it. You can also take a
        cash settlement and skip the repair entirely, which on a driver-grade survivor is often
        the smart play. Know the catch first: Alberta&rsquo;s endorsement list includes SEF 13H,
        which deletes hail coverage while existing damage sits unrepaired — so the settlement you
        pocket this August may mean the next storm is entirely on
        you.<a href="#src-4" className="cite-ref">[4]</a> Ask your broker exactly what taking the
        cash does to the policy before you decide.
      </p>

      <h2>Should you repair it, cash it, or drive it dented?</h2>
      <p>
        Typical planning ranges in Canadian dollars, not quotes — hail repair on a classic is
        bid panel by panel, after the paint is assessed:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            Paintless dent repair versus conventional metal and paint work versus taking a cash
            settlement on a hail-damaged classic car, compared by typical Canadian dollar cost,
            best fit, and drawbacks
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Paintless dent repair</th>
              <th scope="col">Metal &amp; paint</th>
              <th scope="col">Cash out, drive dented</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Typical cost (CAD)</th>
              <td className="num">$150 – $500 per panel</td>
              <td className="num">$900 – $2,500 per panel, refinished</td>
              <td className="num">$0 out of pocket — settlement banked</td>
            </tr>
            <tr>
              <th scope="row">What you keep</th>
              <td>The original finish, untouched</td>
              <td>Straight steel — at the cost of original paint</td>
              <td>Originality, dents included, plus the money</td>
            </tr>
            <tr>
              <th scope="row">Best when</th>
              <td>Modern repaint, shallow round dents, reachable backsides</td>
              <td>Cracked paint, creases, stretched metal, or a respray already planned</td>
              <td>Survivor paint, driver-grade car, cosmetic-only damage</td>
            </tr>
            <tr>
              <th scope="row">Watch out for</th>
              <td>Brittle factory lacquer — test a hidden spot first</td>
              <td>Colour match and texture on an aged finish is skilled work</td>
              <td>SEF 13H can delete hail coverage on unrepaired damage</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The honest sort: a show car or a fresh repaint gets fixed, and PDR does most of it. A
        survivor with shallow hail often keeps its dents and its dignity, with the settlement in
        the bank against the day the car needs something that matters. The car that got hit hard
        — cracked paint, folded ridges, broken glass — needs real bodywork, planned properly,
        because a hurried insurance-grade respray is the kind of repair this shop spends winters
        undoing. If your classic caught a storm this season, send photos of every panel in
        raking light through the <Link href="/quote">quote page</Link> and you will get a
        straight answer: what PDR can save, what needs steel and paint, and what — honestly — is
        better left exactly as the sky made it.
      </p>
    </>
  );
}
