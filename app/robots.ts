import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Crawler policy: allow everything, deliberately.
 *
 * Per the AI-SEO playbook, a local shop that wants to be *recommended* has no
 * reason to block AI crawlers. Retrieval agents (OAI-SearchBot, PerplexityBot,
 * Claude-SearchBot) are how the shop shows up in cited answers today; training
 * crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) are how the entity
 * exists inside tomorrow's models. Blocking either only removes the shop from
 * the answer.
 *
 * The bots are enumerated rather than left to the wildcard so the intent is
 * explicit and auditable, and so a future disallow can be applied per-agent.
 */

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
  return {
    rules: [
      { userAgent: searchEngines, allow: "/" },
      { userAgent: aiRetrieval, allow: "/" },
      { userAgent: aiTraining, allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
