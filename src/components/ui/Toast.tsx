"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Alert, Check, Close } from "@/components/icons/Icons";

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

const LEAVE_MS = 240; // --dur-base

/**
 * Toasts live in one polite live region (role="status"); errors are announced assertively.
 * Timers pause while the toast is hovered or focused, and error toasts never auto-dismiss.
 */
export function ToastProvider({
  children,
  closeLabel = "Dismiss notification",
  lang,
  dir,
}: {
  children: ReactNode;
  closeLabel?: string;
  /** Language and direction of the toasts' text (they render outside the content's own container). */
  lang?: string;
  dir?: "ltr" | "rtl";
}) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), LEAVE_MS);
  }, []);

  const push = useCallback((t: ToastInput) => {
    const id = ++seq.current;
    setItems((xs) => [...xs.slice(-2), { ...t, id }]);
    return id;
  }, []);

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="toast-region" role="region" aria-label="Notifications">
        <div role="status" aria-live="polite" aria-atomic="false" className="toast-stack" lang={lang} dir={dir}>
          {items
            .filter((t) => t.tone !== "error")
            .map((t) => (
              <ToastView key={t.id} item={t} onDismiss={dismiss} closeLabel={closeLabel} />
            ))}
        </div>
        <div role="alert" aria-live="assertive" className="toast-stack" lang={lang} dir={dir}>
          {items
            .filter((t) => t.tone === "error")
            .map((t) => (
              <ToastView key={t.id} item={t} onDismiss={dismiss} closeLabel={closeLabel} />
            ))}
        </div>
      </div>
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

  return <ToastCard ref={ref} item={item} life={life} onDismiss={() => onDismiss(item.id)} closeLabel={closeLabel} />;
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
        {tone === "error" ? <Alert width={14} height={14} /> : <Check width={14} height={14} />}
      </span>
      <div className="min-w-0">
        <p className="toast-title">{item.title}</p>
        {item.meta ? (
          <p className="toast-meta" dir="auto" data-data={item.metaIsData ? "true" : undefined}>
            {item.meta}
          </p>
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
