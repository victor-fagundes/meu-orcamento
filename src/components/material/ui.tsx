"use client";

import type { CSSProperties, ReactNode } from "react";

type Btn = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
  style?: CSSProperties;
};

export function MdFilledButton({ children, onClick, disabled, type = "button", href, style }: Btn) {
  if (href) {
    return (
      <a className="btn" href={href} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button className="btn" type={type} disabled={disabled} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

export function MdOutlinedButton({ children, onClick, disabled, type = "button", href, style }: Btn) {
  if (href) {
    return (
      <a className="outline" href={href} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button className="outline" type={type} disabled={disabled} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

export function MdTextButton({ children, onClick, disabled, type = "button", href, style }: Btn) {
  if (href) {
    return (
      <a className="text-btn" href={href} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button className="text-btn" type={type} disabled={disabled} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

type FieldProps = {
  label: string;
  name?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  minLength?: number;
  inputMode?: "decimal" | "text" | "numeric";
};

export function MdTextField({
  label,
  name,
  type,
  value,
  defaultValue,
  onChange,
  required,
  disabled,
  autoComplete,
  minLength,
  inputMode,
}: FieldProps) {
  const filled = type === "date" || type === "time" || type === "month";
  return (
    <div className={filled ? "field filled" : "field"}>
      <input
        name={name}
        type={type}
        placeholder=" "
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        minLength={minLength}
        inputMode={inputMode}
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
      <label>{label}</label>
    </div>
  );
}

export function MdSelect({
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="field filled">
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
      <label>{label}</label>
    </div>
  );
}

export function MdOption({ value, children }: { value: string; children: ReactNode }) {
  return <option value={value}>{children}</option>;
}

export function MdFilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" className={selected ? "chip on" : "chip"} onClick={onClick} aria-pressed={!!selected}>
      {label}
    </button>
  );
}

export function MdProgress({ value, tone }: { value: number; tone: "ok" | "warn" | "over" }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const klass = tone === "over" ? "over" : tone === "warn" ? "warn" : "";
  return (
    <div
      className="track slim"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <i className={klass || undefined} style={{ width: `${pct}%` }} />
    </div>
  );
}
