"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Alert, Check, Close } from "@/components/icons/Icons";
import { durations } from "@/design/tokens";

export type ToastTone = "success" | "error" | "info";
export type ToastInput = {
  title: string;
  meta?: string;
  /** Meta is measured data (IDs, lengths, tonnes): set in Geist Mono. */
  metaIsData?: boolean;
  tone?: ToastTone;
  action?: { label: string; onAction: () => void };
  /** ms; 0 keeps it until dismissed. Errors default to 0. */
  life?: number;
};
type ToastItem = ToastInput & { id: number; leaving?: boolean };

type Ctx = { push: (t: ToastInput) => number; dismiss: (id: number) => void };
const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const LEAVE_MS = durations.base;
const MAX_VISIBLE = 3;

/** Toasts that never time out: errors and anything carrying an action (Undo, Retry). */
const persistent = (t: ToastInput) => t.tone === "error" || !!t.action || t.life === 0;

/**
 * Toasts live in one polite live region (role="status"); errors are announced assertively.
 * Timers pause while the toast is hovered or focused, and error toasts never auto-dismiss.
 */
export function ToastProvider({
  children,
  closeLabel = "Dismiss notification",
  regionLabel = "Notifications",
  lang,
  dir,
}: {
  children: ReactNode;
  closeLabel?: string;
  regionLabel?: string;
  /** Language and direction of the toasts' text (they render outside the content's own container). */
  lang?: string;
  dir?: "ltr" | "rtl";
}) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const region = useRef<HTMLDivElement>(null);
  const seq = useRef(0);

  // The region lives on <body>: a contained or transformed ancestor (content-visibility, a page
  // transition) would otherwise become its containing block and clip a "fixed" stack.
  useEffect(() => setHost(document.body), []);

  // Leaving toasts play their exit, then go: one clock per toast, whichever way it leaves.
  const exits = useRef(new Map<number, number>());
  useEffect(() => {
    for (const x of items) {
      if (!x.leaving || exits.current.has(x.id)) continue;
      const t = window.setTimeout(() => {
        exits.current.delete(x.id);
        setItems((xs) => xs.filter((y) => y.id !== x.id));
      }, LEAVE_MS);
      exits.current.set(x.id, t);
    }
  }, [items]);
  useEffect(() => {
    const timers = exits.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // The stack's height, for scroll padding: keyboard focus is never scrolled in behind a toast.
  useEffect(() => {
    const el = region.current;
    if (!el) return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => {
      const h = el.querySelector(".toast") ? el.getBoundingClientRect().height + 8 : 0;
      root.style.setProperty("--toast-h", `${Math.round(h)}px`);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--toast-h");
    };
  }, [host]);

  const dismiss = useCallback((id: number) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
  }, []);

  const push = useCallback((t: ToastInput) => {
    const id = ++seq.current;
    const same = (x: ToastItem) => !x.leaving && x.tone === t.tone && x.title === t.title && x.meta === t.meta;
    setItems((xs) => {
      // a repeat replaces its twin (announced again, timer restarted) instead of stacking up
      const next = [...xs.map((x) => (same(x) ? { ...x, leaving: true } : x)), { ...t, id }];
      // Never more than three on screen. Over the cap the oldest auto-dismissing toast goes first,
      // then the oldest superseded Undo or Retry; errors go last. No timer ever removes an action.
      const live = () => next.filter((x) => !x.leaving);
      while (live().length > MAX_VISIBLE) {
        const l = live();
        const victim = l.find((x) => !persistent(x)) ?? l.find((x) => x.tone !== "error") ?? l[0];
        if (!victim) break;
        next[next.indexOf(victim)] = { ...victim, leaving: true };
      }
      return next;
    });
    return id;
  }, []);

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  const stack = (errors: boolean) =>
    items
      .filter((t) => (t.tone === "error") === errors)
      .map((t) => <ToastView key={t.id} item={t} onDismiss={dismiss} closeLabel={closeLabel} />);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {host
        ? createPortal(
            <div ref={region} className="toast-region" role="region" aria-label={regionLabel} lang={lang} dir={dir}>
              <div role="status" aria-live="polite" aria-atomic="false" className="toast-stack">
                {stack(false)}
              </div>
              <div role="alert" aria-live="assertive" className="toast-stack">
                {stack(true)}
              </div>
            </div>,
            host,
          )
        : null}
    </ToastCtx.Provider>
  );
}

