'use client'
import type { CampoProps } from '../base/contratos.ts';

const modoTeclado: Record<NonNullable<CampoProps['teclado']>, 'text' | 'decimal' | 'numeric'> = {
  texto: 'text',
  decimal: 'decimal',
  numerico: 'numeric',
};

const completarHtml: Record<NonNullable<CampoProps['completar']>, string> = {
  nome: 'name',
  email: 'email',
  'senha-atual': 'current-password',
  'senha-nova': 'new-password',
};

export function Campo({
  id,
  rotulo,
  valor,
  onMudar,
  erro,
  invalido = false,
  desabilitado = false,
  placeholder,
  teclado = 'texto',
  tipo = 'texto',
  completar,
}: CampoProps) {
  const idErro = `${id}-erro`;
  const temFrase = erro !== undefined && erro !== '';
  const marcado = invalido || temFrase;
  const inputMode = tipo === 'email' ? 'email' : tipo === 'senha' ? undefined : modoTeclado[teclado];
  return (
    <div className="mo-campo">
      <label className="mo-campo__rotulo" htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        name={id}
        className="mo-campo__entrada"
        type={tipo === 'senha' ? 'password' : tipo === 'email' ? 'email' : 'text'}
        value={valor}
        placeholder={placeholder}
        disabled={desabilitado}
        inputMode={inputMode}
        autoComplete={completar ? completarHtml[completar] : undefined}
        aria-invalid={marcado ? 'true' : undefined}
        aria-describedby={temFrase ? idErro : undefined}
        onChange={(evento) => onMudar(evento.target.value)}
      />
      {temFrase ? <span id={idErro} className="mo-campo__erro">{erro}</span> : null}
    </div>
  );
}
