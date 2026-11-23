'use client'
import type { SelectProps } from '../base/contratos.ts';

export function Select({ id, rotulo, valor, grupos, onMudar, placeholder = 'Escolha', erro, desabilitado = false }: SelectProps) {
  const idErro = `${id}-erro`;
  const temErro = erro !== undefined && erro !== '';
  return (
    <div className="mo-select">
      <label className="mo-campo__rotulo" htmlFor={id}>{rotulo}</label>
      <select
        id={id}
        className="mo-select__entrada"
        value={valor ?? ''}
        disabled={desabilitado}
        aria-invalid={temErro ? 'true' : undefined}
        aria-describedby={temErro ? idErro : undefined}
        onChange={(evento) => onMudar(evento.target.value)}
      >
        {valor === null ? <option value="" disabled>{placeholder}</option> : null}
        {grupos.map((grupo) => (
          <optgroup key={grupo.rotulo} label={grupo.rotulo}>
            {grupo.opcoes.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>
            ))}
          </optgroup>
        ))}
      </select>
      {temErro ? <span id={idErro} className="mo-campo__erro">{erro}</span> : null}
    </div>
  );
}
