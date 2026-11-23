'use client'
import type { CampoProps } from '../base/contratos.ts';

const modoTeclado: Record<NonNullable<CampoProps['teclado']>, 'text' | 'decimal' | 'numeric'> = {
  texto: 'text',
  decimal: 'decimal',
  numerico: 'numeric',
};

export function Campo({ id, rotulo, valor, onMudar, erro, desabilitado = false, placeholder, teclado = 'texto' }: CampoProps) {
  const idErro = `${id}-erro`;
  const temErro = erro !== undefined && erro !== '';
  return (
    <div className="mo-campo">
      <label className="mo-campo__rotulo" htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        className="mo-campo__entrada"
        value={valor}
        placeholder={placeholder}
        disabled={desabilitado}
        inputMode={modoTeclado[teclado]}
        aria-invalid={temErro ? 'true' : undefined}
        aria-describedby={temErro ? idErro : undefined}
        onChange={(evento) => onMudar(evento.target.value)}
      />
      {temErro ? <span id={idErro} className="mo-campo__erro">{erro}</span> : null}
    </div>
  );
}
