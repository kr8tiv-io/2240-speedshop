import { services } from "./site";

/**
 * Build case studies — the proof layer.
 *
 * HONESTY RULE (non-negotiable): every photograph referenced here is a real
 * 2240 Speed Shop image, but the shop's full history on each vehicle is not
 * documented. Copy therefore describes (a) what is visibly in the frame and
 * (b) the work a vehicle in that condition takes. No invented customers, no
 * invented prices, no invented completion dates, no invented specifications.
 * Year and model claims are only made where the vehicle badges itself in the
 * photo (the Dodge D100 tailgate) or where the fact was verified.
 *
 * Confirm the detail on every build with Terry before this goes to a live
 * domain — at that point the copy gets tightened with real history, not
 * loosened with guesses.
 *
 * NOTE FOR THE NEXT EDITOR: the files ig-D100-slide2-lightpatch.jpg and
 * ig-D100-slide3.jpg are misnamed in /public/shop — they are photographs of a
 * neon-green model-kit sprue from a different Instagram carousel, not the
 * D100. They are deliberately not referenced here.
 */

export type BuildImage = {
  src: string;
  alt: string;
  caption: string;
  /** Tailwind aspect class chosen from the file's real dimensions so no photo letterboxes. */
  aspect: string;
  /**
   * Two source files are phone screenshots with baked-in black bars (measured in
   * the browser, not guessed): IMG_1954-original.png holds its photo at
   * y 35.9–64.1% / x 6.9–90.6%, and IMG_1949-blue-pickup.png at x 11.9–88.1%.
   * IMG_1949 is solved by aspect alone. IMG_1954 cannot be — the content is
   * landscape inside a portrait file, so object-cover always shows the side
   * bars. This scale factor on the image wrapper crops them off.
   *
   * Applied as an inline transform rather than a Tailwind class on purpose: an
   * arbitrary class string living in a .ts data file is not reliably picked up
   * by the Tailwind v4 source scan, and rendered as scale(1) when tried.
   *
   * The real fix is re-exporting those two files cropped; then drop this.
   */
  zoom?: number;
};

export type BuildFact = { label: string; value: string };

export type Build = {
  slug: string;
  /** H1 — carries the vehicle keyword. */
  title: string;
  /** <title> without the brand suffix — app/layout.tsx appends "| 2240 Speed Shop". */
  metaTitle: string;
  /** Short label for cards and breadcrumbs. */
  cardTitle: string;
  /** The single long-tail term this page owns. One keyword, one owner. */
  keyword: string;
  /** Mono eyebrow label. */
  era: string;
  /** Where the vehicle is in the photograph, not a promise about a schedule. */
  stage: string;
  /** Answer-first opener, 40–60 words. This is what AI engines lift. */
  lede: string;
  /** Grid teaser, one or two lines. */
  card: string;
  /** Question-form H2 for the work list — different on every page. */
  workQuestion: string;
  work: string[];
  facts: BuildFact[];
  images: BuildImage[];
  /** Slugs from lib/site.ts `services`. Builds link laterally into services. */
  serviceSlugs: string[];
  faq: { q: string; a: string }[];
  /** Photo credit, where a photographer is known. */
  credit?: string;
};

