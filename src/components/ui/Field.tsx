"use client";

import { useId, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Alert } from "@/components/icons/Icons";

type FieldProps = {
  label: string;
  /** Right-aligned helper in the label row, e.g. "max 200". */
  aux?: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** Unit suffix rendered inside the control, e.g. "mm" or "kg/m". */
  unit?: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"input">, "className">;

/**
 * Text field. The label is always visible (no placeholder-as-label), hint and error are
 * wired with aria-describedby, and the error never relies on colour.
 */
export function TextField({ label, aux, hint, error, unit, className, id, disabled, ...input }: FieldProps) {
  const auto = useId();
  const inputId = id ?? `f${auto}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errId = error ? `${inputId}-err` : undefined;
  const unitId = unit ? `${inputId}-unit` : undefined;
  return (
    <div className={`field ${className ?? ""}`} data-invalid={error ? "true" : undefined} data-disabled={disabled ? "true" : undefined}>
      <label className="field-label" htmlFor={inputId}>
        <span>{label}</span>
        {aux ? (
          <span className="field-label-aux">
            <bdi dir="ltr">{aux}</bdi>
          </span>
        ) : null}
      </label>
      <div className="field-control">
        <input
          id={inputId}
          className="field-input"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={[unitId, errId, hintId].filter(Boolean).join(" ") || undefined}
          {...input}
        />
        {unit ? (
          <span id={unitId} className="field-unit">
            <bdi dir="ltr">{unit}</bdi>
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errId} className="field-error">
          <Alert />
          <span>{error}</span>
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type RangeProps = {
  label: string;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  unit?: string;
  format?: (v: number) => string;
  className?: string;
};

/** A single-thumb mm slider. Native range input: arrow keys, Page Up/Down, Home/End all work. */
export function RangeField({ label, min, max, step = 1, defaultValue, unit = "mm", format, className }: RangeProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const pct = ((value - min) / (max - min)) * 100;
  const shown = format ? format(value) : String(value);
  return (
    <div className={`field ${className ?? ""}`}>
      <label className="field-label" htmlFor={id}>
        <span>{label}</span>
        <output htmlFor={id} className="field-label-aux" aria-live="off">
          <bdi dir="ltr">
            {"≤"} {shown} {unit}
          </bdi>
        </output>
      </label>
      <div className="range-wrap">
        <input
          id={id}
          type="range"
          className="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={`${shown} ${unit}`}
          onChange={(e) => setValue(Number(e.currentTarget.value))}
          style={{ ["--range-pct" as string]: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between t-label text-fg-muted" aria-hidden="true">
        <bdi dir="ltr">{min}</bdi>
        <bdi dir="ltr">{max}</bdi>
      </div>
    </div>
  );
}
