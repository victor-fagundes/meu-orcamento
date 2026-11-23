'use client'
import type { CheckboxProps } from '../base/contratos.ts';

export function Checkbox({ id, rotulo, marcado, onMudar, desabilitado = false }: CheckboxProps) {
  return (
    <label className="mo-checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={marcado}
        disabled={desabilitado}
        onChange={(evento) => onMudar(evento.target.checked)}
      />
      <span>{rotulo}</span>
    </label>
  );
}
