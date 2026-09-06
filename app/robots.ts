import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Metadata routes must declare staticness explicitly under `output: export`.
export const dynamic = "force-static";

/**
 * Crawler policy: allow everything on production, deliberately.
 *
 * Retrieval and training permissions are independent. OAI-SearchBot controls
 * automatic discovery for ChatGPT search; GPTBot controls training access.
 * Both remain allowed here as the existing policy, but training access is
 * not a requirement for search visibility or a guarantee of recommendations.
 * Google AI search features use the same Googlebot and indexing requirements
 * as ordinary Search; they do not require special AI files or schema.
 *
 * Hostinger preview is the exception. `HOSTINGER_PREVIEW=1` must be set on
 * the steelblue-gaur Hostinger build ONLY. That emits Googlebot Disallow: /
 * for the preview URL. Leave the env unset for any 2240speedshop.com build
 * so this block can never ship to production.
 *
 * The bots are enumerated rather than left to the wildcard so the intent is
 * explicit and auditable, and so a future disallow can be applied per-agent.
 */

const isHostingerPreview = process.env.HOSTINGER_PREVIEW === "1";

const searchEngines = ["Googlebot", "Googlebot-Image", "Bingbot", "Slurp", "DuckDuckBot", "Applebot"];

const aiRetrieval = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "Google-CloudVertexBot",
  "Bingbot-Chat",
];

const aiTraining = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  // Quote photo drops and the PHP handler must never be indexed.
  // Applies to every bot, including the preview wildcard.
  const privatePaths = ["/quote-uploads/", "/quote.php"];

  if (isHostingerPreview) {
    return {
      rules: [
        { userAgent: "Googlebot", disallow: "/" },
        { userAgent: "*", allow: "/", disallow: privatePaths },
      ],
    };
  }

  return {
    rules: [
      { userAgent: searchEngines, allow: "/", disallow: privatePaths },
      { userAgent: aiRetrieval, allow: "/", disallow: privatePaths },
      { userAgent: aiTraining, allow: "/", disallow: privatePaths },
      { userAgent: "*", allow: "/", disallow: privatePaths },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
