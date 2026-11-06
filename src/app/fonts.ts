import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

/**
 * IBM Plex Sans Hebrew, Hebrew subset only.
 * The unicode-range keeps it out of Latin text entirely: put it FIRST in a stack and the
 * browser uses it per glyph for Hebrew, while Latin falls through to Geist. It is only
 * downloaded when Hebrew characters are actually on the page.
 */
export const plexHebrew = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-hebrew-hebrew-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-sans-hebrew-hebrew-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ibm-plex-sans-hebrew-hebrew-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-hebrew",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "unicode-range", value: "U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F" },
  ],
});

export const fontVariables = [GeistSans.variable, GeistMono.variable, plexHebrew.variable].join(" ");
