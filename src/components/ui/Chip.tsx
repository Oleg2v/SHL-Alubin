"use client";

import { useState, type ComponentPropsWithoutRef } from "react";
import { Close } from "@/components/icons/Icons";

type ToggleChipProps = {
  label: string;
  count?: number;
  /** Spoken after the count, e.g. "profiles". */
  countLabel?: string;
  defaultPressed?: boolean;
  pressed?: boolean;
  onPressedChange?: (v: boolean) => void;
} & Omit<ComponentPropsWithoutRef<"button">, "onChange">;

/**
 * Filter chip: a toggle button (aria-pressed). The count is part of the accessible name so a
 * screen reader hears "6063, 42 profiles, toggle button, pressed". A zero count disables the
 * chip and says why instead of hiding the option.
 */
export function ToggleChip({ label, count, countLabel = "profiles", defaultPressed = false, pressed, onPressedChange, disabled, ...rest }: ToggleChipProps) {
  const [inner, setInner] = useState(defaultPressed);
  const on = pressed ?? inner;
  const empty = count === 0;
  return (
    <button
      type="button"
      className="chip"
      aria-pressed={on}
      aria-disabled={disabled || empty || undefined}
      onClick={() => {
        if (disabled || empty) return;
        const v = !on;
        setInner(v);
        onPressedChange?.(v);
      }}
      {...rest}
    >
      <span className="chip-dot" aria-hidden="true" />
      <span>{label}</span>
      {typeof count === "number" ? (
        <span className="chip-count">
          <span className="sr-only">, </span>
          <bdi dir="ltr">{count}</bdi>
          <span className="sr-only"> {countLabel}</span>
        </span>
      ) : null}
    </button>
  );
}

/** Applied-filter chip with a remove button (its own focus stop with a full label). */
export function RemovableChip({ label, onRemove, removeLabel }: { label: string; onRemove?: () => void; removeLabel?: string }) {
  return (
    <span className="chip" data-selected="true" style={{ cursor: "default" }}>
      <span className="chip-dot" aria-hidden="true" />
      <span>{label}</span>
      <button type="button" className="chip-remove" aria-label={removeLabel ?? `Remove filter ${label}`} onClick={onRemove}>
        <Close width={12} height={12} />
      </button>
    </span>
  );
}
