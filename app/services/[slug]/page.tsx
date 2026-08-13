import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, site } from "@/lib/site";
import { breadcrumbSchema, serviceSchema, JsonLd } from "@/lib/schema";
import { CostTable, type CostRow } from "@/components/CostTable";
import { FaqBlock, type FaqItem } from "@/components/FaqBlock";
import { ClipReveal } from "@/components/fx/ClipReveal";

type Slug = (typeof services)[number]["slug"];

type Involves = {
  h: string;
  p: readonly string[];
};

type Detail = {
  /** H1 — carries the target keyword naturally. */
  h1: string;
  metaTitle: string;
  metaDesc: string;
  /** Answer-first, 40–60 words. This is what AI engines lift. */
  opener: string;
  /** Second paragraph — context, still crawlable, never fluff. */
  second: string;
  involves: readonly Involves[];
  costHeading: string;
  costIntro: string;
  costRows: readonly CostRow[];
  costFootnote: string;
  faqs: readonly FaqItem[];
  /** Sibling pillars this page links to. One-owner rule: link, never re-target. */
  siblings: readonly Slug[];
  ctaHead: string;
  ctaBody: string;
};

const NOT_A_QUOTE =
  "Ranges above are indicative only and assume the vehicle is here in front of us before anything is committed. We quote in writing after an inspection, and changes get a phone call and a photo — not a surprise at the end.";

