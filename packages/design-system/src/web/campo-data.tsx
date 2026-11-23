'use client'
import type { CampoDataProps } from '../base/contratos.ts';

export function CampoData({ id, rotulo, valor, onMudar, erro, desabilitado = false }: CampoDataProps) {
  const idErro = `${id}-erro`;
  const temErro = erro !== undefined && erro !== '';
  return (
    <div className="mo-campo">
      <label className="mo-campo__rotulo" htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        type="date"
        lang="pt-BR"
        className="mo-campo__entrada"
        value={valor}
        disabled={desabilitado}
        aria-invalid={temErro ? 'true' : undefined}
        aria-describedby={temErro ? idErro : undefined}
        onChange={(evento) => onMudar(evento.target.value)}
      />
      {temErro ? <span id={idErro} className="mo-campo__erro">{erro}</span> : null}
    </div>
  );
}
