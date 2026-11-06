import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";
import { DemoBadge } from "@/components/demo/DemoBadge";

export const metadata: Metadata = {
  title: {
    default: "SHL-Alubin — concept by Kikkey",
    template: "%s — SHL-Alubin concept by Kikkey",
  },
  description:
    "Unsolicited concept for SHL-Alubin, Israel's largest aluminium extruder. Not the official SHL-Alubin website.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "strict-origin-when-cross-origin",
};

export const viewport: Viewport = {
  themeColor: "#0b0d0f",
  colorScheme: "light dark",
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>
        <a className="skip-link t-small" href="#main">
          Skip to content
        </a>
        {children}
        <DemoBadge />
      </body>
    </html>
  );
}
