import { articles } from "@/lib/blog/registry";
import { createJournalFeeds } from "@/lib/feeds";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const feeds = createJournalFeeds(articles.map((article) => article.meta), site);
  return new Response(feeds.rss, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
