"use client";

import { useId, type CSSProperties, type ReactNode } from "react";

type BotaoLegado = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  style?: CSSProperties;
};

export function MdFilledButton({ children, onClick, disabled, type = "button", style }: BotaoLegado) {
  return (
    <button type={type} className="mo-botao mo-botao--primario" disabled={disabled} style={style} onClick={onClick}>
      {children}
    </button>
  );
}

export function MdOutlinedButton({ children, onClick, disabled, type = "button", style }: BotaoLegado) {
  return (
    <button type={type} className="mo-botao mo-botao--secundario" disabled={disabled} style={style} onClick={onClick}>
      {children}
    </button>
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
  onChange: (valor: string) => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="mo-select">
      <label className="mo-campo__rotulo" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="mo-select__entrada"
        value={value}
        disabled={disabled}
        onChange={(evento) => onChange(evento.target.value)}
      >
        {children}
      </select>
    </div>
  );
}

export function MdOption({ value, children }: { value: string; children: ReactNode }) {
  return <option value={value}>{children}</option>;
}
