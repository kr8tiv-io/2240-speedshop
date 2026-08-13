import type { Metadata } from "next";
import { Anton, Archivo, Bodoni_Moda, IBM_Plex_Mono } from "next/font/google";
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
  weight: ["500", "600"],
  display: "swap",
});
/* The couture signature from v1 — used ONLY for single italic accent words
   inside Anton headlines and the reviews quotation mark. Never body text. */
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["italic"],
  weight: "variable",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-CA"
      className={`${anton.variable} ${archivo.variable} ${plexMono.variable} ${bodoni.variable} h-full`}
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
          {/* Clearance for the fixed nav; the homepage film pulls itself back
              up with a negative margin so the canvas stays full-bleed. */}
          <main id="main" className="relative flex-1 pt-[76px]">
            {children}
          </main>
          <Footer />
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
