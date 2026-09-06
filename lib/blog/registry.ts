import type { Article, ArticleModule } from "./types";

/**
 * THE SHOP JOURNAL — article registry.
 *
 * TO ADD AN ARTICLE (the whole procedure):
 *   1. Drop `lib/blog/articles/<slug>.tsx` exporting { meta, Body, Illustration }
 *      (see lib/blog/types.ts for the full authoring contract).
 *   2. Add ONE namespace import below.
 *   3. Add the module ONCE to the `modules` array, in editorial order.
 *
 * Everything else — static params, sitemap entries, index rows, prev/next
 * navigation, JSON-LD — derives from this array. Order = display order on
 * /blog: index 0 is the featured article, the rest run as numbered rows.
 */

import * as whatIsARestomod from "./articles/what-is-a-restomod";
import * as roadToRadium from "./articles/road-to-radium-show-and-shine";
import * as lsSwapCost from "./articles/ls-swap-cost-canada";
import * as exhaustNoiseLaws from "./articles/alberta-exhaust-noise-laws";
import * as barnFindFirstSteps from "./articles/barn-find-first-steps";
import * as c10SquareBody from "./articles/c10-square-body-alberta-guide";
import * as restorationTimeline from "./articles/classic-car-restoration-timeline";
import * as engineRebuildCost from "./articles/engine-rebuild-cost-canada";
import * as carbRebuildSigns from "./articles/carburetor-rebuild-signs";
import * as oopInspection from "./articles/out-of-province-inspection-edmonton";
import * as restorationCost from "./articles/classic-car-restoration-cost-canada";
import * as rustRepairCost from "./articles/rust-repair-cost-canada";
import * as paintJobCost from "./articles/classic-car-paint-job-cost-canada";
import * as frameOffVsRolling from "./articles/frame-off-vs-rolling-restoration";
import * as patinaKeepOrPaint from "./articles/patina-keep-it-or-paint-it";
import * as metalFabNoRepro from "./articles/metal-fabrication-no-repro-panels";
import * as strippingPaint from "./articles/stripping-paint-classic-car";
import * as winterStorage from "./articles/classic-car-winter-storage-alberta";
import * as springStartup from "./articles/classic-car-spring-startup-checklist";
import * as blockHeaters from "./articles/do-classics-need-block-heaters";
import * as dailyDriveClassic from "./articles/daily-driving-a-classic-in-alberta";
import * as hailClassics from "./articles/hail-and-classic-cars-alberta";
import * as collectorInsurance from "./articles/collector-car-insurance-alberta";
import * as antiquePlates from "./articles/antique-plates-alberta";
import * as salvageRebuilt from "./articles/salvage-rebuilt-status-alberta";
import * as registerNoTitle from "./articles/registering-classic-no-title-alberta";
import * as importFromUs from "./articles/importing-classic-car-from-us";
import * as buyingFirstClassic from "./articles/buying-your-first-classic-car";
import * as prePurchaseInspection from "./articles/classic-car-pre-purchase-inspection";
import * as appraisalAlberta from "./articles/classic-car-appraisal-alberta";
import * as sellingClassic from "./articles/selling-a-classic-car-canada";
import * as showAndShineSeason from "./articles/alberta-show-and-shine-season";
import * as discBrakeConversion from "./articles/disc-brake-conversion-cost-canada";
import * as overdriveSwap from "./articles/overdrive-transmission-swap-classic";
import * as electronicIgnition from "./articles/electronic-ignition-conversion-classics";
import * as ethanolFuel from "./articles/ethanol-fuel-classic-cars-canada";
import * as restomodWiring from "./articles/restomod-wiring-harness";
import * as interiorRestoration from "./articles/classic-interior-restoration-cost-canada";
import * as restoreOrSell from "./articles/restore-or-sell-classic-car";
import * as albertaRoadSalt from "./articles/alberta-road-salt-rust-prevention";

const modules: ArticleModule[] = [
  whatIsARestomod,
  restorationCost,
  rustRepairCost,
  paintJobCost,
  frameOffVsRolling,
  winterStorage,
  collectorInsurance,
  buyingFirstClassic,
  dailyDriveClassic,
  blockHeaters,
  hailClassics,
  springStartup,
  patinaKeepOrPaint,
  metalFabNoRepro,
  strippingPaint,
  antiquePlates,
  salvageRebuilt,
  registerNoTitle,
  importFromUs,
  prePurchaseInspection,
  appraisalAlberta,
  sellingClassic,
  showAndShineSeason,
  lsSwapCost,
  exhaustNoiseLaws,
  barnFindFirstSteps,
  c10SquareBody,
  restorationTimeline,
  engineRebuildCost,
  carbRebuildSigns,
  oopInspection,
  roadToRadium,
  discBrakeConversion,
  overdriveSwap,
  electronicIgnition,
  ethanolFuel,
  restomodWiring,
  interiorRestoration,
  restoreOrSell,
  albertaRoadSalt,
];

export const articles: Article[] = modules.map((m) => ({
  meta: m.meta,
  Body: m.Body,
  Illustration: m.Illustration,
}));

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.meta.slug === slug);
}

/** Prev/next in editorial order, for the article footer nav. */
export function adjacentArticles(slug: string): {
  prev: Article | undefined;
  next: Article | undefined;
} {
  const i = articles.findIndex((a) => a.meta.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: i > 0 ? articles[i - 1] : undefined,
    next: i < articles.length - 1 ? articles[i + 1] : undefined,
  };
}
