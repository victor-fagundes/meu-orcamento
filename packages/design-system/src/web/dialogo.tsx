'use client'
import { useEffect, useRef } from 'react';
import type { DialogoProps } from '../base/contratos.ts';
import { prenderFoco } from './foco.ts';

export function Dialogo({ aberto, titulo, descricao, textoCancelar = 'Cancelar', textoConfirmar, tipoConfirmar, onCancelar, onConfirmar, children, confirmarDesabilitado = false }: DialogoProps) {
  const painel = useRef<HTMLDivElement | null>(null);
  const cancelarRef = useRef(onCancelar);
  cancelarRef.current = onCancelar;

  useEffect(() => {
    if (!aberto) return undefined;
    const elemento = painel.current;
    if (!elemento) return undefined;
    return prenderFoco(elemento, () => cancelarRef.current());
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="mo-dialogo-fundo" onClick={onCancelar}>
      <div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mo-dialogo-titulo"
        className="mo-dialogo"
        tabIndex={-1}
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2 id="mo-dialogo-titulo" className="mo-dialogo__titulo">{titulo}</h2>
        <p className="mo-dialogo__descricao">{descricao}</p>
        {children}
        <div className="mo-dialogo__acoes">
          <button type="button" className="mo-botao mo-botao--texto" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button type="button" className={`mo-botao mo-botao--${tipoConfirmar === 'destrutivo' ? 'destrutivo' : 'primario'}`} onClick={onConfirmar} disabled={confirmarDesabilitado}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
