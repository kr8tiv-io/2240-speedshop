import Image from "next/image";
import { site } from "@/lib/site";
import instagramPosts from "@/lib/instagram-posts.json";

type InstagramPost = {
  file: string;
  alt: string;
  kind: "p" | "reel";
  shortcode: string;
  subject: string;
  position: string;
};

/**
 * Static, crawlable post wall. Every thumbnail exists in /public/shop and each
 * shortcode resolves directly to the originating Instagram post. Keeping the
 * records local makes the section instant and deterministic without an API or
 * a client-side feed widget.
 */
const posts = instagramPosts as InstagramPost[];

type InstagramGridProps = {
  heading?: string;
  headingId?: string;
  intro?: string;
};

/** Server component. Ten distinct subjects, ten direct source-post links. */
export function InstagramGrid({
  heading = "From the shop floor",
  headingId = "instagram-heading",
  intro = "Work in progress, most weeks. Follow along, or come stand in it.",
}: InstagramGridProps) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id={headingId}
            className="font-display text-4xl uppercase leading-none tracking-wide text-bone sm:text-5xl"
          >
            {heading}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-steel">{intro}</p>
        </div>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sub text-[11px] uppercase tracking-[0.22em] text-steel transition-colors hover:text-neon-bloom"
        >
          @2240speedshop &rarr;
        </a>
      </div>

      <ul className="ig-wall mt-10 grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5">
        {posts.map((post) => {
          const href = `https://www.instagram.com/${post.kind}/${post.shortcode}/`;
          return (
            <li key={post.shortcode}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-card group relative block aspect-square overflow-hidden"
              >
                <Image
                  src={`/shop/${post.file}`}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  style={{ objectPosition: post.position }}
                  className="object-cover"
                />
                <span aria-hidden="true" className="ig-card-shade pointer-events-none absolute inset-0" />
                <span aria-hidden="true" className="ig-card-glow pointer-events-none absolute inset-0" />
                <span aria-hidden="true" className="ig-card-meta pointer-events-none absolute inset-x-0 bottom-0">
                  {post.kind === "reel" ? "VIEW REEL" : "VIEW POST"} <span>↗</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
