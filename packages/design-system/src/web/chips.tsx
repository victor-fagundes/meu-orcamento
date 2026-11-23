'use client'
import type { ChipsProps } from '../base/contratos.ts';

export function Chips<T extends string>({ rotuloGrupo, opcoes, selecionado, onSelecionar }: ChipsProps<T>) {
  return (
    <div role="group" aria-label={rotuloGrupo} className="mo-chips">
      {opcoes.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          className="mo-chip"
          aria-pressed={opcao.valor === selecionado}
          onClick={() => onSelecionar(opcao.valor)}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  );
}
