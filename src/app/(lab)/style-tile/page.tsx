import type { Metadata } from "next";
import "./style-tile.css";
import { TopBar } from "@/components/style-tile/Chrome";
import { Cover, Concept } from "@/components/style-tile/Cover";
import { CoolingBand } from "@/components/style-tile/CoolingBand";
import { Palette } from "@/components/style-tile/Palette";
import { TypeSection } from "@/components/style-tile/TypeScale";
import { SpaceSection, FormSection } from "@/components/style-tile/SpaceForm";
import { MotionSection } from "@/components/style-tile/Motion";
import { ComponentsLab } from "@/components/style-tile/ComponentsLab";
import { MotifSection } from "@/components/style-tile/Motif";
import { DecisionsSection, TitleBlock } from "@/components/style-tile/Decisions";

export const metadata: Metadata = {
  title: "Style tile",
  description: "Stage 0 art direction for the SHL-Alubin concept: palette, type, space, form, motion, components and motif.",
};

export default function StyleTilePage() {
  return (
    <>
      <TopBar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Cover />
        <CoolingBand />
        <Concept />
        <Palette />
        <TypeSection />
        <SpaceSection />
        <FormSection />
        <MotionSection />
        <ComponentsLab />
        <MotifSection />
        <DecisionsSection />
      </main>
      <TitleBlock />
    </>
  );
}
