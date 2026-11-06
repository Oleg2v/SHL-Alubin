"use client";

import Link from "next/link";
import { forwardRef, useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  /** Magnetic pull toward the pointer. Defaults to true for primary buttons. Desktop, fine pointers, motion allowed. */
  magnetic?: boolean;
  /** Trailing icon (pass an Icons.* element). */
  icon?: ReactNode;
  busy?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonProps = Common & Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & { href?: undefined };
type LinkProps = Common & Omit<ComponentPropsWithoutRef<typeof Link>, "children" | "className"> & { href: string };

/** Pull strength (fraction of pointer offset) and radius beyond the box, px. */
const PULL = 0.22;
const MAX = 8;
const REACH = 32;

function useMagnet(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    let raf = 0;
    let active = false;
    const reset = () => {
      if (!active) return;
      active = false;
      el.dataset.magnet = "rest";
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const inside = Math.abs(dx) < r.width / 2 + REACH && Math.abs(dy) < r.height / 2 + REACH;
        if (!inside || el.matches(":disabled,[aria-disabled='true']")) return reset();
        active = true;
        el.dataset.magnet = "active";
        const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));
        el.style.setProperty("--mx", `${clamp(dx * PULL).toFixed(2)}px`);
        el.style.setProperty("--my", `${clamp(dy * PULL).toFixed(2)}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
      document.removeEventListener("pointerleave", reset);
    };
  }, [enabled]);
  return ref;
}

export const Button = forwardRef<HTMLElement, ButtonProps | LinkProps>(function Button(props, forwarded) {
  const { variant = "primary", size = "md", magnetic, icon, busy, children, className, ...rest } = props;
  const magnet = useMagnet(magnetic ?? variant === "primary");
  const classes = cn("btn", `btn-${variant}`, size !== "md" && `btn-${size}`, className);
  const setRef = (node: HTMLElement | null) => {
    magnet.current = node;
    if (typeof forwarded === "function") forwarded(node);
    else if (forwarded) forwarded.current = node;
  };
  const inner = (
    <span className="btn-label">
      <span>{children}</span>
      {icon}
    </span>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as Omit<LinkProps, keyof Common>;
    return (
      <Link ref={setRef as (n: HTMLAnchorElement | null) => void} href={href} className={classes} {...linkRest}>
        {inner}
      </Link>
    );
  }
  const { type = "button", ...buttonRest } = rest as Omit<ButtonProps, keyof Common>;
  return (
    <button
      ref={setRef as (n: HTMLButtonElement | null) => void}
      type={type}
      className={classes}
      aria-busy={busy || undefined}
      {...buttonRest}
    >
      {inner}
    </button>
  );
});