export const builds: Build[] = [
  {
    slug: "1960s-dodge-d100",
    title: "1960s Dodge D100 Restoration",
    metaTitle: "1960s Dodge D100 Restoration — Patina Truck Build in Edmonton",
    cardTitle: "1960s Dodge D100",
    keyword: "1960s Dodge D100 restoration",
    era: "1960s",
    stage: "Driven",
    lede:
      "The 1960s Dodge D100 is the truck people stop for. Turquoise factory paint gone chalky, a tailgate bloomed through with rust, and a stance that reads honest from fifty feet. In September 2025 a photographer pulled over mid-drive to shoot it, then posted the frame. That is the bar in this shop.",
    card:
      "The patina truck a photographer pulled over for. Original turquoise, rust through the tailgate, still on the road.",
    workQuestion: "What does a truck with this much patina actually need?",
    work: [
      "The tailgate and lower bed steel have bloomed through at the seams. That gets cut out and let in with new steel, never skimmed over with filler.",
      "Cab corners, rockers, and the lower doglegs are where Alberta salt starts its work. They get opened and read before a dollar goes anywhere cosmetic.",
      "Keeping weathered factory paint is a finish decision, not neglect. Sealed and left alone, honest patina outlives a cheap respray and cannot be faked.",
      "Brakes, steering, and fuel come first on any truck this age. On a patina truck the mechanical budget is the whole budget.",
      "Glass, seals, and the cab floor decide whether it is a July truck or a truck you can actually use in October.",
    ],
    facts: [
      { label: "Era", value: "1960s" },
      { label: "Body", value: "Two-door cab, long box, steel bumper" },
      { label: "Finish", value: "Original turquoise, heavy patina, rust through the tailgate" },
      { label: "Stage", value: "On the road" },
    ],
    images: [
      {
        src: "/shop/ig-D100-slide1-fullres.jpg",
        alt: "1960s Dodge D100 pickup with weathered turquoise paint and a rust-bloomed tailgate parked under a prairie tree near Edmonton",
        caption:
          "Rear three-quarter flat-on. The Dodge script is still readable through the rust — that is the whole argument for keeping patina.",
        aspect: "aspect-[4/5]",
      },
    ],
    serviceSlugs: ["classic-car-restoration", "body-paint-metalwork", "engine-swaps-builds"],
    faq: [
      {
        q: "Can I keep the patina on my classic truck?",
        a: "Yes. Weathered factory paint can be cleaned, stabilized, and sealed instead of stripped. It costs less than a respray and it cannot be faked. Decide before bodywork starts, because it changes how the rust repair underneath is done.",
      },
      {
        q: "Do you take on trucks with rust this far gone?",
        a: "Rust is the job. Bloomed tailgates, cab corners, and floor pans get cut out and replaced with steel. Send photos of the seams and the underside and you get a straight answer on scope before anyone talks money.",
      },
    ],
    credit: "Photographed by @natlajphotography, September 2025.",
  },
  {
    slug: "green-hardtop-coupe",
    title: "Green 1960s Hardtop Coupe",
    metaTitle: "Green 1960s Hardtop Coupe — Muscle Car Restoration Edmonton",
    cardTitle: "Green hardtop coupe",
    keyword: "muscle car restoration Edmonton",
    era: "1960s",
    stage: "Finished",
    lede:
      "A late-1960s hardtop coupe in soft factory green with a black vinyl roof, chrome rocker trim, and dog-dish caps on black steel wheels. No billet, no flash, nothing shouting. Muscle car restoration in Edmonton usually ends up here — period-correct where it shows, sorted underneath, and actually driven.",
    card:
      "Factory green over a black vinyl top, chrome rockers, dog-dish caps on black steels. Restraint, done properly.",
    workQuestion: "Why does a restoration this quiet take the most work?",
    work: [
      "Soft green over a black vinyl roof only works if the panels are dead flat. Blocking is where the hours go, and it is the part nobody ever sees.",
      "Dog-dish caps on black steel wheels are a decision, not a budget. On a body this shape, period-correct beats billet every time.",
      "Rocker and quarter trim comes off before paint and goes back on with new clips. Reused clips are why other people's gaps look wrong.",
      "Quarter panels and the lower rear window channel are the rust traps on any hardtop. Both get opened before a colour is ordered.",
      "Dual exhaust routed and tucked behind the valance. On a car this restrained, the sound carries the attitude.",
    ],
    facts: [
      { label: "Era", value: "1960s" },
      { label: "Body", value: "Two-door hardtop coupe" },
      { label: "Finish", value: "Soft factory-style green, black vinyl roof" },
      { label: "Rolling stock", value: "Black steel wheels, dog-dish caps" },
      { label: "Stage", value: "Finished" },
    ],
    images: [
      {
        src: "/shop/IMG_1954-original.png",
        alt: "Rear quarter of a restored green 1960s hardtop coupe with black vinyl roof and dog-dish hubcaps on black steel wheels",
        caption:
          "Rear quarter, low angle. Straight chrome, tight gaps, and a reflection that runs the length of the panel without a wobble.",
        aspect: "aspect-[16/9]",
        zoom: 1.35,
      },
    ],
    serviceSlugs: ["classic-car-restoration", "body-paint-metalwork", "classic-performance-tuning"],
    faq: [
      {
        q: "What does period-correct actually mean?",
        a: "It means the parts you can see would not look out of place the year the car was built — steel wheels and small caps instead of billet, correct trim clips, and paint mixed to a factory-style colour. Modern brakes and cooling can still live underneath.",
      },
      {
        q: "Do you restore muscle cars as well as trucks?",
        a: "Yes. Coupes, hardtops, and muscle cars run the same process as the trucks: strip it, read the steel, fix what is actually wrong, then paint. Nothing goes on top of a problem.",
      },
    ],
  },
  {
    slug: "red-stepside-pickup",
    title: "Red 1950s Stepside Pickup",
    metaTitle: "Red 1950s Stepside Pickup — 1950s Pickup Restoration Edmonton",
    cardTitle: "Red stepside pickup",
    keyword: "1950s pickup restoration Edmonton",
    era: "1950s",
    stage: "In the bay",
    lede:
      "Deep red 1950s stepside pickup, hood up under the Texaco neon in the shop bay. Nothing under that hood left the factory looking like that. A 1950s pickup restoration in Edmonton lives or dies on cab corners, running boards, and whether the engine bay was wired by somebody who cared.",
    card:
      "Gloss red stepside under the Texaco neon, hood up on an engine bay that is nothing like stock.",
    workQuestion: "What goes into a 1950s pickup like this one?",
    work: [
      "Gloss this deep is a bodywork result, not a paint result. Colour is the last thing that happens, not the fix.",
      "Stepside fenders and running boards bolt on separately, so every gap is adjustable — which means every gap that is wrong is somebody's fault.",
      "The engine bay is not stock. Modern power in a 1950s truck means mounts, cooling, fuel delivery, and wiring get solved together or none of them work.",
      "Brakes get sorted before power does. Factory drums from this era were never built for what is sitting under that hood now.",
      "Cab corners, floor pans, and the lower doglegs are the rust map on every truck this age. Read them first, quote second.",
    ],
    facts: [
      { label: "Era", value: "1950s" },
      { label: "Body", value: "Stepside pickup, short cab, separate front fenders" },
      { label: "Finish", value: "Gloss red, chrome trim rings" },
      { label: "Under the hood", value: "Not factory" },
      { label: "Stage", value: "In the bay" },
    ],
    images: [
      {
        src: "/shop/IMG_0052-red-pickup-texaco.jpeg",
        alt: "Red 1950s stepside pickup with the hood up beside the Texaco neon sign inside the 2240 Speed Shop bay in Edmonton",
        caption:
          "In the bay with the hood up, under the Texaco neon. The shop looks like this most days.",
        aspect: "aspect-[3/4]",
      },
    ],
    serviceSlugs: ["engine-swaps-builds", "body-paint-metalwork", "classic-car-restoration"],
    faq: [
      {
        q: "Can you put a modern engine in a 1950s truck?",
        a: "Yes, and it is one of the most common jobs here. The engine is the easy part. Mounts, cooling, fuel, exhaust, driveline, and wiring are the actual work, and an Alberta swap has to start at minus thirty.",
      },
      {
        q: "Do you do the paint in-house?",
        a: "Body, metalwork, and paint are handled in the shop. Colour goes on after the steel is straight — never to hide that it is not.",
      },
    ],
  },
  {
    slug: "blue-lowered-pickup",
    title: "Blue Lowered Shortbox Pickup",
    metaTitle: "Blue Lowered Shortbox — Lowered Classic Pickup Edmonton",
    cardTitle: "Blue lowered shortbox",
    keyword: "lowered classic pickup Edmonton",
    era: "1960s–70s",
    stage: "Finished",
    lede:
      "Metallic blue shortbox pickup, laid low over polished billet wheels, body smoothed and the stance doing all the talking. A lowered classic pickup only reads right when ride height, wheel fitment, and panel gaps get solved as one problem instead of three separate afterthoughts.",
    card:
      "Metallic blue shortbox, smoothed body, polished billet, and a stance that took more planning than paint.",
    workQuestion: "How does a pickup get this low and still drive?",
    work: [
      "Stance is geometry, not just shorter springs. Drop it wrong and the arms bind, the tires rub, and it rides like a shopping cart.",
      "Wheel fitment gets mocked up before anything is painted. Offset decides how the fender line reads, and you only get one chance at it.",
      "A smoothed body is a commitment. Every badge, seam, and handle deleted is a hole that has to be welded, filled flush, and blocked flat.",
      "One colour over a long body shows every wave in daylight. Longer boards, more passes, more time on the panel.",
      "Exhaust gets routed around the lowered frame from the start, not tucked up as an afterthought when it drags.",
    ],
    facts: [
      { label: "Era", value: "1960s–70s" },
      { label: "Body", value: "Shortbox fleetside pickup, smoothed" },
      { label: "Finish", value: "Metallic blue, single colour" },
      { label: "Rolling stock", value: "Polished billet wheels" },
      { label: "Stage", value: "Finished" },
    ],
    images: [
      {
        src: "/shop/IMG_1949-blue-pickup.png",
        alt: "Custom blue classic shortbox pickup lowered over polished billet wheels, built by 2240 Speed Shop in Edmonton",
        caption:
          "Rear three-quarter. The bed line, the rocker, and the top of the tire all agree with each other — that is the whole job.",
        aspect: "aspect-[8/5]",
      },
    ],
    serviceSlugs: ["restomods-custom-builds", "body-paint-metalwork", "engine-swaps-builds"],
    faq: [
      {
        q: "How low can a classic pickup go and still be drivable?",
        a: "Lower than most people expect, if the suspension geometry is corrected rather than just cut. The real limit is not looks — it is bump travel, tire clearance, and what your own driveway does to a front valance.",
      },
      {
        q: "Air ride or a static drop?",
        a: "Both work. Air lets you drive a show-height truck to the show. Static is simpler and cheaper to keep alive through an Alberta winter. Decide before the body is finished, because it changes the floor and the frame.",
      },
    ],
  },
  {
    slug: "blue-project-shell",
    title: "Blue Project Shell — Down to Bare Steel",
    metaTitle: "Blue Project Shell — Stalled Project Car Rebuild Edmonton",
    cardTitle: "Blue project shell",
    keyword: "stalled project car rebuild Edmonton",
    era: "Project intake",
    stage: "Down to steel",
    lede:
      "A blue project shell on the shop floor with the front clip off, the nose open to the subframe, and the suspension sitting in daylight. This is what a stalled project car looks like when it arrives in Edmonton — boxed parts, good intentions, and no written plan.",
    card:
      "Front clip off, nose open to the subframe. Where a stalled project starts telling the truth.",
    workQuestion: "Where does a stalled project actually start?",
    work: [
      "First job is an inventory. Every box, every bag, every part that arrived with the car gets laid out and written down.",
      "With the front clip off, the rails, inner fenders, and firewall can finally be read. That is where the real budget has been hiding.",
      "Nothing gets ordered until the steel is assessed. Buying parts before you know what is rotten is how a project stalls a second time.",
      "A shell that has sat on old tires for years has settled. Ride height, door gaps, and glass fit all get checked against a level floor.",
      "The plan comes out in writing — scope, order of operations, and what happens first. Then, and only then, the work starts.",
    ],
    facts: [
      { label: "Stage", value: "Down to bare steel, front clip off" },
      { label: "Visible", value: "Open nose, exposed subframe and front suspension" },
      { label: "Year and model", value: "Confirmed with the owner, never guessed" },
      { label: "Location", value: "On the floor at 2009 91 Ave NW, Edmonton" },
    ],
    images: [
      {
        src: "/shop/IMG_0401-stripped-blue-frame.jpeg",
        alt: "Stripped blue project car shell with the front clip removed and the subframe exposed on the shop floor at 2240 Speed Shop Edmonton",
        caption:
          "Front clip off, nose open, suspension in daylight. Nothing gets ordered until this part has been read.",
        aspect: "aspect-[3/4]",
      },
      {
        src: "/shop/IMG_0402-covered-classic.jpeg",
        alt: "The same blue project shell at right, sharing a bay with a maroon classic coupe masked off for paint at 2240 Speed Shop in Edmonton",
        caption:
          "Same shell, right of frame, sharing the bay with a coupe masked off for paint. Two ends of the same process on one floor.",
        aspect: "aspect-[3/4]",
      },
    ],
    serviceSlugs: ["classic-car-restoration", "body-paint-metalwork", "restomods-custom-builds"],
    faq: [
      {
        q: "Will you finish somebody else's unfinished build?",
        a: "Yes. Stalled projects are a large part of the work here. The first step is an honest inventory and an assessment of the steel, not a quote. You get told what is actually there before anyone talks money.",
      },
      {
        q: "What if parts are missing?",
        a: "That is normal, and it is why the inventory happens first. Boxes get sorted, missing pieces get listed, and sourcing becomes part of the written plan. Nobody discovers a missing crossmember halfway through paint.",
      },
    ],
  },
];

export function getBuild(slug: string): Build | undefined {
  return builds.find((b) => b.slug === slug);
}

export function otherBuilds(slug: string): Build[] {
  return builds.filter((b) => b.slug !== slug);
}

export type SiteService = (typeof services)[number];

export function servicesForBuild(build: Build): SiteService[] {
  return build.serviceSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is SiteService => Boolean(s));
}
