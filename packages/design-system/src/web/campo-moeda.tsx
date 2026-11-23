'use client'
import { useState } from 'react';
import type { CampoMoedaProps } from '../base/contratos.ts';
import { textoDoCampoMoeda } from '../base/estado.ts';
import { lerBRL } from '../core/formatters.ts';

export function CampoMoeda({ id, rotulo, valor, onMudar, erro, desabilitado = false }: CampoMoedaProps) {
  const [texto, setTexto] = useState(() => textoDoCampoMoeda(valor));
  const idErro = `${id}-erro`;
  const temErro = erro !== undefined && erro !== '';
  return (
    <div className="mo-campo">
      <label className="mo-campo__rotulo" htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        className="mo-campo__entrada"
        inputMode="decimal"
        value={texto}
        disabled={desabilitado}
        aria-invalid={temErro ? 'true' : undefined}
        aria-describedby={temErro ? idErro : undefined}
        onChange={(evento) => {
          const proximo = evento.target.value;
          setTexto(proximo);
          onMudar(proximo.trim() === '' ? null : lerBRL(proximo));
        }}
      />
      {temErro ? <span id={idErro} className="mo-campo__erro">{erro}</span> : null}
    </div>
  );
}