function ToastView({ item, onDismiss, closeLabel }: { item: ToastItem; onDismiss: (id: number) => void; closeLabel: string }) {
  // Errors and toasts that carry an action (Undo, Retry) stay until dismissed: a screen-reader user
  // in browse mode never moves focus into the toast, so a timer would take the action away (2.2.1).
  const life = item.life ?? (item.tone === "error" || item.action ? 0 : 6000);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!life || item.leaving) return;
    const el = ref.current;
    if (!el) return;
    // A JS clock (not the CSS bar), so reduced motion cannot shorten it. It pauses while the toast
    // is hovered or holds focus (WCAG 2.2.1), exactly when the CSS life bar pauses.
    let remaining = life;
    let started = performance.now();
    let timer = window.setTimeout(() => onDismiss(item.id), remaining);
    let hover = false;
    let focus = false;
    const set = (h: boolean, f: boolean) => {
      const was = hover || focus;
      hover = h;
      focus = f;
      const now = hover || focus;
      if (!was && now) {
        window.clearTimeout(timer);
        remaining -= performance.now() - started;
      } else if (was && !now) {
        started = performance.now();
        timer = window.setTimeout(() => onDismiss(item.id), Math.max(800, remaining));
      }
    };
    const enter = () => set(true, focus);
    const leave = () => set(false, focus);
    const fin = () => set(hover, true);
    const fout = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node | null)) set(hover, false);
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", fin);
    el.addEventListener("focusout", fout);
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", fin);
      el.removeEventListener("focusout", fout);
    };
  }, [item.id, item.leaving, life, onDismiss]);

  // Undo / Retry does its work, then the toast has served its purpose and leaves.
  const act = item.action;
  const live = act ? { ...item, action: { label: act.label, onAction: () => (act.onAction(), onDismiss(item.id)) } } : item;
  return <ToastCard ref={ref} item={live} life={life} onDismiss={() => onDismiss(item.id)} closeLabel={closeLabel} />;
}

type CardProps = {
  item: ToastInput & { leaving?: boolean };
  life: number;
  onDismiss?: () => void;
  closeLabel: string;
  /** Static specimen (style tile): no entrance, frozen life bar. */
  staticSpecimen?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

export function ToastCard({ item, life, onDismiss, closeLabel, staticSpecimen, ref }: CardProps) {
  const tone = item.tone ?? "success";
  return (
    <div
      ref={ref}
      className="toast"
      data-tone={tone}
      data-leaving={item.leaving ? "true" : undefined}
      data-static={staticSpecimen ? "true" : undefined}
      style={life ? ({ ["--toast-life" as string]: `${life}ms` } as React.CSSProperties) : undefined}
    >
      <span className="toast-glyph" aria-hidden="true">
        {tone === "error" ? <Alert width={14} height={14} /> : tone === "info" ? <Info /> : <Check width={14} height={14} />}
      </span>
      <div className="min-w-0">
        <p className="toast-title">{item.title}</p>
        {item.meta && item.metaIsData ? (
          // data: each value stays whole and isolated; the dot is held to the value before it
          <p className="toast-meta" data-data="true">
            {item.meta.split(" · ").map((part, i, all) => (
              <span key={i}>
                <bdi className="whitespace-nowrap">{part}</bdi>
                {i < all.length - 1 ? "\u00a0· " : ""}
              </span>
            ))}
          </p>
        ) : item.meta ? (
          // prose wraps like prose
          <p className="toast-meta">{item.meta}</p>
        ) : null}
      </div>
      <div className="toast-actions">
        {item.action ? (
          <button type="button" className="toast-action" onClick={item.action.onAction}>
            {item.action.label}
          </button>
        ) : null}
        <button type="button" className="toast-close" aria-label={closeLabel} onClick={onDismiss}>
          <Close width={14} height={14} />
        </button>
      </div>
      {life ? <span className="toast-life" aria-hidden="true" /> : null}
    </div>
  );
}

/** Info: a reading, not an alarm. */
function Info() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden="true">
      <path d="M8 7v5M8 4.25v.5" />
    </svg>
  );
}
