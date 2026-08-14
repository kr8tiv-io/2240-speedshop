import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Road to Radium.
 * The shop-life piece for the Radium Show & Shine keyword cluster. Event
 * facts verified against the Columbia Valley Classics club pages, August
 * 2026. Links down into builds, the restoration service page, the winter
 * storage guide, the about page, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "road-to-radium-show-and-shine",
  title:
    "Road to Radium: The Columbia Valley Classics Show & Shine, From a Shop That Makes the Trip",
  accent: "Radium",
  metaTitle: "Road to Radium — Columbia Valley Classics Show & Shine 2026",
  description:
    "The Columbia Valley Classics Show & Shine returns to Radium Hot Springs September 18–19, 2026 — over 1,000 classics, one mountain village, and a drive we make most years.",
  datePublished: "2026-08-12",
  dateModified: "2026-08-12",
  author: "2240 Speed Shop",
  category: "Shop Life",
  targetKeywords: [
    "radium car show",
    "columbia valley classics show and shine",
    "radium hot springs car show dates",
    "radium show and shine 2026",
    "road to radium",
  ],
  faq: [
    {
      q: "When is the Radium car show in 2026?",
      a: "The 36th annual Columbia Valley Classics Show & Shine runs September 18 and 19, 2026. Friday is the poker run and registration day; the show itself is Saturday, September 19, at the Springs Golf Course in Radium Hot Springs, BC. Details can shift year to year, so confirm on the club's official page before you travel.",
    },
    {
      q: "How many cars attend the Radium Show & Shine?",
      a: "The club describes an annual showing of over 1,000 classic cars, and local reporting from 2024 put it at roughly 800 registered vehicles plus a few hundred more that arrive without registering. Either way, the show fills the golf course driving range and the village around it.",
    },
    {
      q: "How far is Radium from Edmonton?",
      a: "Roughly 550 kilometres by road — around five and a half to six and a half hours without long stops. The usual route runs south to Calgary, west on the Trans-Canada past Banff, then south on Highway 93 over Vermilion Pass and down through Kootenay National Park into Radium. In a classic, plan it as a full day.",
    },
    {
      q: "Do I need to register to show a car at Radium?",
      a: "Yes — vehicles on the show field are registered, either online in advance for $25 plus a booking fee or in person for $30 cash on the Friday or Saturday morning. Registration does not guarantee a parking spot: volunteers park the field first come, first served, and the gates close at 11 a.m., so arrive early.",
    },
  ],
  citations: [
    {
      name: "“Show and Shine,” Columbia Valley Classics Car Club (official event page)",
      url: "https://columbiavalleyclassics.ca/show-and-shine",
    },
    {
      name: "“Show & Shine Online Registration,” Columbia Valley Classics Car Club",
      url: "https://columbiavalleyclassics.ca/online-registration",
    },
    {
      name: "“‘Show and Shine’ roars back to Radium,” Columbia Valley Pioneer, September 2024",
      url: "https://www.columbiavalleypioneer.com/show-and-shine-roars-back-to-radium/",
    },
    {
      name: "“Driving Distance from Edmonton, Canada to Radium Hot Springs, Canada,” Travelmath",
      url: "https://www.travelmath.com/drive-distance/from/Edmonton,+Canada/to/Radium+Hot+Springs,+Canada",
    },
  ],
  internalLinks: [
    "/builds",
    "/services/classic-car-restoration",
    "/guides/winter",
    "/about",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * Night route map: the Edmonton-to-Radium run as one tungsten ribbon
 * descending out of the prairie, through two ranges of black-on-black
 * mountain silhouettes, into the warm glow at the canyon mouth. A classic
 * pickup mid-route with its lights on. Distance markers in mono. Editorial
 * poster, not a navigation aid — every glow has a source.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 640"
      role="img"
      aria-label="Editorial night route map of the drive from Edmonton to Radium Hot Springs: a glowing ribbon road descends from the prairie through dark mountain silhouettes under stars, past markers for Calgary, Vermilion Pass, and Sinclair Canyon, with a classic pickup mid-route and a warm glow at the village"
      className="h-auto w-full"
    >
      <title>The September run — Edmonton to Radium, one ribbon of road</title>
      <defs>
        <radialGradient id="rr-village" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd9ad" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#ffb066" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rr-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffd9ad" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffd9ad" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rr-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ══ STARS ══ */}
      <g fill="#ffd9ad">
        <circle cx="120" cy="70" r="1.2" fillOpacity="0.5" />
        <circle cx="238" cy="44" r="0.9" fillOpacity="0.35" />
        <circle cx="342" cy="96" r="1.4" fillOpacity="0.45" />
        <circle cx="470" cy="52" r="1" fillOpacity="0.3" />
        <circle cx="562" cy="120" r="1.3" fillOpacity="0.5" />
        <circle cx="668" cy="66" r="0.9" fillOpacity="0.4" />
        <circle cx="742" cy="132" r="1.1" fillOpacity="0.3" />
        <circle cx="836" cy="58" r="1.5" fillOpacity="0.55" />
        <circle cx="922" cy="110" r="1" fillOpacity="0.35" />
        <circle cx="1006" cy="48" r="1.2" fillOpacity="0.45" />
        <circle cx="1084" cy="128" r="0.9" fillOpacity="0.3" />
        <circle cx="1148" cy="76" r="1.3" fillOpacity="0.5" />
        <circle cx="404" cy="160" r="0.8" fillOpacity="0.3" />
        <circle cx="906" cy="196" r="1" fillOpacity="0.35" />
        <circle cx="60" cy="150" r="1" fillOpacity="0.35" />
        <circle cx="1180" cy="180" r="0.8" fillOpacity="0.3" />
      </g>

      {/* ══ FAR RANGE — thin ridgeline, no fill ══ */}
      <path
        d="M 40 330 L 130 274 L 205 308 L 295 252 L 372 296 L 452 240 L 534 290 L 614 230 L 702 282 L 786 238 L 872 286 L 952 246 L 1042 294 L 1128 254 L 1200 296"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeLinejoin="round"
      />

      {/* ══ MID RANGE LEFT — filled silhouette ══ */}
      <path
        d="M 0 640 L 0 560 L 90 462 L 158 516 L 242 438 L 316 522 L 396 470 L 452 560 L 470 640 Z"
        fill="#0a0a0b"
        stroke="#9a9ca0"
        strokeWidth="1.1"
        strokeOpacity="0.45"
        strokeLinejoin="round"
      />

      {/* ══ NEAR RANGE RIGHT — filled silhouette the road descends across ══ */}
      <path
        d="M 730 640 L 806 462 L 868 514 L 948 418 L 1024 496 L 1102 442 L 1168 512 L 1200 490 L 1200 640 Z"
        fill="#0a0a0b"
        stroke="#9a9ca0"
        strokeWidth="1.1"
        strokeOpacity="0.5"
        strokeLinejoin="round"
      />

      {/* ══ THE VILLAGE GLOW at the canyon mouth ══ */}
      <ellipse cx="1012" cy="560" rx="120" ry="52" fill="url(#rr-village)" />

      {/* ══ THE ROUTE — glow pass, ribbon, centreline ══ */}
      <g fill="none" strokeLinecap="round">
        <path
          d="M 150 148 C 240 172 320 186 392 222 C 466 258 512 276 548 330 C 578 374 500 398 540 442 C 574 480 660 452 730 470 C 800 488 852 500 900 522 C 936 538 972 548 1012 556"
          stroke="#ffb066"
          strokeWidth="7"
          strokeOpacity="0.1"
        />
        <path
          d="M 150 148 C 240 172 320 186 392 222 C 466 258 512 276 548 330 C 578 374 500 398 540 442 C 574 480 660 452 730 470 C 800 488 852 500 900 522 C 936 538 972 548 1012 556"
          stroke="#ffb066"
          strokeWidth="2.2"
          strokeOpacity="0.9"
        />
        <path
          d="M 150 148 C 240 172 320 186 392 222 C 466 258 512 276 548 330 C 578 374 500 398 540 442 C 574 480 660 452 730 470 C 800 488 852 500 900 522 C 936 538 972 548 1012 556"
          stroke="#ffd9ad"
          strokeWidth="0.8"
          strokeOpacity="0.5"
          strokeDasharray="6 10"
        />
      </g>

      {/* ══ WAYPOINT MARKERS ══ */}
      <g fill="#ffb066">
        <rect x="146" y="144" width="8" height="8" transform="rotate(45 150 148)" />
        <rect x="388" y="218" width="7" height="7" transform="rotate(45 391.5 221.5)" fillOpacity="0.85" />
        <rect x="544" y="326" width="7" height="7" transform="rotate(45 547.5 329.5)" fillOpacity="0.85" />
        <rect x="896" y="518" width="7" height="7" transform="rotate(45 899.5 521.5)" fillOpacity="0.85" />
        <rect x="1008" y="552" width="8" height="8" transform="rotate(45 1012 556)" />
      </g>

      {/* ══ THE TRUCK — classic pickup, southbound, lights on ══ */}
      <ellipse cx="708" cy="500" rx="70" ry="10" fill="url(#rr-pool)" />
      <g transform="translate(668 440)">
        {/* headlight beam */}
        <polygon points="70,16 138,6 138,32 70,24" fill="url(#rr-beam)" />
        {/* body: bed left, cab right */}
        <path
          d="M 0 24 L 1 13 Q 1.5 10 5 10 L 24 9 L 26 -1 Q 27 -4 31 -4 L 43 -4 Q 46 -4 48 -1 L 52 8 L 65 11 Q 70 12 70 17 L 70 24 L 62 24 A 7.5 7.5 0 0 0 47 24 L 23 24 A 7.5 7.5 0 0 0 8 24 Z"
          fill="#0a0a0b"
          stroke="#ffd9ad"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* cab glass */}
        <path d="M 29 -1 L 30.5 6 L 44 7 L 46 0 Z" fill="none" stroke="#ffd9ad" strokeWidth="0.8" strokeOpacity="0.6" />
        {/* wheels */}
        <circle cx="15.5" cy="24" r="6" fill="#0a0a0b" stroke="#ffd9ad" strokeWidth="1.3" />
        <circle cx="54.5" cy="24" r="6" fill="#0a0a0b" stroke="#ffd9ad" strokeWidth="1.3" />
        <circle cx="15.5" cy="24" r="2" fill="none" stroke="#ffd9ad" strokeWidth="0.8" strokeOpacity="0.6" />
        <circle cx="54.5" cy="24" r="2" fill="none" stroke="#ffd9ad" strokeWidth="0.8" strokeOpacity="0.6" />
        {/* headlamp point */}
        <circle cx="69" cy="16" r="1.6" fill="#ffd9ad" />
      </g>

      {/* ══ LEADERS ══ */}
      <g stroke="#9a9ca0" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        <path d="M 392 214 L 392 188" />
        <path d="M 548 322 L 548 284" />
        <path d="M 900 514 L 928 468" />
        <path d="M 712 432 L 726 396" />
      </g>

      {/* ══ LABELS ══ */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="0.18em"
      >
        <text x="150" y="126" fill="#ffb066">
          EDMONTON · KM 0
        </text>
        <text x="392" y="178" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.85">
          CALGARY
        </text>
        <text x="548" y="274" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.85">
          VERMILION PASS · THE DIVIDE
        </text>
        <text x="934" y="458" fill="#9a9ca0" fillOpacity="0.85">
          SINCLAIR CANYON
        </text>
        <text x="734" y="388" fill="#ffd9ad" fillOpacity="0.75" fontSize="10">
          SOUTHBOUND
        </text>
        <text x="1012" y="600" textAnchor="middle" fill="#ffb066">
          RADIUM HOT SPRINGS · KM 547
        </text>
        <text x="1150" y="70" textAnchor="end" fill="#9a9ca0" fillOpacity="0.6">
          THIRD WEEKEND OF SEPTEMBER
        </text>
        <text x="600" y="632" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.55" fontSize="10">
          FIG. — THE SEPTEMBER RUN · ONE RIBBON OF ROAD, TWO RANGES, ONE GLOW AT THE END
        </text>
      </g>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        The Columbia Valley Classics Show &amp; Shine takes over Radium Hot Springs, BC on the
        third September weekend — September 18 and 19 in 2026, show day on the Saturday. More
        than a thousand classics fill the Springs Golf Course driving range. From Edmonton it is
        roughly 550 kilometres of the best driving in the country, which is exactly the point.
      </p>

      <h2>What is the Radium Show &amp; Shine?</h2>
      <p>
        It is a village handing itself over to old cars for a weekend. The Columbia Valley
        Classics Car Club has run the show for decades — 2026 is the 36th annual — and the club
        describes an annual showing of over 1,000 classic cars on the golf course driving range,
        with the mountains standing straight up behind the rows.
        <a href="#src-1" className="cite-ref">[1]</a> Local reporting from 2024 counted roughly
        800 registered vehicles plus a few hundred more that turn up and cruise without ever
        signing a form.<a href="#src-3" className="cite-ref">[3]</a>
      </p>
      <p>
        The scale matters less than the shape of the thing. This is not a mall parking lot with
        pop-up tents. The whole valley participates: a poker run winds between the villages on the
        Friday, and in recent years the weekend has carried a fire-department pancake breakfast, a
        market, music in the park, and an unofficial cruise past the seniors homes in Invermere so
        the people who bought these cars new get a front-row seat.
        <a href="#src-3" className="cite-ref">[3]</a> Hotels fill. Restaurants run out of things.
        The club is blunt that the whole village benefits, and the village acts like it.
      </p>
      <p>
        The field itself runs the full spectrum — trailer queens, rat rods, survivors wearing
        every kilometre honestly, and restomods that started life as farm trucks. Nobody is above
        or beneath the show. The one hard rule is temperament: the club posts zero tolerance for
        burnouts and stunting, and means it.<a href="#src-1" className="cite-ref">[1]</a> It is a
        show about cars, not about noise.
      </p>

      <h2>When is it in 2026, and how do you enter?</h2>
      <p>
        The verified 2026 details, straight from the club&rsquo;s pages:
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">Sept 18–19</span>
          <span className="stat-l">2026 dates — show day Saturday the 19th</span>
        </div>
        <div>
          <span className="stat-v">1,000+</span>
          <span className="stat-l">Classics on the field, per the club</span>
        </div>
        <div>
          <span className="stat-v">$25–$30</span>
          <span className="stat-l">Per-vehicle registration, online or cash</span>
        </div>
        <div>
          <span className="stat-v">~547 km</span>
          <span className="stat-l">Edmonton to Radium, via Calgary</span>
        </div>
      </div>
      <p>
        Friday, September 18 is the warm-up: the poker run — the eighth annual — tours the valley
        from late morning, and registration opens at the Radium Hot Springs Centre. Saturday,
        September 19 is the show, running through the day at the Springs Golf Course.
        <a href="#src-1" className="cite-ref">[1]</a> Registration is $25 plus a booking fee per
        vehicle online, or $30 cash in person on the Friday or at the administration tent Saturday
        morning.<a href="#src-2" className="cite-ref">[2]</a>
      </p>
      <p>
        One detail worth reading twice: registering does not reserve a spot on the field.
        Volunteers park the show first come, first served, and the parking gates close at 11 a.m.
        — often effectively earlier, because the field fills. Arrive early or arrive a spectator.
        <a href="#src-2" className="cite-ref">[2]</a> And because schedules, fees, and hours move
        a little every year, treat the club&rsquo;s official page as the authority and check it
        before you commit a weekend to the drive.<a href="#src-1" className="cite-ref">[1]</a>
      </p>

      <h2>How do you prep a classic for the Edmonton-to-Radium drive?</h2>
      <p>
        The usual route runs south on the QE2 to Calgary, west on the Trans-Canada past Canmore
        and Banff, then south at Castle Junction onto Highway 93 — over Vermilion Pass at the
        Continental Divide, down the length of Kootenay National Park, and finally through the red
        rock walls of Sinclair Canyon, which drops you directly into the village. Call it 547
        kilometres and something under six hours in a modern car.
        <a href="#src-4" className="cite-ref">[4]</a> In a sixty-year-old vehicle, plan a full
        day. There is also the quieter option — Highway 11 west through Rocky Mountain House to
        Saskatchewan River Crossing, then south down 93 through Lake Louise — which trades divided
        highway for scenery and fewer fuel stops.
      </p>
      <p>
        The mountain leg is what the car has to be ready for. Long climbs work the cooling
        system; long descents work the brakes; and late September in the passes can mean frost at
        dawn and weather that changes by the hour. The pre-trip list this shop runs on its own
        vehicles:
      </p>
      <ul>
        <li>
          <strong>Cooling system, honestly assessed.</strong> Coolant condition, hoses, belts,
          radiator cap, fan operation. A marginal system that survives city errands will announce
          itself on the grade out of the Bow Valley. Fix it at home, not in a pull-out.
        </li>
        <li>
          <strong>Brakes, for the way down.</strong> The descent from the Divide is long, and
          drum brakes fade when they cook. Fresh fluid, adjusted shoes, and the discipline to
          downshift and let the engine hold the truck back instead of riding the pedal.
        </li>
        <li>
          <strong>Every fluid checked, every leak known.</strong> Oil, coolant, transmission,
          differential, brake fluid. A known seep is a note on the checklist; an unknown one is a
          roadside diagnosis in a dead zone.
        </li>
        <li>
          <strong>A spares kit that matches the car.</strong> Belts, upper and lower hoses,
          points and condenser if the ignition still runs them, a fuel pump, fuses, clamps, a
          litre of oil, and the tools to fit all of it. Parts stores get sparse past Castle
          Junction.
        </li>
        <li>
          <strong>Tires judged by age, not tread.</strong> Mountain corners at highway speed are
          the wrong place to learn what fifteen-year-old rubber does. Check the date codes.
        </li>
        <li>
          <strong>A fuel plan.</strong> Stations thin out inside the parks, and the fuel your
          carburetor likes may not be at every pump. Top up in Canmore or Banff and know your
          honest range.
        </li>
        <li>
          <strong>Cold-morning kit.</strong> Layers, a scraper, and a block of patience.
          September frost on a show morning is normal up there; snow on the pass is not rare
          enough to ignore. Watch the forecast the week before.
        </li>
      </ul>
      <p>
        None of this is exotic. It is the same mechanical honesty any long trip demands, applied
        to a vehicle old enough to have opinions. The cars that make the run every year are not
        the newest or the shiniest — they are the sorted ones.
      </p>

      <h2>Our road to Radium</h2>
      <p>
        Most years, this shop makes the trip. It has become the closest thing the calendar has to
        a standing appointment — the reels we have posted from the road tell the story better
        than a paragraph can, but the shape of it is always the same. Leave Edmonton early enough
        to see the shop lights in the mirror. Coffee somewhere south of Red Deer. The moment past
        Canmore when the windshield fills with rock and the whole cab goes quiet. And then
        Sinclair Canyon, where the walls close in red and tight and spit you out into a village
        that is already full of idling V8s.
      </p>
      <blockquote>
        <p>The show is Saturday. The reason is the road.</p>
        <footer>Shop consensus, every September</footer>
      </blockquote>
      <p>
        Highway 93 in the third week of September is its own rolling show. You start recognizing
        the silhouettes two lanes over — a stepside here, a tri-five there, everybody southbound
        for the same reason, everybody waving. By Castle Junction it feels less like traffic and
        more like a convoy that never organized itself.
      </p>
      <p>
        There is a professional excuse for going, and it is even true: a thousand cars on one
        field is a thousand solutions to the same problems we argue about all winter — stance,
        cooling, wiring routes, colour in mountain light instead of shop light. Ideas come home
        in the phone and end up on the whiteboard. The trucks on our{" "}
        <Link href="/builds">builds page</Link> are built for exactly this kind of trip — that is
        the standard, a classic that can leave at dawn, cross two mountain passes, and idle
        through a village without drama. More on how the shop thinks about that on the{" "}
        <Link href="/about">about page</Link>. But the honest reason is simpler: it is the best
        weekend of the season, and it marks the turn of the year.
      </p>

      <h2>How do you get show-ready before the trip?</h2>
      <p>
        Show-ready starts with road-ready, because a car that arrives on a flatbed with a cooked
        head gasket is not getting judged on its paint. The mechanical sorting above wants to
        happen weeks out, not the Thursday before — anything the inspection turns up needs time
        for parts, and September is when every shop calendar in Alberta is already full of people
        who had the same idea. If the car needs real sorting first, that is what the{" "}
        <Link href="/services/classic-car-restoration">restoration service page</Link> covers,
        and the earlier the conversation starts, the better the odds it happens this season.
      </p>
      <p>
        The cosmetic pass is the easy part, and a golf course field rewards honesty over money.
        Wash before you leave and again when you arrive, because 550 kilometres of highway will
        put a film on anything. Clean glass and bright trim read from thirty feet; a tidy engine
        bay and a clean underside reward the people who crouch, and at Radium they crouch. Bring
        your own rags and waterless wash, a chair, and the patience to answer the same three
        questions all afternoon — that last one is most of what a show is.
      </p>
      <p>
        If the plan is bigger than this September — if the truck in your garage is supposed to be
        the one you drive down Highway 93 some year soon — send photos through the{" "}
        <Link href="/quote">quote page</Link> and say exactly that. A build with a destination
        attached gets scoped differently, and better.
      </p>

      <h2>Why is Radium the last show before storage season?</h2>
      <p>
        Look at the calendar. The third weekend of September sits right on the hinge of the
        Alberta season — after it come the first hard frosts, the first sanding trucks, and the
        end of honest driving weather. For most of the classics that make the trip, the run home
        from Radium is the last long drive of the year, and there is something right about that:
        the season ends with the best road instead of a battery tender.
      </p>
      <p>
        Use it. The drive home is a rolling inspection — every noise, seep, and flat spot the
        trip surfaced is information, and it is freshest the week you get back. Write the list
        while the car is still warm, because those items are next spring&rsquo;s work order, and
        winter is when shop time is easiest to book. Then put the car away properly — fuel,
        fluids, rubber, rodents, and battery all handled, not just a cover thrown over optimism.
        The full procedure is in the{" "}
        <Link href="/guides/winter">winter storage guide</Link>, and it is the difference between
        a car that wakes up in May ready for the season and one that starts it with a repair
        bill.
      </p>
      <p>
        Then the whiteboard fills up, the bays fill up, and the countdown starts again — because
        the third weekend of September always comes back around. See you on 93.
      </p>
    </>
  );
}
