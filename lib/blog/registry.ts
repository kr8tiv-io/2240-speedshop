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

const modules: ArticleModule[] = [
  whatIsARestomod,
  roadToRadium,
  lsSwapCost,
  exhaustNoiseLaws,
  barnFindFirstSteps,
  c10SquareBody,
  restorationTimeline,
  engineRebuildCost,
  carbRebuildSigns,
  oopInspection,
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
