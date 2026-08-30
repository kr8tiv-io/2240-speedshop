import type { Metadata, Viewport } from "next";
import { Anton, Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/fx/Cursor";
import { GLImagesLayer } from "@/components/gl/GLImagesLayer";
import { businessSchema } from "@/lib/schema";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
/* The couture signature: one italic word inside select Anton headlines, set
   in tungsten. Instrument Serif has a sharper, contemporary editorial hand
   than the former Didone and needs only one compact italic face. It never
   carries body text. See .accent-serif for its optical alignment with Anton. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: "italic",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "2240 Speed Shop — Classic Car Restoration & Custom Builds in Edmonton",
    template: "%s | 2240 Speed Shop",
  },
  description:
    "Terry Harmider's customs-and-classics shop on the Sherwood Park line. Full restorations, restomods, hot rods, LS and diesel conversions, body, paint and classic interiors in Edmonton, Alberta.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: site.name,
    title: "2240 Speed Shop — Customs and Classics, Built in Edmonton",
    description:
      "Full restorations, restomods and engine swaps from a working shop on the Sherwood Park line.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070708",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-CA"
      className={`${anton.variable} ${archivo.variable} ${plexMono.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bay-black text-bone">
        {/* AI crawlers do not execute JS, so the entity graph ships in the
            server-rendered HTML. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:bg-panel focus:px-4 focus:py-2 focus:text-bone"
        >
          Skip to content
        </a>

        <SmoothScroll>
          <Nav />
          <div id="site-shell" className="contents">
            {/* Clearance for the fixed nav; the homepage film pulls itself back
                up with a negative margin so the canvas stays full-bleed. */}
            <main id="main" className="relative flex-1 pt-[76px]">
              {children}
            </main>
            <Footer />
          </div>
        </SmoothScroll>

        {/* ONE shared WebGL canvas for the whole site: DOM-synced image
            planes with flowmap distortion. Desktop-only; the opacity-0 DOM
            imgs beneath are the fallback everywhere else. */}
        <GLImagesLayer />

        {/* The film over everything: grain unifies DOM and canvas; the iris
            keeps the corners dark. Pure CSS, aria-hidden, zero layout. */}
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <Cursor />
      </body>
    </html>
  );
}
