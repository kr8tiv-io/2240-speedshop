import fs from "node:fs";
import assert from "node:assert/strict";

const files = [
  "components/home/HomeCinema.tsx",
  "components/shop/WalkthroughSections.tsx",
  "app/page.tsx",
  "app/reviews/page.tsx",
  "app/edmonton/page.tsx",
];
const source = files.map((file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8")).join("\n");

const retired = [
  "Tell me what it",
  "One finished car, doing",
  "Six trades,",
  "The wall keeps the",
  "No showroom. This is the room.",
  "Car people do not write essays.",
  "car people are not essayists",
  "Three Google reviews with words in them",
  "Worth the drive from anywhere",
  "going home this week",
  "the shop that made it for them without asking",
  "Last September a photographer pulled over mid-drive",
  "A restoration is a decision, not a purchase.",
  "Most shops farm out the paint",
  "The Charger earns every slow degree.",
  "trailer of hope",
  "The reviews that carry words",
  "reviews with words in them",
  "Leave a review with words in it.",
  "A shop that flinches",
  "One car. One",
];

for (const phrase of retired) {
  assert.ok(!source.includes(phrase), `retired weak copy is still present: ${phrase}`);
}

for (const proof of [
  "Bring us the car you",
  "See what",
  "Every system, one",
  "Proof, pinned to the",
  "The work is the showroom.",
  "The work gets remembered.",
  "Right on the Sherwood Park line.",
  "Parked, it still",
  "Before the first cut,",
  "Finished paint under honest light.",
  "Put the car in the review.",
]) {
  assert.ok(source.includes(proof), `replacement selling line missing: ${proof}`);
}

console.log("home copy contract: PASS");
