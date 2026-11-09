import { chamberFrame, kgPerMetre } from "@/lib/geometry/profile";

/**
 * The demo's lead profile (an invented ID): a three-chamber window frame. Every specimen that quotes
 * its weight reads it from here, so the cards, the spec table, the type samples and the inputs agree.
 */
export const AL_40217 = { id: "AL-40217", alloy: "6063", temper: "T6", shape: chamberFrame(64, 46, 1.8, 3, 9) } as const;

/** kg/m from the section area at 2.70 g/cm³, to three decimals as the sheet prints it. */
export const AL_40217_KGM = kgPerMetre(AL_40217.shape).toFixed(3);
