import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Anton, Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { socialImage } from "@/lib/metadata";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/fx/Cursor";
import { GLImagesLayer } from "@/components/gl/GLImagesLayer";
import { businessSchema, websiteSchema } from "@/lib/schema";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

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
    default: "2240 Speed Shop — Classic Restoration, Edmonton AB",
    template: "%s | 2240 Speed Shop",
  },
  description:
    "Terry Harmider's customs-and-classics shop on the Sherwood Park line. Restorations, restomods, LS swaps, body, paint and interiors in Edmonton, Alberta.",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: site.name,
    url: "/",
    title: "2240 Speed Shop — Classic Restoration, Edmonton AB",
    description:
      "Terry Harmider's customs-and-classics shop on the Sherwood Park line. Restorations, restomods, LS swaps, body, paint and interiors in Edmonton, Alberta.",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "2240 Speed Shop — Classic Restoration, Edmonton AB",
    description:
      "Terry Harmider's customs-and-classics shop on the Sherwood Park line. Restorations, restomods, LS swaps, body, paint and interiors in Edmonton, Alberta.",
    images: [socialImage],
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
        {/* Publish both entities in server-rendered HTML so crawlers can read
            them without running the page scripts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        <Cursor />
      </body>
    </html>
  );
}
