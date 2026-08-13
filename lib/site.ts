// Single source of truth for NAP + business facts.
// Every fact here was verified from live sources on 2026-08-02 — see
// 2240-speedshop-rebuild/00-MASTER-REPORT.md. Do not invent additions.

export const site = {
  name: "2240 Speed Shop",
  legalName: "2240 Speed Shop",
  tagline: "Customs and Classics",
  owner: "Terry Harmider",
  url: "https://2240speedshop.com",
  phone: "+1-780-999-6450",
  phoneDisplay: "780-999-6450",
  email: "2240speedshop@gmail.com",
  street: "2009 91 Ave NW",
  city: "Edmonton",
  region: "AB",
  postalCode: "T6P 1L1",
  country: "CA",
  // Approximate — confirm with Terry before this goes to a live GBP.
  geo: { lat: 53.4818, lng: -113.3773 },
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
  ],
  areas: [
    "Edmonton",
    "Sherwood Park",
    "St. Albert",
    "Leduc",
    "Nisku",
    "Spruce Grove",
    "Fort Saskatchewan",
  ],
  instagram: "https://www.instagram.com/2240speedshop/",
  social: ["https://www.instagram.com/2240speedshop/", "https://www.threads.com/@2240speedshop"],
} as const;

export const services = [
  {
    slug: "classic-car-restoration",
    title: "Restoration",
    nav: "Restoration",
    keyword: "classic car restoration Edmonton",
    blurb: "Frame-off or rolling. Honest scope, real hours, one standard.",
    long:
      "Full frame-off restorations and rolling restorations on classic cars and trucks. We strip to bare metal, fix what is actually wrong, and put it back better than the factory managed.",
    image: "/shop/IMG_0051-mission-black-classic.jpeg",
    alt: "Vintage black classic car under restoration inside the 2240 Speed Shop garage in Edmonton",
  },
  {
    slug: "restomods-custom-builds",
    title: "Restomods & Hot Rods",
    nav: "Restomods",
    keyword: "restomod Edmonton",
    blurb: "Classic skin, modern spine. Rolling works of art with brakes that work.",
    long:
      "Period looks, current running gear. Disc brake conversions, modern suspension and drivetrain under original sheet metal — the car you remember, with the manners you expect now.",
    image: "/shop/IMG_1949-blue-pickup.png",
    alt: "Custom blue vintage pickup truck, lowered on polished rims, built by 2240 Speed Shop",
  },
  {
    slug: "engine-swaps-builds",
    title: "Engine Swaps & Builds",
    nav: "Engine Swaps",
    keyword: "LS swap Edmonton",
    blurb: "LS and diesel conversions. Old iron, modern heart — starts at minus thirty.",
    long:
      "LS and diesel conversions, engine builds, mounts, wiring, cooling and driveline sorted properly. An Alberta swap has to start in the cold and run all summer, so that is the bar we build to.",
    image: "/shop/IMG_0434-black-muscle-car.jpeg",
    alt: "Black muscle car with exposed air intake during an engine swap at 2240 Speed Shop Edmonton",
  },
  {
    slug: "classic-performance-tuning",
    title: "Performance & Tuning",
    nav: "Performance",
    keyword: "carburetor rebuild Edmonton",
    blurb: "Carbs rebuilt and dialed. Points to electronic ignition. Horsepower you can feel.",
    long:
      "Carburetor rebuilds and tuning, ignition upgrades, exhaust and bolt-on performance for classics and muscle. Dialed for Alberta air, not a sea-level dyno sheet.",
    image: "/shop/hero-video-poster.jpg",
    alt: "Performance tuning work in progress at 2240 Speed Shop in Edmonton",
  },
  {
    slug: "body-paint-metalwork",
    title: "Body, Paint & Metal",
    nav: "Body & Paint",
    keyword: "classic car rust repair Alberta",
    blurb: "Rust dies here. Patch panels, floor pans, straight steel, deep paint.",
    long:
      "Rust repair, patch panels, floor pans, fabrication and paint. Alberta road salt writes the same story on every car that comes through the door — we know exactly where to look.",
    image: "/shop/IMG_0401-stripped-blue-frame.jpeg",
    alt: "Stripped blue project car body shell during rust repair and metalwork in Edmonton",
  },
  {
    slug: "classic-interiors-service",
    title: "Interiors & Classic Service",
    nav: "Interiors",
    keyword: "classic car interior restoration Edmonton",
    blurb: "Period-correct materials, discreet modern comfort.",
    long:
      "Leather, wood trim and vintage fabrics done period-correct, with the modern amenities you actually want hidden where they belong. Brakes, ignition and classic mechanical service live here too.",
    image: "/shop/IMG_2950-original.jpeg",
    alt: "Vintage motorcycle and neon signage inside the 2240 Speed Shop showroom",
  },
] as const;

export const areas = [
  { slug: "sherwood-park", name: "Sherwood Park", note: "We are on the Sherwood Park line — the shop is minutes from Baseline Road." },
  { slug: "st-albert", name: "St. Albert", note: "Rock'n August country. Straight up the Henday, about 30 minutes." },
  { slug: "leduc-nisku", name: "Leduc & Nisku", note: "Passenger classics and customs — not just heavy truck work." },
  { slug: "spruce-grove", name: "Spruce Grove", note: "West-end builds welcome; we will talk you through the haul." },
] as const;

export type Service = (typeof services)[number];
