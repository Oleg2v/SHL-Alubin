"use client";

import { useEffect, useState } from "react";
import { HeatAudit } from "./HeatAudit";

export const SECTIONS = [
  { id: "concept", n: "00", label: "Concept" },
  { id: "palette", n: "01", label: "Palette" },
  { id: "type", n: "02", label: "Type" },
  { id: "space", n: "03", label: "Space" },
  { id: "form", n: "04", label: "Form" },
  { id: "motion", n: "05", label: "Motion" },
  { id: "components", n: "06", label: "Components" },
  { id: "motif", n: "07", label: "Motif" },
  { id: "decisions", n: "08", label: "Decisions" },
] as const;

/** Placeholder wordmark: the client's real logo replaces it inside the demo only. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      <svg className="wordmark-mark" viewBox="0 0 18 18" aria-hidden="true">
        {/* a T-slot section: the mark is a profile */}
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M0 0h7v3h4V0h7v7h-3v4h3v7h-7v-3H7v3H0v-7h3V7H0zM6 6v6h6V6z"
        />
      </svg>
      <span>SHL-ALUBIN</span>
    </span>
  );
}

export function TopBar() {
  const [grid, setGrid] = useState(false);
  const [current, setCurrent] = useState<string>("concept");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      // Alt+Shift+G: never a bare character key (WCAG 2.1.4); e.code survives keyboard layouts
      if (e.code === "KeyG" && e.altKey && e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setGrid((g) => !g);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setCurrent(vis[0].target.id);
      },
      { rootMargin: "-56px 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className="st-bar" data-surface="sheet">
        <div className="swiss-grid st-bar-row">
          <div className="col-span-3 sm:col-span-6 lg:col-span-2 flex items-center gap-4 min-w-0">
            <Wordmark />
            <span className="t-label text-fg-muted hidden sm:inline lg:hidden">Style tile · Sheet 00</span>
          </div>
          <nav aria-label="Style tile sections" className="st-nav hidden hd:flex col-span-8 items-center justify-between t-label">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} aria-current={current === s.id ? "true" : undefined}>
                <span className="st-nav-dot" aria-hidden="true" />
                <span className="text-fg-muted" aria-hidden="true">
                  {s.n}
                </span>
                {s.label}
              </a>
            ))}
          </nav>
          <div className="col-span-1 sm:col-span-2 lg:col-span-10 hd:col-span-2 flex justify-end gap-2">
            <span className="hidden sm:inline-flex">
              <HeatAudit />
            </span>
            <button
              type="button"
              className="chip"
              aria-pressed={grid}
              onClick={() => setGrid((g) => !g)}
              aria-keyshortcuts="Alt+Shift+G"
              title="Toggle the 12-column grid (Alt+Shift+G)"
            >
              <span className="chip-dot" aria-hidden="true" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </header>
      <div className="grid-overlay" data-on={grid ? "true" : "false"} aria-hidden="true">
        <div className="grid-overlay-baseline" />
        <div className="swiss-grid">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="col">
              <span className="col-n">{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
