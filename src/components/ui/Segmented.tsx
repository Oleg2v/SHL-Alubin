"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";

type Option<T extends string> = { value: T; label: ReactNode; /** spoken suffix, e.g. the language's own name */ note?: ReactNode; lang?: string };

/**
 * Single choice: a radiogroup with a roving tabindex. Tab enters on the checked option, arrow keys
 * move and select (mirrored in RTL by the browser's own arrow semantics we map below), Home/End jump.
 * Used for the language switch, the finish picker, and later the Finder's sort and unit switches.
 */
export function Segmented<T extends string>({
  label,
  labelledBy,
  options,
  value,
  onChange,
  className = "segmented",
  optionClassName,
  renderOption,
}: {
  label?: string;
  labelledBy?: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  optionClassName?: string;
  /** Custom option body (the finish coupons); defaults to the label. */
  renderOption?: (o: Option<T>, checked: boolean) => ReactNode;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = options.findIndex((o) => o.value === value);

  const move = (to: number) => {
    const n = (to + options.length) % options.length;
    const o = options[n];
    if (!o) return;
    onChange(o.value);
    refs.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const next = rtl ? "ArrowLeft" : "ArrowRight";
    const prev = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === next || e.key === "ArrowDown") move(idx + 1);
    else if (e.key === prev || e.key === "ArrowUp") move(idx - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(options.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div role="radiogroup" aria-label={label} aria-labelledby={labelledBy} className={className} onKeyDown={onKey}>
      {options.map((o, i) => {
        const checked = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            className={optionClassName}
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(o.value)}
          >
            {renderOption ? (
              renderOption(o, checked)
            ) : (
              <>
                <span>{o.label}</span>
                {o.note ? (
                  <span className="sr-only" lang={o.lang}>
                    , {o.note}
                  </span>
                ) : null}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