const details: Record<Slug, Detail> = {
  "classic-car-restoration": {
    h1: "Classic car restoration in Edmonton",
    metaTitle: "Classic Car Restoration Edmonton — Frame-Off & Rolling",
    metaDesc:
      "Classic car restoration in Edmonton — frame-off and rolling builds at 2240 Speed Shop, owned by Terry Harmider. Indicative cost ranges, honest scope, real hours.",
    opener:
      "Classic car restoration in Edmonton runs two ways at 2240 Speed Shop: frame-off, where the body comes off the chassis and everything is rebuilt, or rolling, where the car is restored in stages you can drive between. Both start with a teardown, an honest scope, and a number before the work begins.",
    second:
      "Cars and trucks both. Mustangs, Camaros, C10s, square-bodies, Mopars and the odd stubborn import. Driver-quality or show-quality — the finish level is your call, but the metalwork underneath gets the same standard either way.",
    involves: [
      {
        h: "Frame-off or rolling — pick one before you pick a budget",
        p: [
          "Frame-off means the body comes off the chassis. Everything gets separated, stripped, repaired and rebuilt on a bare frame, then assembled once. It is the only honest way to fix a car that is rotten underneath, and it is the expensive way.",
          "A rolling restoration keeps the car together and works it in phases — brakes and drivetrain this winter, bodywork the next, interior after. You drive it in between and pay as you go. Slower on paper, easier on a real budget.",
        ],
      },
      {
        h: "Teardown first, then the number",
        p: [
          "Nobody can quote a restoration off photos alone. We tear down far enough to see structure — floors lifted, rockers probed, frame checked, panel gaps measured — and then write a scope against what is actually there rather than what the seller said.",
          "Surprises get a phone call and a photo. A restoration where the customer finds out at the end is a restoration done wrong.",
        ],
      },
      {
        h: "Metal first. Paint is the last thing that happens",
        p: [
          "Structure before cosmetics, every time. Rot comes out, panels get replaced or fabricated, and gaps get set with the doors hung and the shell braced. A car that gets paint before its metal is right will telegraph every shortcut inside two winters.",
        ],
      },
      {
        h: "Drivetrain, brakes and wiring get rebuilt, not reused",
        p: [
          "On a frame-off, the engine, transmission, rear end, brake lines, fuel lines and harness all come out anyway. Sixty-year-old wiring is a fire waiting for a reason — we replace it rather than chase it.",
          "Rebuilt to stock or upgraded is your call, and it is one of the biggest levers on the final number. Upgrades usually route through our engine swap and restomod work.",
        ],
      },
      {
        h: "Reassembly and shakedown",
        p: [
          "The last ten percent takes the longest: fitting trim, chasing rattles, bleeding brakes, setting timing, aligning glass, driving it, then fixing what shows up. Cars leave here running and sorted, not trailered out with a list attached.",
        ],
      },
      {
        h: "Stalled builds and barn finds",
        p: [
          "Projects arrive in boxes. We inventory what is there, list what is missing, and tell you honestly whether finishing it beats starting over with a better car. Sometimes that answer costs us the job. We say it anyway.",
        ],
      },
    ],
    costHeading: "What does a classic car restoration cost?",
    costIntro:
      "Nobody local publishes this, which is exactly why we do. Restoration pricing is hours plus parts, and hours track the condition of the metal more than anything else. Use these as a planning range, not a quote.",
    costRows: [
      {
        item: "Assessment, teardown and written scope",
        range: "$1,500 – $4,000",
        note: "How far the car has to come apart before the structure is actually visible.",
      },
      {
        item: "Rolling restoration, staged over seasons",
        range: "$15,000 – $45,000+",
        note: "How many phases you take on, and whether the car stays drivable between them.",
      },
      {
        item: "Frame-off, driver quality",
        range: "$45,000 – $90,000",
        note: "Rust extent, parts availability, how much fabrication replaces catalogue panels.",
      },
      {
        item: "Frame-off, show quality",
        range: "$90,000 – $200,000+",
        note: "Blocking hours, plating and trim work, correct-detail sourcing, cut-and-buff time.",
      },
      {
        item: "Media blast and bare-metal strip (body)",
        range: "$2,500 – $7,000",
        note: "Size of the shell, layers of old paint and filler, how much gets masked or removed first.",
      },
    ],
    costFootnote: NOT_A_QUOTE,
    faqs: [
      {
        q: "How much does a classic car restoration cost in Edmonton?",
        a: "It depends on the condition of the car and the finish level you want. A staged rolling restoration can start in the low tens of thousands, while a frame-off show build runs well into six figures. The ranges on this page are indicative only. We quote after a teardown, when we can see the metal.",
      },
      {
        q: "How long does a restoration take?",
        a: "Frame-off restorations are measured in months to years, not weeks — parts availability, metalwork hours and paint cure time all set the pace. Rolling restorations spread across seasons by design. You get a stage plan up front and photos as each stage closes, so the project never goes quiet.",
      },
      {
        q: "Is a restoration worth it, or should I just buy a finished car?",
        a: "Sometimes buying finished is cheaper, and we will say so. A restoration makes sense when the car has family history, when it is a model you actually want, or when the shell is solid. If the numbers point the other way, we would rather lose the job than build you a regret.",
      },
      {
        q: "Can you finish a project someone else started?",
        a: "Yes, and it is common. We inventory what came with the car, assess what was already done, and tell you plainly what has to be redone. Work by unknown hands gets verified, not trusted. The written scope reflects the real starting point rather than the optimistic one.",
      },
      {
        q: "Do you restore trucks as well as cars?",
        a: "Yes. Trucks are a core part of the work here — C10s, square-bodies, F-series and Dodge D-series. Truck restorations often land lower than car equivalents because reproduction panels are widely available and interiors are simpler. The Alberta rust map is the same; the parts bill usually is not.",
      },
      {
        q: "Do I need to bring the car to the shop first?",
        a: "Eventually, yes — the scope comes from the car, not from photos. Send pictures to start the conversation and we will tell you what we can read from them. If the car does not run, talk to us before booking a tow so it gets loaded without damaging anything.",
      },
    ],
    siblings: ["body-paint-metalwork", "engine-swaps-builds", "classic-interiors-service"],
    ctaHead: "Got a car worth saving?",
    ctaBody:
      "Send photos and tell us what you know about the car. You get an honest read on whether it should be restored, and what that would actually take.",
  },

  "restomods-custom-builds": {
    h1: "Restomod builds in Edmonton",
    metaTitle: "Restomod Edmonton — Modern Guts, Original Steel",
    metaDesc:
      "Restomod Edmonton — modern brakes, suspension and drivetrain under original steel at 2240 Speed Shop. Hot rods too. Indicative cost ranges and straight answers.",
    opener:
      "A restomod keeps the body and character of a classic and replaces what is underneath. At 2240 Speed Shop in Edmonton that means disc brakes, modern suspension and a current drivetrain under original steel — a car that looks like 1968 and stops, steers and idles like this year.",
    second:
      "Hot rods share the same bench. The difference is the brief: a restomod respects the original car, a hot rod does not have to. Both get the same fabrication standard, and both need that call made before a scope gets written.",
    involves: [
      {
        h: "Brakes first. Always",
        p: [
          "A heavy car with 1965 drums in modern traffic is a bad combination. Front disc conversions, dual-circuit master cylinders, a proportioning valve set for the actual weight split, braided lines, and hardware sized to the wheel package.",
          "Nothing else on a restomod matters if the car will not stop. This is the first line item, not an upgrade.",
        ],
      },
      {
        h: "Suspension and stance under original sheet metal",
        p: [
          "Coilovers, tubular control arms, modern steering boxes or rack conversions, and front clips where the factory geometry is past saving. The target is a car that tracks straight at highway speed and does not crash over frost heaves.",
          "Ride height is styling. Geometry is engineering. We set both, in that order — a slammed car with unsorted geometry drives worse than the drum-brake original it replaced.",
        ],
      },
      {
        h: "A drivetrain that behaves in traffic",
        p: [
          "Fuel-injected V8s, overdrive automatics or modern manuals, and a rear end geared to cruise rather than scream at 100 km/h. It should idle in a drive-thru instead of overheating in one.",
          "Most restomods here start on the engine side, so the swap work — mounts, harness, cooling — is scoped alongside the chassis work rather than after it.",
        ],
      },
      {
        h: "Modern comfort you cannot see",
        p: [
          "Air conditioning, sound, USB power and keyless ignition where it makes sense, installed behind the dash, under carpet and inside factory panels. If a modern part is visible from the driver's seat it needs a reason to be there.",
        ],
      },
      {
        h: "Where restomod stops and hot rod starts",
        p: [
          "Chopped roofs, big-and-little wheel packages, exposed engines and paint that owes nothing to a factory chart — same welding, same standard, different brief and a different budget. Tell us which one you actually want before we start drawing up a scope.",
        ],
      },
    ],
    costHeading: "What does a restomod cost?",
    costIntro:
      "Restomods scale from a single conversion to a complete build, so the honest answer is a range per module. Pick the modules that matter to how you will actually drive the car.",
    costRows: [
      {
        item: "Front disc brake conversion",
        range: "$2,500 – $6,000",
        note: "Kit availability for the chassis, master cylinder and booster choice, wheel clearance.",
      },
      {
        item: "Suspension: coilovers or modern front clip",
        range: "$4,000 – $15,000",
        note: "Bolt-in kit versus fabricated crossmember, steering conversion, alignment and setup time.",
      },
      {
        item: "Air conditioning and climate integration",
        range: "$3,500 – $8,000",
        note: "Under-dash unit versus factory-look integration, condenser routing, engine accessory drive.",
      },
      {
        item: "Hidden audio and electronics",
        range: "$1,500 – $6,000",
        note: "Speaker locations that need fabrication, amplifier mounting, keeping the dash uncut.",
      },
      {
        item: "Complete restomod on a solid, straight car",
        range: "$60,000 – $150,000+",
        note: "Drivetrain choice, paint level, interior scope, and how much metalwork the shell still needs.",
      },
    ],
    costFootnote: NOT_A_QUOTE,
    faqs: [
      {
        q: "What is the difference between a restomod and a restoration?",
        a: "A restoration returns a car to how it left the factory. A restomod keeps the look and replaces the engineering underneath — brakes, suspension, drivetrain, climate and electronics. Restorations protect originality; restomods produce a classic you can actually drive on a weekend without planning the route around it.",
      },
      {
        q: "Will a restomod hurt the value of my classic?",
        a: "It can, on rare numbers-matching cars, and we will tell you when that risk is real. On common models — especially ones already running replaced drivetrains — good restomod work usually adds value, because the market for a usable classic is far larger than the market for a correct one.",
      },
      {
        q: "Can you make a classic safe to drive around Edmonton?",
        a: "That is most of what restomod work is. Disc brakes, a dual-circuit master cylinder, belts mounted properly where the body allows, modern lighting, a charging system that keeps up, and heat and defrost that actually work. Winter driving on salted roads is a separate conversation, and usually a bad idea after paint.",
      },
      {
        q: "How much does a restomod cost?",
        a: "Individual conversions are modest — brake and suspension packages run in the low thousands. A complete restomod on a straight, solid car reaches past six figures once drivetrain, paint and interior are included. The figures on this page are indicative ranges. Real numbers come after we see the car.",
      },
      {
        q: "Do you build hot rods too?",
        a: "Yes. Hot rods trade accuracy for attitude: chops, stance, wheel packages, exposed engines and paint that owes nothing to a factory chart. Same fabrication and the same welding standard as a restomod, but a different brief. Decide which one you want before the scope gets written — they cost different money.",
      },
    ],
    siblings: ["engine-swaps-builds", "body-paint-metalwork", "classic-car-restoration"],
    ctaHead: "Old car, modern manners?",
    ctaBody:
      "Tell us the vehicle and how you actually want to drive it. We will lay out which modules matter first and what each one realistically costs.",
  },

  "engine-swaps-builds": {
    h1: "LS swaps and engine builds in Edmonton",
    metaTitle: "LS Swap Edmonton — Engine Swaps & Diesel Conversions",
    metaDesc:
      "LS swap Edmonton — LS and diesel conversions, fabricated mounts, standalone wiring, cooling and cold-start tuning at 2240 Speed Shop. Indicative cost ranges inside.",
    opener:
      "An LS swap in Edmonton is more than dropping in an engine. Mounts and crossmember, driveline angles, a standalone harness, fuel system and a cooling package all have to be built around it. 2240 Speed Shop handles LS and diesel conversions as complete jobs, tuned to start cold and run through an Alberta summer.",
    second:
      "We also build the engine you already own. Sometimes rebuilding beats replacing — on a car where originality matters, or where the block is good and the budget is better spent elsewhere in the build.",
    involves: [
      {
        h: "LS swaps",
        p: [
          "The LS family swaps into almost anything because the parts exist — but parts existing is not the same as bolting in. Oil pan clearance over a crossmember, accessory drive width against frame rails, header routing past the steering, and transmission tunnel work are the real job.",
          "We fabricate mounts rather than trusting a universal plate, because a swap that sits five millimetres wrong shows up later as a driveshaft angle you cannot fix.",
        ],
      },
      {
        h: "Diesel conversions",
        p: [
          "Cummins and Duramax swaps into classic trucks add weight to the front axle and torque to everything behind it. Springs, steering, driveshafts, rear end and brakes get re-specified rather than hoped for.",
          "Done right, it tows and it starts. Done cheap, it twists a driveshaft in the first winter and takes a transmission with it.",
        ],
      },
      {
        h: "Mounts, crossmembers and driveline angles",
        p: [
          "Engine, transmission and pinion angles have to agree or the car vibrates at highway speed and eats U-joints. We set the driveline on the hoist with the suspension loaded, then build mounts to that — not the other way around.",
        ],
      },
      {
        h: "Wiring and the standalone harness",
        p: [
          "A swap harness is where most home builds die. We lay in a standalone harness, label it, route it away from heat and exhaust, fuse and ground it properly, and integrate gauges, charging and the ignition switch.",
          "When something needs diagnosing five years from now, somebody has to be able to follow it. That is a build decision made on day one.",
        ],
      },
      {
        h: "Cooling and heat management",
        p: [
          "A modern engine in a 1960s engine bay makes more heat than the original radiator ever saw. Aluminum radiator sized to the engine, electric fans on a proper shroud with a relay and thermostat control, transmission cooler, hood clearance and heat shielding on the firewall side.",
          "The test is idling in an August parade line, not a highway run with air flowing through the grille.",
        ],
      },
      {
        h: "Cold-start reality",
        p: [
          "Alberta decides whether a swap was done properly. Block heater, battery and cable sizing for the real load, a charging system that keeps up with fans and heater, the right oil weight, and fuel and coolant specced for actual winter.",
          "Old iron, modern heart — it has to fire at minus thirty, not just idle nicely in September.",
        ],
      },
    ],
    costHeading: "What does an LS swap or engine conversion cost?",
    costIntro:
      "Swap pricing swings hard on what you supply and how finished you want it. A running takeout engine into a well-supported chassis is a different project from a crate engine, new transmission and a full cooling package.",
    costRows: [
      {
        item: "LS swap using a running takeout engine",
        range: "$12,000 – $25,000",
        note: "Chassis support, how much fabrication the mounts and tunnel need, condition of the takeout.",
      },
      {
        item: "LS swap, new crate engine and transmission",
        range: "$22,000 – $45,000",
        note: "Crate spec, transmission choice, accessory drive, and whether the rear end can take it.",
      },
      {
        item: "Diesel conversion into a classic truck",
        range: "$25,000 – $60,000",
        note: "Front suspension and steering upgrades, driveshafts, brakes, cooling and exhaust routing.",
      },
      {
        item: "Standalone harness, install and tune",
        range: "$2,500 – $6,000",
        note: "Harness quality, gauge and accessory integration, how much of the original wiring gets replaced.",
      },
      {
        item: "Cooling package (radiator, fans, shroud, lines)",
        range: "$1,500 – $4,000",
        note: "Core size available in the opening, fan and shroud fabrication, transmission cooler routing.",
      },
      {
        item: "Mounts, crossmember and driveshaft fabrication",
        range: "$2,000 – $6,000",
        note: "Whether a proven kit exists for the chassis or the whole thing gets made in-house.",
      },
    ],
    costFootnote: NOT_A_QUOTE,
    faqs: [
      {
        q: "How much does an LS swap cost in Edmonton?",
        a: "It swings widely on what you supply. A swap around a running takeout engine into a well-supported chassis costs far less than a new crate engine, transmission, harness and cooling package. The ranges on this page are indicative. The real number depends on the chassis, the parts you own, and how finished you want it.",
      },
      {
        q: "Will an LS swap start at minus thirty?",
        a: "It will if it was built for it. That means a block heater, a battery and cables sized for the load, a charging system that keeps up with fans and heater, the correct oil weight, and a fuel system with no water in it. Cold starting is a build decision, not luck.",
      },
      {
        q: "Can you swap a diesel into a classic truck?",
        a: "Yes. Cummins and Duramax conversions are common in classic trucks, and they change far more than the engine bay. Front springs, steering, driveshafts, rear end and brakes all get reviewed against the new weight and torque. Done properly it tows. Done cheaply it breaks parts behind the engine.",
      },
      {
        q: "Do you build engines, or only swap them?",
        a: "Both. An engine you already own can be rebuilt or built up instead of replaced, and sometimes that is the better call — especially where originality matters. Machine work gets specified to the combination the car will actually run, not to a horsepower number from a parts catalogue.",
      },
      {
        q: "Can I keep my original wiring harness?",
        a: "Not for a modern fuel-injected engine. Those need a standalone harness with proper fusing, grounds and sensor routing. We lay it in labelled and routed away from heat so it can be diagnosed years later. A sixty-year-old original harness is usually due for replacement regardless.",
      },
      {
        q: "How long does an engine swap take?",
        a: "A straightforward LS swap into a well-supported chassis is measured in weeks of shop time. Fabrication-heavy conversions, diesel swaps, and anything needing bodywork to clear the engine run longer. Parts lead times, not labour hours, are usually what stretch the calendar. You get a stage plan before we start.",
      },
    ],
    siblings: ["classic-performance-tuning", "restomods-custom-builds", "classic-car-restoration"],
    ctaHead: "Planning a swap?",
    ctaBody:
      "Talk to us before you buy parts. Half the money wasted on swaps gets spent before the engine ever arrives at a shop.",
  },

  "classic-performance-tuning": {
    h1: "Carburetor rebuilds and performance tuning in Edmonton",
    metaTitle: "Carburetor Rebuild Edmonton — Ignition & Tuning",
    metaDesc:
      "Carburetor rebuild Edmonton — carbs stripped, jetted for Alberta air and road-tested, points-to-electronic ignition conversions and bolt-on performance at 2240 Speed Shop.",
    opener:
      "A carburetor rebuild in Edmonton means more than a gasket kit. 2240 Speed Shop strips the carb, cleans every passage, sets floats and jetting for local air, then drives the car to confirm it. Ignition upgrades, timing curves and bolt-on performance work are handled the same way — tuned on the road, not on paper.",
    second:
      "This is the bench where a classic stops being temperamental. Most cars that arrive running badly are not one bad part; they are three small faults stacked, and the order you fix them in decides what it costs.",
    involves: [
      {
        h: "Carburetor rebuilds",
        p: [
          "Off the manifold, apart, cleaned through every passage, new gaskets, needles, seats and accelerator pump, floats set to spec, base jetting chosen for local air.",
          "Then it goes back on the car and gets driven — cold start, part throttle, wide open, and a heat soak in traffic. A carb that only works on a bench is not rebuilt.",
        ],
      },
      {
        h: "Points to electronic ignition",
        p: [
          "Points wear, drift and fail without warning. Electronic conversions hold a timing curve, start easier in the cold, and let a distributor be set once and stay there.",
          "We do full ignition packages too — coil, wires, cap, rotor and a timing curve matched to compression and the pump gas the car will actually run.",
        ],
      },
      {
        h: "Fuel delivery, from the tank forward",
        p: [
          "Old tanks rust, old rubber lines swell on modern ethanol-blended fuel, and old mechanical pumps quietly lose pressure. Sorting supply before touching jets solves a good share of the calls that start with my carb is bad.",
        ],
      },
      {
        h: "Breathing: intake, cam, headers, exhaust",
        p: [
          "Parts only make power as a combination. An intake that matches the cam, a cam that matches compression and gearing, headers that clear the chassis and the steering, and an exhaust you can live with on a long drive.",
          "We would rather talk you out of a cam than sell you one that ruins how the car drives on the street.",
        ],
      },
      {
        h: "Tuning for Alberta air",
        p: [
          "Edmonton sits around 650 metres above sea level and swings roughly sixty degrees between January and July. Air density moves with both, so a carb jetted somewhere warm and low arrives here fat and lazy.",
          "We set it for the air the car actually breathes, and tell you what changes if the car runs summer shows and then goes into winter storage.",
        ],
      },
      {
        h: "Straight talk on EFI and ECU work",
        p: [
          "Carburetors, ignition and mechanical tuning are the core of this bench. If your build wants full EFI calibration, ask before you buy parts — we will tell you plainly what belongs in-house and what is better handled by a dedicated calibrator. Nobody wins when a shop pretends.",
        ],
      },
    ],
    costHeading: "What does a carburetor rebuild or tune cost?",
    costIntro:
      "Tuning work is the cheapest way to transform how a classic drives, and it is where the fewest shops publish anything. These are the jobs that come through most often.",
    costRows: [
      {
        item: "Carburetor rebuild, single four-barrel",
        range: "$450 – $1,200",
        note: "Condition inside the carb, parts availability, whether it needs re-bushing or ultrasonic work.",
      },
      {
        item: "Multi-carb setup rebuild and synchronization",
        range: "$1,200 – $3,000",
        note: "Number of carbs, linkage condition, how much road time the sync actually takes.",
      },
      {
        item: "Points to electronic ignition conversion",
        range: "$600 – $1,800",
        note: "Distributor condition, kit versus complete replacement distributor, coil and wiring.",
      },
      {
        item: "Full ignition package (coil, wires, cap, curve)",
        range: "$900 – $2,500",
        note: "Parts chosen, whether the distributor needs recurving, and how much diagnosis is included.",
      },
      {
        item: "Bolt-on performance package, installed",
        range: "$4,000 – $12,000",
        note: "Intake, cam, headers and exhaust choices, plus how much fabrication the exhaust routing needs.",
      },
      {
        item: "Road tuning and diagnosis session",
        range: "$300 – $900",
        note: "How many faults are stacked, and whether fuel supply has to be sorted before jetting.",
      },
    ],
    costFootnote: NOT_A_QUOTE,
    faqs: [
      {
        q: "How much does a carburetor rebuild cost?",
        a: "A single four-barrel rebuilt, jetted and road-tested typically lands in the hundreds; multi-carb setups that need synchronizing cost more. See the indicative table above. Price moves with how much has to be replaced inside the carb, and whether the fuel supply feeding it needs sorting first.",
      },
      {
        q: "My classic runs badly when it is cold. Is that the carburetor?",
        a: "Sometimes. Just as often it is the choke, the ignition, the fuel supply, or a vacuum leak that only shows up cold. We diagnose in that order rather than rebuilding the carb first. Chasing a cold-running fault by throwing parts at it is the expensive way to solve it.",
      },
      {
        q: "Should I convert from points to electronic ignition?",
        a: "For a car you actually drive, yes. Points wear, drift out of timing and fail without warning. Electronic conversions hold a curve, start easier cold, and can be nearly invisible under the cap if originality matters. For a car judged on correctness, keep the points and carry spares.",
      },
      {
        q: "Do you tune on a dyno?",
        a: "We tune on the road, where the car is actually driven — cold starts, part throttle, traffic heat soak and full throttle in gear. That covers what a classic needs. If a build reaches the point where dyno time genuinely adds value, we will say so rather than sell you a number on paper.",
      },
      {
        q: "Why does my carb need different jetting in Edmonton?",
        a: "Air density changes with altitude and temperature. Edmonton sits around 650 metres above sea level and swings roughly sixty degrees between January and July, so a carb jetted at a warm, low-elevation shop arrives here running rich. We set it for the air here and adjust for how the car gets used seasonally.",
      },
      {
        q: "Can you tune a modern EFI swap?",
        a: "Ask first. Carburetors, ignition and mechanical tuning are the core of this bench. For a full EFI calibration on a modern swapped engine, we will tell you honestly what stays in-house and what is better sent to a dedicated calibrator. You get a straight answer before you buy parts.",
      },
    ],
    siblings: ["engine-swaps-builds", "classic-interiors-service", "restomods-custom-builds"],
    ctaHead: "Running rough, or just running?",
    ctaBody:
      "Tell us the engine, the carb and what the car does wrong. A tuning session is the cheapest big change most classics ever get.",
  },

  "body-paint-metalwork": {
    h1: "Classic car rust repair, body and paint in Alberta",
    metaTitle: "Classic Car Rust Repair Alberta — Body, Paint, Metal",
    metaDesc:
      "Classic car rust repair in Alberta — patch panels, floor pans, fabrication and paint at 2240 Speed Shop in Edmonton. Where road salt eats first, and what the fix costs.",
    opener:
      "Classic car rust repair in Alberta follows a predictable map: rockers, cab corners, lower quarters, floor pans, trunk drops, and frame rails where road salt collects. 2240 Speed Shop cuts the rot out and welds steel back in — patch panels where they exist, fabricated sections where they do not — then blocks and paints.",
    second:
      "This is where a build gets expensive and where a cheap job gives itself away. Bodywork is hours, not parts, and the hours are what separate a car that looks right from a car that looks close.",
    involves: [
      {
        h: "Where Alberta road salt eats first",
        p: [
          "Rockers and cab corners, lower quarters ahead of the rear wheel, floor pans under the pedals, trunk drop-offs behind the wheel wells, and frame rails where brine sits and never dries out. Door bottoms too, on anything that spent winters outside.",
          "If a car lived here, assume it is rotten in those places until proven otherwise. Surface bubbles usually mean the steel behind them is already gone.",
        ],
      },
      {
        h: "Patch panels versus full panels",
        p: [
          "Where reproduction panels exist — most GM and Ford trucks, common muscle cars — replacing the full panel is often cheaper and straighter than piecing in patches.",
          "Where they do not exist, we make the piece. Butt-welded, planished and metal-finished, not lapped over rust with seam sealer smeared on top.",
        ],
      },
      {
        h: "Floor pans and structure",
        p: [
          "Floors, braces and rockers hold the car together. Cutting them without bracing the shell first lets doors and gaps move, and a shell that has moved never fits right again.",
          "We brace, cut, fit, weld, then check gaps with the doors hung before anything sees primer.",
        ],
      },
      {
        h: "Fabrication when the panel does not exist",
        p: [
          "Orphan makes, one-off customs and hot rod work need metal made rather than ordered. Shrinker-stretcher, bead roller, hammer and dolly, TIG and MIG. Slower work, and it is what a good build is judged on ten years later.",
        ],
      },
      {
        h: "Primer, block, block again, paint",
        p: [
          "Straightness is made in the blocking, not in the spray gun. Epoxy primer, high build, guide coat, block, repeat until reflections run straight down the panel. Then base, clear, cut and buff.",
          "This is where the calendar goes, and where a bargain quote quietly tells you what it left out.",
        ],
      },
      {
        h: "Why bodywork is the biggest line on the invoice",
        p: [
          "A quarter panel costs a few hundred dollars. Fitting it so the gap matches the door and the reflection does not bend is days of labour. Any quote that treats paint as cheap is either skipping metalwork or planning to.",
        ],
      },
    ],
    costHeading: "What does rust repair and paint cost?",
    costIntro:
      "Rust pricing scales with how far the rot travelled, and paint pricing scales with blocking hours. These ranges assume the rest of the car is apart or coming apart as part of a larger build.",
    costRows: [
      {
        item: "Rocker or cab corner patch (per side)",
        range: "$800 – $2,500",
        note: "Whether the inner structure is also gone, and if the panel exists as a reproduction.",
      },
      {
        item: "Floor pan section",
        range: "$900 – $3,000",
        note: "Full pan versus section, condition of braces and crossmembers, seat mount repair.",
      },
      {
        item: "Quarter panel replacement (per side)",
        range: "$2,500 – $6,500",
        note: "Panel availability and fit quality, wheelhouse condition, gap and reflection work.",
      },
      {
        item: "Bare-metal strip and body prep",
        range: "$4,000 – $12,000",
        note: "Size of the shell, layers of old filler and paint, and what the strip uncovers.",
      },
      {
        item: "Respray, driver quality",
        range: "$8,000 – $18,000",
        note: "How straight the body already is, colour choice, and how much trim comes off first.",
      },
      {
        item: "Show-quality paint, blocked and buffed",
        range: "$18,000 – $45,000+",
        note: "Blocking passes, jamb and underside work, cut-and-buff hours, and colour complexity.",
      },
    ],
    costFootnote: NOT_A_QUOTE,
    faqs: [
      {
        q: "How much does rust repair cost on a classic?",
        a: "It scales with how far the rot travelled. A pair of cab corners is a fraction of what a quarter panel and floor pan job costs, and structural frame repair is its own conversation. The ranges here are indicative. We quote once the car is on the hoist and the metal has been probed properly.",
      },
      {
        q: "Where does Alberta road salt attack a classic first?",
        a: "Rockers, cab corners, lower quarters ahead of the rear wheel, floor pans under the pedals, trunk drop-offs, and frame rails where brine sits and cannot dry. Door bottoms too, on anything stored outside. Surface bubbles usually mean the steel behind them is already gone.",
      },
      {
        q: "Can rust just be cut out and covered with filler?",
        a: "It can. It will come back, usually inside two winters, and it will take the new paint with it. Filler over rust is why so many cheap paint jobs bubble along the same seams. We cut back to clean steel and weld metal in. There is no shortcut here worth selling.",
      },
      {
        q: "How much does a full respray cost?",
        a: "A driver-quality respray and a show-quality finish are different jobs with very different hour counts — blocking passes, jamb work and cut-and-buff are where the difference lives. See the ranges above. Most of the bill is bodywork labour before the gun ever comes out, not the paint itself.",
      },
      {
        q: "Do you fabricate panels that are not reproduced?",
        a: "Yes. Where no reproduction panel exists, we form the piece — shrinker-stretcher, bead roller, hammer and dolly — then butt-weld and metal-finish it. That work costs more hours than bolting on a catalogue panel, and on orphan makes and one-off customs there is no real alternative.",
      },
      {
        q: "Can I drive the car through an Alberta winter after paint?",
        a: "You can. We would not. Salt brine finds fresh seams, stone chips open the door, and one season of slush undoes months of metalwork. Most finished cars here get stored from the first salt to the spring wash. If it has to be a winter driver, say so before we plan the build.",
      },
    ],
    siblings: ["classic-car-restoration", "restomods-custom-builds", "classic-interiors-service"],
    ctaHead: "Found bubbles in the rocker?",
    ctaBody:
      "Send photos of the usual places — rockers, cab corners, floors, trunk. We will tell you what is likely underneath before you commit to anything.",
  },

  "classic-interiors-service": {
    h1: "Classic car interior restoration in Edmonton",
    metaTitle: "Classic Car Interior Restoration Edmonton",
    metaDesc:
      "Classic car interior restoration in Edmonton — period-correct leather, wool, wood and headliners with discreet modern comfort, plus classic mechanical service at 2240 Speed Shop.",
    opener:
      "Classic car interior restoration in Edmonton covers seats, panels, headliners, carpet, wood and gauges — rebuilt with period-correct materials so the cabin reads original. 2240 Speed Shop hides the modern parts you actually want, and handles classic mechanical service — brakes, ignition, fluids — on the same cars.",
    second:
      "The interior is the part of a build you sit inside every time you drive it. It is also the part people notice last and remember longest, because a cabin that is nearly right is worse than one that is plainly a driver.",
    involves: [
      {
        h: "Period-correct materials",
        p: [
          "Leather, vinyl, wool broadcloth, loop or cut-pile carpet, and the right grain on a door panel — details a photograph catches even when a person cannot name them.",
          "We use reproduction kits where the good ones exist and have material sourced or made up where they do not.",
        ],
      },
      {
        h: "Seats, foam and frames",
        p: [
          "Frames get inspected and repaired, springs re-tied, foam replaced rather than padded over. A sixty-year-old bench with tired foam looks wrong under new upholstery no matter how good the stitching is.",
        ],
      },
      {
        h: "Headliners, panels and carpet",
        p: [
          "Headliners are fit work, not glue work — bows set in order, material stretched and relaxed with heat, edges trimmed clean. Panels get re-covered on repaired backers rather than warped originals.",
          "Carpet goes over sound and heat insulation, which is the cheapest comfort upgrade in the whole car.",
        ],
      },
      {
        h: "Wood, chrome and gauges",
        p: [
          "Wood trim stripped and refinished, gauge faces and bezels restored, glass cleaned and lenses replaced. Gauges get tested rather than assumed — a fuel sender reading wrong ruins an otherwise finished dash.",
        ],
      },
      {
        h: "Discreet modern comfort",
        p: [
          "Bluetooth audio, hidden speakers, USB power and modern insulation, installed without cutting a factory dash. The rule is simple: there when you want it, invisible when you do not.",
        ],
      },
      {
        h: "Classic mechanical service",
        p: [
          "Brakes, ignition, fluids, hoses, belts and a proper seasonal once-over for cars that get driven. Classics rarely fail from mileage — they fail from sitting.",
          "Regular service is what keeps a finished car out of the restoration queue a second time, and it is the cheapest line item on this whole site.",
        ],
      },
    ],
    costHeading: "What does a classic interior cost?",
    costIntro:
      "Interior pricing is driven by material choice more than anything else. A correct wool and leather cabin and a good vinyl driver interior are the same labour and very different bills.",
    costRows: [
      {
        item: "Front bench or bucket seats reupholstered",
        range: "$1,500 – $4,500",
        note: "Material choice, frame and spring repair, whether foam is replaced or rebuilt.",
      },
      {
        item: "Headliner replacement",
        range: "$600 – $1,800",
        note: "Bow-style versus moulded, condition of the bows, trim and glass that must come out.",
      },
      {
        item: "Full interior: seats, panels, headliner, carpet",
        range: "$5,000 – $15,000",
        note: "Kit availability for the model, custom-made material, sound and heat insulation added.",
      },
      {
        item: "Wood trim refinishing",
        range: "$800 – $3,500",
        note: "Number of pieces, veneer condition, and how many finish coats the look requires.",
      },
      {
        item: "Hidden audio and Bluetooth integration",
        range: "$1,200 – $4,000",
        note: "Speaker locations needing fabrication, amp mounting, keeping the dash uncut.",
      },
      {
        item: "Classic mechanical service visit",
        range: "$400 – $2,500",
        note: "Brake, ignition and fluid scope, plus whatever a car that sat for years turns up.",
      },
    ],
    costFootnote: NOT_A_QUOTE,
    faqs: [
      {
        q: "How much does a classic car interior cost?",
        a: "A single seat reupholstered is a modest job; a full interior with seats, panels, headliner, carpet and refinished trim is a project in its own right. The table above gives indicative ranges. Material choice moves the number more than anything — correct wool, leather and custom trim all cost real money.",
      },
      {
        q: "Can you keep the interior period-correct?",
        a: "Yes. Correct grain, correct weave, correct stitch pattern and correct carpet type wherever the information exists. Where a reproduction kit is good, we use it. Where it is not, material gets sourced or made up. If a detail cannot be verified, we tell you what we are matching and how.",
      },
      {
        q: "Can I add Bluetooth and air conditioning without ruining the look?",
        a: "That is the point of doing it here. Speakers hide in factory locations or under panels, head units go out of sight, and controls sit where they do not fight the dash. Air conditioning is a bigger install and belongs in the build plan early rather than as an afterthought.",
      },
      {
        q: "Do you service classics as well as restore them?",
        a: "Yes. Brakes, ignition, fluids, hoses, belts and a seasonal once-over. Classics rarely fail from mileage — they fail from sitting. A driven car that gets serviced every season stays out of the restoration queue, which is cheaper than everything else on this site.",
      },
      {
        q: "How long does a full interior take?",
        a: "Weeks of shop time, and longer when material has to be ordered or made up. Seat foam, headliner fit and panel work cannot be rushed without showing it later. We stage interiors near the end of a build so a finished cabin is not sitting under bodywork dust.",
      },
    ],
    siblings: ["classic-car-restoration", "classic-performance-tuning", "body-paint-metalwork"],
    ctaHead: "Cabin let the rest of the car down?",
    ctaBody:
      "Send photos of the seats, dash and headliner. We will tell you what can be saved, what should be replaced, and roughly what each route costs.",
  },
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((svc) => svc.slug === slug);
  if (!s) return {};
  const d = details[s.slug];

  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: `/services/${s.slug}` },
    keywords: [s.keyword, `${s.title} Edmonton`, "2240 Speed Shop", site.city],
    openGraph: {
      type: "article",
      locale: "en_CA",
      siteName: site.name,
      url: `${site.url}/services/${s.slug}`,
      title: `${d.metaTitle} | ${site.name}`,
      description: d.metaDesc,
      images: [{ url: s.image, alt: s.alt }],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((svc) => svc.slug === slug);
  if (!s) notFound();

  const d = details[s.slug];
  const siblings = d.siblings
    .map((sib) => services.find((svc) => svc.slug === sib))
    .filter((svc): svc is (typeof services)[number] => Boolean(svc));

  return (
    <article className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: s.title, path: `/services/${s.slug}` },
        ])}
      />
      <JsonLd data={serviceSchema(s)} />

      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-steel">
          <li>
            <Link className="hover:text-bone" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-tungsten/50">
            /
          </li>
          <li>
            <Link className="hover:text-bone" href="/services">
              Services
            </Link>
          </li>
          <li aria-hidden="true" className="text-tungsten/50">
            /
          </li>
          <li aria-current="page" className="text-bone">
            {s.title}
          </li>
        </ol>
      </nav>

      <header className="mt-8 max-w-5xl">
        <p className="corner-note text-tungsten">{s.keyword}</p>
        <h1 data-fx="h" className="mt-4 font-display text-[clamp(2.8rem,7.5vw,6.5rem)] uppercase leading-[0.88] tracking-wide text-bone">
          {d.h1}
        </h1>
        <p className="mt-5 font-mono text-sm uppercase tracking-[0.14em] text-tungsten">
          {s.blurb}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-bone md:text-xl">{d.opener}</p>
        <p className="mt-5 max-w-3xl leading-relaxed text-steel">{d.second}</p>
      </header>

      <figure className="mt-10">
        <ClipReveal>
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={s.image}
              alt={s.alt}
              fill
              priority
              sizes="(min-width: 1152px) 64rem, 100vw"
              className="graded object-cover"
            />
          </div>
        </ClipReveal>
        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
          {site.name} — {site.street}, {site.city}, {site.region}
        </figcaption>
      </figure>

      <section aria-labelledby="involves" className="mt-20">
        <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-neon-bloom">
          No marketing version
        </p>
        <h2
          id="involves"
          className="mt-3 font-display text-4xl uppercase tracking-wide text-bone md:text-5xl"
        >
          What this actually involves
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {d.involves.map((block) => (
            <div key={block.h} className="plate p-6">
              <h3 className="font-display text-2xl uppercase leading-tight tracking-wide text-bone md:text-3xl">
                {block.h}
              </h3>
              <div className="mt-4 space-y-4">
                {block.p.map((para, i) => (
                  <p key={`${block.h}-${i}`} className="text-sm leading-relaxed text-steel">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CostTable
        heading={d.costHeading}
        intro={d.costIntro}
        rows={d.costRows}
        footnote={d.costFootnote}
      />

      <FaqBlock
        items={d.faqs}
        heading={`${s.title} — straight answers`}
        intro={`The questions people ask before they hand over a car. If yours is not here, call the shop at ${site.phoneDisplay}.`}
      />

      <section aria-labelledby="related" className="mt-20">
        <h2
          id="related"
          className="font-display text-3xl uppercase tracking-wide text-bone md:text-4xl"
        >
          What else does a build like this touch?
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-steel">
          Most projects cross more than one bench. These are the trades that usually run alongside{" "}
          {s.title.toLowerCase()}.
        </p>

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {siblings.map((sib) => (
            <li key={sib.slug} className="plate p-6">
              <h3 className="font-display text-2xl uppercase leading-tight tracking-wide text-bone">
                <Link className="hover:text-neon-bloom" href={`/services/${sib.slug}`}>
                  {sib.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-steel">{sib.blurb}</p>
              <Link
                href={`/services/${sib.slug}`}
                className="mt-4 inline-block font-sub text-[11px] uppercase tracking-[0.2em] text-tungsten underline decoration-tungsten/40 underline-offset-4 hover:text-bone"
              >
                {sib.nav} details
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl leading-relaxed text-steel">
          Hauling a project in from out of town?{" "}
          <Link
            className="text-tungsten underline decoration-tungsten/40 underline-offset-4 hover:text-bone"
            href="/edmonton"
          >
            See the Edmonton-area map
          </Link>{" "}
          — {site.areas.slice(0, 5).join(", ")} and the county roads between them. Or go straight to
          the{" "}
          <Link
            className="text-tungsten underline decoration-tungsten/40 underline-offset-4 hover:text-bone"
            href="/quote"
          >
            quote form
          </Link>
          .
        </p>
      </section>

      <section
        aria-labelledby="cta"
        className="mt-20 border border-tungsten/60 bg-panel/70 px-6 py-12 text-center md:px-12"
      >
        <h2
          id="cta"
          className="font-display text-4xl uppercase tracking-wide text-bone md:text-5xl"
        >
          {d.ctaHead}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-steel">{d.ctaBody}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/quote"
            className="w-full border border-tungsten bg-tungsten/5 px-8 py-3 font-sub text-xs uppercase tracking-[0.22em] text-bone transition-all hover:border-neon-bloom hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,20,20,0.12)] sm:w-auto"
          >
            Start your quote
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="w-full border border-steel/40 px-8 py-3 font-mono text-xs uppercase tracking-[0.22em] text-bone transition-colors hover:border-steel sm:w-auto"
          >
            {site.phoneDisplay}
          </a>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
          {site.street}, {site.city} {site.region} · Mon–Fri 9:00–17:00
        </p>
      </section>
    </article>
  );
}
