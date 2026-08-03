import type { Metadata } from "next";
import { Bebas_Neue, Archivo, Barlow, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { businessSchema } from "@/lib/schema";

const bebas = Bebas_Neue({ variable: "--font-bebas", subsets: ["latin"], weight: "400", display: "swap" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" });
const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

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
      className={`${bebas.variable} ${archivo.variable} ${barlow.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bay-black text-bone">
        {/* AI crawlers do not execute JS (AI-SEO playbook §3), so the entity
            graph ships in the server-rendered HTML, never from the canvas. */}
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
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
