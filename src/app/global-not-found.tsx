import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";
import { DemoBadge } from "@/components/demo/DemoBadge";

export const metadata: Metadata = {
  title: "Not found — SHL-Alubin concept by Kikkey",
  description: "Unsolicited concept for SHL-Alubin by Kikkey. Not the official SHL-Alubin website.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "strict-origin-when-cross-origin",
};

export const viewport: Viewport = {
  themeColor: "#0b0d0f",
  colorScheme: "light dark",
};

/**
 * Every unknown URL. Its own document (the root layouts sit in route groups), with the same chrome as
 * the lab: language, skip link, the demo badge, and a way back.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>
        <a className="skip-link t-small" href="#main">
          Skip to content
        </a>
        <main id="main" data-surface="press" className="grid min-h-dvh content-center gap-8 px-(--margin)">
          <p className="t-label text-fg-muted">404 · SHL-Alubin concept</p>
          <h1 className="t-headline max-w-[14ch]">No sheet at this address.</h1>
          <p className="t-lead text-fg-muted max-w-[40ch]">Nothing in this concept&apos;s drawing register matches the link.</p>
          <p className="flex flex-wrap gap-x-8 gap-y-3">
            <Link className="t-lead" href="/style-tile/">
              Open the style tile
            </Link>
            <Link className="t-lead" href="/">
              Back to the cover
            </Link>
          </p>
        </main>
        <DemoBadge />
      </body>
    </html>
  );
}
