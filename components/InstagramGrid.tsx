import Image from "next/image";
import { site } from "@/lib/site";

type Thumb = { file: string; alt: string };

/**
 * Static grid — every filename verified present in /public/shop.
 * No Instagram API at this stage: the tiles are real ripped thumbnails and
 * every tile links out to the shop's profile, so the section is 100% in the
 * server-rendered HTML that AI crawlers read.
 */
const thumbs: Thumb[] = [
  {
    file: "ig-2024-01-07_reel_C10w-QarnW8.jpg",
    alt: "2240 Speed Shop Instagram reel, January 2024 — customs and classics work in Edmonton",
  },
  {
    file: "ig-2024-01-31_photo_C2yORYaviUI.jpg",
    alt: "2240 Speed Shop Instagram post, January 2024 — classic car build in the Edmonton shop",
  },
  {
    file: "ig-2024-02-03_reel_C26EvF4JPya.jpg",
    alt: "2240 Speed Shop Instagram reel, February 2024 — custom car work in Edmonton, Alberta",
  },
  {
    file: "ig-2024-03-07_reel_C4PPpGzLyKp.jpg",
    alt: "2240 Speed Shop Instagram reel, March 2024 — classic restoration progress in Edmonton",
  },
  {
    file: "ig-2024-09-14_reel-a_C_7GCo4R_iK.jpg",
    alt: "2240 Speed Shop Instagram reel, September 2024 — hot rod and restomod work in Edmonton",
  },
  {
    file: "ig-2024-09-14_reel-b_C_7F1LIpggd.jpg",
    alt: "2240 Speed Shop Instagram reel, September 2024 — customs and classics shop floor, Edmonton",
  },
  {
    file: "ig-2024-12-23_reel-a_DD8j7EKJnZY.jpg",
    alt: "2240 Speed Shop Instagram reel, December 2024 — classic truck build in Edmonton, Alberta",
  },
  {
    file: "ig-2024-12-23_reel-b_DD8jkUPpfS6.jpg",
    alt: "2240 Speed Shop Instagram reel, December 2024 — custom car shop work in Edmonton",
  },
  {
    file: "ig-2024-12-23_reel-c_DD8e1tFp0Em.jpg",
    alt: "2240 Speed Shop Instagram reel, December 2024 — restoration progress on the Sherwood Park line",
  },
  {
    file: "ig-2024-12-24_reel_DD-OQFOy8Og.jpg",
    alt: "2240 Speed Shop Instagram reel, December 2024 — classics and customs in the Edmonton garage",
  },
  {
    file: "ig-2024-12-31_reel_DEQGInoPZmO.jpg",
    alt: "2240 Speed Shop Instagram reel, December 2024 — year-end look at the Edmonton speed shop",
  },
  {
    file: "ig-2025-09-09_natlaj-photo_DOZCypFjzTm.jpg",
    alt: "2240 Speed Shop Instagram post, September 2025 — photographed classic truck build, Edmonton",
  },
];

type InstagramGridProps = {
  heading?: string;
  headingId?: string;
  intro?: string;
};

/** Server component. Twelve real posts, one link target: the shop's profile. */
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

      {/* ONE PIECE OF WALL, NOT TWELVE FRAMED PICTURES.
          Every tile used to carry its own rusted border with a two-unit gap
          around it, which on a dark page reads as a dozen little black-framed
          squares floating in a grid — the exact "weird square frames" note.
          Butted edge to edge they read as one contact sheet pinned to the
          shop wall, and the feathered mask lets the bottom of it dissolve into
          the section below instead of stopping on a hard rectangle. */}
      <ul
        className="ig-sheet mt-10 grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 7%, #000 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 7%, #000 82%, transparent 100%)",
        }}
      >
        {thumbs.map((t) => (
          <li key={t.file}>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden"
            >
              <Image
                src={`/shop/${t.file}`}
                alt={t.alt}
                fill
                sizes="(min-width: 1024px) 12rem, (min-width: 640px) 33vw, 50vw"
                className="graded object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.04] group-hover:brightness-110"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
