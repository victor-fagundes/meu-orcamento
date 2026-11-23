'use client'
import type { CampoBuscaProps } from '../base/contratos.ts';

export function CampoBusca({ id, rotulo, valor, onMudar, controlesId, rotuloLimpar = 'Limpar' }: CampoBuscaProps) {
  return (
    <div className="mo-campo">
      <label className="mo-campo__rotulo" htmlFor={id}>{rotulo}</label>
      <div className="mo-campo-busca__linha">
        <input
          id={id}
          type="search"
          className="mo-campo__entrada"
          value={valor}
          aria-controls={controlesId}
          onChange={(evento) => onMudar(evento.target.value)}
        />
        <button type="button" className="mo-campo-busca__limpar" onClick={() => onMudar('')}>
          {rotuloLimpar}
        </button>
      </div>
    </div>
  );
}
