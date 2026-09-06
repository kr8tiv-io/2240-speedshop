import Link from "next/link";
import type { ArticleMeta } from "../types";

/**
 * JOURNAL — Classic Car Pre-Purchase Inspection.
 * The most direct service-conversion piece in the buying cluster: what a shop
 * finds on a hoist that a driveway walk-around cannot, why remote buyers need
 * one most, and what it costs. Links down into the appraisal explainer, the
 * body and metalwork service, the out-of-province inspection guide, the
 * barn-find protocol, and the quote page.
 */

export const meta: ArticleMeta = {
  slug: "classic-car-pre-purchase-inspection",
  title: "What a Classic Car Pre-Purchase Inspection Actually Covers",
  accent: "Actually",
  metaTitle: "Classic Pre-Purchase Inspection AB",
  description: "What a shop checks in a pre-purchase inspection that a driveway walk-around cannot — frame rot, filler over rust, matching numbers — and what it costs in.",
  datePublished: "2026-08-21",
  dateModified: "2026-08-21",
  author: "2240 Speed Shop",
  category: "Buy Smart",
  targetKeywords: [
    "classic car pre purchase inspection Edmonton",
    "classic car inspection cost",
    "pre purchase inspection checklist",
    "buying a classic car sight unseen",
    "classic car frame rust inspection",
  ],
  faq: [
    {
      q: "How much does a classic car pre-purchase inspection cost?",
      a: "A general mechanical once-over at a shop commonly runs $150 to $350 in Canadian dollars. A classic-specific inspection — hoist time, paint-depth readings, stamping checks, and a written photo report — typically runs $400 to $800, and a marque-specialist deep dive with compression and leak-down testing can reach $800 to $1,500 or more. All of these are planning ranges, and every one of them is small against the $10,000-plus that hidden floor and quarter rot commonly costs to repair.",
    },
    {
      q: "Is a pre-purchase inspection the same as an Alberta out-of-province inspection?",
      a: "No. The out-of-province inspection is a mandatory pass-fail safety check the Alberta government requires before a vehicle registered elsewhere can get plates — it happens after you have already bought the car, and it does not assess value, originality, or rust that is not a safety defect. A pre-purchase inspection is optional, happens before your money moves, and exists to tell you whether to buy the car at all and at what price.",
    },
    {
      q: "What does a pre-purchase inspection check that a test drive cannot?",
      a: "The structure and the story. On a hoist, a shop probes frame rails, floor pans, torque boxes, and spring mounts for rot; a magnet and a paint-depth gauge find plastic filler over rust repair; stampings on the engine, cowl tag, and frame get checked against the registration and the seller's paperwork; and a compression or leak-down test measures the engine instead of listening to it. None of that is visible from the driver's seat.",
    },
    {
      q: "Can I get a classic inspected before buying it sight unseen?",
      a: "Yes, and you should treat it as non-negotiable. Commission a shop near the car to inspect it and send a written report with photos before any deposit moves — a few hundred dollars of inspection against a five-figure wire is the cheapest insurance in the hobby. Remember that in Alberta a used vehicle is sold as-is unless the contract says otherwise, and a car bought in another province still has to pass an out-of-province inspection before it can be registered here.",
    },
    {
      q: "What if the seller refuses a pre-purchase inspection?",
      a: "Treat the refusal as the inspection result. A seller with nothing to hide loses nothing by letting a licensed shop put the car on a hoist for two hours, and private sellers in Alberta are not required to provide any mechanical fitness assessment — the inspection you arrange is the only professional opinion the deal will ever get. Walk away, or price the car as if everything you could not verify is bad, because some of it will be.",
    },
  ],
  citations: [
    {
      name: "“Buying a used vehicle in Alberta,” Government of Alberta",
      url: "https://www.alberta.ca/buying-a-used-vehicle-in-alberta",
    },
    {
      name: "“Buying used,” Alberta Motor Vehicle Industry Council (AMVIC)",
      url: "https://www.amvic.org/consumer/buying-a-vehicle/buying-used/",
    },
    {
      name: "“What to Think About When Inspecting Your Car,” Hagerty",
      url: "https://www.hagerty.com/resources/how-tos/inspect-your-classic-car",
    },
    {
      name: "“Vehicle information report,” Government of Alberta",
      url: "https://www.alberta.ca/vehicle-information-report",
    },
    {
      name: "“Out-of-province vehicle inspections,” Government of Alberta",
      url: "https://www.alberta.ca/out-of-province-vehicle-inspections",
    },
  ],
  internalLinks: [
    "/blog/classic-car-appraisal-alberta",
    "/services/body-paint-metalwork",
    "/blog/out-of-province-inspection-edmonton",
    "/blog/barn-find-first-steps",
    "/quote",
  ],
  readingMinutes: 9,
};

