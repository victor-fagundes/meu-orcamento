'use client'
import { useEffect, useRef } from 'react';
import type { FormularioContainerProps } from '../base/contratos.ts';
import { prenderFoco } from './foco.ts';

/** No web, formulários e edições abrem em painel lateral de 460 px (DECISOES_identidade_visual.md, seção 6). */
export function FormularioContainer({ aberto, titulo, children, textoCancelar = 'Cancelar', textoSalvar, salvarDesabilitado = false, onCancelar, onSalvar, folhaNaEstreita = false, encaixado = false }: FormularioContainerProps) {
  const painel = useRef<HTMLElement | null>(null);
  const cancelarRef = useRef(onCancelar);
  cancelarRef.current = onCancelar;

  useEffect(() => {
    if (!aberto) return undefined;
    const elemento = painel.current;
    if (!elemento) return undefined;
    return prenderFoco(elemento, () => cancelarRef.current());
  }, [aberto]);

  if (!aberto) return null;

  const painelInterno = (
    <section
      ref={painel}
      role="dialog"
      aria-modal={encaixado ? undefined : true}
      aria-label={titulo}
      className={encaixado ? "mo-formulario mo-formulario--encaixado" : folhaNaEstreita ? "mo-formulario mo-formulario--folha" : "mo-formulario"}
      tabIndex={-1}
      onClick={(evento) => evento.stopPropagation()}
    >
      <h2 className="mo-dialogo__titulo">{titulo}</h2>
      {children}
      <div className="mo-formulario__acoes">
        <button type="button" className="mo-botao mo-botao--texto" onClick={onCancelar}>{textoCancelar}</button>
        <button type="button" className="mo-botao mo-botao--primario" onClick={onSalvar} disabled={salvarDesabilitado}>{textoSalvar}</button>
      </div>
    </section>
  );

  if (encaixado) return painelInterno;

  return (
    <div className={folhaNaEstreita ? "mo-formulario-fundo mo-formulario-fundo--folha" : "mo-formulario-fundo"} onClick={onCancelar}>
      {painelInterno}
    </div>
  );
}
