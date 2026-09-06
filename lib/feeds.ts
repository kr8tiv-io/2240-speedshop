import type { ArticleMeta } from "./blog/types";

type FeedArticle = Pick<ArticleMeta, "slug" | "title" | "description" | "author" | "datePublished" | "dateModified">;
type FeedSite = { name: string; url: string };

function xml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]!);
}

function articleDate(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime())
      || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid journal feed date: ${value}`);
  }
  return date;
}

/** Preserve the former GoDaddy subscription URLs using published metadata only.
 * Dates come from articles, never from deployment time; excerpts are plain text.
 */
export function createJournalFeeds(articles: readonly FeedArticle[], site: FeedSite) {
  if (articles.length === 0) throw new Error("A journal feed needs a published article.");
  const home = new URL("/blog/", site.url).href;
  const title = `${site.name} — The Shop Journal`;
  const entries = articles.map((article) => ({
    ...article,
    url: new URL(`/blog/${encodeURIComponent(article.slug)}/`, site.url).href,
    published: articleDate(article.datePublished),
    modified: articleDate(article.dateModified),
  })).sort((a, b) => b.published.getTime() - a.published.getTime()
    || a.slug.localeCompare(b.slug, "en"));
  const updated = new Date(Math.max(...entries.map((entry) => entry.modified.getTime())));
  const feedUrl = (extension: string) => new URL(`/f.${extension}`, site.url).href;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${xml(title)}</title>
<link>${xml(home)}</link>
<description>${xml(title)}</description>
<language>en-ca</language>
<lastBuildDate>${updated.toUTCString()}</lastBuildDate>
<atom:link href="${xml(feedUrl("rss"))}" rel="self" type="application/rss+xml"/>
${entries.map((entry) => `<item>
<title>${xml(entry.title)}</title>
<link>${xml(entry.url)}</link>
<guid isPermaLink="true">${xml(entry.url)}</guid>
<description>${xml(entry.description)}</description>
<dc:creator>${xml(entry.author)}</dc:creator>
<pubDate>${entry.published.toUTCString()}</pubDate>
</item>`).join("\n")}
</channel>
</rss>
`;

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-CA">
<id>${xml(home)}</id>
<title>${xml(title)}</title>
<updated>${updated.toISOString()}</updated>
<link href="${xml(home)}" rel="alternate" type="text/html"/>
<link href="${xml(feedUrl("atom"))}" rel="self" type="application/atom+xml"/>
<author><name>${xml(site.name)}</name></author>
${entries.map((entry) => `<entry>
<id>${xml(entry.url)}</id>
<title type="text">${xml(entry.title)}</title>
<link href="${xml(entry.url)}" rel="alternate" type="text/html"/>
<published>${entry.published.toISOString()}</published>
<updated>${entry.modified.toISOString()}</updated>
<author><name>${xml(entry.author)}</name></author>
<summary type="text">${xml(entry.description)}</summary>
</entry>`).join("\n")}
</feed>
`;

  const json = JSON.stringify({
    version: "https://jsonfeed.org/version/1.1",
    title,
    home_page_url: home,
    feed_url: feedUrl("json"),
    language: "en-CA",
    authors: [{ name: site.name }],
    items: entries.map((entry) => ({
      id: entry.url,
      url: entry.url,
      title: entry.title,
      content_text: entry.description,
      date_published: entry.published.toISOString(),
      date_modified: entry.modified.toISOString(),
      authors: [{ name: entry.author }],
    })),
  });

  return { rss, atom, json };
}