/**
 * A classic coupe raised on a two-post hoist, drawn in steel line art from the
 * side — wheels drooped, underside exposed, an inspection lamp throwing light
 * up at the floors. Six tungsten pins mark what the hoist sees and the
 * driveway cannot: frame rot, filler over rust, stampings, compression,
 * drum brakes, and the front-end wear points. An AS IS tag hangs off the
 * bumper. Editorial plate style: mono labels, sourced glow.
 */
export function Illustration() {
  return (
    <svg
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Technical side-view diagram of a classic coupe raised on a two-post hoist with its underside exposed to an inspection lamp, with six numbered tungsten callout pins marking frame rail rot, plastic filler over rust on the lower quarter panel with a magnet test, VIN and cowl tag stampings, an engine compression gauge, brake internals at the rear drum, and kingpin and bushing wear at the front wheel, plus a paper AS IS tag hanging from the bumper"
      className="h-auto w-full"
    >
      <title>Six things the hoist sees that the driveway cannot — the pre-purchase inspection in section</title>
      <defs>
        <radialGradient id="ppi-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#ffb066" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ppi-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* shop floor */}
      <line x1="180" y1="540" x2="1020" y2="540" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.4" />
      <ellipse cx="600" cy="540" rx="340" ry="30" fill="url(#ppi-pool)" />

      {/* ══ TWO-POST HOIST ══ */}
      <g stroke="#9a9ca0" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M 296 540 L 296 128 L 328 128 L 328 540" />
        <path d="M 872 540 L 872 128 L 904 128 L 904 540" />
      </g>
      {/* hoist arms to the lift pads */}
      <g stroke="#9a9ca0" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeOpacity="0.85">
        <path d="M 328 372 L 430 348" />
        <path d="M 872 372 L 770 348" />
        <rect x="414" y="340" width="32" height="8" />
        <rect x="754" y="340" width="32" height="8" />
      </g>
      {/* post feet */}
      <g stroke="#9a9ca0" strokeWidth="1.4" fill="none" strokeOpacity="0.6">
        <line x1="272" y1="540" x2="352" y2="540" />
        <line x1="848" y1="540" x2="928" y2="540" />
      </g>

      {/* ══ INSPECTION LAMP — light thrown up at the floors ══ */}
      <path d="M 560 522 L 640 522 L 700 352 L 500 352 Z" fill="url(#ppi-beam)" />
      <g stroke="#9a9ca0" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <rect x="576" y="514" width="48" height="12" />
        <line x1="600" y1="526" x2="600" y2="540" />
      </g>
      <g stroke="#ffb066" strokeWidth="0.9" strokeOpacity="0.55" strokeLinecap="round">
        <line x1="586" y1="508" x2="566" y2="440" strokeDasharray="2 5" />
        <line x1="600" y1="508" x2="600" y2="430" strokeDasharray="2 5" />
        <line x1="614" y1="508" x2="634" y2="440" strokeDasharray="2 5" />
      </g>

      {/* ══ THE CAR — classic coupe, side view, nose right, raised ══ */}
      {/* body: bumpers, fenders, rockers */}
      <path
        d="M 348 306 L 352 268 Q 356 246 392 242 L 456 236 Q 520 186 584 182 L 700 182 Q 758 188 796 240 L 844 248 Q 872 254 874 274 L 876 306 L 848 312 L 820 312"
        fill="none"
        stroke="#9a9ca0"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* rocker line between the wheel openings */}
      <line x1="504" y1="330" x2="696" y2="330" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      {/* rear wheel opening + tail below bumper */}
      <path d="M 348 306 L 348 322 L 384 328 Q 386 274 440 272 Q 496 274 504 330" fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      {/* front wheel opening + valance */}
      <path d="M 696 330 Q 700 274 756 272 Q 810 274 814 328 L 820 312" fill="none" stroke="#9a9ca0" strokeWidth="2" strokeLinecap="round" />
      {/* greenhouse */}
      <path d="M 472 234 Q 526 192 586 188 L 692 188 Q 736 192 770 236" fill="none" stroke="#9a9ca0" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="606" y1="188" x2="600" y2="234" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55" />
      {/* door cut + handle */}
      <path d="M 560 238 L 556 328" fill="none" stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.55" />
      <line x1="572" y1="252" x2="594" y2="252" stroke="#9a9ca0" strokeWidth="1.6" strokeOpacity="0.7" strokeLinecap="round" />
      {/* wheels — drooped on the hoist */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.8">
        <circle cx="440" cy="352" r="46" />
        <circle cx="440" cy="352" r="26" strokeWidth="1.1" strokeOpacity="0.7" />
        <circle cx="756" cy="352" r="46" />
        <circle cx="756" cy="352" r="26" strokeWidth="1.1" strokeOpacity="0.7" />
      </g>

      {/* ══ UNDERSIDE — frame rail, crossmembers, rot ══ */}
      <line x1="392" y1="316" x2="808" y2="316" stroke="#9a9ca0" strokeWidth="1.3" strokeOpacity="0.75" />
      <g stroke="#9a9ca0" strokeWidth="1" strokeOpacity="0.5">
        <line x1="540" y1="316" x2="540" y2="330" />
        <line x1="660" y1="316" x2="660" y2="330" />
      </g>
      {/* the rot — perforated rail section ahead of the rear wheel */}
      <g stroke="#ffb066" strokeOpacity="0.8" fill="none" strokeLinecap="round">
        <line x1="496" y1="316" x2="530" y2="316" strokeWidth="1.6" strokeDasharray="3 5" />
        <line x1="500" y1="322" x2="508" y2="330" strokeWidth="0.9" />
        <line x1="514" y1="322" x2="522" y2="330" strokeWidth="0.9" />
      </g>
      <circle cx="512" cy="336" r="1.6" fill="#ffb066" fillOpacity="0.7" />

      {/* ══ FILLER PATCH — lower rear quarter, with the magnet falling away ══ */}
      <path
        d="M 396 300 Q 416 288 446 292 Q 452 306 444 318 Q 414 320 396 312 Z"
        fill="#ffb066"
        fillOpacity="0.12"
        stroke="#ffb066"
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      {/* magnet, fallen off the filler */}
      <g stroke="#ffb066" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <path d="M 372 254 L 372 240 Q 372 232 380 232 Q 388 232 388 240 L 388 254" />
        <path d="M 366 262 Q 380 256 394 262" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 3" />
      </g>

      {/* ══ COWL TAG / VIN ══ */}
      <rect x="748" y="230" width="30" height="12" fill="none" stroke="#ffb066" strokeWidth="1.2" />
      <g stroke="#ffb066" strokeWidth="0.8" strokeOpacity="0.7">
        <line x1="753" y1="234" x2="773" y2="234" />
        <line x1="753" y1="238" x2="767" y2="238" />
      </g>

      {/* ══ COMPRESSION GAUGE — over the engine bay ══ */}
      <g fill="none" stroke="#9a9ca0" strokeWidth="1.3">
        <circle cx="836" cy="196" r="17" />
        <line x1="836" y1="196" x2="846" y2="186" strokeWidth="1.5" strokeLinecap="round" stroke="#ffb066" />
        <line x1="836" y1="213" x2="822" y2="244" strokeOpacity="0.6" />
      </g>

      {/* ══ AS IS TAG — hanging off the front bumper ══ */}
      <path d="M 874 292 Q 892 306 900 330" fill="none" stroke="#9a9ca0" strokeWidth="0.9" strokeOpacity="0.6" />
      <g transform="rotate(8 916 348)">
        <rect x="898" y="330" width="52" height="30" fill="#0a0a0b" stroke="#ffb066" strokeWidth="1.1" />
        <circle cx="905" cy="337" r="2" fill="none" stroke="#ffb066" strokeWidth="0.8" />
        <text
          x="927"
          y="350"
          textAnchor="middle"
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fontSize="10"
          letterSpacing="0.14em"
          fill="#ffd9ad"
        >
          AS&nbsp;IS
        </text>
      </g>

      {/* ══ LEADER LINES — label column to pin ══ */}
      <g stroke="#ffb066" strokeWidth="0.75" strokeOpacity="0.5" fill="none">
        {/* left column */}
        <path d="M 214 172 L 512 308" />
        <path d="M 214 292 L 414 300" />
        <path d="M 214 420 L 428 366" />
        {/* right column */}
        <path d="M 986 130 L 770 228" />
        <path d="M 986 218 L 856 200" />
        <path d="M 986 420 L 772 360" />
      </g>

      {/* ══ NUMBERED PINS ══ */}
      <g fontFamily="var(--font-plex-mono), ui-monospace, monospace" letterSpacing="0.08em">
        {[
          { x: 512, y: 308, n: "1" },
          { x: 414, y: 300, n: "2" },
          { x: 770, y: 228, n: "3" },
          { x: 856, y: 200, n: "4" },
          { x: 428, y: 366, n: "5" },
          { x: 772, y: 360, n: "6" },
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
        <text x="40" y="176" fill="#ffb066">
          1 · FRAME ROT — TOP OF THE RAIL
        </text>
        <text x="40" y="296" fill="#ffb066">
          2 · FILLER OVER RUST — MAGNET TEST
        </text>
        <text x="40" y="424" fill="#ffb066">
          5 · BRAKES — INSIDE THE DRUM
        </text>
        {/* right column */}
        <text x="1160" y="134" textAnchor="end" fill="#ffb066">
          3 · STAMPINGS VS PAPERWORK
        </text>
        <text x="1160" y="222" textAnchor="end" fill="#ffb066">
          4 · COMPRESSION, NOT CHROME
        </text>
        <text x="1160" y="424" textAnchor="end" fill="#ffb066">
          6 · KINGPINS &amp; BUSHINGS
        </text>
        {/* steel feature labels */}
        <text x="256" y="560" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          TWO-POST HOIST
        </text>
        <text x="600" y="576" textAnchor="middle" fill="#9a9ca0" fillOpacity="0.6" fontSize="10">
          INSPECTION LAMP
        </text>
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
        FIG. P — SIX THINGS THE HOIST SEES THAT THE DRIVEWAY CANNOT
      </text>
    </svg>
  );
}

export function Body() {
  return (
    <>
      <p>
        A proper pre-purchase inspection puts the car on a hoist and checks what a driveway
        walk-around cannot: structural rot in the frame and floors, plastic filler hiding old rust
        repair, whether the stampings match the paperwork, what a compression test says about the
        engine, and whether a lien follows the car. It ends in a written report with numbers.
      </p>

      <h2>Why isn&rsquo;t a walk-around and a test drive enough?</h2>
      <p>
        Because everything a seller wants you to see is on top, and everything that costs money is
        underneath. Paint, chrome, and an eager idle are the cheapest parts of a classic to make
        presentable. Frame rails, floor pans, torque boxes, and body mounts are the expensive
        parts, and they are invisible from standing height. A car can present beautifully in a
        driveway and be structurally done.
      </p>
      <p>
        Alberta stacks the deck further. Unless the contract says otherwise, a used vehicle here is
        sold as-is — whatever surfaces after the sale is your problem, not the
        seller&rsquo;s.<a href="#src-1" className="cite-ref">[1]</a> And in a private sale there is
        no mandatory paperwork on condition at all: private sellers are not required to provide the
        mechanical fitness assessment that licensed dealers must, which is why AMVIC — the
        province&rsquo;s own motor vehicle regulator — recommends hiring a shop with a journeyperson
        technician for an independent pre-purchase inspection before you
        buy.<a href="#src-2" className="cite-ref">[2]</a> On a forty- or fifty-year-old vehicle,
        that advice is not cautious. It is the minimum.
      </p>
      <blockquote>
        <p>Paint is the cheapest thing to fake and the most expensive thing to believe.</p>
        <footer>Shop rule, written on the whiteboard</footer>
      </blockquote>

      <h2>What does a shop check that a driveway cannot?</h2>
      <p>
        The published checklists — walk the panels for mismatched paint, check every fluid, read
        the oil on the dipstick, feel how far the brake pedal travels — are genuinely worth doing,
        and Hagerty&rsquo;s guidance covers that layer well.<a href="#src-3" className="cite-ref">[3]</a>{" "}
        Do all of it. Then understand that it is the first twenty percent of an inspection. The
        rest needs a hoist, instruments, and someone who has seen a few hundred of these.
      </p>

      <h3>Structure, on a hoist, with a probe</h3>
      <p>
        Rot on a classic does not start where you can see it. It starts on top of the frame rails
        where mud sits for decades, inside boxed sections, in the torque boxes, around spring
        perches and shackle mounts, and in the seams of floor and trunk pans. A technician works
        the length of the underside with a light and a probe, because surface scale and
        structural perforation look identical until steel gives way under a screwdriver tip. Fresh,
        thick undercoating gets special attention — on a car that is for sale, it hides at least
        as often as it protects. Prairie cars bring their own pattern: Alberta and Saskatchewan
        classics rust slower than anything from Ontario road salt, but a truck that sat in a field
        near Leduc for twenty years rots from the cab mounts and floors up, with mouse damage in
        the harness as the bonus prize.
      </p>

      <h3>Filler, with a magnet and a gauge</h3>
      <p>
        Body filler is a legitimate material badly used. A skim coat over straight metal is normal
        restoration practice; half an inch of it bridging a rusted-through quarter panel is
        structural fraud with a nice paint job. A magnet loses its grip over thick filler, and a
        paint-depth gauge puts numbers on it panel by panel — factory paint reads thin and even,
        while a reading that triples over the lower quarters tells you exactly where the car was
        hit or patched. Finding filler is not automatically a deal-killer. It resets the price to
        include <Link href="/services/body-paint-metalwork">metal repair done properly</Link>,
        which means cutting the patch out and welding steel in, not skimming more mud over it.
      </p>

      <h3>The drivetrain, measured instead of admired</h3>
      <p>
        An engine that starts and idles proves almost nothing about how it pulls under load
        at highway speed in July. A compression test — or better, a leak-down test — puts
        a number on every cylinder, and healthy cylinders sit within roughly ten percent of each
        other. Under the car, the technician checks the steering box for play, rocks the front
        wheels for kingpin and ball-joint wear, reads the bushings, pulls a wheel where the seller
        allows it to look inside a brake drum, and dates the tires and hoses, because
        rubber ages out long before it wears out. Sixty-year-old brake hoses that look fine are
        still sixty years old.
      </p>

      <h2>How do you verify matching numbers and paperwork?</h2>
      <p>
        This is the part of the inspection that happens with a flashlight and a notebook instead
        of a wrench, and on a collector car it moves more money than anything mechanical. The VIN
        plate, the hidden frame stamping, the engine pad, and the cowl or trim tag all get read
        and checked against each other and against the seller&rsquo;s registration. A
        numbers-matching drivetrain can be worth a large premium on the right car; a replacement
        block wearing the wrong casting date makes the same car a driver, not an investment — and
        the asking price has to pick one. If originality is a major part of the price, the
        stampings are where the price gets proven. Condition and value are separate questions,
        though, and they take separate documents — the inspection tells you what the car is, while
        a <Link href="/blog/classic-car-appraisal-alberta">written appraisal</Link> tells you what
        it is worth for insurance and financing.
      </p>
      <p>
        The paper trail gets the same treatment. The seller&rsquo;s ID should match the
        registration — AMVIC&rsquo;s standing warning about curbers, unlicensed sellers flipping
        misrepresented cars, starts exactly there.<a href="#src-2" className="cite-ref">[2]</a>{" "}
        For any Alberta-registered vehicle, a Vehicle Information Report ordered with the VIN
        shows the vehicle&rsquo;s Alberta record and status, and a Personal Property Registry
        search through a registry agent reveals whether money is still owed against
        it.<a href="#src-4" className="cite-ref">[4]</a> Both cost less than a tank of premium.
        Note the limit, because with classics it matters: the report covers Alberta only, and a
        car that spent its life in three provinces carries paper in all of them.
      </p>

      <h2>How much does a classic car pre-purchase inspection cost?</h2>
      <p>
        Typical planning ranges in Canadian dollars, not quotes:
      </p>
      <div className="stat-plate">
        <div>
          <span className="stat-v">$150–$350</span>
          <span className="stat-l">General mechanical once-over, driver-grade car</span>
        </div>
        <div>
          <span className="stat-v">$400–$800</span>
          <span className="stat-l">Classic-specific inspection — hoist, gauge, written report</span>
        </div>
        <div>
          <span className="stat-v">$800–$1,500+</span>
          <span className="stat-l">Marque-specialist deep dive with leak-down testing</span>
        </div>
        <div>
          <span className="stat-v">$10,000+</span>
          <span className="stat-l">What hidden floor and quarter rot commonly costs to fix</span>
        </div>
      </div>
      <p>
        The spread is depth. A general shop can verify brakes, leaks, and compression on anything
        with wheels. A classic-specific inspection adds the things this article is about —
        structural probing, filler mapping, stamping verification, and a written report with
        photographs you can hold a negotiation on. The specialist tier earns its money on cars
        where a single originality question is worth more than the inspection costs ten times
        over. Against those numbers, the inspection is not an expense on the purchase. It is the
        cheapest work the car will ever have done.
      </p>

      <h2>How do you inspect a classic you&rsquo;re buying sight unseen?</h2>
      <p>
        Remote buying is now normal — the right square-body or A-body is as likely to be in
        Kamloops or Regina as on an Edmonton driveway — and it is exactly where buyers get hurt,
        because every natural check disappears. You cannot crawl under the car, you cannot smell
        the transmission fluid, and the photos were chosen by the person selling it. The fix is
        simple and non-negotiable: commission an inspection from a shop near the car, before any
        deposit moves. A few hundred dollars against a five-figure wire transfer is the cheapest
        insurance in the hobby, and a seller who resists independent eyes has answered your
        question already.
      </p>
      <p>
        Alberta buyers get one extra step that surprises people: a vehicle registered outside the
        province must pass an out-of-province inspection before it can get Alberta
        plates.<a href="#src-5" className="cite-ref">[5]</a> That is a separate thing from a
        pre-purchase inspection, and confusing the two is expensive:
      </p>
      <div className="table-bleed">
        <table>
          <caption className="sr-only">
            A driveway walk-around, a shop pre-purchase inspection, and an Alberta out-of-province
            inspection compared by purpose, timing, typical Canadian dollar cost, and what each one
            misses
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Driveway walk-around</th>
              <th scope="col">Pre-purchase inspection</th>
              <th scope="col">Out-of-province inspection</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">What it is</th>
              <td>Your own eyes and a fridge magnet</td>
              <td>A shop&rsquo;s condition report, on a hoist, for the buyer</td>
              <td>Mandatory pass-fail safety check to register the vehicle</td>
            </tr>
            <tr>
              <th scope="row">When it happens</th>
              <td>Before the handshake</td>
              <td>Before money moves</td>
              <td>After purchase, before Alberta plates</td>
            </tr>
            <tr>
              <th scope="row">Typical cost (CAD)</th>
              <td className="num">Free</td>
              <td className="num">$150 – $1,500 by depth</td>
              <td className="num">$200 – $350, plus any repairs</td>
            </tr>
            <tr>
              <th scope="row">What it misses</th>
              <td>Everything underneath and everything on paper</td>
              <td>Nothing it was scoped to check — depth is the variable</td>
              <td>Value, originality, and rust that is not a safety defect</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Read that last column twice. Passing the out-of-province inspection means the car is safe
        enough to register — not that it was worth what you paid, not that the numbers match, and
        not that the floors are original steel. The{" "}
        <Link href="/blog/out-of-province-inspection-edmonton">out-of-province inspection guide</Link>{" "}
        covers that process end to end; the point here is that it never replaces the inspection
        you commission for yourself.
      </p>

      <h2>How do you set one up in Edmonton?</h2>
      <p>
        Book it like shop work, because it is shop work. Send the year, make, model, the
        seller&rsquo;s location, the asking price, and what the car is claimed to be — original,
        restored, restomod, or project — and say what you care about most, because a $12,000
        driver and a $90,000 numbers car get inspected to different depths. Expect the report in
        writing, with photos, findings sorted into safety, structural, and cosmetic, and repair
        estimates as ranges you can negotiate with. A good inspection kills bad deals and
        strengthens good ones in equal measure — and when it turns up a long-parked survivor
        instead of a runner, the <Link href="/blog/barn-find-first-steps">barn-find protocol</Link>{" "}
        is the next read before anyone turns a key.
      </p>
      <p>
        If you are circling a car right now — in the city, in another province, or on an auction
        site with a countdown clock — send the listing through the{" "}
        <Link href="/quote">quote page</Link> and you will get a straight answer on what an
        inspection should cover for that specific car, what it will cost, and how fast it can
        happen. The deposit can wait two days. The rot has been there for thirty years, and it is
        not going anywhere.
      </p>
    </>
  );
}
