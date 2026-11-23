'use client'
import type { SwitchProps } from '../base/contratos.ts';

export function Switch({ id, rotulo, marcado, onMudar, desabilitado = false }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      className="mo-switch"
      aria-checked={marcado}
      disabled={desabilitado}
      onClick={() => {
        if (!desabilitado) onMudar(!marcado);
      }}
    >
      {rotulo}
    </button>
  );
}
