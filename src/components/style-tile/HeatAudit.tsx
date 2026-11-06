"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Heat audit: proves "colour is temperature" on the live page. Every element painted in Billet
 * Glow is found from its computed style (or a data-heat tag for rendered heat such as the billet),
 * outlined with its reason, and the Glow share of the viewport is measured every 80 ms.
 * Budgets: 2 % for interface heat, 12 % for a process scene (the billet, the cooling band).
 */

/** The token, as the rgb() string computed styles report (read from CSS, never typed here). */
function glowRgb() {
  const hex = getComputedStyle(document.documentElement).getPropertyValue("--color-glow").trim();
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

type Hit = { x: number; y: number; w: number; h: number; reason: string };

function reasonFor(el: Element, cs: CSSStyleDeclaration, GLOW: string): string | null {
  const tag = el.getAttribute("data-heat");
  if (tag) {
    const t = el.getAttribute("data-heat-temp");
    return `${tag}${t ? ` · ${t} °C` : ""}`;
  }
  if (cs.backgroundColor === GLOW) {
    if (el.closest(".btn-primary")) return "cta";
    return "active";
  }
  if (cs.color === GLOW && (el.textContent ?? "").trim() && el.children.length === 0) return "reading";
  return null;
}

export function HeatAudit() {
  const [on, setOn] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [share, setShare] = useState({ ui: 0, process: 0 });
  const timer = useRef(0);

  const scan = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const GLOW = glowRgb();
    const out: Hit[] = [];
    let ui = 0;
    let proc = 0;
    // everything on the page: content, chrome, the badge and the toast stack
    const els = document.querySelectorAll("body *");
    for (const el of els) {
      // never count the audit's own overlay
      if (el.closest(".heat-audit-layer, .heat-audit-meter")) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
      // invisible paint is not heat: hidden, or inside a faded-out layer (the grid overlay at rest)
      if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
      const cs = getComputedStyle(el);
      const reason = reasonFor(el, cs, GLOW);
      if (!reason) continue;
      const x = Math.max(0, r.left);
      const y = Math.max(0, r.top);
      const w = Math.min(vw, r.right) - x;
      const hh = Math.min(vh, r.bottom) - y;
      if (w <= 0 || hh <= 0) continue;
      // text readings count their glyph box at ~50 % ink; round faces (the billet) count as circles
      const round = cs.borderRadius === "50%" || cs.borderTopLeftRadius === "50%";
      const area = w * hh * (reason === "reading" ? 0.5 : round ? Math.PI / 4 : 1);
      if (reason.startsWith("process")) proc += area;
      else ui += area;
      out.push({ x, y, w, h: hh, reason });
    }
    setHits(out);
    setShare({ ui: (ui / (vw * vh)) * 100, process: (proc / (vw * vh)) * 100 });
  }, []);

  useEffect(() => {
    if (!on) return;
    const tick = () => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(scan, 80);
    };
    scan();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    document.addEventListener("click", tick, true);
    return () => {
      window.clearTimeout(timer.current);
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      document.removeEventListener("click", tick, true);
    };
  }, [on, scan]);

  return (
    <>
      <button type="button" className="chip" aria-pressed={on} onClick={() => setOn((v) => !v)} title="Outline every use of Billet Glow and measure its share of the view">
        <span className="chip-dot" aria-hidden="true" />
        <span>Heat audit</span>
      </button>
      {on ? (
        <div className="heat-audit-layer" aria-hidden="true">
          {hits.map((h, i) => (
            <span key={i} className="heat-audit-box" style={{ left: h.x, top: h.y, width: h.w, height: h.h }}>
              <span className="heat-audit-tag">{h.reason}</span>
            </span>
          ))}
        </div>
      ) : null}
      {on ? (
        <div className="heat-audit-meter t-data" role="status" aria-live="polite">
          <span>
            Glow in view · interface <bdi dir="ltr">{share.ui.toFixed(1)} %</bdi> / 2 %
          </span>
          <span className={share.ui > 2 ? "heat-audit-over" : "text-fg-muted"}>{share.ui > 2 ? "over budget" : "within budget"}</span>
          <span>
            process <bdi dir="ltr">{share.process.toFixed(1)} %</bdi> / 12 %
          </span>
        </div>
      ) : null}
    </>
  );
}
