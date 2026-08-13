/**
 * The real 2240 Speed Shop badge, redrawn as vector.
 *
 * Source of truth is the laser-cut corten-steel sign bolted to the shop at
 * 2009 91 Ave (public/shop/shop-storefront-sign.jpg): a circular plate with
 * SPEED SHOP arched over crossed wrenches, 2240 across a cut-out waistband
 * that runs out into two winged tabs with red stars, and CLASSICS AND CUSTOMS
 * arched below. `hole` is whatever shows through the cuts — the page colour in
 * the DOM, transparency when rasterised for the 3D shop.
 */
export function Badge({
  className,
  hole = "#fafaf8",
  title = "2240 Speed Shop — Classics and Customs",
}: {
  className?: string;
  hole?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 260 200"
      role={title ? "img" : "presentation"}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      <defs>
        {/* Ink plate on the white version — the laser-cut sign as a print mark.
            Gradient id kept so every reference below still resolves. */}
        <linearGradient id="badge-rust" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#2b2b29" />
          <stop offset="0.55" stopColor="#1d1d1b" />
          <stop offset="1" stopColor="#141414" />
        </linearGradient>
        <path id="badge-arc-top" d="M 62,92 A 70 70 0 0 1 198,92" fill="none" />
        <path id="badge-arc-bottom" d="M 60,128 A 74 74 0 0 0 200,128" fill="none" />
      </defs>

      {/* Winged waistband tabs, outside the disc */}
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "translate(260,0) scale(-1,1)" : undefined}>
          <rect x="2" y="78" width="68" height="50" fill="url(#badge-rust)" />
          <rect x="8" y="86" width="52" height="2.4" fill={hole} opacity="0.85" />
          <rect x="8" y="117" width="52" height="2.4" fill={hole} opacity="0.85" />
          <path
            d="M 30,92 l 3.1,7 7.6,0.6 -5.8,5 1.8,7.4 -6.7,-4 -6.7,4 1.8,-7.4 -5.8,-5 7.6,-0.6 z"
            fill="#a02d2d"
          />
        </g>
      ))}

      {/* The disc: thin keyline ring, then the plate */}
      <circle cx="130" cy="100" r="86" fill="none" stroke="url(#badge-rust)" strokeWidth="2.5" />
      <circle cx="130" cy="100" r="80" fill="url(#badge-rust)" />

      {/* Rivets */}
      {[[130, 26], [130, 174], [58, 52], [202, 52], [58, 148], [202, 148]].map(([x, y]) => (
        <circle key={`${x}:${y}`} cx={x} cy={y} r="2.2" fill={hole} opacity="0.8" />
      ))}

      {/* Arched cut-out lettering */}
      <text
        fontFamily="var(--font-display, 'Bebas Neue', 'Arial Narrow', sans-serif)"
        fontSize="27"
        letterSpacing="4"
        fill={hole}
      >
        <textPath href="#badge-arc-top" startOffset="50%" textAnchor="middle">
          SPEED SHOP
        </textPath>
      </text>
      <text
        fontFamily="var(--font-display, 'Bebas Neue', 'Arial Narrow', sans-serif)"
        fontSize="15"
        letterSpacing="2.2"
        fill={hole}
      >
        <textPath href="#badge-arc-bottom" startOffset="50%" textAnchor="middle">
          CLASSICS AND CUSTOMS
        </textPath>
      </text>

      {/* Waistband cut across the disc, then the smile crescent under it */}
      <rect x="52" y="82" width="156" height="42" fill={hole} />
      <path d="M 88,131 A 52 52 0 0 0 172,131 A 60 60 0 0 1 88,131 Z" fill={hole} />

      {/* Crossed wrenches, cut free of the plate by a hole-coloured halo */}
      {[-35, 35].map((angle) => (
        <g key={`halo-${angle}`} transform={`translate(130,64) rotate(${angle})`}>
          <line x1="0" y1="-15" x2="0" y2="13" stroke={hole} strokeWidth="10.4" strokeLinecap="round" />
          <circle cy="-19" r="6.4" stroke={hole} strokeWidth="8.6" fill="none" />
        </g>
      ))}
      {[-35, 35].map((angle) => (
        <g key={`wrench-${angle}`} transform={`translate(130,64) rotate(${angle})`}>
          <line x1="0" y1="-15" x2="0" y2="13" stroke="url(#badge-rust)" strokeWidth="5.8" strokeLinecap="round" />
          <circle cy="-19" r="6.4" stroke="url(#badge-rust)" strokeWidth="4.4" fill="none" />
          <rect x="-3.1" y="-29.4" width="6.2" height="7.6" fill={hole} />
        </g>
      ))}

      <text
        x="130"
        y="126"
        textAnchor="middle"
        fontFamily="var(--font-display, 'Bebas Neue', 'Arial Narrow', sans-serif)"
        fontSize="64"
        letterSpacing="7"
        fill="url(#badge-rust)"
      >
        2240
      </text>
    </svg>
  );
}

export default Badge;
